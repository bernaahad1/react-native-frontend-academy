import { userAPI } from "./repository.js";

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

export class User {
  constructor(
    public firstName: string,
    public lastName: string,
    public username: string,
    public password: string,
    public gender: string,
    public userRole: string,
    public userPicture: string,
    public description: string,
    public status: string,
    public registrationTs: Date,
    public lastModifTs: Date,
    public id: number | undefined
  ) {}

  async userExists() {
    const users = await userAPI.getAllElements();
    for (const user of users) {
      if (user.username === this.username) {
        return true;
      }
    }
    return false;
  }
}
