import { User } from "./User";

export class Message {
  public content: string;
  public sender: User;
  public datetime: Date | undefined;

  constructor(
    content: string,
    sender: User,
    datetime: Date | undefined = undefined
  ) {
    this.content = content;
    this.sender = sender;
    this.datetime = datetime;
  }

  public getTimestamp(): string {
    return this.datetime === undefined
      ? "timestamp"
      : `${this.datetime.getHours()}:${this.datetime.getMinutes()}:${this.datetime.getSeconds()}`;
  }
}
