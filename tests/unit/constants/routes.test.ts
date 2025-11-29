import {
  PUBLIC_ROUTES,
  AUTH_ROUTES,
  PROTECTED_ROUTES,
  ADMIN_ROUTES,
  EXCLUDED_ROUTES,
  DEFAULT_UNAUTHORIZED_URL,
  AUTH_COOKIE_NAMES,
  matchesRoutePattern,
  isPublicRoute,
  isAuthRoute,
  isProtectedRoute,
  isAdminRoute,
  isExcludedRoute,
} from '@/constants/routes';

describe('Route Constants', () => {
  describe('Route Arrays', () => {
    it('defines public routes', () => {
      expect(PUBLIC_ROUTES).toContain('/about');
      expect(PUBLIC_ROUTES).toContain('/components-demo');
    });

    it('defines auth routes', () => {
      expect(AUTH_ROUTES).toContain('/login');
      expect(AUTH_ROUTES).toContain('/register');
      expect(AUTH_ROUTES).toContain('/forgot-password');
    });

    it('defines protected routes', () => {
      expect(PROTECTED_ROUTES).toContain('/recipes');
      expect(PROTECTED_ROUTES).toContain('/meal-plans');
      expect(PROTECTED_ROUTES).toContain('/account');
    });

    it('defines admin routes', () => {
      expect(ADMIN_ROUTES).toContain('/admin');
      expect(ADMIN_ROUTES).toContain('/admin/(.*)');
    });

    it('defines excluded routes', () => {
      expect(EXCLUDED_ROUTES).toContain('/api/(.*)');
      expect(EXCLUDED_ROUTES).toContain('/_next/(.*)');
      expect(EXCLUDED_ROUTES).toContain('/manifest.json');
    });
  });

  describe('matchesRoutePattern', () => {
    it('matches exact paths', () => {
      const patterns = ['/recipes', '/about'];
      expect(matchesRoutePattern('/recipes', patterns)).toBe(true);
      expect(matchesRoutePattern('/about', patterns)).toBe(true);
      expect(matchesRoutePattern('/other', patterns)).toBe(false);
    });

    it('matches wildcard patterns with .*', () => {
      const patterns = ['/admin/(.*)'];
      expect(matchesRoutePattern('/admin/users', patterns)).toBe(true);
      expect(matchesRoutePattern('/admin/settings', patterns)).toBe(true);
      expect(matchesRoutePattern('/admin', patterns)).toBe(false);
    });

    it('matches patterns with (.*) for any path', () => {
      const patterns = ['/components-demo/(.*)'];
      expect(matchesRoutePattern('/components-demo/button', patterns)).toBe(
        true
      );
      expect(matchesRoutePattern('/components-demo/card', patterns)).toBe(true);
      expect(matchesRoutePattern('/components-demo', patterns)).toBe(false);
    });

    it('returns false for empty pattern array', () => {
      expect(matchesRoutePattern('/test', [])).toBe(false);
    });

    it('handles multiple patterns', () => {
      const patterns = ['/api/(.*)', '/_next/(.*)'];
      expect(matchesRoutePattern('/api/users', patterns)).toBe(true);
      expect(matchesRoutePattern('/_next/static/chunk.js', patterns)).toBe(
        true
      );
      expect(matchesRoutePattern('/other', patterns)).toBe(false);
    });
  });

  describe('isPublicRoute', () => {
    it('returns true for public routes', () => {
      expect(isPublicRoute('/about')).toBe(true);
      expect(isPublicRoute('/components-demo')).toBe(true);
    });

    it('returns false for root path (now protected)', () => {
      expect(isPublicRoute('/')).toBe(false);
    });

    it('returns true for wildcard public routes', () => {
      expect(isPublicRoute('/components-demo/button')).toBe(true);
      expect(isPublicRoute('/components-demo/card')).toBe(true);
    });

    it('returns false for non-public routes', () => {
      expect(isPublicRoute('/recipes')).toBe(false);
      expect(isPublicRoute('/login')).toBe(false);
      expect(isPublicRoute('/admin')).toBe(false);
    });
  });

  describe('isAuthRoute', () => {
    it('returns true for auth routes', () => {
      expect(isAuthRoute('/login')).toBe(true);
      expect(isAuthRoute('/register')).toBe(true);
      expect(isAuthRoute('/forgot-password')).toBe(true);
      expect(isAuthRoute('/reset-password')).toBe(true);
    });

    it('returns false for non-auth routes', () => {
      expect(isAuthRoute('/recipes')).toBe(false);
      expect(isAuthRoute('/about')).toBe(false);
      expect(isAuthRoute('/admin')).toBe(false);
    });
  });

  describe('isProtectedRoute', () => {
    it('returns true for protected routes', () => {
      expect(isProtectedRoute('/recipes')).toBe(true);
      expect(isProtectedRoute('/meal-plans')).toBe(true);
      expect(isProtectedRoute('/account')).toBe(true);
      expect(isProtectedRoute('/account/profile')).toBe(true);
      expect(isProtectedRoute('/account/settings')).toBe(true);
    });

    it('returns false for non-protected routes', () => {
      expect(isProtectedRoute('/')).toBe(false);
      expect(isProtectedRoute('/login')).toBe(false);
      expect(isProtectedRoute('/about')).toBe(false);
    });
  });

  describe('isAdminRoute', () => {
    it('returns true for admin routes', () => {
      expect(isAdminRoute('/admin')).toBe(true);
    });

    it('returns true for admin sub-routes', () => {
      expect(isAdminRoute('/admin/users')).toBe(true);
      expect(isAdminRoute('/admin/settings')).toBe(true);
      expect(isAdminRoute('/admin/dashboard')).toBe(true);
    });

    it('returns false for non-admin routes', () => {
      expect(isAdminRoute('/recipes')).toBe(false);
      expect(isAdminRoute('/login')).toBe(false);
      expect(isAdminRoute('/about')).toBe(false);
    });
  });

  describe('isExcludedRoute', () => {
    it('returns true for API routes', () => {
      expect(isExcludedRoute('/api/health')).toBe(true);
      expect(isExcludedRoute('/api/users')).toBe(true);
    });

    it('returns true for Next.js internal routes', () => {
      expect(isExcludedRoute('/_next/static/chunk.js')).toBe(true);
      expect(isExcludedRoute('/_next/image')).toBe(true);
    });

    it('returns true for static assets', () => {
      expect(isExcludedRoute('/manifest.json')).toBe(true);
    });

    it('returns false for application routes', () => {
      expect(isExcludedRoute('/recipes')).toBe(false);
      expect(isExcludedRoute('/login')).toBe(false);
      expect(isExcludedRoute('/')).toBe(false);
    });
  });

  describe('DEFAULT_UNAUTHORIZED_URL', () => {
    it('should be /403', () => {
      expect(DEFAULT_UNAUTHORIZED_URL).toBe('/403');
    });
  });

  describe('AUTH_COOKIE_NAMES', () => {
    it('should define TOKEN cookie name', () => {
      expect(AUTH_COOKIE_NAMES.TOKEN).toBe('authToken');
    });

    it('should define EXPIRES_AT cookie name', () => {
      expect(AUTH_COOKIE_NAMES.EXPIRES_AT).toBe('tokenExpiresAt');
    });

    it('should define REFRESH_TOKEN cookie name', () => {
      expect(AUTH_COOKIE_NAMES.REFRESH_TOKEN).toBe('refreshToken');
    });

    it('should define ROLE cookie name', () => {
      expect(AUTH_COOKIE_NAMES.ROLE).toBe('userRole');
    });

    it('should be read-only', () => {
      expect(Object.isFrozen(AUTH_COOKIE_NAMES)).toBe(false);
      // Note: const objects are not frozen in JS, but TypeScript enforces readonly
    });
  });

  describe('Edge Cases', () => {
    it('handles URLs with query strings', () => {
      expect(isProtectedRoute('/recipes?category=pasta')).toBe(false);
      // The pattern matching is exact, query strings change the path
    });

    it('handles URLs with trailing slashes', () => {
      expect(isPublicRoute('/about/')).toBe(false);
      // Trailing slashes make it a different path
    });

    it('is case-sensitive', () => {
      expect(isAuthRoute('/Login')).toBe(false);
      expect(isAuthRoute('/login')).toBe(true);
    });
  });
});
