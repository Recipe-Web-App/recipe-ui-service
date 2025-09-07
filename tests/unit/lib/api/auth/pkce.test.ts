import { generatePKCE, generateState } from '@/lib/api/auth/pkce';

describe('PKCE Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock SHA-256 digest to return a predictable result
    (global.crypto.subtle.digest as jest.Mock).mockResolvedValue(
      new ArrayBuffer(32) // Mock 32-byte SHA-256 hash
    );
  });

  describe('generatePKCE', () => {
    it('should generate code verifier and challenge', async () => {
      const pkce = await generatePKCE();

      expect(pkce).toHaveProperty('codeVerifier');
      expect(pkce).toHaveProperty('codeChallenge');
      expect(typeof pkce.codeVerifier).toBe('string');
      expect(typeof pkce.codeChallenge).toBe('string');
      expect(pkce.codeVerifier.length).toBe(128);
    });

    it('should generate different values on multiple calls', async () => {
      const pkce1 = await generatePKCE();
      const pkce2 = await generatePKCE();

      expect(pkce1.codeVerifier).not.toBe(pkce2.codeVerifier);
    });

    it('should call crypto.subtle.digest with correct parameters', async () => {
      await generatePKCE();

      expect(global.crypto.subtle.digest).toHaveBeenCalledWith(
        'SHA-256',
        expect.anything()
      );
    });
  });

  describe('generateState', () => {
    it('should generate a random state string', () => {
      const state = generateState();

      expect(typeof state).toBe('string');
      expect(state.length).toBe(32);
    });

    it('should generate different values on multiple calls', () => {
      const state1 = generateState();
      const state2 = generateState();

      expect(state1).not.toBe(state2);
    });

    it('should only contain valid characters', () => {
      const state = generateState();
      const validChars = /^[A-Za-z0-9\-._~]+$/;

      expect(state).toMatch(validChars);
    });
  });
});
