import { createTables, dropTables } from '../database/sqlite-test-migrate';

// Set test environment
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key';
process.env.DATABASE_URL = ':memory:';

beforeAll(async () => {
  createTables();
});

afterAll(async () => {
  dropTables();
});

beforeEach(async () => {
  dropTables();
  createTables();
});
