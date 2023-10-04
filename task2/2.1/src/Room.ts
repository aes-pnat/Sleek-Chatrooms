import { Message } from "./Message";

export class Room {
  public name: string;
  public messages: Message[];

  constructor(name: string, messages: Message[]) {
    this.name = name;
    this.messages = messages;
  }

  public addMessage(msg: Message): void {
    this.messages.push(msg);
  }
}
