import { User } from "./users.js";

export interface ApiClient<K,T> {
  getAllElements(): Promise<T[]>;
  add(element: T): Promise<T>;
  getById(id: K): Promise<T>;
  update(element: T): Promise<T>;
  deleteById(id: K): Promise<T>;
}

export class ApiClientImpl<K,T extends { id: K }>
  implements ApiClient<K,T>
{
  API_BASE_URL = "http://localhost:4000/api";
  constructor(private urlDest: string) {}

  async getAllElements(): Promise<T[]> {
    return this.handleRequest(`${this.API_BASE_URL}/${this.urlDest}`);
  }
  async add(element: T): Promise<T> {
    return this.handleRequest(`${this.API_BASE_URL}/${this.urlDest}`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(element),
    });
  }
  async getById(id: K): Promise<T> {
    return this.handleRequest(`${this.API_BASE_URL}/${this.urlDest}/${id}`);
  }
  async update(element: T): Promise<T> {
    return this.handleRequest(
      `${this.API_BASE_URL}/${this.urlDest}/${element.id}`,
      {
        method: "PUT",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(element),
      }
    );
  }
  async deleteById(id: K): Promise<T> {
    return this.handleRequest(`${this.API_BASE_URL}/${this.urlDest}/${id}`, {
      method: "DELETE",
    });
  }
  private async handleRequest(url: string, options?: RequestInit) {
    try {
      const ApiElementResp = await fetch(url, options);
      if (ApiElementResp.status >= 400) {
        return Promise.reject(ApiElementResp.body);
      }
      return ApiElementResp.json();
    } catch (err) {
      return Promise.reject(err);
    }
  }
}

export const userAPI: ApiClient<number | undefined ,User> = new ApiClientImpl("users");

