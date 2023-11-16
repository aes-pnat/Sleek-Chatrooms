import UserDataStore from "../UsersDataStore";
import RoomDataStore from "../RoomsDataStore";
import { Message } from "../models/Message";

class MessageParserService {
  public parseMessage(msg: string) {
    // [USERNAME[:ANYTHING]]@ID /COMMAND [ARG [ARG [ARG [...]]]]
    // username, id, arg not /[A-Za-z0-9_\-]/
    let userNameOrUUID = msg.split("@")[0].split(":")[0];
    let roomCommandOrMessage = msg.split("@")[1];
    let roomNameOrUUID = roomCommandOrMessage.split(" ")[0];
    let content = roomCommandOrMessage.substring(roomNameOrUUID.length + 1);

    let userID;
    let roomID;

    if (userNameOrUUID.length >= 30) {
      userID = userNameOrUUID;
    } else {
      if (!UserDataStore.getUserByName(userNameOrUUID)) {
        UserDataStore.addUser(userNameOrUUID);
      }
      userID = UserDataStore.getUserByName(userNameOrUUID)!.uuid;
    }

    if (roomNameOrUUID.length >= 30) {
      roomID = roomNameOrUUID;
    } else {
      if (!RoomDataStore.getRoomByName(roomNameOrUUID)) {
        RoomDataStore.addRoom(roomNameOrUUID);
      }
      roomID = RoomDataStore.getRoomByName(roomNameOrUUID)!.uuid;
    }

    return new Message(content, userID, roomID, new Date());
  }
}

export default new MessageParserService();
