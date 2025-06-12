const mongoose = require("mongoose");
const logger = require("../logger");

function connectToDb() {
  mongoose
    .connect(process.env.MONGO_URI, {})
    .then(() => logger.info("Connected to MongoDB Atlas"))
    .catch((err) => logger.error(`MongoDB connection error: ${err.message}`));
}

module.exports = connectToDb;
