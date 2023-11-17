import UserDataStore from "../UsersDataStore";
import RoomDataStore from "../RoomsDataStore";
import { Message } from "../models/Message";
import SecurityService from "./SecurityService";
import SecurityDataStore from "../SecurityDataStore";

class MessageParserService {
  public parseMessage(msg: string) {
    // [USERNAME[:AUTH]]@ID /COMMAND [ARG [ARG [ARG [...]]]]
    // username, id, arg not /[A-Za-z0-9_\-]/
    let userAndAuth = msg.split("@")[0];
    let userNameOrUUID = userAndAuth.split(":")[0];
    let auth = userAndAuth.substring(userNameOrUUID.length + 1);

    let roomCommandOrMessage = msg.split("@")[1];
    let roomNameOrUUID = roomCommandOrMessage.split(" ")[0];
    let content = roomCommandOrMessage.substring(roomNameOrUUID.length + 1);

    let userID;
    let roomID;

    // determine whether uuid or username, check validity of uuid
    if (userNameOrUUID.length >= 30) {
      if (!UserDataStore.getUserById(userNameOrUUID)) {
        throw new Error("User not found");
      }
      userID = userNameOrUUID;
    } else {
      if (!UserDataStore.getUserByName(userNameOrUUID)) {
        UserDataStore.addUser(userNameOrUUID);
      }
      userID = UserDataStore.getUserByName(userNameOrUUID)!.uuid;
    }

    // determine whether uuid or roomname, check validity of both
    if (roomNameOrUUID.length >= 30) {
      if (!RoomDataStore.getRoomById(roomNameOrUUID)) {
        throw new Error("Room not found");
      }
      roomID = roomNameOrUUID;
    } else {
      if (!RoomDataStore.getRoomByName(roomNameOrUUID)) {
        throw new Error("Room not found");
      }
      roomID = RoomDataStore.getRoomByName(roomNameOrUUID)!.uuid;
    }

    // check if room is open and if auth is provided
    if (!auth && !RoomDataStore.getRoomById(roomID)!.open) {
      throw new Error("Room is not open (requires authentication)");
    }

    // if user entered an username and exists within the store with passwords, check password validity
    if (
      userNameOrUUID &&
      SecurityDataStore.getUserById(userNameOrUUID) &&
      !SecurityService.checkValidPassword(userNameOrUUID, auth)
    ) {
      throw new Error("Invalid password");
    }

    return new Message(content, userID, roomID, new Date());
  }
}

export default new MessageParserService();
