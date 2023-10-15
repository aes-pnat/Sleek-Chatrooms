import { MessageService } from "./services/MessageService";
import { RoomService } from "./services/RoomService";
import { UserService } from "./services/UserService";

export function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function messageCallback(
  user: UserService,
  room: RoomService,
  msg: MessageService
) {
  let alert;
  if (msg.message.sender instanceof Bot) {
    alert = `To "${user.user.name}" ::: Announcement in room "${room.name}": ${msg.content}`;
  } else {
    alert = `To "${user.name}" ::: "${msg.sender.name}" posted in "${room.name}": "${msg.content}"`;
  }

  user.appendToStream(room, alert);
  await wait(1000 * (1 + Math.random()));
  user.msgStreamRepo[room.name].handleMessage(alert);
}
