import { generateLoginForm } from "./handle-login.js";
import { LoginInfo, User } from "./users.js";

export function generateUserProfile(user: LoginInfo) {
  const divContainer = document.querySelector(
    "div.container.content"
  ) as HTMLElement;
  divContainer.childNodes.forEach((child) => child.remove());
  divContainer.innerHTML = `<h1 class="header center orange-text">Profile</h1>
<div class="row center" id="main-content"></div>
<button
  class="btn waves-effect waves-light right"
  type="submit"
  name="logout"
  id="logout">Sign out</button>`;
  generateUserInformation(user);
  setLogout();
}

export async function generateUserInformation(user: LoginInfo) {
    console.log(user);
    
  const userInfo = await user.getUserInfo();
  if (userInfo !== undefined) {
    const cardContainer = document.getElementById(
      "main-content"
    ) as HTMLElement;
      
    cardContainer.insertAdjacentElement(
      "beforeend",
      generateUserCard(userInfo)
    );
  }
}

export function generateUserCard(user: User) {
    const cardElem = document.createElement('article');
    cardElem.setAttribute('id', user.id!.toString());
    cardElem.className = "col s12 m6 l4";
   
    cardElem.innerHTML= `<div class="card">
  <div class="card-image waves-effect waves-block waves-light">
    <img class="activator" src="${user.userPicture}">
  </div>
  <div class="card-content">
    <span class="card-title activator grey-text text-darken-4">${user.firstName} ${user.lastName}<i class="material-icons right">more_vert</i></span>
    <p></p>
  </div>
  <div class="card-reveal">
    <span class="card-title grey-text text-darken-4">${user.username}<i class="material-icons right">close</i></span>
    <p>${user.description}</p>
  </div>
  <div class="card-action">
    <button class="btn waves-effect waves-light" type="button" id="edit${user.id}">Edit
      <i class="material-icons right">send</i>
    </button>
    
  </div>
  </div>`;
    return cardElem
}

export function setLogout() {
  const logoutBtn = document.getElementById("logout") as HTMLButtonElement;
  logoutBtn.addEventListener("click", handleLogout);
}

export function handleLogout(event: Event) {
  event.preventDefault();
  const divContainer = document.querySelector(
    "div.container.content"
  ) as HTMLElement;
  divContainer.childNodes.forEach((child) => child.remove());
  divContainer.innerHTML = `<h1 class="header center orange-text">Login/Logout</h1>
  <div class="row center">
    <div class="row" id="login-register-btns">
      <button
        class="btn waves-effect waves-light"
        type="submit"
        name="submit"
        id="login-section"
      >
        Sign in
      </button>
      <button
        class="btn waves-effect waves-light green lighten-1"
        type="button"
        id="registration-section"
      >
        Register
        <!-- <i class="material-icons right">cached</i> -->
      </button></div>
      <div class="row center forms"></div>
    </div>`;
  generateLoginForm();
}
