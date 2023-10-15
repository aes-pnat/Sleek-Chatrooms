import "colors";
import { User } from "../models/User";
import { Message } from "../models/Message";
import { messageCallback as callback } from "../utils";

type QueueCollection = {
  [key: string]: Record<string, Array<() => Promise<void>>>;
};
class UserMessageQueueService {
  public queue: QueueCollection = {};

  public async enqueue(userRecipient: User, msg: Message) {
    if (!this.queue[msg.room.name]) {
      this.queue[msg.room.name] = {};
    }
    if (!this.queue[msg.room.name][userRecipient.name]) {
      this.queue[msg.room.name][userRecipient.name] = [];
    }
    this.queue[msg.room.name][userRecipient.name].push(() =>
      callback(userRecipient, msg)
    );

    if (this.queue[msg.room.name][userRecipient.name].length === 1) {
      this.processQueue(msg.room.name, userRecipient.name);
    }
  }

  public async processQueue(room: string, user: string) {
    this.queue[room][user].shift()!().then(() => {
      if (this.queue[room][user].length >= 1) {
        this.processQueue(room, user);
      }
    });
  }
}

export default new UserMessageQueueService();
