import React, { useRef, useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import Fab from "@material-ui/core/Fab";
import ExpandMore from "@material-ui/icons/ExpandMore";
import { debounce, first } from "lodash";
import MessageGroups from "./Groups";
import { useStore } from "../../store";

import "../../scss/MessageStream.scss";
import { ws } from "../../websocket";

const SCROLLED_UP_THRESHOLD = 200;

export default function Stream(): JSX.Element {
  const { state } = useStore();
  const [scrolledUp, setScrolledUp] = useState(false);
  const [scrolledTop, setScrolledTop] = useState(false);
  const streamRef = useRef<HTMLDivElement>(undefined!);

  useEffect(() => {
    scrollToBottom(streamRef.current);
  }, []);

  useEffect(() => {
    if (calculateOffset(streamRef.current) < SCROLLED_UP_THRESHOLD) {
      scrollToBottom(streamRef.current);
    }
  }, [state.messages]);

  function handleScroll(event: React.UIEvent): void {
    event.persist();
    checkScrollDownButton();
    setScrolledTop(streamRef.current.scrollTop === 0);
  }

  function loadMessages(): void {
    const request: MessageRequest = {
      type: "LOAD_MORE",
      messageId: first(state.messages)!.id,
      userId: state.user.id!,
    };
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(request));
    }
  }

  function checkScrollDownButton(): void {
    const offset = calculateOffset(streamRef.current);
    offset > SCROLLED_UP_THRESHOLD ? setScrolledUp(true) : setScrolledUp(false);
  }

  function handleClick(): void {
    scrollToBottom(streamRef.current);
  }

  return (
    <div
      ref={streamRef}
      id="message-stream"
      onScroll={debounce(handleScroll, 50)}
    >
      {scrolledTop && (
        <Button id="load-more-button" variant="text" onClick={loadMessages}>
          Load more messages
        </Button>
      )}
      <MessageGroups />
      {scrolledUp && (
        <Fab id="scroll-down-button" onClick={handleClick}>
          <ExpandMore />
        </Fab>
      )}
    </div>
  );
}

function scrollToBottom(element: HTMLElement): void {
  element.scrollTop = element.scrollHeight;
}

function calculateOffset(element: HTMLElement): number {
  const currentHeight = element.scrollTop + element.clientHeight;
  const offset = element.scrollHeight - currentHeight;
  return offset;
}
