// Mock Next.js server utilities
jest.mock('next/server', () => {
  const createMockResponse = () => {
    const headers = new Map<string, string>();
    return {
      headers: {
        has: (name: string) => headers.has(name),
        set: (name: string, value: string) => {
          headers.set(name, value);
          return headers;
        },
        get: (name: string) => headers.get(name),
      },
    };
  };

  return {
    NextRequest: jest.fn(),
    NextResponse: {
      next: jest.fn(createMockResponse),
      redirect: jest.fn((url: URL | string, init?: { status?: number }) => {
        const headers = new Map<string, string>();
        return {
          url: typeof url === 'string' ? url : url.toString(),
          status: init?.status ?? 307,
          headers: {
            has: (name: string) => headers.has(name),
            set: (name: string, value: string) => {
              headers.set(name, value);
              return headers;
            },
            get: (name: string) => headers.get(name),
          },
        };
      }),
    },
  };
});

import { NextRequest, NextResponse } from 'next/server';
import {
  getAuthTokenFromCookies,
  getTokenExpiresAt,
  isTokenExpired,
  isAuthenticatedMiddleware,
  buildLoginRedirect,
  buildHomeRedirect,
  validateReturnUrl,
  continueRequest,
} from '@/lib/middleware/auth';
import { AUTH_COOKIE_NAMES } from '@/constants/routes';

describe('Middleware Auth Utilities', () => {
  beforeAll(() => {
    // Ensure mock implementations persist
    (NextResponse.next as jest.Mock).mockImplementation(() => {
      const headers = new Map<string, string>();
      return {
        headers: {
          has: (name: string) => headers.has(name),
          set: (name: string, value: string) => {
            headers.set(name, value);
            return headers;
          },
          get: (name: string) => headers.get(name),
        },
      };
    });
  });

  describe('getAuthTokenFromCookies', () => {
    it('returns token when present in cookies', () => {
      const mockRequest = {
        cookies: {
          get: jest.fn((name: string) => {
            if (name === AUTH_COOKIE_NAMES.TOKEN) {
              return { value: 'test-token-123' };
            }
            return undefined;
          }),
        },
      } as unknown as NextRequest;

      const result = getAuthTokenFromCookies(mockRequest);
      expect(result).toBe('test-token-123');
    });

    it('returns null when token is not present', () => {
      const mockRequest = {
        cookies: {
          get: jest.fn(() => undefined),
        },
      } as unknown as NextRequest;

      const result = getAuthTokenFromCookies(mockRequest);
      expect(result).toBeNull();
    });
  });

  describe('getTokenExpiresAt', () => {
    it('returns expiration timestamp when present', () => {
      const expiresAt = Date.now() + 3600000;
      const mockRequest = {
        cookies: {
          get: jest.fn((name: string) => {
            if (name === AUTH_COOKIE_NAMES.EXPIRES_AT) {
              return { value: String(expiresAt) };
            }
            return undefined;
          }),
        },
      } as unknown as NextRequest;

      const result = getTokenExpiresAt(mockRequest);
      expect(result).toBe(expiresAt);
    });

    it('returns null when expiration is not present', () => {
      const mockRequest = {
        cookies: {
          get: jest.fn(() => undefined),
        },
      } as unknown as NextRequest;

      const result = getTokenExpiresAt(mockRequest);
      expect(result).toBeNull();
    });
  });

  describe('isTokenExpired', () => {
    it('returns true when expiresAt is null', () => {
      expect(isTokenExpired(null)).toBe(true);
    });

    it('returns true when token is expired', () => {
      const pastTime = Date.now() - 1000;
      expect(isTokenExpired(pastTime)).toBe(true);
    });

    it('returns false when token is valid', () => {
      const futureTime = Date.now() + 3600000; // 1 hour from now
      expect(isTokenExpired(futureTime)).toBe(false);
    });

    it('returns true when token expires within 5 minute buffer', () => {
      const nearExpiry = Date.now() + 4 * 60 * 1000; // 4 minutes from now
      expect(isTokenExpired(nearExpiry)).toBe(true);
    });

    it('returns false when token is beyond 5 minute buffer', () => {
      const safeTime = Date.now() + 6 * 60 * 1000; // 6 minutes from now
      expect(isTokenExpired(safeTime)).toBe(false);
    });
  });

  describe('isAuthenticatedMiddleware', () => {
    it('returns true when token exists and is not expired', () => {
      const futureTime = Date.now() + 3600000;
      const mockRequest = {
        cookies: {
          get: jest.fn((name: string) => {
            if (name === AUTH_COOKIE_NAMES.TOKEN) {
              return { value: 'valid-token' };
            }
            if (name === AUTH_COOKIE_NAMES.EXPIRES_AT) {
              return { value: String(futureTime) };
            }
            return undefined;
          }),
        },
      } as unknown as NextRequest;

      const result = isAuthenticatedMiddleware(mockRequest);
      expect(result).toBe(true);
    });

    it('returns false when token is missing', () => {
      const mockRequest = {
        cookies: {
          get: jest.fn(() => undefined),
        },
      } as unknown as NextRequest;

      const result = isAuthenticatedMiddleware(mockRequest);
      expect(result).toBe(false);
    });

    it('returns false when token is expired', () => {
      const pastTime = Date.now() - 1000;
      const mockRequest = {
        cookies: {
          get: jest.fn((name: string) => {
            if (name === AUTH_COOKIE_NAMES.TOKEN) {
              return { value: 'expired-token' };
            }
            if (name === AUTH_COOKIE_NAMES.EXPIRES_AT) {
              return { value: String(pastTime) };
            }
            return undefined;
          }),
        },
      } as unknown as NextRequest;

      const result = isAuthenticatedMiddleware(mockRequest);
      expect(result).toBe(false);
    });
  });

  describe('buildLoginRedirect', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('builds redirect with return URL from pathname', () => {
      const mockRequest = {
        url: 'http://localhost:3000/recipes',
        nextUrl: {
          pathname: '/recipes',
          search: '',
        },
      } as unknown as NextRequest;

      buildLoginRedirect(mockRequest);

      expect(NextResponse.redirect).toHaveBeenCalled();
      const redirectCall = (NextResponse.redirect as jest.Mock).mock.calls[0];
      const redirectUrl = redirectCall[0] as URL;
      const options = redirectCall[1];

      expect(redirectUrl.pathname).toBe('/login');
      expect(redirectUrl.searchParams.get('returnUrl')).toBe('/recipes');
      expect(options).toEqual({ status: 307 });
    });

    it('includes query string in return URL', () => {
      const mockRequest = {
        url: 'http://localhost:3000/recipes?category=pasta',
        nextUrl: {
          pathname: '/recipes',
          search: '?category=pasta',
        },
      } as unknown as NextRequest;

      buildLoginRedirect(mockRequest);

      const redirectCall = (NextResponse.redirect as jest.Mock).mock.calls[0];
      const redirectUrl = redirectCall[0] as URL;

      expect(redirectUrl.searchParams.get('returnUrl')).toBe(
        '/recipes?category=pasta'
      );
    });

    it('uses custom login URL when provided', () => {
      const mockRequest = {
        url: 'http://localhost:3000/recipes',
        nextUrl: {
          pathname: '/recipes',
          search: '',
        },
      } as unknown as NextRequest;

      buildLoginRedirect(mockRequest, '/auth/login');

      const redirectCall = (NextResponse.redirect as jest.Mock).mock.calls[0];
      const redirectUrl = redirectCall[0] as URL;

      expect(redirectUrl.pathname).toBe('/auth/login');
    });
  });

  describe('buildHomeRedirect', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('redirects to default URL when no returnUrl in params', () => {
      const mockRequest = {
        url: 'http://localhost:3000/login',
        nextUrl: {
          searchParams: new URLSearchParams(''),
        },
      } as unknown as NextRequest;

      buildHomeRedirect(mockRequest);

      expect(NextResponse.redirect).toHaveBeenCalled();
      const redirectCall = (NextResponse.redirect as jest.Mock).mock.calls[0];
      const redirectUrl = redirectCall[0] as URL;
      const options = redirectCall[1];

      expect(redirectUrl.pathname).toBe('/');
      expect(options).toEqual({ status: 307 });
    });

    it('uses safe returnUrl from query params', () => {
      const mockRequest = {
        url: 'http://localhost:3000/login',
        nextUrl: {
          searchParams: new URLSearchParams('returnUrl=%2Frecipes'),
        },
      } as unknown as NextRequest;

      buildHomeRedirect(mockRequest);

      const redirectCall = (NextResponse.redirect as jest.Mock).mock.calls[0];
      const redirectUrl = redirectCall[0] as URL;

      expect(redirectUrl.pathname).toBe('/recipes');
    });

    it('rejects unsafe returnUrl and uses default', () => {
      const mockRequest = {
        url: 'http://localhost:3000/login',
        nextUrl: {
          searchParams: new URLSearchParams('returnUrl=https://evil.com'),
        },
      } as unknown as NextRequest;

      buildHomeRedirect(mockRequest);

      const redirectCall = (NextResponse.redirect as jest.Mock).mock.calls[0];
      const redirectUrl = redirectCall[0] as URL;

      expect(redirectUrl.pathname).toBe('/');
      expect(redirectUrl.toString()).not.toContain('evil.com');
    });

    it('uses custom redirect URL when provided', () => {
      const mockRequest = {
        url: 'http://localhost:3000/login',
        nextUrl: {
          searchParams: new URLSearchParams(''),
        },
      } as unknown as NextRequest;

      buildHomeRedirect(mockRequest, '/dashboard');

      const redirectCall = (NextResponse.redirect as jest.Mock).mock.calls[0];
      const redirectUrl = redirectCall[0] as URL;

      expect(redirectUrl.pathname).toBe('/dashboard');
    });
  });

  describe('validateReturnUrl', () => {
    it('accepts safe relative URLs', () => {
      expect(validateReturnUrl('/recipes')).toBe('/recipes');
      expect(validateReturnUrl('/recipes?category=pasta')).toBe(
        '/recipes?category=pasta'
      );
      expect(validateReturnUrl('/recipes#featured')).toBe('/recipes#featured');
    });

    it('rejects absolute HTTP URLs', () => {
      expect(validateReturnUrl('http://evil.com')).toBeNull();
      expect(validateReturnUrl('http://example.com/recipes')).toBeNull();
    });

    it('rejects absolute HTTPS URLs', () => {
      expect(validateReturnUrl('https://evil.com')).toBeNull();
      expect(validateReturnUrl('https://example.com/recipes')).toBeNull();
    });

    it('rejects protocol-relative URLs', () => {
      expect(validateReturnUrl('//evil.com')).toBeNull();
      expect(validateReturnUrl('//example.com/recipes')).toBeNull();
    });

    it('rejects URLs with newlines', () => {
      expect(validateReturnUrl('/recipes\n')).toBeNull();
      expect(validateReturnUrl('/recipes\r\n')).toBeNull();
    });

    it('rejects URLs not starting with /', () => {
      expect(validateReturnUrl('recipes')).toBeNull();
      expect(validateReturnUrl('javascript:alert(1)')).toBeNull();
    });

    it('rejects null or invalid input', () => {
      expect(validateReturnUrl(null)).toBeNull();
      expect(validateReturnUrl('')).toBeNull();
    });
  });

  describe('continueRequest', () => {
    it('returns NextResponse with security headers', () => {
      // Re-set the mock implementation before this test
      (NextResponse.next as jest.Mock).mockImplementationOnce(() => {
        const headers = new Map<string, string>();
        return {
          headers: {
            has: (name: string) => headers.has(name),
            set: (name: string, value: string) => {
              headers.set(name, value);
              return headers;
            },
            get: (name: string) => headers.get(name),
          },
        };
      });

      const mockRequest = {
        url: 'http://localhost:3000/recipes',
      } as unknown as NextRequest;

      const result = continueRequest(mockRequest);

      expect(result).toBeDefined();
      expect(NextResponse.next).toHaveBeenCalled();
      expect(result.headers).toBeDefined();
      expect(result.headers.has).toBeDefined();
      expect(result.headers.set).toBeDefined();
    });
  });
});
