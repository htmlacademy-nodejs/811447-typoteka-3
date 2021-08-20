'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const auth = require(`../../service/middlewares/auth`);

const myRouter = new Router();

myRouter.get(`/`, auth, async (req, res) => {
  const {user} = req.session;
  const articles = await api.getArticles({limit: null, offset: null, comments: true});
  res.render(`my`, {articles, user});
});

myRouter.get(`/comments`, auth, async (req, res) => {
  const {user} = req.session;
  const articles = await api.getArticles();
  const comments = articles.map((article) => article.comments).flat();
  res.render(`comments`, {comments, user});
});

module.exports = myRouter;
