import { first } from "lodash";
import React from "react";
import { useStore } from "../../store";
import MessageItem from "./Item";

import "../../scss/MessageGroups.scss";

const LOCALE = "nl-NL";

export default function Groups(): JSX.Element {
  const { state } = useStore();

  return (
    <ul id="message-list">
      {groupMessages(state.messages).map(group => {
        const { id: messageId, username, userId, dateCreated } = group[0];

        return (
          <li key={messageId}>
            <div
              className={[
                "message-group",
                isOwnMessage(userId, state.user.id!),
              ].join(" ")}
            >
              <div className="message-username">{username}</div>
              <div className="message-group-time">
                {getTimestamp(dateCreated)}
              </div>
              {group.map(message => (
                <MessageItem key={message.id} message={message} />
              ))}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function isOwnMessage(
  messageUserId: string,
  ownUserId: string,
): string | undefined {
  return messageUserId === ownUserId ? "own-message" : undefined;
}

function groupMessages(messages: Message[]): Message[][] {
  const groups: Message[][] = [];
  let currentGroup: Message[] = [];
  const firstMessage = first(messages);
  let currentUsername = !!firstMessage ? firstMessage.username : undefined;

  messages.forEach((message, i) => {
    if (currentUsername !== message.username) {
      if (currentGroup.length > 0) {
        groups.push([...currentGroup]);
        currentGroup = [];
      }
      currentUsername = message.username;
    }
    currentGroup.push(message);

    if (i === messages.length - 1) {
      groups.push([...currentGroup]);
    }
  });
  return groups;
}

function getTimestamp(date: Date): string {
  const now = new Date();
  const messageDate = new Date(date);
  let timestamp: string;

  const madeToday = now.toDateString() === messageDate.toDateString();

  timestamp = madeToday
    ? messageDate.toLocaleTimeString(LOCALE)
    : messageDate.toLocaleString(LOCALE);

  return timestamp.slice(0, -3);
}
