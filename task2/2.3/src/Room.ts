import { Alert } from "./Alert";
import { Message } from "./Message";
import { User } from "./User";

export class Room {
  public name: string;
  public messages: (Message | Alert)[] = [];
  public users: string[] = [];

  constructor(name: string) {
    this.name = name;
  }

  public addMessage(msg: Message): void {
    if (!this.users.includes(msg.sender.userName)) {
      this.users.push(msg.sender.userName);
      this.messages.push(
        new Alert(`"${msg.sender.userName}" joined the room`, new Date())
      );
    }
    this.messages.push(msg);
  }
}
