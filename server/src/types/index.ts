export interface User {
  id: string;
  email: string;
  passwordHash: string;
  encryptedData: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Entry {
  id: string;
  userId: string;
  encryptedData: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthRequest {
  email: string;
  passwordHash: string;
  encryptedUserData?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    encryptedData: string;
  };
}

export interface CreateEntryRequest {
  encryptedData: string;
}

export interface UpdateEntryRequest {
  encryptedData: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
