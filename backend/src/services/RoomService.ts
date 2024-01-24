import { Message } from "../models/Message";
import RoomsDataStore from "../RoomsDataStore";
import UserDataStore from "../UsersDataStore";
import CommandExecutionerService from "./CommandExecutionerService";
import UserMessageQueueService from "./UserMessageQueueService";

const crypto = require("crypto");
export class RoomService {
  public msgToRoom(msg: Message) {
    let sender = UserDataStore.getUserById(msg.senderID);
    let room = RoomsDataStore.getRoomById(msg.roomID);

    if (!sender) throw Error(`Sender not found on message: ${msg}`);
    if (!room) throw Error(`Room not found on message: ${msg}`);

    /* Room join alert */
    if (!room.users.includes(sender.uuid)) {
      room.users.push(sender.uuid);

      let serverMessage = new Message(
        `"${sender.name}" joined the room`,
        UserDataStore.getUserByName("SERVER")!.uuid,
        room.uuid,
        msg.datetime
      );

      room.users.forEach((userRecipientID) => {
        UserMessageQueueService.enqueue(
          userRecipientID,
          serverMessage,
          serverMessage.uuid
        );
      });
      room.messages.push(serverMessage);
    }

    if (msg.isCommand) {
      /* Command */
      let command = CommandExecutionerService.executeCommand(msg);
      if (!command) return;
      command.targetUsers.forEach((userRecipientID) => {
        UserMessageQueueService.enqueue(
          userRecipientID,
          command!.msg,
          command!.respondingToUUID
        );
      });
      if (command?.storeMsg) {
        room.messages.push(msg);
        room.messages.push(command!.msg);
      }
    } else {
      /* Message itself */
      room.users.forEach((userRecipient) => {
        UserMessageQueueService.enqueue(userRecipient, msg, msg.uuid);
      });

      room.messages.push(msg);
    }
  }
}

export default new RoomService();
