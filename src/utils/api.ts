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
    // Use environment variable for API URL, fallback to Netlify Functions
    this.baseUrl = (import.meta as any).env?.VITE_API_URL || '/.netlify/functions';
    
    // Debug environment variables
    console.log('🔍 API Client Environment Debug:');
    console.log(`📊 import.meta.env:`, (import.meta as any).env);
    console.log(`📊 VITE_API_URL from env:`, (import.meta as any).env?.VITE_API_URL);
    console.log(`📊 Final baseUrl:`, this.baseUrl);
    
    // Load token from localStorage if available
    this.token = localStorage.getItem('auth_token');
    console.log(`📊 Auth token loaded:`, this.token ? 'Yes' : 'No');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    // For Netlify Functions, don't add /api prefix
    const url = this.baseUrl.includes('netlify') ? `${this.baseUrl}${endpoint}` : `${this.baseUrl}/api${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    console.log(`🔍 API Request: ${options.method || 'GET'} ${url}`);
    console.log(`🔍 Request config:`, config);

    try {
      const response = await fetch(url, config);
      console.log(`🔍 Response status: ${response.status}`);
      console.log(`🔍 Response headers:`, Object.fromEntries(response.headers.entries()));
      
      const responseText = await response.text();
      console.log(`🔍 Raw response body: ${responseText}`);
      
      let data;
      try {
        data = JSON.parse(responseText);
        console.log(`🔍 Parsed response data:`, data);
      } catch (parseError) {
        console.error(`🔍 JSON parse error:`, parseError);
        console.error(`🔍 Response text that failed to parse: "${responseText}"`);
        throw new Error(`Invalid JSON response: ${responseText}`);
      }
      
      if (!response.ok) {
        console.error(`🔍 HTTP error ${response.status}:`, data);
        throw new Error(data.error || `HTTP ${response.status}`);
      }
      
      return data;
    } catch (error) {
      console.error(`🔍 API request failed: ${endpoint}`, error);
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
    const response = await this.request<AuthResponse>('/auth-register', {
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
    console.log('🔍 Login Debug:');
    console.log(`📊 Email: ${email}`);
    console.log(`📊 Password Hash: ${passwordHash}`);
    console.log(`📊 Hash Length: ${passwordHash.length}`);
    console.log(`📊 Hash Type: ${typeof passwordHash}`);
    
    const response = await this.request<AuthResponse>('/auth-login', {
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
      // For Netlify Functions, just check if we can reach the functions endpoint
      const healthUrl = this.baseUrl.includes('netlify') ? `${this.baseUrl}/auth-login` : `${this.baseUrl}/health`;
      console.log(`🔍 Health check URL: ${healthUrl}`);
      const response = await fetch(healthUrl, { method: 'OPTIONS' });
      console.log(`🔍 Health check response status: ${response.status}`);
      
      // For Netlify Functions, a 200 response to OPTIONS means the function exists
      return response.status === 200;
    } catch (error) {
      console.warn('Server health check failed:', error);
      return false;
    }
  }
}

export const apiClient = new ApiClient();
export type { ApiResponse, AuthResponse, ServerEntry };
