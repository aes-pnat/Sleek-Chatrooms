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

  public getTimestamp(): string {
    const h = this.datetime?.getHours();
    const m = this.datetime?.getMinutes();
    const s = this.datetime?.getSeconds();
    const ms = this.datetime?.getMilliseconds();
    return this.datetime === undefined
      ? "timestamp"
      : `${h! > 9 ? `${h}` : `0${h}`}:${m! > 9 ? `${m}` : `0${m}`}:${
          s! > 9 ? `${s}` : `0${s}`
        }:${ms! > 99 ? `${ms}` : ms! > 9 ? `0${ms}` : `00${ms}`}`;
  }
}
