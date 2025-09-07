/**
 * PKCE (Proof Key for Code Exchange) utilities for OAuth2 authorization code flow
 */

function base64UrlEncode(str: string): string {
  return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function sha256(buffer: ArrayBuffer): Promise<ArrayBuffer> {
  return crypto.subtle.digest('SHA-256', buffer);
}

function generateRandomString(length: number): string {
  const charset =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return result;
}

export interface PKCEPair {
  codeVerifier: string;
  codeChallenge: string;
}

export async function generatePKCE(): Promise<PKCEPair> {
  const codeVerifier = generateRandomString(128);

  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await sha256(data.buffer);

  const bytes = new Uint8Array(digest);
  const binaryString = String.fromCharCode.apply(null, Array.from(bytes));
  const codeChallenge = base64UrlEncode(btoa(binaryString));

  return {
    codeVerifier,
    codeChallenge,
  };
}

export function generateState(): string {
  return generateRandomString(32);
}
