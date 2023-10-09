import { Bot } from "./Bot";
import { ChatServer } from "./ChatServer";
import { Message } from "./Message";
import { Room } from "./Room";
import { User } from "./User";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function messageCallback(user: User, room: Room, msg: Message) {
  sleep(500 * (1 + Math.random()));
  if (msg.sender instanceof Bot) {
    console.log(
      `To "${user.name}" ::: Announcement in room "${room.name}": ${msg.content}`
    );
  } else {
    console.log(
      `To "${user.name}" ::: "${msg.sender.name}" posted in "${room.name}": "${msg.content}"`
    );
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

async function processQueue(queue: string[]) {
  let state = new ChatServer(messageCallback);
  for (const e of queue) {
    await sleep(1000 * (1 + Math.random()));
    console.log(`\nPOSTing message: "${e}"`);
    state.processMessage(e);
  }
  console.log(state.printState());
}

processQueue(queue);
