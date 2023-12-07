import RoomsDataStore from "../src/RoomsDataStore";
import SecurityDataStore from "../src/SecurityDataStore";
import UsersDataStore from "../src/UsersDataStore";
import { Message } from "../src/models/Message";
import { Room } from "../src/models/Room";
import { User } from "../src/models/User";
import SecurityService from "../src/services/SecurityService";
import UserMessageQueueService from "../src/services/UserMessageQueueService";

describe("UserMessageQueueService test", () => {
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
    UsersDataStore.fillUsers();

    SecurityDataStore.clearUsers();

    RoomsDataStore.clearRooms();
    RoomsDataStore.rooms = [new Room("general", true)];

    jest.clearAllMocks();
  });

  it("proper user queue setup per room", () => {
    const userRecipientId =
      UsersDataStore.getUserByName("registeredUser")!.uuid;
    const msg = new Message(
      "Hello, World!",
      UsersDataStore.getUserByName("unregisteredUser")!.uuid,
      RoomsDataStore.getRoomByName("general")!.uuid,
      new Date()
    );

    UserMessageQueueService.enqueue(userRecipientId, msg).then(() => {
      expect(UserMessageQueueService.queue).toHaveProperty(
        RoomsDataStore.getRoomByName("general")!.uuid
      );
      expect(
        UserMessageQueueService.queue[
          RoomsDataStore.getRoomByName("general")!.uuid
        ]
      ).toHaveProperty(UsersDataStore.getUserByName("registeredUser")!.uuid);
    });
  });
});
