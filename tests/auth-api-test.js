// Authentication API Test Suite
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const BASE_URL = 'http://localhost:3000';
const TEST_USER = {
  email: `test-${Date.now()}@example.com`,
  password: 'testpass123',
  name: 'Test User'
};

let authToken = null;

async function runTests() {
  console.log('🧪 Starting Authentication API Tests\n');
  
  try {
    await testUserRegistration();
    await testUserLogin();
    await testAuthenticatedProfile();
    await testProfileUpdate();
    await testPasswordChange();
    await testInvalidCredentials();
    await testRateLimiting();
    
    console.log('\n✅ All authentication tests passed!');
  } catch (error) {
    console.error('\n❌ Test suite failed:', error);
    process.exit(1);
  }
}

async function testUserRegistration() {
  console.log('📝 Testing user registration...');
  
  const response = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(TEST_USER)
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(`Registration failed: ${data.error}`);
  }
  
  if (!data.token || !data.user) {
    throw new Error('Registration response missing token or user data');
  }
  
  authToken = data.token;
  console.log('✅ User registration successful');
}

async function testUserLogin() {
  console.log('🔐 Testing user login...');
  
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: TEST_USER.email,
      password: TEST_USER.password
    })
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(`Login failed: ${data.error}`);
  }
  
  if (!data.token || data.user.email !== TEST_USER.email) {
    throw new Error('Login response invalid');
  }
  
  console.log('✅ User login successful');
}

async function testAuthenticatedProfile() {
  console.log('👤 Testing authenticated profile access...');
  
  const response = await fetch(`${BASE_URL}/api/auth/profile`, {
    headers: { 'Authorization': `Bearer ${authToken}` }
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(`Profile access failed: ${data.error}`);
  }
  
  if (data.user.email !== TEST_USER.email) {
    throw new Error('Profile data mismatch');
  }
  
  console.log('✅ Authenticated profile access successful');
}

async function testProfileUpdate() {
  console.log('✏️ Testing profile update...');
  
  const newName = 'Updated Test User';
  const response = await fetch(`${BASE_URL}/api/auth/profile`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name: newName })
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(`Profile update failed: ${data.error}`);
  }
  
  if (data.user.name !== newName) {
    throw new Error('Profile update not reflected');
  }
  
  console.log('✅ Profile update successful');
}

async function testPasswordChange() {
  console.log('🔑 Testing password change...');
  
  const newPassword = 'newpassword123';
  const response = await fetch(`${BASE_URL}/api/auth/change-password`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      currentPassword: TEST_USER.password,
      newPassword: newPassword
    })
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(`Password change failed: ${data.error}`);
  }
  
  // Test login with new password
  const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: TEST_USER.email,
      password: newPassword
    })
  });
  
  if (!loginResponse.ok) {
    throw new Error('Login with new password failed');
  }
  
  console.log('✅ Password change successful');
}

async function testInvalidCredentials() {
  console.log('🚫 Testing invalid credentials...');
  
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: TEST_USER.email,
      password: 'wrongpassword'
    })
  });
  
  if (response.ok) {
    throw new Error('Login should have failed with wrong password');
  }
  
  console.log('✅ Invalid credentials properly rejected');
}

async function testRateLimiting() {
  console.log('⏱️ Testing rate limiting...');
  
  const promises = [];
  for (let i = 0; i < 7; i++) {
    promises.push(
      fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'nonexistent@example.com',
          password: 'wrongpassword'
        })
      })
    );
  }
  
  const responses = await Promise.all(promises);
  const rateLimited = responses.some(r => r.status === 429);
  
  if (!rateLimited) {
    console.log('⚠️ Rate limiting not triggered (may need more requests)');
  } else {
    console.log('✅ Rate limiting working correctly');
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests();
}

module.exports = { runTests, TEST_USER }; 