export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
  currency: string;
}

export interface Token {
  access_token: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  currency: string;
  created_at: string;
  updated_at: string;
}
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
