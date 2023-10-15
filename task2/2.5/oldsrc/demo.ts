// --- Outside

// --- Sleek library root

class Sleek {
  private messageParser: MessageParser;

  public constructor() {
    const userStore = new UserStore();
    this.messageParser = new MessageParser(userStore);
  }

  public send(syntax: string) {
    const parsedMessage = this.messageParser.parse(syntax);
  }
}

new Sleek().send("pero šalje nešto ...");

new Sleek().send("pero šalje nešto ...");

// --- Message Parser

export class MessageParser {
  public constructor(private userStore: UserStore) {}

  public parse(syntax: string): Message {
    0;
    // ...
    const user = this.userStore.findOrCrateUser("pero");
    return new Message();
  }
}

// export const messageParser = new MessageParser();

// --- Message

export class Message {}

// --- Users

class User {
  public constructor(public username?: string) {}
}

export class UserStore {
  private _users: User[] = [];

  public findOrCrateUser(username: string) {
    return (
      this._users.find((u) => u.username === username) || new User(username)
    );
  }
}

// export const userStore = new UserStore();
