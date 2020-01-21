module.exports = (sequelize, DataTypes) => {
  const CategoriesPackages = sequelize.define("categories_packages", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    }
  }, {
      timestamps: false
  });
  CategoriesPackages.associate = models => {
    CategoriesPackages.hasMany(models.Event, {
      as: "Events",
      foreignKey: "category_package_id",
      foreignKeyConstraint: false 
    })
   }
  return CategoriesPackages;
};
