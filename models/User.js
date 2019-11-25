const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const useSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please add your username"]
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Please add your email"]
  },
  password: {
    type: String,
    required: [true, "please add your password"]
  }
});

useSchema.pre("save", function(next) {
  const user = this;

  bcrypt.hash(user.password, 10, function(error, encrypted) {
    user.password = encrypted;
    next();
  });
});
module.exports = mongoose.model("User", useSchema);
