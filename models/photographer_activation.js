
module.exports = (sequelize, DataTypes) => {
    const PhotographerActivation = sequelize.define("photographer_activation", {
      code: DataTypes.STRING,
      
    }, {
      underscored: true
    })
    PhotographerActivation.associate = models => {
      PhotographerActivation.belongsTo(models.Photographer, {
        as: "Photographer",
        foreignKey: "photographer_id",
        foreignKeyConstraint: false 
      })
    }
    return PhotographerActivation;
  }