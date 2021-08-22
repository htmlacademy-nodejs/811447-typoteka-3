'use strict';

module.exports = (req, res, next) => {

  const {user} = req.session;

  if (!user.isAuthor) {
    return res.redirect(`/`);
  }
  return next();
};
