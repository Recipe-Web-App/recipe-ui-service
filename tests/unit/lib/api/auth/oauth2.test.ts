import { oauth2Api } from '@/lib/api/auth/oauth2';
import { authClient } from '@/lib/api/auth/client';
import type {
  TokenResponse,
  OAuthDiscovery,
  IntrospectResponse,
  AuthorizationCodeRequest,
  ClientCredentialsRequest,
  RefreshTokenRequest,
  ClientRegistrationRequest,
  ClientRegistrationResponse,
  ClientDetails,
  ClientSecretRotationRequest,
  ClientSecretRotationResponse,
  UserInfo,
} from '@/types/auth';
import { AxiosHeaders } from 'axios';

// Mock the auth client
jest.mock('@/lib/api/auth/client', () => ({
  authClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    defaults: { baseURL: 'http://localhost:8080/api/v1/auth' },
  },
  handleAuthApiError: jest.fn().mockImplementation(error => {
    throw new Error(error.message || 'API Error');
  }),
}));

const mockedAuthClient = authClient as jest.Mocked<typeof authClient>;

// Mock generatePKCE
jest.mock('@/lib/api/auth/pkce', () => ({
  generatePKCE: jest.fn(),
  generateState: jest.fn(),
}));

import { generatePKCE, generateState } from '@/lib/api/auth/pkce';
const mockedGeneratePKCE = generatePKCE as jest.MockedFunction<
  typeof generatePKCE
>;
const mockedGenerateState = generateState as jest.MockedFunction<
  typeof generateState
>;

describe('OAuth2 API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedAuthClient.defaults = {
      baseURL: 'http://localhost:8080/api/v1/auth',
    } as any;
  });

  describe('getDiscoveryDocument', () => {
    it('should fetch OAuth2 discovery document', async () => {
      const mockDiscovery: OAuthDiscovery = {
        issuer: 'http://localhost:8080',
        authorization_endpoint: 'http://localhost:8080/oauth2/authorize',
        token_endpoint: 'http://localhost:8080/oauth2/token',
        response_types_supported: ['code'],
        grant_types_supported: ['authorization_code', 'refresh_token'],
      };

      mockedAuthClient.get.mockResolvedValue({ data: mockDiscovery });

      const result = await oauth2Api.getDiscoveryDocument();

      expect(mockedAuthClient.get).toHaveBeenCalledWith(
        '/.well-known/oauth-authorization-server'
      );
      expect(result).toEqual(mockDiscovery);
    });

    it('should handle discovery document fetch error', async () => {
      const error = new Error('Discovery failed');
      mockedAuthClient.get.mockRejectedValue(error);

      await expect(oauth2Api.getDiscoveryDocument()).rejects.toThrow(
        'Discovery failed'
      );
    });
  });

  describe('buildAuthorizeUrl', () => {
    beforeEach(() => {
      mockedGeneratePKCE.mockResolvedValue({
        codeVerifier: 'test-verifier',
        codeChallenge: 'test-challenge',
      });
      mockedGenerateState.mockReturnValue('test-state');
    });

    it('should build authorize URL with all parameters', async () => {
      const params = {
        clientId: 'test-client',
        redirectUri: 'http://localhost:3000/callback',
        scope: 'openid profile',
        state: 'custom-state',
      };

      const result = await oauth2Api.buildAuthorizeUrl(params);

      expect(result.codeVerifier).toBe('test-verifier');
      expect(result.state).toBe('custom-state');
      expect(result.url).toContain('response_type=code');
      expect(result.url).toContain('client_id=test-client');
      expect(result.url).toContain(
        'redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fcallback'
      );
      expect(result.url).toContain('scope=openid+profile');
      expect(result.url).toContain('state=custom-state');
      expect(result.url).toContain('code_challenge=test-challenge');
      expect(result.url).toContain('code_challenge_method=S256');
    });

    it('should build authorize URL with generated state', async () => {
      const params = {
        clientId: 'test-client',
        redirectUri: 'http://localhost:3000/callback',
      };

      const result = await oauth2Api.buildAuthorizeUrl(params);

      expect(result.state).toBe('test-state');
      expect(mockedGenerateState).toHaveBeenCalled();
    });

    it('should build authorize URL without optional parameters', async () => {
      const params = {
        clientId: 'test-client',
        redirectUri: 'http://localhost:3000/callback',
      };

      const result = await oauth2Api.buildAuthorizeUrl(params);

      expect(result.url).toContain('client_id=test-client');
      expect(result.url).not.toContain('scope=');
    });
  });

  describe('exchangeCodeForToken', () => {
    it('should exchange authorization code for token', async () => {
      const mockToken: TokenResponse = {
        access_token: 'test-access-token',
        token_type: 'Bearer',
        expires_in: 3600,
        refresh_token: 'test-refresh-token',
      };

      const request: AuthorizationCodeRequest = {
        grant_type: 'authorization_code',
        code: 'auth-code',
        redirect_uri: 'http://localhost:3000/callback',
        client_id: 'test-client',
        code_verifier: 'code-verifier',
      };

      mockedAuthClient.post.mockResolvedValue({ data: mockToken });

      const result = await oauth2Api.exchangeCodeForToken(request);

      expect(mockedAuthClient.post).toHaveBeenCalledWith(
        '/oauth2/token',
        request,
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          transformRequest: expect.any(Array),
        }
      );
      expect(result).toEqual(mockToken);
    });

    it('should handle token exchange error', async () => {
      const request: AuthorizationCodeRequest = {
        grant_type: 'authorization_code',
        code: 'invalid-code',
        redirect_uri: 'http://localhost:3000/callback',
        client_id: 'test-client',
        code_verifier: 'code-verifier',
      };

      const error = new Error('Invalid code');
      mockedAuthClient.post.mockRejectedValue(error);

      await expect(oauth2Api.exchangeCodeForToken(request)).rejects.toThrow(
        'Invalid code'
      );
    });
  });

  describe('clientCredentialsToken', () => {
    it('should get client credentials token', async () => {
      const mockToken: TokenResponse = {
        access_token: 'client-token',
        token_type: 'Bearer',
        expires_in: 3600,
      };

      const request: ClientCredentialsRequest = {
        grant_type: 'client_credentials',
        scope: 'api:read',
      };

      mockedAuthClient.post.mockResolvedValue({ data: mockToken });

      const result = await oauth2Api.clientCredentialsToken(request);

      expect(mockedAuthClient.post).toHaveBeenCalledWith(
        '/oauth2/token',
        request,
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          transformRequest: expect.any(Array),
        }
      );
      expect(result).toEqual(mockToken);
    });

    it('should handle client credentials token error', async () => {
      const request: ClientCredentialsRequest = {
        grant_type: 'client_credentials',
        scope: 'api:read',
      };

      const error = new Error('Client credentials failed');
      mockedAuthClient.post.mockRejectedValue(error);

      await expect(oauth2Api.clientCredentialsToken(request)).rejects.toThrow(
        'Client credentials failed'
      );
    });
  });

  describe('refreshToken', () => {
    it('should refresh token', async () => {
      const mockToken: TokenResponse = {
        access_token: 'new-access-token',
        token_type: 'Bearer',
        expires_in: 3600,
      };

      const request: RefreshTokenRequest = {
        grant_type: 'refresh_token',
        refresh_token: 'refresh-token',
      };

      mockedAuthClient.post.mockResolvedValue({ data: mockToken });

      const result = await oauth2Api.refreshToken(request);

      expect(mockedAuthClient.post).toHaveBeenCalledWith(
        '/oauth2/token',
        request,
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          transformRequest: expect.any(Array),
        }
      );
      expect(result).toEqual(mockToken);
    });

    it('should handle refresh token error', async () => {
      const request: RefreshTokenRequest = {
        grant_type: 'refresh_token',
        refresh_token: 'invalid-refresh-token',
      };

      const error = new Error('Invalid refresh token');
      mockedAuthClient.post.mockRejectedValue(error);

      await expect(oauth2Api.refreshToken(request)).rejects.toThrow(
        'Invalid refresh token'
      );
    });
  });

  describe('introspectToken', () => {
    it('should introspect token', async () => {
      const mockIntrospection: IntrospectResponse = {
        active: true,
        client_id: 'test-client',
        sub: 'user123',
        exp: 1640995200,
        scope: 'openid profile',
      };

      mockedAuthClient.post.mockResolvedValue({ data: mockIntrospection });

      const result = await oauth2Api.introspectToken({ token: 'test-token' });

      expect(mockedAuthClient.post).toHaveBeenCalledWith(
        '/oauth2/introspect',
        { token: 'test-token' },
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          transformRequest: expect.any(Array),
        }
      );
      expect(result).toEqual(mockIntrospection);
    });

    it('should introspect token with hint', async () => {
      const mockIntrospection: IntrospectResponse = {
        active: false,
      };

      mockedAuthClient.post.mockResolvedValue({ data: mockIntrospection });

      const result = await oauth2Api.introspectToken({
        token: 'expired-token',
        token_type_hint: 'access_token',
      });

      expect(result).toEqual(mockIntrospection);
    });

    it('should handle introspect token error', async () => {
      const error = new Error('Introspection failed');
      mockedAuthClient.post.mockRejectedValue(error);

      await expect(
        oauth2Api.introspectToken({ token: 'bad-token' })
      ).rejects.toThrow('Introspection failed');
    });
  });

  describe('revokeToken', () => {
    it('should revoke token', async () => {
      mockedAuthClient.post.mockResolvedValue({});

      await oauth2Api.revokeToken({ token: 'token-to-revoke' });

      expect(mockedAuthClient.post).toHaveBeenCalledWith(
        '/oauth2/revoke',
        { token: 'token-to-revoke' },
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          transformRequest: expect.any(Array),
        }
      );
    });

    it('should revoke token with hint', async () => {
      mockedAuthClient.post.mockResolvedValue({});

      await oauth2Api.revokeToken({
        token: 'refresh-token',
        token_type_hint: 'refresh_token',
      });

      expect(mockedAuthClient.post).toHaveBeenCalledWith(
        '/oauth2/revoke',
        {
          token: 'refresh-token',
          token_type_hint: 'refresh_token',
        },
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          transformRequest: expect.any(Array),
        }
      );
    });

    it('should handle revoke token error', async () => {
      const error = new Error('Revoke failed');
      mockedAuthClient.post.mockRejectedValue(error);

      await expect(
        oauth2Api.revokeToken({ token: 'bad-token' })
      ).rejects.toThrow('Revoke failed');
    });
  });

  describe('getUserInfo', () => {
    it('should get user info', async () => {
      const mockUserInfo = {
        sub: 'user123',
        email: 'user@example.com',
        name: 'Test User',
      };

      mockedAuthClient.get.mockResolvedValue({ data: mockUserInfo });

      const result = await oauth2Api.getUserInfo();

      expect(mockedAuthClient.get).toHaveBeenCalledWith('/oauth2/userinfo');
      expect(result).toEqual(mockUserInfo);
    });

    it('should handle user info fetch error', async () => {
      const error = new Error('Unauthorized');
      mockedAuthClient.get.mockRejectedValue(error);

      await expect(oauth2Api.getUserInfo()).rejects.toThrow('Unauthorized');
    });
  });

  describe('Transform Request Functionality', () => {
    it('should transform request data to URLSearchParams for token endpoints', async () => {
      const mockToken: TokenResponse = {
        access_token: 'test-token',
        token_type: 'Bearer',
        expires_in: 3600,
      };

      const request = {
        grant_type: 'authorization_code',
        code: 'test-code',
        redirect_uri: 'http://localhost:3000/callback',
      };

      let transformedData: string | undefined;
      mockedAuthClient.post.mockImplementation(async (_url, data, config) => {
        if (
          config?.transformRequest &&
          Array.isArray(config.transformRequest)
        ) {
          transformedData = config.transformRequest[0].call(
            { headers: new AxiosHeaders() } as any,
            data,
            new AxiosHeaders()
          );
        }
        return { data: mockToken };
      });

      await oauth2Api.exchangeCodeForToken(request as any);

      expect(transformedData).toBe(
        'grant_type=authorization_code&code=test-code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fcallback'
      );
    });

    it('should transform request data for introspect endpoint', async () => {
      const mockIntrospection: IntrospectResponse = {
        active: true,
      };

      const request = {
        token: 'test-token',
        token_type_hint: 'access_token' as const,
      };

      let transformedData: string | undefined;
      mockedAuthClient.post.mockImplementation(async (_url, data, config) => {
        if (
          config?.transformRequest &&
          Array.isArray(config.transformRequest)
        ) {
          transformedData = config.transformRequest[0].call(
            { headers: new AxiosHeaders() } as any,
            data,
            new AxiosHeaders()
          );
        }
        return { data: mockIntrospection };
      });

      await oauth2Api.introspectToken(request);

      expect(transformedData).toBe(
        'token=test-token&token_type_hint=access_token'
      );
    });

    it('should transform request data for revoke endpoint', async () => {
      const request = {
        token: 'test-token',
        token_type_hint: 'refresh_token' as const,
      };

      let transformedData: string | undefined;
      mockedAuthClient.post.mockImplementation(async (_url, data, config) => {
        if (
          config?.transformRequest &&
          Array.isArray(config.transformRequest)
        ) {
          transformedData = config.transformRequest[0].call(
            { headers: new AxiosHeaders() } as any,
            data,
            new AxiosHeaders()
          );
        }
        return { data: {} };
      });

      await oauth2Api.revokeToken(request);

      expect(transformedData).toBe(
        'token=test-token&token_type_hint=refresh_token'
      );
    });

    it('should transform request data for client credentials endpoint', async () => {
      const mockToken: TokenResponse = {
        access_token: 'client-token',
        token_type: 'Bearer',
        expires_in: 3600,
      };

      const request: ClientCredentialsRequest = {
        grant_type: 'client_credentials',
        scope: 'api:read',
      };

      let transformedData: string | undefined;
      mockedAuthClient.post.mockImplementation(async (_url, data, config) => {
        if (
          config?.transformRequest &&
          Array.isArray(config.transformRequest)
        ) {
          transformedData = config.transformRequest[0].call(
            { headers: new AxiosHeaders() } as any,
            data,
            new AxiosHeaders()
          );
        }
        return { data: mockToken };
      });

      await oauth2Api.clientCredentialsToken(request);

      expect(transformedData).toBe(
        'grant_type=client_credentials&scope=api%3Aread'
      );
    });

    it('should transform request data for refresh token endpoint', async () => {
      const mockToken: TokenResponse = {
        access_token: 'new-access-token',
        token_type: 'Bearer',
        expires_in: 3600,
      };

      const request: RefreshTokenRequest = {
        grant_type: 'refresh_token',
        refresh_token: 'refresh-token',
      };

      let transformedData: string | undefined;
      mockedAuthClient.post.mockImplementation(async (_url, data, config) => {
        if (
          config?.transformRequest &&
          Array.isArray(config.transformRequest)
        ) {
          transformedData = config.transformRequest[0].call(
            { headers: new AxiosHeaders() } as any,
            data,
            new AxiosHeaders()
          );
        }
        return { data: mockToken };
      });

      await oauth2Api.refreshToken(request);

      expect(transformedData).toBe(
        'grant_type=refresh_token&refresh_token=refresh-token'
      );
    });

    it('should transform request data for getUserInfoPost endpoint', async () => {
      const mockUserInfo = {
        sub: 'user123',
        email: 'user@example.com',
      };

      let transformedData: string | undefined;
      mockedAuthClient.post.mockImplementation(async (_url, data, config) => {
        if (
          config?.transformRequest &&
          Array.isArray(config.transformRequest)
        ) {
          transformedData = config.transformRequest[0].call(
            { headers: new AxiosHeaders() } as any,
            data,
            new AxiosHeaders()
          );
        }
        return { data: mockUserInfo };
      });

      await oauth2Api.getUserInfoPost('test-token');

      expect(transformedData).toBe('access_token=test-token');
    });

    it('should transform request data for authorizePost endpoint', async () => {
      const params = {
        response_type: 'code' as const,
        client_id: 'test-client',
        redirect_uri: 'http://localhost:3000/callback',
        code_challenge: 'test-challenge',
        code_challenge_method: 'S256' as const,
      };

      let transformedData: string | undefined;
      mockedAuthClient.post.mockImplementation(async (_url, data, config) => {
        if (
          config?.transformRequest &&
          Array.isArray(config.transformRequest)
        ) {
          transformedData = config.transformRequest[0].call(
            { headers: new AxiosHeaders() } as any,
            data,
            new AxiosHeaders()
          );
        }
        return { data: {} };
      });

      await oauth2Api.authorizePost(params);

      expect(transformedData).toContain('response_type=code');
      expect(transformedData).toContain('client_id=test-client');
      expect(transformedData).toContain(
        'redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fcallback'
      );
      expect(transformedData).toContain('code_challenge=test-challenge');
      expect(transformedData).toContain('code_challenge_method=S256');
    });
  });

  describe('getUserInfoPost', () => {
    it('should get user info via POST with access token', async () => {
      const mockUserInfo: UserInfo = {
        sub: 'user123',
        email: 'user@example.com',
        name: 'Test User',
      };

      mockedAuthClient.post.mockResolvedValue({ data: mockUserInfo });

      const result = await oauth2Api.getUserInfoPost('test-access-token');

      expect(mockedAuthClient.post).toHaveBeenCalledWith(
        '/oauth2/userinfo',
        { access_token: 'test-access-token' },
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          transformRequest: expect.any(Array),
        }
      );
      expect(result).toEqual(mockUserInfo);
    });

    it('should get user info via POST without access token', async () => {
      const mockUserInfo: UserInfo = {
        sub: 'user123',
        email: 'user@example.com',
      };

      mockedAuthClient.post.mockResolvedValue({ data: mockUserInfo });

      const result = await oauth2Api.getUserInfoPost();

      expect(mockedAuthClient.post).toHaveBeenCalledWith(
        '/oauth2/userinfo',
        {},
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          transformRequest: expect.any(Array),
        }
      );
      expect(result).toEqual(mockUserInfo);
    });

    it('should handle user info POST error', async () => {
      const error = new Error('Unauthorized');
      mockedAuthClient.post.mockRejectedValue(error);

      await expect(oauth2Api.getUserInfoPost('bad-token')).rejects.toThrow(
        'Unauthorized'
      );
    });
  });

  describe('authorizePost', () => {
    it('should send authorization request via POST', async () => {
      const params = {
        response_type: 'code' as const,
        client_id: 'test-client',
        redirect_uri: 'http://localhost:3000/callback',
        scope: 'openid profile',
        state: 'test-state',
        code_challenge: 'test-challenge',
        code_challenge_method: 'S256' as const,
      };

      mockedAuthClient.post.mockResolvedValue({});

      await oauth2Api.authorizePost(params);

      expect(mockedAuthClient.post).toHaveBeenCalledWith(
        '/oauth2/authorize',
        params,
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          transformRequest: expect.any(Array),
          maxRedirects: 0,
          validateStatus: expect.any(Function),
        }
      );
    });

    it('should handle authorize POST error', async () => {
      const params = {
        response_type: 'code' as const,
        client_id: 'invalid-client',
        redirect_uri: 'http://localhost:3000/callback',
        code_challenge: 'test-challenge',
      };

      const error = new Error('Invalid client');
      mockedAuthClient.post.mockRejectedValue(error);

      await expect(oauth2Api.authorizePost(params)).rejects.toThrow(
        'Invalid client'
      );
    });
  });

  describe('registerClient', () => {
    it('should register a new OAuth2 client', async () => {
      const request: ClientRegistrationRequest = {
        name: 'Test App',
        redirect_uris: ['http://localhost:3000/callback'],
        scopes: ['openid', 'profile'],
        grant_types: ['authorization_code', 'refresh_token'],
      };

      const mockResponse: ClientRegistrationResponse = {
        client_id: 'new-client-id',
        client_secret: 'new-client-secret', // pragma: allowlist secret
        name: 'Test App',
        redirect_uris: ['http://localhost:3000/callback'],
        scopes: ['openid', 'profile'],
        grant_types: ['authorization_code', 'refresh_token'],
      };

      mockedAuthClient.post.mockResolvedValue({ data: mockResponse });

      const result = await oauth2Api.registerClient(request);

      expect(mockedAuthClient.post).toHaveBeenCalledWith(
        '/oauth/clients',
        request
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle client registration error', async () => {
      const request: ClientRegistrationRequest = {
        name: 'Test App',
        redirect_uris: ['http://localhost:3000/callback'],
      };

      const error = new Error('Registration failed');
      mockedAuthClient.post.mockRejectedValue(error);

      await expect(oauth2Api.registerClient(request)).rejects.toThrow(
        'Registration failed'
      );
    });
  });

  describe('getClient', () => {
    it('should get OAuth2 client details', async () => {
      const mockClient: ClientDetails = {
        client_id: 'test-client-id',
        name: 'Test App',
        redirect_uris: ['http://localhost:3000/callback'],
        scopes: ['openid', 'profile'],
        grant_types: ['authorization_code'],
        is_active: true,
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
      };

      mockedAuthClient.get.mockResolvedValue({ data: mockClient });

      const result = await oauth2Api.getClient('test-client-id');

      expect(mockedAuthClient.get).toHaveBeenCalledWith(
        '/oauth/clients/test-client-id'
      );
      expect(result).toEqual(mockClient);
    });

    it('should handle get client error', async () => {
      const error = new Error('Client not found');
      mockedAuthClient.get.mockRejectedValue(error);

      await expect(oauth2Api.getClient('unknown-client')).rejects.toThrow(
        'Client not found'
      );
    });
  });

  describe('rotateClientSecret', () => {
    it('should rotate OAuth2 client secret', async () => {
      const request: ClientSecretRotationRequest = {
        current_secret: 'old-secret', // pragma: allowlist secret
      };

      const mockResponse: ClientSecretRotationResponse = {
        client_id: 'test-client-id',
        new_secret: 'new-generated-secret', // pragma: allowlist secret
        message:
          'Client secret rotated successfully. Store this secret securely - it will not be shown again.',
      };

      mockedAuthClient.put.mockResolvedValue({ data: mockResponse });

      const result = await oauth2Api.rotateClientSecret(
        'test-client-id',
        request
      );

      expect(mockedAuthClient.put).toHaveBeenCalledWith(
        '/oauth/clients/test-client-id/secret',
        request
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle rotate client secret error', async () => {
      const request: ClientSecretRotationRequest = {
        current_secret: 'wrong-secret', // pragma: allowlist secret
      };

      const error = new Error('Invalid credentials');
      mockedAuthClient.put.mockRejectedValue(error);

      await expect(
        oauth2Api.rotateClientSecret('test-client-id', request)
      ).rejects.toThrow('Invalid credentials');
    });
  });
});
