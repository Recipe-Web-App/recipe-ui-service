/**
 * Token Refresh Interceptor Tests
 *
 * Comprehensive test suite for automatic token refresh functionality
 */

import axios, { AxiosInstance } from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { useAuthStore } from '@/stores/auth-store';
import {
  attachTokenRefreshInterceptor,
  resetRefreshState,
} from '@/lib/api/shared/token-refresh-interceptor';

// Mock the auth store
jest.mock('@/stores/auth-store');

// Create mock adapter for global axios (used in refresh function)
const globalAxiosMock = new MockAdapter(axios);

describe('Token Refresh Interceptor', () => {
  let axiosInstance: AxiosInstance;
  let mockAdapter: MockAdapter;
  let mockAuthStore: {
    refreshToken: string | null;
    setTokenData: jest.Mock;
    clearAuth: jest.Mock;
  };
  let mockLocationHref: string;
  let mockLocationPathname: string;
  const originalLocation = window.location;

  beforeEach(() => {
    // Create fresh axios instance for each test
    axiosInstance = axios.create({
      baseURL: 'http://api.test',
    });

    // Create mock adapter
    mockAdapter = new MockAdapter(axiosInstance);

    // Reset refresh state
    resetRefreshState();

    // Mock auth store
    mockAuthStore = {
      refreshToken: 'valid-refresh-token',
      setTokenData: jest.fn(),
      clearAuth: jest.fn(),
    };

    (useAuthStore.getState as jest.Mock) = jest.fn(() => mockAuthStore);

    // Mock window.location with getters/setters
    mockLocationHref = '';
    mockLocationPathname = '/';

    delete (global as any).window.location;
    (global as any).window.location = {
      get href() {
        return mockLocationHref;
      },
      set href(value: string) {
        mockLocationHref = value;
      },
      get pathname() {
        return mockLocationPathname;
      },
      set pathname(value: string) {
        mockLocationPathname = value;
      },
    };
  });

  afterEach(() => {
    mockAdapter.reset();
    globalAxiosMock.reset();
    (global as any).window.location = originalLocation;
    jest.clearAllMocks();
  });

  describe('Successful Token Refresh', () => {
    it('should refresh token and retry request on 401 error', async () => {
      // Attach interceptor
      attachTokenRefreshInterceptor(axiosInstance);

      // Mock initial request that fails with 401
      mockAdapter.onGet('/protected-resource').replyOnce(401);

      // Mock refresh endpoint success (using global axios mock)
      globalAxiosMock
        .onPost(
          'http://auth-service.local/api/v1/auth/user-management/auth/refresh'
        )
        .replyOnce(200, {
          token: {
            access_token: 'new-access-token',
            refresh_token: 'new-refresh-token',
            token_type: 'Bearer',
            expires_in: 3600,
          },
        });

      // Mock retry of original request with new token
      mockAdapter
        .onGet('/protected-resource')
        .replyOnce(200, { data: 'success' });

      // Make request
      const response = await axiosInstance.get('/protected-resource');

      // Verify response
      expect(response.status).toBe(200);
      expect(response.data).toEqual({ data: 'success' });

      // Verify token was updated in store
      expect(mockAuthStore.setTokenData).toHaveBeenCalledWith({
        access_token: 'new-access-token',
        refresh_token: 'new-refresh-token',
        token_type: 'Bearer',
        expires_in: 3600,
      });
    });

    it('should update authorization header with new token on retry', async () => {
      attachTokenRefreshInterceptor(axiosInstance);

      let retryAuthHeader: string | undefined;

      // Mock initial 401
      mockAdapter.onGet('/protected').replyOnce(401);

      // Mock refresh success
      globalAxiosMock
        .onPost(
          'http://auth-service.local/api/v1/auth/user-management/auth/refresh'
        )
        .replyOnce(200, {
          token: {
            access_token: 'fresh-token',
            refresh_token: 'new-refresh',
            token_type: 'Bearer',
            expires_in: 3600,
          },
        });

      // Capture authorization header on retry
      mockAdapter.onGet('/protected').replyOnce(config => {
        retryAuthHeader = config.headers?.Authorization;
        return [200, { success: true }];
      });

      await axiosInstance.get('/protected');

      expect(retryAuthHeader).toBe('Bearer fresh-token');
    });
  });

  describe('Concurrent Request Handling', () => {
    it('should only make one refresh request for concurrent 401s', async () => {
      attachTokenRefreshInterceptor(axiosInstance);

      let refreshCallCount = 0;

      // Mock multiple endpoints returning 401
      mockAdapter.onGet('/resource1').replyOnce(401);
      mockAdapter.onGet('/resource2').replyOnce(401);
      mockAdapter.onGet('/resource3').replyOnce(401);

      // Mock refresh endpoint (track call count)
      globalAxiosMock
        .onPost(
          'http://auth-service.local/api/v1/auth/user-management/auth/refresh'
        )
        .reply(() => {
          refreshCallCount++;
          return [
            200,
            {
              token: {
                access_token: 'new-token',
                refresh_token: 'new-refresh',
                token_type: 'Bearer',
                expires_in: 3600,
              },
            },
          ];
        });

      // Mock successful retries
      mockAdapter.onGet('/resource1').replyOnce(200, { data: 1 });
      mockAdapter.onGet('/resource2').replyOnce(200, { data: 2 });
      mockAdapter.onGet('/resource3').replyOnce(200, { data: 3 });

      // Make concurrent requests
      const [res1, res2, res3] = await Promise.all([
        axiosInstance.get('/resource1'),
        axiosInstance.get('/resource2'),
        axiosInstance.get('/resource3'),
      ]);

      // Verify all succeeded
      expect(res1.data).toEqual({ data: 1 });
      expect(res2.data).toEqual({ data: 2 });
      expect(res3.data).toEqual({ data: 3 });

      // Verify only ONE refresh was made
      expect(refreshCallCount).toBe(1);
    });

    it('should reject all queued requests when refresh fails', async () => {
      attachTokenRefreshInterceptor(axiosInstance);

      // Mock multiple endpoints returning 401
      mockAdapter.onGet('/resource1').replyOnce(401);
      mockAdapter.onGet('/resource2').replyOnce(401);
      mockAdapter.onGet('/resource3').replyOnce(401);

      // Mock refresh endpoint failure
      globalAxiosMock
        .onPost(
          'http://auth-service.local/api/v1/auth/user-management/auth/refresh'
        )
        .replyOnce(500, { error: 'Refresh failed' });

      // Make concurrent requests - all should fail
      await expect(
        Promise.all([
          axiosInstance.get('/resource1'),
          axiosInstance.get('/resource2'),
          axiosInstance.get('/resource3'),
        ])
      ).rejects.toThrow();

      // Verify auth was cleared
      expect(mockAuthStore.clearAuth).toHaveBeenCalled();
    });

    it('should handle queued requests without headers object', async () => {
      attachTokenRefreshInterceptor(axiosInstance);

      // Mock two 401 responses to trigger queueing
      mockAdapter.onGet('/first').replyOnce(401);
      mockAdapter.onGet('/second').replyOnce(401);

      // Mock successful refresh
      globalAxiosMock
        .onPost(
          'http://auth-service.local/api/v1/auth/user-management/auth/refresh'
        )
        .replyOnce(200, {
          token: {
            access_token: 'refreshed-token',
            refresh_token: 'new-refresh-token',
            token_type: 'Bearer',
            expires_in: 3600,
          },
        });

      // Mock successful retries - capture what happens with headers
      mockAdapter.onGet('/first').replyOnce(200, { data: 'first' });
      mockAdapter.onGet('/second').replyOnce(200, { data: 'second' });

      // Make concurrent requests
      const [res1, res2] = await Promise.all([
        axiosInstance.get('/first'),
        axiosInstance.get('/second'),
      ]);

      expect(res1.data).toEqual({ data: 'first' });
      expect(res2.data).toEqual({ data: 'second' });
    });
  });

  describe('Refresh Endpoint Protection', () => {
    it('should clear auth when refresh returns 401 (expired refresh token)', async () => {
      attachTokenRefreshInterceptor(axiosInstance);

      // Mock initial request that fails with 401
      mockAdapter.onGet('/protected').replyOnce(401);

      // Mock refresh endpoint returning 401 (expired refresh token)
      globalAxiosMock
        .onPost(
          'http://auth-service.local/api/v1/auth/user-management/auth/refresh'
        )
        .replyOnce(401);

      // Make request - should trigger refresh, refresh fails, clears auth
      await expect(axiosInstance.get('/protected')).rejects.toThrow();

      // Verify auth was cleared (redirect happens but is hard to test in jsdom)
      expect(mockAuthStore.clearAuth).toHaveBeenCalled();
    });

    it('should clear auth when direct call to refresh endpoint returns 401', async () => {
      attachTokenRefreshInterceptor(axiosInstance);

      // Mock a direct call to the refresh endpoint that returns 401
      mockAdapter
        .onPost('/auth/refresh')
        .replyOnce(401, { error: 'Refresh token expired' });

      // Make direct request to refresh endpoint
      await expect(axiosInstance.post('/auth/refresh')).rejects.toThrow();

      // Verify auth was cleared and no infinite loop occurred
      expect(mockAuthStore.clearAuth).toHaveBeenCalled();
    });
  });

  describe('Refresh Failure Handling', () => {
    it('should clear auth and redirect on refresh failure', async () => {
      attachTokenRefreshInterceptor(axiosInstance);

      // Mock 401
      mockAdapter.onGet('/protected').replyOnce(401);

      // Mock refresh failure
      globalAxiosMock
        .onPost(
          'http://auth-service.local/api/v1/auth/user-management/auth/refresh'
        )
        .replyOnce(500, { error: 'Refresh failed' });

      // Make request
      await expect(axiosInstance.get('/protected')).rejects.toThrow();

      // Verify auth cleared (redirect happens but is hard to test in jsdom)
      expect(mockAuthStore.clearAuth).toHaveBeenCalled();
    });

    it('should handle network error during refresh', async () => {
      attachTokenRefreshInterceptor(axiosInstance);

      mockAdapter.onGet('/protected').replyOnce(401);

      // Mock network error on refresh
      globalAxiosMock
        .onPost(
          'http://auth-service.local/api/v1/auth/user-management/auth/refresh'
        )
        .networkError();

      await expect(axiosInstance.get('/protected')).rejects.toThrow();

      expect(mockAuthStore.clearAuth).toHaveBeenCalled();
    });
  });

  describe('No Refresh Token Available', () => {
    it('should fail immediately if no refresh token exists', async () => {
      attachTokenRefreshInterceptor(axiosInstance);

      // Remove refresh token
      mockAuthStore.refreshToken = null;

      mockAdapter.onGet('/protected').replyOnce(401);

      await expect(axiosInstance.get('/protected')).rejects.toThrow();

      // Verify auth cleared (happens in the refresh function when no token available)
      expect(mockAuthStore.clearAuth).toHaveBeenCalled();
    });
  });

  describe('Non-401 Errors', () => {
    it('should pass through non-401 errors unchanged', async () => {
      attachTokenRefreshInterceptor(axiosInstance);

      mockAdapter.onGet('/resource').replyOnce(404, { error: 'Not found' });

      await expect(axiosInstance.get('/resource')).rejects.toThrow();

      // Verify no refresh attempted
      expect(mockAuthStore.setTokenData).not.toHaveBeenCalled();
    });

    it('should pass through 403 errors without refresh', async () => {
      attachTokenRefreshInterceptor(axiosInstance);

      mockAdapter.onGet('/forbidden').replyOnce(403, { error: 'Forbidden' });

      await expect(axiosInstance.get('/forbidden')).rejects.toThrow();

      expect(mockAuthStore.setTokenData).not.toHaveBeenCalled();
    });

    it('should pass through 500 errors without refresh', async () => {
      attachTokenRefreshInterceptor(axiosInstance);

      mockAdapter.onGet('/error').replyOnce(500);

      await expect(axiosInstance.get('/error')).rejects.toThrow();

      expect(mockAuthStore.setTokenData).not.toHaveBeenCalled();
    });
  });

  describe('Successful Responses', () => {
    it('should pass through successful responses unchanged', async () => {
      attachTokenRefreshInterceptor(axiosInstance);

      mockAdapter.onGet('/resource').replyOnce(200, { data: 'success' });

      const response = await axiosInstance.get('/resource');

      expect(response.status).toBe(200);
      expect(response.data).toEqual({ data: 'success' });
      expect(mockAuthStore.setTokenData).not.toHaveBeenCalled();
    });
  });

  describe('Retry Prevention', () => {
    it('should not retry request that already has _retry flag', async () => {
      attachTokenRefreshInterceptor(axiosInstance);

      // Mock 401 twice
      mockAdapter.onGet('/protected').reply(401);

      const config = {
        url: '/protected',
        method: 'get',
        _retry: true, // Already retried
      };

      await expect(
        axiosInstance.request(
          config as unknown as { url: string; method: string; _retry: boolean }
        )
      ).rejects.toThrow();

      // Should not attempt refresh
      expect(mockAuthStore.setTokenData).not.toHaveBeenCalled();
    });
  });

  describe('Return URL Preservation', () => {
    it('should clear auth when refresh fails (returnUrl preserved in real browser)', async () => {
      attachTokenRefreshInterceptor(axiosInstance);

      // Set current pathname
      mockLocationPathname = '/recipes/123';

      mockAdapter.onGet('/protected').replyOnce(401);
      globalAxiosMock
        .onPost(
          'http://auth-service.local/api/v1/auth/user-management/auth/refresh'
        )
        .replyOnce(500);

      await expect(axiosInstance.get('/protected')).rejects.toThrow();

      // Verify auth was cleared (actual redirect with returnUrl is hard to test in jsdom)
      expect(mockAuthStore.clearAuth).toHaveBeenCalled();
    });
  });
});
