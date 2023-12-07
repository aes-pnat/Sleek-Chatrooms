import { Message } from "../src/models/Message";
import UsersDataStore from "../src/UsersDataStore";
import SecurityDataStore from "../src/SecurityDataStore";
import RoomsDataStore from "../src/RoomsDataStore";
import CommandExecutionerService from "../src/services/CommandExecutionerService";
import { Room } from "../src/models/Room";
import SecurityService from "../src/services/SecurityService";

describe("CommandExecutionerService test", () => {
  beforeEach(() => {
    UsersDataStore.addUser("unregisteredUser");
    UsersDataStore.addUser("registeredUser");
    const user = UsersDataStore.getUserByName("registeredUser")!.uuid;
    SecurityService.registerUser(user, "registeredUserPassword");
    RoomsDataStore.getRoomByName("general")!.users.push(
      UsersDataStore.getUserByName("registeredUser")!.uuid
    );
    RoomsDataStore.getRoomByName("general")!.users.push(
      UsersDataStore.getUserByName("unregisteredUser")!.uuid
    );
  });

  afterEach(() => {
    UsersDataStore.clearUsers();
    UsersDataStore.fillUsers();

    SecurityDataStore.clearUsers();

    RoomsDataStore.clearRooms();
    RoomsDataStore.rooms = [new Room("general", true)];

    jest.clearAllMocks();
  });

  /////////////////////////////////////////////////////////////////////
  it("Invalid command", () => {
    const msg = new Message(
      "/invalidCommand",
      UsersDataStore.getUserByName("registeredUser")!.uuid,
      RoomsDataStore.getRoomByName("general")!.uuid,
      new Date()
    );
    const response = CommandExecutionerService.executeCommand(msg);

    expect(response!.msg.content).toBe(`Command "/invalidCommand" invalid`);
  });

  it("[CREATE] invalid argument for command", () => {
    const msg = new Message(
      "/create invalidArgument",
      UsersDataStore.getUserByName("registeredUser")!.uuid,
      RoomsDataStore.getRoomByName("general")!.uuid,
      new Date()
    );

    const response = CommandExecutionerService.executeCommand(msg);

    expect(response!.msg.content).toBe(
      `Argument "invalidArgument" invalid for command "create"`
    );
  });

  it("[CREATE] missing argument for room creation", () => {
    const msg = new Message(
      "/create room",
      UsersDataStore.getUserByName("registeredUser")!.uuid,
      RoomsDataStore.getRoomByName("general")!.uuid,
      new Date()
    );

    const response = CommandExecutionerService.executeCommand(msg);

    expect(response!.msg.content).toBe(
      `Argument "name" required for command "create room"`
    );
  });

  it("[CREATE] valid closed room creation by registered user", () => {
    const msg = new Message(
      "/create room testRoom",
      UsersDataStore.getUserByName("registeredUser")!.uuid,
      RoomsDataStore.getRoomByName("general")!.uuid,
      new Date()
    );

    const response = CommandExecutionerService.executeCommand(msg);

    expect(RoomsDataStore.getRoomByName("testRoom")).not.toBeUndefined();
    expect(response?.targetUsers.length).toBeGreaterThan(1);
    expect(response?.storeMsg).toBeTruthy();
  });

  it("[CREATE] invalid closed room creation by unregistered user", () => {
    const msg = new Message(
      "/create room testRoom",
      UsersDataStore.getUserByName("unregisteredUser")!.uuid,
      RoomsDataStore.getRoomByName("general")!.uuid,
      new Date()
    );

    const response = CommandExecutionerService.executeCommand(msg);

    expect(RoomsDataStore.getRoomByName("testRoom")).toBeUndefined();
    expect(response!.msg.content).toBe(
      `Argument "public" required for command "create room" for unregistered users`
    );
  });

  it("[CREATE] valid open room creation by unregistered user", () => {
    const msg = new Message(
      "/create room testRoom public",
      UsersDataStore.getUserByName("unregisteredUser")!.uuid,
      RoomsDataStore.getRoomByName("general")!.uuid,
      new Date()
    );

    const response = CommandExecutionerService.executeCommand(msg);

    expect(RoomsDataStore.getRoomByName("testRoom")).not.toBeUndefined();
    expect(response?.targetUsers.length).toBeGreaterThan(1);
    expect(response?.storeMsg).toBeTruthy();
  });

  it("[CREATE] missing name for user creation", () => {
    const msg = new Message(
      "/create user",
      UsersDataStore.getUserByName("registeredUser")!.uuid,
      RoomsDataStore.getRoomByName("general")!.uuid,
      new Date()
    );

    const response = CommandExecutionerService.executeCommand(msg);

    expect(response!.msg.content).toBe(
      `Argument "name" required for command "create user"`
    );
  });

  it("[CREATE] missing password for user creation", () => {
    const msg = new Message(
      "/create user newUser",
      UsersDataStore.getUserByName("registeredUser")!.uuid,
      RoomsDataStore.getRoomByName("general")!.uuid,
      new Date()
    );

    const response = CommandExecutionerService.executeCommand(msg);

    expect(response!.msg.content).toBe(
      `Argument "password" required for command "create user"`
    );
  });

  it("[CREATE] valid user creation by registered user", () => {
    const msg = new Message(
      "/create user newUser newUserPassword",
      UsersDataStore.getUserByName("registeredUser")!.uuid,
      RoomsDataStore.getRoomByName("general")!.uuid,
      new Date()
    );

    const response = CommandExecutionerService.executeCommand(msg);

    const user = UsersDataStore.getUserByName("newUser");
    expect(user).not.toBeUndefined();
    expect(SecurityDataStore.getUserById(user!.uuid)).not.toBeUndefined();
    expect(response?.targetUsers.length).toBeGreaterThan(1);
    expect(response?.storeMsg).toBeTruthy();
  });

  it("[CREATE] valid user creation by unregistered user", () => {
    const msg = new Message(
      "/create user newUser newUserPassword",
      UsersDataStore.getUserByName("unregisteredUser")!.uuid,
      RoomsDataStore.getRoomByName("general")!.uuid,
      new Date()
    );

    const response = CommandExecutionerService.executeCommand(msg);

    const user = UsersDataStore.getUserByName("newUser");
    expect(user).not.toBeUndefined();
    expect(SecurityDataStore.getUserById(user!.uuid)).not.toBeUndefined();
    expect(response?.targetUsers.length).toBeGreaterThan(1);
    expect(response?.storeMsg).toBeTruthy();
  });

  it("[CREATE] invalid duplicate user creation", () => {
    const msg = new Message(
      "/create user newUser newUserPassword1",
      UsersDataStore.getUserByName("unregisteredUser")!.uuid,
      RoomsDataStore.getRoomByName("general")!.uuid,
      new Date()
    );

    CommandExecutionerService.executeCommand(msg);

    const msg2 = new Message(
      "/create user newUser newUserPassword2",
      UsersDataStore.getUserByName("unregisteredUser")!.uuid,
      RoomsDataStore.getRoomByName("general")!.uuid,
      new Date()
    );
    const response = CommandExecutionerService.executeCommand(msg2);

    expect(response!.msg.content).toBe(`User "newUser" already registered`);
  });

  it("[LIST] invalid argument for command", () => {
    const msg = new Message(
      "/list invalidArgument",
      UsersDataStore.getUserByName("registeredUser")!.uuid,
      RoomsDataStore.getRoomByName("general")!.uuid,
      new Date()
    );

    const response = CommandExecutionerService.executeCommand(msg);

    expect(response!.msg.content).toBe(
      `Argument "invalidArgument" invalid for command "list"`
    );
  });

  it("[LIST] room listing for unregistered users", () => {
    const roomCreate = new Message(
      "/create room testRoom",
      UsersDataStore.getUserByName("registeredUser")!.uuid,
      RoomsDataStore.getRoomByName("general")!.uuid,
      new Date()
    );

    CommandExecutionerService.executeCommand(roomCreate);

    const msg = new Message(
      "/list rooms",
      UsersDataStore.getUserByName("unregisteredUser")!.uuid,
      RoomsDataStore.getRoomByName("general")!.uuid,
      new Date()
    );

    const response = CommandExecutionerService.executeCommand(msg);

    expect(response?.targetUsers.length).toBe(1);
    expect(response?.storeMsg).toBeFalsy();
    expect(response?.msg.content).toBe(
      `[general : ${RoomsDataStore.getRoomByName("general")!.uuid}]`
    );
  });

  it("[LIST] room listing for registered users", () => {
    const roomCreate = new Message(
      "/create room testRoom",
      UsersDataStore.getUserByName("registeredUser")!.uuid,
      RoomsDataStore.getRoomByName("general")!.uuid,
      new Date()
    );

    CommandExecutionerService.executeCommand(roomCreate);

    const msg = new Message(
      "/list rooms",
      UsersDataStore.getUserByName("registeredUser")!.uuid,
      RoomsDataStore.getRoomByName("general")!.uuid,
      new Date()
    );

    const response = CommandExecutionerService.executeCommand(msg);

    expect(response?.targetUsers.length).toBe(1);
    expect(response?.storeMsg).toBeFalsy();
    expect(response?.msg.content).toBe(
      `[general : ${
        RoomsDataStore.getRoomByName("general")!.uuid
      }], [testRoom : ${RoomsDataStore.getRoomByName("testRoom")!.uuid}]`
    );
  });

  it("[LIST] user listing for unregistered users", () => {
    const msg = new Message(
      "/list users",
      UsersDataStore.getUserByName("unregisteredUser")!.uuid,
      RoomsDataStore.getRoomByName("general")!.uuid,
      new Date()
    );

    const response = CommandExecutionerService.executeCommand(msg);

    expect(response?.targetUsers.length).toBe(1);
    expect(response?.storeMsg).toBeFalsy();
    expect(response?.msg.content).toBe(
      `[unregisteredUser : ${
        UsersDataStore.getUserByName("unregisteredUser")!.uuid
      }]`
    );
  });

  it("[LIST] user listing for registered users", () => {
    const msg = new Message(
      "/list users",
      UsersDataStore.getUserByName("registeredUser")!.uuid,
      RoomsDataStore.getRoomByName("general")!.uuid,
      new Date()
    );

    const response = CommandExecutionerService.executeCommand(msg);

    expect(response?.targetUsers.length).toBe(1);
    expect(response?.storeMsg).toBeFalsy();
    expect(response?.msg.content).toBe(
      `[registeredUser : ${
        UsersDataStore.getUserByName("registeredUser")!.uuid
      }], [unregisteredUser : ${
        UsersDataStore.getUserByName("unregisteredUser")!.uuid
      }]`
    );
  });

  it("[LIST] message listing for any users", () => {
    const genMsg = new Message(
      "/create room room1",
      UsersDataStore.getUserByName("registeredUser")!.uuid,
      RoomsDataStore.getRoomByName("general")!.uuid,
      new Date()
    );
    RoomsDataStore.getRoomByName("general")!.messages.push(genMsg);

    const msg = new Message(
      "/list messages",
      UsersDataStore.getUserByName("unregisteredUser")!.uuid,
      RoomsDataStore.getRoomByName("general")!.uuid,
      new Date()
    );

    const response = CommandExecutionerService.executeCommand(msg);

    expect(response?.targetUsers.length).toBe(1);
    expect(response?.storeMsg).toBeFalsy();
    expect(response?.msg.content).toBe(`registeredUser: /create room room1`);
  });

  it("[RENAME] invalid argument for command", () => {
    const msg = new Message(
      "/rename invalidArgument",
      UsersDataStore.getUserByName("registeredUser")!.uuid,
      RoomsDataStore.getRoomByName("general")!.uuid,
      new Date()
    );

    const response = CommandExecutionerService.executeCommand(msg);

    expect(response!.msg.content).toBe(
      `Argument "invalidArgument" invalid for command "rename"`
    );
  });

  it("[RENAME] missing argument for room renaming", () => {
    const msg = new Message(
      "/rename room",
      UsersDataStore.getUserByName("registeredUser")!.uuid,
      RoomsDataStore.getRoomByName("general")!.uuid,
      new Date()
    );

    const response = CommandExecutionerService.executeCommand(msg);

    expect(response!.msg.content).toBe(
      `Argument "roomName" required for command "rename room"`
    );
    expect(RoomsDataStore.getRoomByName("general")).not.toBeUndefined();
  });

  it("[RENAME] room renaming by registered user", () => {
    const msg = new Message(
      "/rename room generalRenamed",
      UsersDataStore.getUserByName("registeredUser")!.uuid,
      RoomsDataStore.getRoomByName("general")!.uuid,
      new Date()
    );

    const roomBefore = RoomsDataStore.getRoomByName("general")!;
    const response = CommandExecutionerService.executeCommand(msg);
    const roomAfter = RoomsDataStore.getRoomByName("generalRenamed")!;

    expect(roomBefore.uuid).toBe(roomAfter.uuid);
    expect(response?.targetUsers.length).toBeGreaterThan(1);
    expect(response?.storeMsg).toBeTruthy();
  });

  it("[RENAME] room renaming by unregistered user", () => {
    const msg = new Message(
      "/rename room generalRenamed",
      UsersDataStore.getUserByName("unregisteredUser")!.uuid,
      RoomsDataStore.getRoomByName("general")!.uuid,
      new Date()
    );

    const roomBefore = RoomsDataStore.getRoomByName("general")!;
    const response = CommandExecutionerService.executeCommand(msg);
    const roomAfter = RoomsDataStore.getRoomByName("generalRenamed")!;

    expect(roomBefore.uuid).toBe(roomAfter.uuid);
    expect(response?.targetUsers.length).toBeGreaterThan(1);
    expect(response?.storeMsg).toBeTruthy();
  });

  it("[RENAME] missing argument for self renaming", () => {
    const msg = new Message(
      "/rename self",
      UsersDataStore.getUserByName("registeredUser")!.uuid,
      RoomsDataStore.getRoomByName("general")!.uuid,
      new Date()
    );

    const response = CommandExecutionerService.executeCommand(msg);

    expect(response!.msg.content).toBe(
      `Argument "name" required for command "rename self"`
    );
    expect(UsersDataStore.getUserByName("registeredUser")).not.toBeUndefined();
  });

  it("[RENAME] self renaming to an existing user", () => {
    const msg = new Message(
      "/rename self unregisteredUser",
      UsersDataStore.getUserByName("registeredUser")!.uuid,
      RoomsDataStore.getRoomByName("general")!.uuid,
      new Date()
    );

    const response = CommandExecutionerService.executeCommand(msg);

    expect(response!.msg.content).toBe(
      `User with name "unregisteredUser" already exists`
    );
    expect(UsersDataStore.getUserByName("registeredUser")).not.toBeUndefined();
  });

  it("[RENAME] self renaming by registered user", () => {
    const msg = new Message(
      "/rename self registeredUserRenamed",
      UsersDataStore.getUserByName("registeredUser")!.uuid,
      RoomsDataStore.getRoomByName("general")!.uuid,
      new Date()
    );

    const userBefore = UsersDataStore.getUserByName("registeredUser")!;
    const response = CommandExecutionerService.executeCommand(msg);
    const userAfter = UsersDataStore.getUserByName("registeredUserRenamed")!;

    expect(userBefore.uuid).toBe(userAfter.uuid);
    expect(response?.targetUsers.length).toBeGreaterThan(1);
    expect(response?.storeMsg).toBeTruthy();
  });

  it("[RENAME] self renaming by unregistered user", () => {
    const msg = new Message(
      "/rename self unregisteredUserRenamed",
      UsersDataStore.getUserByName("unregisteredUser")!.uuid,
      RoomsDataStore.getRoomByName("general")!.uuid,
      new Date()
    );

    const userBefore = UsersDataStore.getUserByName("unregisteredUser")!;
    const response = CommandExecutionerService.executeCommand(msg);
    const userAfter = UsersDataStore.getUserByName("unregisteredUserRenamed")!;

    expect(userBefore.uuid).toBe(userAfter.uuid);
    expect(response?.targetUsers.length).toBeGreaterThan(1);
    expect(response?.storeMsg).toBeTruthy();
  });
});
