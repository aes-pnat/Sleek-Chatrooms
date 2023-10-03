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

const MessageQueue = (queue: string[]) => {
  type StateType = {
    [key: string]: string[];
  };
  const state: StateType = {};

  queue.forEach((e) => {
    var pack = e.split("@")[1];
    var room = pack.split(" ")[0];
    var msg = pack.substring(room.length + 1);

    if (!Object.keys(state).includes(room)) {
      state[room] = [];
    }
    state[room] = [...state[room], msg];
  });
  return state;
};

console.log(JSON.stringify(MessageQueue(queue), null, 2));
