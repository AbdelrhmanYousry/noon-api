const Sequelize = require("sequelize");
const {
  DATABASE,
  DB_USER,DB_PASSWORD,
  NODE_ENV,
} = process.env;
const sequelize = NODE_ENV === "development" ? new Sequelize(DATABASE, DB_USER, DB_PASSWORD, {
  dialect: "postgres"
}) : new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@ec2-107-21-10-179.compute-1.amazonaws.com/${DATABASE}`, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false
    }
}
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