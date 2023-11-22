const Message = require("../models/messageModel");

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
