import { CryptographyService } from "../src/services/CryptographyService";
const crypto = require("crypto");

describe("CryptographyService test", () => {
  /* generic test for hashing data, example */
  it("should hash data", () => {
    const cryptographyService = new CryptographyService();
    const data = "Hello, world!";

    const actualHash = cryptographyService.hashData(data);

    expect(actualHash).toEqual(
      "315f5bdb76d078c43b8ac0064e4a0164612b1fce77c869345bfc94c75894edd3"
    );
  });
});
