import { describe, it, expect } from '@jest/globals';
import {
  registerSchema,
  loginSchema,
  passwordResetRequestSchema,
  passwordResetConfirmSchema,
} from '@/lib/forms/auth-schemas';

describe('auth-schemas', () => {
  describe('registerSchema', () => {
    it('validates valid registration data', () => {
      const validData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'Password123', // pragma: allowlist secret
        full_name: 'Test User',
        bio: 'A test user bio',
      };

      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('validates registration with only required fields', () => {
      const validData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'Password123', // pragma: allowlist secret
        full_name: '',
        bio: '',
      };

      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('rejects username shorter than 3 characters', () => {
      const invalidData = {
        username: 'ab',
        email: 'test@example.com',
        password: 'Password123', // pragma: allowlist secret
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          'at least 3 characters'
        );
      }
    });

    it('rejects username longer than 30 characters', () => {
      const invalidData = {
        username: 'a'.repeat(31),
        email: 'test@example.com',
        password: 'Password123', // pragma: allowlist secret
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          'at most 30 characters'
        );
      }
    });

    it('rejects username not starting with a letter', () => {
      const invalidData = {
        username: '123user',
        email: 'test@example.com',
        password: 'Password123', // pragma: allowlist secret
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          'must start with a letter'
        );
      }
    });

    it('accepts username with letters, numbers, and underscores', () => {
      const validData = {
        username: 'test_user_123',
        email: 'test@example.com',
        password: 'Password123', // pragma: allowlist secret
      };

      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('rejects invalid email format', () => {
      const invalidData = {
        username: 'testuser',
        email: 'invalid-email',
        password: 'Password123', // pragma: allowlist secret
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('valid email');
      }
    });

    it('rejects password shorter than 8 characters', () => {
      const invalidData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'Pass1', // pragma: allowlist secret
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          'at least 8 characters'
        );
      }
    });

    it('rejects password without uppercase letter', () => {
      const invalidData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123', // pragma: allowlist secret
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('uppercase letter');
      }
    });

    it('rejects password without lowercase letter', () => {
      const invalidData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'PASSWORD123', // pragma: allowlist secret
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('lowercase letter');
      }
    });

    it('rejects password without number', () => {
      const invalidData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'Password', // pragma: allowlist secret
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('number');
      }
    });

    it('rejects full_name longer than 100 characters', () => {
      const invalidData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'Password123', // pragma: allowlist secret
        full_name: 'a'.repeat(101),
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          'at most 100 characters'
        );
      }
    });

    it('rejects bio longer than 500 characters', () => {
      const invalidData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'Password123', // pragma: allowlist secret
        bio: 'a'.repeat(501),
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          'at most 500 characters'
        );
      }
    });
  });

  describe('loginSchema', () => {
    it('validates valid login data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'Password123', // pragma: allowlist secret
      };

      const result = loginSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('rejects invalid email format', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'Password123', // pragma: allowlist secret
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('valid email');
      }
    });

    it('rejects empty password', () => {
      const invalidData = {
        email: 'test@example.com',
        password: '',
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('required');
      }
    });

    it('accepts any non-empty password (no complexity validation)', () => {
      const validData = {
        email: 'test@example.com',
        password: 'weak', // pragma: allowlist secret
      };

      const result = loginSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('passwordResetRequestSchema', () => {
    it('validates valid email', () => {
      const validData = {
        email: 'test@example.com',
      };

      const result = passwordResetRequestSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('rejects invalid email format', () => {
      const invalidData = {
        email: 'invalid-email',
      };

      const result = passwordResetRequestSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('valid email');
      }
    });
  });

  describe('passwordResetConfirmSchema', () => {
    it('validates valid password reset confirmation', () => {
      const validData = {
        reset_token: 'valid-token-123',
        new_password: 'NewPassword123', // pragma: allowlist secret
        confirm_password: 'NewPassword123', // pragma: allowlist secret
      };

      const result = passwordResetConfirmSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('rejects empty reset token', () => {
      const invalidData = {
        reset_token: '',
        new_password: 'NewPassword123', // pragma: allowlist secret
        confirm_password: 'NewPassword123', // pragma: allowlist secret
      };

      const result = passwordResetConfirmSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('required');
      }
    });

    it('rejects new password not meeting requirements', () => {
      const invalidData = {
        reset_token: 'valid-token-123',
        new_password: 'weak', // pragma: allowlist secret
        confirm_password: 'weak', // pragma: allowlist secret
      };

      const result = passwordResetConfirmSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(
          result.error.issues.some(issue =>
            issue.message.includes('8 characters')
          )
        ).toBe(true);
      }
    });

    it('rejects mismatched passwords', () => {
      const invalidData = {
        reset_token: 'valid-token-123',
        new_password: 'NewPassword123', // pragma: allowlist secret
        confirm_password: 'DifferentPassword123', // pragma: allowlist secret
      };

      const result = passwordResetConfirmSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('do not match');
      }
    });

    it('rejects empty confirm password', () => {
      const invalidData = {
        reset_token: 'valid-token-123',
        new_password: 'NewPassword123', // pragma: allowlist secret
        confirm_password: '',
      };

      const result = passwordResetConfirmSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          'confirm your password'
        );
      }
    });
  });
});
