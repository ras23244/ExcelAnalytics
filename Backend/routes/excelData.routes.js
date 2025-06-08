const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const authMiddleware = require("../middlewares/auth.middleware");
const excelDataController = require("../controllers/excelData.controllers");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const xlsx = require("xlsx");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route to upload Excel data
router.post("/upload",authMiddleware.authUser,excelDataController.uploadExcelData);

// Route to analyze Excel data
// router.post(
//   "/analyze",
//   authMiddleware.authUser,
//   [
//   body("recordId").notEmpty().withMessage("Record ID is required"),
//   body("analysisType").notEmpty().withMessage("Analysis type is required"),
//   ],excelDataController.analyzeExcelData
// );

module.exports = router;