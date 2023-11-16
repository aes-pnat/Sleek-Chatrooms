import { Message } from "./Message";

const crypto = require("crypto");
export class Room {
  public uuid: string;
  public name: string;
  public messages: Message[] = [];
  public users: string[] = [];

  constructor(name: string) {
    this.uuid = crypto.randomUUID();
    this.name = name;
  }
}
