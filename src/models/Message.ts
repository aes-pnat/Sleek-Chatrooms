export class Message {
  public content: string;
  public senderID: string;
  public roomID: string;
  public datetime: Date | undefined;
  public isCommand: boolean;

  constructor(
    content: string,
    senderID: string,
    roomID: string,
    datetime: Date | undefined = undefined
  ) {
    this.content = content;
    this.senderID = senderID;
    this.roomID = roomID;
    this.datetime = datetime;
    this.isCommand = content.startsWith("/");
  }
}
