import { NextRequest } from 'next/server';
import {
  SecurityEventType,
  createSecurityLogEntry,
  logSecurityEvent,
  logUnauthorizedAccess,
  logAuthenticationFailure,
  logInvalidToken,
  logExpiredToken,
} from '@/lib/middleware/security-log';

// Mock console.warn
const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

describe('Security Logging Utilities', () => {
  beforeEach(() => {
    consoleWarnSpy.mockClear();
  });

  afterAll(() => {
    consoleWarnSpy.mockRestore();
  });

  describe('createSecurityLogEntry', () => {
    it('creates a basic log entry with required fields', () => {
      const mockRequest = {
        nextUrl: {
          pathname: '/admin/users',
        },
        headers: {
          get: jest.fn().mockReturnValue(null),
        },
        ip: '192.168.1.100',
      } as unknown as NextRequest;

      const logEntry = createSecurityLogEntry(
        mockRequest,
        SecurityEventType.UNAUTHORIZED_ACCESS
      );

      expect(logEntry).toMatchObject({
        event: SecurityEventType.UNAUTHORIZED_ACCESS,
        path: '/admin/users',
        ip: '192.168.1.100',
      });
      expect(logEntry.timestamp).toBeDefined();
      expect(new Date(logEntry.timestamp)).toBeInstanceOf(Date);
    });

    it('extracts IP from X-Forwarded-For header', () => {
      const mockRequest = {
        nextUrl: {
          pathname: '/admin',
        },
        headers: {
          get: jest.fn((name: string) => {
            if (name === 'x-forwarded-for') {
              return '10.0.0.1, 10.0.0.2';
            }
            return null;
          }),
        },
        ip: null,
      } as unknown as NextRequest;

      const logEntry = createSecurityLogEntry(
        mockRequest,
        SecurityEventType.UNAUTHORIZED_ACCESS
      );

      expect(logEntry.ip).toBe('10.0.0.1');
    });

    it('extracts IP from X-Real-IP header when X-Forwarded-For not available', () => {
      const mockRequest = {
        nextUrl: {
          pathname: '/admin',
        },
        headers: {
          get: jest.fn((name: string) => {
            if (name === 'x-real-ip') {
              return '172.16.0.1';
            }
            return null;
          }),
        },
        ip: null,
      } as unknown as NextRequest;

      const logEntry = createSecurityLogEntry(
        mockRequest,
        SecurityEventType.UNAUTHORIZED_ACCESS
      );

      expect(logEntry.ip).toBe('172.16.0.1');
    });

    it('extracts user agent from request headers', () => {
      const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)';
      const mockRequest = {
        nextUrl: {
          pathname: '/admin',
        },
        headers: {
          get: jest.fn((name: string) => {
            if (name === 'user-agent') {
              return userAgent;
            }
            return null;
          }),
        },
        ip: null,
      } as unknown as NextRequest;

      const logEntry = createSecurityLogEntry(
        mockRequest,
        SecurityEventType.UNAUTHORIZED_ACCESS
      );

      expect(logEntry.userAgent).toBe(userAgent);
    });

    it('includes additional metadata when provided', () => {
      const mockRequest = {
        nextUrl: {
          pathname: '/admin',
        },
        headers: {
          get: jest.fn().mockReturnValue(null),
        },
        ip: null,
      } as unknown as NextRequest;

      const logEntry = createSecurityLogEntry(
        mockRequest,
        SecurityEventType.UNAUTHORIZED_ACCESS,
        {
          userRole: 'USER',
          requiredRole: 'ADMIN',
          userId: 'user-123',
        }
      );

      expect(logEntry.userRole).toBe('USER');
      expect(logEntry.requiredRole).toBe('ADMIN');
      expect(logEntry.userId).toBe('user-123');
    });
  });

  describe('logSecurityEvent', () => {
    it('logs event to console.warn', () => {
      const logEntry = {
        timestamp: new Date().toISOString(),
        event: SecurityEventType.UNAUTHORIZED_ACCESS,
        path: '/admin/users',
        ip: '192.168.1.100',
        userAgent: 'Mozilla/5.0',
        userRole: 'USER',
        requiredRole: 'ADMIN',
      };

      logSecurityEvent(logEntry);

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        '[SECURITY EVENT]',
        JSON.stringify(logEntry, null, 2)
      );
    });
  });

  describe('logUnauthorizedAccess', () => {
    it('logs unauthorized access with all details', () => {
      const mockRequest = {
        nextUrl: {
          pathname: '/admin/settings',
        },
        headers: {
          get: jest.fn().mockReturnValue(null),
        },
        ip: '10.0.0.1',
      } as unknown as NextRequest;

      logUnauthorizedAccess(mockRequest, 'USER', 'ADMIN', 'user-456');

      expect(consoleWarnSpy).toHaveBeenCalled();
      const loggedData = JSON.parse(consoleWarnSpy.mock.calls[0][1]);

      expect(loggedData).toMatchObject({
        event: SecurityEventType.UNAUTHORIZED_ACCESS,
        path: '/admin/settings',
        userRole: 'USER',
        requiredRole: 'ADMIN',
        userId: 'user-456',
      });
    });

    it('logs unauthorized access without userId', () => {
      const mockRequest = {
        nextUrl: {
          pathname: '/admin',
        },
        headers: {
          get: jest.fn().mockReturnValue(null),
        },
        ip: null,
      } as unknown as NextRequest;

      logUnauthorizedAccess(mockRequest, 'USER', 'ADMIN');

      expect(consoleWarnSpy).toHaveBeenCalled();
      const loggedData = JSON.parse(consoleWarnSpy.mock.calls[0][1]);

      expect(loggedData.userRole).toBe('USER');
      expect(loggedData.requiredRole).toBe('ADMIN');
      expect(loggedData.userId).toBeUndefined();
    });
  });

  describe('logAuthenticationFailure', () => {
    it('logs authentication failure with reason', () => {
      const mockRequest = {
        nextUrl: {
          pathname: '/recipes',
        },
        headers: {
          get: jest.fn().mockReturnValue(null),
        },
        ip: null,
      } as unknown as NextRequest;

      logAuthenticationFailure(mockRequest, 'Token expired');

      expect(consoleWarnSpy).toHaveBeenCalled();
      const loggedData = JSON.parse(consoleWarnSpy.mock.calls[0][1]);

      expect(loggedData).toMatchObject({
        event: SecurityEventType.AUTHENTICATION_FAILURE,
        path: '/recipes',
        reason: 'Token expired',
      });
    });
  });

  describe('logInvalidToken', () => {
    it('logs invalid token event', () => {
      const mockRequest = {
        nextUrl: {
          pathname: '/profile',
        },
        headers: {
          get: jest.fn().mockReturnValue(null),
        },
        ip: null,
      } as unknown as NextRequest;

      logInvalidToken(mockRequest);

      expect(consoleWarnSpy).toHaveBeenCalled();
      const loggedData = JSON.parse(consoleWarnSpy.mock.calls[0][1]);

      expect(loggedData).toMatchObject({
        event: SecurityEventType.INVALID_TOKEN,
        path: '/profile',
      });
    });
  });

  describe('logExpiredToken', () => {
    it('logs expired token event', () => {
      const mockRequest = {
        nextUrl: {
          pathname: '/settings',
        },
        headers: {
          get: jest.fn().mockReturnValue(null),
        },
        ip: null,
      } as unknown as NextRequest;

      logExpiredToken(mockRequest);

      expect(consoleWarnSpy).toHaveBeenCalled();
      const loggedData = JSON.parse(consoleWarnSpy.mock.calls[0][1]);

      expect(loggedData).toMatchObject({
        event: SecurityEventType.EXPIRED_TOKEN,
        path: '/settings',
      });
    });
  });
});
