// Auth DTOs
export interface LoginDto {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  role: "admin" | "moderator" | "user";
  permissions: Permission[];
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// API Response wrapper
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  error?: string;
}
