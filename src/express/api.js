"use strict";
const axios = require(`axios`);
const {HttpMethod} = require(`../constants`);

const TIMEOUT = 1000;

class API {
  constructor(baseURL, timeout) {
    this._http = axios.create({
      baseURL,
      timeout
    });
  }

  async _load(url, options) {
    const response = await this._http.request({url, ...options});
    return response.data;
  }

  getArticles({offset, limit, category}) {
    return this._load(`/articles`, {params: {offset, limit, category}});
  }

  getComments() {
    return this._load(`/articles/comments`);
  }

  getArticle(id) {
    return this._load(`/articles/${id}`);
  }

  search(query) {
    return this._load(`/search`, {params: {query}});
  }

  getCategories(count) {
    return this._load(`/categories`, {params: {count}});
  }

  createArticle(data) {
    return this._load(`/articles`, {
      method: HttpMethod.POST,
      data
    });
  }

  deleteArticle(id) {
    return this._load(`/articles/${id}`, {
      method: HttpMethod.DELETE
    });
  }

  updateArticle(id, data) {
    return this._load(`/articles/${id}`, {
      method: HttpMethod.PUT,
      data
    });
  }

  createComment(id, data) {
    return this._load(`/articles/${id}/comments`, {
      method: HttpMethod.POST,
      data
    });
  }

  deleteComment(id) {
    return this._load(`/articles/comments/${id}`, {
      method: HttpMethod.DELETE
    });
  }

  createUser(data) {
    return this._load(`/user`, {
      method: HttpMethod.POST,
      data
    });
  }

  auth(email, password) {
    return this._load(`/user/auth`, {
      method: HttpMethod.POST,
      data: {email, password}
    });
  }

  createCategory(data) {
    return this._load(`/categories`, {
      method: HttpMethod.POST,
      data
    });
  }

  deleteCategory(id) {
    return this._load(`/categories/${id}`, {
      method: HttpMethod.DELETE
    });
  }

  updateCategory(id, data) {
    return this._load(`/categories/${id}`, {
      method: HttpMethod.PUT,
      data
    });
  }
}

const port = process.env.API_PORT || 3000;
const defaultUrl = `http://localhost:${port}/api/`;

const defaultAPI = new API(defaultUrl, TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI
};
