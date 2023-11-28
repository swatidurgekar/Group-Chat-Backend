const express = require("express");
const router = express.Router();
const messageController = require("../controllers/message");
const auth = require("../middleware/auth");

router.post("/store-message", auth, messageController.storeMessage);
router.post("/get-message/:id", auth, messageController.getMessage);

module.exports = router;
