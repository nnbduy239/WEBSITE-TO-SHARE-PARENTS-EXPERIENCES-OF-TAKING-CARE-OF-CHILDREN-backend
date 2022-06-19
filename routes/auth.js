const express = require("express");
const { validationRegister } = require("../middleware/validation");
const {
    Register,
    Login,
    activeAccount,
    Logout,
    sendEmailForgotPassword,
    ChangePassword,
} = require("../controllers/Auth");
const { refreshToken } = require("../controllers/RefreshToken");
const router = express.Router();

router.post("/register", validationRegister, Register);
router.post("/active", activeAccount);
router.post("/forgot-password", sendEmailForgotPassword);
router.post("/reset-password", ChangePassword);
router.post("/login", Login);
router.delete("/logout", Logout);
router.get("/refresh", refreshToken);
module.exports = router;
