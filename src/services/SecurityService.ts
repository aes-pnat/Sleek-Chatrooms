import SecurityDataStore from "../SecurityDataStore";
import CryptographyService from "./CryptographyService";

export class SecurityService {
  public registerUser(name: string, password: string) {
    SecurityDataStore.addUser(name, password);
  }

  public checkValidPassword(id: string, password: string) {
    let user = SecurityDataStore.getUserById(id);
    if (!user) {
      return false;
    }
    let passHash = CryptographyService.hashData(password);
    return user.passwordHash === passHash;
  }
}

export default new SecurityService();
