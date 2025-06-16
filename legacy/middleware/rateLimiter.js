const rateLimit = require('express-rate-limit');
const config = require('../config');

// Rate limiter for image processing
const createProcessingLimiter = (db) => {
  return async (req, res, next) => {
    try {
      const userId = req.user ? req.user.id : null;
      const ipAddress = req.ip || req.connection.remoteAddress;
      
      // Check if user is premium
      if (req.user && req.user.isPremium) {
        return next(); // Premium users have no limits
      }
      
      // Check usage for free users
      const usageCount = await db.getUsageCount(userId, ipAddress, 'image_processing', 1);
      
      if (usageCount >= config.rateLimiting.freeTierLimit) {
        return res.status(429).json({
          error: 'Rate limit exceeded',
          message: `Free users are limited to ${config.rateLimiting.freeTierLimit} images per hour`,
          resetTime: Date.now() + (60 * 60 * 1000), // 1 hour from now
          upgradeUrl: '/pricing'
        });
      }
      
      // Track the usage
      await db.trackUsage(userId, ipAddress, 'image_processing');
      
      next();
    } catch (error) {
              console.error('❌ Rate limiting error:', error);
      // If rate limiting fails, allow the request but log the error
      next();
    }
  };
};

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: config.rateLimiting.windowMs,
  max: config.rateLimiting.testMode ? 10000 : config.rateLimiting.apiRequestsPerWindow, // High limit in test mode
  message: {
    error: 'Too many requests',
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => config.rateLimiting.testMode, // Skip rate limiting in test mode
});

// Strict rate limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: config.rateLimiting.windowMs,
  max: config.rateLimiting.testMode ? 1000 : config.rateLimiting.authRequestsPerWindow, // High limit in test mode
  message: {
    error: 'Too many authentication attempts',
    message: 'Too many login/register attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => config.rateLimiting.testMode, // Skip rate limiting in test mode
});

// File upload size limiter
const createUploadLimiter = (db) => {
  return async (req, res, next) => {
    try {
      const userId = req.user ? req.user.id : null;
      const maxSize = req.user && req.user.isPremium 
        ? config.fileUpload.maxFileSizePremium 
        : config.fileUpload.maxFileSizeFree;
      
      // This will be checked by multer, but we can also check here
      req.maxFileSize = maxSize;
      next();
    } catch (error) {
              console.error('❌ Upload limiter error:', error);
      next();
    }
  };
};

module.exports = {
  createProcessingLimiter,
  createUploadLimiter,
  apiLimiter,
  authLimiter
}; 