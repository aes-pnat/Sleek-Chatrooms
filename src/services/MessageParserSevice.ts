import userStore from "../UsersDataStore";
import roomStore from "../RoomsDataStore";
import { Message } from "../models/Message";

class MessageParserService {
  public parseMessage(msg: string) {
    // [USERNAME[:ANYTHING]]@ID /COMMAND [ARG [ARG [ARG [...]]]]
    // username, id, arg not /[A-Za-z0-9_\-]/
    let userName = msg.split("@")[0].split(":")[0];
    let roomCommandOrMessage = msg.split("@")[1];
    let roomName = roomCommandOrMessage.split(" ")[0];
    let content = roomCommandOrMessage.substring(roomName.length + 1);

    if (!userStore.getUserByName(userName)) {
      userStore.addUser(userName);
    }
    if (!roomStore.getRoomByName(roomName)) {
      roomStore.addRoom(roomName);
    }

    return new Message(
      content,
      userStore.getUserByName(userName)!,
      roomStore.getRoomByName(roomName)!,
      new Date()
    );
  }
}

export default new MessageParserService();
