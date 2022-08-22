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
import { FormTextComponent, FormWidget } from "./form-builder.js";
import { AppStateStore } from "./state-store.js";
import { ChangedStatus, FormFieldState, ValidStatus, } from "./validate.js";
class BlogsController {
    constructor() {
        this.postsSection = document.getElementById("posts");
        this.erorrsDiv = document.getElementById("errors");
        this.addPostForm = document.getElementById("post-form-container");
        this.addEditPost = (post) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                if (post.id) {
                    const updated = yield BlogsAPI.updatePost(post);
                    this.updatePostDOM(updated);
                    AppStateStore.editedPost = undefined;
                }
                else {
                    const created = yield BlogsAPI.addNewPost(post);
                    this.addPostDOM(created);
                }
                (_a = this.postForm) === null || _a === void 0 ? void 0 : _a.reset();
            }
            catch (err) {
                this.showError(err);
            }
        });
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const allPosts = yield BlogsAPI.getAllPosts();
                AppStateStore.allPosts = allPosts;
                this.showPosts(allPosts);
            }
            catch (err) {
                this.showError(err);
            }
            this.postForm = new FormWidget('add-post-form', {
                id: new FormTextComponent('id', '', '', false, undefined, undefined, undefined, true),
                title: new FormTextComponent('title', '', '', false),
                content: new FormTextComponent('content', '', '', true),
                imageUrl: new FormTextComponent('imageUrl', '', '', false, 'Image URL'),
                tags: new FormTextComponent('tags', '', '', false),
                authorId: new FormTextComponent('authorId', '', '', false, 'Author ID'),
            }, new Post('', '', [], '', 1, undefined), {}, (event) => {
                event.preventDefault();
                const post = this.postForm.getFormSnapshot();
                console.log('Form submitted succssfully:');
                console.log(post);
                this.addEditPost(post);
            });
            this.addPostForm.innerHTML = this.postForm.render();
            this.postForm.makeInteractive();
        });
    }
    initFormState(formElement) {
        const formData = new FormData(formElement);
        const np = {};
        formData.forEach((value, key) => {
            np[key] = new FormFieldState(ValidStatus.Invalid, ChangedStatus.Pristine);
        });
    }
    showPosts(posts) {
        posts.forEach(post => this.addPostDOM(post));
    }
    showError(err) {
        this.erorrsDiv.innerHTML = `<div>${err}</div>`;
    }
    addPostDOM(post) {
        const postElem = document.createElement('article');
        postElem.setAttribute('id', post.id.toString());
        postElem.className = "col s12 m6 l4";
        this.updateArticleInnerHtml(postElem, post);
        this.postsSection.insertAdjacentElement("beforeend", postElem);
    }
    updatePostDOM(post) {
        const postElem = document.getElementById(post.id.toString());
        this.updateArticleInnerHtml(postElem, post);
    }
    updateArticleInnerHtml(postElem, post) {
        postElem.innerHTML = `
      <div class="card">
      <div class="card-image waves-effect waves-block waves-light">
        <img class="activator" src="${post.imageUrl}">
      </div>
      <div class="card-content">
        <span class="card-title activator grey-text text-darken-4">${post.title}<i class="material-icons right">more_vert</i></span>
        <p>Author: ${post.authorId}, Tags: ${post.tags ? post.tags.join(', ') : 'no tags'}</p>
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
        postElem.querySelector(`#delete${post.id}`).addEventListener('click', event => this.deletePost(post.id));
        postElem.querySelector(`#edit${post.id}`).addEventListener('click', event => this.editPost(post));
    }
    editPost(post) {
        this.fillPostForm(post);
        window.scrollTo(0, 0);
        AppStateStore.editedPost = post;
    }
    fillPostForm(post) {
        let field;
        for (field in post) {
            document.getElementById(field).value = post[field];
            const label = document.querySelector(`#add-post-form label[for=${field}]`);
            if (label) {
                label.className = 'active';
            }
        }
    }
    deletePost(postId) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield BlogsAPI.deleteById(postId);
                (_a = document.getElementById(postId.toString())) === null || _a === void 0 ? void 0 : _a.remove();
            }
            catch (err) {
                this.showError(err);
            }
        });
    }
    showValidationErrors(validationResult) {
        AppStateStore.postFormErrors = [];
        let field;
        for (field in validationResult) {
            const filedErrors = validationResult[field];
            if (filedErrors !== undefined) {
                for (const err of filedErrors) {
                    AppStateStore.postFormErrors.push(`${field} -> ${err}<br>`);
                }
            }
        }
        this.showError(AppStateStore.postFormErrors);
    }
}
const blogsController = new BlogsController();
blogsController.init();
//# sourceMappingURL=index-useless.js.map