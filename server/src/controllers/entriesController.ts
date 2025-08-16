import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import pool from '../database/postgres-connection.js';
import { ApiResponse } from '../types/index.js';
import { CreateEntryRequest, UpdateEntryRequest } from '../types';
import { AuthenticatedRequest } from '../middleware/auth';

export const getEntries = async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  try {
    const client = await pool.connect();
    
    try {
      const result = await client.query(
        'SELECT id, encrypted_data, created_at, updated_at FROM entries WHERE user_id = $1 ORDER BY created_at DESC',
        [req.userId]
      );
      
      res.json({
        success: true,
        data: result.rows
      });
    } finally {
      client.release();
    }
    
  } catch (error) {
    console.error('Get entries error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error while fetching entries'
    });
  }
};

export const getEntry = async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  try {
    const { id } = req.params;
    const client = await pool.connect();
    
    try {
      const result = await client.query(
        'SELECT id, encrypted_data, created_at, updated_at FROM entries WHERE id = $1 AND user_id = $2',
        [id, req.userId]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Entry not found'
        });
      }
      
      res.json({
        success: true,
        data: result.rows[0]
      });
    } finally {
      client.release();
    }
    
  } catch (error) {
    console.error('Get entry error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error while fetching entry'
    });
  }
};

export const createEntry = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>
) => {
  try {
    const { encryptedData } = req.body;
    const entryId = uuidv4();
    const client = await pool.connect();
    
    try {
      await client.query(
        'INSERT INTO entries (id, user_id, encrypted_data) VALUES ($1, $2, $3)',
        [entryId, req.userId, encryptedData]
      );
      
      const result = await client.query(
        'SELECT id, encrypted_data, created_at, updated_at FROM entries WHERE id = $1',
        [entryId]
      );
      
      res.status(201).json({
        success: true,
        data: result.rows[0]
      });
    } finally {
      client.release();
    }
    
  } catch (error) {
    console.error('Create entry error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error while creating entry'
    });
  }
};

export const updateEntry = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>
) => {
  try {
    const { id } = req.params;
    const { encryptedData } = req.body;
    const client = await pool.connect();
    
    try {
      const result = await client.query(
        'UPDATE entries SET encrypted_data = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND user_id = $3 RETURNING id, encrypted_data, created_at, updated_at',
        [encryptedData, id, req.userId]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Entry not found'
        });
      }
      
      res.json({
        success: true,
        data: result.rows[0]
      });
    } finally {
      client.release();
    }
    
  } catch (error) {
    console.error('Update entry error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error while updating entry'
    });
  }
};

export const deleteEntry = async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  try {
    const { id } = req.params;
    const client = await pool.connect();
    
    try {
      const result = await client.query(
        'DELETE FROM entries WHERE id = $1 AND user_id = $2 RETURNING id',
        [id, req.userId]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Entry not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Entry deleted successfully'
      });
    } finally {
      client.release();
    }
    
  } catch (error) {
    console.error('Delete entry error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error while deleting entry'
    });
  }
};
