import "colors";
import Parser from "./services/MessageParserSevice";
import RoomService from "./services/RoomService";
import RoomDataStore from "./RoomsDataStore";
import UserMessageQueueService from "./services/UserMessageQueueService";

class Sleek {
  public setOutputChannel(callback: Function) {
    UserMessageQueueService.callback = callback;
  }

  public async acceptMessage(msg: string) {
    console.log(`POSTing message: "${msg}"`.white.bgGreen);
    let parsedMessage = Parser.parseMessage(msg);
    RoomService.msgToRoom(parsedMessage);
  }

  public printState(): string {
    let output = "";
    RoomDataStore.rooms.forEach((currentRoom) => {
      output += `Room "${currentRoom.name}" messages:\n`;
      currentRoom.messages.forEach((j) => {
        output += `- [${j.getTimestamp()}] ${j.sender.name}: ${j.content}\n`;
      });
      output += `\n`;
    });
    return output;
  }
}

export default new Sleek();
