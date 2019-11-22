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
      defaultValue: "payment",
      values: ["payment","assigning", "progress", "editing", "done"]
    },
    date: {
      type: DataTypes.DATE
    },
    rate: {
      type: DataTypes.ENUM,

      values: ["1","2","3","4","5"]
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
      foreignKeyConstraint: false,
      foreignKey: "package_id",

    });
    Event.belongsTo(models.Location, {
      foreignKeyConstraint: false,
      foreignKey: "location_id",
    });
    Event.hasMany(models.Media, {
      foreignKey: "event_id",
      foreignKeyConstraint: false,
    })
    Event.belongsToMany(models.Photographer, {
      as: "PotentialPhotographers",
      foreignKey: "event_id",
      through: "events_potential_photographers",
      foreignKeyConstraint: false 

    })
  };
  return Event;
};
