// import { BlogsAPI } from "./blogs-api-client.js";

import { generateLoginForm } from "./handle-login.js";
import { generateRegistrationForm } from "./handle-registration.js";

//to do
const loginSectionBtn = document.getElementById(
  "login-section"
) as HTMLButtonElement;
const registrationSectionBtn = document.getElementById(
  "registration-section"
) as HTMLButtonElement;

function init() {
  //to do
  loginSectionBtn.addEventListener("click", changeToLoginSection);
  registrationSectionBtn.addEventListener("click", changeToRegistrationSection);
  generateLoginForm();
}

function changeToLoginSection(event: Event) {
  event.preventDefault();
  generateLoginForm();
}
function changeToRegistrationSection(event: Event) {
  event.preventDefault();
  generateRegistrationForm();
}
init();
