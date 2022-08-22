export function generateLoginForm() {
    if (loginForm !== undefined) {
        loginForm.innerHTML = `<div class="row">
    <div class="input-field col s6">
      <!-- <i class="material-icons prefix">account_circle</i> -->
      <input id="username" name="username" type="text" class="validate">
      <label for="username">Username</label>
    </div>
    <div class="input-field col s6">
      <!-- <i class="material-icons prefix">fingerprint</i> -->
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
  <i class="material-icons right">send</i>`;
    }
    registrationForm.innerHTML = "";
}
export function generateRegistrationForm() {
    if (registrationForm !== undefined) {
        registrationForm.innerHTML = `<div class="row">
        <input id="id" name="id" hidden/>
      </div>
      <div class="row">
        <div class="input-field title-section col s6">
          <input id="firstName" name="firstName" type="text" class="text" />
          <label for="firstName">First Name</label>
          <span class="helper-text" data-error="" data-success=""></span>
        </div>
        <div class="input-field authorId-section col s6">
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
      <div class="input-field col s12">
        <select>
          <option value="" disabled selected>Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <label>Materialize Select</label>
      </div> 
      <div class="row">
        <div class="input-field content-section col s12">
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
        <div class="input-field content-section col s12">
        <input id="password" type="password" class="validate">
        <label for="password">Password</label>
        </div>
      </div>
    
      <div class="row">
        <div class="input-field imageUrl-section col s12">
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
        <div class="input-field imageUrl-section col s12">
          <textarea id="description" class="materialize-textarea"></textarea>
    <label for="description">Description</label>
          <span class="helper-text" data-error="" data-success=""></span>
        </div>
      </div>
      <div class="row">
        <input id="status" name="status" hidden/>
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
      </button> `;
    }
    loginForm.innerHTML = "";
}
//# sourceMappingURL=form-generate.js.map