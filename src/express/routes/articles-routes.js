'use strict';

const {Router} = require(`express`);
const csrf = require(`csurf`);
const api = require(`../api`).getAPI();
const {ensureArray} = require(`../../utils`);
const {ARTICLES_PER_PAGE} = require(`../../constants`);
const auth = require(`../../service/middlewares/auth`);
const author = require(`../../service/middlewares/author`);
const upload = require(`../../service/middlewares/upload`);

const csrfProtection = csrf();

const articlesRouter = new Router();

articlesRouter.get(`/category/:id`, auth, async (req, res) => {
  const {user} = req.session;
  let {page = 1, error} = req.query;

  page = +page;
  const limit = ARTICLES_PER_PAGE;
  const offset = (page - 1) * ARTICLES_PER_PAGE;

  const {id} = req.params;
  const [
    {count, articles},
    categories
  ] = await Promise.all([
    api.getArticles({category: id, limit, offset}),
    api.getCategories(true)
  ]);

  const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);
  res.render(`articles-by-category`, {articles, categories, id, page, totalPages, error, user});
});

articlesRouter.get(`/edit/:id`, [auth, author], csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {error} = req.query;
  const {id} = req.params;
  const [{article}, categories] = await Promise.all([
    api.getArticle(id),
    api.getCategories()
  ]);
  res.render(`edit-post`, {article, categories, error, user, csrfToken: req.csrfToken()});
});

articlesRouter.get(`/add`, [auth, author], csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {error} = req.query;
  const categories = await api.getCategories();
  res.render(`new-post`, {categories, error, user, csrfToken: req.csrfToken()});
});

articlesRouter.post(`/add`, [auth, author], upload.single(`upload`), csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {body, file} = req;
  const articleData = {
    picture: file && file.filename ? file.filename : ``,
    announce: body.announcement,
    fullText: body[`full-text`],
    title: body.title,
    categories: ensureArray(body.categories),
    date: body.date,
    userId: user.id
  };
  try {
    await api.createArticle(articleData);
    res.redirect(`/my`);
  } catch (error) {
    res.redirect(`/articles/add?error=${encodeURIComponent(error.response.data)}`);
  }
});

articlesRouter.post(`/edit/:id`, [auth, author], upload.single(`avatar`), csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {body, file} = req;
  const {id} = req.params;
  const articleData = {
    picture: file && file.filename ? file.filename : body.photo,
    announce: body.announcement,
    fullText: body[`full-text`],
    title: body.title,
    categories: ensureArray(body.categories),
    date: body.date,
    userId: user.id
  };
  try {
    await api.updateArticle(id, articleData);
    res.redirect(`/my`);
  } catch (error) {
    res.redirect(`/articles/edit/${id}?error=${encodeURIComponent(error.response.data)}`);
  }
});

articlesRouter.get(`/:id`, csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;
  const {error} = req.query;
  const {article, comments} = await api.getArticle(id, true);
  res.render(`post`, {article, comments, id, error, user, csrfToken: req.csrfToken()});
});

articlesRouter.post(`/:id/comments`, auth, csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;
  const {body} = req;

  try {
    await api.createComment(id, {
      text: body.comment,
      userId: user.id,
      articleId: id
    });

    res.redirect(`/articles/${id}`);
  } catch (error) {
    res.redirect(`/articles/${id}?error=${encodeURIComponent(error.response.data)}`);
  }
});

module.exports = articlesRouter;
