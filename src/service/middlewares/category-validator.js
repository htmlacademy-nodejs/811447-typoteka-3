'use strict';

const Joi = require(`joi`);
const {HttpCode} = require(`../../constants`);

const schema = Joi.object({
  name: Joi.string().min(5).max(30).required(),
});

module.exports = (req, res, next) => {
  const category = req.body;

  const {error} = schema.validate(category);
  if (error) {
    return res.status(HttpCode.BAD_REQUEST)
      .send(error.details.map((err) => err.message).join(`\n`));
  }

  return next();
};
