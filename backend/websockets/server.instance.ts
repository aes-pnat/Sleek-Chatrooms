import WebSocket from "ws";
import App from "../src/Sleek";

const wss = new WebSocket.Server({ port: 8080 });

let ws_store: { ws: WebSocket; uid: string }[] = [];

const websocketCallback = async (
  isBotMessage: boolean,
  roomName: string,
  roomID: string,
  userRecipient: string,
  userRecipientID: string,
  userSender: string,
  userSenderID: string,
  msgContent: string,
  commandReturnType: string | undefined,
  msgTimestamp: string
): Promise<void> => {
  const alert = JSON.stringify({
    isBotMessage: isBotMessage,
    roomName: roomName,
    roomID: roomID,
    userRecipient: userRecipient,
    userRecipientID: userRecipientID,
    userSender: userSender,
    userSenderID: userSenderID,
    content: msgContent,
    commandReturnType: commandReturnType,
    timestamp: msgTimestamp,
  });

  ws_store
    .filter((socket) => socket.uid === userRecipient)
    .forEach((socket) => socket.ws.send(alert));
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
