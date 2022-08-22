var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { generateUserProfile } from "./user-profile-handle.js";
import { LoginInfo } from "./users.js";
export function generateLoginForm() {
    const formDiv = document.querySelector("div.forms");
    formDiv.childNodes.forEach(el => el.remove());
    formDiv.innerHTML = `<form id="login-form" class="col s12">
      <div class="row">
      <div class="input-field col s6">
        <i class="material-icons prefix">account_circle</i>
        <input id="username" name="username" type="text" class="validate">
        <label for="username">Username</label>
      </div>
      <div class="input-field col s6">
        <i class="material-icons prefix">fingerprint</i>
        <input id="password" name="password" type="password" class="validate">
        <label for="password">Password</label>
      </div>
    </div>
    <button
    class="btn waves-effect waves-light"
    type="submit"
    name="submit"
    id="login-btn"
  >
    Login
    <i class="material-icons right">send</i></form>`;
    const loginForm = document.getElementById("login-form");
    loginForm.addEventListener("submit", loginHandler);
}
export function loginHandler(event) {
    return __awaiter(this, void 0, void 0, function* () {
        const loginForm = document.getElementById("login-form");
        event.preventDefault();
        const formData = new FormData(loginForm);
        const np = {};
        formData.forEach((value, key) => {
            np[key] = value.toString();
        });
        console.log(np);
        const userLoginInfo = new LoginInfo(np.username, np.password);
        if (yield userLoginInfo.userExists()) {
            console.log("Successfully logged in " + userLoginInfo);
            generateUserProfile(userLoginInfo);
        }
        else {
            console.log("No such username or password");
        }
        loginForm.reset();
    });
}
//# sourceMappingURL=handle-login.js.map