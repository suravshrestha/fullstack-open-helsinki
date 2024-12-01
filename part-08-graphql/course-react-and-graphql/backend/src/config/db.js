const mongoose = require("mongoose");

const connectDB = async (uri) => {
  try {
    await mongoose.connect(uri);

    console.log("connected to MongoDB");
  } catch (error) {
    console.error("error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
