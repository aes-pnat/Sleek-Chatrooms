const crypto = require("crypto");
export class Message {
  public content: string;
  public senderID: string;
  public roomID: string;
  public datetime: Date | undefined;
  public isCommand: boolean;
  public uuid: string;

  constructor(
    content: string,
    senderID: string,
    roomID: string,
    datetime: Date | undefined = undefined,
    uuid: string = crypto.randomUUID()
  ) {
    this.content = content;
    this.senderID = senderID;
    this.roomID = roomID;
    this.datetime = datetime;
    this.uuid = uuid;
    this.isCommand = content.startsWith("/");
  }
}
