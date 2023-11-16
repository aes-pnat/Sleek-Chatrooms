import { Bot } from "./models/Bot";
import { User } from "./models/User";

class UserDataStore {
  public users: User[] = [new Bot("SERVER")];

  public getUserByName(name: string) {
    return this.users.find((user) => user.name === name);
  }

  public getUserById(uuid: string) {
    return this.users.find((user) => user.uuid === uuid);
  }

  public addUser(name: string) {
    if (name === "SERVER") {
      throw new Error(`User name "${name}" is reserved`);
    }
    if (this.getUserByName(name)) {
      throw new Error(`User with name "${name}" already exists`);
    }
    this.users.push(new User(name));
  }
}

export default new UserDataStore();
