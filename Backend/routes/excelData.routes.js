const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const excelDataController = require("../controllers/excelData.controllers");
const authMiddleware = require("../middlewares/auth.middleware");

// Disk storage setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..", "uploads")); // uploads folder
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage: storage });

// Route to upload Excel file
router.post(
  "/upload",
  authMiddleware.authUser,
  upload.single("file"), // file field name in formData
  excelDataController.uploadExcelData
);

router.get("/:id", authMiddleware.authUser, excelDataController.getExcelDataById);

module.exports = router;
