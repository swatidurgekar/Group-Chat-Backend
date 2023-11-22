const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signUp = (req, res, next) => {
  const { name, email, phone, password } = req.body;
  if (!name || !email || !phone || !password) {
    res.json({ success: false, message: "please fill all fields" });
    return;
  } else {
    bcrypt.hash(password, 10, async (err, hashValue) => {
      if (err) {
        res.json({ success: false, message: "something went wrong" });
        return;
      } else {
        try {
          await User.create({ name, email, phone, password: hashValue });
          res
            .status(200)
            .json({ success: true, message: "user created successfully" });
          return;
        } catch (err) {
          res.json({ success: false, message: "user exists" });
          return;
        }
      }
    });
  }
};

const generateToken = (id) => {
  return jwt.sign(id, process.env.JWTTOKEN);
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.json({ success: false, message: "please fill all fields" });
    return;
  } else {
    const user = await User.findAll({ where: { email } });
    if (user.length === 0) {
      res.json({ success: false, message: "user not found" });
      return;
    } else {
      bcrypt.compare(password, user[0].password, async (err, response) => {
        if (err) {
          res.json({ success: false, message: "something went wrong" });
          return;
        } else if (response) {
          const token = generateToken(user[0].id);
          res.json({ success: true, message: "Login success", token });
          return;
        } else {
          res.json({ success: false, message: "incorrect password" });
          return;
        }
      });
    }
  }
};
