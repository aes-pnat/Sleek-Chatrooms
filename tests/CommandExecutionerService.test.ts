import { Message } from "../src/models/Message";
import UsersDataStore from "../src/UsersDataStore";
import SecurityDataStore from "../src/SecurityDataStore";
import RoomsDataStore from "../src/RoomsDataStore";
import CommandExecutionerService from "../src/services/CommandExecutionerService";
import UserMessageQueueService from "../src/services/UserMessageQueueService";
import { User } from "../src/models/User";
import { Room } from "../src/models/Room";

describe("Various commands testing", () => {
  beforeEach(() => {
    UsersDataStore.addUser("unregisteredUser");
    UsersDataStore.addUser("registeredUser");
    const user = UsersDataStore.getUserByName("registeredUser")!.uuid;
    SecurityDataStore.addUser(user, "registeredUserPassword");
  });

  afterEach(() => {
    UsersDataStore.clearUsers();
    UsersDataStore.users = [new User("SERVER", true)];

    SecurityDataStore.clearUsers();

    RoomsDataStore.clearRooms();
    RoomsDataStore.rooms = [new Room("general", true)];

    jest.clearAllMocks();
  });

  it("[CREATE] valid closed room creation by registered user", () => {
    const msg = new Message(
      "/create room testRoom",
      UsersDataStore.getUserByName("registeredUser")!.uuid,
      RoomsDataStore.getRoomByName("general")!.uuid,
      new Date()
    );

    CommandExecutionerService.executeCommand(msg);

    expect(RoomsDataStore.getRoomByName("testRoom")).not.toBeUndefined();
  });

  it("[CREATE] invalid closed room creation by unregistered user", () => {
    const msg = new Message(
      "/create room testRoom",
      UsersDataStore.getUserByName("unregisteredUser")!.uuid,
      RoomsDataStore.getRoomByName("general")!.uuid,
      new Date()
    );

    CommandExecutionerService.executeCommand(msg);

    expect(RoomsDataStore.getRoomByName("testRoom")).toBeUndefined();
  });

  it("[CREATE] valid open room creation by unregistered user", () => {
    const msg = new Message(
      "/create room testRoom public",
      UsersDataStore.getUserByName("unregisteredUser")!.uuid,
      RoomsDataStore.getRoomByName("general")!.uuid,
      new Date()
    );

    CommandExecutionerService.executeCommand(msg);

    expect(RoomsDataStore.getRoomByName("testRoom")).not.toBeUndefined();
  });

  it("[CREATE] valid user creation", () => {
    const msg1 = new Message(
      "/create user newUser1 newUser1Password",
      UsersDataStore.getUserByName("unregisteredUser")!.uuid,
      RoomsDataStore.getRoomByName("general")!.uuid,
      new Date()
    );

    CommandExecutionerService.executeCommand(msg1);

    const msg2 = new Message(
      "/create user newUser2 newUser2Password",
      UsersDataStore.getUserByName("registeredUser")!.uuid,
      RoomsDataStore.getRoomByName("general")!.uuid,
      new Date()
    );

    CommandExecutionerService.executeCommand(msg2);

    expect(UsersDataStore.getUserByName("newUser1")).not.toBeUndefined();
    expect(SecurityDataStore.getUserById("newUser1")).not.toBeUndefined();

    expect(UsersDataStore.getUserByName("newUser2")).not.toBeUndefined();
    expect(SecurityDataStore.getUserById("newUser2")).not.toBeUndefined();
  });

  it("[LIST] valid room listing", async () => {
    const consoleSpy = jest.spyOn(console, "log");
    const time = new Date();
    const msg = new Message(
      "/list rooms",
      UsersDataStore.getUserByName("registeredUser")!.uuid,
      RoomsDataStore.getRoomByName("general")!.uuid,
      time
    );

    CommandExecutionerService.executeCommand(msg);

    //await new Promise((r) => setTimeout(r, 4000));

    expect(consoleSpy).toHaveBeenCalledWith(
      `[${time}] To "registeredUser" ::: Announcement in room "general": general`
    );
  });
});
