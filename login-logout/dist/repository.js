var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class ApiClientImpl {
    constructor(urlDest) {
        this.urlDest = urlDest;
        this.API_BASE_URL = "http://localhost:4000/api";
    }
    getAllElements() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.handleRequest(`${this.API_BASE_URL}/${this.urlDest}`);
        });
    }
    add(element) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.handleRequest(`${this.API_BASE_URL}/${this.urlDest}`, {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify(element),
            });
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.handleRequest(`${this.API_BASE_URL}/${this.urlDest}/${id}`);
        });
    }
    update(element) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.handleRequest(`${this.API_BASE_URL}/${this.urlDest}/${element.id}`, {
                method: "PUT",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify(element),
            });
        });
    }
    deleteById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.handleRequest(`${this.API_BASE_URL}/${this.urlDest}/${id}`, {
                method: "DELETE",
            });
        });
    }
    handleRequest(url, options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ApiElementResp = yield fetch(url, options);
                if (ApiElementResp.status >= 400) {
                    return Promise.reject(ApiElementResp.body);
                }
                return ApiElementResp.json();
            }
            catch (err) {
                return Promise.reject(err);
            }
        });
    }
}
export const userAPI = new ApiClientImpl("users");
//# sourceMappingURL=repository.js.map