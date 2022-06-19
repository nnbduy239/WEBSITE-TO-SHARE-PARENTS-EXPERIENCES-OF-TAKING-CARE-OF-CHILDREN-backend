const express = require("express");
const categoryController = require("../controllers/CategoryController");
const { verifyToken, isAdmin } = require("../middleware/awthJwt");
const router = express.Router();

router
  .route("/")
  .post(categoryController.createCategory)
  .get(categoryController.getCategories);
router
  .route("/:id")
  .post(categoryController.updateCategory)
  .delete(categoryController.deleteCategory);
router.route("/:path").get(categoryController.getCategoryByPath);
module.exports = router;
