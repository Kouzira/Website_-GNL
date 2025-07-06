const jwt = require('jsonwebtoken');
const config = require('../config/config');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader)
    return res.status(401).json({ message: 'Token required' });

  const token = authHeader.split(' ')[1];
  if (!token)
    return res.status(401).json({ message: 'Invalid token' });

  try {
    const decoded = jwt.verify(token, config.jwt.accessTokenSecret);
    req.user = {
      id: decoded.id,
      role: decoded.role || 'student', // mặc định student nếu token thiếu role
    };
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError')
      return res.status(401).json({ message: 'Token expired' });
    return res.status(403).json({ message: 'Token invalid' });
  }
};

const permit = (...allowedRoles) => (req, res, next) => {
  if (!req.user)
    return res.status(401).json({ message: 'Unauthorized' });

  if (!allowedRoles.includes(req.user.role))
    return res.status(403).json({ message: 'Forbidden: insufficient role' });

  next();
};

module.exports = {
  authenticateToken,
  permit,
};
