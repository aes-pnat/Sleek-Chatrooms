import "colors";
import { User } from "../models/User";
import { Message } from "../models/Message";
import { colorByName } from "../../utils";

var colors = require("colors/safe");

type QueueCollection = {
  [key: string]: {
    [key: string]: {
      q: Array<() => Promise<void>>;
      cs: boolean;
    };
  };
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
      this.queue[msg.room.name][userRecipient.name] = { q: [], cs: false };
      //critical_section = false;
    }
    this.queue[msg.room.name][userRecipient.name].q.push(() =>
      this.callback(userRecipient, msg)
    );

    this.processQueue(msg.room.name, userRecipient.name);
  }

  public processQueue(room: string, user: string) {
    if (this.queue[room][user].cs) {
      return;
    } else {
      this.queue[room][user].cs = true;
      this.queue[room][user].q.shift()!().then(() => {
        this.queue[room][user].cs = false;
        if (this.queue[room][user].q.length >= 1) {
          this.processQueue(room, user);
        }
      });
    }
  }
}

export default new UserMessageQueueService();
