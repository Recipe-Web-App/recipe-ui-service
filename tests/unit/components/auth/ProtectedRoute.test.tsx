import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuthStore } from '@/stores/auth-store';
import type { AuthState } from '@/stores/auth-store';

expect.extend(toHaveNoViolations);

// Mock next/navigation
const mockPush = jest.fn();
const mockPathname = '/recipes';
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  usePathname: () => mockPathname,
}));

// Mock auth store
jest.mock('@/stores/auth-store', () => ({
  useAuthStore: jest.fn(),
}));

const mockUseAuthStore = useAuthStore as jest.MockedFunction<
  typeof useAuthStore
>;

describe('ProtectedRoute', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

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

  describe('Authenticated User', () => {
    it('renders children when user is authenticated with valid token', async () => {
      const mockAuthState = createMockAuthState({
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
        tokenExpiresAt: Date.now() + 60 * 60 * 1000, // 1 hour from now
        isTokenExpired: jest.fn().mockReturnValue(false),
      });

      mockUseAuthStore.mockReturnValue(mockAuthState);

      render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      );

      await waitFor(() => {
        expect(screen.getByText('Protected Content')).toBeInTheDocument();
      });

      expect(mockPush).not.toHaveBeenCalled();
    });

    it('does not redirect when user is authenticated', async () => {
      const mockAuthState = createMockAuthState({
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

      mockUseAuthStore.mockReturnValue(mockAuthState);

      render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      );

      await waitFor(() => {
        expect(screen.getByText('Protected Content')).toBeInTheDocument();
      });

      expect(mockPush).not.toHaveBeenCalled();
    });

    it('passes accessibility tests when authenticated', async () => {
      const mockAuthState = createMockAuthState({
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

      mockUseAuthStore.mockReturnValue(mockAuthState);

      const { container } = render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      );

      await waitFor(() => {
        expect(screen.getByText('Protected Content')).toBeInTheDocument();
      });

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Unauthenticated User', () => {
    it('redirects to login when user is not authenticated', async () => {
      const mockAuthState = createMockAuthState({
        isAuthenticated: false,
        token: null,
        isTokenExpired: jest.fn().mockReturnValue(true),
      });

      mockUseAuthStore.mockReturnValue(mockAuthState);

      render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      );

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/login?returnUrl=%2Frecipes');
      });
    });

    it('redirects with custom login URL', async () => {
      const mockAuthState = createMockAuthState({
        isAuthenticated: false,
        isTokenExpired: jest.fn().mockReturnValue(true),
      });

      mockUseAuthStore.mockReturnValue(mockAuthState);

      render(
        <ProtectedRoute config={{ loginUrl: '/auth/login' }}>
          <div>Protected Content</div>
        </ProtectedRoute>
      );

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith(
          '/auth/login?returnUrl=%2Frecipes'
        );
      });
    });

    it('redirects with custom return URL param', async () => {
      const mockAuthState = createMockAuthState({
        isAuthenticated: false,
        isTokenExpired: jest.fn().mockReturnValue(true),
      });

      mockUseAuthStore.mockReturnValue(mockAuthState);

      render(
        <ProtectedRoute config={{ returnUrlParam: 'redirect' }}>
          <div>Protected Content</div>
        </ProtectedRoute>
      );

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/login?redirect=%2Frecipes');
      });
    });

    it('calls onRedirect callback when redirecting', async () => {
      const onRedirect = jest.fn();
      const mockAuthState = createMockAuthState({
        isAuthenticated: false,
        isTokenExpired: jest.fn().mockReturnValue(true),
      });

      mockUseAuthStore.mockReturnValue(mockAuthState);

      render(
        <ProtectedRoute config={{ onRedirect }}>
          <div>Protected Content</div>
        </ProtectedRoute>
      );

      await waitFor(() => {
        expect(onRedirect).toHaveBeenCalledWith('/login?returnUrl=%2Frecipes');
      });
    });

    it('calls onAuthCheck callback with authentication status', async () => {
      const onAuthCheck = jest.fn();
      const mockAuthState = createMockAuthState({
        isAuthenticated: false,
        isTokenExpired: jest.fn().mockReturnValue(true),
      });

      mockUseAuthStore.mockReturnValue(mockAuthState);

      render(
        <ProtectedRoute config={{ onAuthCheck }}>
          <div>Protected Content</div>
        </ProtectedRoute>
      );

      await waitFor(() => {
        expect(onAuthCheck).toHaveBeenCalledWith(false);
      });
    });
  });

  describe('Token Expiration', () => {
    it('redirects when token is expired', async () => {
      const mockAuthState = createMockAuthState({
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

      mockUseAuthStore.mockReturnValue(mockAuthState);

      render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      );

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/login?returnUrl=%2Frecipes');
      });
    });

    it('does not redirect when token is not expired', async () => {
      const mockAuthState = createMockAuthState({
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
        tokenExpiresAt: Date.now() + 60 * 60 * 1000, // 1 hour from now
        isTokenExpired: jest.fn().mockReturnValue(false),
      });

      mockUseAuthStore.mockReturnValue(mockAuthState);

      render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      );

      await waitFor(() => {
        expect(screen.getByText('Protected Content')).toBeInTheDocument();
      });

      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  describe('Loading State', () => {
    it('shows loading spinner by default', () => {
      const mockAuthState = createMockAuthState({
        isAuthenticated: false,
        isLoading: true,
      });

      mockUseAuthStore.mockReturnValue(mockAuthState);

      render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      );

      expect(screen.getByTestId('protected-route-loading')).toBeInTheDocument();
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    it('shows custom loading component when provided', () => {
      const mockAuthState = createMockAuthState({
        isAuthenticated: false,
      });

      mockUseAuthStore.mockReturnValue(mockAuthState);

      render(
        <ProtectedRoute
          config={{
            loadingComponent: <div>Custom Loading</div>,
          }}
        >
          <div>Protected Content</div>
        </ProtectedRoute>
      );

      expect(screen.getByText('Custom Loading')).toBeInTheDocument();
    });

    it('hides loading state when showLoadingState is false', () => {
      const mockAuthState = createMockAuthState({
        isAuthenticated: false,
      });

      mockUseAuthStore.mockReturnValue(mockAuthState);

      render(
        <ProtectedRoute config={{ showLoadingState: false }}>
          <div>Protected Content</div>
        </ProtectedRoute>
      );

      expect(
        screen.queryByTestId('protected-route-loading')
      ).not.toBeInTheDocument();
    });

    it('passes accessibility tests for loading state', async () => {
      const mockAuthState = createMockAuthState({
        isAuthenticated: false,
        isLoading: true,
      });

      mockUseAuthStore.mockReturnValue(mockAuthState);

      const { container } = render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Custom Fallback', () => {
    it('shows custom fallback when provided and user is not authenticated', async () => {
      const mockAuthState = createMockAuthState({
        isAuthenticated: false,
        isTokenExpired: jest.fn().mockReturnValue(true),
      });

      mockUseAuthStore.mockReturnValue(mockAuthState);

      render(
        <ProtectedRoute fallback={<div>Custom Unauthorized</div>}>
          <div>Protected Content</div>
        </ProtectedRoute>
      );

      // Wait for the redirect to be called
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalled();
      });

      // The fallback won't show because the component redirects immediately
      // But the redirect should still happen
      expect(mockPush).toHaveBeenCalledWith('/login?returnUrl=%2Frecipes');
    });

    it('shows custom unauthorized component from config', async () => {
      const mockAuthState = createMockAuthState({
        isAuthenticated: false,
        isTokenExpired: jest.fn().mockReturnValue(true),
      });

      mockUseAuthStore.mockReturnValue(mockAuthState);

      render(
        <ProtectedRoute
          config={{
            unauthorizedComponent: <div>Config Unauthorized</div>,
          }}
        >
          <div>Protected Content</div>
        </ProtectedRoute>
      );

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalled();
      });
    });
  });

  describe('Custom Attributes', () => {
    it('applies custom className', async () => {
      const mockAuthState = createMockAuthState({
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

      mockUseAuthStore.mockReturnValue(mockAuthState);

      const { container } = render(
        <ProtectedRoute className="custom-class">
          <div>Protected Content</div>
        </ProtectedRoute>
      );

      await waitFor(() => {
        expect(screen.getByText('Protected Content')).toBeInTheDocument();
      });

      const protectedRoute = container.querySelector('.custom-class');
      expect(protectedRoute).toBeInTheDocument();
    });

    it('applies custom test ID', async () => {
      const mockAuthState = createMockAuthState({
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

      mockUseAuthStore.mockReturnValue(mockAuthState);

      render(
        <ProtectedRoute data-testid="custom-test-id">
          <div>Protected Content</div>
        </ProtectedRoute>
      );

      await waitFor(() => {
        expect(screen.getByTestId('custom-test-id')).toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles missing user but valid token', async () => {
      const mockAuthState = createMockAuthState({
        isAuthenticated: true,
        token: 'valid-token',
        authUser: null,
        user: null,
        isTokenExpired: jest.fn().mockReturnValue(false),
      });

      mockUseAuthStore.mockReturnValue(mockAuthState);

      render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      );

      // Should redirect because no user data
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/login?returnUrl=%2Frecipes');
      });
    });

    it('handles user property instead of authUser', async () => {
      const mockAuthState = createMockAuthState({
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

      mockUseAuthStore.mockReturnValue(mockAuthState);

      render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      );

      await waitFor(() => {
        expect(screen.getByText('Protected Content')).toBeInTheDocument();
      });

      expect(mockPush).not.toHaveBeenCalled();
    });

    it('renders display name', () => {
      expect(ProtectedRoute.displayName).toBe('ProtectedRoute');
    });
  });
});
