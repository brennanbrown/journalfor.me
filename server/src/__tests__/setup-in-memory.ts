// In-memory test setup for CI environments
// This avoids PostgreSQL dependencies during CI testing

// Set test environment
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key';
process.env.DATABASE_URL = ':memory:';

// Mock database operations for CI
const mockCreateTables = async () => {
  console.log('Mock: Creating tables for in-memory testing');
};

const mockDropTables = async () => {
  console.log('Mock: Dropping tables for in-memory testing');
};

beforeAll(async () => {
  await mockCreateTables();
});

afterAll(async () => {
  await mockDropTables();
});

beforeEach(async () => {
  await mockDropTables();
  await mockCreateTables();
});
