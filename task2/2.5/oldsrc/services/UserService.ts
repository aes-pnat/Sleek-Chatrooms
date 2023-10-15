import { User } from "../models/User";
import { RoomService } from "./RoomService";
import { UserMessageQueueService } from "./UserMessageQueueSrvice";

export class UserService {
  public user: User;

  constructor(name: string) {
    this.user = new User(name);
  }

  public appendToStream(room: RoomService, alert: string): void {
    if (!this.user.msgStreamRepo[room.name]) {
      this.user.msgStreamRepo[room.name] = new UserMessageQueueService();
      this.user.msgStreamRepo[room.name].add(alert);
    } else {
      this.user.msgStreamRepo[room.name].add(alert);
    }
  }
}
