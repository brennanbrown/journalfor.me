import request from 'supertest';
import app from '../index';
import pool from '../database/connection';

describe('Authentication Endpoints', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        passwordHash: 'hashed-password-123',
        encryptedUserData: 'encrypted-user-data-blob'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data.user.encryptedData).toBe(userData.encryptedUserData);
    });

    it('should reject registration with invalid email', async () => {
      const userData = {
        email: 'invalid-email',
        passwordHash: 'hashed-password-123',
        encryptedUserData: 'encrypted-user-data-blob'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Validation failed');
    });

    it('should reject registration with missing fields', async () => {
      const userData = {
        email: 'test@example.com'
        // Missing passwordHash and encryptedUserData
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should reject duplicate email registration', async () => {
      const userData = {
        email: 'duplicate@example.com',
        passwordHash: 'hashed-password-123',
        encryptedUserData: 'encrypted-user-data-blob'
      };

      // First registration
      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      // Second registration with same email
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('User already exists with this email');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create a test user
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'login-test@example.com',
          passwordHash: 'hashed-password-123',
          encryptedUserData: 'encrypted-user-data-blob'
        });
    });

    it('should login successfully with correct credentials', async () => {
      const loginData = {
        email: 'login-test@example.com',
        passwordHash: 'hashed-password-123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.user.email).toBe(loginData.email);
    });

    it('should reject login with incorrect password', async () => {
      const loginData = {
        email: 'login-test@example.com',
        passwordHash: 'wrong-password-hash'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Invalid email or password');
    });

    it('should reject login with non-existent email', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        passwordHash: 'hashed-password-123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Invalid email or password');
    });

    it('should reject login with invalid email format', async () => {
      const loginData = {
        email: 'invalid-email',
        passwordHash: 'hashed-password-123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });
});
