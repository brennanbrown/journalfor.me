/**
 * Setup script for Neon database tables
 * Run this script to create the required tables in your Neon database
 */

import { neon } from '@netlify/neon';
import dotenv from 'dotenv';

dotenv.config();

// Your Neon connection string
const connectionString = 'postgresql://neondb_owner:npg_NvsiMb5Wlx9L@ep-late-butterfly-aeb4oy12-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const sql = neon(connectionString);

async function setupDatabase() {
  try {
    console.log('🚀 Setting up Neon database tables...');

    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        encrypted_data TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✅ Users table created');

    // Create entries table
    await sql`
      CREATE TABLE IF NOT EXISTS entries (
        id UUID PRIMARY KEY,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        encrypted_data TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✅ Entries table created');

    // Create indexes for performance
    await sql`
      CREATE INDEX IF NOT EXISTS idx_entries_user_id ON entries(user_id)
    `;
    console.log('✅ User ID index created');
    
    await sql`
      CREATE INDEX IF NOT EXISTS idx_entries_created_at ON entries(created_at)
    `;
    console.log('✅ Created at index created');

    // Verify tables exist
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'entries')
      ORDER BY table_name
    `;
    
    console.log('\n📋 Database setup complete!');
    console.log('Tables created:', tables.map(t => t.table_name).join(', '));
    
  } catch (error) {
    console.error('❌ Error setting up database:', error);
    process.exit(1);
  }
}

setupDatabase();
