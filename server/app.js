require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const socketIO = require("socket.io");
const sequelize = require("./util/database");
const port = process.env.PORT;

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
const Admin = require("./models/adminModel");

app.use("/api/user", userRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/group", groupRoutes);

User.belongsToMany(Group, { through: "usergroups" });
Group.belongsToMany(User, { through: "usergroups" });

Group.hasMany(Message);
Message.belongsTo(Group);

Group.hasMany(Admin);
Admin.belongsTo(Group);

sequelize.sync().then(() => {
  const server = http.createServer(app);
  const io = socketIO(server, {
    cors: {
      origin: ["http://localhost:3000"],
    },
  });
  io.on("connection", (socket) => {
    console.log(socket.id);
    socket.on("send-message", (message, room) => {
      if (room) {
        socket.to(room).emit("recieve-message", message);
      }
    });
    socket.on("join-room", (room) => {
      socket.join(room);
    });
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  server.listen(process.env.port, () => {
    console.log(`Server running on port ${port}`);
  });
});
