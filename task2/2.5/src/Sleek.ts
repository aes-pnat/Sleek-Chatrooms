import "colors";
import { ChatServerService } from "./services/ChatServerService";
import { messageCallback } from "./utils";

class Sleek {
  public server: ChatServerService = new ChatServerService();

  async acceptMessage(msg: string) {
    console.log(`POSTing message: "${msg}"`.white.bgGreen);
    this.server.processMessage(msg);
  }
}

export default new Sleek();
