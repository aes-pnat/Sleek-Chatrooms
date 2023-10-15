import { Message } from "./Message";
import { User } from "./User";

export class Room {
  public name: string;
  public messages: Message[] = [];
  public users: User[] = [];

  constructor(name: string) {
    this.name = name;
  }
}
