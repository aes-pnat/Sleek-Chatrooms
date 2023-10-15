import Parser from "../MessageParser";
import roomService from "./RoomService";
import roomStore from "../RoomStore";

export class ChatServerService {
  public processMessage(fullMsg: string): void {
    let parsedMessage = Parser.parseMessage(fullMsg);
    roomService.msgToRoom(parsedMessage);
  }

  public printState(): string {
    let output = "";
    Object.keys(roomStore.rooms).forEach((i) => {
      let currentRoom = roomStore.rooms[i];
      output += `Room "${currentRoom.name}" messages:\n`;
      currentRoom.messages.forEach((j) => {
        output += `- [${j.getTimestamp()}] ${j.sender.name}: ${j.content}\n`;
      });
      output += `\n`;
    });
    return output;
  }
}
