import { Message } from "../models/Message";
import { UserService } from "./UserService";

export class MessageService {
  public message: Message;

  constructor(
    content: string,
    sender: UserService,
    datetime: Date | undefined = undefined
  ) {
    this.message = new Message(content, sender, datetime);
  }

  public getTimestamp(): string {
    return this.message.datetime === undefined
      ? "timestamp"
      : `${this.message.datetime.getHours()}:${this.message.datetime.getMinutes()}:${this.message.datetime.getSeconds()}`;
  }
}
