import "colors";
import { UserMessageQueue } from "../models/UserMessageQueue";

export class UserMessageQueueService {
  public userMsgQueue: UserMessageQueue = new UserMessageQueue();

  public add(msg: string): void {
    this.userMsgQueue.queue.push(msg);
  }

  public popFirst(): string | undefined {
    return this.userMsgQueue.queue.shift();
  }

  public handleMessage(msg: string): void {
    let tmp = this.popFirst();
    while (tmp !== undefined && tmp != msg) {
      console.log(tmp);
      tmp = this.popFirst();
    }
    if (tmp !== undefined) {
      console.log(tmp);
    }
  }
}
