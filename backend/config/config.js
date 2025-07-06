require('dotenv').config();

const config = {
  // JWT Configuration
  jwt: {
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET || 'dev_access_token_secret',
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || 'dev_refresh_token_secret',
    accessTokenExpiry: '15m',
    refreshTokenExpiry: '7d'
  },
  
  // Server Configuration
  server: {
    port: process.env.PORT || 4000,
    env: process.env.NODE_ENV || 'development'
  },
  
  // Database Configuration
  db: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/danhgiangnl'
  }
};

// Validate required configuration
if (config.server.env === 'production') {
  if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
    throw new Error('JWT secrets must be configured in production environment');
  }
} else {
  console.warn('Warning: Using default JWT secrets. This is not secure for production!');
}

console.log(config.jwt.accessTokenSecret); // Xem token secret
console.log(config.db.uri); // Kiểm tra URL của database

module.exports = config; 