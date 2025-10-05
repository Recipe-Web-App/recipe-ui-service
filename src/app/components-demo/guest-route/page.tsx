'use client';

import React, { useState, Suspense } from 'react';
import { GuestOnlyRoute } from '@/components/auth/GuestOnlyRoute';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuthStore } from '@/stores/auth-store';

export default function GuestRouteDemo() {
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
          GuestOnlyRoute Component
        </h1>
        <p className="text-muted-foreground text-lg">
          Route guard component that redirects authenticated users away from
          guest-only pages (like login/register). The inverse of ProtectedRoute.
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

        {/* Guest-Only Content Demo */}
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-medium">Guest-Only Content Demo</h3>
          <p className="text-muted-foreground mb-4 text-sm">
            The content below is wrapped in a GuestOnlyRoute. Try logging in to
            see the redirect behavior.
          </p>

          <div className="bg-muted/50 rounded-lg border p-4">
            <Suspense fallback={<div className="text-sm">Loading...</div>}>
              <GuestOnlyRoute
                config={{
                  redirectUrl: '/recipes',
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
                      🔓 This content is for guests only
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    You can only see this because you are NOT authenticated!
                  </p>
                  <div className="bg-card rounded border p-3">
                    <p className="text-sm font-medium">
                      Login Form Would Go Here
                    </p>
                    <p className="text-muted-foreground mt-1 text-xs">
                      (This is just a demo - no actual login form)
                    </p>
                  </div>
                </div>
              </GuestOnlyRoute>
            </Suspense>
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
                  Inverse Authentication Logic
                </p>
                <p className="text-muted-foreground text-sm">
                  Authenticated users are redirected, unauthenticated users see
                  content
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <span className="text-primary">✓</span>
              <div>
                <p className="text-sm font-medium">Smart Return URL Handling</p>
                <p className="text-muted-foreground text-sm">
                  Extracts returnUrl from query params and redirects to intended
                  destination
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <span className="text-primary">✓</span>
              <div>
                <p className="text-sm font-medium">Safe Redirect Validation</p>
                <p className="text-muted-foreground text-sm">
                  Validates returnUrl to prevent open redirect vulnerabilities
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
                  Customizable Fallback Components
                </p>
                <p className="text-muted-foreground text-sm">
                  Display custom content for authenticated users (before
                  redirect)
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <span className="text-primary">✓</span>
              <div>
                <p className="text-sm font-medium">Event Callbacks</p>
                <p className="text-muted-foreground text-sm">
                  Hooks for redirect and auth check events
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
                <p className="mb-1 text-sm font-medium">redirectUrl</p>
                <p className="text-muted-foreground text-xs">
                  URL to redirect to when user is authenticated (default:
                  &apos;/&apos;)
                </p>
              </div>

              <div className="bg-muted/50 rounded-lg border p-3">
                <p className="mb-1 text-sm font-medium">returnUrlParam</p>
                <p className="text-muted-foreground text-xs">
                  Query parameter to check for return URL (default:
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
                  authenticatedComponent
                </p>
                <p className="text-muted-foreground text-xs">
                  Custom component when user is authenticated (before redirect)
                </p>
              </div>

              <div className="bg-muted/50 rounded-lg border p-3">
                <p className="mb-1 text-sm font-medium">onRedirect</p>
                <p className="text-muted-foreground text-xs">
                  Callback when authenticated user is redirected
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

        {/* Use Cases */}
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-medium">Common Use Cases</h3>
          <div className="space-y-3">
            <div className="bg-muted/50 rounded-lg border p-3">
              <p className="mb-1 text-sm font-medium">Login Pages</p>
              <p className="text-muted-foreground text-xs">
                Prevent authenticated users from seeing login form
              </p>
            </div>

            <div className="bg-muted/50 rounded-lg border p-3">
              <p className="mb-1 text-sm font-medium">Registration Pages</p>
              <p className="text-muted-foreground text-xs">
                Redirect already-logged-in users to app instead of sign-up
              </p>
            </div>

            <div className="bg-muted/50 rounded-lg border p-3">
              <p className="mb-1 text-sm font-medium">Password Reset</p>
              <p className="text-muted-foreground text-xs">
                Users who are logged in don&apos;t need password reset
              </p>
            </div>

            <div className="bg-muted/50 rounded-lg border p-3">
              <p className="mb-1 text-sm font-medium">Welcome/Landing Pages</p>
              <p className="text-muted-foreground text-xs">
                Show different content for authenticated vs guest users
              </p>
            </div>
          </div>
        </Card>

        {/* Code Examples */}
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-medium">Code Examples</h3>
          <div className="space-y-4">
            <div className="bg-muted overflow-x-auto rounded-md p-4 font-mono text-sm">
              <div className="text-muted-foreground mb-2">{`// Basic usage`}</div>
              <div>{`<GuestOnlyRoute>`}</div>
              <div>{`  <LoginPage />`}</div>
              <div>{`</GuestOnlyRoute>`}</div>
            </div>

            <div className="bg-muted overflow-x-auto rounded-md p-4 font-mono text-sm">
              <div className="text-muted-foreground mb-2">
                {`// With custom redirect URL`}
              </div>
              <div>{`<GuestOnlyRoute`}</div>
              <div>{`  config={{`}</div>
              <div>{`    redirectUrl: '/dashboard',`}</div>
              <div>{`    onRedirect: (url) => console.log('Going to:', url)`}</div>
              <div>{`  }}`}</div>
              <div>{`>`}</div>
              <div>{`  <RegisterPage />`}</div>
              <div>{`</GuestOnlyRoute>`}</div>
            </div>

            <div className="bg-muted overflow-x-auto rounded-md p-4 font-mono text-sm">
              <div className="text-muted-foreground mb-2">
                {`// With custom authenticated component`}
              </div>
              <div>{`<GuestOnlyRoute`}</div>
              <div>{`  config={{`}</div>
              <div>{`    authenticatedComponent: <AlreadyLoggedIn />`}</div>
              <div>{`  }}`}</div>
              <div>{`>`}</div>
              <div>{`  <PasswordResetPage />`}</div>
              <div>{`</GuestOnlyRoute>`}</div>
            </div>

            <div className="bg-muted overflow-x-auto rounded-md p-4 font-mono text-sm">
              <div className="text-muted-foreground mb-2">
                {`// Wrap auth layout`}
              </div>
              <div>{`export default function AuthLayout({ children }) {`}</div>
              <div>{`  return (`}</div>
              <div>{`    <Layout variant="minimal">`}</div>
              <div>{`      <GuestOnlyRoute>`}</div>
              <div>{`        {children}`}</div>
              <div>{`      </GuestOnlyRoute>`}</div>
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
