module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define("event", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    range: DataTypes.RANGE(DataTypes.DATE),
    address: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM,
      defaultValue: "pending",
      values: ["pending","success"]
    },
    assigned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    published: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    timestamps: false,
    underscored: true
  });
  Event.associate = models => {
    Event.belongsTo(models.User, {
      as: "Owner",
      foreignKey: "user_id",
      foreignKeyConstraint: false 
    });
    Event.belongsTo(models.Photographer, {
      as: "Photographer",
      foreignKey: "photographer_id",
      foreignKeyConstraint: false 
    });
    Event.belongsTo(models.Package, {
      foreignKeyConstraint: false
    });
    Event.belongsTo(models.Location, {
      foreignKeyConstraint: false,
      foreignKey: "location_id",
    });
    Event.hasMany(models.Media)
    Event.belongsToMany(models.Photographer, {
      as: "PotentialPhotographers",
      through: "events_potential_photographers",
      foreignKeyConstraint: false 

    })
  };
  return Event;
};
