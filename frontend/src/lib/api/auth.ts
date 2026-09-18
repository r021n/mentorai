import { api } from './client.ts';
import type { User, LoginResponse } from '../types/auth.types.ts';

export const authApi = {
  async login(credentials: { username: string; password: string }): Promise<LoginResponse> {
    const res = await api.post<LoginResponse>('/auth/login', credentials);
    if (res.data?.token) {
      api.setToken(res.data.token);
    }
    return res.data!;
  },

  async register(data: { username: string; password: string; confirmPassword: string }): Promise<void> {
    await api.post('/auth/register', data);
  },

  async getMe(): Promise<User> {
    const res = await api.get<User>('/auth/me');
    return res.data!;
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } finally {
      api.setToken(null);
    }
  },
};
