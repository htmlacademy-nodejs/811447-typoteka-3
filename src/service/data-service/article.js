'use strict';

const Aliase = require(`../models/aliase`);

class ArticleService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._ArticleCategory = sequelize.models.ArticleCategory;
    this._Comment = sequelize.models.Comment;
    this._Category = sequelize.models.Category;
    this._User = sequelize.models.User;
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
    const include = [
      Aliase.CATEGORIES,
      Aliase.COMMENTS,
      {
        model: this._User,
        as: Aliase.USER,
        attributes: {
          exclude: [`passwordHash`]
        }
      }
    ];

    const articles = await this._Article.findAll({
      attributes: [
        `id`,
        `title`,
        `fullText`,
        `announce`,
        `picture`,
        `createdAt`
      ],
      order: [
        [`createdAt`, `DESC`]
      ],
      include
    });
    return articles.map((item) => item.get());
  }

  async findAllByCategory({limit, offset, category}) {
    const {count, rows} = await this._Article.findAndCountAll({

      limit,
      offset,
      include: [
        Aliase.COMMENTS,
        {
          model: this._User,
          as: Aliase.USER,
          attributes: {
            exclude: [`passwordHash`]
          }
        },
        {
          model: this._Category,
          as: Aliase.CATEGORIES,
          where: {
            id: category,
          },
        },
      ],
      distinct: true,
      order: [
        [`createdAt`, `DESC`]
      ],
    });
    return {count, articles: rows};
  }


  async findOne(id) {
    const comments = await this._Comment.findAll({
      where: {articleId: id},
      order: [
        [`createdAt`, `DESC`]
      ],
      include: [
        {
          model: this._User,
          as: Aliase.USER,
          attributes: {
            exclude: [`passwordHash`]
          }
        }
      ]});

    const article = await this._Article.findByPk(id, {
      include: [
        Aliase.CATEGORIES,
        Aliase.COMMENTS
      ]
    });

    return {article, comments};
  }

  async update(id, article) {
    const [affectedRows] = await this._Article.update(article, {
      where: {id}
    });

    const articleUpdated = await this._Article.findByPk(id, {include: [Aliase.CATEGORIES]});
    if (articleUpdated) {
      await articleUpdated.addCategories(article.categories.map((category) => Number(category)));
    }

    return !!affectedRows;
  }

  async findPage({limit, offset}) {
    const {count, rows} = await this._Article.findAndCountAll({
      limit,
      offset,
      order: [
        [`createdAt`, `DESC`]
      ],
      include: [
        Aliase.CATEGORIES,
        Aliase.COMMENTS,
        {
          model: this._User,
          as: Aliase.USER,
          attributes: {
            exclude: [`passwordHash`]
          }
        }
      ],
      distinct: true
    });
    return {count, articles: rows};
  }

}

module.exports = ArticleService;
