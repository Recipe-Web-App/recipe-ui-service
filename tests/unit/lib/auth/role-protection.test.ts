import {
  hasRole,
  getUserRoles,
  normalizeRoles,
  isAdmin,
  isUser,
} from '@/lib/auth/role-protection';
import { UserRole, RoleMatchStrategy } from '@/types/auth';
import type { AuthState } from '@/stores/auth-store';

describe('Role Protection Utilities', () => {
  describe('normalizeRoles', () => {
    it('converts single role to array', () => {
      const result = normalizeRoles(UserRole.ADMIN);
      expect(result).toEqual([UserRole.ADMIN]);
    });

    it('returns array as-is', () => {
      const roles = [UserRole.ADMIN, UserRole.USER];
      const result = normalizeRoles(roles);
      expect(result).toEqual(roles);
    });

    it('handles single USER role', () => {
      const result = normalizeRoles(UserRole.USER);
      expect(result).toEqual([UserRole.USER]);
    });
  });

  describe('getUserRoles', () => {
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

    it('gets roles from AuthorizedUser', () => {
      const authState = createMockAuthState({
        user: {
          id: '123',
          name: 'Test User',
          email: 'test@example.com',
          roles: ['ADMIN', 'USER'],
        },
      });

      const result = getUserRoles(authState);
      expect(result).toEqual(['ADMIN', 'USER']);
    });

    it('gets roles from user with single role', () => {
      const authState = createMockAuthState({
        user: {
          id: '123',
          name: 'Test User',
          email: 'test@example.com',
          roles: ['USER'],
        },
      });

      const result = getUserRoles(authState);
      expect(result).toEqual(['USER']);
    });

    it('returns undefined when user has no roles', () => {
      const authState = createMockAuthState({
        user: {
          id: '123',
          name: 'Test User',
          email: 'test@example.com',
        },
      });

      const result = getUserRoles(authState);
      expect(result).toBeUndefined();
    });

    it('returns undefined when no user data', () => {
      const authState = createMockAuthState({
        user: null,
        authUser: null,
      });

      const result = getUserRoles(authState);
      expect(result).toBeUndefined();
    });

    it('supports future authUser with roles', () => {
      const authState = createMockAuthState({
        user: null,
        authUser: {
          user_id: '123',
          username: 'testuser',
          email: 'test@example.com',
          is_active: true,
          created_at: '2024-01-01',
          updated_at: '2024-01-01',
          roles: ['ADMIN'],
        } as any,
      });

      const result = getUserRoles(authState);
      expect(result).toEqual(['ADMIN']);
    });

    it('prefers user.roles over authUser', () => {
      const authState = createMockAuthState({
        user: {
          id: '123',
          name: 'Test User',
          email: 'test@example.com',
          roles: ['ADMIN'],
        },
        authUser: {
          user_id: '123',
          username: 'testuser',
          email: 'test@example.com',
          is_active: true,
          created_at: '2024-01-01',
          updated_at: '2024-01-01',
          roles: ['USER'],
        } as any,
      });

      const result = getUserRoles(authState);
      expect(result).toEqual(['ADMIN']);
    });
  });

  describe('hasRole', () => {
    describe('single role checking', () => {
      it('returns true when user has required role', () => {
        const userRoles = ['ADMIN'];
        const result = hasRole(userRoles, UserRole.ADMIN);
        expect(result).toBe(true);
      });

      it('returns false when user lacks required role', () => {
        const userRoles = ['USER'];
        const result = hasRole(userRoles, UserRole.ADMIN);
        expect(result).toBe(false);
      });

      it('returns false when user has no roles', () => {
        const userRoles: string[] = [];
        const result = hasRole(userRoles, UserRole.ADMIN);
        expect(result).toBe(false);
      });

      it('returns false when userRoles is undefined', () => {
        const result = hasRole(undefined, UserRole.ADMIN);
        expect(result).toBe(false);
      });

      it('is case insensitive', () => {
        const userRoles = ['admin'];
        const result = hasRole(userRoles, UserRole.ADMIN);
        expect(result).toBe(true);
      });
    });

    describe('multiple roles with ANY strategy', () => {
      it('returns true when user has at least one required role', () => {
        const userRoles = ['ADMIN'];
        const result = hasRole(
          userRoles,
          [UserRole.ADMIN, UserRole.USER],
          RoleMatchStrategy.ANY
        );
        expect(result).toBe(true);
      });

      it('returns true when user has all required roles', () => {
        const userRoles = ['ADMIN', 'USER'];
        const result = hasRole(
          userRoles,
          [UserRole.ADMIN, UserRole.USER],
          RoleMatchStrategy.ANY
        );
        expect(result).toBe(true);
      });

      it('returns false when user has none of the required roles', () => {
        const userRoles = ['OTHER'];
        const result = hasRole(
          userRoles,
          [UserRole.ADMIN, UserRole.USER],
          RoleMatchStrategy.ANY
        );
        expect(result).toBe(false);
      });

      it('defaults to ANY strategy when not specified', () => {
        const userRoles = ['USER'];
        const result = hasRole(userRoles, [UserRole.ADMIN, UserRole.USER]);
        expect(result).toBe(true);
      });
    });

    describe('multiple roles with ALL strategy', () => {
      it('returns true when user has all required roles', () => {
        const userRoles = ['ADMIN', 'USER'];
        const result = hasRole(
          userRoles,
          [UserRole.ADMIN, UserRole.USER],
          RoleMatchStrategy.ALL
        );
        expect(result).toBe(true);
      });

      it('returns false when user has only some required roles', () => {
        const userRoles = ['ADMIN'];
        const result = hasRole(
          userRoles,
          [UserRole.ADMIN, UserRole.USER],
          RoleMatchStrategy.ALL
        );
        expect(result).toBe(false);
      });

      it('returns false when user has none of the required roles', () => {
        const userRoles = ['OTHER'];
        const result = hasRole(
          userRoles,
          [UserRole.ADMIN, UserRole.USER],
          RoleMatchStrategy.ALL
        );
        expect(result).toBe(false);
      });

      it('works with single role in array', () => {
        const userRoles = ['ADMIN'];
        const result = hasRole(
          userRoles,
          [UserRole.ADMIN],
          RoleMatchStrategy.ALL
        );
        expect(result).toBe(true);
      });
    });

    describe('edge cases', () => {
      it('handles empty required roles array', () => {
        const userRoles = ['ADMIN'];
        const result = hasRole(userRoles, []);
        expect(result).toBe(false);
      });

      it('handles user with extra roles', () => {
        const userRoles = ['ADMIN', 'USER', 'CUSTOM'];
        const result = hasRole(userRoles, UserRole.ADMIN);
        expect(result).toBe(true);
      });

      it('handles mixed case user roles', () => {
        const userRoles = ['Admin', 'uSeR'];
        const result = hasRole(
          userRoles,
          [UserRole.ADMIN, UserRole.USER],
          RoleMatchStrategy.ALL
        );
        expect(result).toBe(true);
      });
    });
  });

  describe('isAdmin', () => {
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

    it('returns true when user has admin role', () => {
      const authState = createMockAuthState({
        user: {
          id: '123',
          name: 'Admin User',
          email: 'admin@example.com',
          roles: ['ADMIN'],
        },
      });

      const result = isAdmin(authState);
      expect(result).toBe(true);
    });

    it('returns false when user is not admin', () => {
      const authState = createMockAuthState({
        user: {
          id: '123',
          name: 'Regular User',
          email: 'user@example.com',
          roles: ['USER'],
        },
      });

      const result = isAdmin(authState);
      expect(result).toBe(false);
    });

    it('returns false when user has no roles', () => {
      const authState = createMockAuthState({
        user: {
          id: '123',
          name: 'Test User',
          email: 'test@example.com',
        },
      });

      const result = isAdmin(authState);
      expect(result).toBe(false);
    });
  });

  describe('isUser', () => {
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

    it('returns true when user has user role', () => {
      const authState = createMockAuthState({
        user: {
          id: '123',
          name: 'Regular User',
          email: 'user@example.com',
          roles: ['USER'],
        },
      });

      const result = isUser(authState);
      expect(result).toBe(true);
    });

    it('returns false when user is admin only', () => {
      const authState = createMockAuthState({
        user: {
          id: '123',
          name: 'Admin User',
          email: 'admin@example.com',
          roles: ['ADMIN'],
        },
      });

      const result = isUser(authState);
      expect(result).toBe(false);
    });

    it('returns true when user has both admin and user roles', () => {
      const authState = createMockAuthState({
        user: {
          id: '123',
          name: 'Power User',
          email: 'power@example.com',
          roles: ['ADMIN', 'USER'],
        },
      });

      const result = isUser(authState);
      expect(result).toBe(true);
    });
  });
});
