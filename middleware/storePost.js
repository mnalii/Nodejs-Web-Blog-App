module.exports = (req, res, next) => {
  if (!req.files || !req.body.title || !req.body.content || !req.body.content) {
    return res.redirect("/post/new");
  }

  next();
};
