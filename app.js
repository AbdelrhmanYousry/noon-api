const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const passport = require("passport");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 5001;
const routes = require("./routes");
const { sequelize } =  require("./models");


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}))

app.use(passport.initialize());
require("./config/passport")(passport);

app.use("/api", routes)

sequelize.sync({force: false}).then(() => {
  console.log("connected to db..")
  app.listen(PORT, () => {
    console.log("server is running on port:", PORT)
  })
}).catch(err => {
  console.log(err)
})