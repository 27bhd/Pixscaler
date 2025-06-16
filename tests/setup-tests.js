const Database = require('../database/init');

async function setupTests() {
  console.log('🔧 Setting up test environment...');
  
  // Enable test mode to disable rate limiting
  process.env.DISABLE_RATE_LIMITING = 'true';
  
  const db = new Database();
  await db.init();
  
  try {
    // Clear any existing test data and rate limits
    await db.clearTestData();
    await db.resetRateLimits();
    
    console.log('✅ Test environment ready');
    
    // Close database connection
    db.close();
    
    return true;
  } catch (error) {
    console.error('❌ Test setup failed:', error.message);
    db.close();
    return false;
  }
}

// Run setup if called directly
if (require.main === module) {
  setupTests().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = setupTests; 