import { Room } from "./models/Room";

class RoomDataStore {
  public rooms: Room[] = [new Room("general", true)];

  public addRoom(name: string, open: string) {
    this.rooms.push(new Room(name, open === "public"));
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

  public clearRooms() {
    this.rooms = [];
  }
}

export default new RoomDataStore();
