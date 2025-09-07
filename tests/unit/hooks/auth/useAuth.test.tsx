import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useLogin,
  useLogout,
  useRefreshToken,
  useUserInfo,
  useOAuthDiscovery,
} from '@/hooks/auth/useAuth';
import { useAuthStore } from '@/stores/auth-store';
import { userAuthApi, oauth2Api } from '@/lib/api/auth';
import type {
  UserLoginResponse,
  UserLogoutResponse,
  UserRefreshResponse,
  UserInfo,
  OAuthDiscovery,
} from '@/types/auth';

// Mock the API
jest.mock('@/lib/api/auth', () => ({
  userAuthApi: {
    login: jest.fn(),
    logout: jest.fn(),
    refresh: jest.fn(),
  },
  oauth2Api: {
    getUserInfo: jest.fn(),
    getDiscoveryDocument: jest.fn(),
  },
}));

const mockedUserAuthApi = userAuthApi as jest.Mocked<typeof userAuthApi>;
const mockedOAuth2Api = oauth2Api as jest.Mocked<typeof oauth2Api>;

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

describe('useAuth hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.getState().clearAuth();
  });

  describe('useLogin', () => {
    it('should login successfully and update auth store', async () => {
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
          access_token: 'access-token',
          token_type: 'Bearer',
          expires_in: 3600,
        },
      };

      mockedUserAuthApi.login.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useLogin(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({
        email: 'test@example.com',
        password: 'password', // pragma: allowlist secret
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedUserAuthApi.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password', // pragma: allowlist secret
      });

      // Check auth store was updated
      const authState = useAuthStore.getState();
      expect(authState.authUser).toEqual(mockResponse.user);
      expect(authState.token).toBe('access-token');
      expect(authState.isAuthenticated).toBe(true);
    });

    it('should handle login error', async () => {
      const error = new Error('Invalid credentials');
      mockedUserAuthApi.login.mockRejectedValue(error);

      const { result } = renderHook(() => useLogin(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({
        email: 'test@example.com',
        password: 'wrong', // pragma: allowlist secret
      });

      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(result.current.error).toBe(error);
    });
  });

  describe('useLogout', () => {
    it('should logout successfully and clear auth store', async () => {
      const mockResponse: UserLogoutResponse = {
        message: 'Logged out successfully',
        session_invalidated: true,
      };

      mockedUserAuthApi.logout.mockResolvedValue(mockResponse);

      // Set some auth data first
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

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedUserAuthApi.logout).toHaveBeenCalled();

      // Check auth store was cleared
      const authState = useAuthStore.getState();
      expect(authState.authUser).toBeNull();
      expect(authState.token).toBeNull();
      expect(authState.isAuthenticated).toBe(false);
    });
  });

  describe('useRefreshToken', () => {
    it('should refresh token successfully and update store', async () => {
      const mockResponse: UserRefreshResponse = {
        message: 'Token refreshed',
        token: {
          access_token: 'new-access-token',
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

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedUserAuthApi.refresh).toHaveBeenCalledWith({
        refresh_token: 'old-refresh-token',
      });

      // Check auth store was updated
      const authState = useAuthStore.getState();
      expect(authState.token).toBe('new-access-token');
    });
  });

  describe('useUserInfo', () => {
    it('should fetch user info when authenticated', async () => {
      const mockUserInfo: UserInfo = {
        sub: 'user123',
        email: 'test@example.com',
        name: 'Test User',
      };

      mockedOAuth2Api.getUserInfo.mockResolvedValue(mockUserInfo);

      // Set authenticated state
      useAuthStore.getState().setToken('access-token');
      useAuthStore.getState().setAuthUser({
        user_id: 'user123',
        username: 'testuser',
        email: 'test@example.com',
        is_active: true,
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
      });

      const { result } = renderHook(() => useUserInfo(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedOAuth2Api.getUserInfo).toHaveBeenCalled();
      expect(result.current.data).toEqual(mockUserInfo);
    });

    it('should not fetch user info when not authenticated', () => {
      const { result } = renderHook(() => useUserInfo(), {
        wrapper: createWrapper(),
      });

      // Should not trigger the query when not authenticated
      expect(result.current.fetchStatus).toBe('idle');
      expect(mockedOAuth2Api.getUserInfo).not.toHaveBeenCalled();
    });
  });

  describe('useOAuthDiscovery', () => {
    it('should fetch OAuth discovery document', async () => {
      const mockDiscovery: OAuthDiscovery = {
        issuer: 'http://localhost:8080',
        authorization_endpoint: 'http://localhost:8080/oauth2/authorize',
        token_endpoint: 'http://localhost:8080/oauth2/token',
      };

      mockedOAuth2Api.getDiscoveryDocument.mockResolvedValue(mockDiscovery);

      const { result } = renderHook(() => useOAuthDiscovery(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedOAuth2Api.getDiscoveryDocument).toHaveBeenCalled();
      expect(result.current.data).toEqual(mockDiscovery);
    });
  });
});
