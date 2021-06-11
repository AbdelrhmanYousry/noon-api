const { Post } = require("../models");

module.exports.updatePost = async (req, res) => {
  const { liked, postId } = req.body;

  if (!postId) {
    return res.status(400).json({
      message: "no no postId",
    });
  }
  if (!liked) {
    return res.status(400).json({
      message: "no no liked",
    });
  }

  try {
    const post = await Post.findOne({
      where: {
        id: postId,
      },
    });
    if (liked === "true") {
      const updateLiked = await post.update({ liked: true });
      const increment = await post.increment({ 'likes': 1 });
    } else if (liked === "false") {
      const updateLiked = await post.update({ liked: false });
      const decrement = await post.decrement({ 'likes': 1 });
    }
    res.status(200).json({
      message: "success",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: "error",
    });
  }
};

module.exports.getPosts = (req, res) => {
  Post.findAll()
    .then((posts) => {
      if (posts.length < 1) {
        return res.status(200).json({
          posts: [],
          message: "you don't have posts yet",
        });
      }

      res.status(200).json({
        posts,
        message: "success",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({
        message: "error",
      });
    });
};
