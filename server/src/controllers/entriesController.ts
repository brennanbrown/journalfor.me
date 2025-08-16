import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import pool from '../database/postgres-connection.js';
import { ApiResponse } from '../types/index.js';
import { CreateEntryRequest, UpdateEntryRequest } from '../types';
import { AuthenticatedRequest } from '../middleware/auth';

export const getEntries = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>
) => {
  try {
    const entries = db.prepare(
      'SELECT id, encrypted_data, created_at, updated_at FROM entries WHERE user_id = ? ORDER BY created_at DESC'
    ).all(req.userId);
    
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

export const createEntry = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>
) => {
  const { encryptedData } = req.body;
  
  try {
    const entryId = uuidv4();
    const insertEntry = db.prepare(
      'INSERT INTO entries (id, user_id, encrypted_data) VALUES (?, ?, ?)'
    );
    
    insertEntry.run(entryId, req.userId, encryptedData);
    
    const entry = {
      id: entryId,
      encrypted_data: encryptedData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    res.status(201).json({
      success: true,
      data: entry
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
  const { id } = req.params;
  const { encryptedData } = req.body;
  
  try {
    // First check if entry exists and belongs to user
    const existingEntry = db.prepare(
      'SELECT id FROM entries WHERE id = ? AND user_id = ?'
    ).get(id, req.userId);
    
    if (!existingEntry) {
      return res.status(404).json({
        success: false,
        error: 'Entry not found or access denied'
      });
    }
    
    // Update the entry
    const updateEntry = db.prepare(
      'UPDATE entries SET encrypted_data = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?'
    );
    
    updateEntry.run(encryptedData, id, req.userId);
    
    const updatedEntry = {
      id,
      encrypted_data: encryptedData,
      created_at: (existingEntry as any).created_at,
      updated_at: new Date().toISOString()
    };
    
    res.json({
      success: true,
      data: updatedEntry
    });
    
  } catch (error) {
    console.error('Update entry error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error while updating entry'
    });
  }
};

export const deleteEntry = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>
) => {
  const { id } = req.params;
  
  try {
    const deleteEntry = db.prepare(
      'DELETE FROM entries WHERE id = ? AND user_id = ?'
    );
    
    const result = deleteEntry.run(id, req.userId);
    
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
