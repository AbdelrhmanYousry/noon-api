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
      const increment = await post.increment({ likes: 1 });
    } else if (liked === "false") {
      const updateLiked = await post.update({ liked: false });
      const decrement = await post.decrement({ likes: 1 });
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
  Post.findAll({
    order: [["id", "DESC"]],
  })
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

// module.exports.createPost = (req, res) => {
//   const {
//     title,
//     price,
//     description,
//     image_link,
//     user_photo,
//     user_name,
//     likes,
//     comments,
//     tags,
//     liked,
//   } = req.body;


//   if (!title) {
//     return res.status(400).json({
//       message: "no no title",
//     });
//   }
//   if (!price) {
//     return res.status(400).json({
//       message: "no no price",
//     });
//   }
//   if (!description) {
//     return res.status(400).json({
//       message: "no no description",
//     });
//   }
//   if (!likes) {
//     return res.status(400).json({
//       message: "no no likes",
//     });
//   }
//   if (!comments) {
//     return res.status(400).json({
//       message: "no no comments",
//     });
//   }
//   if (!tags) {
//     return res.status(400).json({
//       message: "no no tags",
//     });
//   }
//   if (!liked) {
//     return res.status(400).json({
//       message: "no no liked",
//     });
//   }

//   Post.create({
//     title,
//     price,
//     description,
//     image_link,
//     user_photo,
//     user_name,
//     likes,
//     comments,
//     tags,
//     liked,
//   })
//     .then((post) => {
//       res.status(200).json({
//         post,
//         message: "success",
//       });
//     })
//     .catch((err) => {
//       console.log(err);
//       res.status(400).json({
//         message: "error",
//       });
//     });
// };