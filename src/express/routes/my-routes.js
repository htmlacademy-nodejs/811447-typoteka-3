'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getAPI();

const myRouter = new Router();

myRouter.get(`/`, async (req, res) => {
  const articles = await api.getArticles({limit: null, offset: null, comments: true});
  res.render(`my`, {articles});
});

myRouter.get(`/comments`, async (req, res) => {
  const articles = await api.getArticles();
  const comments = articles.map((article) => article.comments).flat();
  res.render(`comments`, {comments});
});

module.exports = myRouter;
