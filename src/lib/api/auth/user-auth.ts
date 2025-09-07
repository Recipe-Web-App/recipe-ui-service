import { authClient, handleAuthApiError } from './client';
import type {
  UserRegistrationRequest,
  UserRegistrationResponse,
  UserLoginRequest,
  UserLoginResponse,
  UserLogoutResponse,
  UserRefreshRequest,
  UserRefreshResponse,
  UserPasswordResetRequest,
  UserPasswordResetResponse,
  UserPasswordResetConfirmRequest,
  UserPasswordResetConfirmResponse,
} from '@/types/auth';

export const userAuthApi = {
  async register(
    data: UserRegistrationRequest
  ): Promise<UserRegistrationResponse> {
    try {
      const response = await authClient.post(
        '/user-management/auth/register',
        data
      );
      return response.data as UserRegistrationResponse;
    } catch (error) {
      handleAuthApiError(error);
      throw error; // This line should never be reached since handleAuthApiError throws
    }
  },

  async login(data: UserLoginRequest): Promise<UserLoginResponse> {
    try {
      const response = await authClient.post(
        '/user-management/auth/login',
        data
      );
      return response.data as UserLoginResponse;
    } catch (error) {
      handleAuthApiError(error);
      throw error; // This line should never be reached since handleAuthApiError throws
    }
  },

  async logout(): Promise<UserLogoutResponse> {
    try {
      const response = await authClient.post('/user-management/auth/logout');
      return response.data as UserLogoutResponse;
    } catch (error) {
      handleAuthApiError(error);
      throw error; // This line should never be reached since handleAuthApiError throws
    }
  },

  async refresh(data: UserRefreshRequest): Promise<UserRefreshResponse> {
    try {
      const response = await authClient.post(
        '/user-management/auth/refresh',
        data
      );
      return response.data as UserRefreshResponse;
    } catch (error) {
      handleAuthApiError(error);
      throw error; // This line should never be reached since handleAuthApiError throws
    }
  },

  async requestPasswordReset(
    data: UserPasswordResetRequest
  ): Promise<UserPasswordResetResponse> {
    try {
      const response = await authClient.post(
        '/user-management/auth/reset-password',
        data
      );
      return response.data as UserPasswordResetResponse;
    } catch (error) {
      handleAuthApiError(error);
      throw error; // This line should never be reached since handleAuthApiError throws
    }
  },

  async confirmPasswordReset(
    data: UserPasswordResetConfirmRequest
  ): Promise<UserPasswordResetConfirmResponse> {
    try {
      const response = await authClient.post(
        '/user-management/auth/reset-password/confirm',
        data
      );
      return response.data as UserPasswordResetConfirmResponse;
    } catch (error) {
      handleAuthApiError(error);
      throw error; // This line should never be reached since handleAuthApiError throws
    }
  },
};
