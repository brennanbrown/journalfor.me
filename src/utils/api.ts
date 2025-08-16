interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    encryptedData: string;
  };
}

interface ServerEntry {
  id: string;
  encryptedData: string;
  createdAt: string;
  updatedAt: string;
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor() {
    // Use environment variable or default to production backend
    this.baseUrl = (import.meta as any).env?.VITE_API_URL || 'https://journalforme-production.up.railway.app';
    
    // Load token from localStorage if available
    this.token = localStorage.getItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}/api${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }
      
      return data;
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  async register(email: string, passwordHash: string, encryptedUserData: string): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email,
        passwordHash,
        encryptedUserData,
      }),
    });

    if (response.success && response.data) {
      this.setToken(response.data.token);
      return response.data;
    }

    throw new Error(response.error || 'Registration failed');
  }

  async login(email: string, passwordHash: string): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email,
        passwordHash,
      }),
    });

    if (response.success && response.data) {
      this.setToken(response.data.token);
      return response.data;
    }

    throw new Error(response.error || 'Login failed');
  }

  async getEntries(): Promise<ServerEntry[]> {
    const response = await this.request<ServerEntry[]>('/entries');

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to fetch entries');
  }

  async createEntry(encryptedData: string): Promise<ServerEntry> {
    const response = await this.request<ServerEntry>('/entries', {
      method: 'POST',
      body: JSON.stringify({ encryptedData }),
    });

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to create entry');
  }

  async updateEntry(id: string, encryptedData: string): Promise<ServerEntry> {
    const response = await this.request<ServerEntry>(`/entries/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ encryptedData }),
    });

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to update entry');
  }

  async deleteEntry(id: string): Promise<void> {
    const response = await this.request(`/entries/${id}`, {
      method: 'DELETE',
    });

    if (!response.success) {
      throw new Error(response.error || 'Failed to delete entry');
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      const data = await response.json();
      return data.success;
    } catch (error) {
      console.warn('Server health check failed:', error);
      return false;
    }
  }
}

export const apiClient = new ApiClient();
export type { ApiResponse, AuthResponse, ServerEntry };
