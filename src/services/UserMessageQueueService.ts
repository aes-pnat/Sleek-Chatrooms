import { Message } from "../models/Message";
import UsersDataStore from "../UsersDataStore";
import RoomsDataStore from "../RoomsDataStore";
import { getTimestamp } from "../../utils";

var colors = require("colors/safe");

const defaultCallback = (
  isBot: boolean,
  roomName: string,
  userRecipientName: string,
  userSenderName: string,
  content: string,
  timestamp: string
): Promise<undefined> => {
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
      `   Enqueueing message for ${userRecipient.name}: ${msg.content} `
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
        getTimestamp(msg.datetime!)
      )
    );

    this.processQueue(room!.uuid, userRecipient.uuid);
    return Promise.resolve();
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
    console.log(JSON.stringify(output));
    return output;
  }
}

export default new UserMessageQueueService();
