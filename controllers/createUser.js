module.exports = (req, res, next) => {
  // console.log(req.session.registrationError);
  res.render("register", {
    errors: req.flash("registrationError"),
    data: req.flash("data")[0]
  });
};
