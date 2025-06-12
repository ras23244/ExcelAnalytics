const express = require("express");
const router = express.Router();
const multer = require("multer");
const excelDataController = require("../controllers/excelData.controllers");
const authMiddleware = require("../middlewares/auth.middleware");

// Use memory storage instead of disk storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route to upload Excel file
router.post(
  "/upload",
  authMiddleware.authUser,
  upload.single("file"),
  excelDataController.uploadExcelData
);

router.get("/:id", authMiddleware.authUser, excelDataController.getExcelDataById);

module.exports = router;
