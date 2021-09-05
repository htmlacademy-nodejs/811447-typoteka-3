'use strict';
const Aliase = require(`../models/aliase`);

class CommentService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Comment = sequelize.models.Comment;
    this._User = sequelize.models.User;
  }

  create(articleId, comment) {
    return this._Comment.create({
      articleId,
      ...comment
    });
  }

  async drop(id) {
    const deletedRows = this._Comment.destroy({
      where: {id}
    });
    return !!deletedRows;
  }

  async findAll() {
    const include = [
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
      ],
      order: [
        [`createdAt`, `DESC`]
      ],
      include,
      distinct: true,
      raw: true
    });

    return articles;
  }

  findAllByArticle(articleId) {
    return this._Comment.findAll({
      where: {articleId},
      raw: true,
      include: {
        model: this._User,
        as: Aliase.USER,
        attributes: {
          exclude: [`passwordHash`]
        }
      }
    });
  }
}

module.exports = CommentService;
