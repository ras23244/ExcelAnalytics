const userModel = require("../models/user.model");
const { validationResult } = require("express-validator");
const excelDataModel = require("../models/excelData.model");
const path= require("path");
const fs = require("fs");

module.exports.register = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { name, email, password } = req.body;
  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await userModel.hashPassword(password);
    const newUser = new userModel({
      name,
      role: req.body.role || "user", // Default role to 'user' if not provided
      email,
      password: hashedPassword,
    });

    await newUser.save();
    const token = newUser.generateAuthToken();

    res.status(201).json({ token });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = user.generateAuthToken();
    res.cookie("token", token);
    res.status(200).json({ token, user });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


module.exports.getProfile = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports.getAdminProfile = async (req, res, next) => {
    try{
        const user = await userModel.findById(req.user._id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.role !== "admin") {
            return res.status(403).json({ message: "Access denied" });
        }
        res.status(200).json(user);
    } catch(error){
        console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports.logout = async (req, res, next) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await userModel.find({ role: "user" });
   
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.getMyUploads = async (req, res, next) => {
  try {
    const uploads = await excelDataModel
      .find({ uploadedBy: req.user._id })
      .select("fileName uploadedAt") // limit fields
      .sort({ uploadedAt: -1 });
    res.status(200).json(uploads);
  } catch (error) {
    console.error("Error fetching uploads:", error);
    res.status(500).json({ error: "Server error fetching uploaded files" });
  }
};

module.exports.deleteUpload = async (req, res, next) => {
  try {
    const uploadId = req.params.id;
    const upload = await excelDataModel.findByIdAndDelete(uploadId);
    if (!upload) {
      return res.status(404).json({ message: "Upload not found" });
    }
    // If you store the file on disk, delete it here (optional):
    const filePath = path.join(__dirname, '..', 'uploads', upload.fileName);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    res.status(200).json({ message: "Upload deleted successfully" });
  } catch (error) {
    console.error("Error deleting upload:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports.deleteUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await userModel.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//this can be wrong ..must check it.
module.exports.deleteFile = async (req, res, next) => {
  try {
    const fileId = req.params.id;
    const fileRecord = await excelDataModel.findByIdAndDelete(fileId);
    if (!fileRecord) {
      return res.status(404).json({ message: "File not found" });
    }
    // If you store the file on disk, delete it here (optional):
    // const filePath = path.join(__dirname, '..', 'uploads', fileRecord.fileName);
    // if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.getAllFiles = async (req, res, next) => {
    try {
        // Fetch all uploaded files with uploader's name and email
        const uploads = await excelDataModel
            .find()
            .populate('uploadedBy', 'name') // Populate uploadedBy with name and email
            .select('fileName uploadedAt uploadedBy')
            .sort({ uploadedAt: -1 });

        res.status(200).json(uploads);
    } catch (error) {
        console.error("Error fetching all files:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get all users with their uploaded files (for admin panel)
module.exports.getUsersWithFiles = async (req, res, next) => {
  try {
    // Fetch all users (excluding password)
    const users = await userModel.find({}, '-password').lean();
    // Fetch all files
    const files = await excelDataModel.find({}, 'fileName uploadedAt uploadedBy').lean();
    // Group files by user
    const filesByUser = {};
    files.forEach(file => {
      const userId = file.uploadedBy.toString();
      if (!filesByUser[userId]) filesByUser[userId] = [];
      filesByUser[userId].push(file);
    });
    // Attach files to each user
    const usersWithFiles = users.map(user => ({
      ...user,
      files: filesByUser[user._id.toString()] || []
    }));
    res.status(200).json(usersWithFiles);
  } catch (error) {
    console.error('Error fetching users with files:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
