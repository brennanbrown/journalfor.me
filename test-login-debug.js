// Quick test to debug the exact login flow and server response
import CryptoJS from 'crypto-js';

const testLogin = async () => {
  console.log('🧪 Testing login flow with detailed debugging...');
  
  // Test with the actual email from logs
  const email = 'brennankbrown@outlook.com';
  const password = 'testpassword'; // You'll need to use your actual password
  
  // Hash password like the app does
  const passwordHash = CryptoJS.SHA256(password).toString();
  
  console.log(`📧 Email: ${email}`);
  console.log(`🔐 Password hash: ${passwordHash}`);
  
  try {
    const response = await fetch('https://journalforme-production.up.railway.app/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://journalforme.netlify.app'
      },
      body: JSON.stringify({
        email: email,
        passwordHash: passwordHash
      })
    });
    
    console.log(`📊 Response status: ${response.status}`);
    console.log(`📊 Response headers:`, Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log(`📊 Raw response: "${responseText}"`);
    
    if (responseText) {
      try {
        const data = JSON.parse(responseText);
        console.log(`📊 Parsed response:`, data);
        
        if (data.success && data.data) {
          console.log('✅ Login successful!');
          console.log('🔐 Token:', data.data.token);
          console.log('👤 User ID:', data.data.user.id);
          console.log('📧 User email:', data.data.user.email);
          console.log('🔒 Encrypted data length:', data.data.user.encryptedData?.length || 0);
        } else {
          console.log('❌ Login failed:', data.error);
        }
      } catch (parseError) {
        console.error('❌ JSON parse error:', parseError);
        console.error('❌ Response that failed to parse:', responseText);
      }
    } else {
      console.error('❌ Empty response body');
    }
    
  } catch (error) {
    console.error('❌ Network error:', error);
  }
};

// Run the test
testLogin();
