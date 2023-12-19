import UsersDataStore from "./UsersDataStore";
import { Room } from "./models/Room";

class RoomDataStore {
  public rooms: Room[] = [];

  constructor() {
    this.addRoom("general", "public");
  }

  public addRoom(name: string, open: string) {
    this.rooms.push(new Room(name, open === "public"));
    this.getRoomByName(name)!.users.push(
      UsersDataStore.getUserByName("ANONYMOUS")!.uuid
    );
  }

  public getRoomByName(name: string) {
    return this.rooms.find((room) => room.name === name);
  }

  public getRoomById(uuid: string) {
    return this.rooms.find((room) => room.uuid === uuid);
  }

  public clearRooms() {
    this.rooms = [];
  }
}

export default new RoomDataStore();
