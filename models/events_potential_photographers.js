module.exports = (sequelize, DataTypes) => {
  const EventsPotentialPhotographers = sequelize.define("events_potential_photographer", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    rejected: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    accepted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
  }, {
      timestamps: false
  });
  
  return EventsPotentialPhotographers;
};
