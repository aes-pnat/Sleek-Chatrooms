const crypto = require("crypto");

class CryptographyService {
  public hashData(data: string): string {
    let hash = crypto.createHash("sha256");
    hash.update(data);
    return hash.digest("hex");
  }
}

export default new CryptographyService();
