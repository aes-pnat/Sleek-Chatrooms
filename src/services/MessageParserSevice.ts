import UserDataStore from "../UsersDataStore";
import RoomDataStore from "../RoomsDataStore";
import { Message } from "../models/Message";

class MessageParserService {
  public parseMessage(msg: string) {
    // [USERNAME[:ANYTHING]]@ID /COMMAND [ARG [ARG [ARG [...]]]]
    // username, id, arg not /[A-Za-z0-9_\-]/
    let userName = msg.split("@")[0].split(":")[0];
    let roomCommandOrMessage = msg.split("@")[1];
    let roomName = roomCommandOrMessage.split(" ")[0];
    let content = roomCommandOrMessage.substring(roomName.length + 1);

    if (!UserDataStore.getUserByName(userName)) {
      UserDataStore.addUser(userName);
    }
    if (!RoomDataStore.getRoomByName(roomName)) {
      RoomDataStore.addRoom(roomName);
    }

    return new Message(
      content,
      UserDataStore.getUserByName(userName)!.uuid,
      RoomDataStore.getRoomByName(roomName)!.uuid,
      new Date()
    );
  }
}

export default new MessageParserService();
