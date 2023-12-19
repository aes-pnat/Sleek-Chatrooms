import { Message } from "./Message";

const crypto = require("crypto");
export class Room {
  public uuid: string;
  public name: string;
  public messages: Message[] = [];
  public users: string[] = [];
  public open: boolean = true;

  constructor(name: string, open: boolean) {
    this.name = name;
    this.open = open;
    this.uuid = crypto.randomUUID();
  }
}
