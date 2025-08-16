const { neon } = require('@netlify/neon');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const sql = neon(process.env.NETLIFY_DATABASE_URL);

exports.handler = async (event, context) => {
  // Handle CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ success: false, error: 'Method not allowed' })
    };
  }

  try {
    const { email, passwordHash } = JSON.parse(event.body);
    
    console.log('🔍 Login Function Debug:');
    console.log(`📊 Email: ${email}`);
    console.log(`📊 Received passwordHash: ${passwordHash}`);
    console.log(`📊 passwordHash length: ${passwordHash?.length}`);
    console.log(`📊 passwordHash type: ${typeof passwordHash}`);

    if (!email || !passwordHash) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, error: 'Email and password hash are required' })
      };
    }

    // Check if user exists
    const existingUser = await sql`SELECT id, email, password_hash, encrypted_data FROM users WHERE email = ${email}`;
    
    console.log(`📊 Users found: ${existingUser.length}`);
    
    if (existingUser.length === 0) {
      console.log('❌ No user found with email:', email);
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ success: false, error: 'Invalid email or password' })
      };
    }

    const user = existingUser[0];
    console.log(`📊 Stored password_hash: ${user.password_hash}`);
    console.log(`📊 Stored hash length: ${user.password_hash?.length}`);
    console.log(`📊 Stored hash type: ${typeof user.password_hash}`);

    // Compare password hash - check if it's already hashed or plain text
    let isValidPassword = false;
    
    // If the incoming passwordHash looks like a bcrypt hash, compare directly
    if (passwordHash.startsWith('$2') && passwordHash.length >= 60) {
      console.log('🔍 Incoming hash appears to be bcrypt, comparing directly');
      isValidPassword = passwordHash === user.password_hash;
    } else {
      console.log('🔍 Incoming hash appears to be plain text/SHA256, using bcrypt.compare');
      isValidPassword = await bcrypt.compare(passwordHash, user.password_hash);
    }
    
    console.log(`📊 Password comparison result: ${isValidPassword}`);
    
    if (!isValidPassword) {
      console.log('❌ Password validation failed');
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ success: false, error: 'Invalid email or password' })
      };
    }
    
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: {
          token,
          user: {
            id: user.id,
            email: user.email,
            encryptedData: user.encrypted_data || ''
          }
        }
      })
    };
    
  } catch (error) {
    console.error('Login error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Internal server error during login'
      })
    };
  }
}
