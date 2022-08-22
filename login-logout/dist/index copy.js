var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { LoginInfo, User } from "./users.js";
import { userAPI } from "./repository.js";
import { AppStateStore } from "./state-store.js";
export const loginForm = document.getElementById("login-form");
export const registrationForm = document.getElementById("registration-form");
function init() {
    loginForm.addEventListener("submit", loginHandler);
    registrationForm.addEventListener("submit", registrationHandler);
    registrationForm.addEventListener("change", validateForm, true);
}
function registrationHandler(event) {
    return __awaiter(this, void 0, void 0, function* () {
        event.preventDefault();
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
            userAPI.add(newUser);
            console.log("Added" + newUser);
        }
        registrationForm.reset();
    });
}
function loginHandler(event) {
    return __awaiter(this, void 0, void 0, function* () {
        event.preventDefault();
        const formData = new FormData(loginForm);
        const np = {};
        formData.forEach((value, key) => {
            np[key] = value.toString();
        });
        console.log(np);
        const user = new LoginInfo(np.username, np.password);
        if (yield user.usernameExists()) {
            console.log("Successfully logged in" + user);
        }
        else {
            console.log("No such username or password" + user.password);
        }
        loginForm.reset();
    });
}
function getRegistrationFormSnapshot() {
    const formData = new FormData(registrationForm);
    const np = {};
    formData.forEach((value, key) => {
        np[key] = value.toString();
    });
    const newUser = new User(np.firstName, np.lastName, np.username, np.password, np.gender, "USER", np.userPicture, np.description, "ACTIVE", new Date(), new Date(), undefined);
    return newUser;
}
const validateForm = (event) => {
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
function addFieldError(field, err) {
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
function resetFieldError() {
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
function showValidationErrors(validationResult) {
    AppStateStore.postFormValidationConfig;
    AppStateStore.postFormErrors = [];
    let field;
    resetFieldError();
    for (field in validationResult) {
        const filedErrors = validationResult[field];
        addFieldError(field, filedErrors);
    }
}
init();
//# sourceMappingURL=index%20copy.js.map