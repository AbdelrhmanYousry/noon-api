const Sequelize = require("sequelize");
const {
  DATABASE,
  DB_USER,DB_PASSWORD,
  NODE_ENV,
  DATABASE_URL
} = process.env;
const sequelize = NODE_ENV === "development" ? new Sequelize(DATABASE, DB_USER, DB_PASSWORD, {
  dialect: "postgres"
}) : new Sequelize(DATABASE_URL, {
  dialect: "postgres"
}) ;


const models = {
  Post: sequelize.import("./post")
}


Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});


models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;