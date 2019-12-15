import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import React, { useState } from "react";
import { useStore } from "../store";

import "../scss/Landing.scss";

export default function Landing(): JSX.Element {
  const { state, dispatch } = useStore();
  const [username, setUsername] = useState(state.user.name || "");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    dispatch({
      type: "SET_USERNAME",
      username,
    });
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setUsername(event.currentTarget.value);
  }

  return (
    <div id="landing">
      <form onSubmit={handleSubmit} autoComplete="off">
        <div className="input-container">
          <TextField
            id="username-input"
            label="Enter username"
            onChange={handleChange}
            autoFocus
            fullWidth
            value={username}
          />
        </div>
        <Button
          id="connect-button"
          variant="contained"
          color="primary"
          type="submit"
        >
          Connect
        </Button>
      </form>
      <div id="welcome-text">
        <Typography variant="h6">
          <p>Hey! Welcome to this simple chat app I made :)</p>
          <p>
            All you need to start chatting is a username! You can send messages,
            edit them, and delete them.
          </p>
          <p>Try it out and be sure to report any bugs to me :)</p>
        </Typography>
      </div>
    </div>
  );
}
