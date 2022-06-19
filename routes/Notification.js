const express = require("express");
const NotifiController = require("../controllers/NotifiController");
const router = express.Router();

router.get("/:userId", NotifiController.getNotification);
router.post("/read", NotifiController.readNotification);
router.delete("/:id",NotifiController.deleteNotification);
module.exports = router;
