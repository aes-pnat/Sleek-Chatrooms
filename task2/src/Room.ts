import { Message } from "./Message";

export class Room {
  name: string;
  messages: Message[];

  constructor(name: string, messages: Message[]) {
    this.name = name;
    this.messages = messages;
  }

  addMessage(msg: Message): void {
    this.messages.push(msg);
  }
}
