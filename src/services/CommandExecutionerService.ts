import { Message } from "../models/Message";
import UserMessageQueueService from "./UserMessageQueueService";
import RoomsDataStore from "../RoomsDataStore";
import UsersDataStore from "../UsersDataStore";

class CommandExecutionerService {
  public executeCommand(msg: Message) {
    let command = msg.content.split(" ")[0].slice(1);
    let args = msg.content.split(" ").slice(1);
    let room = RoomsDataStore.getRoomById(msg.roomID)!;
    let sender = UsersDataStore.getUserById(msg.senderID)!;
    let server = UsersDataStore.getUserByName("SERVER")!;

    console.log(
      `{${sender.name}} Executing command: "${command}" with args: "${args}"`
    );
    let cmdResponse: Message;

    switch (command) {
      case "list":
        switch (args[0]) {
          case "rooms":
            cmdResponse = new Message(
              RoomsDataStore.rooms.map((room) => room.name).join(", "),
              server.uuid,
              room.uuid,
              new Date()
            );
            UserMessageQueueService.enqueue(sender.uuid, cmdResponse);
            break;

          case "users":
            cmdResponse = new Message(
              room.users
                .map((userID) => UsersDataStore.getUserById(userID))
                .join(", "),
              server.uuid,
              room.uuid,
              new Date()
            );
            UserMessageQueueService.enqueue(sender.uuid, cmdResponse);
            break;

          case "messages":
            cmdResponse = new Message(
              room.messages
                .map(
                  (message) =>
                    ` ${UsersDataStore.getUserById(message.senderID)!.name}: ${
                      message.content
                    }`
                )
                .join("\n"),
              server.uuid,
              room.uuid,
              new Date()
            );
            UserMessageQueueService.enqueue(sender.uuid, cmdResponse);
            break;

          default:
            console.log(`Argument "${args[0]}" invalid for command "list"`);
        }
        break;

      case "rename":
        switch (args[0]) {
          case "room":
            room.name = args[1];
            cmdResponse = new Message(
              `User ${sender.name} renamed room to "${args[1]}"`,
              server.uuid,
              room.uuid,
              new Date()
            );

            room.users.forEach((userRecipientID) => {
              UserMessageQueueService.enqueue(userRecipientID, cmdResponse);
            });

            room.messages.push(cmdResponse);
            break;

          case "self":
            sender.name = args[1];
            cmdResponse = new Message(
              `User ${sender.name} renamed themselves to "${args[1]}"`,
              server.uuid,
              room.uuid,
              new Date()
            );

            room.users.forEach((userRecipientID) => {
              UserMessageQueueService.enqueue(userRecipientID, cmdResponse);
            });

            room.messages.push(cmdResponse);
            break;

          default:
            console.log(`Argument "${args[0]}" invalid for command "rename"`);
        }
        break;

      default:
        console.log(`Command "${command}" invalid`);
    }
  }
}

export default new CommandExecutionerService();
