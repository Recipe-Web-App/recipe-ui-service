import { oauth2Api } from '@/lib/api/auth/oauth2';
import { authClient } from '@/lib/api/auth/client';
import type {
  TokenResponse,
  OAuthDiscovery,
  IntrospectResponse,
  AuthorizationCodeRequest,
  ClientCredentialsRequest,
  RefreshTokenRequest,
} from '@/types/auth';
import { AxiosHeaders } from 'axios';

// Mock the auth client
jest.mock('@/lib/api/auth/client', () => ({
  authClient: {
    get: jest.fn(),
    post: jest.fn(),
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
  });
});
