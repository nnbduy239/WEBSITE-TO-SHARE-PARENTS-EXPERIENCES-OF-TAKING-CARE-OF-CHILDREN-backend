const express = require("express");
const reportController = require("../controllers/ReportController");
const { verifyToken, isAdmin } = require("../middleware/awthJwt");
const router = express.Router();

router.post("/create-report", verifyToken, reportController.createReport);
router.post("/create-post-report",verifyToken,reportController.createPostReport);
router.get("/", reportController.getReports);
router.delete("/:id",reportController.deleteReportById);
module.exports = router;
