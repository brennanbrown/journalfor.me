const { neon } = require('@netlify/neon');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

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
    const { email, passwordHash, encryptedUserData } = JSON.parse(event.body);

    // Check if user already exists
    const existingUser = await sql`SELECT id FROM users WHERE email = ${email}`;
    
    if (existingUser.length > 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'User already exists with this email'
        })
      };
    }
    
    const hashedPassword = await bcrypt.hash(passwordHash, 12);
    const userId = uuidv4();
    
    await sql`
      INSERT INTO users (id, email, password_hash, encrypted_data) 
      VALUES (${userId}, ${email}, ${hashedPassword}, ${encryptedUserData})
    `;
    
    const token = jwt.sign(
      { userId: userId, email: email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({
        success: true,
        data: {
          token,
          user: {
            id: userId,
            email: email,
            encryptedData: encryptedUserData || ''
          }
        }
      })
    };
    
  } catch (error) {
    console.error('Registration error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Internal server error during registration'
      })
    };
  }
}
