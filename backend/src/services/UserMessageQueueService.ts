import { Message } from "../models/Message";
import UsersDataStore from "../UsersDataStore";
import RoomsDataStore from "../RoomsDataStore";
import { getTimestamp } from "../../utils";
import { APIMessage } from "../../utils";

const defaultCallback = (apiMessage: APIMessage): Promise<undefined> => {
  return new Promise((resolve) => {
    console.log(
      apiMessage.isBot,
      apiMessage.roomName,
      apiMessage.roomID,
      apiMessage.userRecipientName,
      apiMessage.userRecipientID,
      apiMessage.userSenderName,
      apiMessage.userSenderID,
      apiMessage.data,
      apiMessage.timestamp,
      apiMessage.respondingToUUID
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

  public async enqueue(
    userRecipientID: string,
    msg: Message,
    respondingToUUID: string | null = null
  ) {
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
    }

    console.log(
      `   Enqueueing message for ${userRecipient.name}: ${msg.content} `
    );
    const apiMessage: APIMessage = {
      isBot: userSender.isBot,
      roomName: room!.name,
      roomID: room!.uuid,
      userRecipientName: userRecipient.name,
      userRecipientID: userRecipient.uuid,
      userSenderName: userSender.name,
      userSenderID: userSender.uuid,
      data: msg.content,
      timestamp: getTimestamp(msg.datetime!),
      respondingToUUID: respondingToUUID,
    };

    this.queue[room!.uuid][userRecipient.uuid].q.push(() =>
      this.callback(apiMessage)
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
