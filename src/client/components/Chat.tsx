import React, { useEffect } from "react";
import LinearProgress from "@material-ui/core/LinearProgress";
import { useStore } from "../store";
import MessageInput from "./Message/Input";
import MessageStream from "./Message/Stream";
import { ws, setWebSocket, unsetWebSocket } from "../websocket";

export default function Chat(): JSX.Element {
  const { state, dispatch } = useStore();

  useEffect(() => {
    if ((!ws || ws.readyState !== WebSocket.OPEN) && state.user.name) {
      setWebSocket(state.user.name, state.user.id, dispatch);
    }
    return () => {
      unsetWebSocket();
    };
  }, []);

  return state.connection === "CONNECTED" ? (
    <>
      <MessageStream />
      <MessageInput />
    </>
  ) : (
    <LinearProgress color="secondary" variant="indeterminate" />
  );
}
