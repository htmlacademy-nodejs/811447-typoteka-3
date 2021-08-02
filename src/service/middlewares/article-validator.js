'use strict';

const Joi = require(`joi`);
const {HttpCode} = require(`../../constants`);

const schema = Joi.object({
  categories: Joi.array().items(
      Joi.number().integer().positive()
  ).min(1).required(),
  date: Joi.string().required(),
  title: Joi.string().min(30).max(250).required(),
  announce: Joi.string().min(30).max(250).required(),
  fullText: Joi.string().allow(``).max(1000),
  picture: Joi.string().allow(``)
});

module.exports = (req, res, next) => {
  const newArticle = req.body;
  const {error} = schema.validate(newArticle);

  if (error) {
    return res.status(HttpCode.BAD_REQUEST)
      .send(error.details.map((err) => err.message).join(`\n`));
  }

  return next();
};
