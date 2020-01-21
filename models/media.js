module.exports = (sequelize, DataTypes) => {
    const Media = sequelize.define("media", {
        raw:  DataTypes.STRING,
        edited: DataTypes.STRING
        
    }, {
        underscored: true
    })
    Media.associate = models => {
        Media.belongsTo(models.Event, {
            foreignKey: "event_id",
            as: "Event",
            foreignKeyConstraint: false,
        })
    }
    return Media
}