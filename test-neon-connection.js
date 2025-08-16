/**
 * Test script to verify Neon database connection and basic operations
 */

import { neon } from '@netlify/neon';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

// Your Neon connection string
const connectionString = 'postgresql://neondb_owner:npg_NvsiMb5Wlx9L@ep-late-butterfly-aeb4oy12-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const sql = neon(connectionString);

async function testConnection() {
  try {
    console.log('🧪 Testing Neon database connection...');

    // Test 1: Basic connection
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;
    console.log('✅ Connection successful. Tables found:', tables.map(t => t.table_name));

    // Test 2: Create test user
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = 'testpassword123';
    const hashedPassword = await bcrypt.hash(testPassword, 12);
    const userId = uuidv4();

    await sql`
      INSERT INTO users (id, email, password_hash, encrypted_data) 
      VALUES (${userId}, ${testEmail}, ${hashedPassword}, ${'test-encrypted-data'})
    `;
    console.log('✅ Test user created successfully');

    // Test 3: Query test user
    const user = await sql`
      SELECT id, email, encrypted_data, created_at 
      FROM users 
      WHERE email = ${testEmail}
    `;
    console.log('✅ User query successful:', { id: user[0].id, email: user[0].email });

    // Test 4: Create test entry
    const entryId = uuidv4();
    await sql`
      INSERT INTO entries (id, user_id, encrypted_data) 
      VALUES (${entryId}, ${userId}, ${'test-entry-data'})
    `;
    console.log('✅ Test entry created successfully');

    // Test 5: Query entries
    const entries = await sql`
      SELECT id, encrypted_data, created_at 
      FROM entries 
      WHERE user_id = ${userId}
    `;
    console.log('✅ Entry query successful:', entries.length, 'entries found');

    // Test 6: Update entry
    await sql`
      UPDATE entries 
      SET encrypted_data = ${'updated-entry-data'}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ${entryId}
    `;
    console.log('✅ Entry update successful');

    // Test 7: Clean up test data
    await sql`DELETE FROM entries WHERE user_id = ${userId}`;
    await sql`DELETE FROM users WHERE id = ${userId}`;
    console.log('✅ Test data cleaned up');

    console.log('\n🎉 All tests passed! Neon database is ready for production.');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

testConnection();
