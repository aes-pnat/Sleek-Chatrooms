import { Bot } from "./models/Bot";
import { Message } from "./models/Message";
import { User } from "./models/User";
import "colors";

export function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function colorByName(text: string, name: string) {
  switch (name) {
    case "SERVER":
      return text.bgRed;
    case "roger":
      return text.yellow;
    case "bobby":
      return text.blue;
    case "kerry":
      return text.cyan;
    case "steve":
      return text.red;
    case "echo":
      return text.magenta;
    default:
      return text;
  }
}

export async function messageCallback(user: User, msg: Message): Promise<void> {
  let alert;
  await wait(500 * (1 + Math.random()));
  if (msg.sender instanceof Bot) {
    alert = colorByName(
      `[${msg.getTimestamp()}] To "${user.name}" ::: Announcement in room "${
        msg.room.name
      }": ${msg.content}`,
      user.name
    );
  } else {
    alert = colorByName(
      `[${msg.getTimestamp()}] To "${user.name}" ::: "${
        msg.sender.name
      }" posted in "${msg.room.name}": "${msg.content}"`,
      user.name
    );
  }
  console.log(alert);
}

// export async function messageCallback(user: User, room: Room, msg: Message) {
//   let alert;
//   if (msg.sender instanceof Bot) {
//     alert = `To "${user.name}" ::: Announcement in room "${room.name}": ${msg.content}`;
//   } else {
//     alert = `To "${user.name}" ::: "${msg.sender.name}" posted in "${room.name}": "${msg.content}"`;
//   }

//   let userService = new UserService(user);
//   userService.appendToStream(room, alert);
//   await wait(1000 * (1 + Math.random()));
//   userService.handleMessage(alert);
// }
