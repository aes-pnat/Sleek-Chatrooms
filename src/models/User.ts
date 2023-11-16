const crypto = require("crypto");
export class User {
  public uuid: string;
  public name: string;

  constructor(name: string) {
    this.uuid = crypto.randomUUID();
    this.name = name;
  }
}
