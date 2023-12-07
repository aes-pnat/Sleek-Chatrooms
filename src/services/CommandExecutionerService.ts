import { Message } from "../models/Message";
import RoomsDataStore from "../RoomsDataStore";
import UsersDataStore from "../UsersDataStore";
import SecurityDataStore from "../SecurityDataStore";
import SecurityService from "./SecurityService";

type ReturnCommand = { msg: Message; targetUsers: string[]; storeMsg: boolean };
class CommandExecutionerService {
  public executeCommand(msg: Message): ReturnCommand | undefined {
    let command = msg.content.split(" ")[0];
    let args = msg.content.split(" ").slice(1);
    let room = RoomsDataStore.getRoomById(msg.roomID)!;
    let sender = UsersDataStore.getUserById(msg.senderID)!;
    let isRegistered = SecurityDataStore.getUserById(sender.uuid);
    let server = UsersDataStore.getUserByName("SERVER")!;

    console.log(
      `{${sender.name}} Executing command: "${command}" with args: "${args}"`
    );

    let cmdResponse: Message;
    let cmdReturn: ReturnCommand;

    switch (command) {
      case "/create":
        switch (args[0]) {
          case "room":
            if (!args[1]) {
              console.log(`Argument "name" required for command "create room"`);
              break;
            }
            if (!isRegistered && !args[2]) {
              console.log(
                `Argument "public" required for command "create room" for unregistered users`
              );
              break;
            }
            RoomsDataStore.addRoom(args[1], args[2]);

            cmdResponse = new Message(
              `User ${sender.name} created a ${args[2] && "public"} room "${
                args[1]
              }"`,
              server.uuid,
              room.uuid,
              new Date()
            );
            cmdReturn = {
              msg: cmdResponse,
              targetUsers: room.users,
              storeMsg: true,
            };

            return cmdReturn;

          case "user":
            if (!UsersDataStore.getUserByName(args[1])) {
              UsersDataStore.addUser(args[1]);
            }
            let user = UsersDataStore.getUserByName(args[1])!;

            if (SecurityDataStore.getUserById(user.uuid)) {
              console.log(`User "${args[1]}" already registered`);
              break;
            }
            SecurityService.registerUser(user.uuid, args[2]);

            cmdResponse = new Message(
              `User ${sender.name} created user "${args[1]}"`,
              server.uuid,
              room.uuid,
              new Date()
            );

            cmdReturn = {
              msg: cmdResponse,
              targetUsers: room.users,
              storeMsg: true,
            };

            return cmdReturn;

          default:
            cmdResponse = new Message(
              `Argument "${args[0]}" invalid for command "create"`,
              server.uuid,
              room.uuid,
              new Date()
            );

            cmdReturn = {
              msg: cmdResponse,
              targetUsers: [sender.uuid],
              storeMsg: false,
            };
            return cmdReturn;
        }
        break;
      case "/list":
        switch (args[0]) {
          case "rooms":
            cmdResponse = new Message(
              RoomsDataStore.rooms
                .filter((room) => isRegistered || room.open)
                .map((room) => `[${room.name} : ${room.uuid}]`)
                .join(", "),
              server.uuid,
              room.uuid,
              new Date()
            );

            cmdReturn = {
              msg: cmdResponse,
              targetUsers: [sender.uuid],
              storeMsg: false,
            };

            return cmdReturn;

          case "users":
            cmdResponse = new Message(
              room.users
                .filter(
                  (userID) =>
                    isRegistered || !SecurityDataStore.getUserById(userID)
                )
                .map(
                  (userID) =>
                    `[${UsersDataStore.getUserById(userID)?.name} : ${userID}]`
                )
                .join(", "),
              server.uuid,
              room.uuid,
              new Date()
            );

            cmdReturn = {
              msg: cmdResponse,
              targetUsers: [sender.uuid],
              storeMsg: false,
            };

            return cmdReturn;

          case "messages":
            cmdResponse = new Message(
              room.messages
                .map(
                  (message) =>
                    `${UsersDataStore.getUserById(message.senderID)!.name}: ${
                      message.content
                    }`
                )
                .join("\n"),
              server.uuid,
              room.uuid,
              new Date()
            );

            cmdReturn = {
              msg: cmdResponse,
              targetUsers: [sender.uuid],
              storeMsg: false,
            };

            return cmdReturn;

          default:
            cmdResponse = new Message(
              `Argument "${args[0]}" invalid for command "list"`,
              server.uuid,
              room.uuid,
              new Date()
            );

            cmdReturn = {
              msg: cmdResponse,
              targetUsers: [sender.uuid],
              storeMsg: false,
            };
            return cmdReturn;
        }
        break;

      case "/rename":
        switch (args[0]) {
          case "room":
            room.name = args[1];
            cmdResponse = new Message(
              `User ${sender.name} renamed room to "${args[1]}"`,
              server.uuid,
              room.uuid,
              new Date()
            );

            cmdReturn = {
              msg: cmdResponse,
              targetUsers: room.users,
              storeMsg: true,
            };

            return cmdReturn;

          case "self":
            sender.name = args[1];
            cmdResponse = new Message(
              `User ${sender.name} renamed themselves to "${args[1]}"`,
              server.uuid,
              room.uuid,
              new Date()
            );

            cmdReturn = {
              msg: cmdResponse,
              targetUsers: room.users,
              storeMsg: true,
            };

            return cmdReturn;

          default:
            cmdResponse = new Message(
              `Argument "${args[0]}" invalid for command "rename"`,
              server.uuid,
              room.uuid,
              new Date()
            );

            cmdReturn = {
              msg: cmdResponse,
              targetUsers: [sender.uuid],
              storeMsg: false,
            };
            return cmdReturn;
        }
        break;

      default:
        cmdResponse = new Message(
          `Command "${command}" invalid`,
          server.uuid,
          room.uuid,
          new Date()
        );

        cmdReturn = {
          msg: cmdResponse,
          targetUsers: [sender.uuid],
          storeMsg: false,
        };
        return cmdReturn;
    }
  }
}

export default new CommandExecutionerService();
