'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const auth = require(`../../service/middlewares/auth`);
const author = require(`../../service/middlewares/author`);

const myRouter = new Router();

myRouter.get(`/`, [auth, author], async (req, res) => {
  const {user} = req.session;
  const articles = await api.getArticles({limit: null, offset: null});
  res.render(`my`, {articles, user});
});

myRouter.get(`/comments`, [auth, author], async (req, res) => {
  const {user} = req.session;
  const comments = await api.getComments();
  res.render(`comments`, {comments, user});
});

module.exports = myRouter;
