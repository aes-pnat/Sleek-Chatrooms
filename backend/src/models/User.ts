const crypto = require("crypto");
export class User {
  public uuid: string;
  public name: string;
  public isBot: boolean;

  constructor(name: string, isBot: boolean = false) {
    this.uuid = crypto.randomUUID();
    this.name = name;
    this.isBot = isBot;
  }
}
