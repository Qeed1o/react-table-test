import type { User, LoginCredentials } from '../types';

export interface LoginRequest {
  username: string;
  password: string;
  expiresInMins?: number;
}

export interface AuthResponse {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  accessToken: string;
  refreshToken: string;
}

class AuthApi {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async login(credentials: LoginCredentials): Promise<User> {
    const loginData: LoginRequest = {
      username: credentials.login,
      password: credentials.password,
      expiresInMins: 5,
    };

    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });

    if (!response.ok) {
      throw new Error('Неверный логин или пароль');
    }

    const data: AuthResponse = await response.json();

    return {
      id: data.id.toString(),
      login: data.username,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    };
  }

  async refreshToken(refreshToken: string): Promise<string> {
    const response = await fetch(`${this.baseUrl}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Не удалось обновить токен');
    }

    const data = await response.json();
    return data.accessToken;
  }

  async getCurrentUser(token: string): Promise<User> {
    const response = await fetch(`${this.baseUrl}/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Не удалось получить данные пользователя');
    }

    const data = await response.json();
    
    return {
      id: data.id.toString(),
      login: data.username,
      accessToken: token,
      refreshToken: '', // Will be managed separately
    };
  }
}

export const authApi = new AuthApi(import.meta.env.VITE_API_BASE_URL || 'https://dummyjson.com');
