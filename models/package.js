module.exports = (sequelize, DataTypes) => {
    const Package = sequelize.define("package", {
      name: {
        type: DataTypes.STRING,
      },
      hours: DataTypes.INTEGER,
      price: DataTypes.INTEGER,
    }, {
      timestamps: false,
      underscored: true

    });
    Package.associate = models => {
      Package.belongsTo(models.Category, {
        foreignKeyConstraint: false 

      })
      Package.hasMany(models.Event, {
        as: "Events",
        foreignKeyConstraint: false 
      })
    }
    return Package;
  };