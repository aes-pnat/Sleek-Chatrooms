import { ChatServer } from "./ChatServer";
import { Message } from "./Message";

function printState(state: ChatServer): string {
  var output = "";
  Object.keys(state.rooms).forEach((i) => {
    var currentRoom = state.rooms[i];
    output += `Room "${currentRoom.name}" messages:\n`;
    currentRoom.messages.forEach((j) => {
      j instanceof Message
        ? (output += `- [${j.getTimestamp()}] ${j.sender.userName}: ${
            j.content
          }\n`)
        : (output += `- [${j.getTimestamp()}] SERVER: ${j.content}\n`);
    });
    output += `\n`;
  });
  return output;
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

let state = new ChatServer();
state.processQueue(queue);

console.log(printState(state));
