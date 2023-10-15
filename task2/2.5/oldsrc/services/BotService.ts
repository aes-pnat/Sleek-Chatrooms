import { User } from "../models/User";

export class BotService {
  public bot: User;

  constructor(name: string) {
    this.bot = new User(name);
  }
}
