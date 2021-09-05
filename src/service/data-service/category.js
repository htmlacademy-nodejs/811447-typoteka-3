'use strict';

const Sequelize = require(`sequelize`);
const Aliase = require(`../models/aliase`);

class CategoryService {
  constructor(sequelize) {
    this._Category = sequelize.models.Category;
    this._ArticleCategory = sequelize.models.ArticleCategory;
  }

  async create(data) {
    return this._Category.create(data);
  }

  async drop(id) {
    const deletedRows = this._Category.destroy({
      where: {id}
    });
    return !!deletedRows;
  }

  async update(id, category) {
    const [affectedRows] = await this._Category.update(category, {
      where: {id}
    });

    return !!affectedRows;
  }

  findOne(id) {
    return this._Category.findByPk(id, {
      raw: true
    });
  }

  async findAll(needCount) {
    if (needCount) {
      const result = await this._Category.findAll({
        attributes: [
          `id`,
          `name`,
          [
            Sequelize.fn(
                `COUNT`,
                `*`
            ),
            `count`
          ]
        ],
        group: [Sequelize.col(`Category.id`)],
        include: [{
          model: this._ArticleCategory,
          as: Aliase.ARTICLE_CATEGORIES,
          attributes: [],
        }],
      });
      return result.map((it) => it.get());
    } else {
      return this._Category.findAll({raw: true});
    }
  }
}

module.exports = CategoryService;
