import { authClient, handleAuthApiError } from './client';
import { generatePKCE, generateState } from './pkce';
import type {
  TokenResponse,
  AuthorizeParams,
  AuthorizationCodeRequest,
  ClientCredentialsRequest,
  RefreshTokenRequest,
  IntrospectRequest,
  IntrospectResponse,
  RevokeRequest,
  UserInfo,
  OAuthDiscovery,
} from '@/types/auth';

export const oauth2Api = {
  async getDiscoveryDocument(): Promise<OAuthDiscovery> {
    try {
      const response = await authClient.get(
        '/.well-known/oauth-authorization-server'
      );
      return response.data as OAuthDiscovery;
    } catch (error) {
      handleAuthApiError(error);
      throw error; // This line should never be reached since handleAuthApiError throws
    }
  },

  async buildAuthorizeUrl(params: {
    clientId: string;
    redirectUri: string;
    scope?: string;
    state?: string;
  }): Promise<{ url: string; codeVerifier: string; state: string }> {
    const { codeVerifier, codeChallenge } = await generatePKCE();
    const state = params.state ?? generateState();

    const authorizeParams: AuthorizeParams = {
      response_type: 'code',
      client_id: params.clientId,
      redirect_uri: params.redirectUri,
      scope: params.scope,
      state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
    };

    const searchParams = new URLSearchParams();
    Object.entries(authorizeParams).forEach(([key, value]) => {
      if (value) searchParams.append(key, value);
    });

    return {
      url: `${authClient.defaults.baseURL}/oauth2/authorize?${searchParams.toString()}`,
      codeVerifier,
      state,
    };
  },

  async exchangeCodeForToken(
    data: AuthorizationCodeRequest
  ): Promise<TokenResponse> {
    try {
      const response = await authClient.post('/oauth2/token', data, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        transformRequest: [
          function (data) {
            return new URLSearchParams(data).toString();
          },
        ],
      });
      return response.data as TokenResponse;
    } catch (error) {
      handleAuthApiError(error);
      throw error; // This line should never be reached since handleAuthApiError throws
    }
  },

  async clientCredentialsToken(
    data: ClientCredentialsRequest
  ): Promise<TokenResponse> {
    try {
      const response = await authClient.post('/oauth2/token', data, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        transformRequest: [
          function (data) {
            return new URLSearchParams(data).toString();
          },
        ],
      });
      return response.data as TokenResponse;
    } catch (error) {
      handleAuthApiError(error);
      throw error; // This line should never be reached since handleAuthApiError throws
    }
  },

  async refreshToken(data: RefreshTokenRequest): Promise<TokenResponse> {
    try {
      const response = await authClient.post('/oauth2/token', data, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        transformRequest: [
          function (data) {
            return new URLSearchParams(data).toString();
          },
        ],
      });
      return response.data as TokenResponse;
    } catch (error) {
      handleAuthApiError(error);
      throw error; // This line should never be reached since handleAuthApiError throws
    }
  },

  async introspectToken(data: IntrospectRequest): Promise<IntrospectResponse> {
    try {
      const response = await authClient.post('/oauth2/introspect', data, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        transformRequest: [
          function (data) {
            return new URLSearchParams(data).toString();
          },
        ],
      });
      return response.data as IntrospectResponse;
    } catch (error) {
      handleAuthApiError(error);
      throw error; // This line should never be reached since handleAuthApiError throws
    }
  },

  async revokeToken(data: RevokeRequest): Promise<void> {
    try {
      await authClient.post('/oauth2/revoke', data, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        transformRequest: [
          function (data) {
            return new URLSearchParams(data).toString();
          },
        ],
      });
    } catch (error) {
      handleAuthApiError(error);
      throw error; // This line should never be reached since handleAuthApiError throws
    }
  },

  async getUserInfo(): Promise<UserInfo> {
    try {
      const response = await authClient.get('/oauth2/userinfo');
      return response.data as UserInfo;
    } catch (error) {
      handleAuthApiError(error);
      throw error; // This line should never be reached since handleAuthApiError throws
    }
  },
};
