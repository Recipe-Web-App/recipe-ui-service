import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useRequestPasswordReset,
  useConfirmPasswordReset,
} from '@/hooks/auth/usePasswordReset';
import { userAuthApi } from '@/lib/api/auth';
import type {
  UserPasswordResetResponse,
  UserPasswordResetConfirmResponse,
} from '@/types/auth';

// Mock the API
jest.mock('@/lib/api/auth', () => ({
  userAuthApi: {
    requestPasswordReset: jest.fn(),
    confirmPasswordReset: jest.fn(),
  },
}));

const mockedUserAuthApi = userAuthApi as jest.Mocked<typeof userAuthApi>;

// Create wrapper component
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: Infinity },
      mutations: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('Password Reset hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useRequestPasswordReset', () => {
    it('should request password reset successfully', async () => {
      const mockResponse: UserPasswordResetResponse = {
        message: 'Password reset email sent successfully',
        email_sent: true,
      };

      mockedUserAuthApi.requestPasswordReset.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useRequestPasswordReset(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({
        email: 'user@example.com',
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedUserAuthApi.requestPasswordReset).toHaveBeenCalledWith({
        email: 'user@example.com',
      });
      expect(result.current.data).toEqual(mockResponse);
    });

    it('should handle password reset request error for non-existent email', async () => {
      const error = new Error('Email address not found');
      mockedUserAuthApi.requestPasswordReset.mockRejectedValue(error);

      const { result } = renderHook(() => useRequestPasswordReset(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({
        email: 'nonexistent@example.com',
      });

      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(result.current.error).toBe(error);
    });

    it('should handle password reset request with invalid email format', async () => {
      const error = new Error('Invalid email format');
      mockedUserAuthApi.requestPasswordReset.mockRejectedValue(error);

      const { result } = renderHook(() => useRequestPasswordReset(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({
        email: 'invalid-email',
      });

      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(result.current.error).toBe(error);
    });

    it('should handle server error during password reset request', async () => {
      const error = new Error('Email service unavailable');
      mockedUserAuthApi.requestPasswordReset.mockRejectedValue(error);

      const { result } = renderHook(() => useRequestPasswordReset(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({
        email: 'user@example.com',
      });

      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(result.current.error).toBe(error);
    });
  });

  describe('useConfirmPasswordReset', () => {
    it('should confirm password reset successfully', async () => {
      const mockResponse: UserPasswordResetConfirmResponse = {
        message: 'Password updated successfully',
        password_updated: true,
      };

      mockedUserAuthApi.confirmPasswordReset.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useConfirmPasswordReset(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({
        reset_token: 'valid-reset-token',
        new_password: 'newpassword123', // pragma: allowlist secret
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedUserAuthApi.confirmPasswordReset).toHaveBeenCalledWith({
        reset_token: 'valid-reset-token',
        new_password: 'newpassword123', // pragma: allowlist secret
      });
      expect(result.current.data).toEqual(mockResponse);
    });

    it('should handle expired reset token', async () => {
      const error = new Error('Reset token has expired');
      mockedUserAuthApi.confirmPasswordReset.mockRejectedValue(error);

      const { result } = renderHook(() => useConfirmPasswordReset(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({
        reset_token: 'expired-token',
        new_password: 'newpassword123', // pragma: allowlist secret
      });

      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(result.current.error).toBe(error);
    });

    it('should handle invalid reset token', async () => {
      const error = new Error('Invalid reset token');
      mockedUserAuthApi.confirmPasswordReset.mockRejectedValue(error);

      const { result } = renderHook(() => useConfirmPasswordReset(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({
        reset_token: 'invalid-token',
        new_password: 'newpassword123', // pragma: allowlist secret
      });

      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(result.current.error).toBe(error);
    });

    it('should handle weak password validation', async () => {
      const error = new Error('Password does not meet security requirements');
      mockedUserAuthApi.confirmPasswordReset.mockRejectedValue(error);

      const { result } = renderHook(() => useConfirmPasswordReset(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({
        reset_token: 'valid-reset-token',
        new_password: '123', // Weak password
      });

      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(result.current.error).toBe(error);
    });

    it('should handle already used reset token', async () => {
      const error = new Error('Reset token has already been used');
      mockedUserAuthApi.confirmPasswordReset.mockRejectedValue(error);

      const { result } = renderHook(() => useConfirmPasswordReset(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({
        reset_token: 'used-token',
        new_password: 'newpassword123', // pragma: allowlist secret
      });

      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(result.current.error).toBe(error);
    });
  });
});
