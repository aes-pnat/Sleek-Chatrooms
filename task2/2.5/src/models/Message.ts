import { Room } from "./Room";
import { User } from "./User";

export class Message {
  public content: string;
  public sender: User;
  public room: Room;
  public datetime: Date | undefined;

  constructor(
    content: string,
    sender: User,
    room: Room,
    datetime: Date | undefined = undefined
  ) {
    this.content = content;
    this.sender = sender;
    this.room = room;
    this.datetime = datetime;
  }

  public getTimestamp(): string {
    return this.datetime === undefined
      ? "timestamp"
      : `${this.datetime.getHours()}:${this.datetime.getMinutes()}:${this.datetime.getSeconds()}:${this.datetime.getMilliseconds()}`;
  }
}
