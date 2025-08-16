const { neon } = require('@netlify/neon');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const sql = neon(process.env.NETLIFY_DATABASE_URL);

// Helper function to verify JWT token
function verifyToken(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No valid authorization token provided');
  }
  
  const token = authHeader.substring(7);
  return jwt.verify(token, process.env.JWT_SECRET);
}

exports.handler = async (event, context) => {
  // Handle CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    // Verify authentication
    const decoded = verifyToken(event.headers.authorization);
    const userId = decoded.userId;

    // Parse path to determine specific entry ID if present
    const pathParts = event.path.split('/');
    const entryId = pathParts[pathParts.length - 1] !== 'entries' ? pathParts[pathParts.length - 1] : null;

    switch (event.httpMethod) {
      case 'GET':
        if (entryId) {
          // Get specific entry
          const result = await sql`
            SELECT id, encrypted_data, created_at, updated_at 
            FROM entries 
            WHERE id = ${entryId} AND user_id = ${userId}
          `;
          
          if (result.length === 0) {
            return {
              statusCode: 404,
              headers,
              body: JSON.stringify({ success: false, error: 'Entry not found' })
            };
          }
          
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true, data: result[0] })
          };
        } else {
          // Get all entries
          const result = await sql`
            SELECT id, encrypted_data, created_at, updated_at 
            FROM entries 
            WHERE user_id = ${userId} 
            ORDER BY created_at DESC
          `;
          
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true, data: result })
          };
        }

      case 'POST':
        // Create new entry
        const { encryptedData } = JSON.parse(event.body);
        const newEntryId = uuidv4();
        
        await sql`
          INSERT INTO entries (id, user_id, encrypted_data) 
          VALUES (${newEntryId}, ${userId}, ${encryptedData})
        `;
        
        const newEntry = await sql`
          SELECT id, encrypted_data, created_at, updated_at 
          FROM entries 
          WHERE id = ${newEntryId}
        `;
        
        return {
          statusCode: 201,
          headers,
          body: JSON.stringify({ success: true, data: newEntry[0] })
        };

      case 'PUT':
        // Update entry
        if (!entryId) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ success: false, error: 'Entry ID required for update' })
          };
        }
        
        const updateData = JSON.parse(event.body);
        const updateResult = await sql`
          UPDATE entries 
          SET encrypted_data = ${updateData.encryptedData}, updated_at = CURRENT_TIMESTAMP 
          WHERE id = ${entryId} AND user_id = ${userId} 
          RETURNING id, encrypted_data, created_at, updated_at
        `;
        
        if (updateResult.length === 0) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ success: false, error: 'Entry not found' })
          };
        }
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true, data: updateResult[0] })
        };

      case 'DELETE':
        // Delete entry
        if (!entryId) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ success: false, error: 'Entry ID required for deletion' })
          };
        }
        
        const deleteResult = await sql`
          DELETE FROM entries 
          WHERE id = ${entryId} AND user_id = ${userId} 
          RETURNING id
        `;
        
        if (deleteResult.length === 0) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ success: false, error: 'Entry not found' })
          };
        }
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true, message: 'Entry deleted successfully' })
        };

      default:
        return {
          statusCode: 405,
          headers,
          body: JSON.stringify({ success: false, error: 'Method not allowed' })
        };
    }
    
  } catch (error) {
    console.error('Entries API error:', error);
    
    if (error.name === 'JsonWebTokenError' || error.message.includes('authorization')) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ success: false, error: 'Unauthorized' })
      };
    }
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: 'Internal server error' })
    };
  }
}
