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
const groupRoutes = require("./routes/groupRoutes");
const User = require("./models/userModel");
const Message = require("./models/messageModel");
const Group = require("./models/groupModel");

app.use("/api/user", userRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/group", groupRoutes);

User.belongsToMany(Group, { through: "usergroups" });
Group.belongsToMany(User, { through: "usergroups" });

Group.hasMany(Message);
Message.belongsTo(Group);

sequelize
  .sync()
  .then(() => app.listen("4000"))
  .catch((err) => console.log(err));
