import { userAPI } from "../dao/repository";

export class LoginInfo {
  constructor(public username: string, public password: string) {}

  async userExists() {
    const users = await userAPI.getAllElements();
    for (const user of users) {
      if (user.username === this.username && user.password === this.password) {
        return true;
      }
    }
    return false;
  }
  async getUserInfo() {
    const users = await userAPI.getAllElements();
    for (const user of users) {
      if (user.username === this.username) {
        return user;
      }
    }
  }
}
