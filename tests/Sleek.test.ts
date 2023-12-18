import Sleek from "../src/Sleek";
import UsersDataStore from "../src/UsersDataStore";
import RoomsDataStore from "../src/RoomsDataStore";
import SecurityDataStore from "../src/SecurityDataStore";
import UserMessageQueueService from "../src/services/UserMessageQueueService";
import { messageCallback, wait } from "../utils";

function flushPromises() {
  return new Promise((resolve) =>
    //jest.requireActual("timers").setImmediate(resolve)
    setImmediate(resolve)
  );
}

describe("Sleek E2E test", () => {
  jest.setTimeout(40000);
  Sleek.setOutputChannel(messageCallback);
  let consoleSpy: any;

  beforeEach(() => {
    // jest.useFakeTimers();
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
    const message = "user@general hello world";
    Sleek.acceptMessage(message);
    const expOutputs = [
      /POSTing message: "user@general hello world"/,
      /   Enqueueing message for ANONYMOUS: "user" joined the room /,
      /   Enqueueing message for user: "user" joined the room /,
      /\[.*?\] To "ANONYMOUS" ::: \|SERVER\| to "general": "user" joined the room/,
      /{"idle":true,"totalMessages":0}/,
    ];

    // while (jest.getTimerCount() > 0) {
    //   jest.runAllTimers();
    //   await new Promise(setImmediate);
    //   console.warn(consoleSpy.mock.calls.flat(Infinity));
    // }

    while (!UserMessageQueueService.state.idle) {
      await wait(500);
    }
    expOutputs.forEach((output) => {
      let numberOfMatches = consoleSpy.mock.calls
        .flat(Infinity)
        .filter((x: any) => x.match(output) !== null).length;
      expect(numberOfMatches).toBe(1);
    });
  });
});
