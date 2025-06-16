const jwt = require('jsonwebtoken');
const config = require('../config');

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    req.user = null;
    return next(); // Continue without user for optional auth
  }

  jwt.verify(token, config.jwt.secret, (err, user) => {
    if (err) {
      req.user = null;
      return next(); // Invalid token, continue without user
    }
    
    req.user = user;
    next();
  });
};

// Middleware to require authentication
const requireAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, config.jwt.secret, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    
    req.user = user;
    next();
  });
};

// Middleware to check premium status
const requirePremium = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const db = req.app.get('db');
  try {
    const user = await db.getUserById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user has active premium subscription
    if (!user.is_premium || (user.premium_expires_at && new Date(user.premium_expires_at) < new Date())) {
      return res.status(403).json({ 
        error: 'Premium subscription required',
        upgradeUrl: '/pricing'
      });
    }

    req.user.isPremium = true;
    next();
  } catch (error) {
    console.error('❌ Premium check error:', error);
    res.status(500).json({ error: 'Server error during premium verification' });
  }
};

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email,
      isPremium: user.is_premium 
    },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );
};

// Get user from token (utility function)
const getUserFromToken = (token) => {
  try {
    return jwt.verify(token, config.jwt.secret);
  } catch (error) {
    return null;
  }
};

module.exports = {
  authenticateToken,
  requireAuth,
  requirePremium,
  generateToken,
  getUserFromToken
}; 