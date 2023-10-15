import { UserMessageQueueService } from "../services/UserMessageQueueSrvice";

export class User {
  public msgStreamRepo: Record<string, UserMessageQueueService> = {};
  public name: string;

  constructor(name: string) {
    this.name = name;
  }
}
