'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const categoryValidator = require(`../middlewares/category-validator`);

const route = new Router();

module.exports = (app, service) => {
  app.use(`/categories`, route);

  route.get(`/`, async (req, res) => {
    const {count} = req.query;
    const categories = await service.findAll(count);
    res.status(HttpCode.OK).json(categories);
  });

  route.get(`/:id`, async (req, res) => {
    const {id} = req.params;
    const {count} = req.query;
    const category = await service.findOne(id);

    if (!category) {
      return res.status(HttpCode.NOT_FOUND).send(`Not found with ${id}`);
    }
    const categories = await service.findAll(count);
    return res.status(HttpCode.OK).json(categories);
  });

  route.post(`/`, categoryValidator, async (req, res) => {
    const category = await service.create(req.body);
    return res.status(HttpCode.CREATED).json(category);
  });

  route.put(`/:id`, categoryValidator, async (req, res) => {
    const {id} = req.params;
    const categoryUpdate = await service.update(id, req.body);
    return res.status(HttpCode.CREATED).json(categoryUpdate);
  });

  route.delete(`/:id`, async (req, res) => {
    const {id} = req.params;
    const categories = await service.findAll(true);
    let categoryDeleted = false;
    if (categories.find((category) => category.id === Number(id)).count < 1) {
      categoryDeleted = await service.drop(id);
    }
    return res.status(HttpCode.OK).json(categoryDeleted);
  });
};
