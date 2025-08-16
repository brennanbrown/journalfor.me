import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import sql from '../database/postgres-connection';
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
    const existingUser = await sql`SELECT id FROM users WHERE email = ${email}`;
    
    if (existingUser.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'User already exists with this email'
      });
    }
    
    const hashedPassword = await bcrypt.hash(passwordHash, 12);
    const userId = uuidv4();
    
    await sql`
      INSERT INTO users (id, email, password_hash, encrypted_data) 
      VALUES (${userId}, ${email}, ${hashedPassword}, ${encryptedUserData})
    `;
    
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
    const result = await sql`
      SELECT id, email, password_hash, encrypted_data 
      FROM users 
      WHERE email = ${email}
    `;
    
    if (result.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }
    
    const user = result[0];
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
