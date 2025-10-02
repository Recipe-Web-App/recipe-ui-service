'use client';

import React, { useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuthStore } from '@/stores/auth-store';

export default function ProtectedRouteDemo() {
  const { isAuthenticated, authUser, setAuthUser, setTokenData, clearAuth } =
    useAuthStore();
  const [showConfig, setShowConfig] = useState(false);

  const handleLogin = () => {
    // Simulate login
    setAuthUser({
      user_id: 'demo-user-123',
      username: 'demouser',
      email: 'demo@example.com',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    setTokenData({
      access_token: 'demo-access-token',
      token_type: 'Bearer',
      expires_in: 3600, // 1 hour
      refresh_token: 'demo-refresh-token',
    });
  };

  const handleLogout = () => {
    clearAuth();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-foreground mb-2 text-3xl font-bold">
          ProtectedRoute Component
        </h1>
        <p className="text-muted-foreground text-lg">
          Route guard component that ensures users are authenticated before
          accessing protected content. Handles authentication checks, loading
          states, and redirects.
        </p>
      </div>

      <div className="space-y-8">
        {/* Auth Status Card */}
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-medium">Authentication Status</h3>
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

            <div className="flex gap-2">
              {!isAuthenticated ? (
                <Button onClick={handleLogin} size="sm">
                  Simulate Login
                </Button>
              ) : (
                <Button onClick={handleLogout} size="sm" variant="outline">
                  Logout
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Protected Content Demo */}
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-medium">Protected Content Demo</h3>
          <p className="text-muted-foreground mb-4 text-sm">
            The content below is wrapped in a ProtectedRoute. Try logging out to
            see the redirect behavior.
          </p>

          <div className="bg-muted/50 rounded-lg border p-4">
            <ProtectedRoute
              config={{
                showLoadingState: true,
                onAuthCheck: authenticated =>
                  console.log('Auth check:', authenticated),
                onRedirect: url => console.log('Redirecting to:', url),
              }}
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="bg-primary h-2 w-2 rounded-full"></div>
                  <span className="text-sm font-medium">
                    🔒 This content is protected
                  </span>
                </div>
                <p className="text-muted-foreground text-sm">
                  You can only see this because you are authenticated!
                </p>
                <div className="bg-card rounded border p-3">
                  <p className="text-sm">
                    <strong>User ID:</strong> {authUser?.user_id}
                  </p>
                  <p className="text-sm">
                    <strong>Email:</strong> {authUser?.email}
                  </p>
                </div>
              </div>
            </ProtectedRoute>
          </div>
        </Card>

        {/* Features */}
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-medium">Features</h3>
          <div className="space-y-3">
            <div className="flex gap-2">
              <span className="text-primary">✓</span>
              <div>
                <p className="text-sm font-medium">
                  Authentication State Validation
                </p>
                <p className="text-muted-foreground text-sm">
                  Checks both authentication flag and token validity
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <span className="text-primary">✓</span>
              <div>
                <p className="text-sm font-medium">Token Expiration Checking</p>
                <p className="text-muted-foreground text-sm">
                  Automatically validates token expiration with 5-minute buffer
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <span className="text-primary">✓</span>
              <div>
                <p className="text-sm font-medium">
                  Automatic Login Redirect with Return URL
                </p>
                <p className="text-muted-foreground text-sm">
                  Stores intended destination for post-login redirect
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <span className="text-primary">✓</span>
              <div>
                <p className="text-sm font-medium">
                  Configurable Loading States
                </p>
                <p className="text-muted-foreground text-sm">
                  Show spinner or custom loading component during auth check
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <span className="text-primary">✓</span>
              <div>
                <p className="text-sm font-medium">
                  Safe URL Redirect Validation
                </p>
                <p className="text-muted-foreground text-sm">
                  Prevents open redirect vulnerabilities
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
                  Display custom unauthorized or loading content
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
                <p className="mb-1 text-sm font-medium">loginUrl</p>
                <p className="text-muted-foreground text-xs">
                  URL to redirect to when user is not authenticated (default:
                  &apos;/login&apos;)
                </p>
              </div>

              <div className="bg-muted/50 rounded-lg border p-3">
                <p className="mb-1 text-sm font-medium">returnUrlParam</p>
                <p className="text-muted-foreground text-xs">
                  Query parameter name for storing return URL (default:
                  &apos;returnUrl&apos;)
                </p>
              </div>

              <div className="bg-muted/50 rounded-lg border p-3">
                <p className="mb-1 text-sm font-medium">showLoadingState</p>
                <p className="text-muted-foreground text-xs">
                  Show loading spinner while checking authentication (default:
                  true)
                </p>
              </div>

              <div className="bg-muted/50 rounded-lg border p-3">
                <p className="mb-1 text-sm font-medium">loadingComponent</p>
                <p className="text-muted-foreground text-xs">
                  Custom loading component to show during auth check
                </p>
              </div>

              <div className="bg-muted/50 rounded-lg border p-3">
                <p className="mb-1 text-sm font-medium">
                  unauthorizedComponent
                </p>
                <p className="text-muted-foreground text-xs">
                  Custom unauthorized component when not authenticated
                </p>
              </div>

              <div className="bg-muted/50 rounded-lg border p-3">
                <p className="mb-1 text-sm font-medium">onRedirect</p>
                <p className="text-muted-foreground text-xs">
                  Callback when user is redirected to login
                </p>
              </div>

              <div className="bg-muted/50 rounded-lg border p-3">
                <p className="mb-1 text-sm font-medium">onAuthCheck</p>
                <p className="text-muted-foreground text-xs">
                  Callback when authentication check completes
                </p>
              </div>
            </div>
          )}
        </Card>

        {/* Code Examples */}
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-medium">Code Examples</h3>
          <div className="space-y-4">
            <div className="bg-muted overflow-x-auto rounded-md p-4 font-mono text-sm">
              <div className="text-muted-foreground mb-2">{`// Basic usage`}</div>
              <div>{`<ProtectedRoute>`}</div>
              <div>{`  <DashboardPage />`}</div>
              <div>{`</ProtectedRoute>`}</div>
            </div>

            <div className="bg-muted overflow-x-auto rounded-md p-4 font-mono text-sm">
              <div className="text-muted-foreground mb-2">
                {`// With custom configuration`}
              </div>
              <div>{`<ProtectedRoute`}</div>
              <div>{`  config={{`}</div>
              <div>{`    loginUrl: '/auth/login',`}</div>
              <div>{`    returnUrlParam: 'redirect',`}</div>
              <div>{`    onRedirect: (url) => console.log('Redirecting:', url)`}</div>
              <div>{`  }}`}</div>
              <div>{`>`}</div>
              <div>{`  <SettingsPage />`}</div>
              <div>{`</ProtectedRoute>`}</div>
            </div>

            <div className="bg-muted overflow-x-auto rounded-md p-4 font-mono text-sm">
              <div className="text-muted-foreground mb-2">
                {`// With custom loading component`}
              </div>
              <div>{`<ProtectedRoute`}</div>
              <div>{`  config={{`}</div>
              <div>{`    loadingComponent: <CustomLoader />`}</div>
              <div>{`  }}`}</div>
              <div>{`>`}</div>
              <div>{`  <ProfilePage />`}</div>
              <div>{`</ProtectedRoute>`}</div>
            </div>

            <div className="bg-muted overflow-x-auto rounded-md p-4 font-mono text-sm">
              <div className="text-muted-foreground mb-2">
                {`// Wrap entire layout`}
              </div>
              <div>{`export default function MainLayout({ children }) {`}</div>
              <div>{`  return (`}</div>
              <div>{`    <Layout variant="default">`}</div>
              <div>{`      <ProtectedRoute>`}</div>
              <div>{`        {children}`}</div>
              <div>{`      </ProtectedRoute>`}</div>
              <div>{`    </Layout>`}</div>
              <div>{`  );`}</div>
              <div>{`}`}</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
