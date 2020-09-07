
module.exports = (sequelize, DataTypes) => {
    const Admin = sequelize.define("admin", {
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
    return Admin;
  }