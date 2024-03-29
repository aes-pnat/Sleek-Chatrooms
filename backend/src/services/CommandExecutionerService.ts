import { Message } from "../models/Message";
import RoomsDataStore from "../RoomsDataStore";
import UsersDataStore from "../UsersDataStore";
import SecurityDataStore from "../SecurityDataStore";
import SecurityService from "./SecurityService";
import { getTimestamp } from "../../utils";

type ReturnCommand = {
  msg: Message;
  targetUsers: string[];
  storeMsg: boolean;
  respondingToUUID: string;
};

class CommandExecutionerService {
  public executeCommand(msg: Message): ReturnCommand | undefined {
    let command = msg.content.split(" ")[0];
    let args = msg.content.split(" ").slice(1);
    let room = RoomsDataStore.getRoomById(msg.roomID)!;
    let sender = UsersDataStore.getUserById(msg.senderID)!;
    let isRegistered = SecurityDataStore.getUserById(sender.uuid);
    let server = UsersDataStore.getUserByName("SERVER")!;

    let cmdResponse: Message;
    let cmdReturn: ReturnCommand;

    switch (command) {
      case "/create":
        switch (args[0]) {
          case "room":
            if (!args[1]) {
              cmdResponse = new Message(
                `Argument "name" required for command "create room"`,
                server.uuid,
                room.uuid,
                new Date()
              );

              cmdReturn = {
                msg: cmdResponse,
                targetUsers: [sender.uuid],
                storeMsg: false,
                respondingToUUID: msg.uuid,
              };
              return cmdReturn;
            }
            if (!isRegistered && !args[2]) {
              cmdResponse = new Message(
                `Argument "public" required for command "create room" for unregistered users`,
                server.uuid,
                room.uuid,
                new Date()
              );

              cmdReturn = {
                msg: cmdResponse,
                targetUsers: [sender.uuid],
                storeMsg: false,
                respondingToUUID: msg.uuid,
              };
              return cmdReturn;
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
              respondingToUUID: msg.uuid,
            };

            return cmdReturn;

          case "user":
            if (!args[1]) {
              cmdResponse = new Message(
                `Argument "name" required for command "create user"`,
                server.uuid,
                room.uuid,
                new Date()
              );

              cmdReturn = {
                msg: cmdResponse,
                targetUsers: [sender.uuid],
                storeMsg: false,
                respondingToUUID: msg.uuid,
              };
              return cmdReturn;
            } else if (args[1] === "SERVER" || args[1] === "ANONYMOUS") {
              cmdResponse = new Message(
                `User name "${args[1]}" is reserved`,
                server.uuid,
                room.uuid,
                new Date(),
                "error"
              );

              cmdReturn = {
                msg: cmdResponse,
                targetUsers: [sender.uuid],
                storeMsg: false,
                respondingToUUID: msg.uuid,
              };
              return cmdReturn;
            } else if (!args[2]) {
              cmdResponse = new Message(
                `Argument "password" required for command "create user"`,
                server.uuid,
                room.uuid,
                new Date()
              );

              cmdReturn = {
                msg: cmdResponse,
                targetUsers: [sender.uuid],
                storeMsg: false,
                respondingToUUID: msg.uuid,
              };
              return cmdReturn;
            }

            if (!UsersDataStore.getUserByName(args[1])) {
              UsersDataStore.addUser(args[1]);
            }
            let user = UsersDataStore.getUserByName(args[1])!;

            if (SecurityDataStore.getUserById(user.uuid)) {
              cmdResponse = new Message(
                `User "${args[1]}" already registered`,
                server.uuid,
                room.uuid,
                new Date()
              );

              cmdReturn = {
                msg: cmdResponse,
                targetUsers: [sender.uuid],
                storeMsg: false,
                respondingToUUID: msg.uuid,
              };
              return cmdReturn;
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
              respondingToUUID: msg.uuid,
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
              respondingToUUID: msg.uuid,
            };
            return cmdReturn;
        }
        break;
      case "/list":
        switch (args[0]) {
          case "rooms":
            cmdResponse = new Message(
              "{"
                .concat(
                  RoomsDataStore.rooms
                    .filter((room) => isRegistered || room.open)
                    .map((room) => `"${room.uuid}":"${room.name}"`)
                    .join(", ")
                )
                .concat("}"),
              server.uuid,
              room.uuid,
              new Date()
            );

            cmdReturn = {
              msg: cmdResponse,
              targetUsers: [sender.uuid],
              storeMsg: false,
              respondingToUUID: msg.uuid,
            };

            return cmdReturn;

          case "users":
            cmdResponse = new Message(
              "{"
                .concat(
                  room.users
                    .filter(
                      (userID) =>
                        isRegistered || !SecurityDataStore.getUserById(userID)
                    )
                    .map(
                      (userID) =>
                        `"${userID}":"${
                          UsersDataStore.getUserById(userID)?.name
                        }"`
                    )
                    .join(", ")
                )
                .concat("}"),
              server.uuid,
              room.uuid,
              new Date()
            );

            cmdReturn = {
              msg: cmdResponse,
              targetUsers: [sender.uuid],
              storeMsg: false,
              respondingToUUID: msg.uuid,
            };

            return cmdReturn;

          case "messages":
            cmdResponse = new Message(
              "[".concat(
                room.messages
                  .map((roomMsg) =>
                    JSON.stringify({
                      content: roomMsg.content,
                      senderName: UsersDataStore.getUserById(roomMsg.senderID)
                        ?.name,
                      senderID: roomMsg.senderID,
                      roomName: RoomsDataStore.getRoomById(roomMsg.roomID)
                        ?.name,
                      roomID: roomMsg.roomID,
                      timestamp: getTimestamp(roomMsg.datetime),
                      isCommand: roomMsg.isCommand,
                      uuid: roomMsg.uuid,
                    })
                  )
                  .join(",")
                  .concat("]")
              ),
              server.uuid,
              room.uuid,
              new Date()
            );

            cmdReturn = {
              msg: cmdResponse,
              targetUsers: [sender.uuid],
              storeMsg: false,
              respondingToUUID: msg.uuid,
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
              respondingToUUID: msg.uuid,
            };
            return cmdReturn;
        }
        break;

      case "/rename":
        switch (args[0]) {
          case "room":
            if (!args[1]) {
              cmdResponse = new Message(
                `Argument "roomName" required for command "rename room"`,
                server.uuid,
                room.uuid,
                new Date()
              );

              cmdReturn = {
                msg: cmdResponse,
                targetUsers: [sender.uuid],
                storeMsg: false,
                respondingToUUID: msg.uuid,
              };
              return cmdReturn;
            } else if (RoomsDataStore.getRoomByName(args[1])) {
              cmdResponse = new Message(
                `Room with name "${args[2]}" already exists`,
                server.uuid,
                room.uuid,
                new Date()
              );

              cmdReturn = {
                msg: cmdResponse,
                targetUsers: [sender.uuid],
                storeMsg: false,
                respondingToUUID: msg.uuid,
              };
              return cmdReturn;
            }
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
              respondingToUUID: msg.uuid,
            };

            return cmdReturn;

          case "self":
            if (!args[1]) {
              cmdResponse = new Message(
                `Argument "name" required for command "rename self"`,
                server.uuid,
                room.uuid,
                new Date()
              );

              cmdReturn = {
                msg: cmdResponse,
                targetUsers: [sender.uuid],
                storeMsg: false,
                respondingToUUID: msg.uuid,
              };
              return cmdReturn;
            } else if (UsersDataStore.getUserByName(args[1])) {
              cmdResponse = new Message(
                `User with name "${args[1]}" already exists`,
                server.uuid,
                room.uuid,
                new Date()
              );

              cmdReturn = {
                msg: cmdResponse,
                targetUsers: [sender.uuid],
                storeMsg: false,
                respondingToUUID: msg.uuid,
              };
              return cmdReturn;
            }
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
              respondingToUUID: msg.uuid,
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
              respondingToUUID: msg.uuid,
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
          respondingToUUID: msg.uuid,
        };
        return cmdReturn;
    }
  }
}

export default new CommandExecutionerService();
