const path = require('path');
const dotenv = require('dotenv');

// Load environment variables using absolute path
const envPath = path.resolve(__dirname, '../.env');
console.log('Looking for .env file at:', envPath);
dotenv.config({ path: envPath });

const mongoose = require('mongoose');
const User = require('../models/User');

// Debug: Log all environment variables
console.log('Environment variables:', {
  MONGO_URI: process.env.MONGO_URI,
  ADMIN_USERNAME: process.env.ADMIN_USERNAME,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD
});

const MONGO_URI = process.env.MONGO_URI;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '123456';

async function createAdminUser() {
  try {
    // Check MongoDB URI
    if (!MONGO_URI) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }

    // Connect to MongoDB
    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Delete existing admin user if exists
    console.log('Deleting existing admin user...');
    await User.deleteOne({ username: ADMIN_USERNAME });
    console.log('Existing admin user deleted');

    // Create admin user
    console.log('Creating new admin user...');
    const adminUser = new User({
      username: ADMIN_USERNAME,
      password: ADMIN_PASSWORD,
      role: 'admin'
    });

    await adminUser.save();
    console.log('Admin user created successfully');

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');

    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

// Run the script
createAdminUser(); 