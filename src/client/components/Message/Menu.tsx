import React, { useState } from "react";
import MuiMenu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import DeleteDialog from "./Dialog/Delete";
import EditDialog from "./Dialog/Edit";

interface Props {
  message: Message;
  anchor: HTMLElement | undefined;
  closeMenu(): void;
}

export default function Menu(props: Props): JSX.Element {
  const { anchor, closeMenu, message } = props;
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  function setDialog(
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    open: boolean,
  ): () => void {
    return () => {
      setOpen(open);
      closeMenu();
    };
  }

  return (
    <>
      <MuiMenu anchorEl={anchor} open={!!anchor} onClose={closeMenu}>
        <MenuItem
          className="deleteOption"
          onClick={setDialog(setDeleteOpen, true)}
        >
          Delete
        </MenuItem>
        <MenuItem className="editOption" onClick={setDialog(setEditOpen, true)}>
          Edit
        </MenuItem>
      </MuiMenu>

      <EditDialog
        open={editOpen}
        closeDialog={setDialog(setEditOpen, false)}
        message={message}
      />
      <DeleteDialog
        open={deleteOpen}
        closeDialog={setDialog(setDeleteOpen, false)}
        message={message}
      />
    </>
  );
}
