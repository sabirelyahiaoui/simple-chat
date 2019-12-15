import TextField from "@material-ui/core/TextField";
import React, { useRef } from "react";
import { useStore } from "../../store";
import { ws } from "../../websocket";

import "../../scss/MessageInput.scss";

const MIN_TEXT_LENGTH = 0;
const MAX_TEXT_LENGTH = 1000;

export default function Input(): JSX.Element {
  const { state } = useStore();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(event: React.FormEvent): void {
    event.preventDefault();

    if (inputRef.current === null) {
      return;
    }

    const text = inputRef.current.value;
    inputRef.current.value = "";

    if (text.length > MIN_TEXT_LENGTH || text.length < MAX_TEXT_LENGTH) {
      const request: MessageRequest = {
        type: "SEND",
        userId: state.user.id!,
        text,
      };
      if (!!ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(request));
      }
    }
  }

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} autoComplete="off">
        <TextField
          id="message-input"
          inputRef={inputRef}
          placeholder="Chat here :)"
          variant="outlined"
          autoFocus
          fullWidth
        />
      </form>
    </div>
  );
}
