// Debug script to test Netlify Functions directly
async function debugNetlifyFunctions() {
  // Import fetch dynamically
  const { default: fetch } = await import('node-fetch');
  console.log('🔍 === NETLIFY FUNCTIONS DEBUG SCRIPT ===');
  
  const baseUrl = 'https://journalforme.netlify.app/.netlify/functions';
  
  // Test 1: Check if functions are accessible
  console.log('\n🧪 Test 1: Function Accessibility');
  await testFunctionAccessibility(`${baseUrl}/auth-login`, fetch);
  await testFunctionAccessibility(`${baseUrl}/auth-register`, fetch);
  await testFunctionAccessibility(`${baseUrl}/entries`, fetch);
  
  // Test 2: Test CORS preflight
  console.log('\n🧪 Test 2: CORS Preflight Tests');
  await testCORSPreflight(`${baseUrl}/auth-login`, fetch);
  
  // Test 3: Test authentication with verbose logging
  console.log('\n🧪 Test 3: Authentication Test');
  await testAuthentication(`${baseUrl}/auth-register`, `${baseUrl}/auth-login`, fetch);
  
  // Test 4: Test environment variables visibility
  console.log('\n🧪 Test 4: Environment Variables Check');
  await testEnvironmentVariables();
}

async function testFunctionAccessibility(url, fetch) {
  try {
    console.log(`🔍 Testing accessibility: ${url}`);
    const response = await fetch(url, { method: 'OPTIONS' });
    console.log(`✅ Status: ${response.status}`);
    console.log(`✅ Headers:`, Object.fromEntries(response.headers.entries()));
  } catch (error) {
    console.error(`❌ Error accessing ${url}:`, error.message);
  }
}

async function testCORSPreflight(url, fetch) {
  try {
    console.log(`🔍 Testing CORS preflight: ${url}`);
    const response = await fetch(url, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'https://journalforme.netlify.app',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type, Authorization'
      }
    });
    
    console.log(`✅ CORS Status: ${response.status}`);
    console.log(`✅ CORS Headers:`, Object.fromEntries(response.headers.entries()));
  } catch (error) {
    console.error(`❌ CORS Error:`, error.message);
  }
}

async function testAuthentication(registerUrl, loginUrl, fetch) {
  const testUser = {
    email: 'test@example.com',
    passwordHash: 'testhash123',
    encryptedUserData: 'encrypted_test_data'
  };
  
  try {
    // Test registration
    console.log(`🔍 Testing registration: ${registerUrl}`);
    const registerResponse = await fetch(registerUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://journalforme.netlify.app'
      },
      body: JSON.stringify(testUser)
    });
    
    console.log(`📊 Register Status: ${registerResponse.status}`);
    const registerText = await registerResponse.text();
    console.log(`📊 Register Response: ${registerText}`);
    
    // Test login
    console.log(`🔍 Testing login: ${loginUrl}`);
    const loginResponse = await fetch(loginUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://journalforme.netlify.app'
      },
      body: JSON.stringify({
        email: testUser.email,
        passwordHash: testUser.passwordHash
      })
    });
    
    console.log(`📊 Login Status: ${loginResponse.status}`);
    const loginText = await loginResponse.text();
    console.log(`📊 Login Response: ${loginText}`);
    
  } catch (error) {
    console.error(`❌ Authentication Error:`, error.message);
  }
}

async function testEnvironmentVariables() {
  console.log('🔍 Environment Variables (Client-side):');
  console.log(`📊 VITE_API_URL: ${process.env.VITE_API_URL || 'undefined'}`);
  console.log(`📊 NODE_ENV: ${process.env.NODE_ENV || 'undefined'}`);
  
  // Note: Server-side env vars won't be visible here
  console.log('⚠️  Server-side env vars (NETLIFY_DATABASE_URL, JWT_SECRET) are not visible from client');
}


// Run the debug script
debugNetlifyFunctions().catch(console.error);
