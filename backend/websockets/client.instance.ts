import WebSocket from "ws";

const ws_client = new WebSocket("ws://localhost:8080");

ws_client.on("open", () => {
  console.log("Connected to server");

  ws_client.send("loser:@general Hllo, server!");
});

ws_client.on("message", (message: string) => {
  console.log(`Received message from server: ${message}`);
});

ws_client.on("close", () => {
  console.log("Disconnected from server");
});
