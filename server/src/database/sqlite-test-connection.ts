import Database from 'better-sqlite3';
import { join } from 'path';

// Create in-memory SQLite database for testing
const db = new Database(':memory:');

// Enable foreign key constraints
db.pragma('foreign_keys = ON');

export default db;
