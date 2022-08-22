import { FormFieldDict } from "./shared-types.js";
import { generateUserProfile } from "./user-profile-handle.js";
import { LoginInfo } from "./users.js";


export function generateLoginForm() {
    const formDiv = document.querySelector("div.forms") as HTMLElement;
    formDiv.childNodes.forEach(el=>el.remove());
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
    
    const loginForm = document.getElementById("login-form") as HTMLFormElement;
    loginForm.addEventListener("submit", loginHandler);
}
  
export async function loginHandler(event: SubmitEvent) {
    const loginForm = document.getElementById("login-form") as HTMLFormElement;
    event.preventDefault();
    const formData = new FormData(loginForm);
    const np: FormFieldDict<string> = {};
    formData.forEach((value, key) => {
      np[key] = value.toString();
    });
    console.log(np);
  
    const userLoginInfo = new LoginInfo(np.username, np.password);
    if (await userLoginInfo.userExists()) {
        console.log("Successfully logged in " + userLoginInfo);
        generateUserProfile(userLoginInfo);
    } else {
      console.log("No such username or password");
    }
    loginForm.reset();
  }
  


