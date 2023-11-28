const Admin = require("../models/adminModel");
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
  const createAdmin = await Admin.create({ email: user.email });
  await created.addAdmin(createAdmin);
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
    await group.addUser(user);
    res.json({ success: true, message: "user added" });
  }
};

exports.getMembers = async (req, res, next) => {
  const groupId = req.params.groupId;
  const group = await Group.findByPk(groupId);
  if (group) {
    const admins = await group.getAdmins();
    const users = await group.getUsers();
    res.json({ success: true, admins, users });
    return;
  }
  res.json({ success: false, message: "group does not exist" });
};

exports.makeAdmin = async (req, res, next) => {
  const groupId = req.params.groupId;
  const userId = req.body.userId;
  const group = await Group.findByPk(groupId);
  const user = await User.findByPk(userId);
  if (group && user) {
    group.createAdmin({ email: user.email });
    res.json({ success: true, message: "Admin updated" });
    return;
  }
  res.json({ success: false, message: "user or group not found!" });
};

exports.deleteUser = async (req, res, next) => {
  const groupId = req.params.groupId;
  const { email, isadmin } = req.body;
  const group = await Group.findByPk(groupId);
  if (isadmin) {
    const admin = await group.getAdmins({ where: { email } });
    const user = await group.getUsers({ where: { email } });
    await admin[0].destroy();
    if (user) {
      const removed = await group.removeUser(user);
      if (removed) {
        res.json({ success: true, message: "user removed from group" });
      }
    }
  } else {
    const user = await group.getUsers({ where: { email } });
    if (user) {
      const removed = await group.removeUser(user);
      if (removed) {
        res.json({ success: true, message: "user removed from group" });
      }
    }
  }
};
