const express = require("express");
const postController = require("../controllers/PostsController");
const { verifyToken, isAdmin } = require("../middleware/awthJwt");
const router = express.Router();

router.post("/create-post", verifyToken, postController.createPost);
router.get("/treding",postController.getTrendingPosts);
router.get("/posts",postController.getAllParentPosts);
router.get("/", postController.getPosts);
router.get("/doctor",postController.getPostsByDoctor)
router.get("/:path", postController.getPostsByCategory);
router.get("/u/:userId", postController.getPostsByUserId);
router
    .route("/post/:id")
    .get(postController.getPostById)
    .post(verifyToken, postController.editPost)
    .delete(postController.deletePost);
router.post("/post/:id/approve", verifyToken, postController.appProve);
module.exports = router;
