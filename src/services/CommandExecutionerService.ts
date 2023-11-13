import { Message } from "../models/Message";
import UserMessageQueueService from "./UserMessageQueueService";
import RoomsDataStore from "../RoomsDataStore";
import UsersDataStore from "../UsersDataStore";

class CommandExecutionerService {
  public executeCommand(msg: Message) {
    let command = msg.content.split(" ")[0].slice(1);
    let args = msg.content.split(" ").slice(1);
    console.log(`Executing command: "${command}" with args: "${args}"`);
    let cmdResponse: Message;

    switch (command) {
      case "list":
        switch (args[0]) {
          case "rooms":
            cmdResponse = new Message(
              RoomsDataStore.rooms.map((room) => room.name).join(", "),
              UsersDataStore.getUserByName("SERVER")!,
              msg.room,
              new Date()
            );
            UserMessageQueueService.enqueue(msg.sender, cmdResponse);
            break;

          case "users":
            cmdResponse = new Message(
              msg.room.users.map((user) => user.name).join(", "),
              UsersDataStore.getUserByName("SERVER")!,
              msg.room,
              new Date()
            );
            UserMessageQueueService.enqueue(msg.sender, cmdResponse);
            break;

          case "messages":
            cmdResponse = new Message(
              msg.room.messages.map((message) => message.content).join("\n"),
              UsersDataStore.getUserByName("SERVER")!,
              msg.room,
              new Date()
            );
            UserMessageQueueService.enqueue(msg.sender, cmdResponse);
            break;

          default:
            console.log(`Argument "${args[0]}" invalid for command "list"`);
        }
        break;

      case "rename":
        switch (args[0]) {
          case "room":
            msg.room.name = args[1];
            cmdResponse = new Message(
              `User ${msg.sender.name} renamed room to "${args[1]}"`,
              UsersDataStore.getUserByName("SERVER")!,
              msg.room,
              new Date()
            );

            msg.room.users.forEach((userRecipient) => {
              UserMessageQueueService.enqueue(userRecipient, cmdResponse);
            });

            msg.room.messages.push(cmdResponse);
            break;

          case "self":
            msg.sender.name = args[1];
            cmdResponse = new Message(
              `User ${msg.sender.name} renamed themselves to "${args[1]}"`,
              UsersDataStore.getUserByName("SERVER")!,
              msg.room,
              new Date()
            );

            msg.room.users.forEach((userRecipient) => {
              UserMessageQueueService.enqueue(userRecipient, cmdResponse);
            });

            msg.room.messages.push(cmdResponse);
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
