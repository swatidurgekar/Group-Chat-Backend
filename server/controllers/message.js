const Message = require("../models/messageModel");
const User = require("../models/userModel");

exports.storeMessage = async (req, res, next) => {
  const user = req.user;
  const createMessage = await user.createMessage({
    message: req.body.message,
  });
  if (createMessage) {
    res.json({ success: true, message: "message sent" });
    return;
  }
};

exports.getMessage = async (req, res, next) => {
  let messagesArr = [];
  const messages = await Message.findAll({
    attributes: ["message", "id"],
    include: [{ model: User, attributes: ["name"] }],
  });
  for (let message of messages) {
    messagesArr.push({
      id: message.id,
      message: message.message,
      name: message.user.name,
    });
  }
  res.json({ success: true, messages: messagesArr });
};
