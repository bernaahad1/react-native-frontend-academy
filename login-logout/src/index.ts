// import { BlogsAPI } from "./blogs-api-client.js";
import {
  generateLoginForm,
  generateRegistrationForm,
} from "./form-generate.js";
import { LoginInfo, User } from "./users.js";
import { FormFieldDict } from "./shared-types.js";
import { userAPI } from "./repository.js";
import { ValidationConfig, ValidationResult } from "./validate.js";
import { AppStateStore } from "./state-store.js";

//to do
// const loginSectionBtn = document.getElementById(
//   "login-section"
// ) as HTMLButtonElement;
// const registrationSectionBtn = document.getElementById(
//   "registration-section"
// ) as HTMLButtonElement;

export const loginForm = document.getElementById(
  "login-form"
) as HTMLFormElement;
export const registrationForm = document.getElementById(
  "registration-form"
) as HTMLFormElement;

function init() {
  //to do
  //loginSectionBtn.addEventListener("click", generateLoginForm);
  // registrationSectionBtn.addEventListener("click", generateRegistrationForm);
  loginForm.addEventListener("submit", loginHandler);
  registrationForm.addEventListener("submit", registrationHandler);
  registrationForm.addEventListener("change", validateForm, true);
}

async function registrationHandler(event: SubmitEvent) {
  event.preventDefault();
  const formData = new FormData(registrationForm);
  const np: FormFieldDict<string> = {};
  formData.forEach((value, key) => {
    np[key] = value.toString();
  });
  console.log(np);
  const newUser = new User(
    np.firstName,
    np.lastName,
    np.username,
    np.password,
    np.gender,
    "",
    np.userPicture,
    np.description,
    np.status,
    new Date(),
    new Date(),
    undefined
  );

  if (await newUser.userExists()) {
    console.log("Already Exists");
  } else {
    userAPI.add(newUser);
    console.log("Added" + newUser);
  }

  registrationForm.reset();
}
async function loginHandler(event: SubmitEvent) {
  event.preventDefault();
  const formData = new FormData(loginForm);
  const np: FormFieldDict<string> = {};
  formData.forEach((value, key) => {
    np[key] = value.toString();
  });
  console.log(np);

  const user = new LoginInfo(np.username, np.password);
  if (await user.usernameExists()) {
    console.log("Successfully logged in" + user);
  } else {
    console.log("No such username or password" + user.password);
  }
  loginForm.reset();
}

function getRegistrationFormSnapshot(): User {
  const formData = new FormData(registrationForm);
  const np: FormFieldDict<string> = {};
  formData.forEach((value, key) => {
    np[key] = value.toString();
  });
  const newUser = new User(
    np.firstName,
    np.lastName,
    np.username,
    np.password,
    np.gender,
    "USER",
    np.userPicture,
    np.description,
    "ACTIVE",
    new Date(),
    new Date(),
    undefined
  );
  return newUser;
}

const validateForm = (): void => {
  const validationResult: ValidationResult<User> = {};
  const config = AppStateStore.postFormValidationConfig;
  const formSnapshot = getRegistrationFormSnapshot();
  let field: keyof ValidationConfig<User>;
  for (field in config) {
    const validator = config[field];
    if (validator !== undefined) {
      if (Array.isArray(validator)) {
        for (const validatorElem of validator) {
          try {
            const fieldValue = formSnapshot[field];
            validatorElem(fieldValue ? fieldValue.toString() : "", field);
          } catch (err) {
            if (validationResult[field] === undefined) {
              validationResult[field] = [err as string];
            } else {
              validationResult[field]?.push(err as string);
            }
          }
        }
      } else {
        try {
          const fieldValue = formSnapshot[field];
          validator(fieldValue ? fieldValue.toString() : "", field);
        } catch (err) {
          validationResult[field] = [err as string];
        }
      }
    }
  }
  showValidationErrors(validationResult);
  
};

function addFieldError(field: string, err: string[] | undefined) {
  const errSpan = document.querySelector(
    `.${field}-section>span`
  ) as HTMLSpanElement;
  const inputField = document.getElementById(field) as HTMLElement;

  if (err === undefined) {
    inputField.classList.remove("invalid");
    errSpan.removeAttribute("data-error");
    errSpan.setAttribute("data-error", "");
  } else {
    errSpan.removeAttribute("data-error");
    errSpan.setAttribute("data-error", err.join(" "));
    if (inputField.classList !== undefined) {
      inputField.classList?.remove("valid");

      inputField.classList.add("invalid");
    }
  }
}
function resetFieldError() {
  const formData = new FormData(registrationForm);
  formData.forEach((value, key) => {
    const errSpan = document.querySelector(
      `.${key}-section>span`
    ) as HTMLSpanElement;
    const inputField = document.getElementById(key) as HTMLElement;

    errSpan?.removeAttribute("data-error");
    if (inputField.classList !== undefined) {
      inputField.classList?.remove("invalid");
      inputField.classList?.add("valid");
    }
  });
}

function showValidationErrors(validationResult: ValidationResult<User>) {
  AppStateStore.postFormValidationConfig;
  AppStateStore.postFormErrors = [];
  let field: keyof ValidationResult<User>;
  resetFieldError();
  for (field in validationResult) {
    const filedErrors = validationResult[field];
    addFieldError(field, filedErrors);
    
  }

}

init();
