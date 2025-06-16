const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const { generateToken, requireAuth } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');
const config = require('../config');

// Register endpoint
router.post('/register', authLimiter, async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    
    const db = req.app.get('db');
    
    // Check if user already exists
    const existingUser = await db.getUserByEmail(email.toLowerCase());
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }
    
    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    // Create user
    const result = await db.createUser(email.toLowerCase(), passwordHash, name);
    
    // Generate token
    const user = await db.getUserById(result.id);
    const token = generateToken(user);
    
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        subscription: user.is_premium ? 'pro' : 'free',
        isPremium: user.is_premium,
        emailVerified: user.email_verified
      }
    });
    
  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Login endpoint
router.post('/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    const db = req.app.get('db');
    const user = await db.getUserByEmail(email.toLowerCase());
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    // Generate token
    const token = generateToken(user);
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        subscription: user.is_premium ? 'pro' : 'free',
        isPremium: user.is_premium,
        emailVerified: user.email_verified,
        premiumExpiresAt: user.premium_expires_at
      }
    });
    
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Get current user profile (alias for /me endpoint)
router.get('/me', requireAuth, async (req, res) => {
  try {
    const db = req.app.get('db');
    const user = await db.getUserById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        subscription: user.is_premium ? 'pro' : 'free',
        isPremium: user.is_premium,
        emailVerified: user.email_verified,
        premiumExpiresAt: user.premium_expires_at,
        createdAt: user.created_at
      }
    });
    
  } catch (error) {
    console.error('❌ Profile error:', error);
    res.status(500).json({ error: 'Server error fetching profile' });
  }
});

// Update user profile
router.put('/profile', requireAuth, async (req, res) => {
  try {
    const { name } = req.body;
    const db = req.app.get('db');
    
    const updates = {};
    if (name !== undefined) updates.name = name;
    
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }
    
    await db.updateUser(req.user.id, updates);
    
    const updatedUser = await db.getUserById(req.user.id);
    
    res.json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        isPremium: updatedUser.is_premium,
        emailVerified: updatedUser.email_verified
      }
    });
    
  } catch (error) {
    console.error('❌ Profile update error:', error);
    res.status(500).json({ error: 'Server error updating profile' });
  }
});

// Change password
router.post('/change-password', requireAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters long' });
    }
    
    const db = req.app.get('db');
    const user = await db.getUserById(req.user.id);
    
    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }
    
    // Hash new password
    const saltRounds = 12;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);
    
    // Update password
    await db.updateUser(req.user.id, { password_hash: newPasswordHash });
    
    res.json({ message: 'Password changed successfully' });
    
  } catch (error) {
    console.error('❌ Password change error:', error);
    res.status(500).json({ error: 'Server error changing password' });
  }
});

// Get user usage stats
router.get('/usage', requireAuth, async (req, res) => {
  try {
    const db = req.app.get('db');
    const userId = req.user.id;
    const ipAddress = req.ip;
    
    // Get current hour usage
    const currentHourUsage = await db.getUsageCount(userId, ipAddress, 'image_processing', 1);
    
    // Get today's usage
    const todayUsage = await db.getUsageCount(userId, ipAddress, 'image_processing', 24);
    
    const user = await db.getUserById(userId);
    const isPremium = user.is_premium && (!user.premium_expires_at || new Date(user.premium_expires_at) > new Date());
    
    res.json({
      usage: {
        currentHour: currentHourUsage,
        today: todayUsage,
        limits: {
          hourly: isPremium ? 'unlimited' : config.rateLimiting.freeTierLimit,
          daily: isPremium ? 'unlimited' : config.rateLimiting.freeTierLimit * 24
        },
        isPremium,
        resetTime: Date.now() + (60 * 60 * 1000) // Next hour
      }
    });
    
  } catch (error) {
    console.error('❌ Usage stats error:', error);
    res.status(500).json({ error: 'Server error fetching usage stats' });
  }
});

module.exports = router; 