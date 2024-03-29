'use strict';
const {Router} = require(`express`);
const category = require(`./category`);
const article = require(`./article`);
const search = require(`./search`);
const user = require(`./user`);
const sequelize = require(`../lib/sequelize`);
const defineModels = require(`../models/models`);
const {
  CategoryService,
  SearchService,
  ArticleService,
  CommentService,
  UserService
} = require(`../data-service`);

const app = new Router();

defineModels(sequelize);

(async () => {
  category(app, new CategoryService(sequelize));
  search(app, new SearchService(sequelize));
  article(app, new ArticleService(sequelize), new CommentService(sequelize));
  user(app, new UserService(sequelize));
})();

module.exports = app;
