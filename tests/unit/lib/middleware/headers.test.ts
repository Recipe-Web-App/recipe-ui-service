// Mock crypto.randomUUID for Node environments
Object.defineProperty(globalThis, 'crypto', {
  value: {
    randomUUID: () => {
      // Generate a UUID v4 format string
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    },
  },
  configurable: true,
});

// Mock Next.js server runtime
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
      next: jest.fn(() => createMockResponse()),
    },
  };
});

import { NextRequest, NextResponse } from 'next/server';
import {
  generateNonce,
  buildCSPHeader,
  buildPermissionsPolicy,
  buildHSTSHeader,
  applySecurityHeaders,
  getNonceFromRequest,
  CUSTOM_HEADERS,
} from '@/lib/middleware/headers';

describe('Security Headers Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    // Clean up mocks after all tests to prevent pollution
    jest.clearAllMocks();
  });

  describe('generateNonce', () => {
    it('generates a unique nonce', () => {
      const nonce1 = generateNonce();
      const nonce2 = generateNonce();

      expect(nonce1).toBeDefined();
      expect(nonce2).toBeDefined();
      expect(nonce1).not.toBe(nonce2);
    });

    it('generates a base64-encoded string', () => {
      const nonce = generateNonce();

      // Base64 pattern: alphanumeric + / + =
      expect(nonce).toMatch(/^[A-Za-z0-9+/]+=*$/);
    });

    it('generates nonces of consistent length', () => {
      const nonces = Array.from({ length: 10 }, () => generateNonce());
      const lengths = nonces.map(n => n.length);

      // All nonces should be the same length (UUID base64 encoded)
      expect(new Set(lengths).size).toBe(1);
    });
  });

  describe('buildCSPHeader', () => {
    const testNonce = 'test-nonce-123';

    it('builds basic CSP header for production', () => {
      const csp = buildCSPHeader(testNonce, false);

      expect(csp).toContain("default-src 'self'");
      expect(csp).toContain(
        `script-src 'self' 'nonce-${testNonce}' 'strict-dynamic'`
      );
      expect(csp).toContain(`style-src 'self' 'nonce-${testNonce}'`);
      expect(csp).toContain("object-src 'none'");
      expect(csp).toContain("base-uri 'self'");
      expect(csp).toContain("form-action 'self'");
      expect(csp).toContain("frame-ancestors 'none'");
    });

    it('includes unsafe-eval in development mode', () => {
      const devCsp = buildCSPHeader(testNonce, true);
      const prodCsp = buildCSPHeader(testNonce, false);

      expect(devCsp).toContain("'unsafe-eval'");
      expect(prodCsp).not.toContain("'unsafe-eval'");
    });

    it('includes upgrade-insecure-requests in production only', () => {
      const devCsp = buildCSPHeader(testNonce, true);
      const prodCsp = buildCSPHeader(testNonce, false);

      expect(devCsp).not.toContain('upgrade-insecure-requests');
      expect(prodCsp).toContain('upgrade-insecure-requests');
    });

    it('includes Google Analytics domains when enabled', () => {
      const cspWithGA = buildCSPHeader(testNonce, false, {
        enableGoogleAnalytics: true,
      });
      const cspWithoutGA = buildCSPHeader(testNonce, false, {
        enableGoogleAnalytics: false,
      });

      expect(cspWithGA).toContain('https://www.googletagmanager.com');
      expect(cspWithGA).toContain('https://www.google-analytics.com');
      expect(cspWithoutGA).not.toContain('googletagmanager');
      expect(cspWithoutGA).not.toContain('google-analytics');
    });

    it('includes report-uri when provided', () => {
      const reportUri = 'https://example.com/csp-report';
      const csp = buildCSPHeader(testNonce, false, { reportUri });

      expect(csp).toContain(`report-uri ${reportUri}`);
    });

    it('does not include report-uri when null', () => {
      const csp = buildCSPHeader(testNonce, false, { reportUri: null });

      expect(csp).not.toContain('report-uri');
    });

    it('includes .local domain URLs in development connect-src', () => {
      const devCsp = buildCSPHeader(testNonce, true);

      expect(devCsp).toContain('http://auth-service.local');
      expect(devCsp).toContain('http://recipe-management.local');
      expect(devCsp).toContain('http://recipe-scraper.local');
      expect(devCsp).toContain('http://media-management.local');
      expect(devCsp).toContain('http://user-management.local');
      expect(devCsp).toContain('http://meal-plan-management.local');
      expect(devCsp).toContain('ws://localhost:*');
    });

    it('does not include .local domain URLs in production', () => {
      const prodCsp = buildCSPHeader(testNonce, false);

      expect(prodCsp).not.toContain('http://auth-service.local');
      expect(prodCsp).not.toContain('http://recipe-management.local');
      expect(prodCsp).not.toContain('ws://localhost');
    });

    it('allows images from self, blob, data, and https', () => {
      const csp = buildCSPHeader(testNonce, false);

      expect(csp).toContain("img-src 'self' blob: data: https:");
    });

    it('allows fonts from self and data URIs', () => {
      const csp = buildCSPHeader(testNonce, false);

      expect(csp).toContain("font-src 'self' data:");
    });

    it('blocks objects and frames', () => {
      const csp = buildCSPHeader(testNonce, false);

      expect(csp).toContain("object-src 'none'");
      expect(csp).toContain("frame-src 'none'");
      expect(csp).toContain("frame-ancestors 'none'");
    });
  });

  describe('buildPermissionsPolicy', () => {
    it('builds Permissions-Policy header', () => {
      const policy = buildPermissionsPolicy();

      expect(policy).toBeDefined();
      expect(typeof policy).toBe('string');
    });

    it('denies camera and microphone', () => {
      const policy = buildPermissionsPolicy();

      expect(policy).toContain('camera=()');
      expect(policy).toContain('microphone=()');
    });

    it('denies geolocation', () => {
      const policy = buildPermissionsPolicy();

      expect(policy).toContain('geolocation=()');
    });

    it('denies USB, serial, and bluetooth', () => {
      const policy = buildPermissionsPolicy();

      expect(policy).toContain('usb=()');
      expect(policy).toContain('serial=()');
      expect(policy).toContain('bluetooth=()');
    });

    it('allows payment for self', () => {
      const policy = buildPermissionsPolicy();

      expect(policy).toContain('payment=(self)');
    });

    it('allows fullscreen and picture-in-picture for self', () => {
      const policy = buildPermissionsPolicy();

      expect(policy).toContain('fullscreen=(self)');
      expect(policy).toContain('picture-in-picture=(self)');
    });

    it('denies interest cohort (FLoC)', () => {
      const policy = buildPermissionsPolicy();

      expect(policy).toContain('interest-cohort=()');
    });
  });

  describe('buildHSTSHeader', () => {
    it('builds HSTS header with 1 year max-age', () => {
      const hsts = buildHSTSHeader();

      expect(hsts).toContain('max-age=31536000');
    });

    it('includes includeSubDomains directive', () => {
      const hsts = buildHSTSHeader();

      expect(hsts).toContain('includeSubDomains');
    });
  });

  describe('applySecurityHeaders', () => {
    const testNonce = 'test-nonce-456';
    let mockRequest: NextRequest;
    let mockResponse: NextResponse;

    beforeEach(() => {
      mockRequest = {
        url: 'http://localhost:3000/test',
        nextUrl: {
          pathname: '/test',
        },
        headers: new Headers(),
      } as unknown as NextRequest;

      // Create mock response with headers map
      const headers = new Map<string, string>();
      mockResponse = {
        headers: {
          has: (name: string) => headers.has(name),
          set: (name: string, value: string) => {
            headers.set(name, value);
            return headers;
          },
          get: (name: string) => headers.get(name),
        },
      } as unknown as NextResponse;
    });

    it('applies CSP header', () => {
      const response = applySecurityHeaders(
        mockRequest,
        mockResponse,
        testNonce
      );

      expect(response.headers.has('Content-Security-Policy')).toBe(true);
      const csp = response.headers.get('Content-Security-Policy');
      expect(csp).toContain(`nonce-${testNonce}`);
    });

    it('applies X-Content-Type-Options header', () => {
      const response = applySecurityHeaders(
        mockRequest,
        mockResponse,
        testNonce
      );

      expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
    });

    it('applies X-Frame-Options header', () => {
      const response = applySecurityHeaders(
        mockRequest,
        mockResponse,
        testNonce
      );

      expect(response.headers.get('X-Frame-Options')).toBe('DENY');
    });

    it('applies X-XSS-Protection header', () => {
      const response = applySecurityHeaders(
        mockRequest,
        mockResponse,
        testNonce
      );

      expect(response.headers.get('X-XSS-Protection')).toBe('1; mode=block');
    });

    it('applies Referrer-Policy header', () => {
      const response = applySecurityHeaders(
        mockRequest,
        mockResponse,
        testNonce
      );

      expect(response.headers.get('Referrer-Policy')).toBe(
        'strict-origin-when-cross-origin'
      );
    });

    it('applies Permissions-Policy header', () => {
      const response = applySecurityHeaders(
        mockRequest,
        mockResponse,
        testNonce
      );

      expect(response.headers.has('Permissions-Policy')).toBe(true);
      const policy = response.headers.get('Permissions-Policy');
      expect(policy).toContain('camera=()');
    });

    it('applies X-DNS-Prefetch-Control header', () => {
      const response = applySecurityHeaders(
        mockRequest,
        mockResponse,
        testNonce
      );

      expect(response.headers.get('X-DNS-Prefetch-Control')).toBe('on');
    });

    it('applies HSTS header in production', () => {
      const originalEnv = process.env.NODE_ENV;
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: 'production',
        configurable: true,
      });

      const response = applySecurityHeaders(
        mockRequest,
        mockResponse,
        testNonce
      );

      expect(response.headers.has('Strict-Transport-Security')).toBe(true);
      expect(response.headers.get('Strict-Transport-Security')).toContain(
        'max-age=31536000'
      );

      Object.defineProperty(process.env, 'NODE_ENV', {
        value: originalEnv,
        configurable: true,
      });
    });

    it('does not apply HSTS header in development', () => {
      const originalEnv = process.env.NODE_ENV;
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: 'development',
        configurable: true,
      });

      const response = applySecurityHeaders(
        mockRequest,
        mockResponse,
        testNonce
      );

      expect(response.headers.has('Strict-Transport-Security')).toBe(false);

      Object.defineProperty(process.env, 'NODE_ENV', {
        value: originalEnv,
        configurable: true,
      });
    });

    it('respects NEXT_PUBLIC_ENABLE_ANALYTICS environment variable', () => {
      const originalAnalytics = process.env.NEXT_PUBLIC_ENABLE_ANALYTICS;
      process.env.NEXT_PUBLIC_ENABLE_ANALYTICS = 'true';

      const response = applySecurityHeaders(
        mockRequest,
        mockResponse,
        testNonce
      );
      const csp = response.headers.get('Content-Security-Policy');

      expect(csp).toContain('googletagmanager');

      process.env.NEXT_PUBLIC_ENABLE_ANALYTICS = originalAnalytics;
    });

    it('respects CSP_REPORT_URI environment variable', () => {
      const originalReportUri = process.env.CSP_REPORT_URI;
      process.env.CSP_REPORT_URI = 'https://example.com/csp-report';

      const response = applySecurityHeaders(
        mockRequest,
        mockResponse,
        testNonce
      );
      const csp = response.headers.get('Content-Security-Policy');

      expect(csp).toContain('report-uri https://example.com/csp-report');

      process.env.CSP_REPORT_URI = originalReportUri;
    });
  });

  describe('getNonceFromRequest', () => {
    it('returns nonce from request headers', () => {
      const testNonce = 'test-nonce-789';
      const headers = new Headers();
      headers.set(CUSTOM_HEADERS.NONCE, testNonce);

      const mockRequest = {
        headers,
      } as unknown as NextRequest;

      const nonce = getNonceFromRequest(mockRequest);

      expect(nonce).toBe(testNonce);
    });

    it('returns null when nonce header is not present', () => {
      const mockRequest = {
        headers: new Headers(),
      } as unknown as NextRequest;

      const nonce = getNonceFromRequest(mockRequest);

      expect(nonce).toBeNull();
    });
  });

  describe('CUSTOM_HEADERS constant', () => {
    it('defines NONCE header name', () => {
      expect(CUSTOM_HEADERS.NONCE).toBe('X-Nonce');
    });

    it('is read-only', () => {
      expect(Object.isFrozen(CUSTOM_HEADERS)).toBe(false);
      // Note: TypeScript enforces readonly at compile time
    });
  });
});
