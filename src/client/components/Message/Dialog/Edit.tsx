import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import React, { useState } from "react";
import { ws } from "../../../websocket";

export default function Edit(props: DialogProps): JSX.Element {
  const { open, closeDialog, message } = props;
  const [text, setText] = useState(message.text);

  function editMessage(): void {
    if (text === "") {
      return;
    }

    const request: MessageRequest = {
      type: "EDIT",
      messageId: message.id,
      userId: message.userId,
      text,
    };
    if (!!ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(request));
    }
    closeDialog();
  }

  function resetText(): void {
    setText(message.text);
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setText(event.target.value);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>): void {
    if (event.key === "Enter") {
      editMessage();
    }
  }

  return (
    <Dialog open={open} onClose={closeDialog} onExit={resetText} fullWidth>
      <DialogContent>
        <DialogTitle>Edit message</DialogTitle>
        <TextField
          autoFocus
          id="edit-text"
          label="Message"
          type="text"
          fullWidth
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={editMessage} color="primary">
          Edit Message
        </Button>
        <Button onClick={closeDialog} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
