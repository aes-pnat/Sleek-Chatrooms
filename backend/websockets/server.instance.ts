import WebSocket from "ws";
import App from "../src/Sleek";

const crypto = require("crypto");

const wss = new WebSocket.Server({ port: 8080 });

let ws_store: { ws: WebSocket; uid: string }[] = [];

const websocketCallback = async (
  isBotMessage: boolean,
  roomName: string,
  userRecipient: string,
  userSender: string,
  msgContent: string,
  msgTimestamp: string
): Promise<void> => {
  let alert: string;
  if (isBotMessage) {
    alert = `[${msgTimestamp}] To "${userRecipient}" ::: |${userSender}| to "${roomName}": ${msgContent}`;
  } else {
    alert = `[${msgTimestamp}] To "${userRecipient}" ::: "${userSender}" posted in "${roomName}": "${msgContent}"`;
  }

  ws_store.find((x) => x.uid === userRecipient)?.ws.send(alert);
};

App.setOutputChannel(websocketCallback);

wss.on("connection", (ws: WebSocket) => {
  console.log("New client connected");

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
