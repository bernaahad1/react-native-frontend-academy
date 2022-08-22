import { Validators } from "./validate.js";
export const AppStateStore = {
    editedPost: undefined,
    allPosts: [],
    postFormValidationConfig: {
        firstName: [Validators.required(), Validators.len(2, 15)],
        lastName: [Validators.required(), Validators.len(2, 15)],
        username: [Validators.required(), Validators.len(5, 15)],
        password: [Validators.required(), Validators.len(5)],
        userPicture: [Validators.pattern(new RegExp('[(http(s)?)://(www.)?a-zA-Z0-9@:%._+~#=]{2,256}.[a-z]{2,6}b([-a-zA-Z0-9@:%_+.~#?&//=]*)'))],
        description: [Validators.len(0, 512)],
    },
    postFormErrors: [],
    postFormState: {}
};
//# sourceMappingURL=state-store.js.map