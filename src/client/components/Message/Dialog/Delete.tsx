import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import React from "react";
import { ws } from "../../../websocket";

export default function Delete(props: DialogProps): JSX.Element {
  const { open, closeDialog, message } = props;

  function deleteMessage(): void {
    const request: MessageRequest = {
      type: "DELETE",
      messageId: message.id,
      userId: message.userId,
    };
    if (!!ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(request));
    }
    closeDialog();
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>): void {
    if (event.key === "Enter") {
      deleteMessage();
    }
  }

  return (
    <Dialog open={open} onClose={closeDialog} onKeyDown={handleKeyDown}>
      <DialogContent>
        <DialogTitle>Delete message</DialogTitle>
        <DialogContentText>
          Are you sure you want to delete this message?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={deleteMessage} color="secondary">
          Delete
        </Button>
        <Button onClick={closeDialog} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
