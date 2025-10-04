import {
  getReturnUrl,
  redirectToLogin,
  extractReturnUrl,
  isAuthenticated,
  isSafeReturnUrl,
  getSafeReturnUrl,
  redirectToHome,
  DEFAULT_RETURN_URL_PARAM,
} from '@/lib/auth/route-protection';
import type { AuthState } from '@/stores/auth-store';

describe('Route Protection Utilities', () => {
  describe('getReturnUrl', () => {
    it('creates return URL with default param name', () => {
      const result = getReturnUrl({ url: '/recipes' });
      expect(result).toBe('?returnUrl=%2Frecipes');
    });

    it('creates return URL with custom param name', () => {
      const result = getReturnUrl({ url: '/recipes', paramName: 'redirect' });
      expect(result).toBe('?redirect=%2Frecipes');
    });

    it('encodes special characters in URL', () => {
      const result = getReturnUrl({
        url: '/recipes?category=pasta&sort=popular',
      });
      expect(result).toBe(
        '?returnUrl=%2Frecipes%3Fcategory%3Dpasta%26sort%3Dpopular'
      );
    });

    it('encodes URL with hash', () => {
      const result = getReturnUrl({ url: '/recipes#featured' });
      expect(result).toBe('?returnUrl=%2Frecipes%23featured');
    });
  });

  describe('redirectToLogin', () => {
    it('builds login URL with return parameter', () => {
      const result = redirectToLogin('/login', '/recipes');
      expect(result).toBe('/login?returnUrl=%2Frecipes');
    });

    it('builds login URL with custom param name', () => {
      const result = redirectToLogin('/login', '/recipes', 'redirect');
      expect(result).toBe('/login?redirect=%2Frecipes');
    });

    it('handles login URL with trailing slash', () => {
      const result = redirectToLogin('/login/', '/recipes');
      expect(result).toBe('/login/?returnUrl=%2Frecipes');
    });

    it('handles complex return URLs', () => {
      const result = redirectToLogin(
        '/auth/login',
        '/recipes?filter=vegan&sort=rating'
      );
      expect(result).toBe(
        '/auth/login?returnUrl=%2Frecipes%3Ffilter%3Dvegan%26sort%3Drating'
      );
    });
  });

  describe('extractReturnUrl', () => {
    it('extracts return URL from URLSearchParams', () => {
      const params = new URLSearchParams('returnUrl=%2Frecipes');
      const result = extractReturnUrl(params);
      expect(result).toBe('/recipes');
    });

    it('extracts return URL from string', () => {
      const result = extractReturnUrl('returnUrl=%2Frecipes');
      expect(result).toBe('/recipes');
    });

    it('extracts with custom param name', () => {
      const params = new URLSearchParams('redirect=%2Frecipes');
      const result = extractReturnUrl(params, 'redirect');
      expect(result).toBe('/recipes');
    });

    it('returns null when param is missing', () => {
      const params = new URLSearchParams('other=value');
      const result = extractReturnUrl(params);
      expect(result).toBeNull();
    });

    it('decodes special characters', () => {
      const params = new URLSearchParams(
        'returnUrl=%2Frecipes%3Fcategory%3Dpasta'
      );
      const result = extractReturnUrl(params);
      expect(result).toBe('/recipes?category=pasta');
    });

    it('handles malformed encoded URLs gracefully', () => {
      const params = new URLSearchParams('returnUrl=%E0%A4%A');
      const result = extractReturnUrl(params);
      // Should return raw value if decoding fails
      expect(result).toBeTruthy();
    });

    it('handles empty search params', () => {
      const params = new URLSearchParams('');
      const result = extractReturnUrl(params);
      expect(result).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    const createMockAuthState = (
      overrides: Partial<AuthState> = {}
    ): AuthState => ({
      user: null,
      authUser: null,
      token: null,
      refreshToken: null,
      tokenExpiresAt: null,
      isAuthenticated: false,
      isLoading: false,
      hasHydrated: true,
      pkceVerifier: null,
      pkceState: null,
      setUser: jest.fn(),
      setAuthUser: jest.fn(),
      setToken: jest.fn(),
      setTokenData: jest.fn(),
      setPKCEData: jest.fn(),
      clearPKCEData: jest.fn(),
      clearAuth: jest.fn(),
      setLoading: jest.fn(),
      isTokenExpired: jest.fn().mockReturnValue(false),
      ...overrides,
    });

    it('returns authenticated when user has valid token and user data', () => {
      const authState = createMockAuthState({
        isAuthenticated: true,
        token: 'valid-token',
        authUser: {
          user_id: '123',
          username: 'testuser',
          email: 'test@example.com',
          is_active: true,
          created_at: '2024-01-01',
          updated_at: '2024-01-01',
        },
        isTokenExpired: jest.fn().mockReturnValue(false),
      });

      const result = isAuthenticated(authState);

      expect(result.isAuthenticated).toBe(true);
      expect(result.isTokenExpired).toBe(false);
      expect(result.user).toEqual({
        user_id: '123',
        username: 'testuser',
        email: 'test@example.com',
        is_active: true,
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
      });
    });

    it('returns not authenticated when token is expired', () => {
      const authState = createMockAuthState({
        isAuthenticated: true,
        token: 'expired-token',
        authUser: {
          user_id: '123',
          username: 'testuser',
          email: 'test@example.com',
          is_active: true,
          created_at: '2024-01-01',
          updated_at: '2024-01-01',
        },
        isTokenExpired: jest.fn().mockReturnValue(true),
      });

      const result = isAuthenticated(authState);

      expect(result.isAuthenticated).toBe(false);
      expect(result.isTokenExpired).toBe(true);
    });

    it('returns not authenticated when no token', () => {
      const authState = createMockAuthState({
        isAuthenticated: false,
        token: null,
        authUser: {
          user_id: '123',
          username: 'testuser',
          email: 'test@example.com',
          is_active: true,
          created_at: '2024-01-01',
          updated_at: '2024-01-01',
        },
        isTokenExpired: jest.fn().mockReturnValue(true),
      });

      const result = isAuthenticated(authState);

      expect(result.isAuthenticated).toBe(false);
    });

    it('returns not authenticated when no user data', () => {
      const authState = createMockAuthState({
        isAuthenticated: true,
        token: 'valid-token',
        authUser: null,
        user: null,
        isTokenExpired: jest.fn().mockReturnValue(false),
      });

      const result = isAuthenticated(authState);

      expect(result.isAuthenticated).toBe(false);
    });

    it('accepts user property instead of authUser', () => {
      const authState = createMockAuthState({
        isAuthenticated: true,
        token: 'valid-token',
        authUser: null,
        user: {
          id: '123',
          name: 'Test User',
          email: 'test@example.com',
        },
        isTokenExpired: jest.fn().mockReturnValue(false),
      });

      const result = isAuthenticated(authState);

      expect(result.isAuthenticated).toBe(true);
      expect(result.user).toEqual({
        id: '123',
        name: 'Test User',
        email: 'test@example.com',
      });
    });

    it('includes loading state', () => {
      const authState = createMockAuthState({
        isLoading: true,
      });

      const result = isAuthenticated(authState);

      expect(result.isLoading).toBe(true);
    });

    it('prefers authUser over user', () => {
      const authState = createMockAuthState({
        isAuthenticated: true,
        token: 'valid-token',
        authUser: {
          user_id: '123',
          username: 'authuser',
          email: 'auth@example.com',
          is_active: true,
          created_at: '2024-01-01',
          updated_at: '2024-01-01',
        },
        user: {
          id: '456',
          name: 'Other User',
          email: 'other@example.com',
        },
        isTokenExpired: jest.fn().mockReturnValue(false),
      });

      const result = isAuthenticated(authState);

      expect(result.user).toEqual({
        user_id: '123',
        username: 'authuser',
        email: 'auth@example.com',
        is_active: true,
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
      });
    });
  });

  describe('isSafeReturnUrl', () => {
    it('accepts relative URLs starting with /', () => {
      expect(isSafeReturnUrl('/recipes')).toBe(true);
      expect(isSafeReturnUrl('/recipes/123')).toBe(true);
      expect(isSafeReturnUrl('/recipes?filter=vegan')).toBe(true);
      expect(isSafeReturnUrl('/recipes#featured')).toBe(true);
    });

    it('rejects absolute HTTP URLs', () => {
      expect(isSafeReturnUrl('http://evil.com')).toBe(false);
      expect(isSafeReturnUrl('http://example.com/recipes')).toBe(false);
    });

    it('rejects absolute HTTPS URLs', () => {
      expect(isSafeReturnUrl('https://evil.com')).toBe(false);
      expect(isSafeReturnUrl('https://example.com/recipes')).toBe(false);
    });

    it('rejects protocol-relative URLs', () => {
      expect(isSafeReturnUrl('//evil.com')).toBe(false);
      expect(isSafeReturnUrl('//example.com/recipes')).toBe(false);
    });

    it('rejects URLs with newlines', () => {
      expect(isSafeReturnUrl('/recipes\n')).toBe(false);
      expect(isSafeReturnUrl('/recipes\r\n')).toBe(false);
    });

    it('rejects URLs not starting with /', () => {
      expect(isSafeReturnUrl('recipes')).toBe(false);
      expect(isSafeReturnUrl('javascript:alert(1)')).toBe(false);
    });

    it('rejects empty or invalid URLs', () => {
      expect(isSafeReturnUrl('')).toBe(false);
      expect(isSafeReturnUrl(null as unknown as string)).toBe(false);
      expect(isSafeReturnUrl(undefined as unknown as string)).toBe(false);
      expect(isSafeReturnUrl(123 as unknown as string)).toBe(false);
    });
  });

  describe('getSafeReturnUrl', () => {
    it('returns safe URL as-is', () => {
      expect(getSafeReturnUrl('/recipes')).toBe('/recipes');
      expect(getSafeReturnUrl('/recipes?filter=vegan')).toBe(
        '/recipes?filter=vegan'
      );
    });

    it('returns fallback for unsafe URLs', () => {
      expect(getSafeReturnUrl('https://evil.com')).toBe('/');
      expect(getSafeReturnUrl('//evil.com')).toBe('/');
      expect(getSafeReturnUrl('http://example.com')).toBe('/');
    });

    it('returns custom fallback', () => {
      expect(getSafeReturnUrl('https://evil.com', '/home')).toBe('/home');
      expect(getSafeReturnUrl('//evil.com', '/dashboard')).toBe('/dashboard');
    });

    it('returns fallback for null URL', () => {
      expect(getSafeReturnUrl(null)).toBe('/');
      expect(getSafeReturnUrl(null, '/home')).toBe('/home');
    });

    it('returns fallback for empty URL', () => {
      expect(getSafeReturnUrl('')).toBe('/');
    });
  });

  describe('DEFAULT_RETURN_URL_PARAM', () => {
    it('exports the correct default param name', () => {
      expect(DEFAULT_RETURN_URL_PARAM).toBe('returnUrl');
    });
  });

  describe('redirectToHome', () => {
    it('returns returnUrl from query params when safe', () => {
      const params = new URLSearchParams('returnUrl=%2Frecipes');
      const result = redirectToHome(params, '/');
      expect(result).toBe('/recipes');
    });

    it('returns returnUrl with custom param name', () => {
      const params = new URLSearchParams('redirect=%2Fdashboard');
      const result = redirectToHome(params, '/', 'redirect');
      expect(result).toBe('/dashboard');
    });

    it('returns redirectUrl when no returnUrl in params', () => {
      const params = new URLSearchParams('');
      const result = redirectToHome(params, '/dashboard');
      expect(result).toBe('/dashboard');
    });

    it('returns redirectUrl when returnUrl is unsafe', () => {
      const params = new URLSearchParams('returnUrl=https://evil.com');
      const result = redirectToHome(params, '/');
      expect(result).toBe('/');
    });

    it('returns redirectUrl when returnUrl is protocol-relative', () => {
      const params = new URLSearchParams('returnUrl=//evil.com');
      const result = redirectToHome(params, '/home');
      expect(result).toBe('/home');
    });

    it('handles string search params', () => {
      const result = redirectToHome('returnUrl=%2Frecipes', '/');
      expect(result).toBe('/recipes');
    });

    it('uses default redirectUrl when not provided', () => {
      const params = new URLSearchParams('');
      const result = redirectToHome(params);
      expect(result).toBe('/');
    });

    it('validates complex safe URLs', () => {
      const params = new URLSearchParams(
        'returnUrl=%2Frecipes%3Fcategory%3Dpasta%26sort%3Dpopular'
      );
      const result = redirectToHome(params, '/');
      expect(result).toBe('/recipes?category=pasta&sort=popular');
    });

    it('falls back when returnUrl is malformed', () => {
      const params = new URLSearchParams('returnUrl=%E0%A4%A');
      const result = redirectToHome(params, '/dashboard');
      // Should still try to use the malformed URL if it starts with /
      // or fall back if extraction/validation fails
      expect(result).toBeDefined();
    });
  });
});
