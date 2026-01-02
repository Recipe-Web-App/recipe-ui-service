import { preferencesApi } from '@/lib/api/user-management/preferences';
import { userManagementClient } from '@/lib/api/user-management/client';
import type {
  UserPreferencesResponse,
  UserPreferencesUpdateRequest,
  PreferenceCategoryResponse,
  NotificationPreferencesUpdate,
  DisplayPreferencesUpdate,
  PrivacyPreferencesUpdate,
  AccessibilityPreferencesUpdate,
  LanguagePreferencesUpdate,
  SecurityPreferencesUpdate,
  SocialPreferencesUpdate,
  SoundPreferencesUpdate,
  ThemePreferencesUpdate,
} from '@/types/user-management';

// Mock the client module
jest.mock('@/lib/api/user-management/client', () => ({
  userManagementClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
  handleUserManagementApiError: jest.fn(error => {
    throw error;
  }),
  buildQueryParams: jest.requireActual('@/lib/api/user-management/client')
    .buildQueryParams,
}));

const mockClient = userManagementClient as jest.Mocked<
  typeof userManagementClient
>;

describe('Preferences API', () => {
  const userId = 'user-123';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserPreferences', () => {
    const mockFullPreferences: UserPreferencesResponse = {
      userId,
      notification: {
        emailNotifications: true,
        pushNotifications: true,
        smsNotifications: false,
        marketingEmails: false,
        securityAlerts: true,
        activitySummaries: true,
        recipeRecommendations: true,
        socialInteractions: true,
        updatedAt: '2024-01-01T00:00:00Z',
      },
      display: {
        fontSize: 'MEDIUM',
        colorScheme: 'AUTO',
        layoutDensity: 'COMFORTABLE',
        showImages: true,
        compactMode: false,
        updatedAt: '2024-01-01T00:00:00Z',
      },
      privacy: {
        profileVisibility: 'PUBLIC',
        recipeVisibility: 'PUBLIC',
        activityVisibility: 'FRIENDS_ONLY',
        contactInfoVisibility: 'PRIVATE',
        dataSharing: false,
        analyticsTracking: true,
        updatedAt: '2024-01-01T00:00:00Z',
      },
      accessibility: {
        screenReader: false,
        highContrast: false,
        reducedMotion: false,
        largeText: false,
        keyboardNavigation: true,
        updatedAt: '2024-01-01T00:00:00Z',
      },
      language: {
        primaryLanguage: 'EN',
        translationEnabled: false,
        updatedAt: '2024-01-01T00:00:00Z',
      },
      security: {
        twoFactorAuth: true,
        loginNotifications: true,
        sessionTimeout: true,
        passwordRequirements: true,
        updatedAt: '2024-01-01T00:00:00Z',
      },
      social: {
        friendRequests: true,
        messageNotifications: true,
        groupInvites: true,
        shareActivity: true,
        updatedAt: '2024-01-01T00:00:00Z',
      },
      sound: {
        notificationSounds: true,
        systemSounds: true,
        volumeLevel: true,
        muteNotifications: false,
        updatedAt: '2024-01-01T00:00:00Z',
      },
      theme: {
        darkMode: false,
        lightMode: true,
        autoTheme: true,
        customTheme: 'AUTO',
        updatedAt: '2024-01-01T00:00:00Z',
      },
    };

    it('should get all user preferences', async () => {
      mockClient.get.mockResolvedValue({ data: mockFullPreferences });

      const result = await preferencesApi.getUserPreferences(userId);

      expect(mockClient.get).toHaveBeenCalledWith(
        `/users/${userId}/preferences`
      );
      expect(result).toEqual(mockFullPreferences);
    });

    it('should get user preferences with category filter', async () => {
      mockClient.get.mockResolvedValue({ data: mockFullPreferences });

      const result = await preferencesApi.getUserPreferences(userId, {
        categories: ['notification', 'display'],
      });

      expect(mockClient.get).toHaveBeenCalledWith(
        `/users/${userId}/preferences?categories=notification%2Cdisplay`
      );
      expect(result).toEqual(mockFullPreferences);
    });

    it('should handle empty categories array', async () => {
      mockClient.get.mockResolvedValue({ data: mockFullPreferences });

      const result = await preferencesApi.getUserPreferences(userId, {
        categories: [],
      });

      expect(mockClient.get).toHaveBeenCalledWith(
        `/users/${userId}/preferences`
      );
      expect(result).toEqual(mockFullPreferences);
    });

    it('should handle get preferences error', async () => {
      mockClient.get.mockRejectedValue(new Error('Unauthorized'));

      await expect(preferencesApi.getUserPreferences(userId)).rejects.toThrow();
    });
  });

  describe('updateUserPreferences', () => {
    it('should update multiple preference categories', async () => {
      const updateRequest: UserPreferencesUpdateRequest = {
        notification: {
          emailNotifications: false,
          pushNotifications: true,
        },
        theme: {
          darkMode: true,
        },
      };

      const mockResponse: UserPreferencesResponse = {
        userId,
        notification: {
          emailNotifications: false,
          pushNotifications: true,
          updatedAt: '2024-01-02T00:00:00Z',
        },
        theme: {
          darkMode: true,
          updatedAt: '2024-01-02T00:00:00Z',
        },
      };

      mockClient.put.mockResolvedValue({ data: mockResponse });

      const result = await preferencesApi.updateUserPreferences(
        userId,
        updateRequest
      );

      expect(mockClient.put).toHaveBeenCalledWith(
        `/users/${userId}/preferences`,
        updateRequest
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle update preferences error', async () => {
      mockClient.put.mockRejectedValue(new Error('Validation error'));

      await expect(
        preferencesApi.updateUserPreferences(userId, {})
      ).rejects.toThrow();
    });
  });

  describe('getPreferenceCategory', () => {
    it('should get a specific preference category', async () => {
      const mockResponse: PreferenceCategoryResponse = {
        userId,
        category: 'notification',
        preferences: {
          emailNotifications: true,
          pushNotifications: true,
        },
        updatedAt: '2024-01-01T00:00:00Z',
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await preferencesApi.getPreferenceCategory(
        userId,
        'notification'
      );

      expect(mockClient.get).toHaveBeenCalledWith(
        `/users/${userId}/preferences/notification`
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle get category error', async () => {
      mockClient.get.mockRejectedValue(new Error('Not found'));

      await expect(
        preferencesApi.getPreferenceCategory(userId, 'notification')
      ).rejects.toThrow();
    });
  });

  describe('updatePreferenceCategory', () => {
    it('should update a specific preference category', async () => {
      const updateData: NotificationPreferencesUpdate = {
        emailNotifications: false,
        marketingEmails: false,
      };

      const mockResponse: PreferenceCategoryResponse = {
        userId,
        category: 'notification',
        preferences: {
          emailNotifications: false,
          marketingEmails: false,
        },
        updatedAt: '2024-01-02T00:00:00Z',
      };

      mockClient.put.mockResolvedValue({ data: mockResponse });

      const result = await preferencesApi.updatePreferenceCategory(
        userId,
        'notification',
        updateData
      );

      expect(mockClient.put).toHaveBeenCalledWith(
        `/users/${userId}/preferences/notification`,
        updateData
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle update category error', async () => {
      mockClient.put.mockRejectedValue(new Error('Validation error'));

      await expect(
        preferencesApi.updatePreferenceCategory(userId, 'notification', {})
      ).rejects.toThrow();
    });
  });

  describe('convenience methods - notification', () => {
    const mockCategoryResponse: PreferenceCategoryResponse = {
      userId,
      category: 'notification',
      preferences: { emailNotifications: true },
      updatedAt: '2024-01-01T00:00:00Z',
    };

    it('should get notification preferences', async () => {
      mockClient.get.mockResolvedValue({ data: mockCategoryResponse });

      const result = await preferencesApi.getNotificationPreferences(userId);

      expect(mockClient.get).toHaveBeenCalledWith(
        `/users/${userId}/preferences/notification`
      );
      expect(result).toEqual(mockCategoryResponse);
    });

    it('should update notification preferences', async () => {
      const updateData: NotificationPreferencesUpdate = {
        emailNotifications: false,
      };

      mockClient.put.mockResolvedValue({ data: mockCategoryResponse });

      const result = await preferencesApi.updateNotificationPreferences(
        userId,
        updateData
      );

      expect(mockClient.put).toHaveBeenCalledWith(
        `/users/${userId}/preferences/notification`,
        updateData
      );
      expect(result).toEqual(mockCategoryResponse);
    });
  });

  describe('convenience methods - display', () => {
    const mockCategoryResponse: PreferenceCategoryResponse = {
      userId,
      category: 'display',
      preferences: { fontSize: 'large' },
      updatedAt: '2024-01-01T00:00:00Z',
    };

    it('should get display preferences', async () => {
      mockClient.get.mockResolvedValue({ data: mockCategoryResponse });

      const result = await preferencesApi.getDisplayPreferences(userId);

      expect(mockClient.get).toHaveBeenCalledWith(
        `/users/${userId}/preferences/display`
      );
      expect(result).toEqual(mockCategoryResponse);
    });

    it('should update display preferences', async () => {
      const updateData: DisplayPreferencesUpdate = {
        fontSize: 'LARGE',
        compactMode: true,
      };

      mockClient.put.mockResolvedValue({ data: mockCategoryResponse });

      const result = await preferencesApi.updateDisplayPreferences(
        userId,
        updateData
      );

      expect(mockClient.put).toHaveBeenCalledWith(
        `/users/${userId}/preferences/display`,
        updateData
      );
      expect(result).toEqual(mockCategoryResponse);
    });
  });

  describe('convenience methods - privacy', () => {
    const mockCategoryResponse: PreferenceCategoryResponse = {
      userId,
      category: 'privacy',
      preferences: { profileVisibility: 'private' },
      updatedAt: '2024-01-01T00:00:00Z',
    };

    it('should get privacy preferences', async () => {
      mockClient.get.mockResolvedValue({ data: mockCategoryResponse });

      const result = await preferencesApi.getPrivacyPreferences(userId);

      expect(mockClient.get).toHaveBeenCalledWith(
        `/users/${userId}/preferences/privacy`
      );
      expect(result).toEqual(mockCategoryResponse);
    });

    it('should update privacy preferences', async () => {
      const updateData: PrivacyPreferencesUpdate = {
        profileVisibility: 'PRIVATE',
        dataSharing: false,
      };

      mockClient.put.mockResolvedValue({ data: mockCategoryResponse });

      const result = await preferencesApi.updatePrivacyPreferences(
        userId,
        updateData
      );

      expect(mockClient.put).toHaveBeenCalledWith(
        `/users/${userId}/preferences/privacy`,
        updateData
      );
      expect(result).toEqual(mockCategoryResponse);
    });
  });

  describe('convenience methods - accessibility', () => {
    const mockCategoryResponse: PreferenceCategoryResponse = {
      userId,
      category: 'accessibility',
      preferences: { highContrast: true },
      updatedAt: '2024-01-01T00:00:00Z',
    };

    it('should get accessibility preferences', async () => {
      mockClient.get.mockResolvedValue({ data: mockCategoryResponse });

      const result = await preferencesApi.getAccessibilityPreferences(userId);

      expect(mockClient.get).toHaveBeenCalledWith(
        `/users/${userId}/preferences/accessibility`
      );
      expect(result).toEqual(mockCategoryResponse);
    });

    it('should update accessibility preferences', async () => {
      const updateData: AccessibilityPreferencesUpdate = {
        highContrast: true,
        reducedMotion: true,
      };

      mockClient.put.mockResolvedValue({ data: mockCategoryResponse });

      const result = await preferencesApi.updateAccessibilityPreferences(
        userId,
        updateData
      );

      expect(mockClient.put).toHaveBeenCalledWith(
        `/users/${userId}/preferences/accessibility`,
        updateData
      );
      expect(result).toEqual(mockCategoryResponse);
    });
  });

  describe('convenience methods - language', () => {
    const mockCategoryResponse: PreferenceCategoryResponse = {
      userId,
      category: 'language',
      preferences: { primaryLanguage: 'es' },
      updatedAt: '2024-01-01T00:00:00Z',
    };

    it('should get language preferences', async () => {
      mockClient.get.mockResolvedValue({ data: mockCategoryResponse });

      const result = await preferencesApi.getLanguagePreferences(userId);

      expect(mockClient.get).toHaveBeenCalledWith(
        `/users/${userId}/preferences/language`
      );
      expect(result).toEqual(mockCategoryResponse);
    });

    it('should update language preferences', async () => {
      const updateData: LanguagePreferencesUpdate = {
        primaryLanguage: 'ES',
        translationEnabled: true,
      };

      mockClient.put.mockResolvedValue({ data: mockCategoryResponse });

      const result = await preferencesApi.updateLanguagePreferences(
        userId,
        updateData
      );

      expect(mockClient.put).toHaveBeenCalledWith(
        `/users/${userId}/preferences/language`,
        updateData
      );
      expect(result).toEqual(mockCategoryResponse);
    });
  });

  describe('convenience methods - security', () => {
    const mockCategoryResponse: PreferenceCategoryResponse = {
      userId,
      category: 'security',
      preferences: { twoFactorAuth: true },
      updatedAt: '2024-01-01T00:00:00Z',
    };

    it('should get security preferences', async () => {
      mockClient.get.mockResolvedValue({ data: mockCategoryResponse });

      const result = await preferencesApi.getSecurityPreferences(userId);

      expect(mockClient.get).toHaveBeenCalledWith(
        `/users/${userId}/preferences/security`
      );
      expect(result).toEqual(mockCategoryResponse);
    });

    it('should update security preferences', async () => {
      const updateData: SecurityPreferencesUpdate = {
        twoFactorAuth: true,
        loginNotifications: true,
      };

      mockClient.put.mockResolvedValue({ data: mockCategoryResponse });

      const result = await preferencesApi.updateSecurityPreferences(
        userId,
        updateData
      );

      expect(mockClient.put).toHaveBeenCalledWith(
        `/users/${userId}/preferences/security`,
        updateData
      );
      expect(result).toEqual(mockCategoryResponse);
    });
  });

  describe('convenience methods - social', () => {
    const mockCategoryResponse: PreferenceCategoryResponse = {
      userId,
      category: 'social',
      preferences: { friendRequests: false },
      updatedAt: '2024-01-01T00:00:00Z',
    };

    it('should get social preferences', async () => {
      mockClient.get.mockResolvedValue({ data: mockCategoryResponse });

      const result = await preferencesApi.getSocialPreferences(userId);

      expect(mockClient.get).toHaveBeenCalledWith(
        `/users/${userId}/preferences/social`
      );
      expect(result).toEqual(mockCategoryResponse);
    });

    it('should update social preferences', async () => {
      const updateData: SocialPreferencesUpdate = {
        friendRequests: false,
        shareActivity: false,
      };

      mockClient.put.mockResolvedValue({ data: mockCategoryResponse });

      const result = await preferencesApi.updateSocialPreferences(
        userId,
        updateData
      );

      expect(mockClient.put).toHaveBeenCalledWith(
        `/users/${userId}/preferences/social`,
        updateData
      );
      expect(result).toEqual(mockCategoryResponse);
    });
  });

  describe('convenience methods - sound', () => {
    const mockCategoryResponse: PreferenceCategoryResponse = {
      userId,
      category: 'sound',
      preferences: { muteNotifications: true },
      updatedAt: '2024-01-01T00:00:00Z',
    };

    it('should get sound preferences', async () => {
      mockClient.get.mockResolvedValue({ data: mockCategoryResponse });

      const result = await preferencesApi.getSoundPreferences(userId);

      expect(mockClient.get).toHaveBeenCalledWith(
        `/users/${userId}/preferences/sound`
      );
      expect(result).toEqual(mockCategoryResponse);
    });

    it('should update sound preferences', async () => {
      const updateData: SoundPreferencesUpdate = {
        muteNotifications: true,
        notificationSounds: false,
      };

      mockClient.put.mockResolvedValue({ data: mockCategoryResponse });

      const result = await preferencesApi.updateSoundPreferences(
        userId,
        updateData
      );

      expect(mockClient.put).toHaveBeenCalledWith(
        `/users/${userId}/preferences/sound`,
        updateData
      );
      expect(result).toEqual(mockCategoryResponse);
    });
  });

  describe('convenience methods - theme', () => {
    const mockCategoryResponse: PreferenceCategoryResponse = {
      userId,
      category: 'theme',
      preferences: { darkMode: true },
      updatedAt: '2024-01-01T00:00:00Z',
    };

    it('should get theme preferences', async () => {
      mockClient.get.mockResolvedValue({ data: mockCategoryResponse });

      const result = await preferencesApi.getThemePreferences(userId);

      expect(mockClient.get).toHaveBeenCalledWith(
        `/users/${userId}/preferences/theme`
      );
      expect(result).toEqual(mockCategoryResponse);
    });

    it('should update theme preferences', async () => {
      const updateData: ThemePreferencesUpdate = {
        darkMode: true,
        autoTheme: false,
      };

      mockClient.put.mockResolvedValue({ data: mockCategoryResponse });

      const result = await preferencesApi.updateThemePreferences(
        userId,
        updateData
      );

      expect(mockClient.put).toHaveBeenCalledWith(
        `/users/${userId}/preferences/theme`,
        updateData
      );
      expect(result).toEqual(mockCategoryResponse);
    });
  });

  describe('resetPreferenceCategory', () => {
    it('should reset a preference category to defaults', async () => {
      const mockResponse: PreferenceCategoryResponse = {
        userId,
        category: 'notification',
        preferences: {
          emailNotifications: true,
          pushNotifications: true,
          smsNotifications: false,
        },
        updatedAt: '2024-01-02T00:00:00Z',
      };

      mockClient.put.mockResolvedValue({ data: mockResponse });

      const result = await preferencesApi.resetPreferenceCategory(
        userId,
        'notification'
      );

      expect(mockClient.put).toHaveBeenCalledWith(
        `/users/${userId}/preferences/notification`,
        {}
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle reset error', async () => {
      mockClient.put.mockRejectedValue(new Error('Reset failed'));

      await expect(
        preferencesApi.resetPreferenceCategory(userId, 'notification')
      ).rejects.toThrow();
    });
  });

  describe('getAllPreferencesFlat', () => {
    it('should return all preferences in flat format', async () => {
      const mockPreferences: UserPreferencesResponse = {
        userId,
        notification: {
          emailNotifications: true,
          pushNotifications: false,
        },
        display: {
          fontSize: 'LARGE',
          compactMode: true,
        },
        privacy: {
          profileVisibility: 'PRIVATE',
        },
        accessibility: {
          highContrast: true,
        },
        language: {
          primaryLanguage: 'EN',
        },
        security: {
          twoFactorAuth: true,
        },
        social: {
          friendRequests: true,
        },
        sound: {
          muteNotifications: false,
        },
        theme: {
          darkMode: true,
        },
      };

      mockClient.get.mockResolvedValue({ data: mockPreferences });

      const result = await preferencesApi.getAllPreferencesFlat(userId);

      expect(mockClient.get).toHaveBeenCalledWith(
        `/users/${userId}/preferences`
      );
      expect(result).toEqual({
        emailNotifications: true,
        pushNotifications: false,
        fontSize: 'LARGE',
        compactMode: true,
        profileVisibility: 'PRIVATE',
        highContrast: true,
        primaryLanguage: 'EN',
        twoFactorAuth: true,
        friendRequests: true,
        muteNotifications: false,
        darkMode: true,
      });
    });

    it('should handle undefined categories in flat format', async () => {
      const mockPreferences: UserPreferencesResponse = {
        userId,
        notification: {
          emailNotifications: true,
        },
        // Other categories undefined
      };

      mockClient.get.mockResolvedValue({ data: mockPreferences });

      const result = await preferencesApi.getAllPreferencesFlat(userId);

      expect(result).toEqual({
        emailNotifications: true,
      });
    });

    it('should handle getAllPreferencesFlat error', async () => {
      mockClient.get.mockRejectedValue(new Error('Failed to fetch'));

      await expect(
        preferencesApi.getAllPreferencesFlat(userId)
      ).rejects.toThrow();
    });
  });
});
