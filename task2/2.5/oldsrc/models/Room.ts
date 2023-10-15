import { MessageService } from "../services/MessageService";
import { UserService } from "../services/UserService";

export class Room {
  public name: string;
  public messages: MessageService[] = [];
  public users: UserService[] = [];

  constructor(name: string) {
    this.name = name;
  }
}
