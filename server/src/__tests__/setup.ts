import { runMigration } from '../database/sqlite-migrate';
import db from '../database/sqlite-connection';

// Set test environment
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key';
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL || 'postgresql://test:test@localhost:5432/journalfor_me_test';

const createTables = async () => {
  await runMigration();
};

const dropTables = async () => {
  try {
    db.exec('DROP TABLE IF EXISTS entries');
    db.exec('DROP TABLE IF EXISTS users');
  } catch (error) {
    console.error('Error dropping tables:', error);
  }
};

beforeAll(async () => {
  // Create tables for testing
  await createTables();
});

afterAll(async () => {
  // Clean up database connection
  await dropTables();
});

beforeEach(async () => {
  // Clean up test data before each test
  await dropTables();
  await createTables();
});
