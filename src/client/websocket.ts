const SOCKET_URI = `ws://${window.location.hostname}:5000`;

export let ws: WebSocket | undefined;

export function setWebSocket(
  username: string,
  storedUserId: string | undefined,
  dispatch: React.Dispatch<Action>,
): void {
  let requestURI = `${SOCKET_URI}?username=${username}`;

  if (!!storedUserId) {
    requestURI += `&userId=${storedUserId}`;
  }
  ws = new WebSocket(encodeURI(requestURI));

  ws.onopen = () => {
    dispatch({
      type: "SET_CONNECTION",
      connection: "CONNECTED",
    });
  };

  ws.onclose = () => {
    dispatch({
      type: "RESET",
    });
  };

  ws.onerror = ws.onclose as any;

  ws.onmessage = socketMessage => {
    assignMessage(JSON.parse(socketMessage.data), dispatch);
  };
}

export function unsetWebSocket(): void {
  if (!!ws) {
    ws.close();
    ws = undefined;
  }
}

function assignMessage(
  response: MessageResponse,
  dispatch: React.Dispatch<Action>,
): void {
  const { data } = response;

  switch (response.type) {
    case "SEND":
      dispatch({
        type: "ADD_MESSAGE",
        message: data.message,
      });
      return;
    case "INITIATE":
      dispatch({
        type: "INITIATE",
        userId: data.userId,
        initialMessages: data.initialMessages,
      });
      return;
    case "DELETE":
      dispatch({
        type: "DELETE_MESSAGE",
        messageId: data.messageId,
      });
      return;
    case "EDIT":
      dispatch({
        type: "EDIT_MESSAGE",
        message: data.message,
      });
      return;
    case "LOAD_MORE":
      dispatch({
        type: "LOAD_MORE_MESSAGES",
        moreMessages: data.moreMessages,
      });
      return;
    default:
      return;
  }
}
