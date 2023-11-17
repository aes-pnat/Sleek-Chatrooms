import "colors";
import Parser from "./services/MessageParserSevice";
import RoomService from "./services/RoomService";
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
}

export default new Sleek();
