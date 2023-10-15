import { Bot } from "./models/Bot";
import { User } from "./models/User";

class UserStore {
  public users: Record<string, User> = {
    SERVER: new Bot("SERVER"),
  };

  public addUser(name: string) {
    this.users[name] = new User(name);
  }
}

export default new UserStore();
