import { Message } from "../models/Message";
import UsersDataStore from "../UsersDataStore";
import RoomsDataStore from "../RoomsDataStore";
import { getTimestamp } from "../../utils";

const defaultCallback = (
  isBot: boolean,
  roomName: string,
  roomID: string,
  userRecipientName: string,
  userRecipientID: string,
  userSenderName: string,
  userSenderID: string,
  content: string,
  commandReturnType: string | undefined,
  timestamp: string
): Promise<undefined> => {
  return new Promise((resolve) => {
    console.log(
      isBot,
      roomName,
      roomID,
      userRecipientName,
      userRecipientID,
      userSenderName,
      userSenderID,
      content,
      commandReturnType,
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

type State = {
  idle: boolean;
  totalMessages: number;
};
class UserMessageQueueService {
  public queue: QueueCollection = {};
  public callback: Function = defaultCallback;
  public state: State = { idle: true, totalMessages: 0 };

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

    if (!this.queue[room!.uuid]) {
      this.queue[room!.uuid] = {};
    }
    if (!this.queue[room!.uuid][userRecipient.uuid]) {
      this.queue[room!.uuid][userRecipient.uuid] = { q: [], cs: false };
      //critical_section = false;
    }

    console.log(
      `   Enqueueing message for ${userRecipient.name}: ${msg.content} `
    );
    this.queue[room!.uuid][userRecipient.uuid].q.push(() =>
      this.callback(
        userSender.isBot,
        room!.name,
        room!.uuid,
        userRecipient.name,
        userRecipient.uuid,
        userSender.name,
        userSender.uuid,
        msg.content,
        msg.commandReturnType,
        getTimestamp(msg.datetime!)
      )
    );
    this.state.idle = false;
    this.state.totalMessages++;
    this.printState();

    this.processQueue(room!.uuid, userRecipient.uuid);
    return Promise.resolve();
  }

  public processQueue(room: string, user: string) {
    if (this.queue[room][user].cs) {
      return;
    } else {
      this.queue[room][user].cs = true;
      this.queue[room][user].q.shift()!().then(() => {
        this.state.totalMessages--;
        this.state.idle = this.state.totalMessages === 0;
        this.printState();
        this.queue[room][user].cs = false;
        if (this.queue[room][user].q.length >= 1) {
          this.processQueue(room, user);
        }
      });
    }
  }

  public printState(): Object {
    console.log(JSON.stringify(this.state));
    return this.state;
  }
}

export default new UserMessageQueueService();
