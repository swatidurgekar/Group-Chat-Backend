const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Admin = sequelize.define("admins", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = Admin;
