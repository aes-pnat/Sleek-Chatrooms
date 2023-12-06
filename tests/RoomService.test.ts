import RoomsDataStore from "../src/RoomsDataStore";
import SecurityDataStore from "../src/SecurityDataStore";
import UsersDataStore from "../src/UsersDataStore";
import { Message } from "../src/models/Message";
import { Room } from "../src/models/Room";
import { User } from "../src/models/User";
import RoomService from "../src/services/RoomService";
import SecurityService from "../src/services/SecurityService";
import UserMessageQueueService from "../src/services/UserMessageQueueService";

describe("RoomService test", () => {
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
    RoomsDataStore.addRoom("room1", "public");

    //const queueSpy = jest.spyOn(UserMessageQueueService, "enqueue");
  });

  afterEach(() => {
    UsersDataStore.clearUsers();
    UsersDataStore.users = [new User("SERVER", true)];

    SecurityDataStore.clearUsers();

    RoomsDataStore.clearRooms();
    RoomsDataStore.rooms = [new Room("general", true)];

    jest.clearAllMocks();
  });

  it("properly enqueues message to the room", () => {
    const queueSpy = jest.spyOn(UserMessageQueueService, "enqueue");

    const msg1 = new Message(
      "Hello, world!",
      UsersDataStore.getUserByName("unregisteredUser")!.uuid,
      RoomsDataStore.getRoomByName("room1")!.uuid,
      new Date()
    );
    RoomService.msgToRoom(msg1);

    const msg2 = new Message(
      "Hello, world!",
      UsersDataStore.getUserByName("registeredUser")!.uuid,
      RoomsDataStore.getRoomByName("room1")!.uuid,
      new Date()
    );
    RoomService.msgToRoom(msg2);

    /* 
    server message + 1 message for unregistered user
    server message + 2 messages for registered and unregistered user
    
    */
    expect(queueSpy).toHaveBeenCalledTimes(2 + 4);
  });

  it("add new user to the room", () => {
    // const enqueueMock = jest.mock(
    //   "../src/services/UserMessageQueueService",
    //   () => {
    //     return {
    //       enqueue: jest.fn(),
    //     };
    //   }
    // );

    const msg = new Message(
      "Hello, world!",
      UsersDataStore.getUserByName("unregisteredUser")!.uuid,
      RoomsDataStore.getRoomByName("room1")!.uuid,
      new Date()
    );

    expect(RoomsDataStore.getRoomByName("room1")!.users).not.toContain(
      UsersDataStore.getUserByName("unregisteredUser")!.uuid
    );

    RoomService.msgToRoom(msg);

    expect(RoomsDataStore.getRoomByName("room1")!.users).toContain(
      UsersDataStore.getUserByName("unregisteredUser")!.uuid
    );
    // expect(enqueueMock).toHaveBeenCalled();
  });

  it("stores message in the room", () => {
    const msg = new Message(
      "Hello, world!",
      UsersDataStore.getUserByName("unregisteredUser")!.uuid,
      RoomsDataStore.getRoomByName("room1")!.uuid,
      new Date()
    );

    expect(RoomsDataStore.getRoomByName("room1")!.messages).not.toContain(msg);

    RoomService.msgToRoom(msg);

    expect(RoomsDataStore.getRoomByName("room1")!.messages).toContain(msg);
  });
});
