import { User } from "./User";

export class Message {
  public content: string;
  public user: User;
  public datetime: Date | undefined;

  constructor(
    content: string,
    user: User,
    datetime: Date | undefined = undefined
  ) {
    this.content = content;
    this.user = user;
    this.datetime = datetime;
  }

  public getTimestamp(): string {
    return this.datetime === undefined
      ? "timestamp"
      : `${this.datetime.getHours()}:${this.datetime.getMinutes()}:${this.datetime.getSeconds()}`;
  }
}
