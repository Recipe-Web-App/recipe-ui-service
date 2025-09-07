import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useBuildAuthorizeUrl,
  useExchangeCodeForToken,
  useIntrospectToken,
  useRevokeToken,
} from '@/hooks/auth/useOAuth2';
import { useAuthStore } from '@/stores/auth-store';
import { oauth2Api } from '@/lib/api/auth';
import type { TokenResponse, IntrospectResponse } from '@/types/auth';

// Mock the API
jest.mock('@/lib/api/auth', () => ({
  oauth2Api: {
    buildAuthorizeUrl: jest.fn(),
    exchangeCodeForToken: jest.fn(),
    introspectToken: jest.fn(),
    revokeToken: jest.fn(),
  },
}));

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

describe('useOAuth2 hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.getState().clearAuth();
  });

  describe('useBuildAuthorizeUrl', () => {
    it('should build authorize URL successfully', async () => {
      const mockResponse = {
        url: 'https://auth.example.com/oauth2/authorize?response_type=code&client_id=test-client&redirect_uri=http://localhost:3000/callback&code_challenge=challenge&code_challenge_method=S256&state=state',
        codeVerifier: 'test-verifier',
        state: 'test-state',
      };

      mockedOAuth2Api.buildAuthorizeUrl.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useBuildAuthorizeUrl(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({
        clientId: 'test-client',
        redirectUri: 'http://localhost:3000/callback',
        scope: 'openid profile',
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedOAuth2Api.buildAuthorizeUrl).toHaveBeenCalledWith({
        clientId: 'test-client',
        redirectUri: 'http://localhost:3000/callback',
        scope: 'openid profile',
      });
      expect(result.current.data).toEqual(mockResponse);
    });

    it('should handle authorize URL build error', async () => {
      const error = new Error('Invalid client configuration');
      mockedOAuth2Api.buildAuthorizeUrl.mockRejectedValue(error);

      const { result } = renderHook(() => useBuildAuthorizeUrl(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({
        clientId: 'invalid-client',
        redirectUri: 'http://localhost:3000/callback',
      });

      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(result.current.error).toBe(error);
    });
  });

  describe('useExchangeCodeForToken', () => {
    it('should exchange code for token and update auth store', async () => {
      const mockToken: TokenResponse = {
        access_token: 'access-token',
        token_type: 'Bearer',
        expires_in: 3600,
        refresh_token: 'refresh-token',
      };

      mockedOAuth2Api.exchangeCodeForToken.mockResolvedValue(mockToken);

      const { result } = renderHook(() => useExchangeCodeForToken(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({
        grant_type: 'authorization_code',
        code: 'auth-code',
        redirect_uri: 'http://localhost:3000/callback',
        client_id: 'test-client',
        code_verifier: 'verifier',
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedOAuth2Api.exchangeCodeForToken).toHaveBeenCalledWith({
        grant_type: 'authorization_code',
        code: 'auth-code',
        redirect_uri: 'http://localhost:3000/callback',
        client_id: 'test-client',
        code_verifier: 'verifier',
      });

      // Check that token was set in auth store
      const authState = useAuthStore.getState();
      expect(authState.token).toBe('access-token');
    });

    it('should handle token exchange error', async () => {
      const error = new Error('Invalid authorization code');
      mockedOAuth2Api.exchangeCodeForToken.mockRejectedValue(error);

      const { result } = renderHook(() => useExchangeCodeForToken(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({
        grant_type: 'authorization_code',
        code: 'invalid-code',
        redirect_uri: 'http://localhost:3000/callback',
        client_id: 'test-client',
        code_verifier: 'verifier',
      });

      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(result.current.error).toBe(error);

      // Auth store should not be updated
      const authState = useAuthStore.getState();
      expect(authState.token).toBeNull();
    });
  });

  describe('useIntrospectToken', () => {
    it('should introspect token successfully', async () => {
      const mockIntrospection: IntrospectResponse = {
        active: true,
        client_id: 'test-client',
        sub: 'user123',
        exp: 1640995200,
        scope: 'openid profile',
      };

      mockedOAuth2Api.introspectToken.mockResolvedValue(mockIntrospection);

      const { result } = renderHook(() => useIntrospectToken(), {
        wrapper: createWrapper(),
      });

      result.current.mutate('test-token');

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedOAuth2Api.introspectToken).toHaveBeenCalledWith({
        token: 'test-token',
      });
      expect(result.current.data).toEqual(mockIntrospection);
    });

    it('should handle token introspection error', async () => {
      const error = new Error('Token introspection failed');
      mockedOAuth2Api.introspectToken.mockRejectedValue(error);

      const { result } = renderHook(() => useIntrospectToken(), {
        wrapper: createWrapper(),
      });

      result.current.mutate('invalid-token');

      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(result.current.error).toBe(error);
    });
  });

  describe('useRevokeToken', () => {
    it('should revoke token and clear auth store', async () => {
      mockedOAuth2Api.revokeToken.mockResolvedValue(undefined);

      // Set some auth data first
      useAuthStore.getState().setToken('token-to-revoke');

      const { result } = renderHook(() => useRevokeToken(), {
        wrapper: createWrapper(),
      });

      result.current.mutate('token-to-revoke');

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedOAuth2Api.revokeToken).toHaveBeenCalledWith({
        token: 'token-to-revoke',
      });

      // Check that auth was cleared
      const authState = useAuthStore.getState();
      expect(authState.token).toBeNull();
      expect(authState.isAuthenticated).toBe(false);
    });

    it('should handle token revocation error', async () => {
      const error = new Error('Token revocation failed');
      mockedOAuth2Api.revokeToken.mockRejectedValue(error);

      const { result } = renderHook(() => useRevokeToken(), {
        wrapper: createWrapper(),
      });

      result.current.mutate('test-token');

      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(result.current.error).toBe(error);
    });
  });
});
