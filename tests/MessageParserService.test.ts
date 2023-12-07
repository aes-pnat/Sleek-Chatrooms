import RoomsDataStore from "../src/RoomsDataStore";
import SecurityDataStore from "../src/SecurityDataStore";
import UsersDataStore from "../src/UsersDataStore";
import { Room } from "../src/models/Room";
import { User } from "../src/models/User";
import MessageParserService from "../src/services/MessageParserSevice";
import SecurityService from "../src/services/SecurityService";

describe("MessageParserService test", () => {
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

  it("parses message with username and roomname successfully", () => {
    const msg = "unregisteredUser@general Hello";
    const parsedMessage = MessageParserService.parseMessage(msg);
    expect(parsedMessage.content).toBe("Hello");
    expect(parsedMessage.roomID).toBe(
      RoomsDataStore.getRoomByName("general")!.uuid
    );
    expect(parsedMessage.senderID).toBe(
      UsersDataStore.getUserByName("unregisteredUser")!.uuid
    );
  });

  it("parses message with userID successfully", () => {
    const uid = UsersDataStore.getUserByName("unregisteredUser")!.uuid;
    const msg = `${uid}@general Hello`;

    const parsedMessage = MessageParserService.parseMessage(msg);

    expect(parsedMessage.content).toBe("Hello");
    expect(parsedMessage.roomID).toBe(
      RoomsDataStore.getRoomByName("general")!.uuid
    );
    expect(parsedMessage.senderID).toBe(uid);
  });

  it("invalid userID throws error", () => {
    const msg = `6e5f304e-a15a-4bf3-b362-00e554ff3846@general Hello`;

    expect(() => MessageParserService.parseMessage(msg)).toThrow(
      "User not found"
    );
  });

  it("parses message with roomID successfully", () => {
    const rid = RoomsDataStore.getRoomByName("general")!.uuid;
    const msg = `unregisteredUser@${rid} Hello`;

    const parsedMessage = MessageParserService.parseMessage(msg);

    expect(parsedMessage.content).toBe("Hello");
    expect(parsedMessage.roomID).toBe(rid);
    expect(parsedMessage.senderID).toBe(
      UsersDataStore.getUserByName("unregisteredUser")!.uuid
    );
  });

  it("invalid roomID throws error", () => {
    const msg = `unregisteredUser@6e5f304e-a15a-4bf3-b362-00e554ff3846 Hello`;

    expect(() => MessageParserService.parseMessage(msg)).toThrow(
      "Room not found"
    );
  });

  it("invalid roomname throws error", () => {
    const msg = `unregisteredUser@invalidRoom Hello`;

    expect(() => MessageParserService.parseMessage(msg)).toThrow(
      "Room not found"
    );
  });

  it("adds new user to UsersStore if user does not exist", () => {
    const msg = `newUser@general Hello`;
    MessageParserService.parseMessage(msg);

    expect(UsersDataStore.getUserByName("newUser")).not.toBeUndefined();
  });

  it("user without password cannot join closed room", () => {
    RoomsDataStore.rooms.push(new Room("closedRoom", false));
    const msg = `unregisteredUser@closedRoom Hello`;

    expect(() => MessageParserService.parseMessage(msg)).toThrow(
      "Room is not open (requires authentication)"
    );
  });

  it("registered user with correct password can join closed room", () => {
    RoomsDataStore.rooms.push(new Room("closedRoom", false));
    const msg = `registeredUser:registeredUserPassword@closedRoom Hello`;

    const parsedMessage = MessageParserService.parseMessage(msg);

    expect(parsedMessage.content).toBe("Hello");
    expect(parsedMessage.roomID).toBe(
      RoomsDataStore.getRoomByName("closedRoom")!.uuid
    );
    expect(parsedMessage.senderID).toBe(
      UsersDataStore.getUserByName("registeredUser")!.uuid
    );
  });

  it("registered user with wrong password cannot join closed room", () => {
    RoomsDataStore.rooms.push(new Room("closedRoom", false));
    const msg = `registeredUser:wrongPassword@closedRoom Hello`;

    expect(() => MessageParserService.parseMessage(msg)).toThrow(
      "Invalid password"
    );
  });
});
