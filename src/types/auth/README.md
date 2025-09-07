# Auth Service Integration

This directory contains TypeScript definitions for the Auth Service integration, based on the OpenAPI specification.

## Structure

```text
src/types/auth/
├── client.ts      # OAuth2 client registration and management
├── health.ts      # Health check and monitoring types
├── oauth2.ts      # OAuth2 flow types and responses
├── user.ts        # User authentication and management
└── index.ts       # Re-exports all types
```

## Key Features

### OAuth2 Support

- **Authorization Code Flow with PKCE**: Secure OAuth2 flow for web applications
- **Client Credentials Flow**: Service-to-service authentication
- **Token Management**: Access tokens, refresh tokens, and expiration handling
- **Token Introspection**: Validate and inspect token metadata
- **Token Revocation**: Securely revoke access and refresh tokens

### User Management

- **Registration**: User account creation with validation
- **Login/Logout**: Secure authentication with JWT tokens
- **Password Reset**: Email-based password reset flow
- **Token Refresh**: Automatic token renewal

### Health Monitoring

- **Health Checks**: Service health status monitoring
- **Readiness/Liveness**: Kubernetes-compatible health endpoints
- **Metrics**: Prometheus metrics for observability

## API Client Structure

```text
src/lib/api/auth/
├── client.ts      # Base Axios client for auth service
├── health.ts      # Health monitoring endpoints
├── oauth2.ts      # OAuth2 flow implementations
├── pkce.ts        # PKCE utility functions
├── user-auth.ts   # User authentication endpoints
└── index.ts       # Re-exports all APIs
```

## TanStack Query Hooks

```text
src/hooks/auth/
├── useAuth.ts           # Login, logout, token refresh, user info
├── useOAuth2.ts         # OAuth2 authorization flow
├── usePasswordReset.ts  # Password reset workflow
├── useRegister.ts       # User registration
└── index.ts            # Re-exports all hooks
```

## Usage Examples

### Login Flow

```typescript
import { useLogin } from '@/hooks/auth';

const LoginComponent = () => {
  const loginMutation = useLogin();

  const handleLogin = async (email: string, password: string) => {
    try {
      await loginMutation.mutateAsync({ email, password });
      // User is automatically logged in via the auth store
    } catch (error) {
      console.error('Login failed:', error);
    }
  };
};
```

### OAuth2 Authorization Flow

```typescript
import { useBuildAuthorizeUrl, useExchangeCodeForToken } from '@/hooks/auth';

const OAuth2Component = () => {
  const buildUrlMutation = useBuildAuthorizeUrl();
  const exchangeCodeMutation = useExchangeCodeForToken();

  const startOAuth2Flow = async () => {
    const { url, codeVerifier, state } = await buildUrlMutation.mutateAsync({
      clientId: 'your-client-id',
      redirectUri: 'http://localhost:3000/callback',
      scope: 'openid profile user:read',
    });

    // Store PKCE data in auth store
    // Redirect user to authorization URL
    window.location.href = url;
  };

  // In callback handler:
  const handleCallback = async (code: string, state: string) => {
    await exchangeCodeMutation.mutateAsync({
      grant_type: 'authorization_code',
      code,
      redirect_uri: 'http://localhost:3000/callback',
      client_id: 'your-client-id',
      code_verifier: storedCodeVerifier,
    });
  };
};
```

### Token Refresh

```typescript
import { useRefreshToken } from '@/hooks/auth';
import { useAuthStore } from '@/stores/auth-store';

const TokenManager = () => {
  const { refreshToken, isTokenExpired } = useAuthStore();
  const refreshMutation = useRefreshToken();

  const refreshTokenIfNeeded = async () => {
    if (isTokenExpired() && refreshToken) {
      await refreshMutation.mutateAsync({ refresh_token: refreshToken });
    }
  };
};
```

## Environment Variables

Make sure to set the following environment variable:

```bash
NEXT_PUBLIC_AUTH_SERVICE_URL=http://localhost:8080/api/v1/auth
```

## Type Safety

All API calls are fully typed with proper TypeScript interfaces generated from the OpenAPI specification. This ensures:

- **Compile-time type checking**: Catch type mismatches during development
- **IntelliSense support**: Full autocomplete in your IDE
- **Runtime safety**: Proper error handling with typed error responses
- **API contract enforcement**: Ensure frontend stays in sync with backend changes
