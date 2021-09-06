'use strict';

module.exports = (req, res, next) => {

  const {user} = req.session;
  req.session.save(() => {
    if (!user) {
      return res.redirect(`/login`);
    }
    return next();
  });

};
