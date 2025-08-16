import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import pool from '../database/postgres-connection';
import { ApiResponse } from '../types/index.js';

interface RegisterRequest {
  email: string;
  passwordHash: string;
  encryptedUserData: string;
}

interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const register = async (
  req: Request<{}, ApiResponse, RegisterRequest>,
  res: Response<ApiResponse>
) => {
  const { email, passwordHash, encryptedUserData } = req.body;
  
  try {
    const client = await pool.connect();
    
    try {
      const existingUser = await client.query('SELECT id FROM users WHERE email = $1', [email]);
      
      if (existingUser.rows.length > 0) {
        return res.status(400).json({
          success: false,
          error: 'User already exists with this email'
        });
      }
      
      const hashedPassword = await bcrypt.hash(passwordHash, 12);
      const userId = uuidv4();
      
      await client.query(
        'INSERT INTO users (id, email, password_hash, encrypted_data) VALUES ($1, $2, $3, $4)',
        [userId, email, hashedPassword, encryptedUserData]
      );
      
      const token = jwt.sign(
        { userId: userId, email: email },
        process.env.JWT_SECRET as string,
        { expiresIn: '7d' }
      );
      
      res.status(201).json({
        success: true,
        data: {
          token,
          user: {
            id: userId,
            email: email,
            encryptedData: encryptedUserData || ''
          }
        }
      });
      
    } finally {
      client.release();
    }
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error during registration'
    });
  }
};

export const login = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>
) => {
  const { email, passwordHash } = req.body;
  
  try {
    const client = await pool.connect();
    
    try {
      const result = await client.query(
        'SELECT id, email, password_hash, encrypted_data FROM users WHERE email = $1',
        [email]
      );
      
      if (result.rows.length === 0) {
        return res.status(401).json({
          success: false,
          error: 'Invalid email or password'
        });
      }
      
      const user = result.rows[0];
      const isValidPassword = await bcrypt.compare(passwordHash, user.password_hash);
      
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          error: 'Invalid email or password'
        });
      }
      
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET as string,
        { expiresIn: '7d' }
      );
      
      res.json({
        success: true,
        data: {
          token,
          user: {
            id: user.id,
            email: user.email,
            encryptedData: user.encrypted_data || ''
          }
        }
      });
      
    } finally {
      client.release();
    }
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error during login'
    });
  }
};
