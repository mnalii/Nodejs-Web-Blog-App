const Post = require("../models/Post");

module.exports = async (req, res, next) => {
  const post = await Post.findById(req.params.id).populate("author");
  res.render("post", { post });
};
