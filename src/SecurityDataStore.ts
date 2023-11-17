import CryptographyService from "./services/CryptographyService";

type SecurityCollection = {
  uuid: string;
  passwordHash: string;
}[];

class SecurityDataStore {
  public securityUsers: SecurityCollection = [];

  public getUserById(uuid: string) {
    return this.securityUsers.find((user) => user.uuid === uuid);
  }

  public addUser(id: string, password: string) {
    let passHash = CryptographyService.hashData(password);
    this.securityUsers.push({ uuid: id, passwordHash: passHash });
  }
}

export default new SecurityDataStore();
