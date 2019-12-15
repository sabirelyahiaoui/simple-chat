import * as WebSocket from "ws";
import { handleConnection } from "./connection";

const serverOptions: WebSocket.ServerOptions = {
  clientTracking: true,
  perMessageDeflate: false,
  port: 5000,
};

const server = new WebSocket.Server(serverOptions, () => {
  // tslint:disable-next-line: no-console
  console.log(
    "Websocket server listening on ws://localhost:" + serverOptions.port,
  );
});

server.on("connection", handleConnection);
