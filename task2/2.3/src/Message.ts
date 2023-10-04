import { Figure } from "./Figure";

export class Message {
  public content: string;
  public sender: Figure;
  public datetime: Date | undefined;

  constructor(
    content: string,
    sender: Figure,
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
