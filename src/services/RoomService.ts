import { Message } from "../models/Message";
import { User } from "../models/User";
import RoomsDataStore from "../RoomsDataStore";
import UserDataStore from "../UsersDataStore";
import CommandExecutionerService from "./CommandExecutionerService";
import UserMessageQueueService from "./UserMessageQueueService";

class RoomService {
  public msgToRoom(msg: Message) {
    let sender = UserDataStore.getUserById(msg.senderID);
    let room = RoomsDataStore.getRoomById(msg.roomID);

    if (!sender) throw Error(`Sender not found on message: ${msg}`);
    if (!room) throw Error(`Room not found on message: ${msg}`);

    if (!(sender instanceof User)) throw Error();

    /* Room join alert */
    if (!room.users.includes(sender.uuid)) {
      room.users.push(sender.uuid);

      let serverMessage = new Message(
        `"${sender.name}" joined the room`,
        UserDataStore.getUserByName("SERVER")!.uuid,
        room.uuid,
        new Date()
      );

      room.users.forEach((userRecipientID) => {
        UserMessageQueueService.enqueue(userRecipientID, serverMessage);
      });
      room.messages.push(serverMessage);
    }

    if (msg.isCommand) {
      /* Command */
      CommandExecutionerService.executeCommand(msg);
    } else {
      /* Message itself */
      room.users.forEach((userRecipient) => {
        UserMessageQueueService.enqueue(userRecipient, msg);
      });

      room.messages.push(msg);
    }
  }
}

export default new RoomService();
