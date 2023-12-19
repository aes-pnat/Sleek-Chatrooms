const crypto = require("crypto");

export class CryptographyService {
  public hashData(data: string): string {
    let hash = crypto.createHash("sha256");
    hash.update(data);
    const returnHash = hash.digest("hex");
    return returnHash;
  }
}

export default new CryptographyService();
