import {
  usernameSchema,
  emailSchema,
  fullNameSchema,
  bioSchema,
  profileFormSchema,
  convertToUserProfileUpdateRequest,
  convertFromUserProfileResponse,
  profileFormDefaultValues,
  hasProfileChanges,
  getBioCharacterCount,
  isBioWithinLimit,
} from '@/lib/validation/profile-schemas';
import type { UserProfileResponse } from '@/types/user-management';

describe('Profile Schemas', () => {
  describe('usernameSchema', () => {
    it('should validate valid usernames', () => {
      expect(usernameSchema.parse('john_doe')).toBe('john_doe');
      expect(usernameSchema.parse('user123')).toBe('user123');
      expect(usernameSchema.parse('chef-master')).toBe('chef-master');
      expect(usernameSchema.parse('ABC')).toBe('ABC');
    });

    it('should trim whitespace from valid usernames', () => {
      expect(usernameSchema.parse('username   ')).toBe('username');
      expect(usernameSchema.parse('   username')).toBe('username');
    });

    it('should reject usernames less than 3 characters', () => {
      expect(() => usernameSchema.parse('ab')).toThrow(
        'Username must be at least 3 characters'
      );
    });

    it('should reject usernames exceeding 30 characters', () => {
      const longUsername = 'a'.repeat(31);
      expect(() => usernameSchema.parse(longUsername)).toThrow(
        'Username must not exceed 30 characters'
      );
    });

    it('should reject usernames with invalid characters', () => {
      expect(() => usernameSchema.parse('user@name')).toThrow(
        'Username can only contain letters, numbers, underscores, and hyphens'
      );
      expect(() => usernameSchema.parse('user name')).toThrow(
        'Username can only contain letters, numbers, underscores, and hyphens'
      );
      expect(() => usernameSchema.parse('user.name')).toThrow(
        'Username can only contain letters, numbers, underscores, and hyphens'
      );
    });

    it('should allow exactly 3 characters', () => {
      expect(usernameSchema.parse('abc')).toBe('abc');
    });

    it('should allow exactly 30 characters', () => {
      const username = 'a'.repeat(30);
      expect(usernameSchema.parse(username)).toBe(username);
    });
  });

  describe('emailSchema', () => {
    it('should validate valid email addresses', () => {
      expect(emailSchema.parse('user@example.com')).toBe('user@example.com');
      expect(emailSchema.parse('test.user@domain.co.uk')).toBe(
        'test.user@domain.co.uk'
      );
    });

    it('should allow undefined', () => {
      expect(emailSchema.parse(undefined)).toBeUndefined();
    });

    it('should allow empty string', () => {
      expect(emailSchema.parse('')).toBe('');
    });

    it('should trim whitespace from valid emails', () => {
      expect(emailSchema.parse('user@example.com   ')).toBe('user@example.com');
      expect(emailSchema.parse('   user@example.com')).toBe('user@example.com');
    });

    it('should reject invalid email format', () => {
      expect(() => emailSchema.parse('invalid-email')).toThrow(
        'Invalid email address'
      );
      expect(() => emailSchema.parse('user@')).toThrow('Invalid email address');
      expect(() => emailSchema.parse('@example.com')).toThrow(
        'Invalid email address'
      );
    });

    it('should reject emails exceeding 254 characters', () => {
      const longEmail = 'a'.repeat(243) + '@example.com'; // Total 255 chars (243 + 12)
      expect(() => emailSchema.parse(longEmail)).toThrow(
        'Email must not exceed 254 characters'
      );
    });
  });

  describe('fullNameSchema', () => {
    it('should validate valid full names', () => {
      expect(fullNameSchema.parse('John Doe')).toBe('John Doe');
      expect(fullNameSchema.parse("Mary O'Brien")).toBe("Mary O'Brien");
      expect(fullNameSchema.parse('Anne-Marie Smith')).toBe('Anne-Marie Smith');
    });

    it('should allow undefined', () => {
      expect(fullNameSchema.parse(undefined)).toBeUndefined();
    });

    it('should allow empty string', () => {
      expect(fullNameSchema.parse('')).toBe('');
    });

    it('should trim whitespace', () => {
      expect(fullNameSchema.parse('  John Doe  ')).toBe('John Doe');
    });

    it('should reject names with invalid characters', () => {
      expect(() => fullNameSchema.parse('John123')).toThrow(
        'Full name can only contain letters, spaces, hyphens, and apostrophes'
      );
      expect(() => fullNameSchema.parse('John@Doe')).toThrow(
        'Full name can only contain letters, spaces, hyphens, and apostrophes'
      );
    });

    it('should reject names exceeding 100 characters', () => {
      const longName = 'John ' + 'Smith '.repeat(20);
      expect(() => fullNameSchema.parse(longName)).toThrow(
        'Full name must not exceed 100 characters'
      );
    });

    it('should allow exactly 100 characters', () => {
      const name = 'a'.repeat(100);
      expect(fullNameSchema.parse(name)).toBe(name);
    });
  });

  describe('bioSchema', () => {
    it('should validate valid bio text', () => {
      const bio = 'I love cooking pasta and experimenting with new recipes!';
      expect(bioSchema.parse(bio)).toBe(bio);
    });

    it('should allow undefined', () => {
      expect(bioSchema.parse(undefined)).toBeUndefined();
    });

    it('should allow empty string', () => {
      expect(bioSchema.parse('')).toBe('');
    });

    it('should trim whitespace', () => {
      expect(bioSchema.parse('  My bio  ')).toBe('My bio');
    });

    it('should allow multiline text', () => {
      const bio = 'Line 1\nLine 2\nLine 3';
      expect(bioSchema.parse(bio)).toBe(bio);
    });

    it('should reject bio exceeding 500 characters', () => {
      const longBio = 'a'.repeat(501);
      expect(() => bioSchema.parse(longBio)).toThrow(
        'Bio must not exceed 500 characters'
      );
    });

    it('should allow exactly 500 characters', () => {
      const bio = 'a'.repeat(500);
      expect(bioSchema.parse(bio)).toBe(bio);
    });

    it('should allow special characters', () => {
      const bio = 'I love cooking! 🍳 My favorite: pasta & pizza. #foodie';
      expect(bioSchema.parse(bio)).toBe(bio);
    });
  });

  describe('profileFormSchema', () => {
    it('should validate complete profile data', () => {
      const formData = {
        username: 'john_doe',
        email: 'john@example.com',
        fullName: 'John Doe',
        bio: 'I love cooking!',
      };
      expect(profileFormSchema.parse(formData)).toEqual(formData);
    });

    it('should validate minimal profile data with only username', () => {
      const formData = {
        username: 'john_doe',
        email: '',
        fullName: '',
        bio: '',
      };
      const result = profileFormSchema.parse(formData);
      expect(result.username).toBe('john_doe');
      expect(result.email).toBe('');
      expect(result.fullName).toBe('');
      expect(result.bio).toBe('');
    });

    it('should validate profile with optional fields', () => {
      const formData = {
        username: 'chef_master',
        email: 'chef@example.com',
        fullName: undefined,
        bio: undefined,
      };
      const result = profileFormSchema.parse(formData);
      expect(result.username).toBe('chef_master');
      expect(result.email).toBe('chef@example.com');
      expect(result.fullName).toBeUndefined();
      expect(result.bio).toBeUndefined();
    });
  });

  describe('convertToUserProfileUpdateRequest', () => {
    it('should convert form data to API request format', () => {
      const formData = {
        username: 'john_doe',
        email: 'john@example.com',
        fullName: 'John Doe',
        bio: 'I love cooking!',
      };
      const result = convertToUserProfileUpdateRequest(formData);
      expect(result).toEqual({
        username: 'john_doe',
        email: 'john@example.com',
        fullName: 'John Doe',
        bio: 'I love cooking!',
      });
    });

    it('should convert empty strings to null', () => {
      const formData = {
        username: 'user123',
        email: '',
        fullName: '',
        bio: '',
      };
      const result = convertToUserProfileUpdateRequest(formData);
      expect(result).toEqual({
        username: 'user123',
        email: null,
        fullName: null,
        bio: null,
      });
    });

    it('should handle undefined values', () => {
      const formData = {
        username: 'user123',
        email: undefined,
        fullName: undefined,
        bio: undefined,
      };
      const result = convertToUserProfileUpdateRequest(formData);
      expect(result).toEqual({
        username: 'user123',
        email: undefined,
        fullName: undefined,
        bio: undefined,
      });
    });
  });

  describe('convertFromUserProfileResponse', () => {
    it('should convert API response to form data', () => {
      const userResponse: UserProfileResponse = {
        userId: '123',
        username: 'john_doe',
        email: 'john@example.com',
        fullName: 'John Doe',
        bio: 'I love cooking!',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z',
      };
      const result = convertFromUserProfileResponse(userResponse);
      expect(result).toEqual({
        username: 'john_doe',
        email: 'john@example.com',
        fullName: 'John Doe',
        bio: 'I love cooking!',
      });
    });

    it('should handle null values as empty strings', () => {
      const userResponse: UserProfileResponse = {
        userId: '123',
        username: 'user123',
        email: null,
        fullName: null,
        bio: null,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z',
      };
      const result = convertFromUserProfileResponse(userResponse);
      expect(result).toEqual({
        username: 'user123',
        email: '',
        fullName: '',
        bio: '',
      });
    });

    it('should handle undefined values as empty strings', () => {
      const userResponse: UserProfileResponse = {
        userId: '123',
        username: 'user123',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z',
      };
      const result = convertFromUserProfileResponse(userResponse);
      expect(result).toEqual({
        username: 'user123',
        email: '',
        fullName: '',
        bio: '',
      });
    });
  });

  describe('profileFormDefaultValues', () => {
    it('should have correct default values', () => {
      expect(profileFormDefaultValues).toEqual({
        username: '',
        email: '',
        fullName: '',
        bio: '',
      });
    });
  });

  describe('hasProfileChanges', () => {
    const originalUser: UserProfileResponse = {
      userId: '123',
      username: 'john_doe',
      email: 'john@example.com',
      fullName: 'John Doe',
      bio: 'I love cooking!',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-02T00:00:00Z',
    };

    it('should return false when no changes', () => {
      const formData = {
        username: 'john_doe',
        email: 'john@example.com',
        fullName: 'John Doe',
        bio: 'I love cooking!',
      };
      expect(hasProfileChanges(formData, originalUser)).toBe(false);
    });

    it('should return true when username changed', () => {
      const formData = {
        username: 'jane_doe',
        email: 'john@example.com',
        fullName: 'John Doe',
        bio: 'I love cooking!',
      };
      expect(hasProfileChanges(formData, originalUser)).toBe(true);
    });

    it('should return true when email changed', () => {
      const formData = {
        username: 'john_doe',
        email: 'newemail@example.com',
        fullName: 'John Doe',
        bio: 'I love cooking!',
      };
      expect(hasProfileChanges(formData, originalUser)).toBe(true);
    });

    it('should return true when full name changed', () => {
      const formData = {
        username: 'john_doe',
        email: 'john@example.com',
        fullName: 'Jane Doe',
        bio: 'I love cooking!',
      };
      expect(hasProfileChanges(formData, originalUser)).toBe(true);
    });

    it('should return true when bio changed', () => {
      const formData = {
        username: 'john_doe',
        email: 'john@example.com',
        fullName: 'John Doe',
        bio: 'I love baking!',
      };
      expect(hasProfileChanges(formData, originalUser)).toBe(true);
    });

    it('should handle null to string comparison', () => {
      const userWithNulls: UserProfileResponse = {
        ...originalUser,
        email: null,
        fullName: null,
        bio: null,
      };
      const formData = {
        username: 'john_doe',
        email: '',
        fullName: '',
        bio: '',
      };
      expect(hasProfileChanges(formData, userWithNulls)).toBe(false);
    });
  });

  describe('getBioCharacterCount', () => {
    it('should return correct character count', () => {
      expect(getBioCharacterCount('Hello world')).toBe(11);
      expect(getBioCharacterCount('I love cooking!')).toBe(15);
    });

    it('should return 0 for null', () => {
      expect(getBioCharacterCount(null)).toBe(0);
    });

    it('should return 0 for undefined', () => {
      expect(getBioCharacterCount(undefined)).toBe(0);
    });

    it('should return 0 for empty string', () => {
      expect(getBioCharacterCount('')).toBe(0);
    });

    it('should count multiline text correctly', () => {
      expect(getBioCharacterCount('Line 1\nLine 2')).toBe(13);
    });
  });

  describe('isBioWithinLimit', () => {
    it('should return true for bio within limit', () => {
      expect(isBioWithinLimit('Short bio')).toBe(true);
      expect(isBioWithinLimit('a'.repeat(500))).toBe(true);
    });

    it('should return false for bio exceeding limit', () => {
      expect(isBioWithinLimit('a'.repeat(501))).toBe(false);
    });

    it('should return true for null', () => {
      expect(isBioWithinLimit(null)).toBe(true);
    });

    it('should return true for undefined', () => {
      expect(isBioWithinLimit(undefined)).toBe(true);
    });

    it('should return true for empty string', () => {
      expect(isBioWithinLimit('')).toBe(true);
    });
  });
});
