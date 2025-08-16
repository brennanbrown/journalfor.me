import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import sql from '../database/postgres-connection';
import { ApiResponse } from '../types/index.js';
import { CreateEntryRequest, UpdateEntryRequest } from '../types';
import { AuthenticatedRequest } from '../middleware/auth';

export const getEntries = async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  try {
    const result = await sql`
      SELECT id, encrypted_data, created_at, updated_at 
      FROM entries 
      WHERE user_id = ${req.userId} 
      ORDER BY created_at DESC
    `;
    
    res.json({
      success: true,
      data: result
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
    const result = await sql`
      SELECT id, encrypted_data, created_at, updated_at 
      FROM entries 
      WHERE id = ${id} AND user_id = ${req.userId}
    `;
    
    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Entry not found'
      });
    }
    
    res.json({
      success: true,
      data: result[0]
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
    
    await sql`
      INSERT INTO entries (id, user_id, encrypted_data) 
      VALUES (${entryId}, ${req.userId}, ${encryptedData})
    `;
    
    const result = await sql`
      SELECT id, encrypted_data, created_at, updated_at 
      FROM entries 
      WHERE id = ${entryId}
    `;
    
    res.status(201).json({
      success: true,
      data: result[0]
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
    
    const result = await sql`
      UPDATE entries 
      SET encrypted_data = ${encryptedData}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ${id} AND user_id = ${req.userId} 
      RETURNING id, encrypted_data, created_at, updated_at
    `;
    
    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Entry not found'
      });
    }
    
    res.json({
      success: true,
      data: result[0]
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
    
    const result = await sql`
      DELETE FROM entries 
      WHERE id = ${id} AND user_id = ${req.userId} 
      RETURNING id
    `;
    
    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Entry not found'
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
