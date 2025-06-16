#!/usr/bin/env node

/**
 * Pixscaler Test Runner
 * Starts the server with test configuration and runs the complete test suite
 */

const { spawn } = require('child_process');
const path = require('path');

// Set test environment variables
process.env.DISABLE_RATE_LIMITING = 'true';
process.env.NODE_ENV = 'test';

console.log('🚀 Pixscaler Test Runner\n');
console.log('🔧 Starting server with test configuration...\n');

// Start the server
const server = spawn('node', ['server.js'], {
  stdio: 'pipe',
  env: { ...process.env, DISABLE_RATE_LIMITING: 'true' },
  cwd: path.join(__dirname, '..')
});

let serverReady = false;
let serverOutput = '';

server.stdout.on('data', (data) => {
  const output = data.toString();
  serverOutput += output;
  
  // Only show important server messages
  if (output.includes('Pixscaler running on') || 
      output.includes('Database initialized') ||
      output.includes('Error')) {
    console.log(output.trim());
  }
  
  if (output.includes('Pixscaler running on http://localhost:3000')) {
    serverReady = true;
    console.log('✅ Server is ready for testing\n');
    
    // Wait a moment for server to fully initialize
    setTimeout(() => {
      runTests();
    }, 2000);
  }
});

server.stderr.on('data', (data) => {
  const error = data.toString();
  if (!error.includes('ExperimentalWarning')) {
    console.error('Server error:', error);
  }
});

function runTests() {
  console.log('🧪 Running comprehensive test suite...\n');
  
  const testProcess = spawn('node', ['tests/run-all-tests.js'], {
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });
  
  testProcess.on('close', (code) => {
    console.log(`\n🏁 Test suite completed with exit code: ${code}`);
    
    // Cleanup: Kill the server
    console.log('🧹 Cleaning up server process...');
    server.kill('SIGTERM');
    
    // Give server time to cleanup
    setTimeout(() => {
      process.exit(code);
    }, 1000);
  });
  
  testProcess.on('error', (error) => {
    console.error('❌ Test process error:', error);
    server.kill('SIGTERM');
    process.exit(1);
  });
}

// Handle cleanup on interruption
process.on('SIGINT', () => {
  console.log('\n⏹️  Test run interrupted by user');
  server.kill('SIGTERM');
  process.exit(1);
});

process.on('SIGTERM', () => {
  server.kill('SIGTERM');
  process.exit(0);
});

// Timeout if server doesn't start within 30 seconds
setTimeout(() => {
  if (!serverReady) {
    console.error('❌ Server failed to start within 30 seconds');
    console.error('Server output:', serverOutput);
    server.kill('SIGTERM');
    process.exit(1);
  }
}, 30000);

// Handle server process exit
server.on('close', (code) => {
  if (!serverReady) {
    console.error(`❌ Server process exited with code ${code} before becoming ready`);
    console.error('Server output:', serverOutput);
    process.exit(1);
  }
}); 