import SecurityDataStore from "../SecurityDataStore";
import CryptographyService from "./CryptographyService";

export class SecurityService {
  public registerUser(id: string, password: string) {
    let passHash = CryptographyService.hashData(password);
    SecurityDataStore.addUser(id, passHash);
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
