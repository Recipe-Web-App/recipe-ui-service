export interface User {
  user_id: string;
  username: string;
  email?: string;
  full_name?: string;
  bio?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Token {
  access_token: string;
  refresh_token?: string;
  token_type: 'Bearer';
  expires_in: number;
}

export interface UserRegistrationRequest {
  username: string;
  email: string;
  password: string;
  full_name?: string;
  bio?: string;
}

export interface UserRegistrationResponse {
  user: User;
  token?: Token;
}

export interface UserLoginRequest {
  username?: string;
  email?: string;
  password: string;
}

export interface UserLoginResponse {
  user: User;
  token: Token;
}

export interface UserLogoutResponse {
  message: string;
  session_invalidated: boolean;
}

export interface UserRefreshRequest {
  refresh_token: string;
}

export interface UserRefreshResponse {
  message: string;
  token: Token;
}

export interface UserPasswordResetRequest {
  email: string;
}

export interface UserPasswordResetResponse {
  message: string;
  email_sent: boolean;
}

export interface UserPasswordResetConfirmRequest {
  reset_token: string;
  new_password: string;
}

export interface UserPasswordResetConfirmResponse {
  message: string;
  password_updated: boolean;
}

export interface AuthErrorResponse {
  error: 'authentication_error';
  error_description: string;
}
