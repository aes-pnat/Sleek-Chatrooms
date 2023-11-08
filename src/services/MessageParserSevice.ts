import userStore from "../UsersDataStore";
import roomStore from "../RoomsDataStore";
import { Message } from "../models/Message";

class MessageParserService {
  public parseMessage(msg: string) {
    let userName = msg.split("@")[0].split(":")[0];
    let roomAndMessage = msg.split("@")[1];
    let roomName = roomAndMessage.split(" ")[0];
    let content = roomAndMessage.substring(roomName.length + 1);

    if (!userStore.users[userName]) {
      userStore.addUser(userName);
    }
    if (!roomStore.rooms[roomName]) {
      roomStore.addRoom(roomName);
    }
    return new Message(
      content,
      userStore.users[userName],
      roomStore.rooms[roomName],
      new Date()
    );
  }
}

export default new MessageParserService();
