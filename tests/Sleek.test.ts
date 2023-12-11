import Sleek from "../src/Sleek";
import UsersDataStore from "../src/UsersDataStore";
import RoomsDataStore from "../src/RoomsDataStore";
import SecurityDataStore from "../src/SecurityDataStore";
import UserMessageQueueService from "../src/services/UserMessageQueueService";
import { messageCallback } from "../utils";

function flushPromises() {
  return new Promise((resolve) =>
    //jest.requireActual("timers").setImmediate(resolve)
    setImmediate(resolve)
  );
}

describe("Sleek E2E test", () => {
  jest.setTimeout(10000);
  Sleek.setOutputChannel(messageCallback);
  let consoleSpy: any;

  beforeEach(() => {
    jest.useFakeTimers();
    consoleSpy = jest.spyOn(console, "log").mockImplementation();
  });
  afterEach(() => {
    UsersDataStore.clearUsers();
    UsersDataStore.fillUsers();
    RoomsDataStore.clearRooms();
    RoomsDataStore.addRoom("general", "public");
    SecurityDataStore.clearUsers();
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it("regular message from new user to general", async () => {
    jest.useRealTimers();
    const message = "user@general hello world";
    Sleek.acceptMessage(message);

    /*
    1. user sends a message to general
    2. message gets enqueued for ANONYMOUS
    3. message gets enqueued for user
    4. message gets dequeued for ANONYMOUS (and printed to console)
    5. message gets dequeued for user (and printed to console)
    */
    const expOutputs = [
      /POSTing message: "user@general hello world"/,
      /   Enqueueing message for ANONYMOUS: "user" joined the room /,
      /   Enqueueing message for user: "user" joined the room /,

      /[.*?] To "ANONYMOUS" ::: \|SERVER\| to "general": "user" joined the room/,
      ,
    ];
    jest.advanceTimersByTime(7000);
    await flushPromises();
    const recOutputs = consoleSpy.mock.calls.map((x: string[]) => x[0]);

    expOutputs.forEach((output) => {
      let numberOfMatches = recOutputs.filter(
        (x: any) => x.match(output) !== null
      ).length;
      expect(numberOfMatches).toBe(1);
    });
  });
});
