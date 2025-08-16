import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ApiResponse } from '../types';

const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  passwordHash: z.string().min(1, 'Password hash is required'),
  encryptedUserData: z.string().min(1, 'Encrypted user data is required')
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  passwordHash: z.string().min(1, 'Password hash is required')
});

const createEntrySchema = z.object({
  encryptedData: z.string().min(1, 'Encrypted data is required')
});

const updateEntrySchema = z.object({
  encryptedData: z.string().min(1, 'Encrypted data is required')
});

export const validateRegister = (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
) => {
  try {
    registerSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        message: error.errors.map(e => e.message).join(', ')
      });
    }
    next(error);
  }
};

export const validateLogin = (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
) => {
  try {
    loginSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        message: error.errors.map(e => e.message).join(', ')
      });
    }
    next(error);
  }
};

export const validateCreateEntry = (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
) => {
  try {
    createEntrySchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        message: error.errors.map(e => e.message).join(', ')
      });
    }
    next(error);
  }
};

export const validateUpdateEntry = (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
) => {
  try {
    updateEntrySchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        message: error.errors.map(e => e.message).join(', ')
      });
    }
    next(error);
  }
};
