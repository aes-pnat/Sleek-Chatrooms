import { Room } from "./Room";
import { User } from "./User";

export class Message {
  public content: string;
  public sender: User;
  public room: Room;
  public datetime: Date | undefined;
  public isCommand: boolean;

  constructor(
    content: string,
    sender: User,
    room: Room,
    datetime: Date | undefined = undefined,
    isCommand: boolean = false
  ) {
    this.content = content;
    this.sender = sender;
    this.room = room;
    this.datetime = datetime;
    this.isCommand = isCommand;
  }

  public getTimestamp(): string {
    return this.datetime === undefined
      ? "timestamp"
      : `${this.datetime.getHours()}:${this.datetime.getMinutes()}:${this.datetime.getSeconds()}:${this.datetime.getMilliseconds()}`;
  }
}
