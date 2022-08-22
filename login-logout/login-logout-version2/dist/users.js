var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { userAPI } from "./repository.js";
export class LoginInfo {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
    userExists() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield userAPI.getAllElements();
            for (const user of users) {
                if (user.username === this.username && user.password === this.password) {
                    return true;
                }
            }
            return false;
        });
    }
    getUserInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield userAPI.getAllElements();
            for (const user of users) {
                if (user.username === this.username) {
                    return user;
                }
            }
        });
    }
}
export class User {
    constructor(firstName, lastName, username, password, gender, userRole, userPicture, description, status, registrationTs, lastModifTs, id) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.username = username;
        this.password = password;
        this.gender = gender;
        this.userRole = userRole;
        this.userPicture = userPicture;
        this.description = description;
        this.status = status;
        this.registrationTs = registrationTs;
        this.lastModifTs = lastModifTs;
        this.id = id;
    }
    userExists() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield userAPI.getAllElements();
            for (const user of users) {
                if (user.username === this.username) {
                    return true;
                }
            }
            return false;
        });
    }
}
//# sourceMappingURL=users.js.map