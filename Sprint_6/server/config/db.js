const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mentorconnect';

  try {
    console.log(`Connecting to MongoDB database...`);
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`MongoDB Connected Successfully: ${conn.connection.host}`);
  } catch (err) {
    console.warn(`MongoDB Connection Warning: ${err.message}`);
    console.warn(`Backend server proceeding in resilient fallback mode.`);
  }
};

module.exports = connectDB;
