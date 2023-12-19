import App from "./src/Sleek";
import { messageCallback, wait } from "./utils";

const queue = [
  `roger@general /create room numb public`,
  `roger@general /create room son public`,
  `roger@numb Hello?`,
  `roger@numb /create user roger 1234`,
  `roger:1234@general /create room happy`,
  `echo@general /create user bobby 5678`,
  `bobby:5678@happy Here's a little song I wrote`,
  `echo@numb Hello ...`,
  `steve@son Carry on, my wayward son`,
  `echo:@numb Hello ...`,
  `echo:@numb /list rooms`,
  `bobby:5678@happy You might want to sing it note for note`,
  `roger:1234@numb Is there anybody in there?`,
  `steve@son There'll be peace when you are done`,
  `bobby:5678@happy Don't worry,`,
  `roger:1234@numb Just nod if you can hear me`,
  `steve:trash@son Lay your weary head to rest`,
  `bobby:5678@happy Be happy`,
  `@happy Be happy`,
  `steve@son Don't you cry no more`,
  `roger:1234@numb Is there anyone home?`,
  `kerry@son BaDa-Da-Dum BaDa-Da-Da-Dum`,
];

App.setOutputChannel(messageCallback);

const main = async (queue: string[]) => {
  for (const e of queue) {
    await wait(500 * (1 + Math.random()));
    App.acceptMessage(e);
  }
};

main(queue);
