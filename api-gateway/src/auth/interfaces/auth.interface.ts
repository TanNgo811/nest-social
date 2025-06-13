import { Observable } from 'rxjs';

// Auth Microservice RPC service interface
export interface AuthService {
  Register(request: RegisterRequest): Observable<RegisterResponse>;
  Login(request: LoginRequest): Observable<LoginResponse>;
  ValidateToken(request: ValidateTokenRequest): Observable<ValidateTokenResponse>;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password?: string;
}

export interface RegisterResponse {
  message: string;
  userId: string;
  success: boolean;
  accessToken?: string; // Optional, included if registration is successful and token is generated
}

export interface LoginRequest {
  email: string;
  password?: string;
}

export interface LoginResponse {
  accessToken: string;
  success: boolean;
  message: string;
  userId?: string; // Optional, included if login is successful and user ID is returned
}

export interface ValidateTokenRequest {
  accessToken: string;
}

export interface ValidateTokenResponse {
  userId: string;
  isValid: boolean;
}