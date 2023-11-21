const User = require("../models/userModel");
const bcrypt = require("bcrypt");

exports.signUp = (req, res, next) => {
  const { name, email, phone, password } = req.body;
  if (!name || !email || !phone || !password) {
    return res
      .status(404)
      .json({ success: false, message: "please fill all fields" });
  } else {
    bcrypt.hash(password, 10, async (err, hashValue) => {
      if (err) {
        return res
          .status(404)
          .json({ success: false, message: "something went wrong" });
      } else {
        try {
          await User.create({ name, email, phone, password: hashValue });
          return res
            .status(200)
            .json({ success: true, message: "user created successfully" });
        } catch (err) {
          return res
            .status(404)
            .json({ success: false, message: "user already exists!" });
        }
      }
    });
  }
};
