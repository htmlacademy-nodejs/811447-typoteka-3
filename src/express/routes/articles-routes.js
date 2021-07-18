'use strict';

const {Router} = require(`express`);
const multer = require(`multer`);
const path = require(`path`);
const {nanoid} = require(`nanoid`);
const api = require(`../api`).getAPI();
const {ensureArray} = require(`../../utils`);

const articlesRouter = new Router();
const UPLOAD_DIR = `../upload/img/`;
const OFFERS_PER_PAGE = 8;

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

articlesRouter.get(`/category/:id`, async (req, res) => {
  let {page = 1} = req.query;
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
  res.render(`articles-by-category`, {articles, categories, id, page, totalPages});
});

articlesRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  const [article, categories] = await Promise.all([
    api.getArticle(id),
    api.getCategories()
  ]);
  res.render(`edit-post`, {article, categories});
});

articlesRouter.get(`/add`, async (req, res) => {
  const categories = await api.getCategories();
  res.render(`new-post`, {categories});
});

articlesRouter.post(`/add`, upload.single(`upload`), async (req, res) => {
  const {body, file} = req;
  const articleData = {
    picture: file && file.filename ? file.filename : ``,
    announce: body.announcement,
    fullText: body[`full-text`],
    title: body.title,
    categories: ensureArray(body.categories),
    createdAt: body.date,
    userId: 1
  };
  try {
    await api.createArticle(articleData);
    res.redirect(`/my`);
  } catch (error) {
    res.redirect(`back`);
  }
});

articlesRouter.post(`/edit/:id`, upload.single(`avatar`), async (req, res) => {
  const {body, file} = req;
  const {id} = req.params;
  const articleData = {
    picture: file && file.filename ? file.filename : body.photo,
    announce: body.announcement,
    fullText: body[`full-text`],
    title: body.title,
    categories: ensureArray(body.categories),
    createdAt: body.date,
    userId: 1
  };
  try {
    await api.updateArticle(id, articleData);
    res.redirect(`/my`);
  } catch (error) {
    res.redirect(`/articles/edit/${id}`);
  }
});

articlesRouter.get(`/:id`, async (req, res) => {
  const {id} = req.params;
  const article = await api.getArticle(id, true);
  res.render(`post`, {article});
});

module.exports = articlesRouter;
