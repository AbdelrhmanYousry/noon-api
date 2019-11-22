module.exports = (sequelize, DataTypes) => {
  const Photographer = sequelize.define("photographer", {
    name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    password: DataTypes.STRING,
    business: DataTypes.ARRAY(DataTypes.RANGE(DataTypes.DATE)),
    work_done: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    timestamps: false,
    underscored: true
  });
  Photographer.associate = models => {
    Photographer.hasMany(models.Event, {
      as: "Events",
      foreignKey: "photographer_id",
      foreignKeyConstraint: false
    })
    Photographer.belongsTo(models.Location, {
      as: "City",
      foreignKey: "location_id",     
      foreignKeyConstraint: false 

    })
    Photographer.belongsToMany(models.Category, {
      as: "Categories",
      foreignKey: "photographer_id",

      through: "category_photographer_relationship",
      foreignKeyConstraint: false 

      
    })
    Photographer.belongsToMany(models.Event, {
      as: "UpcomingEvents",
      through: "events_potential_photographers",
      foreignKey: "photographer_id",
      foreignKeyConstraint: false 
    })
    Photographer.hasOne(models.PhotographerActivation, {
      as: "Code",
      foreignKey: "photographer_id",
      foreignKeyConstraint: false 
    })
  }
  
  return Photographer;
};
