#!/usr/bin/env node

// Comprehensive Test Runner for Pixscaler
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const setupTests = require('./setup-tests');

console.log('🚀 Pixscaler Test Suite Runner\n');

const testFiles = [
  {
    name: 'Authentication API Tests',
    file: 'auth-api-test.js',
    description: 'Tests user registration, login, and authentication flow'
  },
  {
    name: 'Image Processing Tests', 
    file: 'image-processing-test.js',
    description: 'Tests image resize, format conversion, and quality adjustment'
  }
];

const testResults = [];

async function runTest(testFile) {
  return new Promise((resolve) => {
    console.log(`\n📋 Running ${testFile.name}...`);
    console.log(`   ${testFile.description}\n`);
    
    const startTime = Date.now();
    const testProcess = spawn('node', [path.join(__dirname, testFile.file)], {
      stdio: 'inherit',
      cwd: __dirname
    });
    
    testProcess.on('close', (code) => {
      const duration = Date.now() - startTime;
      const result = {
        name: testFile.name,
        file: testFile.file,
        passed: code === 0,
        duration: duration,
        code: code
      };
      
      testResults.push(result);
      
      if (code === 0) {
        console.log(`\n✅ ${testFile.name} PASSED (${duration}ms)\n`);
      } else {
        console.log(`\n❌ ${testFile.name} FAILED (${duration}ms)\n`);
      }
      
      resolve(result);
    });
    
    testProcess.on('error', (error) => {
      console.error(`\n💥 Error running ${testFile.name}:`, error);
      testResults.push({
        name: testFile.name,
        file: testFile.file,
        passed: false,
        duration: Date.now() - startTime,
        error: error.message
      });
      resolve();
    });
  });
}

async function runAllTests() {
  // Setup test environment
  const setupSuccess = await setupTests();
  if (!setupSuccess) {
    console.log('❌ Test setup failed. Exiting...');
    process.exit(1);
  }
  
  console.log('🔍 Checking server availability...');
  
  // Check if server is running
  try {
    const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
    const response = await fetch('http://localhost:3000');
    if (response.ok) {
      console.log('✅ Server is running on http://localhost:3000\n');
    }
  } catch (error) {
    console.log('⚠️  Server may not be running. Some tests may fail.');
    console.log('   Start the server with: npm start\n');
  }
  
  // Run all tests sequentially
  for (const testFile of testFiles) {
    await runTest(testFile);
    
    // Wait a bit between tests to avoid rate limiting
    if (testFiles.indexOf(testFile) < testFiles.length - 1) {
      console.log('⏳ Waiting 3 seconds to avoid rate limiting...\n');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
  
  // Generate summary report
  generateSummaryReport();
}

function generateSummaryReport() {
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST SUMMARY REPORT');
  console.log('='.repeat(60));
  
  const totalTests = testResults.length;
  const passedTests = testResults.filter(r => r.passed).length;
  const failedTests = totalTests - passedTests;
  const totalDuration = testResults.reduce((sum, r) => sum + r.duration, 0);
  
  console.log(`\n📈 Overall Results:`);
  console.log(`   Total Tests: ${totalTests}`);
  console.log(`   Passed: ${passedTests} (${((passedTests/totalTests)*100).toFixed(1)}%)`);
  console.log(`   Failed: ${failedTests}`);
  console.log(`   Total Duration: ${totalDuration}ms`);
  
  console.log(`\n📋 Individual Test Results:`);
  testResults.forEach(result => {
    const status = result.passed ? '✅ PASS' : '❌ FAIL';
    console.log(`   ${status} ${result.name} (${result.duration}ms)`);
    if (result.error) {
      console.log(`      Error: ${result.error}`);
    }
  });
  
  // Save results to file
  const reportData = {
    timestamp: new Date().toISOString(),
    summary: {
      total: totalTests,
      passed: passedTests,
      failed: failedTests,
      duration: totalDuration,
      passRate: ((passedTests/totalTests)*100).toFixed(1)
    },
    results: testResults
  };
  
  const reportPath = path.join(__dirname, 'test-results.json');
  fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2));
  
  console.log(`\n💾 Detailed results saved to: ${reportPath}`);
  
  if (failedTests > 0) {
    console.log('\n⚠️  Some tests failed. Check the output above for details.');
    process.exit(1);
  } else {
    console.log('\n🎉 All tests passed successfully!');
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n⏹️  Test run interrupted by user');
  if (testResults.length > 0) {
    generateSummaryReport();
  }
  process.exit(1);
});

// Run the tests
runAllTests().catch(error => {
  console.error('\n💥 Test runner failed:', error);
  process.exit(1);
}); 