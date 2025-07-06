const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const verifyAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find admin user
    const admin = await User.findOne({ role: 'admin' });
    
    if (admin) {
      console.log('Admin user found:');
      console.log('Username:', admin.username);
      console.log('Role:', admin.role);
      console.log('Password hash:', admin.password);
      console.log('Created at:', admin.createdAt);
    } else {
      console.log('No admin user found in database');
    }

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

verifyAdmin(); 