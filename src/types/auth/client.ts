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
  redirect_uris?: string[];
  scopes?: string[];
  grant_types?: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string | null;
}

export interface ClientSecretRotationRequest {
  current_secret: string;
}

export interface ClientSecretRotationResponse {
  client_id: string;
  new_secret: string;
  message: string;
}
