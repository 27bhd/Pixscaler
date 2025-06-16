const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
// OAuth imports commented out for now - will add back after fixing basic auth
// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const GitHubStrategy = require('passport-github2').Strategy;
// const session = require('express-session');

// Import configuration and components
const config = require('./config');
const Database = require('./database/init');
const { authenticateToken } = require('./middleware/auth');
const { createProcessingLimiter, createUploadLimiter, apiLimiter } = require('./middleware/rateLimiter');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = config.server.port;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      scriptSrcAttr: ["'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "blob:"],
      connectSrc: ["'self'"]
    }
  }
}));

// General middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Trust proxy for rate limiting (if behind reverse proxy)
app.set('trust proxy', 1);

// Global rate limiting
app.use('/api/', apiLimiter);

// Initialize database
let db;
async function initDatabase() {
  db = new Database();
  await db.init();
  app.set('db', db);
}

// Authentication middleware (optional for most routes)
app.use(authenticateToken);

// Configure multer for memory storage (no file saving)
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: config.fileUpload.maxFileSizePremium, // Will be checked per user
    files: 1 // Only allow 1 file
  },
  fileFilter: (req, file, cb) => {
    // Only allow image files
    if (file.mimetype.startsWith('image/')) {
      // Check file size based on user tier
      const maxSize = req.user && req.user.isPremium 
        ? config.fileUpload.maxFileSizePremium 
        : config.fileUpload.maxFileSizeFree;
      
      if (file.size && file.size > maxSize) {
        const sizeMB = Math.round(maxSize / (1024 * 1024));
        const userType = req.user && req.user.isPremium ? 'Premium' : 'Free';
        return cb(new Error(`${userType} users can upload files up to ${sizeMB}MB`), false);
      }
      
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Routes
app.use('/api/auth', authRoutes);

// Get user status (for frontend)
app.get('/api/user-status', (req, res) => {
  if (req.user) {
    res.json({
      isAuthenticated: true,
      user: {
        id: req.user.id,
        email: req.user.email,
        isPremium: req.user.isPremium
      }
    });
  } else {
    res.json({
      isAuthenticated: false,
      user: null
    });
  }
});

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Image resize endpoint with rate limiting (middleware will be added after db init)
app.post('/api/resize', upload.single('image'), async (req, res) => {
  const startTime = Date.now();
  
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    // Rate limiting check for free users
    const database = req.app.get('db');
    if (database && (!req.user || !req.user.isPremium)) {
      const userId = req.user ? req.user.id : null;
      const ipAddress = req.ip || req.connection.remoteAddress;
      
      const usageCount = await database.getUsageCount(userId, ipAddress, 'image_processing', 1);
      
      if (usageCount >= config.rateLimiting.freeTierLimit) {
        return res.status(429).json({
          error: 'Rate limit exceeded',
          message: `Free users are limited to ${config.rateLimiting.freeTierLimit} images per hour`,
          resetTime: Date.now() + (60 * 60 * 1000),
          upgradeUrl: '/pricing'
        });
      }
      
      // Track usage
      await database.trackUsage(userId, ipAddress, 'image_processing');
    }

    const { width, height, format = 'auto', quality = 90 } = req.body;
    
    // Validate dimensions
    const w = parseInt(width);
    const h = parseInt(height);
    const q = parseInt(quality);
    
    if (!w || !h || w <= 0 || h <= 0 || w > 5000 || h > 5000) {
      return res.status(400).json({ error: 'Invalid dimensions (1-5000 pixels)' });
    }
    
    if (q < 10 || q > 100) {
      return res.status(400).json({ error: 'Quality must be between 10 and 100' });
    }

    // Get original image metadata
    const metadata = await sharp(req.file.buffer).metadata();
    const originalWidth = metadata.width;
    const originalHeight = metadata.height;
    
    // Determine if we're upscaling or downscaling
    const isUpscaling = (w > originalWidth) || (h > originalHeight);
    const scaleFactor = Math.max(w / originalWidth, h / originalHeight);
    
    // Choose appropriate resize algorithm based on scaling
    let resizeOptions = {
      fit: 'fill',
      withoutEnlargement: false
    };
    
    if (isUpscaling) {
      // For upscaling: use lanczos3 for best quality
      resizeOptions.kernel = 'lanczos3';
    } else {
      // For downscaling: use lanczos2 for speed/quality balance
      resizeOptions.kernel = 'lanczos2';
    }
    
    // Create Sharp processing pipeline
    let sharpInstance = sharp(req.file.buffer)
      .resize(w, h, resizeOptions);
    
    // Apply sharpening for upscaled images
    if (isUpscaling && scaleFactor > 1.5) {
      sharpInstance = sharpInstance.sharpen({
        sigma: 1.0,
        flat: 1.0,
        jagged: 2.0
      });
    }
    
    // Determine output format based on user selection
    let outputFormat;
    let targetMimeType;
    
    if (format === 'auto') {
      outputFormat = metadata.format || 'jpeg';
      targetMimeType = req.file.mimetype;
    } else if (format === 'png') {
      outputFormat = 'png';
      targetMimeType = 'image/png';
    } else if (format === 'jpeg') {
      outputFormat = 'jpeg';
      targetMimeType = 'image/jpeg';
    }
    
    // Process image with appropriate format
    let processedImage;
    
    if (outputFormat === 'png') {
      processedImage = await sharpInstance
        .png({ 
          compressionLevel: 6,
          adaptiveFiltering: true
        })
        .toBuffer();
    } else {
      // Use user-specified quality, with higher quality for upscaled images
      const finalQuality = isUpscaling ? Math.max(q, 85) : q;
      
      processedImage = await sharpInstance
        .jpeg({ 
          quality: finalQuality,
          mozjpeg: true,
          optimiseCoding: true,
          progressive: true
        })
        .toBuffer();
    }

    // Log processing for analytics
    const dbInstance = req.app.get('db');
    if (dbInstance) {
      try {
        await dbInstance.logProcessing({
          userId: req.user ? req.user.id : null,
          originalFilename: req.file.originalname,
          originalSize: req.file.size,
          originalWidth: originalWidth,
          originalHeight: originalHeight,
          processedWidth: w,
          processedHeight: h,
          outputFormat: outputFormat,
          quality: q,
          fileSizeReduction: ((req.file.size - processedImage.length) / req.file.size) * 100,
          processingTime: Date.now() - startTime
        });
      } catch (logError) {
        console.error('❌ Error logging processing:', logError);
      }
    }

    // Set headers for download
    const contentType = targetMimeType;
    const fileExtension = outputFormat === 'png' ? 'png' : 'jpg';
    
    res.set({
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename="resized-${w}x${h}.${fileExtension}"`,
      'Content-Length': processedImage.length
    });

    res.send(processedImage);

  } catch (error) {
    console.error('❌ Error processing image:', error);
    
    // Handle specific errors
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large (max 10MB)' });
    }
    if (error.message === 'Only image files are allowed') {
      return res.status(400).json({ error: 'Only image files are allowed' });
    }
    
    res.status(500).json({ error: 'Failed to process image' });
  }
});

// OAuth configuration commented out for now - will add back after fixing basic auth
/*
// Session configuration for OAuth
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-session-secret-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true in production with HTTPS
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Passport serialization
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const database = app.get('db');
        if (!database) {
            return done(new Error('Database not initialized'), null);
        }
        const user = await database.getUserById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

// OAuth Routes will be added here
*/

// Start server with database initialization
async function startServer() {
  try {
    // Initialize database first
    await initDatabase();
    
    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Pixscaler running on http://localhost:${PORT}`);
      console.log(`📊 Database initialized successfully`);
      console.log(`🔒 Security middleware enabled`);
      console.log(`⚡ Rate limiting active`);
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🔄 Shutting down gracefully...');
  if (db) {
    db.close();
  }
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🔄 Shutting down gracefully...');
  if (db) {
    db.close();
  }
  process.exit(0);
});

// Start the server
startServer(); 