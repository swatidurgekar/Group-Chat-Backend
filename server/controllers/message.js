const Admin = require("../models/adminModel");
const Group = require("../models/groupModel");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Sequelize = require("sequelize");

exports.storeMessage = async (req, res, next) => {
  const user = req.user;
  if (!user) {
    res.json({ success: false, message: "user not found" });
    return;
  }
  const groupId = req.body.groupId;
  if (groupId) {
    const group = await Group.findAll({ where: { id: groupId } });
    if (group) {
      const createMessage = await Message.create({
        message: req.body.message,
        groupId,
        name: user.name,
      });
      if (createMessage) {
        res.json({ success: true, message: "message sent" });
        return;
      }
    }
  }
};

exports.getMessage = async (req, res, next) => {
  const user = req.user;
  const groupId = req.params.id;
  const messages = await Message.findAll({
    where: {
      groupId,
      id: { [Sequelize.Op.gt]: req.body.msgId },
    },
  });
  const group = await Group.findByPk(groupId);
  const admin = await group.getAdmins({ where: { email: user.email } });
  if (admin.length === 0) {
    res.json({ success: true, messages, admin: false });
    return;
  }
  res.json({ success: true, messages, admin: true });
};
