import "colors";
import { User } from "../models/User";
import { Message } from "../models/Message";
import { colorByName } from "../../utils";

var colors = require("colors/safe");

type QueueCollection = {
  [key: string]: Record<string, Array<() => Promise<void>>>;
};
class UserMessageQueueService {
  public queue: QueueCollection = {};
  public callback: Function = console.log;

  public async enqueue(userRecipient: User, msg: Message) {
    console.log(
      colors.bold(`   Enqueueing message for `) +
        colorByName(userRecipient.name, userRecipient.name) +
        colors.bold(`: ${msg.content} `)
    );
    if (!this.queue[msg.room.name]) {
      this.queue[msg.room.name] = {};
    }
    if (!this.queue[msg.room.name][userRecipient.name]) {
      this.queue[msg.room.name][userRecipient.name] = [];
    }
    this.queue[msg.room.name][userRecipient.name].push(() =>
      this.callback(userRecipient, msg)
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
