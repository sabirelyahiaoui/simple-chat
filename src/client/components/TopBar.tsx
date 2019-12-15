import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { useStore } from "../store";

import "../scss/TopBar.scss";

export default function TopBar(): JSX.Element {
  const { state, dispatch } = useStore();

  function disconnectChat(): void {
    dispatch({ type: "RESET" });
  }

  return (
    <div id="topbar">
      <AppBar id="appbar" color="primary">
        <Toolbar id="toolbar">
          <Typography variant="subheading" id="connection-text" color="inherit">
            {getConnectionMessage(state)}
          </Typography>
          {state.connection === "CONNECTED" && (
            <div id="disconnect-button-container">
              <Button
                id="disconnect-button"
                color="inherit"
                onClick={disconnectChat}
              >
                Disconnect
              </Button>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}

function getConnectionMessage(state: State): string {
  switch (state.connection) {
    case "CONNECTED":
      return `Currently connected as ${state.user.name}`;
    case "CONNECTING":
      return `Connecting as ${state.user.name}...`;
    case "DISCONNECTED":
      return "Not currently connected";
    default:
      return "";
  }
}
