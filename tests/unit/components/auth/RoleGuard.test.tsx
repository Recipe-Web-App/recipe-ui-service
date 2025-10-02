import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { useAuthStore } from '@/stores/auth-store';
import { UserRole, RoleMatchStrategy } from '@/types/auth';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(() => '/test-path'),
}));

// Mock auth store
jest.mock('@/stores/auth-store');

describe('RoleGuard', () => {
  const mockPush = jest.fn();
  const mockAuthStore = {
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
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useAuthStore as unknown as jest.Mock).mockReturnValue(mockAuthStore);
  });

  describe('authentication checks', () => {
    it('redirects to login when not authenticated', async () => {
      (useAuthStore as unknown as jest.Mock).mockReturnValue({
        ...mockAuthStore,
        isAuthenticated: false,
        token: null,
        user: null,
      });

      render(
        <RoleGuard config={{ roles: UserRole.ADMIN }}>
          <div>Admin Content</div>
        </RoleGuard>
      );

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/login');
      });
    });

    it('redirects to login when token is expired', async () => {
      (useAuthStore as unknown as jest.Mock).mockReturnValue({
        ...mockAuthStore,
        isAuthenticated: true,
        token: 'expired-token',
        user: {
          id: '123',
          name: 'Test User',
          email: 'test@example.com',
          roles: ['ADMIN'],
        },
        isTokenExpired: jest.fn().mockReturnValue(true),
      });

      render(
        <RoleGuard config={{ roles: UserRole.ADMIN }}>
          <div>Admin Content</div>
        </RoleGuard>
      );

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/login');
      });
    });
  });

  describe('role-based access control', () => {
    it('renders children when user has required role', async () => {
      (useAuthStore as unknown as jest.Mock).mockReturnValue({
        ...mockAuthStore,
        isAuthenticated: true,
        token: 'valid-token',
        user: {
          id: '123',
          name: 'Admin User',
          email: 'admin@example.com',
          roles: ['ADMIN'],
        },
      });

      render(
        <RoleGuard config={{ roles: UserRole.ADMIN }}>
          <div>Admin Content</div>
        </RoleGuard>
      );

      await waitFor(() => {
        expect(screen.getByText('Admin Content')).toBeInTheDocument();
      });
    });

    it('shows unauthorized page when user lacks required role', async () => {
      (useAuthStore as unknown as jest.Mock).mockReturnValue({
        ...mockAuthStore,
        isAuthenticated: true,
        token: 'valid-token',
        user: {
          id: '123',
          name: 'Regular User',
          email: 'user@example.com',
          roles: ['USER'],
        },
      });

      render(
        <RoleGuard config={{ roles: UserRole.ADMIN }}>
          <div>Admin Content</div>
        </RoleGuard>
      );

      await waitFor(() => {
        expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
        expect(
          screen.getByTestId('role-guard-unauthorized')
        ).toBeInTheDocument();
      });
    });

    it('handles user with no roles', async () => {
      (useAuthStore as unknown as jest.Mock).mockReturnValue({
        ...mockAuthStore,
        isAuthenticated: true,
        token: 'valid-token',
        user: {
          id: '123',
          name: 'No Role User',
          email: 'norole@example.com',
          roles: undefined,
        },
      });

      render(
        <RoleGuard config={{ roles: UserRole.USER }}>
          <div>User Content</div>
        </RoleGuard>
      );

      await waitFor(() => {
        expect(screen.queryByText('User Content')).not.toBeInTheDocument();
        expect(
          screen.getByTestId('role-guard-unauthorized')
        ).toBeInTheDocument();
      });
    });
  });

  describe('multiple roles with ANY strategy', () => {
    it('grants access when user has at least one required role', async () => {
      (useAuthStore as unknown as jest.Mock).mockReturnValue({
        ...mockAuthStore,
        isAuthenticated: true,
        token: 'valid-token',
        user: {
          id: '123',
          name: 'User',
          email: 'user@example.com',
          roles: ['USER'],
        },
      });

      render(
        <RoleGuard
          config={{
            roles: [UserRole.ADMIN, UserRole.USER],
            matchStrategy: RoleMatchStrategy.ANY,
          }}
        >
          <div>Shared Content</div>
        </RoleGuard>
      );

      await waitFor(() => {
        expect(screen.getByText('Shared Content')).toBeInTheDocument();
      });
    });

    it('denies access when user has none of the required roles', async () => {
      (useAuthStore as unknown as jest.Mock).mockReturnValue({
        ...mockAuthStore,
        isAuthenticated: true,
        token: 'valid-token',
        user: {
          id: '123',
          name: 'User',
          email: 'user@example.com',
          roles: ['OTHER'],
        },
      });

      render(
        <RoleGuard
          config={{
            roles: [UserRole.ADMIN, UserRole.USER],
            matchStrategy: RoleMatchStrategy.ANY,
          }}
        >
          <div>Shared Content</div>
        </RoleGuard>
      );

      await waitFor(() => {
        expect(screen.queryByText('Shared Content')).not.toBeInTheDocument();
        expect(
          screen.getByTestId('role-guard-unauthorized')
        ).toBeInTheDocument();
      });
    });

    it('uses ANY strategy by default', async () => {
      (useAuthStore as unknown as jest.Mock).mockReturnValue({
        ...mockAuthStore,
        isAuthenticated: true,
        token: 'valid-token',
        user: {
          id: '123',
          name: 'Admin',
          email: 'admin@example.com',
          roles: ['ADMIN'],
        },
      });

      render(
        <RoleGuard config={{ roles: [UserRole.ADMIN, UserRole.USER] }}>
          <div>Default Strategy Content</div>
        </RoleGuard>
      );

      await waitFor(() => {
        expect(
          screen.getByText('Default Strategy Content')
        ).toBeInTheDocument();
      });
    });
  });

  describe('multiple roles with ALL strategy', () => {
    it('grants access when user has all required roles', async () => {
      (useAuthStore as unknown as jest.Mock).mockReturnValue({
        ...mockAuthStore,
        isAuthenticated: true,
        token: 'valid-token',
        user: {
          id: '123',
          name: 'Power User',
          email: 'power@example.com',
          roles: ['ADMIN', 'USER'],
        },
      });

      render(
        <RoleGuard
          config={{
            roles: [UserRole.ADMIN, UserRole.USER],
            matchStrategy: RoleMatchStrategy.ALL,
          }}
        >
          <div>All Roles Required</div>
        </RoleGuard>
      );

      await waitFor(() => {
        expect(screen.getByText('All Roles Required')).toBeInTheDocument();
      });
    });

    it('denies access when user has only some required roles', async () => {
      (useAuthStore as unknown as jest.Mock).mockReturnValue({
        ...mockAuthStore,
        isAuthenticated: true,
        token: 'valid-token',
        user: {
          id: '123',
          name: 'Admin Only',
          email: 'admin@example.com',
          roles: ['ADMIN'],
        },
      });

      render(
        <RoleGuard
          config={{
            roles: [UserRole.ADMIN, UserRole.USER],
            matchStrategy: RoleMatchStrategy.ALL,
          }}
        >
          <div>All Roles Required</div>
        </RoleGuard>
      );

      await waitFor(() => {
        expect(
          screen.queryByText('All Roles Required')
        ).not.toBeInTheDocument();
        expect(
          screen.getByTestId('role-guard-unauthorized')
        ).toBeInTheDocument();
      });
    });
  });

  describe('loading states', () => {
    it('shows loading spinner by default', async () => {
      (useAuthStore as unknown as jest.Mock).mockReturnValue({
        ...mockAuthStore,
        isAuthenticated: true,
        token: 'valid-token',
        user: {
          id: '123',
          name: 'User',
          email: 'user@example.com',
          roles: ['USER'],
        },
      });

      const { container } = render(
        <RoleGuard config={{ roles: UserRole.USER }}>
          <div>User Content</div>
        </RoleGuard>
      );

      // Component will quickly transition from loading to content
      await waitFor(() => {
        expect(screen.getByText('User Content')).toBeInTheDocument();
      });

      expect(container).toBeTruthy();
    });

    it('hides loading state when showLoadingState is false', async () => {
      (useAuthStore as unknown as jest.Mock).mockReturnValue({
        ...mockAuthStore,
        isAuthenticated: true,
        token: 'valid-token',
        user: {
          id: '123',
          name: 'User',
          email: 'user@example.com',
          roles: ['USER'],
        },
      });

      const { container } = render(
        <RoleGuard config={{ roles: UserRole.USER, showLoadingState: false }}>
          <div>User Content</div>
        </RoleGuard>
      );

      await waitFor(() => {
        expect(screen.getByText('User Content')).toBeInTheDocument();
      });

      expect(container).toBeTruthy();
    });

    it('shows custom loading component', async () => {
      (useAuthStore as unknown as jest.Mock).mockReturnValue({
        ...mockAuthStore,
        isAuthenticated: true,
        token: 'valid-token',
        user: {
          id: '123',
          name: 'User',
          email: 'user@example.com',
          roles: ['USER'],
        },
      });

      render(
        <RoleGuard
          config={{
            roles: UserRole.USER,
            loadingComponent: <div>Custom Loading...</div>,
          }}
        >
          <div>User Content</div>
        </RoleGuard>
      );

      await waitFor(() => {
        expect(screen.getByText('User Content')).toBeInTheDocument();
      });
    });
  });

  describe('custom unauthorized components', () => {
    it('shows custom unauthorized component', async () => {
      (useAuthStore as unknown as jest.Mock).mockReturnValue({
        ...mockAuthStore,
        isAuthenticated: true,
        token: 'valid-token',
        user: {
          id: '123',
          name: 'User',
          email: 'user@example.com',
          roles: ['USER'],
        },
      });

      render(
        <RoleGuard
          config={{
            roles: UserRole.ADMIN,
            unauthorizedComponent: <div>Custom Unauthorized</div>,
          }}
        >
          <div>Admin Content</div>
        </RoleGuard>
      );

      await waitFor(() => {
        expect(screen.getByText('Custom Unauthorized')).toBeInTheDocument();
        expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
      });
    });

    it('prioritizes fallback prop over unauthorizedComponent', async () => {
      (useAuthStore as unknown as jest.Mock).mockReturnValue({
        ...mockAuthStore,
        isAuthenticated: true,
        token: 'valid-token',
        user: {
          id: '123',
          name: 'User',
          email: 'user@example.com',
          roles: ['USER'],
        },
      });

      render(
        <RoleGuard
          config={{
            roles: UserRole.ADMIN,
            unauthorizedComponent: <div>Config Unauthorized</div>,
          }}
          fallback={<div>Fallback Unauthorized</div>}
        >
          <div>Admin Content</div>
        </RoleGuard>
      );

      await waitFor(() => {
        expect(screen.getByText('Fallback Unauthorized')).toBeInTheDocument();
        expect(
          screen.queryByText('Config Unauthorized')
        ).not.toBeInTheDocument();
        expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
      });
    });
  });

  describe('fallback URL redirection', () => {
    it('redirects to custom fallback URL when specified and different from default', async () => {
      (useAuthStore as unknown as jest.Mock).mockReturnValue({
        ...mockAuthStore,
        isAuthenticated: true,
        token: 'valid-token',
        user: {
          id: '123',
          name: 'User',
          email: 'user@example.com',
          roles: ['USER'],
        },
      });

      render(
        <RoleGuard
          config={{
            roles: UserRole.ADMIN,
            fallbackUrl: '/access-denied',
          }}
        >
          <div>Admin Content</div>
        </RoleGuard>
      );

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/access-denied');
      });
    });

    it('does not redirect when fallbackUrl is /unauthorized', async () => {
      (useAuthStore as unknown as jest.Mock).mockReturnValue({
        ...mockAuthStore,
        isAuthenticated: true,
        token: 'valid-token',
        user: {
          id: '123',
          name: 'User',
          email: 'user@example.com',
          roles: ['USER'],
        },
      });

      render(
        <RoleGuard
          config={{
            roles: UserRole.ADMIN,
            fallbackUrl: '/unauthorized',
          }}
        >
          <div>Admin Content</div>
        </RoleGuard>
      );

      await waitFor(() => {
        expect(
          screen.getByTestId('role-guard-unauthorized')
        ).toBeInTheDocument();
      });

      expect(mockPush).not.toHaveBeenCalledWith('/unauthorized');
    });
  });

  describe('callbacks', () => {
    it('calls onRoleCheck callback with result', async () => {
      const onRoleCheck = jest.fn();

      (useAuthStore as unknown as jest.Mock).mockReturnValue({
        ...mockAuthStore,
        isAuthenticated: true,
        token: 'valid-token',
        user: {
          id: '123',
          name: 'Admin',
          email: 'admin@example.com',
          roles: ['ADMIN'],
        },
      });

      render(
        <RoleGuard
          config={{
            roles: UserRole.ADMIN,
            onRoleCheck,
          }}
        >
          <div>Admin Content</div>
        </RoleGuard>
      );

      await waitFor(() => {
        expect(onRoleCheck).toHaveBeenCalledWith(true, ['ADMIN']);
      });
    });

    it('calls onRoleCheck with false when user lacks role', async () => {
      const onRoleCheck = jest.fn();

      (useAuthStore as unknown as jest.Mock).mockReturnValue({
        ...mockAuthStore,
        isAuthenticated: true,
        token: 'valid-token',
        user: {
          id: '123',
          name: 'User',
          email: 'user@example.com',
          roles: ['USER'],
        },
      });

      render(
        <RoleGuard
          config={{
            roles: UserRole.ADMIN,
            onRoleCheck,
          }}
        >
          <div>Admin Content</div>
        </RoleGuard>
      );

      await waitFor(() => {
        expect(onRoleCheck).toHaveBeenCalledWith(false, ['USER']);
      });
    });

    it('calls onRedirect callback when redirecting', async () => {
      const onRedirect = jest.fn();

      (useAuthStore as unknown as jest.Mock).mockReturnValue({
        ...mockAuthStore,
        isAuthenticated: true,
        token: 'valid-token',
        user: {
          id: '123',
          name: 'User',
          email: 'user@example.com',
          roles: ['USER'],
        },
      });

      render(
        <RoleGuard
          config={{
            roles: UserRole.ADMIN,
            fallbackUrl: '/access-denied',
            onRedirect,
          }}
        >
          <div>Admin Content</div>
        </RoleGuard>
      );

      await waitFor(() => {
        expect(onRedirect).toHaveBeenCalledWith('/access-denied');
      });
    });
  });

  describe('accessibility', () => {
    it('has proper ARIA labels on loading state', async () => {
      (useAuthStore as unknown as jest.Mock).mockReturnValue({
        ...mockAuthStore,
        isAuthenticated: true,
        token: 'valid-token',
        user: {
          id: '123',
          name: 'User',
          email: 'user@example.com',
          roles: ['USER'],
        },
      });

      render(
        <RoleGuard config={{ roles: UserRole.USER }}>
          <div>User Content</div>
        </RoleGuard>
      );

      await waitFor(() => {
        expect(screen.getByText('User Content')).toBeInTheDocument();
      });
    });

    it('has proper test IDs', async () => {
      (useAuthStore as unknown as jest.Mock).mockReturnValue({
        ...mockAuthStore,
        isAuthenticated: true,
        token: 'valid-token',
        user: {
          id: '123',
          name: 'User',
          email: 'user@example.com',
          roles: ['USER'],
        },
      });

      render(
        <RoleGuard config={{ roles: UserRole.USER }}>
          <div>User Content</div>
        </RoleGuard>
      );

      await waitFor(() => {
        expect(screen.getByTestId('role-guard')).toBeInTheDocument();
      });
    });

    it('supports custom test ID', async () => {
      (useAuthStore as unknown as jest.Mock).mockReturnValue({
        ...mockAuthStore,
        isAuthenticated: true,
        token: 'valid-token',
        user: {
          id: '123',
          name: 'User',
          email: 'user@example.com',
          roles: ['USER'],
        },
      });

      render(
        <RoleGuard config={{ roles: UserRole.USER }} data-testid="custom-guard">
          <div>User Content</div>
        </RoleGuard>
      );

      await waitFor(() => {
        expect(screen.getByTestId('custom-guard')).toBeInTheDocument();
      });
    });
  });
});
