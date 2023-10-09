import { Room } from "./Room";
import { Message } from "./Message";
import { User } from "./User";
import { Bot } from "./Bot";
import { Figure } from "./Figure";

export class ChatServer {
  private _rooms: Record<string, Room> = {};
  private _figures: Record<string, Figure> = { SERVER: new Bot("SERVER") };
  private _msgCallback: (user: User, room: Room, msg: Message) => void;

  public get figures(): Record<string, Figure> {
    return this._figures;
  }
  public set figures(value: Record<string, Figure>) {
    this._figures = value;
  }
  public get rooms(): Record<string, Room> {
    return this._rooms;
  }
  public set rooms(value: Record<string, Room>) {
    this._rooms = value;
  }
  public get msgCallback(): (user: User, room: Room, msg: Message) => void {
    return this._msgCallback;
  }
  public set msgCallback(
    value: (user: User, room: Room, msg: Message) => void
  ) {
    this._msgCallback = value;
  }

  constructor(callback: (user: User, room: Room, msg: Message) => void) {
    this._msgCallback = callback;
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
    if (!this.rooms[roomName].users.includes(message.sender)) {
      this.rooms[roomName].users = [
        ...this.rooms[roomName].users,
        message.sender,
      ];
      var serverMessage = new Message(
        `"${message.sender.name}" joined the room`,
        this.figures["SERVER"],
        new Date()
      );
      this.rooms[roomName].users.forEach((userRecipient) => {
        this.msgCallback(userRecipient, this.rooms[roomName], serverMessage);
      });
      this.rooms[roomName].addMessage(serverMessage);
    }
    this.rooms[roomName].users.forEach((userRecipient) => {
      this.msgCallback(userRecipient, this.rooms[roomName], message);
    });
    this.rooms[roomName].addMessage(message);
  }

  public printState(): string {
    var output = "";
    Object.keys(this.rooms).forEach((i) => {
      var currentRoom = this.rooms[i];
      output += `Room "${currentRoom.name}" messages:\n`;
      currentRoom.messages.forEach((j) => {
        output += `- [${j.getTimestamp()}] ${j.sender.name}: ${j.content}\n`;
      });
      output += `\n`;
    });
    return output;
  }
}
