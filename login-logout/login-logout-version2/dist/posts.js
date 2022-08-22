var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { userLoginAPI } from "./repository.js";
var userRole;
(function (userRole) {
    userRole[userRole["USER"] = 0] = "USER";
    userRole[userRole["ADMIN"] = 1] = "ADMIN";
})(userRole || (userRole = {}));
export class LoginInfo {
    constructor(username, password) {
        this.username = username;
        this.password = password;
        this.id = username;
    }
    usernameExists() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield userLoginAPI.getAllElements();
            for (const user of users) {
                if (user.id === this.id) {
                    return true;
                }
            }
            return false;
        });
    }
}
export class User {
    constructor(firstName, lastName, username, gender, userRole, userPicture, description, status, registrationTs, lastModifTs, id) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.username = username;
        this.gender = gender;
        this.userRole = userRole;
        this.userPicture = userPicture;
        this.description = description;
        this.status = status;
        this.registrationTs = registrationTs;
        this.lastModifTs = lastModifTs;
        this.id = id;
    }
}
//# sourceMappingURL=posts.js.map