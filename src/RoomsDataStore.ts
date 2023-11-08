import { Room } from "./models/Room";

class RoomStore {
  public rooms: Record<string, Room> = {};

  public addRoom(name: string) {
    this.rooms[name] = new Room(name);
  }
}

export default new RoomStore();
