import { Message } from "../models/Message";
import { User } from "../models/User";
import userStore from "../UserStore";
import msgQueueService from "./UserMessageQueueService";

class RoomService {
  public msgToRoom(msg: Message): void {
    if (!(msg.sender instanceof User)) throw Error();

    /* Room join alert */
    if (!msg.room.users.includes(msg.sender)) {
      msg.room.users.push(msg.sender);
      let serverMessage = new Message(
        `"${msg.sender.name}" joined the room`,
        userStore.users["SERVER"],
        msg.room,
        new Date()
      );
      msg.room.users.forEach((userRecipient) => {
        msgQueueService.enqueue(userRecipient, serverMessage);
      });
      msg.room.messages.push(serverMessage);
    }

    /* Message itself */
    msg.room.users.forEach((userRecipient) => {
      msgQueueService.enqueue(userRecipient, msg);
    });

    msg.room.messages.push(msg);
  }
}

export default new RoomService();
