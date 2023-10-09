import { Bot } from "./Bot";
import { Message } from "./Message";
import { User } from "./User";

export class Room {
  private _name: string;
  private _messages: Message[] = [];
  private _users: User[] = [];

  public get name(): string {
    return this._name;
  }
  public set name(value: string) {
    this._name = value;
  }

  public get messages(): Message[] {
    return this._messages;
  }
  public set messages(value: Message[]) {
    this._messages = value;
  }

  public get users(): User[] {
    return this._users;
  }
  public set users(value: User[]) {
    this._users = value;
  }

  constructor(name: string) {
    this._name = name;
  }

  public addMessage(msg: Message): void {
    this._messages.push(msg);
  }
}
