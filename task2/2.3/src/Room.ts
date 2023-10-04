import { Bot } from "./Bot";
import { Message } from "./Message";

export class Room {
  public name: string;
  public messages: Message[] = [];
  public users: string[] = [];

  constructor(name: string) {
    this.name = name;
  }

  public addMessage(msg: Message): void {
    if (!this.users.includes(msg.sender.name)) {
      this.users.push(msg.sender.name);
      this.messages.push(
        new Message(
          `"${msg.sender.name}" joined the room`,
          new Bot("SERVER"),
          new Date()
        )
      );
    }
    this.messages.push(msg);
  }
}
