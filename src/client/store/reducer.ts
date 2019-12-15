import getInitialState from "./initialState";

export default function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD_MESSAGE":
      return addMessage(state, action);

    case "SET_USERNAME":
      return setUsername(state, action);

    case "LOAD_MORE_MESSAGES":
      return loadMoreMessages(state, action);

    case "EDIT_MESSAGE":
      return editMessage(state, action);

    case "DELETE_MESSAGE":
      return deleteMessage(state, action);

    case "INITIATE":
      return initiate(state, action);

    case "SET_CONNECTION":
      return setConnection(state, action);

    case "RESET":
      return getInitialState();

    default:
      return state;
  }
}

function setUsername(state: State, action: Action): State {
  if (action.username) {
    return {
      ...state,
      user: {
        ...state.user,
        name: action.username,
      },
      connection: "CONNECTING",
    };
  } else {
    return state;
  }
}

function addMessage(state: State, action: Action): State {
  if (action.message) {
    return {
      ...state,
      messages: [...state.messages, action.message],
    };
  } else {
    return state;
  }
}

function editMessage(state: State, action: Action): State {
  if (action.message) {
    const newMessage = action.message;
    return {
      ...state,
      messages: state.messages.map(oldMessage =>
        oldMessage.id === newMessage.id ? newMessage : oldMessage,
      ),
    };
  } else {
    return state;
  }
}

function deleteMessage(state: State, action: Action): State {
  if (action.messageId) {
    return {
      ...state,
      messages: state.messages.filter(
        message => message.id !== action.messageId,
      ),
    };
  } else {
    return state;
  }
}

function initiate(state: State, action: Action): State {
  if (action.initialMessages && action.userId) {
    return {
      ...state,
      messages: action.initialMessages,
      connection: "CONNECTED",
      user: {
        ...state.user,
        id: action.userId,
      },
    };
  } else {
    return state;
  }
}

function setConnection(state: State, action: Action): State {
  if (action.connection) {
    return {
      ...state,
      connection: action.connection,
    };
  } else {
    return state;
  }
}

function loadMoreMessages(state: State, action: Action): State {
  if (action.moreMessages) {
    return {
      ...state,
      messages: [...action.moreMessages, ...state.messages],
    };
  } else {
    return state;
  }
}
