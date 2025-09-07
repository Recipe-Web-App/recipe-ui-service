export interface TokenResponse {
  access_token: string;
  token_type: 'Bearer';
  expires_in: number;
  refresh_token?: string;
  scope?: string;
}

export interface OAuth2Error {
  error:
    | 'invalid_request'
    | 'invalid_client'
    | 'invalid_grant'
    | 'unauthorized_client'
    | 'unsupported_grant_type'
    | 'invalid_scope'
    | 'access_denied'
    | 'unsupported_response_type'
    | 'server_error'
    | 'temporarily_unavailable';
  error_description?: string;
  error_uri?: string;
  state?: string;
}

export interface AuthorizeParams {
  response_type: 'code';
  client_id: string;
  redirect_uri: string;
  scope?: string;
  state?: string;
  code_challenge: string;
  code_challenge_method?: 'S256';
}

export interface AuthorizationCodeRequest {
  grant_type: 'authorization_code';
  code: string;
  redirect_uri: string;
  client_id: string;
  code_verifier: string;
}

export interface ClientCredentialsRequest {
  grant_type: 'client_credentials';
  scope?: string;
}

export interface RefreshTokenRequest {
  grant_type: 'refresh_token';
  refresh_token: string;
  scope?: string;
}

export interface IntrospectRequest {
  token: string;
  token_type_hint?: 'access_token' | 'refresh_token';
}

export interface IntrospectResponse {
  active: boolean;
  scope?: string;
  client_id?: string;
  sub?: string;
  exp?: number;
  iat?: number;
  aud?: string[];
}

export interface RevokeRequest {
  token: string;
  token_type_hint?: 'access_token' | 'refresh_token';
}

export interface UserInfo {
  sub: string;
  email?: string;
  name?: string;
  preferred_username?: string;
}

export interface OAuthDiscovery {
  issuer: string;
  authorization_endpoint?: string;
  token_endpoint?: string;
  revocation_endpoint?: string;
  introspection_endpoint?: string;
  userinfo_endpoint?: string;
  response_types_supported?: string[];
  grant_types_supported?: string[];
  scopes_supported?: string[];
  token_endpoint_auth_methods_supported?: string[];
  code_challenge_methods_supported?: string[];
  revocation_endpoint_auth_methods_supported?: string[];
  introspection_endpoint_auth_methods_supported?: string[];
}
