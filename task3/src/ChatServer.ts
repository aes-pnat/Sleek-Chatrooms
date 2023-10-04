import { Room } from "./Room";
import { Message } from "./Message";
import { User } from "./User";

export class ChatServer {
  public rooms: Record<string, Room> = {};

  private processMessage(msg: Message, roomName: string): void {
    if (!Object.keys(this.rooms).includes(roomName)) {
      this.rooms[roomName] = new Room(roomName, []);
    }
    this.rooms[roomName].addMessage(msg);
  }

  public processQueue(queue: string[]) {
    queue.forEach((e) => {
      var userName = e.split("@")[0].split(":")[0];
      var roomAndMessage = e.split("@")[1];
      var roomName = roomAndMessage.split(" ")[0];
      var messageContent = roomAndMessage.substring(roomName.length + 1);

      var message = new Message(messageContent, new User(userName), new Date());
      this.processMessage(message, roomName);
    });
  }
}
