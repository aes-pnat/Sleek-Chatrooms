import SecurityDataStore from "../src/SecurityDataStore";
import UsersDataStore from "../src/UsersDataStore";
import { User } from "../src/models/User";
import SecurityService from "../src/services/SecurityService";

describe("SecurityService test", () => {
  beforeEach(() => {
    UsersDataStore.addUser("user1");
    SecurityService.registerUser(
      UsersDataStore.getUserByName("user1")!.uuid,
      "password1"
    );
  });

  afterEach(() => {
    UsersDataStore.clearUsers();
    UsersDataStore.fillUsers();

    SecurityDataStore.clearUsers();

    jest.clearAllMocks();
  });

  it("valid password for valid user check", () => {
    const user = UsersDataStore.getUserByName("user1")!.uuid;
    expect(SecurityService.checkValidPassword(user, "password1")).toBeTruthy();
  });

  it("invalid password for valid user check", () => {
    const user = UsersDataStore.getUserByName("user1")!.uuid;
    expect(SecurityService.checkValidPassword(user, "password2")).toBeFalsy();
  });

  it("any password for invalid user check", () => {
    expect(
      SecurityService.checkValidPassword("user2", "somePassword")
    ).toBeFalsy();
  });
});
