const { Sequelize } = require(".");

module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define("post", {
    title: DataTypes.STRING,
    price: DataTypes.STRING,
    description: DataTypes.STRING,
    image_link: DataTypes.STRING,
    user_photo: DataTypes.STRING,
    user_name: DataTypes.STRING,
    likes: DataTypes.REAL,
    comments: DataTypes.REAL,
    tags: DataTypes.ARRAY(DataTypes.STRING),
    liked: DataTypes.BOOLEAN
  }, {
    timestamps: false,
    underscored: true
  });
  
  return Post;
};
