import { Room } from "./Room";
import { Message } from "./Message";

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
      var queueItem = e.split("@")[1];
      var roomName = queueItem.split(" ")[0];
      var messageContent = queueItem.substring(roomName.length + 1);

      var message = new Message(messageContent);
      this.processMessage(message, roomName);
    });
  }
}
