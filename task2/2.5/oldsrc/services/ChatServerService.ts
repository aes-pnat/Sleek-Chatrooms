import { ChatServer } from "../models/ChatServer";
import { MessageService } from "./MessageService";
import { RoomService } from "./RoomService";
import { UserService } from "./UserService";

export class ChatServerService {
  public chatServer: ChatServer = new ChatServer();
  public msgCallback: (
    user: UserService,
    room: RoomService,
    msg: MessageService
  ) => void;

  constructor(
    callback: (
      user: UserService,
      room: RoomService,
      msg: MessageService
    ) => void
  ) {
    this.msgCallback = callback;
  }

  public processMessage(fullMsg: string): void {
    let userName = fullMsg.split("@")[0].split(":")[0];
    let roomAndMessage = fullMsg.split("@")[1];
    let roomName = roomAndMessage.split(" ")[0];
    let messageContent = roomAndMessage.substring(roomName.length + 1);

    if (!this.chatServer.figures[userName]) {
      this.chatServer.figures[userName] = new UserService(userName);
    }
    let message = new MessageService(
      messageContent,
      this.chatServer.figures[userName] as UserService,
      new Date()
    );

    if (!this.chatServer.rooms[roomName]) {
      this.chatServer.rooms[roomName] = new RoomService(roomName);
    }

    if (!(message.message.sender instanceof User)) throw Error();
    if (!this.chatServer.rooms[roomName].users.includes(message.sender)) {
      this.chatServer.rooms[roomName].users = [
        ...this.chatServer.rooms[roomName].users,
        message.sender,
      ];
      let serverMessage = new MessageService(
        `"${message.sender.name}" joined the room`,
        this.chatServer.figures["SERVER"],
        new Date()
      );
      this.chatServer.rooms[roomName].users.forEach((userRecipient) => {
        this.msgCallback(
          userRecipient,
          this.chatServer.rooms[roomName],
          serverMessage
        );
      });
      this.chatServer.rooms[roomName].addMessage(serverMessage);
    }
    this.chatServer.rooms[roomName].users.forEach((userRecipient) => {
      this.msgCallback(userRecipient, this.chatServer.rooms[roomName], message);
    });
    this.chatServer.rooms[roomName].addMessage(message);
  }

  public printState(): string {
    let output = "";
    Object.keys(this.chatServer.rooms).forEach((i) => {
      let currentRoom = this.chatServer.rooms[i];
      output += `Room "${currentRoom.name}" messages:\n`;
      currentRoom.messages.forEach((j) => {
        output += `- [${j.getTimestamp()}] ${j.sender.name}: ${j.content}\n`;
      });
      output += `\n`;
    });
    return output;
  }
}
