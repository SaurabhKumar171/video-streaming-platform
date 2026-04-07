const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(v.MONGO_URI);

    console.log(`MongoDB Connected`);
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
