import "colors";
import { Sleek } from "../models/Sleek";
import { ChatServerService } from "./ChatServerService";
import { messageCallback, wait } from "../utils";

class SleekService {
  public app: Sleek = new Sleek();

  async processQueue(queue: string[]) {
    let a = [];
    let server = new ChatServerService(messageCallback);
    this.app.servers = [...this.app.servers, server];
    for (const e of queue) {
      await wait(500 + 4000 * Math.random());
      a.push(e);
      console.log(`POSTing message: "${e}"`.green);
      server.processMessage(e);
    }
    console.log(server.printState());
  }
}

const queue = [
  `roger@numb Hello?`,
  `bobby@happy Here's a little song I wrote`,
  `echo@numb Hello ...`,
  `steve@son Carry on, my wayward son`,
  `echo:@numb Hello ...`,
  `bobby:@happy You might want to sing it note for note`,
  `roger:@numb Is there anybody in there?`,
  `steve@son There'll be peace when you are done`,
  `bobby@happy Don't worry,`,
  `roger@numb Just nod if you can hear me`,
  `steve:trash@son Lay your weary head to rest`,
  `bobby:junk@happy Be happy`,
  `steve@son Don't you cry no more`,
  `roger@numb Is there anyone home?`,
  `kerry@son BaDa-Da-Dum BaDa-Da-Da-Dum`,
];

const app = new SleekService();

app.processQueue(queue);
