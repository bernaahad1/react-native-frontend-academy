var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BlogsAPI } from "./blogs-api-client.js";
import { Post } from "./posts.js";
import { AppStateStore } from "./state-store.js";
import { ChangedStatus, FormFieldState, ValidStatus, } from "./validate.js";
class BlogsController {
    constructor() {
        this.postsSection = document.getElementById("posts");
        this.erorrsDiv = document.getElementById("errors");
        this.addPostForm = document.getElementById("add-post-form");
        this.resetButton = document.getElementById("form-reset-button");
        this.formState = {};
        this.validateForm = (event) => {
            var _a;
            const validationResult = {};
            const config = AppStateStore.postFormValidationConfig;
            const formSnapshot = this.getPostFormSnapshot();
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
            this.showValidationErrors(validationResult);
        };
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.addPostForm.addEventListener("submit", this.handleSubmitPost.bind(this));
            this.addPostForm.addEventListener("reset", this.resetForm.bind(this));
            this.addPostForm.addEventListener("change", this.validateForm, true);
            try {
                const allPosts = yield BlogsAPI.getAllPosts();
                AppStateStore.allPosts = allPosts;
                this.showPosts(allPosts);
            }
            catch (err) {
                this.showError(err);
            }
            this.initFormState(this.addPostForm);
        });
    }
    initFormState(formElement) {
        const formData = new FormData(formElement);
        formData.forEach((value, key) => {
            this.formState[key] = new FormFieldState(ValidStatus.Invalid, ChangedStatus.Pristine);
        });
    }
    showPosts(posts) {
        posts.forEach((post) => this.addPostDOM(post));
    }
    showError(err) {
        this.erorrsDiv.innerHTML = `<div>${err}</div>`;
    }
    addPostDOM(post) {
        const postElem = document.createElement("article");
        postElem.setAttribute("id", post.id.toString());
        postElem.className = "col s12 m6 l4";
        this.updateArticleInnerHtml(postElem, post);
        this.postsSection.insertAdjacentElement("beforeend", postElem);
    }
    updateArticleInnerHtml(postElem, post) {
        postElem.innerHTML = `
      <div class="card card${post.id}">
      <div class="card-image waves-effect waves-block waves-light">
        <img class="activator" src="${post.imageUrl}">
      </div>
      <div class="card-content">
        <span class="card-title activator grey-text text-darken-4">${post.title}<i class="material-icons right">more_vert</i></span>
        <p>Author: ${post.authorId}, Tags: ${post.tags ? post.tags.join(", ") : "no tags"}</p>
      </div>
      <div class="card-reveal">
        <span class="card-title grey-text text-darken-4">${post.title}<i class="material-icons right">close</i></span>
        <p>${post.content}</p>
      </div>
      <div class="card-action">
        <button class="btn waves-effect waves-light" type="button" id="edit${post.id}">Edit
          <i class="material-icons right">send</i>
        </button>
        <button class="btn waves-effect waves-light red lighten-1" type="button" id="delete${post.id}">Delete
          <i class="material-icons right">clear</i>
        </button>
      </div>
      </div>
      `;
        postElem
            .querySelector(`#delete${post.id}`)
            .addEventListener("click", () => this.deletePost(post.id));
        postElem
            .querySelector(`#edit${post.id}`)
            .addEventListener("click", () => this.handleEditPost(post));
    }
    fillForm(postInfo) {
        let key;
        for (key in postInfo) {
            const input = document.getElementById(key);
            if (input === null) {
                continue;
            }
            input.value = postInfo[key];
            const label = document.querySelector(`#add-post-form #${key} ~label`);
            if (label) {
                label.className = "active";
            }
        }
    }
    handleEditPost(postInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            window.scrollTo(0, 70);
            this.fillForm(postInfo);
            AppStateStore.editedPost = postInfo;
        });
    }
    updatePostDOM(post) {
        const postElem = document.getElementById(post.id.toString());
        this.updateArticleInnerHtml(postElem, post);
    }
    handleSubmitPost(event) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                event.preventDefault();
                const post = this.getPostFormSnapshot();
                if (post.id) {
                    const updated = yield BlogsAPI.updatePost(post);
                    this.updatePostDOM(updated);
                    AppStateStore.editedPost = undefined;
                }
                else {
                    const created = yield BlogsAPI.addNewPost(post);
                    this.addPostDOM(created);
                }
                this.resetForm();
            }
            catch (err) {
                this.showError(err);
            }
        });
    }
    getPostFormSnapshot() {
        const formData = new FormData(this.addPostForm);
        const np = {};
        formData.forEach((value, key) => {
            np[key] = value.toString();
        });
        return new Post(np.title, np.content, np.tags.split(/\W+/), np.imageUrl, np.authorId ? parseInt(np.authorId) : undefined, parseInt(np.id));
    }
    resetForm() {
        if (AppStateStore.editedPost) {
            this.fillForm(AppStateStore.editedPost);
        }
        else {
            this.addPostForm.reset();
        }
    }
    addFieldError(field, err) {
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
    resetFieldError() {
        const formData = new FormData(this.addPostForm);
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
    showValidationErrors(validationResult) {
        AppStateStore.postFormValidationConfig;
        AppStateStore.postFormErrors = [];
        let field;
        this.resetFieldError();
        for (field in validationResult) {
            const filedErrors = validationResult[field];
            this.addFieldError(field, filedErrors);
            if (filedErrors !== undefined) {
            }
        }
    }
    deletePost(id) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield BlogsAPI.deleteById(id);
                (_a = document.getElementById(id.toString())) === null || _a === void 0 ? void 0 : _a.remove();
            }
            catch (err) {
                this.showError(err);
            }
        });
    }
}
const blogsController = new BlogsController();
blogsController.init();
//# sourceMappingURL=index-old.js.map