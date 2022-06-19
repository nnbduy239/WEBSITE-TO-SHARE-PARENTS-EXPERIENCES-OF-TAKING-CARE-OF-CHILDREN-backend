const express = require("express");
const userController = require("../controllers/UserController");
const { verifyToken, isAdmin } = require("../middleware/awthJwt");
const router = express.Router();
router
  .route("/")
  .get(userController.getUsers)
  .post(userController.createUser);
router.route('/profile').post([verifyToken], userController.updateProfile)
.get([verifyToken],userController.getCurrentUser)
router
  .route("/:id")
  .post(userController.updateUser)
  .get(userController.getUserbyId)
  .delete(userController.deleteUser);
module.exports = router;
