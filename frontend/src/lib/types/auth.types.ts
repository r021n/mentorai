export interface User {
  id: number;
  username: string;
  role: 'admin' | 'siswa';
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
}
