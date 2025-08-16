import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../database/sqlite-test-connection';
import { ApiResponse } from '../types/index.js';
import { CreateEntryRequest, UpdateEntryRequest } from '../types';
import { AuthenticatedRequest } from '../middleware/auth';

export const getEntries = async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  try {
    const entries = db.prepare('SELECT id, encrypted_data, created_at, updated_at FROM entries WHERE user_id = ? ORDER BY created_at DESC').all(req.userId);
    
    res.json({
      success: true,
      data: entries
    });
    
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
    const entry = db.prepare('SELECT id, encrypted_data, created_at, updated_at FROM entries WHERE id = ? AND user_id = ?').get(id, req.userId);
    
    if (!entry) {
      return res.status(404).json({
        success: false,
        error: 'Entry not found'
      });
    }
    
    res.json({
      success: true,
      data: entry
    });
    
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
    
    const insertEntry = db.prepare('INSERT INTO entries (id, user_id, encrypted_data) VALUES (?, ?, ?)');
    insertEntry.run(entryId, req.userId, encryptedData);
    
    const entry = db.prepare('SELECT id, encrypted_data, created_at, updated_at FROM entries WHERE id = ?').get(entryId) as any;
    
    res.status(201).json({
      success: true,
      data: {
        id: entry.id,
        encryptedData: entry.encrypted_data,
        created_at: entry.created_at,
        updated_at: entry.updated_at
      }
    });
    
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
    
    const updateStmt = db.prepare('UPDATE entries SET encrypted_data = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?');
    const result = updateStmt.run(encryptedData, id, req.userId);
    
    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        error: 'Entry not found or access denied'
      });
    }
    
    const entry = db.prepare('SELECT id, encrypted_data, created_at, updated_at FROM entries WHERE id = ?').get(id);
    
    res.json({
      success: true,
      data: entry
    });
    
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
    
    const deleteStmt = db.prepare('DELETE FROM entries WHERE id = ? AND user_id = ?');
    const result = deleteStmt.run(id, req.userId);
    
    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        error: 'Entry not found or access denied'
      });
    }
    
    res.json({
      success: true,
      message: 'Entry deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete entry error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error while deleting entry'
    });
  }
};
