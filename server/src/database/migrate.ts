import pool from './connection';

const createTables = async () => {
  const client = await pool.connect();
  
  try {
    // Enable UUID extension
    await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    
    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        encrypted_data TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    // Create entries table
    await client.query(`
      CREATE TABLE IF NOT EXISTS entries (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        encrypted_data TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    // Create index on user_id for faster entry queries
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_entries_user_id ON entries(user_id)
    `);
    
    // Create index on created_at for chronological ordering
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_entries_created_at ON entries(created_at)
    `);
    
    console.log('✅ Database tables created successfully');
  } catch (error) {
    console.error('❌ Error creating tables:', error);
    throw error;
  } finally {
    client.release();
  }
};

if (require.main === module) {
  createTables()
    .then(() => {
      console.log('Migration completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}

export { createTables };
