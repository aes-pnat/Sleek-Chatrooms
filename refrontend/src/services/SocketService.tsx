import { io, Socket } from "socket.io-client";
import { APIMessage, MessageSendableType } from "../utils/types";

export class SocketService {
  private _repository: Record<
    string,
    {
      msg: MessageSendableType;
      p: Promise<{
        sentMsg: MessageSendableType | null;
        msgToReceive: APIMessage;
      }> | null;
      resF:
        | ((value: {
            sentMsg: MessageSendableType | null;
            msgToReceive: APIMessage;
          }) => void)
        | null;
      rejF: ((reason?: any) => void) | null;
    }
  > = {};

  private _socket: Socket = io("http://localhost:8080", {
    transports: ["websocket"],
    autoConnect: false,
  });

  callback: (val: {
    sentMsg: MessageSendableType | null;
    msgToReceive: APIMessage;
  }) => void;

  constructor(
    callback: (val: {
      sentMsg: MessageSendableType | null;
      msgToReceive: APIMessage;
    }) => void = console.log
  ) {
    this.callback = callback;
  }

  handleConnect() {
    console.log("Connected to server");
  }

  handleDisconnect() {
    console.log("Disconnected from server");
  }

  handleAlert(msgToReceive: APIMessage) {
    /* 
    respondingToUUID always exists, indicating either the ID of the same message 
    or the ID of the command message to which this message is responding.
    If the ID isn't in the repository, it means that the message is sent by some other user

    Handle incoming message differently? Is callback needed?
    Probably, since handleAlert gets called autonomously, i.e.
    it needs some way to alert the app that a message has been received

    Is there some flaw in not using the callback for responding messages, but only
    unannounced ones?
    */
    console.log(this._repository);
    if (!(msgToReceive.respondingToUUID in this._repository)) {
      this.callback({ sentMsg: null, msgToReceive: msgToReceive });
    } else {
      const primaryMessage = this._repository[msgToReceive.respondingToUUID];
      console.log("outside promise");

      primaryMessage.resF!({
        sentMsg: primaryMessage.msg,
        msgToReceive: msgToReceive,
      });

      delete this._repository[msgToReceive.respondingToUUID];
      // primaryMessage
      //   .p!.then((sentMsg: MessageSendableType) => {
      //     if (sentMsg.content !== primaryMessage.msg.content) {
      //       throw new Error(
      //         `Message ID does not match \n\tExpected: ${primaryMessage.msg} \n\tReceived: ${sentMsg}`
      //       );
      //     }
      //     return Promise.resolve({
      //       sentMsg: sentMsg,
      //       msgToReceive: msgToReceive,
      //     });
      //   })
      //   .catch((err: string) => {
      //     return err;
      //   });
    }
  }

  async send(
    msgToSend: MessageSendableType,
    id: string
  ): Promise<{
    sentMsg: MessageSendableType | null;
    msgToReceive: APIMessage;
  }> {
    // let resolve: (value: MessageSendableType) => void;
    // let reject: (reason?: any) => void;

    this._repository[id] = {
      msg: msgToSend,
      p: null,
      resF: null,
      rejF: null,
    };

    const p: Promise<{
      sentMsg: MessageSendableType | null;
      msgToReceive: APIMessage;
    }> = Promise.race([
      new Promise<{
        sentMsg: MessageSendableType | null;
        msgToReceive: APIMessage;
      }>((res, rej) => {
        // resolve = res;
        // reject = rej;
        this._repository[id].resF = res;
        this._repository[id].rejF = rej;
      }),
      // new Promise<{sentMsg: MessageSendableType | null,
      //  msgToReceive: APIMessage}>((res) => {
      //   setTimeout(() => {
      //     console.log("Promise timed out after 5 seconds.");
      //     res(msgToSend);
      //   }, 5000);
      // }),
    ]);

    this._repository[id].p = p;
    this._socket.emit("message", msgToSend);

    return p;
  }

  connect() {
    this._socket.on("connect", this.handleConnect.bind(this));
    this._socket.on("disconnect", this.handleDisconnect.bind(this));
    this._socket.on("alert", this.handleAlert.bind(this));
    this._socket.connect();
  }

  disconnect() {
    this._repository = {};
    this._socket.disconnect();
    this._socket.off("connect", this.handleConnect.bind(this));
    this._socket.off("disconnect", this.handleDisconnect.bind(this));
    this._socket.off("alert", this.handleAlert.bind(this));
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
