import { Bot } from "./Bot";
import { Message } from "./Message";
import { User } from "./User";

export class Room {
  private name: string;
  private messages: Message[] = [];
  private users: User[] = [];

  public getName(): string {
    return this.name;
  }

  public setName(name: string): void {
    this.name = name;
  }

  public getMessages(): Message[] {
    return this.messages;
  }

  public setMessages(messages: Message[]): void {
    this.messages = messages;
  }

  public getUsers(): User[] {
    return this.users;
  }

  public setUsers(users: User[]): void {
    this.users = users;
  }

  constructor(name: string) {
    this.name = name;
  }

  public addMessage(msg: Message): void {
    this.messages.push(msg);
  }
}
