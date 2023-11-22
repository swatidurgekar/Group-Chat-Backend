const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const Authentication = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    const userId = jwt.verify(token, process.env.JWTTOKEN);
    const user = await User.findByPk(userId);
    req.user = user;
    next();
  } catch (err) {
    console.log(err);
  }
};

module.exports = Authentication;
