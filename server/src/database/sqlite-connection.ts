import Database from 'better-sqlite3';
import { join } from 'path';
import { mkdirSync, existsSync } from 'fs';

// Use memory database for CI/testing, file database for development
let db: Database.Database;

if (process.env.CI || process.env.NODE_ENV === 'test') {
  // Use in-memory database for CI/testing
  db = new Database(':memory:');
} else {
  // Ensure data directory exists for development
  const dataDir = './data';
  if (!existsSync(dataDir)) {
    mkdirSync(dataDir, { recursive: true });
  }
  db = new Database(join(dataDir, 'journal.db'));
}

// Enable foreign keys
db.pragma('foreign_keys = ON');

export default db;
