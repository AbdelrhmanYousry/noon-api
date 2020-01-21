module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define(
    "Category",
    {
      name: {
        type: DataTypes.STRING,
        unique: true
      },
      available: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      eventType: {
        type: DataTypes.ENUM,
        defaultValue: "both",
        values: ["personal","business", "both"]
      },
    },
    {
      timestamps: false,
      underscored: true
    }
  );
  Category.associate = models => {
    Category.belongsToMany(models.Photographer, {
      as: "Photographers",
      through: "category_photographer_relationship",
      foreignKey: "category_id",
      foreignKeyConstraint: false,
      timestamps: false
    });
    Category.belongsToMany(models.Package, {
      through: models.CategoriesPackages,
      as: "Packages",
      foreignKey: "category_id",
      foreignKeyConstraint: false
    });
  };
  return Category;
};
