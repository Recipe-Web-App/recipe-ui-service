export interface ClientRegistrationRequest {
  name: string;
  redirect_uris: string[];
  scopes?: string[];
  grant_types?: string[];
}

export interface ClientRegistrationResponse {
  client_id: string;
  client_secret: string;
  name: string;
  redirect_uris: string[];
  scopes?: string[];
  grant_types?: string[];
}

export interface ClientDetails {
  client_id: string;
  name: string;
  redirect_uris: string[];
  scopes?: string[];
  grant_types?: string[];
}
