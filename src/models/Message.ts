import { Room } from "./Room";
import { User } from "./User";

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
    return this.datetime === undefined
      ? "timestamp"
      : `${this.datetime.getHours()}:${this.datetime.getMinutes()}:${this.datetime.getSeconds()}:${this.datetime.getMilliseconds()}`;
  }
}
