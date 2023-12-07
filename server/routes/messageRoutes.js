const express = require("express");
const router = express.Router();
const messageController = require("../controllers/message");
const auth = require("../middleware/auth");
const multerMiddleware = require("../middleware/multer");
const upload = multerMiddleware.multer.single("image");

router.post("/store-message", auth, messageController.storeMessage);
router.post("/get-message/:id", auth, messageController.getMessage);
router.post("/store-image", auth, upload, messageController.storeImage);

module.exports = router;
