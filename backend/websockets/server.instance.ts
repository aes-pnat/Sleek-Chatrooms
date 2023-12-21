import { Server, Socket } from "socket.io";
import App from "../src/Sleek";
import { APIMessage } from "../utils";

const io = new Server({
  cors: {
    origin: "http://localhost:3000",
  },
});

let socketStore: { socket: Socket; uid: string }[] = [];

const websocketCallback = async (apiMessage: APIMessage): Promise<void> => {
  const alert = {
    isBotMessage: apiMessage.isBot,
    roomName: apiMessage.roomName,
    roomID: apiMessage.roomID,
    userRecipient: apiMessage.userRecipientName,
    userRecipientID: apiMessage.userRecipientID,
    userSender: apiMessage.userSenderName,
    userSenderID: apiMessage.userSenderID,
    data: apiMessage.data,
    commandReturnType: apiMessage.commandReturnType,
    timestamp: apiMessage.timestamp,
  };

  socketStore
    .filter((s) => s.uid === apiMessage.userRecipientName)
    .forEach((s) => s.socket.emit("alert", alert));
};

App.setOutputChannel(websocketCallback);

io.on("connection", (socket: Socket) => {
  console.log("New client connected");
  console.log(socketStore.length);

  socket.on("message", (msg: string) => {
    console.log(msg);
    App.acceptMessage(msg);
    const un = msg.split("@")[0].split(":")[0];
    if (!socketStore.find((x) => x.uid === un)) {
      socketStore.push({ socket, uid: un });
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

io.listen(8080);
