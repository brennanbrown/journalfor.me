import { neon } from '@netlify/neon';
import dotenv from 'dotenv';

dotenv.config();

// Use Netlify DB environment variable, fallback to DATABASE_URL for local development
const databaseUrl = process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('Database URL not found. Please set NETLIFY_DATABASE_URL or DATABASE_URL environment variable.');
}

// Create Neon SQL client
const sql = neon(databaseUrl);

export default sql;
