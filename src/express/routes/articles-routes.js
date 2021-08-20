'use strict';

const {Router} = require(`express`);
const multer = require(`multer`);
const path = require(`path`);
const {nanoid} = require(`nanoid`);
const csrf = require(`csurf`);
const api = require(`../api`).getAPI();
const {ensureArray} = require(`../../utils`);
const {OFFERS_PER_PAGE} = require(`../../constants`);
const auth = require(`../../service/middlewares/auth`);
const csrfProtection = csrf();

const articlesRouter = new Router();
const UPLOAD_DIR = `../upload/img/`;

const uploadDirAbsolute = path.resolve(__dirname, UPLOAD_DIR);
const storage = multer.diskStorage({
  destination: uploadDirAbsolute,
  filename: (req, file, cb) => {
    const uniqueName = nanoid(10);
    const extension = file.originalname.split(`.`).pop();
    cb(null, `${uniqueName}.${extension}`);
  }
});
const upload = multer({storage});

articlesRouter.get(`/category/:id`, auth, async (req, res) => {
  const {user} = req.session;
  let {page = 1, error} = req.query;
  page = +page;
  const limit = OFFERS_PER_PAGE;
  const offset = (page - 1) * OFFERS_PER_PAGE;

  const {id} = req.params;
  const [
    {count, articles},
    categories
  ] = await Promise.all([
    api.getArticles({limit, offset, comments: true}),
    api.getCategories(true)
  ]);

  const totalPages = Math.ceil(count / OFFERS_PER_PAGE);
  res.render(`articles-by-category`, {articles, categories, id, page, totalPages, error, user});
});

articlesRouter.get(`/edit/:id`, auth, csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {error} = req.query;
  const {id} = req.params;
  const [article, categories] = await Promise.all([
    api.getArticle(id),
    api.getCategories()
  ]);
  res.render(`edit-post`, {article, categories, error, user});
});

articlesRouter.get(`/add`, auth, csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {error} = req.query;
  const categories = await api.getCategories();
  res.render(`new-post`, {categories, error, user, csrfToken: req.csrfToken()});
});

articlesRouter.post(`/add`, auth, csrfProtection, upload.single(`upload`), async (req, res) => {
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

articlesRouter.post(`/edit/:id`, auth, upload.single(`avatar`), async (req, res) => {
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

articlesRouter.get(`/:id`, auth, csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;
  const {error} = req.query;
  const article = await api.getArticle(id, true);
  res.render(`post`, {article, id, error, user, csrfToken: req.csrfToken()});
});

articlesRouter.post(`/:id/comments`, auth, csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;
  const {body} = req;

  try {
    await api.createComment(id, {
      text: body.comment, userId: user.id
    });
    res.redirect(`/articles/${id}`);
  } catch (error) {
    res.redirect(`/articles/${id}?error=${encodeURIComponent(error.response.data)}`);
  }
});

module.exports = articlesRouter;
