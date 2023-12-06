import { Message } from "../src/models/Message";
import UsersDataStore from "../src/UsersDataStore";
import SecurityDataStore from "../src/SecurityDataStore";
import RoomsDataStore from "../src/RoomsDataStore";
import CommandExecutionerService from "../src/services/CommandExecutionerService";
import { User } from "../src/models/User";
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
    UsersDataStore.users = [new User("SERVER", true)];

    SecurityDataStore.clearUsers();

    RoomsDataStore.clearRooms();
    RoomsDataStore.rooms = [new Room("general", true)];

    jest.clearAllMocks();
  });

  /////////////////////////////////////////////////////////////////////

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
    expect(response).toBeUndefined();
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

  it("[CREATE] valid user creation by registered user", () => {
    const msg = new Message(
      "/create user newUser newUserPassword",
      UsersDataStore.getUserByName("registeredUser")!.uuid,
      RoomsDataStore.getRoomByName("general")!.uuid,
      new Date()
    );

    const response = CommandExecutionerService.executeCommand(msg);
    console.log(UsersDataStore.users);
    console.log(SecurityDataStore.securityUsers);

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
    expect(response?.msg.content).toBe(`general`);
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
    expect(response?.msg.content).toBe(`general, testRoom`);
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
    expect(response?.msg.content).toBe(`unregisteredUser`);
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
    expect(response?.msg.content).toBe(`registeredUser, unregisteredUser`);
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
