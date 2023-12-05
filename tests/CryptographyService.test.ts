import { CryptographyService } from "../src/services/CryptographyService";
const crypto = require("crypto");

describe("CryptographyService test", () => {
  /* generic test for hashing data, example */
  it("should hash data", () => {
    const cryptographyService = new CryptographyService();
    const data = "Hello, world!";

    let expectedHash = crypto.createHash("sha256");
    expectedHash.update(data);
    const expectedHashString = expectedHash.digest("hex");

    const actualHash = cryptographyService.hashData(data);

    expect(actualHash).toEqual(expectedHashString);
  });
});
