import { Figure } from "./Figure";

export class Message {
  private _content: string;
  private _sender: Figure;
  private _datetime: Date | undefined;

  public get content(): string {
    return this._content;
  }
  public set content(value: string) {
    this._content = value;
  }

  public get sender(): Figure {
    return this._sender;
  }
  public set sender(value: Figure) {
    this._sender = value;
  }

  public get datetime(): Date | undefined {
    return this._datetime;
  }
  public set datetime(value: Date | undefined) {
    this._datetime = value;
  }

  constructor(
    content: string,
    sender: Figure,
    datetime: Date | undefined = undefined
  ) {
    this._content = content;
    this._sender = sender;
    this._datetime = datetime;
  }

  public getTimestamp(): string {
    return this.datetime === undefined
      ? "timestamp"
      : `${this.datetime.getHours()}:${this.datetime.getMinutes()}:${this.datetime.getSeconds()}`;
  }
}
