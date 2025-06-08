const excelDataModel = require('../models/excelData.model');

module.exports.uploadExcelData = async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const filePath = path.join(__dirname, "..", "uploads", req.file.filename);

      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0]; 
      const sheet = workbook.Sheets[sheetName];
      const jsonData = xlsx.utils.sheet_to_json(sheet);

      // Save to MongoDB
      const newRecord = new excelDataModel({
        uploadedBy: req.user.id,
        fileName: req.file.originalname,
        data: jsonData,
      });

      await newRecord.save();

      fs.unlinkSync(filePath); // cleanup the uploaded file

      res.status(201).json({
        message: "Excel file uploaded and saved to database",
        recordId: newRecord._id,
        rowCount: jsonData.length,
      });
    } catch (err) {
      console.error("Upload error:", err);
      res.status(500).json({ error: "Server error while uploading Excel" });
    }
}