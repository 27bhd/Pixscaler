// Pixscaler Configuration
module.exports = {
  // Server Configuration
  server: {
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'localhost',
    environment: process.env.NODE_ENV || 'development'
  },
  
  // Database Configuration
  database: {
    path: process.env.DB_PATH || './database/pixscaler.db',
    // Enable WAL mode for better concurrent access
    options: {
      mode: 'WAL'
    }
  },
  
  // JWT Configuration - PRODUCTION SECURE DEFAULTS
  jwt: {
    secret: process.env.JWT_SECRET || (() => {
      if (process.env.NODE_ENV === 'production') {
        throw new Error('JWT_SECRET environment variable is required in production');
      }
      return require('crypto').randomBytes(32).toString('hex');
    })(),
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },
  
  // Analytics Configuration
  analytics: {
    googleAnalyticsId: process.env.GOOGLE_ANALYTICS_ID || '',
    googleAdsenseId: process.env.GOOGLE_ADSENSE_ID || ''
  },
  
  // Payment Configuration
  stripe: {
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || ''
  },
  
  // Email Configuration
  email: {
    host: process.env.EMAIL_HOST || '',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASS || '',
    from: process.env.EMAIL_FROM || 'noreply@pixscaler.com'
  },
  
  // Rate Limiting
  rateLimiting: {
    // Free tier limits
    freeTierLimit: 10, // images per hour
    
    // API rate limits
    apiRequestsPerWindow: 100, // requests per 15 minutes
    authRequestsPerWindow: 5,  // auth requests per 15 minutes
    windowMs: 15 * 60 * 1000,  // 15 minutes
    
    // Test mode - disable rate limiting
    testMode: process.env.NODE_ENV === 'test' || process.env.DISABLE_RATE_LIMITING === 'true'
  },
  
  // File Upload Limits
  fileUpload: {
    maxFileSizeFree: 5 * 1024 * 1024,    // 5MB for free users
    maxFileSizePremium: 50 * 1024 * 1024, // 50MB for premium users
    allowedFormats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    tempDir: './temp'
  },
  
  // Image Processing Configuration
  imageProcessing: {
    maxWidth: 4000,
    maxHeight: 4000,
    defaultQuality: 85,
    formats: {
      jpeg: { quality: 85 },
      png: { compressionLevel: 6 },
      webp: { quality: 85 }
    }
  },
  
  // Subscription Plans
  subscriptions: {
    basic: {
      id: 'basic',
      name: 'Basic Plan',
      price: 3.99,
      currency: 'USD',
      interval: 'month',
      features: {
        imagesPerHour: 100,
        maxFileSize: 20 * 1024 * 1024, // 20MB
        priorityProcessing: false,
        apiAccess: false
      }
    },
    pro: {
      id: 'pro', 
      name: 'Pro Plan',
      price: 9.99,
      currency: 'USD',
      interval: 'month',
      features: {
        imagesPerHour: 500,
        maxFileSize: 50 * 1024 * 1024, // 50MB
        priorityProcessing: true,
        apiAccess: true
      }
    },
    business: {
      id: 'business',
      name: 'Business Plan', 
      price: 19.99,
      currency: 'USD',
      interval: 'month',
      features: {
        imagesPerHour: -1, // unlimited
        maxFileSize: 100 * 1024 * 1024, // 100MB
        priorityProcessing: true,
        apiAccess: true,
        whiteLabel: true
      }
    }
  },
  
  // Security Configuration - PRODUCTION SECURE DEFAULTS
  security: {
    bcryptRounds: 12,
    sessionSecret: process.env.SESSION_SECRET || (() => {
      if (process.env.NODE_ENV === 'production') {
        throw new Error('SESSION_SECRET environment variable is required in production');
      }
      return require('crypto').randomBytes(32).toString('hex');
    })(),
    corsOrigins: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : 
      process.env.NODE_ENV === 'production' ? [] : ['http://localhost:3000']
  }
}; 