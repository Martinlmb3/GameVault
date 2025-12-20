import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

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
  createAt?: string;
}

export interface GameRequest {
  title: string;
  publisher?: string;
  platform?: string;
  image?: string;
  releaseDate?: string;
  genres: string[];
}

export interface GameGenre {
  gameId: string;
  game?: GameResponse;
  genreId: string;
  genre?: {
    id: string;
    name: string;
    gameGenres?: GameGenre[];
  };
}

export interface GameResponse {
  id: string;
  name: string;
  publisher?: string;
  platform?: string;
  image?: string;
  releaseDate?: string;
  gameGenres?: GameGenre[];
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
  private axiosInstance: AxiosInstance;

  constructor() {
    // Create Axios instance with default configuration
    this.axiosInstance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true, // Send cookies with requests (for refresh token)
    });

    // Response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response) {
          // Server responded with error status
          throw new ApiError({
            message: (error.response.data as any)?.message || error.message || `HTTP error! status: ${error.response.status}`,
            status: error.response.status,
          });
        } else if (error.request) {
          // Request made but no response received
          throw new ApiError({
            message: 'Network error or server is unreachable',
            status: 0,
          });
        } else {
          // Something else happened
          throw new ApiError({
            message: error.message || 'An unexpected error occurred',
            status: 0,
          });
        }
      }
    );
  }

  private getAuthHeaders(): Record<string, string> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await this.axiosInstance.post<AuthResponse>('/auth/login', data);
    return response.data;
  }

  async signup(data: SignupRequest): Promise<AuthResponse> {
    const response = await this.axiosInstance.post<AuthResponse>('/auth/register', data);
    return response.data;
  }

  async refreshToken(): Promise<AuthResponse> {
    const response = await this.axiosInstance.post<AuthResponse>('/auth/refresh-token', {}, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  async logout(): Promise<void> {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    }
  }

  async getProfile(): Promise<ProfileResponse> {
    const response = await this.axiosInstance.get<ProfileResponse>('/auth/profile', {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  async updateProfile(data: ProfileRequest): Promise<ProfileResponse> {
    const response = await this.axiosInstance.put<ProfileResponse>('/auth/profile', data, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  async createGame(data: GameRequest): Promise<GameResponse> {
    const response = await this.axiosInstance.post<GameResponse>('/Game', data, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  async getAllGames(): Promise<GameResponse[]> {
    const response = await this.axiosInstance.get<GameResponse[]>('/Game/all');
    return response.data;
  }

  async getMyGames(): Promise<GameResponse[]> {
    const response = await this.axiosInstance.get<GameResponse[]>('/Game/my-games', {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  async updateGame(id: string, data: GameRequest): Promise<GameResponse> {
    const response = await this.axiosInstance.put<GameResponse>(`/Game/${id}`, data, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  async deleteGame(id: string): Promise<void> {
    await this.axiosInstance.delete<void>(`/Game/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }
}

export const apiClient = new ApiClient();

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
  if (typeof window === 'undefined') {
    return { token: null, user: null };
  }

  const token = localStorage.getItem('accessToken');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  return { token, user };
};

export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }

  const { token } = getAuthData();
  return !!token;
};

// Export error handler helper
export const handleAxiosError = (error: unknown): string => {
  if (error instanceof ApiError) {
    return error.message;
  }
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message;
  }
  return 'An unexpected error occurred';
};
