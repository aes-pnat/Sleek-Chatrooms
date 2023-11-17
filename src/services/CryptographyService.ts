const crypto = require("crypto");

class CryptographyService {
  private hash = crypto.createHash("sha256");

  public hashData(data: string): string {
    this.hash.update(data);
    return this.hash.digest("hex");
  }
}

export default new CryptographyService();
