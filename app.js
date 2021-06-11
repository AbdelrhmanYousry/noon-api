const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 5000;
const routes = require("./routes");
const { sequelize } =  require("./models");


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}))

app.use("/api", routes)


const startApp = async () => {
  try {
    await sequelize.sync({ force: false });
    app.listen(PORT, () => {
      console.log("server is running on port:", PORT)
    })
  } catch (error) {
    console.log("error ",error)
  }
};
startApp();

