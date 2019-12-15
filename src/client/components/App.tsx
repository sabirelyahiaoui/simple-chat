import CssBaseLine from "@material-ui/core/CssBaseline";
import React from "react";
import { createStore, StoreProvider } from "../store";
import Chat from "./Chat";
import Landing from "./Landing";
import TopBar from "./TopBar";

export default function App(): JSX.Element {
  const store = createStore();
  const { state } = store;

  return (
    <>
      <CssBaseLine />
      <StoreProvider value={store}>
        <TopBar />
        {state.connection !== "DISCONNECTED" ? <Chat /> : <Landing />}
      </StoreProvider>
    </>
  );
}
