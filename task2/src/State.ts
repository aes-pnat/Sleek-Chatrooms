import { Room } from "./Room";
import { Message } from "./Message";

export class State {
  rooms: { [key: string]: Room };

  constructor() {
    this.rooms = {};
  }

  processMessage(msg: Message): void {
    Object.keys(this.rooms).includes(msg.roomName)
      ? this.rooms[msg.roomName].addMessage(msg)
      : (this.rooms[msg.roomName] = new Room(msg.roomName, []));
    this.rooms[msg.roomName].addMessage(msg);
  }
}
