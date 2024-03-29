type SecurityCollection = {
  uuid: string;
  passwordHash: string;
}[];

class SecurityDataStore {
  public securityUsers: SecurityCollection = [];

  public getUserById(uuid: string) {
    return this.securityUsers.find((user) => user.uuid === uuid);
  }

  public addUser(id: string, passwordHash: string) {
    this.securityUsers.push({ uuid: id, passwordHash: passwordHash });
  }

  public clearUsers() {
    this.securityUsers = [];
  }
}

export default new SecurityDataStore();
