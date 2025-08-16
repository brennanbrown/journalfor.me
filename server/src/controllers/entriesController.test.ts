import request from 'supertest';
import { app } from '../index';
import pool from '../database/postgres-connection';

describe('Entries Controller', () => {
  let authToken: string;
  let userId: string;

  beforeAll(async () => {
    // Clean up test data
    await pool.query('DELETE FROM entries WHERE user_id IN (SELECT id FROM users WHERE email LIKE $1)', ['test%@example.com']);
    await pool.query('DELETE FROM users WHERE email LIKE $1', ['test%@example.com']);

    // Create test user and get auth token
    const userData = {
      email: 'testentries@example.com',
      password: 'testpassword123',
      encryptedData: 'encrypted-test-data'
    };

    const registerResponse = await request(app)
      .post('/auth/register')
      .send(userData);

    authToken = registerResponse.body.data.token;
    userId = registerResponse.body.data.user.id;
  });

  afterAll(async () => {
    // Clean up test data
    await pool.query('DELETE FROM entries WHERE user_id IN (SELECT id FROM users WHERE email LIKE $1)', ['test%@example.com']);
    await pool.query('DELETE FROM users WHERE email LIKE $1', ['test%@example.com']);
    await pool.end();
  });

  describe('POST /entries', () => {
    it('should create a new entry', async () => {
      const entryData = {
        encryptedData: 'encrypted-entry-data-test'
      };

      const response = await request(app)
        .post('/entries')
        .set('Authorization', `Bearer ${authToken}`)
        .send(entryData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.entry.encrypted_data).toBe(entryData.encryptedData);
      expect(response.body.data.entry.user_id).toBe(userId);
    });

    it('should require authentication', async () => {
      const entryData = {
        encryptedData: 'encrypted-entry-data-test'
      };

      const response = await request(app)
        .post('/entries')
        .send(entryData)
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/entries')
        .set('Authorization', `Bearer ${authToken}`)
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /entries', () => {
    it('should get user entries', async () => {
      const response = await request(app)
        .get('/entries')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data.entries)).toBe(true);
      expect(response.body.data.entries.length).toBeGreaterThan(0);
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .get('/entries')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /entries/:id', () => {
    let entryId: string;

    beforeAll(async () => {
      // Create an entry to update
      const entryData = {
        encryptedData: 'encrypted-entry-for-update'
      };

      const response = await request(app)
        .post('/entries')
        .set('Authorization', `Bearer ${authToken}`)
        .send(entryData);

      entryId = response.body.data.entry.id;
    });

    it('should update an existing entry', async () => {
      const updateData = {
        encryptedData: 'updated-encrypted-entry-data'
      };

      const response = await request(app)
        .put(`/entries/${entryId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.entry.encrypted_data).toBe(updateData.encryptedData);
    });

    it('should require authentication', async () => {
      const updateData = {
        encryptedData: 'updated-encrypted-entry-data'
      };

      const response = await request(app)
        .put(`/entries/${entryId}`)
        .send(updateData)
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should return 404 for non-existent entry', async () => {
      const updateData = {
        encryptedData: 'updated-encrypted-entry-data'
      };

      const response = await request(app)
        .put('/entries/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /entries/:id', () => {
    let entryId: string;

    beforeAll(async () => {
      // Create an entry to delete
      const entryData = {
        encryptedData: 'encrypted-entry-for-deletion'
      };

      const response = await request(app)
        .post('/entries')
        .set('Authorization', `Bearer ${authToken}`)
        .send(entryData);

      entryId = response.body.data.entry.id;
    });

    it('should delete an existing entry', async () => {
      const response = await request(app)
        .delete(`/entries/${entryId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .delete(`/entries/${entryId}`)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });
});
