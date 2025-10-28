const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://shelsiarg04_db_user:V12AaoEeNSu2L73k@mgnrega-cluster.l1iu66r.mongodb.net/?appName=mgnrega-cluster');
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};

module.exports = connectDB;