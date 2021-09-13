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

myRouter.get(`/delete/:id`, [auth, author], async (req, res) => {
  const {id} = req.params;

  await api.deleteArticle(id);
  res.redirect(`/my`);
});

myRouter.get(`/comments`, [auth, author], async (req, res) => {
  const {user} = req.session;
  const comments = await api.getComments();
  const commentsOrdered = comments.slice().sort((a, b) => b[`comments.id`] - a[`comments.id`]);
  res.render(`comments`, {comments: commentsOrdered, user});
});

myRouter.get(`/comments/:id`, [auth, author], async (req, res) => {
  const {id} = req.params;

  try {
    await api.deleteComment(id);
    res.redirect(`/my/comments`);
  } catch (error) {
    res.redirect(`/my/comments?error=${encodeURIComponent(error.response.data)}`);
  }
});

module.exports = myRouter;
