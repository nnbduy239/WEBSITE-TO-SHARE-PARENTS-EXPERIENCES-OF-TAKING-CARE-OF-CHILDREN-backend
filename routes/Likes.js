const express = require("express");
const likesController = require("../controllers/LikesController");
const { verifyToken, isAdmin } = require("../middleware/awthJwt");
const router = express.Router();

router.route("/").post(verifyToken,likesController.addLikes);

module.exports = router;