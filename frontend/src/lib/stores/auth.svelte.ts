import { authApi } from '../api/auth';
import type { User } from '../types/auth.types';

export class AuthStore {
  user = $state<User | null>(null);
  isLoading = $state<boolean>(true);
  get isAuthenticated(): boolean {
    return this.user !== null;
  }

  get isAdmin(): boolean {
    return this.user?.role === 'admin';
  }

  async init(): Promise<void> {
    this.isLoading = true;
    try {
      const user = await authApi.getMe();
      this.user = user;
    } catch {
      this.user = null;
    } finally {
      this.isLoading = false;
    }
  }

  setUser(user: User | null): void {
    this.user = user;
  }

  async logout(): Promise<void> {
    try {
      await authApi.logout();
    } finally {
      this.user = null;
      window.location.hash = '#/login';
    }
  }
}

export const authStore = new AuthStore();
