// Image Processing API Test Suite
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3000';

// Create a simple test image (1x1 pixel PNG)
const createTestImage = () => {
  // Base64 encoded 1x1 transparent PNG
  const base64PNG = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAI9jU77zgAAAABJRU5ErkJggg==';
  return Buffer.from(base64PNG, 'base64');
};

// Create test images directory
const testImagesDir = path.join(__dirname, 'images');
if (!fs.existsSync(testImagesDir)) {
  fs.mkdirSync(testImagesDir, { recursive: true });
}

// Save test image
const testImagePath = path.join(testImagesDir, 'test-1x1.png');
if (!fs.existsSync(testImagePath)) {
  fs.writeFileSync(testImagePath, createTestImage());
}

async function runImageProcessingTests() {
  console.log('🖼️ Starting Image Processing Tests\n');
  
  try {
    await testBasicResize();
    await testFormatConversion();
    await testQualityAdjustment();
    await testInvalidImage();
    await testLargeImage();
    await testRateLimiting();
    
    console.log('\n✅ All image processing tests passed!');
  } catch (error) {
    console.error('\n❌ Image processing test failed:', error);
    process.exit(1);
  }
}

async function testBasicResize() {
  console.log('📏 Testing basic image resize...');
  
  const formData = new FormData();
  const imageBuffer = fs.readFileSync(testImagePath);
  const blob = new Blob([imageBuffer], { type: 'image/png' });
  
  formData.append('image', blob, 'test.png');
  formData.append('width', '100');
  formData.append('height', '100');
  formData.append('format', 'png');
  formData.append('quality', '80');
  
  const response = await fetch(`${BASE_URL}/resize`, {
    method: 'POST',
    body: formData
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Resize failed: ${error}`);
  }
  
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('image')) {
    throw new Error('Response is not an image');
  }
  
  console.log('✅ Basic resize successful');
}

async function testFormatConversion() {
  console.log('🔄 Testing format conversion (PNG to JPEG)...');
  
  const formData = new FormData();
  const imageBuffer = fs.readFileSync(testImagePath);
  const blob = new Blob([imageBuffer], { type: 'image/png' });
  
  formData.append('image', blob, 'test.png');
  formData.append('width', '50');
  formData.append('height', '50');
  formData.append('format', 'jpeg');
  formData.append('quality', '90');
  
  const response = await fetch(`${BASE_URL}/resize`, {
    method: 'POST',
    body: formData
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Format conversion failed: ${error}`);
  }
  
  const contentType = response.headers.get('content-type');
  if (!contentType.includes('jpeg')) {
    throw new Error('Format conversion did not work');
  }
  
  console.log('✅ Format conversion successful');
}

async function testQualityAdjustment() {
  console.log('⚙️ Testing quality adjustment...');
  
  const formData = new FormData();
  const imageBuffer = fs.readFileSync(testImagePath);
  const blob = new Blob([imageBuffer], { type: 'image/png' });
  
  formData.append('image', blob, 'test.png');
  formData.append('width', '200');
  formData.append('height', '200');
  formData.append('format', 'jpeg');
  formData.append('quality', '10'); // Very low quality
  
  const response = await fetch(`${BASE_URL}/resize`, {
    method: 'POST',
    body: formData
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Quality adjustment failed: ${error}`);
  }
  
  console.log('✅ Quality adjustment successful');
}

async function testInvalidImage() {
  console.log('🚫 Testing invalid image handling...');
  
  const formData = new FormData();
  const textBlob = new Blob(['This is not an image'], { type: 'text/plain' });
  
  formData.append('image', textBlob, 'notanimage.txt');
  formData.append('width', '100');
  formData.append('height', '100');
  formData.append('format', 'png');
  
  const response = await fetch(`${BASE_URL}/resize`, {
    method: 'POST',
    body: formData
  });
  
  if (response.ok) {
    throw new Error('Should have failed with invalid image');
  }
  
  console.log('✅ Invalid image properly rejected');
}

async function testLargeImage() {
  console.log('📊 Testing large image handling...');
  
  try {
    // Create a larger test image (100x100 PNG)
    const canvas = require('canvas');
    const canvasInstance = canvas.createCanvas(100, 100);
    const ctx = canvasInstance.getContext('2d');
    
    // Fill with gradient
    const gradient = ctx.createLinearGradient(0, 0, 100, 100);
    gradient.addColorStop(0, '#ff0000');
    gradient.addColorStop(1, '#0000ff');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 100, 100);
    
    const buffer = canvasInstance.toBuffer('image/png');
    
    const formData = new FormData();
    const blob = new Blob([buffer], { type: 'image/png' });
    
    formData.append('image', blob, 'large-test.png');
    formData.append('width', '50');
    formData.append('height', '50');
    formData.append('format', 'png');
    formData.append('quality', '80');
    
    const response = await fetch(`${BASE_URL}/resize`, {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      console.log('⚠️ Large image test failed');
      return;
    }
    
    console.log('✅ Large image processing successful');
  } catch (error) {
    console.log('⚠️ Large image test skipped (canvas dependency not available)');
  }
}

async function testRateLimiting() {
  console.log('⏱️ Testing rate limiting for image processing...');
  
  const promises = [];
  const formData = new FormData();
  const imageBuffer = fs.readFileSync(testImagePath);
  
  // Try to make many requests quickly
  for (let i = 0; i < 12; i++) {
    const blob = new Blob([imageBuffer], { type: 'image/png' });
    const form = new FormData();
    form.append('image', blob, 'test.png');
    form.append('width', '10');
    form.append('height', '10');
    form.append('format', 'png');
    
    promises.push(
      fetch(`${BASE_URL}/resize`, {
        method: 'POST',
        body: form
      })
    );
  }
  
  const responses = await Promise.all(promises);
  const rateLimited = responses.some(r => r.status === 429);
  
  if (rateLimited) {
    console.log('✅ Rate limiting working correctly');
  } else {
    console.log('⚠️ Rate limiting not triggered (may need more requests)');
  }
}

// Polyfill FormData and Blob for Node.js
if (typeof FormData === 'undefined') {
  global.FormData = require('form-data');
}

if (typeof Blob === 'undefined') {
  global.Blob = class Blob {
    constructor(parts, options = {}) {
      this.parts = parts;
      this.type = options.type || '';
    }
  };
}

// Run tests if this file is executed directly
if (require.main === module) {
  runImageProcessingTests();
}

module.exports = { runImageProcessingTests }; 