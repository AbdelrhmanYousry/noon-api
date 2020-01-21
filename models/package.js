module.exports = (sequelize, DataTypes) => {
    const Package = sequelize.define("package", {
      name: {
        type: DataTypes.STRING,
      },
      hours: DataTypes.INTEGER,
      price: DataTypes.INTEGER,
      available: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
    }, {
      timestamps: false,
      underscored: true

    });
    Package.associate = models => {
      Package.belongsToMany(models.Category, {
        through: models.CategoriesPackages,
        as: "Categories",
        foreignKey: "package_id",
        foreignKeyConstraint: false 

      })
    }
    return Package;
  };