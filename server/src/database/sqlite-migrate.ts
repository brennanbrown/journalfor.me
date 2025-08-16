import db from './sqlite-connection';
import { mkdirSync } from 'fs';
import { dirname } from 'path';

const createTables = () => {
  try {
    // Ensure data directory exists
    const dbDir = dirname(db.name as string);
    if (dbDir !== ':memory:') {
      mkdirSync(dbDir, { recursive: true });
    }

    // Create users table
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        encrypted_data TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create entries table
    db.exec(`
      CREATE TABLE IF NOT EXISTS entries (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        encrypted_data TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Create indexes
    db.exec(`CREATE INDEX IF NOT EXISTS idx_entries_user_id ON entries(user_id)`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_entries_created_at ON entries(created_at)`);

    console.log('✅ SQLite database tables created successfully');
  } catch (error) {
    console.error('❌ Error creating SQLite tables:', error);
    throw error;
  }
};

if (require.main === module) {
  createTables();
  console.log('Migration completed');
  process.exit(0);
}

export { createTables };
export const runMigration = createTables;
