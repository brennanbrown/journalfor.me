import Database from 'better-sqlite3';
import { join } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const dbPath = process.env.NODE_ENV === 'test' 
  ? ':memory:' 
  : join(__dirname, '../../data/journalfor_me.db');

const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

export default db;
