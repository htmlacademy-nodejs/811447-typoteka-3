'use strict';

const Aliase = require(`../models/aliase`);

class ArticleService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Comment = sequelize.models.Comment;
    this._Category = sequelize.models.Category;
  }

  async create(articleData) {
    const article = await this._Article.create(articleData);
    await article.addCategories(articleData.categories.map((category) => Number(category)));
    return article.get();
  }

  async drop(id) {
    const deletedRows = await this._Article.destroy({
      where: {id}
    });
    return !!deletedRows;
  }

  async findAll() {
    const include = [Aliase.CATEGORIES, Aliase.COMMENTS];

    const articles = await this._Article.findAll({
      attributes: [
        `id`,
        `title`,
        `fullText`,
        `announce`,
        `picture`,
        `createdAt`
      ],
      include
    });
    return articles.map((item) => item.get());
  }

  async findOne(id) {
    return this._Article.findByPk(id, {include: [Aliase.CATEGORIES, Aliase.COMMENTS]});
  }

  async update(id, article) {
    const [affectedRows] = await this._Article.update(article, {
      where: {id}
    });

    const articleUpdated = await this._Article.findByPk(id, {include: [Aliase.CATEGORIES]});
    await articleUpdated.addCategories(article.categories.map((category) => Number(category)));

    return !!affectedRows;
  }

}

module.exports = ArticleService;
