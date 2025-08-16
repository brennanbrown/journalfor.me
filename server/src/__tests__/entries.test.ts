import request from 'supertest';
import app from '../index';

describe('Entries Endpoints', () => {
  let authToken: string;
  let userId: string;

  beforeEach(async () => {
    // Register and login a test user
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'entries-test@example.com',
        passwordHash: 'hashed-password-123',
        encryptedUserData: 'encrypted-user-data-blob'
      });

    authToken = registerResponse.body.data.token;
    userId = registerResponse.body.data.user.id;
  });

  describe('POST /api/entries', () => {
    it('should create a new entry successfully', async () => {
      const entryData = {
        encryptedData: JSON.stringify({
          id: 'entry_123',
          title: 'Test Entry',
          content: 'This is a test entry',
          tags: ['test'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isEncrypted: true
        })
      };

      const response = await request(app)
        .post('/api/entries')
        .set('Authorization', `Bearer ${authToken}`)
        .send(entryData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.encryptedData).toBe(entryData.encryptedData);
    });

    it('should reject entry creation without authentication', async () => {
      const entryData = {
        encryptedData: 'encrypted-entry-data'
      };

      const response = await request(app)
        .post('/api/entries')
        .send(entryData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Access token required');
    });

    it('should reject entry creation with invalid token', async () => {
      const entryData = {
        encryptedData: 'encrypted-entry-data'
      };

      const response = await request(app)
        .post('/api/entries')
        .set('Authorization', 'Bearer invalid-token')
        .send(entryData)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Invalid or expired token');
    });

    it('should reject entry creation with missing data', async () => {
      const response = await request(app)
        .post('/api/entries')
        .set('Authorization', `Bearer ${authToken}`)
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/entries', () => {
    beforeEach(async () => {
      // Create test entries
      await request(app)
        .post('/api/entries')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ encryptedData: 'encrypted-entry-1' });

      await request(app)
        .post('/api/entries')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ encryptedData: 'encrypted-entry-2' });
    });

    it('should get all entries for authenticated user', async () => {
      const response = await request(app)
        .get('/api/entries')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0].encrypted_data).toBeDefined();
    });

    it('should reject getting entries without authentication', async () => {
      const response = await request(app)
        .get('/api/entries')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/entries/:id', () => {
    let entryId: string;

    beforeEach(async () => {
      const createResponse = await request(app)
        .post('/api/entries')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ encryptedData: 'original-encrypted-data' });

      entryId = createResponse.body.data.id;
    });

    it('should update an entry successfully', async () => {
      const updateData = {
        encryptedData: 'updated-encrypted-data'
      };

      const response = await request(app)
        .put(`/api/entries/${entryId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.encrypted_data).toBe(updateData.encryptedData);
    });

    it('should reject updating non-existent entry', async () => {
      const updateData = {
        encryptedData: 'updated-encrypted-data'
      };

      const response = await request(app)
        .put('/api/entries/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Entry not found or access denied');
    });
  });

  describe('DELETE /api/entries/:id', () => {
    let entryId: string;

    beforeEach(async () => {
      const createResponse = await request(app)
        .post('/api/entries')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ encryptedData: 'entry-to-delete' });

      entryId = createResponse.body.data.id;
    });

    it('should delete an entry successfully', async () => {
      const response = await request(app)
        .delete(`/api/entries/${entryId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Entry deleted successfully');
    });

    it('should reject deleting non-existent entry', async () => {
      const response = await request(app)
        .delete('/api/entries/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Entry not found or access denied');
    });
  });
});
