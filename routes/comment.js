const express = require("express");
const commentController = require("../controllers/CommentController");
const { verifyToken, isAdmin } = require("../middleware/awthJwt");
const router = express.Router();

router.post("/p/:id/comment", verifyToken, commentController.addComment);
router.get("/p/:postId/comment", commentController.getCommentOnPost);
router.get("/comments", commentController.getComments);
router.route("/comment/:id").delete(commentController.deleteComment)
.post(commentController.updateComment)
module.exports = router;
