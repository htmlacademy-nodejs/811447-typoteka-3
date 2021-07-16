'use strict';
const {Router} = require(`express`);
const category = require(`./category`);
const article = require(`./article`);
const search = require(`./search`);
const sequelize = require(`../lib/sequelize`);
const defineModels = require(`../models`);

const app = new Router();

defineModels(sequelize);

const {
  CategoryService,
  SearchService,
  ArticleService,
  CommentService,
} = require(`../data-service`);

(async () => {
  category(app, new CategoryService(sequelize));
  search(app, new SearchService(sequelize));
  article(app, new ArticleService(sequelize), new CommentService(sequelize));
})();

module.exports = app;
