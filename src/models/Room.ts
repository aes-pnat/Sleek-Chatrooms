import { Message } from "./Message";
import { User } from "./User";

export class Room {
  public id: number;
  public name: string;
  public messages: Message[] = [];
  public users: User[] = [];

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}
