import type {
  User,
  UserSearchResult,
  UserProfileUpdateRequest,
  UserSearchResponse,
  UserAccountDeleteRequest,
  UserAccountDeleteRequestResponse,
  UserConfirmAccountDeleteResponse,
  NotificationPreferences,
  PrivacyPreferences,
  DisplayPreferences,
  UserPreferences,
  UserPreferenceResponse,
  UpdateUserPreferenceRequest,
} from '@/types/user-management/user';

describe('User Management User Types', () => {
  describe('User', () => {
    it('should have all required properties', () => {
      const user: User = {
        userId: '123e4567-e89b-12d3-a456-426614174000',
        username: 'testuser',
        email: 'test@example.com',
        fullName: 'Test User',
        bio: 'A test user',
        isActive: true,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      expect(typeof user.userId).toBe('string');
      expect(typeof user.username).toBe('string');
      expect(typeof user.isActive).toBe('boolean');
      expect(typeof user.createdAt).toBe('string');
      expect(typeof user.updatedAt).toBe('string');
    });

    it('should allow null optional properties', () => {
      const user: User = {
        userId: '123e4567-e89b-12d3-a456-426614174000',
        username: 'testuser',
        email: null,
        fullName: null,
        bio: null,
        isActive: true,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      expect(user.email).toBeNull();
      expect(user.fullName).toBeNull();
      expect(user.bio).toBeNull();
    });

    it('should allow undefined optional properties', () => {
      const user: User = {
        userId: '123e4567-e89b-12d3-a456-426614174000',
        username: 'testuser',
        isActive: true,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      expect(user.email).toBeUndefined();
      expect(user.fullName).toBeUndefined();
      expect(user.bio).toBeUndefined();
    });
  });

  describe('UserSearchResult', () => {
    it('should have required properties for search results', () => {
      const searchResult: UserSearchResult = {
        userId: '123e4567-e89b-12d3-a456-426614174000',
        username: 'searchuser',
        fullName: 'Search User',
        isActive: true,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      expect(typeof searchResult.userId).toBe('string');
      expect(typeof searchResult.username).toBe('string');
      expect(typeof searchResult.isActive).toBe('boolean');
      expect(typeof searchResult.createdAt).toBe('string');
      expect(typeof searchResult.updatedAt).toBe('string');
    });
  });

  describe('UserProfileUpdateRequest', () => {
    it('should allow all optional properties', () => {
      const updateRequest: UserProfileUpdateRequest = {};
      expect(typeof updateRequest).toBe('object');
    });

    it('should allow partial updates', () => {
      const updateRequest: UserProfileUpdateRequest = {
        username: 'newusername',
        bio: 'Updated bio',
      };

      expect(updateRequest.username).toBe('newusername');
      expect(updateRequest.bio).toBe('Updated bio');
      expect(updateRequest.email).toBeUndefined();
      expect(updateRequest.fullName).toBeUndefined();
    });

    it('should allow null values', () => {
      const updateRequest: UserProfileUpdateRequest = {
        username: null,
        email: null,
        fullName: null,
        bio: null,
      };

      expect(updateRequest.username).toBeNull();
      expect(updateRequest.email).toBeNull();
      expect(updateRequest.fullName).toBeNull();
      expect(updateRequest.bio).toBeNull();
    });
  });

  describe('Account Deletion Types', () => {
    it('should validate UserAccountDeleteRequest', () => {
      const deleteRequest: UserAccountDeleteRequest = {
        confirmationToken: 'test-confirmation-token-123',
      };

      expect(typeof deleteRequest.confirmationToken).toBe('string');
    });

    it('should validate UserAccountDeleteRequestResponse', () => {
      const response: UserAccountDeleteRequestResponse = {
        userId: '123e4567-e89b-12d3-a456-426614174000',
        confirmationToken: 'test-confirmation-token-123',
        expiresAt: '2023-01-01T01:00:00Z',
      };

      expect(typeof response.userId).toBe('string');
      expect(typeof response.confirmationToken).toBe('string');
      expect(typeof response.expiresAt).toBe('string');
    });

    it('should validate UserConfirmAccountDeleteResponse', () => {
      const response: UserConfirmAccountDeleteResponse = {
        userId: '123e4567-e89b-12d3-a456-426614174000',
        deactivatedAt: '2023-01-01T00:00:00Z',
      };

      expect(typeof response.userId).toBe('string');
      expect(typeof response.deactivatedAt).toBe('string');
    });
  });

  describe('Notification Preferences', () => {
    it('should allow all optional boolean properties', () => {
      const preferences: NotificationPreferences = {};
      expect(typeof preferences).toBe('object');
    });

    it('should validate all notification preference fields', () => {
      const preferences: NotificationPreferences = {
        email_notifications: true,
        push_notifications: false,
        follow_notifications: true,
        like_notifications: true,
        comment_notifications: false,
        recipe_notifications: true,
        system_notifications: true,
      };

      Object.values(preferences).forEach(value => {
        expect(typeof value).toBe('boolean');
      });
    });
  });

  describe('Privacy Preferences', () => {
    it('should allow all optional properties', () => {
      const preferences: PrivacyPreferences = {};
      expect(typeof preferences).toBe('object');
    });

    it('should validate privacy preference fields', () => {
      const preferences: PrivacyPreferences = {
        profile_visibility: 'public',
        show_email: false,
        show_full_name: true,
        allow_follows: true,
        allow_messages: false,
      };

      expect(['public', 'followers_only', 'private']).toContain(
        preferences.profile_visibility
      );
      expect(typeof preferences.show_email).toBe('boolean');
      expect(typeof preferences.show_full_name).toBe('boolean');
      expect(typeof preferences.allow_follows).toBe('boolean');
      expect(typeof preferences.allow_messages).toBe('boolean');
    });
  });

  describe('Display Preferences', () => {
    it('should allow all optional properties', () => {
      const preferences: DisplayPreferences = {};
      expect(typeof preferences).toBe('object');
    });

    it('should validate display preference fields', () => {
      const preferences: DisplayPreferences = {
        theme: 'dark',
        language: 'en',
        timezone: 'UTC',
      };

      expect(['light', 'dark', 'auto']).toContain(preferences.theme);
      expect(typeof preferences.language).toBe('string');
      expect(typeof preferences.timezone).toBe('string');
    });
  });

  describe('User Preferences', () => {
    it('should allow nested preference objects', () => {
      const userPreferences: UserPreferences = {
        notification_preferences: {
          email_notifications: true,
          push_notifications: false,
        },
        privacy_preferences: {
          profile_visibility: 'followers_only',
          show_email: false,
        },
        display_preferences: {
          theme: 'dark',
          language: 'en',
        },
      };

      expect(typeof userPreferences.notification_preferences).toBe('object');
      expect(typeof userPreferences.privacy_preferences).toBe('object');
      expect(typeof userPreferences.display_preferences).toBe('object');
    });

    it('should validate UserPreferenceResponse wrapper', () => {
      const response: UserPreferenceResponse = {
        preferences: {
          notification_preferences: {
            email_notifications: true,
          },
        },
      };

      expect(typeof response.preferences).toBe('object');
    });

    it('should validate UpdateUserPreferenceRequest', () => {
      const updateRequest: UpdateUserPreferenceRequest = {
        notification_preferences: {
          email_notifications: false,
        },
        privacy_preferences: {
          profile_visibility: 'private',
        },
      };

      expect(typeof updateRequest.notification_preferences).toBe('object');
      expect(typeof updateRequest.privacy_preferences).toBe('object');
    });
  });

  describe('UserSearchResponse', () => {
    it('should extend PaginatedResponse structure', () => {
      const searchResponse: UserSearchResponse = {
        results: [
          {
            userId: '123e4567-e89b-12d3-a456-426614174000',
            username: 'user1',
            isActive: true,
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2023-01-01T00:00:00Z',
          },
        ],
        totalCount: 1,
        limit: 20,
        offset: 0,
      };

      expect(Array.isArray(searchResponse.results)).toBe(true);
      expect(typeof searchResponse.totalCount).toBe('number');
      expect(typeof searchResponse.limit).toBe('number');
      expect(typeof searchResponse.offset).toBe('number');
      expect(searchResponse.results![0]).toHaveProperty('userId');
      expect(searchResponse.results![0]).toHaveProperty('username');
    });
  });
});
