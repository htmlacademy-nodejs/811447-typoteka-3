'use strict';

const api = require(`../api`).getAPI();
const {Router} = require(`express`);

const OFFERS_PER_PAGE = 8;

const mainRouter = new Router();

mainRouter.get(`/`, async (req, res) => {
  let {page = 1} = req.query;
  page = +page;
  const limit = OFFERS_PER_PAGE;
  const offset = (page - 1) * OFFERS_PER_PAGE;

  const [
    {count, articles},
    categories
  ] = await Promise.all([
    api.getArticles({limit, offset, comments: true}),
    api.getCategories(true)
  ]);

  const totalPages = Math.ceil(count / OFFERS_PER_PAGE);
  res.render(`main`, {articles, categories, page, totalPages});
});
mainRouter.get(`/register`, (req, res) => res.render(`sign-up`));
mainRouter.get(`/login`, (req, res) => res.render(`login`));

mainRouter.get(`/search`, async (req, res) => {
  try {
    const {search} = req.query;
    const results = await api.search(search);

    res.render(`search`, {results});
  } catch (error) {
    res.render(`search`, {
      results: []
    });
  }
});

mainRouter.get(`/categories`, async (req, res) => {
  const categories = await api.getCategories(true);
  res.render(`all-categories`, {categories});
});

module.exports = mainRouter;
