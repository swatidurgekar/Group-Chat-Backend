const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const groupController = require("../controllers/groups");

router.get("/get-groups", auth, groupController.getGroups);
router.post("/create-group", auth, groupController.createGroup);
router.post("/add-user", groupController.addUser);
router.get("/get-members/:groupId", groupController.getMembers);
router.post("/make-admin/:groupId", groupController.makeAdmin);
router.post("/delete-user/:groupId", groupController.deleteUser);

module.exports = router;
