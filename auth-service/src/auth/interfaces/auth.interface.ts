export interface RegisterRequest {
  username: string;
  email: string;
  password?: string; // Optional because it's not sent back
}

export interface RegisterResponse {
  message: string;
  userId: string | null;
  success: boolean;
}

export interface LoginRequest {
  email: string;
  password?: string; // Optional for security reasons, not sent back
}

export interface LoginResponse {
  accessToken: string | null;
  success: boolean;
  message: string;
}

export interface ValidateTokenRequest {
  accessToken: string;
}

export interface ValidateTokenResponse {
  userId: string | null;
  isValid: boolean;
}
