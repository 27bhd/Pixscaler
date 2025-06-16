const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const config = require('../config');

class Database {
  constructor() {
    this.db = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      // Ensure absolute path for database
      const dbPath = path.isAbsolute(config.database.path) 
        ? config.database.path 
        : path.resolve(process.cwd(), config.database.path);
      
      this.db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
          console.error('❌ Error opening database:', err);
          reject(err);
        } else {
          console.log('📊 Connected to SQLite database');
          this.createTables().then(resolve).catch(reject);
        }
      });
    });
  }

  async createTables() {
    return new Promise((resolve, reject) => {
      const queries = [
        // Users table
        `CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT,
          name TEXT,
          google_id TEXT UNIQUE,
          github_id TEXT UNIQUE,
          is_premium BOOLEAN DEFAULT 0,
          premium_expires_at DATETIME,
          subscription_id TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          email_verified BOOLEAN DEFAULT 0,
          verification_token TEXT,
          reset_token TEXT,
          reset_expires DATETIME
        )`,

        // Processing history table
        `CREATE TABLE IF NOT EXISTS processing_history (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER,
          original_filename TEXT NOT NULL,
          original_size INTEGER NOT NULL,
          original_width INTEGER NOT NULL,
          original_height INTEGER NOT NULL,
          processed_width INTEGER NOT NULL,
          processed_height INTEGER NOT NULL,
          output_format TEXT NOT NULL,
          quality INTEGER,
          file_size_reduction REAL,
          processing_time INTEGER,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id)
        )`,

        // Usage tracking table
        `CREATE TABLE IF NOT EXISTS usage_tracking (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER,
          ip_address TEXT,
          action TEXT NOT NULL,
          count INTEGER DEFAULT 1,
          window_start DATETIME NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id)
        )`,

        // Subscriptions table
        `CREATE TABLE IF NOT EXISTS subscriptions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          stripe_customer_id TEXT,
          stripe_subscription_id TEXT,
          plan_id TEXT NOT NULL,
          status TEXT NOT NULL,
          current_period_start DATETIME,
          current_period_end DATETIME,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id)
        )`,

        // Analytics table
        `CREATE TABLE IF NOT EXISTS analytics (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          event_type TEXT NOT NULL,
          user_id INTEGER,
          ip_address TEXT,
          user_agent TEXT,
          data TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id)
        )`
      ];

      let completed = 0;
      const total = queries.length;

      queries.forEach((query, index) => {
        this.db.run(query, (err) => {
          if (err) {
            console.error(`❌ Error creating table ${index + 1}:`, err);
            reject(err);
          } else {
            completed++;
            if (completed === total) {
              console.log('✅ Database tables created successfully');
              this.createIndexes().then(resolve).catch(reject);
            }
          }
        });
      });
    });
  }

  async createIndexes() {
    return new Promise((resolve, reject) => {
      const indexes = [
        'CREATE INDEX IF NOT EXISTS idx_users_email ON users (email)',
        'CREATE INDEX IF NOT EXISTS idx_processing_user_id ON processing_history (user_id)',
        'CREATE INDEX IF NOT EXISTS idx_usage_user_id ON usage_tracking (user_id)',
        'CREATE INDEX IF NOT EXISTS idx_usage_ip ON usage_tracking (ip_address)',
        'CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions (user_id)',
        'CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON analytics (user_id)',
        'CREATE INDEX IF NOT EXISTS idx_analytics_event ON analytics (event_type)'
      ];

      let completed = 0;
      const total = indexes.length;

      indexes.forEach((indexQuery) => {
        this.db.run(indexQuery, (err) => {
          if (err) {
            console.error('❌ Error creating index:', err);
            reject(err);
          } else {
            completed++;
            if (completed === total) {
              console.log('✅ Database indexes created successfully');
              resolve();
            }
          }
        });
      });
    });
  }

  // User methods
  async createUser(email, passwordHash, name = null) {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO users (email, password_hash, name, verification_token)
        VALUES (?, ?, ?, ?)
      `;
      
      const verificationToken = require('crypto').randomBytes(32).toString('hex');
      
      this.db.run(query, [email, passwordHash, name, verificationToken], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, verificationToken });
        }
      });
    });
  }

  async getUserByEmail(email) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM users WHERE email = ?';
      this.db.get(query, [email], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  async getUserById(id) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM users WHERE id = ?';
      this.db.get(query, [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  async updateUser(id, updates) {
    return new Promise((resolve, reject) => {
      const fields = Object.keys(updates);
      const values = Object.values(updates);
      const setClause = fields.map(field => `${field} = ?`).join(', ');
      
      const query = `UPDATE users SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
      values.push(id);
      
      this.db.run(query, values, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes);
        }
      });
    });
  }

  // Usage tracking methods
  async trackUsage(userId, ipAddress, action) {
    return new Promise((resolve, reject) => {
      const windowStart = new Date();
      windowStart.setHours(windowStart.getHours(), 0, 0, 0); // Start of current hour
      
      const query = `
        INSERT OR REPLACE INTO usage_tracking (user_id, ip_address, action, count, window_start)
        VALUES (?, ?, ?, 
          COALESCE((SELECT count + 1 FROM usage_tracking 
                   WHERE user_id = ? AND ip_address = ? AND action = ? AND window_start = ?), 1),
          ?)
      `;
      
      this.db.run(query, [userId, ipAddress, action, userId, ipAddress, action, windowStart.toISOString(), windowStart.toISOString()], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
        }
      });
    });
  }

  async getUsageCount(userId, ipAddress, action, windowHours = 1) {
    return new Promise((resolve, reject) => {
      const windowStart = new Date();
      windowStart.setHours(windowStart.getHours() - windowHours, 0, 0, 0);
      
      const query = `
        SELECT COALESCE(SUM(count), 0) as total
        FROM usage_tracking 
        WHERE (user_id = ? OR ip_address = ?) AND action = ? AND window_start >= ?
      `;
      
      this.db.get(query, [userId, ipAddress, action, windowStart.toISOString()], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row.total);
        }
      });
    });
  }

  async logProcessing(data) {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO processing_history 
        (user_id, original_filename, original_size, original_width, original_height,
         processed_width, processed_height, output_format, quality, file_size_reduction, processing_time)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      this.db.run(query, [
        data.userId,
        data.originalFilename,
        data.originalSize,
        data.originalWidth,
        data.originalHeight,
        data.processedWidth,
        data.processedHeight,
        data.outputFormat,
        data.quality,
        data.fileSizeReduction,
        data.processingTime
      ], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
        }
      });
    });
  }

  // Testing utilities
  async resetRateLimits() {
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM usage_tracking';
      this.db.run(query, (err) => {
        if (err) {
          reject(err);
        } else {
          console.log('🧹 Rate limits reset for testing');
          resolve();
        }
      });
    });
  }

  async clearTestData() {
    return new Promise((resolve, reject) => {
      const queries = [
        'DELETE FROM usage_tracking',
        'DELETE FROM processing_history WHERE user_id IN (SELECT id FROM users WHERE email LIKE "%test%")',
        'DELETE FROM users WHERE email LIKE "%test%"'
      ];
      
      let completed = 0;
      const total = queries.length;
      
      queries.forEach((query) => {
        this.db.run(query, (err) => {
          if (err) {
            console.error('❌ Error clearing test data:', err);
            reject(err);
          } else {
            completed++;
            if (completed === total) {
              console.log('🧹 Test data cleared');
              resolve();
            }
          }
        });
      });
    });
  }

  close() {
    if (this.db) {
      this.db.close((err) => {
        if (err) {
          console.error('❌ Error closing database:', err);
        } else {
          console.log('📊 Database connection closed');
        }
      });
    }
  }
}

module.exports = Database; 