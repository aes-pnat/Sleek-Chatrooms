export class Alert {
  public content: string;
  public datetime: Date | undefined;

  constructor(content: string, datetime: Date | undefined = undefined) {
    this.content = content;
    this.datetime = datetime;
  }

  public getTimestamp(): string {
    return this.datetime === undefined
      ? "timestamp"
      : `${this.datetime.getHours()}:${this.datetime.getMinutes()}:${this.datetime.getSeconds()}`;
  }
}
