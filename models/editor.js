module.exports = (sequelize, DataTypes) => {
    const Editor = sequelize.define("Editor", {
      name: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        unique: true
      },
      password: DataTypes.STRING,
    }, {
      timestamps: false,
      underscored: true,

    });
    Editor.associate = models => {
      Editor.hasMany(models.Event, {
        as: "Events",
        foreignKey: "editor_id",
        foreignKeyConstraint: false 
      })

    }
    
    return Editor;
  };