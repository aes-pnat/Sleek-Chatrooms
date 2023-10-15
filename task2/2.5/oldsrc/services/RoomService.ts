import { Room } from "../models/Room";
import { MessageService } from "./MessageService";

export class RoomService {
  public room: Room;

  constructor(name: string) {
    this.room = new Room(name);
  }

  public addMessage(msg: MessageService): void {
    this.room.messages.push(msg);
  }
}
