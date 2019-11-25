const User = require("../models/User");
const bcrypt = require("bcrypt");

module.exports = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }, (error, user) => {
    bcrypt.compare(password, user.password, (error, result) => {
      if (result) {
        req.session.userId = user._id;
        res.redirect("/");
      } else {
        res.redirect("/auth/login");
      }
    });
  });
};
