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
  image?: string;
}

export interface ProfileRequest {
  username: string;
  email: string;
  image?: string;
}

export interface ProfileResponse {
  id: string;
  username: string;
  email: string;
  image?: string;
}

export interface GameRequest {
  title: string;
  publisher?: string;
  platform?: string;
  image?: string;
  releaseDate?: string;
  genres: string[];
}

export interface GameResponse {
  id: string;
  name: string;
  publisher?: string;
  platform?: string;
  image?: string;
  releaseDate?: string;
  gameGenres?: Array<{
    gameId: string;
    game?: any;
    genreId: string;
    genre?: {
      id: string;
      name: string;
      gameGenres?: any[];
    };
  }>;
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
  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`;
    
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
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    return this.makeRequest<AuthResponse>('/auth/refresh-token', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async logout(): Promise<void> {
    // Clear access token from localStorage (only on client side)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    }
    // The HttpOnly cookie will be cleared by setting it with past expiration on server
  }

  async getProfile(): Promise<ProfileResponse> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    return this.makeRequest<ProfileResponse>('/auth/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async updateProfile(data: ProfileRequest): Promise<ProfileResponse> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    return this.makeRequest<ProfileResponse>('/auth/profile', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
  }

  async createGame(data: GameRequest): Promise<GameResponse> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    return this.makeRequest<GameResponse>('/Game', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
  }

  async getAllGames(): Promise<GameResponse[]> {
    return this.makeRequest<GameResponse[]>('/Game/all');
  }

  async getMyGames(): Promise<GameResponse[]> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    return this.makeRequest<GameResponse[]>('/Game/my-games', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async updateGame(id: string, data: GameRequest): Promise<GameResponse> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    return this.makeRequest<GameResponse>(`/Game/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
  }

  async deleteGame(id: string): Promise<void> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    return this.makeRequest<void>(`/Game/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }
}

export const apiClient = new ApiClient();

// Helper functions for token management
export const setAuthData = (authResponse: AuthResponse) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('accessToken', authResponse.accessToken);
    localStorage.setItem('user', JSON.stringify({
      id: authResponse.id,
      username: authResponse.username,
      image: authResponse.image,
    }));
  }
};

export const getAuthData = () => {
  // Check if we're on the client side
  if (typeof window === 'undefined') {
    return { token: null, user: null };
  }
  
  const token = localStorage.getItem('accessToken');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  
  return { token, user };
};

export const isAuthenticated = (): boolean => {
  // Check if we're on the client side
  if (typeof window === 'undefined') {
    return false;
  }
  
  const { token } = getAuthData();
  return !!token;
};