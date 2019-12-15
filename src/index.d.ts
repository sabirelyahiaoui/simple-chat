type MessageType = "SEND" | "DELETE" | "EDIT" | "INITIATE" | "LOAD_MORE";

interface MessageRequest {
  type: MessageType;
  text?: string;
  userId: string;
  messageId?: string;
}

interface MessageResponse {
  type: MessageType;
  data: {
    message?: Message;
    messageId?: string;
    initialMessages?: Message[];
    userId?: string;
    moreMessages?: Message[];
  };
}

interface Message {
  id: string;
  text: string;
  userId: string;
  username: string;
  dateCreated: Date;
  edited: boolean;
}

interface State {
  messages: Message[];
  user: {
    name: string | undefined;
    id: string | undefined;
  };
  connection: ConnectionState;
}

interface Action {
  type: ActionType;
  username?: string;
  message?: Message;
  initialMessages?: Message[];
  userId?: string;
  connection?: ConnectionState;
  messageId?: string;
  moreMessages?: Message[];
}

type ActionType =
  | "RESET"
  | "SET_USERNAME"
  | "ADD_MESSAGE"
  | "SET_CONNECTION"
  | "EDIT_MESSAGE"
  | "DELETE_MESSAGE"
  | "INITIATE"
  | "LOAD_MORE_MESSAGES";

type ConnectionState = "CONNECTED" | "CONNECTING" | "DISCONNECTED";

interface DialogProps {
  open: boolean;
  closeDialog: () => void;
  message: Message;
}

declare module "react-linkify";
