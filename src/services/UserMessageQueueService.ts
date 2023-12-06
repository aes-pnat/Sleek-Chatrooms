import "colors";

import { Message } from "../models/Message";
import { colorByName } from "../../utils";
import UsersDataStore from "../UsersDataStore";
import RoomsDataStore from "../RoomsDataStore";

var colors = require("colors/safe");

const defaultCallback = (
  isBot: boolean,
  roomName: string,
  userRecipientName: string,
  userSenderName: string,
  content: string,
  timestamp: string
) => {
  return new Promise((resolve) => {
    console.log(
      isBot,
      roomName,
      userRecipientName,
      userSenderName,
      content,
      timestamp
    );
    resolve(void 0);
  });
};

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
  public callback: Function = defaultCallback;

  public async enqueue(userRecipientID: string, msg: Message) {
    let userRecipient = UsersDataStore.getUserById(userRecipientID)!;
    let userSender = UsersDataStore.getUserById(msg.senderID)!;
    let room = RoomsDataStore.getRoomById(msg.roomID);

    if (!room) {
      throw Error(`   Room ${msg.roomID} not found!`);
    }
    if (!userRecipient) {
      throw Error(`   User recipient ${userRecipientID} not found!`);
    }
    if (!userSender) {
      throw Error(`   User sender ${msg.senderID} not found!`);
    }

    console.log(
      colors.bold(`   Enqueueing message for `) +
        colorByName(userRecipient.name, userRecipient.name) +
        colors.bold(`: ${msg.content} `)
    );
    if (!this.queue[room!.uuid]) {
      this.queue[room!.uuid] = {};
    }
    if (!this.queue[room!.uuid][userRecipient.uuid]) {
      this.queue[room!.uuid][userRecipient.uuid] = { q: [], cs: false };
      //critical_section = false;
    }
    this.queue[room!.uuid][userRecipient.uuid].q.push(() =>
      this.callback(
        userSender.isBot,
        room!.name,
        userRecipient.name,
        userSender.name,
        msg.content,
        msg.getTimestamp()
      )
    );

    this.processQueue(room!.uuid, userRecipient.uuid);
  }

  public processQueue(room: string, user: string) {
    this.printState();
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
    this.printState();
  }

  public getTotalMessages() {
    let totalMsgs = 0;
    Object.keys(this.queue).forEach((room) => {
      Object.keys(this.queue[room]).forEach((user) => {
        totalMsgs += this.queue[room][user].q.length;
      });
    });
    return totalMsgs;
  }

  public printState(): Object {
    let totalMessages = this.getTotalMessages();
    let output = {
      idle: totalMessages === 0,
      totalMessages: totalMessages,
    };
    console.log(output);
    return output;
  }
}

export default new UserMessageQueueService();
