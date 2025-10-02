'use client';

import React, { useState } from 'react';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuthStore } from '@/stores/auth-store';
import { UserRole, RoleMatchStrategy } from '@/types/auth';

export default function RoleGuardDemo() {
  const { isAuthenticated, authUser, setAuthUser, setTokenData, clearAuth } =
    useAuthStore();
  const [showConfig, setShowConfig] = useState(false);

  const handleLogin = (role: 'user' | 'admin' | 'both') => {
    // Simulate login with different roles
    const roles =
      role === 'both'
        ? ['ADMIN', 'USER']
        : role === 'admin'
          ? ['ADMIN']
          : ['USER'];

    setAuthUser({
      user_id: 'demo-user-123',
      username: 'demouser',
      email: 'demo@example.com',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    // Set user with roles on AuthorizedUser
    const state = useAuthStore.getState();
    if ('user' in state) {
      (
        state as {
          user: { id: string; name: string; email: string; roles: string[] };
        }
      ).user = {
        id: 'demo-user-123',
        name: 'Demo User',
        email: 'demo@example.com',
        roles,
      };
    }

    setTokenData({
      access_token: 'demo-access-token',
      token_type: 'Bearer',
      expires_in: 3600,
      refresh_token: 'demo-refresh-token',
    });
  };

  const handleLogout = () => {
    clearAuth();
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100';
      case 'USER':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  const state = useAuthStore.getState();
  const userRoles: string[] =
    'user' in state &&
    state.user &&
    'roles' in state.user &&
    Array.isArray(state.user.roles)
      ? state.user.roles
      : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-foreground mb-2 text-3xl font-bold">
          RoleGuard Component
        </h1>
        <p className="text-muted-foreground text-lg">
          Role-based access control component that restricts content based on
          user roles (ADMIN, USER).
        </p>
      </div>

      <div className="space-y-8">
        {/* Auth & Role Status Card */}
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-medium">
            Authentication & Role Status
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Status:</span>
              <span
                className={`rounded-full px-3 py-1 text-sm ${
                  isAuthenticated
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                }`}
              >
                {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
              </span>
            </div>

            {authUser && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">User:</span>
                <span className="text-muted-foreground text-sm">
                  {authUser.email}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Current Roles:</span>
              <div className="flex gap-2">
                {userRoles.length > 0 ? (
                  userRoles.map((role: string) => (
                    <span
                      key={role}
                      className={`rounded-full px-2 py-1 text-xs ${getRoleBadgeColor(role)}`}
                    >
                      {role}
                    </span>
                  ))
                ) : (
                  <span className="text-muted-foreground text-sm">None</span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {!isAuthenticated ? (
                <>
                  <Button onClick={() => handleLogin('user')} size="sm">
                    Login as USER
                  </Button>
                  <Button
                    onClick={() => handleLogin('admin')}
                    size="sm"
                    variant="secondary"
                  >
                    Login as ADMIN
                  </Button>
                  <Button
                    onClick={() => handleLogin('both')}
                    size="sm"
                    variant="outline"
                  >
                    Login as BOTH
                  </Button>
                </>
              ) : (
                <Button onClick={handleLogout} size="sm" variant="outline">
                  Logout
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Role-Protected Content Demos */}
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-medium">
            Role-Protected Content Demos
          </h3>
          <p className="text-muted-foreground mb-4 text-sm">
            Try logging in with different roles to see how the content changes.
          </p>

          <div className="space-y-6">
            {/* Admin Only */}
            <div className="bg-muted/50 rounded-lg border p-4">
              <h4 className="mb-3 text-sm font-semibold">
                Admin Only (Single Role)
              </h4>
              <RoleGuard
                config={{
                  roles: UserRole.ADMIN,
                  showLoadingState: true,
                  onRoleCheck: (hasRole, roles) =>
                    console.log('Admin check:', hasRole, roles),
                }}
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                    <span className="text-sm font-medium">
                      🔐 Admin-Only Content
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Only users with ADMIN role can see this.
                  </p>
                </div>
              </RoleGuard>
            </div>

            {/* User Only */}
            <div className="bg-muted/50 rounded-lg border p-4">
              <h4 className="mb-3 text-sm font-semibold">
                User Only (Single Role)
              </h4>
              <RoleGuard config={{ roles: UserRole.USER }}>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                    <span className="text-sm font-medium">
                      👤 User-Only Content
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Only users with USER role can see this.
                  </p>
                </div>
              </RoleGuard>
            </div>

            {/* Admin OR User (ANY strategy) */}
            <div className="bg-muted/50 rounded-lg border p-4">
              <h4 className="mb-3 text-sm font-semibold">
                Admin OR User (ANY Strategy - Default)
              </h4>
              <RoleGuard
                config={{
                  roles: [UserRole.ADMIN, UserRole.USER],
                  matchStrategy: RoleMatchStrategy.ANY,
                }}
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span className="text-sm font-medium">
                      🔓 Shared Content (ANY)
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Users with ADMIN OR USER role can see this (needs at least
                    one).
                  </p>
                </div>
              </RoleGuard>
            </div>

            {/* Admin AND User (ALL strategy) */}
            <div className="bg-muted/50 rounded-lg border p-4">
              <h4 className="mb-3 text-sm font-semibold">
                Admin AND User (ALL Strategy)
              </h4>
              <RoleGuard
                config={{
                  roles: [UserRole.ADMIN, UserRole.USER],
                  matchStrategy: RoleMatchStrategy.ALL,
                }}
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                    <span className="text-sm font-medium">
                      🔒 Restricted Content (ALL)
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Users must have BOTH ADMIN AND USER roles to see this.
                  </p>
                </div>
              </RoleGuard>
            </div>
          </div>
        </Card>

        {/* Features */}
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-medium">Features</h3>
          <div className="space-y-3">
            <div className="flex gap-2">
              <span className="text-primary">✓</span>
              <div>
                <p className="text-sm font-medium">Role-Based Authorization</p>
                <p className="text-muted-foreground text-sm">
                  Supports ADMIN and USER roles from database schema
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <span className="text-primary">✓</span>
              <div>
                <p className="text-sm font-medium">Multiple Role Support</p>
                <p className="text-muted-foreground text-sm">
                  Check for single role or array of roles
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <span className="text-primary">✓</span>
              <div>
                <p className="text-sm font-medium">
                  Configurable Matching Strategy
                </p>
                <p className="text-muted-foreground text-sm">
                  ANY (at least one role) or ALL (all roles required)
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <span className="text-primary">✓</span>
              <div>
                <p className="text-sm font-medium">
                  Authentication Check First
                </p>
                <p className="text-muted-foreground text-sm">
                  Verifies authentication before checking roles
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <span className="text-primary">✓</span>
              <div>
                <p className="text-sm font-medium">
                  Customizable Fallback Components
                </p>
                <p className="text-muted-foreground text-sm">
                  Display custom content for unauthorized users
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <span className="text-primary">✓</span>
              <div>
                <p className="text-sm font-medium">Event Callbacks</p>
                <p className="text-muted-foreground text-sm">
                  Hooks for role check and redirect events
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Configuration Options */}
        <Card className="p-6">
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="mb-4 flex w-full items-center justify-between text-left"
          >
            <h3 className="text-lg font-medium">Configuration Options</h3>
            <span className="text-muted-foreground">
              {showConfig ? '▼' : '▶'}
            </span>
          </button>

          {showConfig && (
            <div className="space-y-4">
              <div className="bg-muted/50 rounded-lg border p-3">
                <p className="mb-1 text-sm font-medium">roles</p>
                <p className="text-muted-foreground text-xs">
                  Required role(s) - single UserRole or array of UserRole
                </p>
              </div>

              <div className="bg-muted/50 rounded-lg border p-3">
                <p className="mb-1 text-sm font-medium">matchStrategy</p>
                <p className="text-muted-foreground text-xs">
                  RoleMatchStrategy.ANY (default) or RoleMatchStrategy.ALL
                </p>
              </div>

              <div className="bg-muted/50 rounded-lg border p-3">
                <p className="mb-1 text-sm font-medium">fallbackUrl</p>
                <p className="text-muted-foreground text-xs">
                  URL to redirect when user lacks role (default:
                  &apos;/unauthorized&apos;)
                </p>
              </div>

              <div className="bg-muted/50 rounded-lg border p-3">
                <p className="mb-1 text-sm font-medium">showLoadingState</p>
                <p className="text-muted-foreground text-xs">
                  Show loading spinner while checking roles (default: true)
                </p>
              </div>

              <div className="bg-muted/50 rounded-lg border p-3">
                <p className="mb-1 text-sm font-medium">loadingComponent</p>
                <p className="text-muted-foreground text-xs">
                  Custom loading component to show during role check
                </p>
              </div>

              <div className="bg-muted/50 rounded-lg border p-3">
                <p className="mb-1 text-sm font-medium">
                  unauthorizedComponent
                </p>
                <p className="text-muted-foreground text-xs">
                  Custom component when user lacks required role
                </p>
              </div>

              <div className="bg-muted/50 rounded-lg border p-3">
                <p className="mb-1 text-sm font-medium">onRoleCheck</p>
                <p className="text-muted-foreground text-xs">
                  Callback when role check completes: (hasRole, userRoles) =&gt;
                  void
                </p>
              </div>

              <div className="bg-muted/50 rounded-lg border p-3">
                <p className="mb-1 text-sm font-medium">onRedirect</p>
                <p className="text-muted-foreground text-xs">
                  Callback when user is redirected: (url) =&gt; void
                </p>
              </div>
            </div>
          )}
        </Card>

        {/* Use Cases */}
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-medium">Common Use Cases</h3>
          <div className="space-y-3">
            <div className="bg-muted/50 rounded-lg border p-3">
              <p className="mb-1 text-sm font-medium">Admin Dashboard</p>
              <p className="text-muted-foreground text-xs">
                Restrict admin-only pages and features
              </p>
            </div>

            <div className="bg-muted/50 rounded-lg border p-3">
              <p className="mb-1 text-sm font-medium">User Settings</p>
              <p className="text-muted-foreground text-xs">
                Allow only regular users to access certain features
              </p>
            </div>

            <div className="bg-muted/50 rounded-lg border p-3">
              <p className="mb-1 text-sm font-medium">Mixed Permissions</p>
              <p className="text-muted-foreground text-xs">
                Content accessible to multiple role types (ANY strategy)
              </p>
            </div>

            <div className="bg-muted/50 rounded-lg border p-3">
              <p className="mb-1 text-sm font-medium">Super Admin Features</p>
              <p className="text-muted-foreground text-xs">
                Require both ADMIN and USER roles (ALL strategy)
              </p>
            </div>
          </div>
        </Card>

        {/* Code Examples */}
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-medium">Code Examples</h3>
          <div className="space-y-4">
            <div className="bg-muted overflow-x-auto rounded-md p-4 font-mono text-sm">
              <div className="text-muted-foreground mb-2">
                {`// Admin-only content`}
              </div>
              <div>{`<RoleGuard config={{ roles: UserRole.ADMIN }}>`}</div>
              <div>{`  <AdminDashboard />`}</div>
              <div>{`</RoleGuard>`}</div>
            </div>

            <div className="bg-muted overflow-x-auto rounded-md p-4 font-mono text-sm">
              <div className="text-muted-foreground mb-2">
                {`// Multiple roles with ANY strategy (default)`}
              </div>
              <div>{`<RoleGuard`}</div>
              <div>{`  config={{`}</div>
              <div>{`    roles: [UserRole.ADMIN, UserRole.USER],`}</div>
              <div>{`    matchStrategy: RoleMatchStrategy.ANY`}</div>
              <div>{`  }}`}</div>
              <div>{`>`}</div>
              <div>{`  <SharedContent />`}</div>
              <div>{`</RoleGuard>`}</div>
            </div>

            <div className="bg-muted overflow-x-auto rounded-md p-4 font-mono text-sm">
              <div className="text-muted-foreground mb-2">
                {`// Require all roles (ALL strategy)`}
              </div>
              <div>{`<RoleGuard`}</div>
              <div>{`  config={{`}</div>
              <div>{`    roles: [UserRole.ADMIN, UserRole.USER],`}</div>
              <div>{`    matchStrategy: RoleMatchStrategy.ALL`}</div>
              <div>{`  }}`}</div>
              <div>{`>`}</div>
              <div>{`  <RestrictedContent />`}</div>
              <div>{`</RoleGuard>`}</div>
            </div>

            <div className="bg-muted overflow-x-auto rounded-md p-4 font-mono text-sm">
              <div className="text-muted-foreground mb-2">
                {`// With custom unauthorized component`}
              </div>
              <div>{`<RoleGuard`}</div>
              <div>{`  config={{`}</div>
              <div>{`    roles: UserRole.ADMIN,`}</div>
              <div>{`    unauthorizedComponent: <AccessDenied />`}</div>
              <div>{`  }}`}</div>
              <div>{`>`}</div>
              <div>{`  <AdminPanel />`}</div>
              <div>{`</RoleGuard>`}</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
