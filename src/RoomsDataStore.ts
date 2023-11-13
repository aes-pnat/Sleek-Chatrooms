import { Room } from "./models/Room";

class RoomDataStore {
  public rooms: Room[] = [];

  public addRoom(name: string) {
    this.rooms.push(new Room(this.rooms.length + 1, name));
  }

  public getRoomByName(name: string) {
    return this.rooms.find((room) => room.name === name);
  }

  public getUsersFromRoom(roomName: string) {
    let room = this.getRoomByName(roomName);
    if (!room) {
      return [];
    }
    return room.users;
  }
}

export default new RoomDataStore();
