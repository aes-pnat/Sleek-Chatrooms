import { Room } from "./models/Room";

class RoomDataStore {
  public rooms: Room[] = [];

  public addRoom(name: string) {
    this.rooms.push(new Room(name));
  }

  public getRoomByName(name: string) {
    return this.rooms.find((room) => room.name === name);
  }

  public getRoomById(uuid: string) {
    return this.rooms.find((room) => room.uuid === uuid);
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
