import { generateLoginForm } from "./handle-login.js";
import { userAPI } from "./repository.js";
import { FormFieldDict } from "./shared-types.js";
import { AppStateStore } from "./state-store.js";
import { User } from "./users.js";
import { ValidationConfig, ValidationResult } from "./validate.js";

export function generateRegistrationForm() {
  const formDiv = document.querySelector("div.forms") as HTMLElement;

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
    
  const registrationForm = document.getElementById(
    "registration-form"
  ) as HTMLFormElement;
  registrationForm.addEventListener("submit", registrationHandler);
  registrationForm.addEventListener("change", validateForm, true);
}

export async function registrationHandler(event: SubmitEvent) {
    event.preventDefault();
    const registrationForm = document.getElementById(
        "registration-form"
      ) as HTMLFormElement;
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
      await userAPI.add(newUser);
        console.log("Added " + newUser);
        generateLoginForm();
    }
  
    registrationForm.reset();
  }

export function getRegistrationFormSnapshot(): User {
    const registrationForm = document.getElementById(
        "registration-form"
      ) as HTMLFormElement;
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

export const validateForm = (): void => {
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

export function resetFieldError() {
    const registrationForm = document.getElementById(
        "registration-form"
      ) as HTMLFormElement;
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
  
  export function showValidationErrors(validationResult: ValidationResult<User>) {
    AppStateStore.postFormValidationConfig;
    AppStateStore.postFormErrors = [];
    let field: keyof ValidationResult<User>;
    resetFieldError();
    for (field in validationResult) {
      const filedErrors = validationResult[field];
      addFieldError(field, filedErrors);
      
    }
  
  }
  export function addFieldError(field: string, err: string[] | undefined) {
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

