import { Figure } from "./Figure";

export class Message {
  private content: string;
  private sender: Figure;
  private datetime: Date | undefined;

  public getContent(): string {
    return this.content;
  }

  public setContent(content: string): void {
    this.content = content;
  }

  public getSender(): Figure {
    return this.sender;
  }

  public setSender(sender: Figure): void {
    this.sender = sender;
  }

  public getDatetime(): Date | undefined {
    return this.datetime;
  }

  public setDatetime(datetime: Date): void {
    this.datetime = datetime;
  }

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
