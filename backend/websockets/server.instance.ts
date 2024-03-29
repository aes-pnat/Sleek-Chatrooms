import { Server, Socket } from "socket.io";
import App from "../src/Sleek";
import { APIMessage } from "../utils";

type MessageSendableType = {
  username: string;
  password: string;
  id: string;
  room: string;
  content: string;
};

const io = new Server({
  cors: {
    origin: "http://localhost:3000",
  },
});

let socketStore: { socket: Socket; uid: string }[] = [];

const websocketCallback = async (apiMessage: APIMessage): Promise<void> => {
  const socketsFiltered = socketStore.filter(
    (s) => s.uid === apiMessage.userRecipientName
  );
  console.log(
    `REPLYING to ${apiMessage.userRecipientName} - found ${socketsFiltered.length} sockets to reply into!`
  );
  socketStore
    .filter((s) => s.uid === apiMessage.userRecipientName)
    .forEach((s) => {
      try {
        s.socket.emit("alert", apiMessage);
      } catch (e) {
        console.log(e);
      }
    });
};

App.setOutputChannel(websocketCallback);

const acceptMessage = (msg: string, socket: Socket) => {
  App.acceptMessage(msg);
  const un = msg.split("@")[0].split(":")[0];
  if (!socketStore.find((x) => x.uid === un && x.socket === socket)) {
    socketStore.push({ socket: socket, uid: un });
  }
};

io.on("connection", (socket: Socket) => {
  console.log("New client connected");
  console.log(socketStore.length);

  // socket.on("message", (msg: string) => {
  //   console.log(msg);
  //   acceptMessage(msg, socket);
  // });

  socket.on("message", (msg: MessageSendableType) => {
    console.log(msg);
    const fullMessage = `${msg.username}:${msg.password}:${msg.id}@${msg.room} ${msg.content}`;
    acceptMessage(fullMessage, socket);
  });

  socket.on("fill", () => {
    const queue = [
      `roger@general /create room numb public`,
      `roger@general /create room son public`,
      `roger@numb Hello?`,
      `roger@numb /create user roger 1234`,
      `roger:1234@general /create room happy`,
      `echo@general /create user bobby 5678`,
      `bobby:5678@happy Here's a little song I wrote`,
      `echo@numb Hello ...`,
      `steve@son Carry on, my wayward son`,
      `echo:@numb Hello ...`,
      `echo:@numb /list rooms`,
      `bobby:5678@happy You might want to sing it note for note`,
      `roger:1234@numb Is there anybody in there?`,
      `steve@son There'll be peace when you are done`,
      `bobby:5678@happy Don't worry,`,
      `roger:1234@numb Just nod if you can hear me`,
      `steve:trash@son Lay your weary head to rest`,
      `bobby:5678@happy Be happy`,
      `steve@son Don't you cry no more`,
      `roger:1234@numb Is there anyone home?`,
      `kerry@son BaDa-Da-Dum BaDa-Da-Da-Dum`,
    ];

    for (const e of queue) {
      acceptMessage(e, socket);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    //socketStore = socketStore.filter((s) => s.socket !== socket);
  });
});

io.listen(8080);
