import React, { useState, useRef } from "react";
import Linkify from "react-linkify";
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Menu from "./Menu";
import { useStore } from "../../store";

import "../../scss/MessageItem.scss";

interface Props {
  message: Message;
}

const linkifyOptions = {
  target: "_blank",
  rel: "noopener noreferrer",
};

export default function Item(props: Props): JSX.Element {
  const { message } = props;
  const { state } = useStore();
  const [anchor, setAnchor] = useState<HTMLElement | undefined>(undefined);
  const anchorRef = useRef<HTMLDivElement>(undefined!);

  const isOwnMessage = message.userId === state.user.id;

  function handleClick(): void {
    if (isOwnMessage) {
      setAnchor(anchorRef.current);
    }
  }

  function closeMenu(): void {
    setAnchor(undefined);
  }

  return (
    <div className="message-item" onDoubleClick={handleClick}>
      <div className="message-text">
        <Linkify properties={linkifyOptions}>{message.text}</Linkify>
      </div>
      {isOwnMessage && (
        <>
          <div ref={anchorRef} className="message-show-more">
            <IconButton className="show-more-icon" onClick={handleClick}>
              <MoreVertIcon />
            </IconButton>
          </div>
          <Menu anchor={anchor} closeMenu={closeMenu} message={message} />
        </>
      )}
    </div>
  );
}
