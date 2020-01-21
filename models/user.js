
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("user", {
    name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    password: DataTypes.STRING,
    about: DataTypes.TEXT,
    profileUrl: DataTypes.STRING,
  }, {
    timestamps: false,
    underscored: true
  })
  User.associate = models => {
    User.hasMany(models.Event, {
      as: "Events",
      foreignKey: "user_id",
      foreignKeyConstraint: false 
    })
  }
  return User;
}