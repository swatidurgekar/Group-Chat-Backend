const Group = require("../models/groupModel");
const User = require("../models/userModel");

exports.getGroups = async (req, res, next) => {
  const user = req.user;
  if (user) {
    const groups = await user.getGroups();
    if (groups) {
      res.json({ success: true, groups });
    }
  }
};

exports.createGroup = async (req, res, next) => {
  const user = req.user;
  const { name } = req.body;
  const created = await user.createGroup({ name });
  if (created) {
    res.json({ success: true, message: "group created" });
  }
};

exports.addUser = async (req, res, next) => {
  const { groupId, email } = req.body;
  const group = await Group.findByPk(groupId);
  const user = await User.findAll({ where: { email } });
  if (user.length === 0) {
    res.json({ success: false, message: "user not found" });
    return;
  } else {
    group.addUser(user);
  }
};
