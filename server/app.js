require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sequelize = require("./util/database");

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const userRoutes = require("./routes/userRoutes");

app.use("/api/user", userRoutes);

sequelize
  .sync()
  .then(() => app.listen("4000"))
  .catch((err) => console.log(err));
