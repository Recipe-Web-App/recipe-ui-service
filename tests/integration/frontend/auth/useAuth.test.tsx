import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useLogin, useLogout, useRefreshToken } from '@/hooks/auth';
import { useAuthStore } from '@/stores/auth-store';
import { userAuthApi } from '@/lib/api/auth';
import type {
  UserLoginResponse,
  UserLogoutResponse,
  UserRefreshResponse,
} from '@/types/auth';

// Mock the API
jest.mock('@/lib/api/auth', () => ({
  userAuthApi: {
    login: jest.fn(),
    logout: jest.fn(),
    refresh: jest.fn(),
  },
}));

const mockedUserAuthApi = userAuthApi as jest.Mocked<typeof userAuthApi>;

// Create a wrapper component with QueryClient
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: Infinity,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('Auth Hooks Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset auth store
    useAuthStore.getState().clearAuth();
  });

  describe('useLogin', () => {
    it('should login user and update auth store', async () => {
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
          access_token: 'mock-token',
          token_type: 'Bearer',
          expires_in: 3600,
        },
      };

      mockedUserAuthApi.login.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useLogin(), {
        wrapper: createWrapper(),
      });

      // Execute login mutation
      result.current.mutate({
        email: 'test@example.com',
        password: 'password', // pragma: allowlist secret
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Check that auth store was updated
      const authState = useAuthStore.getState();
      expect(authState.authUser).toEqual(mockResponse.user);
      expect(authState.token).toBe(mockResponse.token.access_token);
      expect(authState.isAuthenticated).toBe(true);

      expect(mockedUserAuthApi.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password', // pragma: allowlist secret
      });
    });

    it('should handle login error', async () => {
      const error = new Error('Invalid credentials');
      mockedUserAuthApi.login.mockRejectedValue(error);

      const { result } = renderHook(() => useLogin(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({
        email: 'test@example.com',
        password: 'wrongpassword', // pragma: allowlist secret
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBe(error);

      // Auth store should not be updated
      const authState = useAuthStore.getState();
      expect(authState.isAuthenticated).toBe(false);
    });
  });

  describe('useLogout', () => {
    it('should logout user and clear auth store', async () => {
      const mockResponse: UserLogoutResponse = {
        message: 'Logged out successfully',
        session_invalidated: true,
      };

      mockedUserAuthApi.logout.mockResolvedValue(mockResponse);

      // First set some auth data
      useAuthStore.getState().setAuthUser({
        user_id: '123',
        username: 'testuser',
        email: 'test@example.com',
        is_active: true,
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
      });

      const { result } = renderHook(() => useLogout(), {
        wrapper: createWrapper(),
      });

      result.current.mutate();

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Check that auth store was cleared
      const authState = useAuthStore.getState();
      expect(authState.authUser).toBeNull();
      expect(authState.token).toBeNull();
      expect(authState.isAuthenticated).toBe(false);

      expect(mockedUserAuthApi.logout).toHaveBeenCalled();
    });
  });

  describe('useRefreshToken', () => {
    it('should refresh token and update auth store', async () => {
      const mockResponse: UserRefreshResponse = {
        message: 'Token refreshed',
        token: {
          access_token: 'new-token',
          token_type: 'Bearer',
          expires_in: 3600,
        },
      };

      mockedUserAuthApi.refresh.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useRefreshToken(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({
        refresh_token: 'old-refresh-token',
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Check that auth store was updated
      const authState = useAuthStore.getState();
      expect(authState.token).toBe('new-token');

      expect(mockedUserAuthApi.refresh).toHaveBeenCalledWith({
        refresh_token: 'old-refresh-token',
      });
    });

    it('should handle refresh token error', async () => {
      const error = new Error('Invalid refresh token');
      mockedUserAuthApi.refresh.mockRejectedValue(error);

      const { result } = renderHook(() => useRefreshToken(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({
        refresh_token: 'invalid-token',
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBe(error);
    });
  });
});
