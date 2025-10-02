// Mock security logging
jest.mock('@/lib/middleware/security-log');

// Mock Next.js server runtime
jest.mock('next/server', () => {
  const mockRedirect = jest.fn(
    (url: URL | string, init?: { status?: number }) => {
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
    }
  );

  return {
    NextRequest: jest.fn(),
    NextResponse: {
      redirect: mockRedirect,
    },
  };
});

import { NextRequest } from 'next/server';
import {
  getUserRoleFromCookies,
  hasAdminRole,
  hasRole,
  buildUnauthorizedRedirect,
  checkAdminAccess,
  getUserIdFromCookies,
} from '@/lib/middleware/role';
import { UserRole } from '@/types/auth/role-guard';
import { AUTH_COOKIE_NAMES } from '@/constants/routes';
import * as securityLog from '@/lib/middleware/security-log';

describe('Middleware Role Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserRoleFromCookies', () => {
    it('returns user role when present in cookies', () => {
      const mockRequest = {
        cookies: {
          get: jest.fn((name: string) => {
            if (name === AUTH_COOKIE_NAMES.ROLE) {
              return { value: 'ADMIN' };
            }
            return undefined;
          }),
        },
      } as unknown as NextRequest;

      const result = getUserRoleFromCookies(mockRequest);
      expect(result).toBe('ADMIN');
    });

    it('returns null when role is not present', () => {
      const mockRequest = {
        cookies: {
          get: jest.fn(() => undefined),
        },
      } as unknown as NextRequest;

      const result = getUserRoleFromCookies(mockRequest);
      expect(result).toBeNull();
    });
  });

  describe('hasAdminRole', () => {
    it('returns true when role is ADMIN', () => {
      expect(hasAdminRole('ADMIN')).toBe(true);
    });

    it('returns false when role is USER', () => {
      expect(hasAdminRole('USER')).toBe(false);
    });

    it('returns false when role is null', () => {
      expect(hasAdminRole(null)).toBe(false);
    });

    it('returns false when role is empty string', () => {
      expect(hasAdminRole('')).toBe(false);
    });

    it('is case-sensitive', () => {
      expect(hasAdminRole('admin')).toBe(false);
      expect(hasAdminRole('Admin')).toBe(false);
    });
  });

  describe('hasRole', () => {
    it('returns true when user role matches required role', () => {
      expect(hasRole('ADMIN', UserRole.ADMIN)).toBe(true);
      expect(hasRole('USER', UserRole.USER)).toBe(true);
    });

    it('returns false when user role does not match required role', () => {
      expect(hasRole('USER', UserRole.ADMIN)).toBe(false);
      expect(hasRole('ADMIN', UserRole.USER)).toBe(false);
    });

    it('returns false when user role is null', () => {
      expect(hasRole(null, UserRole.ADMIN)).toBe(false);
      expect(hasRole(null, UserRole.USER)).toBe(false);
    });

    it('returns false when user role is empty string', () => {
      expect(hasRole('', UserRole.ADMIN)).toBe(false);
    });
  });

  describe('buildUnauthorizedRedirect', () => {
    it('builds redirect to default forbidden URL', () => {
      const mockRequest = {
        url: 'http://localhost:3000/admin/users',
        nextUrl: {
          pathname: '/admin/users',
        },
      } as unknown as NextRequest;

      buildUnauthorizedRedirect(mockRequest);

      // Import NextResponse from the mocked module
      const { NextResponse } = jest.requireMock('next/server');
      expect(NextResponse.redirect).toHaveBeenCalled();
      const call = (NextResponse.redirect as jest.Mock).mock.calls[0];
      const redirectedUrl = call[0];
      const status = call[1]?.status;

      expect(redirectedUrl.toString()).toContain('/403');
      expect(status).toBe(307);
    });

    it('builds redirect to custom forbidden URL when provided', () => {
      const mockRequest = {
        url: 'http://localhost:3000/admin',
        nextUrl: {
          pathname: '/admin',
        },
      } as unknown as NextRequest;

      const { NextResponse } = jest.requireMock('next/server');
      (NextResponse.redirect as jest.Mock).mockClear(); // Clear previous calls

      buildUnauthorizedRedirect(mockRequest, '/unauthorized');

      expect(NextResponse.redirect).toHaveBeenCalledTimes(1);
      const call = (NextResponse.redirect as jest.Mock).mock.calls[0];
      const redirectedUrl = call[0];
      const status = call[1]?.status;

      expect(redirectedUrl.toString()).toContain('/unauthorized');
      expect(status).toBe(307);
    });
  });

  describe('checkAdminAccess', () => {
    it('returns null when user has ADMIN role', () => {
      const mockRequest = {
        url: 'http://localhost:3000/admin',
        nextUrl: {
          pathname: '/admin',
        },
        headers: {
          get: jest.fn().mockReturnValue(null),
        },
        ip: null,
      } as unknown as NextRequest;

      const result = checkAdminAccess(mockRequest, 'ADMIN');

      expect(result).toBeNull();
      expect(securityLog.logUnauthorizedAccess).not.toHaveBeenCalled();
    });

    it('returns redirect and logs when user does not have ADMIN role', () => {
      const mockRequest = {
        url: 'http://localhost:3000/admin/settings',
        nextUrl: {
          pathname: '/admin/settings',
        },
        headers: {
          get: jest.fn().mockReturnValue(null),
        },
        ip: '192.168.1.100',
      } as unknown as NextRequest;

      checkAdminAccess(mockRequest, 'USER', 'user-123');

      const { NextResponse } = jest.requireMock('next/server');
      expect(NextResponse.redirect).toHaveBeenCalled();
      expect(securityLog.logUnauthorizedAccess).toHaveBeenCalledWith(
        mockRequest,
        'USER',
        UserRole.ADMIN,
        'user-123'
      );
    });

    it('returns redirect and logs when user role is null', () => {
      const mockRequest = {
        url: 'http://localhost:3000/admin',
        nextUrl: {
          pathname: '/admin',
        },
        headers: {
          get: jest.fn().mockReturnValue(null),
        },
        ip: null,
      } as unknown as NextRequest;

      checkAdminAccess(mockRequest, null);

      const { NextResponse } = jest.requireMock('next/server');
      expect(NextResponse.redirect).toHaveBeenCalled();
      expect(securityLog.logUnauthorizedAccess).toHaveBeenCalledWith(
        mockRequest,
        null,
        UserRole.ADMIN,
        undefined
      );
    });

    it('logs without userId when not provided', () => {
      const mockRequest = {
        url: 'http://localhost:3000/admin',
        nextUrl: {
          pathname: '/admin',
        },
        headers: {
          get: jest.fn().mockReturnValue(null),
        },
        ip: null,
      } as unknown as NextRequest;

      checkAdminAccess(mockRequest, 'USER');

      expect(securityLog.logUnauthorizedAccess).toHaveBeenCalledWith(
        mockRequest,
        'USER',
        UserRole.ADMIN,
        undefined
      );
    });
  });

  describe('getUserIdFromCookies', () => {
    it('returns user ID when present in cookies', () => {
      const mockRequest = {
        cookies: {
          get: jest.fn((name: string) => {
            if (name === 'userId') {
              return { value: 'user-789' };
            }
            return undefined;
          }),
        },
      } as unknown as NextRequest;

      const result = getUserIdFromCookies(mockRequest);
      expect(result).toBe('user-789');
    });

    it('returns null when user ID is not present', () => {
      const mockRequest = {
        cookies: {
          get: jest.fn(() => undefined),
        },
      } as unknown as NextRequest;

      const result = getUserIdFromCookies(mockRequest);
      expect(result).toBeNull();
    });
  });
});
