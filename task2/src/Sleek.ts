import { ChatServer } from "./ChatServer";

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

let state = new ChatServer();
state.processQueue(queue);

console.log(JSON.stringify(state, null, 2));
