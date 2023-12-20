export class Message {
  public content: string;
  public senderID: string;
  public roomID: string;
  public datetime: Date | undefined;
  public isCommand: boolean;
  public commandReturnType: string | null;

  constructor(
    content: string,
    senderID: string,
    roomID: string,
    datetime: Date | undefined = undefined,
    commandReturnType: string | null = null
  ) {
    this.content = content;
    this.senderID = senderID;
    this.roomID = roomID;
    this.datetime = datetime;
    this.commandReturnType = commandReturnType;
    this.isCommand = content.startsWith("/");
  }
}
