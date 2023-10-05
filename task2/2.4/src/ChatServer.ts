import { Room } from "./Room";
import { Message } from "./Message";
import { User } from "./User";
import { Bot } from "./Bot";
import { Figure } from "./Figure";

export class ChatServer {
  private rooms: Record<string, Room> = {};
  private figures: Record<string, Figure> = { SERVER: new Bot("SERVER") };
  private msgCallback: (room: Room, msg: Message) => void;

  public getRooms(): Record<string, Room> {
    return this.rooms;
  }

  public setRooms(rooms: Record<string, Room>): void {
    this.rooms = rooms;
  }

  public getFigures(): Record<string, Figure> {
    return this.figures;
  }

  public setFigures(figures: Record<string, Figure>): void {
    this.figures = figures;
  }

  constructor(callback: (room: Room, msg: Message) => void) {
    this.msgCallback = callback;
  }

  public processMessage(fullMsg: string): void {
    var userName = fullMsg.split("@")[0].split(":")[0];
    var roomAndMessage = fullMsg.split("@")[1];
    var roomName = roomAndMessage.split(" ")[0];
    var messageContent = roomAndMessage.substring(roomName.length + 1);

    if (!Object.keys(this.figures).includes(userName)) {
      this.figures[userName] = new User(userName);
    }
    var message = new Message(
      messageContent,
      this.figures[userName],
      new Date()
    );

    if (!Object.keys(this.rooms).includes(roomName)) {
      this.rooms[roomName] = new Room(roomName);
    }
    if (!this.rooms[roomName].getUsers().includes(message.getSender())) {
      this.rooms[roomName].setUsers([
        ...this.rooms[roomName].getUsers(),
        message.getSender(),
      ]);
      this.rooms[roomName].addMessage(
        new Message(
          `"${message.getSender().getName()}" joined the room`,
          this.figures["SERVER"],
          new Date()
        )
      );
    }
    this.rooms[roomName].addMessage(message);
  }

  public printState(): string {
    var output = "";
    Object.keys(this.rooms).forEach((i) => {
      var currentRoom = this.rooms[i];
      output += `Room "${currentRoom.getName()}" messages:\n`;
      currentRoom.getMessages().forEach((j) => {
        output += `- [${j.getTimestamp()}] ${j
          .getSender()
          .getName()}: ${j.getContent()}\n`;
      });
      output += `\n`;
    });
    return output;
  }
}
