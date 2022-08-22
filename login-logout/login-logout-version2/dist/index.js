import { generateLoginForm } from "./handle-login.js";
import { generateRegistrationForm } from "./handle-registration.js";
const loginSectionBtn = document.getElementById("login-section");
const registrationSectionBtn = document.getElementById("registration-section");
function init() {
    loginSectionBtn.addEventListener("click", changeToLoginSection);
    registrationSectionBtn.addEventListener("click", changeToRegistrationSection);
    generateLoginForm();
}
function changeToLoginSection(event) {
    event.preventDefault();
    generateLoginForm();
}
function changeToRegistrationSection(event) {
    event.preventDefault();
    generateRegistrationForm();
}
init();
//# sourceMappingURL=index.js.map