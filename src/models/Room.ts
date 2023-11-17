import { Message } from "./Message";

const crypto = require("crypto");
export class Room {
  public uuid: string;
  public name: string;
  public messages: Message[] = [];
  public users: string[] = [];
  public open: boolean = true;

  constructor(name: string, open: boolean) {
    this.uuid = crypto.randomUUID();
    this.name = name;
    this.open = open;
  }
}
