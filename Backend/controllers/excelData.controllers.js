const excelDataModel = require("../models/excelData.model");
const xlsx = require("xlsx");

module.exports.uploadExcelData = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Read Excel file from buffer (memory storage)
    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(sheet);

    // Save data to MongoDB
    const newRecord = new excelDataModel({
      uploadedBy: req.user.id,
      fileName: req.file.originalname,
      data: jsonData,
    });

    await newRecord.save();

    res.status(201).json({
      message: "Excel file uploaded and saved to database",
      fileName: req.file.originalname,
      recordId: newRecord._id,
      rowCount: jsonData.length,
      data: jsonData, // optionally send some data back
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Server error while uploading Excel" });
  }
};

module.exports.getExcelDataById = async (req, res) => {
  try {
    const recordId = req.params.id;
    const record = await excelDataModel.findById(recordId);

    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.status(200).json({
      fileName: record.fileName,
      data: record.data,
      uploadedBy: record.uploadedBy,
      uploadedAt: record.createdAt,
    });
  } catch (err) {
    console.error("Error fetching Excel data:", err);
    res.status(500).json({ error: "Server error while fetching Excel data" });
  }
}
