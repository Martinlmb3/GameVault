const API_BASE_URL = 'http://localhost:5286/api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  id: string;
  username: string;
  accessToken: string;
}

export class ApiError extends Error {
  status: number;
  
  constructor(data: { message: string; status: number }) {
    super(data.message);
    this.name = 'ApiError';
    this.status = data.status;
  }
}

class ApiClient {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      credentials: 'include', // Important for HttpOnly cookies
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new ApiError({
          message: errorText || `HTTP error! status: ${response.status}`,
          status: response.status,
        });
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError({
        message: 'Network error or server is unreachable',
        status: 0,
      });
    }
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    return this.makeRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async signup(data: SignupRequest): Promise<AuthResponse> {
    return this.makeRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async refreshToken(): Promise<AuthResponse> {
    const token = localStorage.getItem('accessToken');
    return this.makeRequest<AuthResponse>('/auth/refresh-token', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async logout(): Promise<void> {
    // Clear access token from localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    // The HttpOnly cookie will be cleared by setting it with past expiration on server
  }
}

export const apiClient = new ApiClient();

// Helper functions for token management
export const setAuthData = (authResponse: AuthResponse) => {
  localStorage.setItem('accessToken', authResponse.accessToken);
  localStorage.setItem('user', JSON.stringify({
    id: authResponse.id,
    username: authResponse.username,
  }));
};

export const getAuthData = () => {
  const token = localStorage.getItem('accessToken');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  
  return { token, user };
};

export const isAuthenticated = (): boolean => {
  const { token } = getAuthData();
  return !!token;
};