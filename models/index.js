const Sequelize = require("sequelize");
const {DATABASE, USER, PASSWORD} = process.env;
const sequelize = new Sequelize(DATABASE, USER, PASSWORD, {
  dialect: "postgres"
});


const models = {
  User: sequelize.import("./user"),
  Photographer: sequelize.import("./photographer"),
  Event: sequelize.import("./event"),
  Category: sequelize.import("./category"),
  Location: sequelize.import("./location"),
  Media: sequelize.import("./media"),
  Package: sequelize.import("./package"),
  Editor: sequelize.import("./editor"),
  UserActivation: sequelize.import("./photographer_activation")
}


Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});


models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;