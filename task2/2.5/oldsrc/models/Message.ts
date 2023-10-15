import { UserService } from "../services/UserService";

export class Message {
  public content: string;
  public sender: UserService;
  public datetime: Date | undefined;

  constructor(
    content: string,
    sender: UserService,
    datetime: Date | undefined = undefined
  ) {
    this.content = content;
    this.sender = sender;
    this.datetime = datetime;
  }
}
