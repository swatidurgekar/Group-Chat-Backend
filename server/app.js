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
const messageRoutes = require("./routes/messageRoutes");
const User = require("./models/userModel");
const Message = require("./models/messageModel");

app.use("/api/user", userRoutes);
app.use("/api/message", messageRoutes);

User.hasMany(Message);
Message.belongsTo(User);

sequelize
  .sync()
  .then(() => app.listen("4000"))
  .catch((err) => console.log(err));
