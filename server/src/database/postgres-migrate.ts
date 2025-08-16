import sql from './postgres-connection';

export async function createTables() {
  try {
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

    // Create indexes
    await sql`
      CREATE INDEX IF NOT EXISTS idx_entries_user_id ON entries(user_id)
    `;
    
    await sql`
      CREATE INDEX IF NOT EXISTS idx_entries_created_at ON entries(created_at)
    `;

    console.log('Neon database tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  }
}

export async function dropTables() {
  try {
    await sql`DROP TABLE IF EXISTS entries`;
    await sql`DROP TABLE IF EXISTS users`;
    console.log('Neon database tables dropped successfully');
  } catch (error) {
    console.error('Error dropping tables:', error);
    throw error;
  }
}

// Run migration if called directly
if (require.main === module) {
  createTables().catch(console.error);
}
