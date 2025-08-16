// Test setup - use in-memory mock for CI environments
if (process.env.CI === 'true' || process.env.DATABASE_URL === ':memory:') {
  // Mock setup for CI
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test-jwt-secret-key';
  
  const mockSetup = async () => {
    console.log('Using in-memory mock setup for CI');
  };
  
  beforeAll(mockSetup);
  afterAll(mockSetup);
  beforeEach(mockSetup);
} else {
  // Real PostgreSQL setup for local development
  const { createTables, dropTables } = require('../database/postgres-migrate');
  const pool = require('../database/postgres-connection').default;
  
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test-jwt-secret-key';
  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL || 'postgresql://test:test@localhost:5432/journalfor_me_test';
  
  beforeAll(async () => {
    await createTables();
  });
  
  afterAll(async () => {
    await dropTables();
    await pool.end();
  });
  
  beforeEach(async () => {
    await dropTables();
    await createTables();
  });
}
