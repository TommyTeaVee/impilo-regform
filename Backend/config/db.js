const mongoose = require("mongoose");

async function connectDB() {
  await mongoose.connect(process.env.MONGODB_URI, {
    autoIndex: true
  });
  console.log("✅ MongoDB Atlas connected");
}

module.exports = connectDB;
