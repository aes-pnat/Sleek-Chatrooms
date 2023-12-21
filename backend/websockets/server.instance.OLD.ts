import WebSocket from "ws";
import App from "../src/Sleek";
import { APIMessage } from "../utils";

const wss = new WebSocket.Server({ port: 8080 });

let ws_store: { ws: WebSocket; uid: string }[] = [];

const websocketCallback = async (apiMessage: APIMessage): Promise<void> => {
  const alert = JSON.stringify({
    isBotMessage: apiMessage.isBot,
    roomName: apiMessage.roomName,
    roomID: apiMessage.roomID,
    userRecipient: apiMessage.userRecipientName,
    userRecipientID: apiMessage.userRecipientID,
    userSender: apiMessage.userSenderName,
    userSenderID: apiMessage.userSenderID,
    content: apiMessage.data,
    commandReturnType: apiMessage.commandReturnType,
    timestamp: apiMessage.timestamp,
  });

  ws_store
    .filter((socket) => socket.uid === apiMessage.userRecipientName)
    .forEach((socket) => socket.ws.send(alert));
};

App.setOutputChannel(websocketCallback);

wss.on("connection", (ws: WebSocket) => {
  console.log("New client connected");
  console.log(ws_store.length);

  ws.on("message", (msg: string) => {
    const msgString = msg.toString();
    console.log(msgString);
    App.acceptMessage(msgString);
    const un = msgString.split("@")[0].split(":")[0];
    if (!ws_store.find((x) => x.uid === un)) {
      ws_store.push({ ws, uid: un });
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});
