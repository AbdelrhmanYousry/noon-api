module.exports = (sequelize, DataTypes) => {
  const Location = sequelize.define(
    "location",
    {
      name: DataTypes.STRING,
      availabe: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    },
    {
      timestamps: false,
      underscored: true
    }
  );
  Location.associate = models => {
    Location.hasMany(models.Event, {
      as: "Events",
      foreignKeyConstraint: false,
      foreignKey: "location_id"
    });
    Location.hasMany(models.Photographer, {
      as: "Photographers",
      foreignKey: "location_id",
      foreignKeyConstraint: false

    });
  };
  return Location;
};
