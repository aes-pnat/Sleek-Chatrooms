import { Message } from "./Message";
import { Room } from "./Room";
import { State } from "./State";

const MessageQueue = (state: State, queue: string[]) => {
  queue.forEach((e) => {
    var pack = e.split("@")[1];
    var roomName = pack.split(" ")[0];
    var content = pack.substring(roomName.length + 1);

    var message = new Message(roomName, content);
    state.processMessage(message);
  });
  return state;
};

const queue = [
  `-@numb Hello?`,
  `-@happy Here's a little song I wrote`,
  `-@numb Hello ...`,
  `-@son Carry on, my wayward son`,
  `@numb Hello ...`,
  `@happy You might want to sing it note for note`,
  `@numb Is there anybody in there?`,
  `-@son There'll be peace when you are done`,
  `-@happy Don't worry,`,
  `-@numb Just nod if you can hear me`,
  `trash@son Lay your weary head to rest`,
  `junk@happy Be happy`,
  `-@son Don't you cry no more`,
  `-@numb Is there anyone home?`,
  `-@son BaDa-Da-Dum BaDa-Da-Da-Dum`,
];

let state = new State();

const result = MessageQueue(state, queue);

console.log(JSON.stringify(result, null, 2));
