var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { generateLoginForm } from "./handle-login.js";
import { userAPI } from "./repository.js";
import { AppStateStore } from "./state-store.js";
import { User } from "./users.js";
export function generateRegistrationForm() {
    const formDiv = document.querySelector("div.forms");
    formDiv.innerHTML = `<form id="registration-form" class="col s12">
  <div class="row">
    <input id="id" name="id" hidden/>
  </div>
  <div class="row">
    <div class="input-field firstName-section col s6">
      <input id="firstName" name="firstName" type="text" class="text" />
      <label for="firstName">First Name</label>
      <span class="helper-text" data-error="" data-success=""></span>
    </div>
    <div class="input-field lastName-section col s6">
      <input
        id="lastName"
        name="lastName"
        type="text"
        class="text"
      />
      <label for="lastName">Last Name</label>
      <span class="helper-text" data-error="" data-success=""></span>
    </div>
  </div>
  <div class="input-field gender-section col s12">
    
      <input
        id="gender"
        name="gender"
        type="text"
        class="gender"
      />
      <label for="lastName">Gender</label>
      <span class="helper-text" data-error="" data-success=""></span>
    
   
  <div class="row">
    <div class="input-field username-section col s12">
      <input
        id="username"
        name="username"
        type="text"
        class="validate"
        
      />
      <label for="username">Username</label>
      <span class="helper-text" data-error="" data-success=""></span>
    </div>
  </div>
  <div class="row">
    <div class="input-field password-section col s12">
    <input id="password" name="password" type="password" class="validate">
    <label for="password">Password</label>
    <span class="helper-text" data-error="" data-success=""></span>
    </div>
  </div>

  <div class="row">
    <div class="input-field userPicture-section col s12">
      <input
        id="userPicture"
        name="userPicture"
        type="url"
        class="validate"
      />
      <label for="userPicture">Profile Img</label>
      <span class="helper-text" data-error="" data-success=""></span>
    </div>
  </div>
  <div class="row">
    <div class="input-field description-section col s12">
      <textarea id="description" name="description" class="materialize-textarea"></textarea>
<label for="description">Description</label>
      <span class="helper-text" data-error="" data-success=""></span>
    </div>
  </div>
  <div class="row">
    <input id="status"  name="status" hidden/>
  </div>
  <div class="row">
    <input id="registrationTs" name="registrationTs" hidden/>
  </div>
  <div class="row">
    <input id="lastModifTs" name="lastModifTs" hidden/>
  </div>
  <button
    class="btn waves-effect waves-light"
    type="submit"
    name="submit"
  >
    Register
    <i class="material-icons right">send</i>
  </button> 
</form>`;
    const registrationForm = document.getElementById("registration-form");
    registrationForm.addEventListener("submit", registrationHandler);
    registrationForm.addEventListener("change", validateForm, true);
}
export function registrationHandler(event) {
    return __awaiter(this, void 0, void 0, function* () {
        event.preventDefault();
        const registrationForm = document.getElementById("registration-form");
        const formData = new FormData(registrationForm);
        const np = {};
        formData.forEach((value, key) => {
            np[key] = value.toString();
        });
        console.log(np);
        const newUser = new User(np.firstName, np.lastName, np.username, np.password, np.gender, "", np.userPicture, np.description, np.status, new Date(), new Date(), undefined);
        if (yield newUser.userExists()) {
            console.log("Already Exists");
        }
        else {
            yield userAPI.add(newUser);
            console.log("Added " + newUser);
            generateLoginForm();
        }
        registrationForm.reset();
    });
}
export function getRegistrationFormSnapshot() {
    const registrationForm = document.getElementById("registration-form");
    const formData = new FormData(registrationForm);
    const np = {};
    formData.forEach((value, key) => {
        np[key] = value.toString();
    });
    const newUser = new User(np.firstName, np.lastName, np.username, np.password, np.gender, "USER", np.userPicture, np.description, "ACTIVE", new Date(), new Date(), undefined);
    return newUser;
}
export const validateForm = () => {
    var _a;
    const validationResult = {};
    const config = AppStateStore.postFormValidationConfig;
    const formSnapshot = getRegistrationFormSnapshot();
    let field;
    for (field in config) {
        const validator = config[field];
        if (validator !== undefined) {
            if (Array.isArray(validator)) {
                for (const validatorElem of validator) {
                    try {
                        const fieldValue = formSnapshot[field];
                        validatorElem(fieldValue ? fieldValue.toString() : "", field);
                    }
                    catch (err) {
                        if (validationResult[field] === undefined) {
                            validationResult[field] = [err];
                        }
                        else {
                            (_a = validationResult[field]) === null || _a === void 0 ? void 0 : _a.push(err);
                        }
                    }
                }
            }
            else {
                try {
                    const fieldValue = formSnapshot[field];
                    validator(fieldValue ? fieldValue.toString() : "", field);
                }
                catch (err) {
                    validationResult[field] = [err];
                }
            }
        }
    }
    showValidationErrors(validationResult);
};
export function resetFieldError() {
    const registrationForm = document.getElementById("registration-form");
    const formData = new FormData(registrationForm);
    formData.forEach((value, key) => {
        var _a, _b;
        const errSpan = document.querySelector(`.${key}-section>span`);
        const inputField = document.getElementById(key);
        errSpan === null || errSpan === void 0 ? void 0 : errSpan.removeAttribute("data-error");
        if (inputField.classList !== undefined) {
            (_a = inputField.classList) === null || _a === void 0 ? void 0 : _a.remove("invalid");
            (_b = inputField.classList) === null || _b === void 0 ? void 0 : _b.add("valid");
        }
    });
}
export function showValidationErrors(validationResult) {
    AppStateStore.postFormValidationConfig;
    AppStateStore.postFormErrors = [];
    let field;
    resetFieldError();
    for (field in validationResult) {
        const filedErrors = validationResult[field];
        addFieldError(field, filedErrors);
    }
}
export function addFieldError(field, err) {
    var _a;
    const errSpan = document.querySelector(`.${field}-section>span`);
    const inputField = document.getElementById(field);
    if (err === undefined) {
        inputField.classList.remove("invalid");
        errSpan.removeAttribute("data-error");
        errSpan.setAttribute("data-error", "");
    }
    else {
        errSpan.removeAttribute("data-error");
        errSpan.setAttribute("data-error", err.join(" "));
        if (inputField.classList !== undefined) {
            (_a = inputField.classList) === null || _a === void 0 ? void 0 : _a.remove("valid");
            inputField.classList.add("invalid");
        }
    }
}
//# sourceMappingURL=handle-registration.js.map