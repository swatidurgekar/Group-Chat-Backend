const User = require("../models/userModel");
const bcrypt = require("bcrypt");

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
          res.json({ success: false, message: "user already exists!" });
          return;
        }
      }
    });
  }
};
