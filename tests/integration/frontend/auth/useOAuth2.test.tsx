import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useBuildAuthorizeUrl, useExchangeCodeForToken } from '@/hooks/auth';
import { useAuthStore } from '@/stores/auth-store';
import { oauth2Api } from '@/lib/api/auth';
import type { TokenResponse } from '@/types/auth';

// Mock the API
jest.mock('@/lib/api/auth', () => ({
  oauth2Api: {
    buildAuthorizeUrl: jest.fn(),
    exchangeCodeForToken: jest.fn(),
  },
}));

const mockedOAuth2Api = oauth2Api as jest.Mocked<typeof oauth2Api>;

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

describe('OAuth2 Hooks Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset auth store
    useAuthStore.getState().clearAuth();
  });

  describe('useBuildAuthorizeUrl', () => {
    it('should build authorize URL with PKCE', async () => {
      const mockResponse = {
        url: 'https://auth.example.com/oauth2/authorize?response_type=code&client_id=test-client&redirect_uri=http://localhost:3000/callback&code_challenge=mock-challenge&code_challenge_method=S256&state=mock-state',
        codeVerifier: 'mock-verifier',
        state: 'mock-state',
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

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockResponse);
      expect(mockedOAuth2Api.buildAuthorizeUrl).toHaveBeenCalledWith({
        clientId: 'test-client',
        redirectUri: 'http://localhost:3000/callback',
        scope: 'openid profile',
      });
    });

    it('should handle URL building error', async () => {
      const error = new Error('Invalid client configuration');
      mockedOAuth2Api.buildAuthorizeUrl.mockRejectedValue(error);

      const { result } = renderHook(() => useBuildAuthorizeUrl(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({
        clientId: 'invalid-client',
        redirectUri: 'http://localhost:3000/callback',
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBe(error);
    });
  });

  describe('useExchangeCodeForToken', () => {
    it('should exchange authorization code for token', async () => {
      const mockTokenResponse: TokenResponse = {
        access_token: 'mock-access-token',
        token_type: 'Bearer',
        expires_in: 3600,
        refresh_token: 'mock-refresh-token',
        scope: 'openid profile',
      };

      mockedOAuth2Api.exchangeCodeForToken.mockResolvedValue(mockTokenResponse);

      const { result } = renderHook(() => useExchangeCodeForToken(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({
        grant_type: 'authorization_code',
        code: 'auth-code',
        redirect_uri: 'http://localhost:3000/callback',
        client_id: 'test-client',
        code_verifier: 'code-verifier',
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Check that token was set in auth store
      const authState = useAuthStore.getState();
      expect(authState.token).toBe(mockTokenResponse.access_token);

      expect(mockedOAuth2Api.exchangeCodeForToken).toHaveBeenCalledWith({
        grant_type: 'authorization_code',
        code: 'auth-code',
        redirect_uri: 'http://localhost:3000/callback',
        client_id: 'test-client',
        code_verifier: 'code-verifier',
      });
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
        code_verifier: 'code-verifier',
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBe(error);

      // Auth store should not be updated
      const authState = useAuthStore.getState();
      expect(authState.token).toBeNull();
    });
  });
});
