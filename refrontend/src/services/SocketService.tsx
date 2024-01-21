import { io, Socket } from "socket.io-client";
import { APIMessage, MessageSendableType } from "../utils/types";

export class SocketService {
  private _repository: Record<
    string,
    {
      msg: MessageSendableType;
      p: Promise<MessageSendableType>;
    }
  > = {};

  private _socket: Socket = io("http://localhost:8080", {
    transports: ["websocket"],
    autoConnect: false,
  });

  public callback: (
    sentMsg: MessageSendableType | null,
    msgToReceive: APIMessage
  ) => void;

  constructor(
    callback: (
      sentMsg: MessageSendableType | null,
      msgToReceive: APIMessage
    ) => void = console.log
  ) {
    this.callback = callback;
  }

  private handleConnect() {
    console.log("Connected to server");
  }

  private handleDisconnect() {
    console.log("Disconnected from server");
  }

  private handleAlert(msgToReceive: APIMessage) {
    if (msgToReceive.respondingToUUID === null) {
      this.callback(null, msgToReceive);
      return;
    }

    const primaryMessage = this._repository[msgToReceive.respondingToUUID];

    if (primaryMessage === undefined) {
      this.callback(null, msgToReceive);
    } else {
      primaryMessage.p.then(
        (sentMsg: MessageSendableType) => {
          if (sentMsg.content !== primaryMessage.msg.content) {
            throw new Error(
              `Message ID does not match \n\tExpected: ${primaryMessage.msg} \n\tReceived: ${sentMsg}`
            );
          }
          this.callback(sentMsg, msgToReceive);
        },
        (err: string) => {
          console.log(err);
        }
      );
    }
  }

  public async send(
    msgToSend: MessageSendableType,
    id: string
  ): Promise<MessageSendableType> {
    const p: Promise<MessageSendableType> = new Promise((res, rej) => {
      try {
        res(msgToSend);
      } catch (e) {
        rej(e);
      }
    });

    this._repository[id] = { msg: msgToSend, p: p };
    this._socket.emit("message", msgToSend);

    return p;
  }

  public connect() {
    this._socket.on("connect", this.handleConnect);
    this._socket.on("disconnect", this.handleDisconnect);
    this._socket.on("alert", this.handleAlert);
    this._socket.connect();
  }

  public disconnect() {
    this._socket.disconnect();
    this._socket.off("connect", this.handleConnect);
    this._socket.off("disconnect", this.handleDisconnect);
    this._socket.off("alert", this.handleAlert);
  }
}

// (async () => {
//   const socket = new SocketService();
//   const listOfRooms = await socket.send("/list rooms", "randomID");

//   // const [rooms, users] = await Promise.all([
//   //   socket.send("/list rooms"),
//   //   socket.send("/list users"),
//   // ]);
// })();
