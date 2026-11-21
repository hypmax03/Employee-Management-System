const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // fallback to system dns if not supported
}

const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb+srv://manuanandam_db_user:DjBjlY8LBgfjN0qH@cluster0.zssljgv.mongodb.net/employee_management_db?retryWrites=true&w=majority';

  try {
    const conn = await mongoose.connect(uri);
    console.log(`Connected to MongoDB Atlas: ${conn.connection.host} (${conn.connection.name})`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    // If Atlas fails, attempt local fallback
    try {
      const fallbackConn = await mongoose.connect('mongodb://127.0.0.1:27017/employee_management_db');
      console.log(`Fallback connected to local MongoDB: ${fallbackConn.connection.name}`);
    } catch (localErr) {
      console.error(`Local fallback also failed: ${localErr.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
