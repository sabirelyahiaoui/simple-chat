import { IncomingMessage } from "http";
import * as querystring from "querystring";
import { ParsedUrlQuery } from "querystring";
import * as shortid from "shortid";
import * as WebSocket from "ws";
import * as storage from "./storage";

const INITIAL_MESSAGE_AMOUNT = 50;
const MAX_MESSAGE_LENGTH = 1000;

// Map sockets to IDs for easy access/removal
const clients = new Map<string, WebSocket>();
// Usernames must be unique, use Set for ease of use;
const usernames = new Set<string>();

export function handleConnection(ws: WebSocket, req: IncomingMessage): void {
  let query: ParsedUrlQuery | undefined;
  if (!!req.url) {
    query = querystring.parse(req.url.substring(2));
  }

  // const userId = shortid.generate();
  const userId = parseUserId(query);
  const username = parseUsername(ws, query);
  if (!(username && userId)) {
    ws.close();
    return;
  }

  usernames.add(username);
  clients.set(userId, ws);
  sendInitialData(ws, userId);

  /** Removes all references to client */
  const closeHandler = removeClient(userId, username);

  ws.on("close", closeHandler);
  ws.on("error", closeHandler);

  ws.on("message", (requestData: string) => {
    const request = parseRequest(requestData, ws);
    if (request && username) {
      assignRequest(request, userId, username);
    }
  });
}

function parseUserId(query: ParsedUrlQuery | undefined): string | undefined {
  let userId: string | undefined;

  if (!!query) {
    userId = query.userId as string;
  }

  if (!!userId && shortid.isValid(userId) && !clients.has(userId)) {
    return userId;
  } else {
    return shortid.generate();
  }
}

/** Takes the raw http request and parses the username from it's url.
 *  Closes websocket and return "undefined" if invalid
 */
function parseUsername(
  ws: WebSocket,
  query: ParsedUrlQuery | undefined,
): string | undefined {
  let username: string | undefined;

  if (!!query) {
    username = query.username as string;
  }

  const errors = validateUsername(username);
  if (errors.length > 0) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ errors }));
      ws.close();
    }
    return undefined;
  } else {
    return username;
  }
}

/**Check input string to see if it's a valid username,
 * any errors will be returned as an array
 */
function validateUsername(username: string | undefined): string[] {
  const errors: string[] = [];

  if (!username || username === "") {
    errors.push("No username specified");
    return errors;
  }
  if (username.length < 3 || username.length > 20) {
    errors.push("username must be between 3 and 20 characters long");
  }

  if (usernames.has(username)) {
    errors.push("Username already taken");
  }
  return errors;
}

/** Sends the latest few messages and the given
 *  userId to client upon connection
 */
async function sendInitialData(ws: WebSocket, userId: string): Promise<void> {
  const initialMessages = await storage.getMany(INITIAL_MESSAGE_AMOUNT);
  if (ws.readyState === WebSocket.OPEN) {
    const response: MessageResponse = {
      type: "INITIATE",
      data: {
        userId,
        initialMessages,
      },
    };
    ws.send(JSON.stringify(response));
  }
}

/** Takes request as string and deserializes it to an object.
 * Closes websocket if the request is invalid
 */
function parseRequest(
  requestData: string,
  ws: WebSocket,
): MessageRequest | undefined {
  let request: MessageRequest | undefined;

  try {
    request = JSON.parse(requestData);
  } catch (err) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({
          errors: ["Invalid input, closing connection", ...err],
        }),
      );
      ws.close();
    }
  }
  return request;
}

/** Checks type of parsed request, applies correct method to it */
function assignRequest(
  request: MessageRequest,
  userId: string,
  username: string,
): void {
  switch (request.type) {
    case "SEND":
      sendMessage(request, userId, username);
      return;
    case "DELETE":
      deleteMessage(request);
      return;
    case "EDIT":
      editMessage(request, userId);
      return;
    case "LOAD_MORE":
      loadMoreMessages(request, userId);
      return;
    default:
      return;
  }
}

/**Takes a message request, validates it, stores it into the database,
 *  and sends it to all connected clients
 */
async function sendMessage(
  request: MessageRequest,
  userId: string,
  username: string,
): Promise<void> {
  const text = request.text;

  if (!isTextValid(text)) {
    return;
  }

  const message: Message = {
    dateCreated: new Date(),
    id: shortid.generate(),
    text: text!,
    userId,
    username,
    edited: false,
  };

  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(
        JSON.stringify({
          type: "SEND",
          data: { message },
        }),
      );
    }
  });
  await storage.store(message);
  return;
}

async function loadMoreMessages(
  request: MessageRequest,
  userId: string,
): Promise<void> {
  const { messageId } = request;
  let messages: Message[];

  if (messageId) {
    messages = await storage.getMore(messageId);
    const client = clients.get(userId);

    if (client && client.readyState === WebSocket.OPEN) {
      client.send(
        JSON.stringify({
          type: "LOAD_MORE",
          data: {
            moreMessages: messages,
          },
        } as MessageResponse),
      );
    }
  }
}

/**Checks whether requested message exists,
 * validates the new text, updates it in the database, then
 * sends an "edit" type instruction to all connected clients
 */
async function editMessage(
  request: MessageRequest,
  userId: string,
): Promise<void> {
  if (userId === request.userId && !!request.messageId) {
    if (!isTextValid(request.text)) {
      return;
    }

    const oldMessage = await storage.getById(request.messageId);
    if (!!oldMessage) {
      const newMessage: Message = {
        ...oldMessage,
        text: request.text!,
        edited: true,
      };
      clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(
            JSON.stringify({
              data: { message: newMessage },
              type: "EDIT",
            }),
          );
        }
      });
      storage.update(newMessage);
    }
  }
}

/** Checks whether requested message exists and deletes it if it does.
 *  Sends a "delete" type instruction to all connected clients
 */
async function deleteMessage(request: MessageRequest): Promise<void> {
  if (request.messageId) {
    const message = await storage.getById(request.messageId);
    if (!!message && message.id === request.messageId) {
      clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(
            JSON.stringify({
              type: "DELETE",
              data: { messageId: request.messageId },
            }),
          );
        }
      });
      storage.remove(message.id);
    }
  }
}

/** Returns true if text for requested message complies to rules */
function isTextValid(text: string | undefined): boolean {
  return (
    text !== undefined && text.length !== 0 && text.length < MAX_MESSAGE_LENGTH
  );
}

function removeClient(userId: string, username: string): () => void {
  return () => {
    clients.delete(userId);
    usernames.delete(username);
  };
}
