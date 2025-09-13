import { useAuthStore } from '@/stores/auth-store';
import { renderHook, act } from '@testing-library/react';
import type { User as AuthUser, Token } from '@/types/auth';
import type { AuthorizedUser } from '@/types';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
});

describe('Auth Store', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the store state
    useAuthStore.getState().clearAuth();
  });

  const mockAuthUser: AuthUser = {
    user_id: '123',
    username: 'testuser',
    email: 'test@example.com',
    full_name: 'Test User',
    is_active: true,
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z',
  };

  const mockUser: AuthorizedUser = {
    id: '123',
    email: 'test@example.com',
    name: 'Test User',
  };

  const mockToken: Token = {
    access_token: 'mock-access-token',
    refresh_token: 'mock-refresh-token',
    token_type: 'Bearer',
    expires_in: 3600,
  };

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useAuthStore());
      const state = result.current;

      expect(state.user).toBeNull();
      expect(state.authUser).toBeNull();
      expect(state.token).toBeNull();
      expect(state.refreshToken).toBeNull();
      expect(state.tokenExpiresAt).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
      expect(state.pkceVerifier).toBeNull();
      expect(state.pkceState).toBeNull();
    });
  });

  describe('setUser', () => {
    it('should set user and mark as authenticated', () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.setUser(mockUser);
      });

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
    });
  });

  describe('setAuthUser', () => {
    it('should set auth user and mark as authenticated', () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.setAuthUser(mockAuthUser);
      });

      expect(result.current.authUser).toEqual(mockAuthUser);
      expect(result.current.isAuthenticated).toBe(true);
    });
  });

  describe('setToken', () => {
    it('should set token with default expiration and store in localStorage', () => {
      const { result } = renderHook(() => useAuthStore());
      const mockNow = 1000000;
      jest.spyOn(Date, 'now').mockReturnValue(mockNow);

      act(() => {
        result.current.setToken('test-token');
      });

      expect(result.current.token).toBe('test-token');
      expect(result.current.tokenExpiresAt).toBe(mockNow + 60 * 60 * 1000);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'authToken',
        'test-token'
      );

      jest.restoreAllMocks();
    });
  });

  describe('setTokenData', () => {
    it('should set token data and calculate expiration', () => {
      const { result } = renderHook(() => useAuthStore());
      const beforeTime = Date.now();

      act(() => {
        result.current.setTokenData(mockToken);
      });

      const afterTime = Date.now();

      expect(result.current.token).toBe(mockToken.access_token);
      expect(result.current.refreshToken).toBe(mockToken.refresh_token);
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.tokenExpiresAt).toBeGreaterThanOrEqual(
        beforeTime + 3600 * 1000
      );
      expect(result.current.tokenExpiresAt).toBeLessThanOrEqual(
        afterTime + 3600 * 1000
      );

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'authToken',
        mockToken.access_token
      );
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'refreshToken',
        mockToken.refresh_token
      );
    });

    it('should handle token without refresh token', () => {
      const { result } = renderHook(() => useAuthStore());
      const tokenWithoutRefresh = { ...mockToken, refresh_token: undefined };

      act(() => {
        result.current.setTokenData(tokenWithoutRefresh);
      });

      expect(result.current.token).toBe(tokenWithoutRefresh.access_token);
      expect(result.current.refreshToken).toBeNull();
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'authToken',
        tokenWithoutRefresh.access_token
      );
      expect(localStorageMock.setItem).not.toHaveBeenCalledWith(
        'refreshToken',
        expect.anything()
      );
    });
  });

  describe('setPKCEData', () => {
    it('should set PKCE data in store and sessionStorage', () => {
      const { result } = renderHook(() => useAuthStore());
      const verifier = 'mock-verifier';
      const state = 'mock-state';

      act(() => {
        result.current.setPKCEData(verifier, state);
      });

      expect(result.current.pkceVerifier).toBe(verifier);
      expect(result.current.pkceState).toBe(state);
      expect(sessionStorageMock.setItem).toHaveBeenCalledWith(
        'pkceVerifier',
        verifier
      );
      expect(sessionStorageMock.setItem).toHaveBeenCalledWith(
        'pkceState',
        state
      );
    });
  });

  describe('clearPKCEData', () => {
    it('should clear PKCE data from store and sessionStorage', () => {
      const { result } = renderHook(() => useAuthStore());

      // First set some data
      act(() => {
        result.current.setPKCEData('verifier', 'state');
      });

      // Then clear it
      act(() => {
        result.current.clearPKCEData();
      });

      expect(result.current.pkceVerifier).toBeNull();
      expect(result.current.pkceState).toBeNull();
      expect(sessionStorageMock.removeItem).toHaveBeenCalledWith(
        'pkceVerifier'
      );
      expect(sessionStorageMock.removeItem).toHaveBeenCalledWith('pkceState');
    });
  });

  describe('clearAuth', () => {
    it('should clear all auth data', () => {
      const { result } = renderHook(() => useAuthStore());

      // First set some data
      act(() => {
        result.current.setAuthUser(mockAuthUser);
        result.current.setTokenData(mockToken);
      });

      // Then clear it
      act(() => {
        result.current.clearAuth();
      });

      expect(result.current.user).toBeNull();
      expect(result.current.authUser).toBeNull();
      expect(result.current.token).toBeNull();
      expect(result.current.refreshToken).toBeNull();
      expect(result.current.tokenExpiresAt).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('authToken');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('refreshToken');
    });
  });

  describe('isTokenExpired', () => {
    it('should return true when no expiration time is set', () => {
      const { result } = renderHook(() => useAuthStore());

      expect(result.current.isTokenExpired()).toBe(true);
    });

    it('should return true when token is expired', () => {
      const { result } = renderHook(() => useAuthStore());
      const pastTime = Date.now() - 1000; // 1 second ago

      act(() => {
        result.current.setTokenData({
          ...mockToken,
          expires_in: -10, // Expired 10 seconds ago
        });
      });

      expect(result.current.isTokenExpired()).toBe(true);
    });

    it('should return false when token is still valid', () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.setTokenData({
          ...mockToken,
          expires_in: 3600, // Valid for 1 hour
        });
      });

      expect(result.current.isTokenExpired()).toBe(false);
    });

    it('should return true when token expires within 5-minute buffer', () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.setTokenData({
          ...mockToken,
          expires_in: 240, // 4 minutes (less than 5-minute buffer)
        });
      });

      expect(result.current.isTokenExpired()).toBe(true);
    });
  });

  describe('setLoading', () => {
    it('should set loading state', () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.setLoading(true);
      });

      expect(result.current.isLoading).toBe(true);

      act(() => {
        result.current.setLoading(false);
      });

      expect(result.current.isLoading).toBe(false);
    });
  });
});
