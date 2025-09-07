import { userAuthApi } from '@/lib/api/auth/user-auth';
import { authClient } from '@/lib/api/auth/client';
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

// Mock the auth client
jest.mock('@/lib/api/auth/client', () => ({
  authClient: {
    post: jest.fn(),
  },
  handleAuthApiError: jest.fn().mockImplementation(error => {
    throw new Error(error.message || 'API Error');
  }),
}));

const mockedAuthClient = authClient as jest.Mocked<typeof authClient>;

describe('User Auth API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const request: UserRegistrationRequest = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123', // pragma: allowlist secret
        full_name: 'Test User',
      };

      const mockResponse: UserRegistrationResponse = {
        user: {
          user_id: '123',
          username: 'testuser',
          email: 'test@example.com',
          full_name: 'Test User',
          is_active: true,
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z',
        },
        token: {
          access_token: 'registration-token',
          token_type: 'Bearer',
          expires_in: 3600,
        },
      };

      mockedAuthClient.post.mockResolvedValue({ data: mockResponse });

      const result = await userAuthApi.register(request);

      expect(mockedAuthClient.post).toHaveBeenCalledWith(
        '/user-management/auth/register',
        request
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle registration error', async () => {
      const request: UserRegistrationRequest = {
        username: 'existinguser',
        email: 'existing@example.com',
        password: 'password123', // pragma: allowlist secret
      };

      const error = new Error('Username already exists');
      mockedAuthClient.post.mockRejectedValue(error);

      await expect(userAuthApi.register(request)).rejects.toThrow(
        'Username already exists'
      );
    });
  });

  describe('login', () => {
    it('should login with email and password', async () => {
      const request: UserLoginRequest = {
        email: 'test@example.com',
        password: 'password123', // pragma: allowlist secret
      };

      const mockResponse: UserLoginResponse = {
        user: {
          user_id: '123',
          username: 'testuser',
          email: 'test@example.com',
          is_active: true,
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z',
        },
        token: {
          access_token: 'login-token',
          refresh_token: 'refresh-token',
          token_type: 'Bearer',
          expires_in: 3600,
        },
      };

      mockedAuthClient.post.mockResolvedValue({ data: mockResponse });

      const result = await userAuthApi.login(request);

      expect(mockedAuthClient.post).toHaveBeenCalledWith(
        '/user-management/auth/login',
        request
      );
      expect(result).toEqual(mockResponse);
    });

    it('should login with username and password', async () => {
      const request: UserLoginRequest = {
        username: 'testuser',
        password: 'password123', // pragma: allowlist secret
      };

      const mockResponse: UserLoginResponse = {
        user: {
          user_id: '123',
          username: 'testuser',
          email: 'test@example.com',
          is_active: true,
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z',
        },
        token: {
          access_token: 'login-token',
          token_type: 'Bearer',
          expires_in: 3600,
        },
      };

      mockedAuthClient.post.mockResolvedValue({ data: mockResponse });

      const result = await userAuthApi.login(request);

      expect(result).toEqual(mockResponse);
    });

    it('should handle login error', async () => {
      const request: UserLoginRequest = {
        email: 'test@example.com',
        password: 'wrongpassword', // pragma: allowlist secret
      };

      const error = new Error('Invalid credentials');
      mockedAuthClient.post.mockRejectedValue(error);

      await expect(userAuthApi.login(request)).rejects.toThrow(
        'Invalid credentials'
      );
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      const mockResponse: UserLogoutResponse = {
        message: 'Logged out successfully',
        session_invalidated: true,
      };

      mockedAuthClient.post.mockResolvedValue({ data: mockResponse });

      const result = await userAuthApi.logout();

      expect(mockedAuthClient.post).toHaveBeenCalledWith(
        '/user-management/auth/logout'
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle logout error', async () => {
      const error = new Error('No active session');
      mockedAuthClient.post.mockRejectedValue(error);

      await expect(userAuthApi.logout()).rejects.toThrow('No active session');
    });
  });

  describe('refresh', () => {
    it('should refresh token successfully', async () => {
      const request: UserRefreshRequest = {
        refresh_token: 'valid-refresh-token',
      };

      const mockResponse: UserRefreshResponse = {
        message: 'Token refreshed successfully',
        token: {
          access_token: 'new-access-token',
          refresh_token: 'new-refresh-token',
          token_type: 'Bearer',
          expires_in: 3600,
        },
      };

      mockedAuthClient.post.mockResolvedValue({ data: mockResponse });

      const result = await userAuthApi.refresh(request);

      expect(mockedAuthClient.post).toHaveBeenCalledWith(
        '/user-management/auth/refresh',
        request
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle refresh token error', async () => {
      const request: UserRefreshRequest = {
        refresh_token: 'invalid-refresh-token',
      };

      const error = new Error('Invalid refresh token');
      mockedAuthClient.post.mockRejectedValue(error);

      await expect(userAuthApi.refresh(request)).rejects.toThrow(
        'Invalid refresh token'
      );
    });
  });

  describe('requestPasswordReset', () => {
    it('should request password reset successfully', async () => {
      const request: UserPasswordResetRequest = {
        email: 'test@example.com',
      };

      const mockResponse: UserPasswordResetResponse = {
        message: 'Password reset email sent',
        email_sent: true,
      };

      mockedAuthClient.post.mockResolvedValue({ data: mockResponse });

      const result = await userAuthApi.requestPasswordReset(request);

      expect(mockedAuthClient.post).toHaveBeenCalledWith(
        '/user-management/auth/reset-password',
        request
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle password reset request error', async () => {
      const request: UserPasswordResetRequest = {
        email: 'nonexistent@example.com',
      };

      const error = new Error('Email not found');
      mockedAuthClient.post.mockRejectedValue(error);

      await expect(userAuthApi.requestPasswordReset(request)).rejects.toThrow(
        'Email not found'
      );
    });
  });

  describe('confirmPasswordReset', () => {
    it('should confirm password reset successfully', async () => {
      const request: UserPasswordResetConfirmRequest = {
        reset_token: 'valid-reset-token',
        new_password: 'newpassword123', // pragma: allowlist secret
      };

      const mockResponse: UserPasswordResetConfirmResponse = {
        message: 'Password updated successfully',
        password_updated: true,
      };

      mockedAuthClient.post.mockResolvedValue({ data: mockResponse });

      const result = await userAuthApi.confirmPasswordReset(request);

      expect(mockedAuthClient.post).toHaveBeenCalledWith(
        '/user-management/auth/reset-password/confirm',
        request
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle password reset confirmation error', async () => {
      const request: UserPasswordResetConfirmRequest = {
        reset_token: 'expired-reset-token',
        new_password: 'newpassword123', // pragma: allowlist secret
      };

      const error = new Error('Reset token expired');
      mockedAuthClient.post.mockRejectedValue(error);

      await expect(userAuthApi.confirmPasswordReset(request)).rejects.toThrow(
        'Reset token expired'
      );
    });
  });
});
