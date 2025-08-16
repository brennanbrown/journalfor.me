import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import db from '../database/sqlite-test-connection';
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
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User already exists with this email'
      });
    }
    
    const hashedPassword = await bcrypt.hash(passwordHash, 12);
    
    const userId = uuidv4();
    const insertUser = db.prepare('INSERT INTO users (id, email, password_hash, encrypted_data) VALUES (?, ?, ?, ?)');
    
    insertUser.run(userId, email, hashedPassword, encryptedUserData);
    
    const user = {
      id: userId,
      email,
      encrypted_data: encryptedUserData
    };
    
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
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
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error during registration'
    });
  }
};

export const login = async (
  req: Request<{}, ApiResponse, { email: string; passwordHash: string }>,
  res: Response<ApiResponse>
) => {
  const { email, passwordHash } = req.body;
  
  try {
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }
    
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
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error during login'
    });
  }
};
