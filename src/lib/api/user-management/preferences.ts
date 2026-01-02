import {
  userManagementClient,
  handleUserManagementApiError,
  buildQueryParams,
} from './client';
import type {
  PreferenceCategory,
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

/**
 * User Preferences API functions
 * Manages all 9 preference categories per new OpenAPI spec:
 * - notification, display, privacy, accessibility, language, security, social, sound, theme
 *
 * Users can access their own preferences, admins can access any user's preferences,
 * and services with user:read/user:write scope can also access/modify preferences.
 */
export const preferencesApi = {
  /**
   * Get all user preferences
   * Retrieve all or filtered user preferences
   * Requires: user:read scope (or admin scope for other users)
   */
  async getUserPreferences(
    userId: string,
    params?: {
      categories?: PreferenceCategory[];
    }
  ): Promise<UserPreferencesResponse> {
    try {
      const queryParams: Record<string, string> = {};
      if (params?.categories?.length) {
        queryParams['categories'] = params.categories.join(',');
      }

      const queryString = buildQueryParams(queryParams);
      const url = queryString
        ? `/users/${userId}/preferences?${queryString}`
        : `/users/${userId}/preferences`;

      const response = await userManagementClient.get(url);
      return response.data as UserPreferencesResponse;
    } catch (error) {
      handleUserManagementApiError(error);
      throw error;
    }
  },

  /**
   * Update multiple preference categories at once
   * Only provided categories will be updated
   * Requires: user:write scope (or admin scope for other users)
   */
  async updateUserPreferences(
    userId: string,
    data: UserPreferencesUpdateRequest
  ): Promise<UserPreferencesResponse> {
    try {
      const response = await userManagementClient.put(
        `/users/${userId}/preferences`,
        data
      );
      return response.data as UserPreferencesResponse;
    } catch (error) {
      handleUserManagementApiError(error);
      throw error;
    }
  },

  /**
   * Get a specific preference category
   * Retrieve a single preference category for a user
   * Requires: user:read scope (or admin scope for other users)
   */
  async getPreferenceCategory(
    userId: string,
    category: PreferenceCategory
  ): Promise<PreferenceCategoryResponse> {
    try {
      const response = await userManagementClient.get(
        `/users/${userId}/preferences/${category}`
      );
      return response.data as PreferenceCategoryResponse;
    } catch (error) {
      handleUserManagementApiError(error);
      throw error;
    }
  },

  /**
   * Update a specific preference category
   * Supports partial updates - only provided fields will be updated
   * Requires: user:write scope (or admin scope for other users)
   */
  async updatePreferenceCategory<T extends PreferenceCategory>(
    userId: string,
    category: T,
    data: T extends 'notification'
      ? NotificationPreferencesUpdate
      : T extends 'display'
        ? DisplayPreferencesUpdate
        : T extends 'privacy'
          ? PrivacyPreferencesUpdate
          : T extends 'accessibility'
            ? AccessibilityPreferencesUpdate
            : T extends 'language'
              ? LanguagePreferencesUpdate
              : T extends 'security'
                ? SecurityPreferencesUpdate
                : T extends 'social'
                  ? SocialPreferencesUpdate
                  : T extends 'sound'
                    ? SoundPreferencesUpdate
                    : T extends 'theme'
                      ? ThemePreferencesUpdate
                      : never
  ): Promise<PreferenceCategoryResponse> {
    try {
      const response = await userManagementClient.put(
        `/users/${userId}/preferences/${category}`,
        data
      );
      return response.data as PreferenceCategoryResponse;
    } catch (error) {
      handleUserManagementApiError(error);
      throw error;
    }
  },

  // ============================================================================
  // Convenience methods for each category
  // ============================================================================

  /**
   * Get notification preferences
   */
  async getNotificationPreferences(
    userId: string
  ): Promise<PreferenceCategoryResponse> {
    return this.getPreferenceCategory(userId, 'notification');
  },

  /**
   * Update notification preferences
   */
  async updateNotificationPreferences(
    userId: string,
    data: NotificationPreferencesUpdate
  ): Promise<PreferenceCategoryResponse> {
    return this.updatePreferenceCategory(userId, 'notification', data);
  },

  /**
   * Get display preferences
   */
  async getDisplayPreferences(
    userId: string
  ): Promise<PreferenceCategoryResponse> {
    return this.getPreferenceCategory(userId, 'display');
  },

  /**
   * Update display preferences
   */
  async updateDisplayPreferences(
    userId: string,
    data: DisplayPreferencesUpdate
  ): Promise<PreferenceCategoryResponse> {
    return this.updatePreferenceCategory(userId, 'display', data);
  },

  /**
   * Get privacy preferences
   */
  async getPrivacyPreferences(
    userId: string
  ): Promise<PreferenceCategoryResponse> {
    return this.getPreferenceCategory(userId, 'privacy');
  },

  /**
   * Update privacy preferences
   */
  async updatePrivacyPreferences(
    userId: string,
    data: PrivacyPreferencesUpdate
  ): Promise<PreferenceCategoryResponse> {
    return this.updatePreferenceCategory(userId, 'privacy', data);
  },

  /**
   * Get accessibility preferences
   */
  async getAccessibilityPreferences(
    userId: string
  ): Promise<PreferenceCategoryResponse> {
    return this.getPreferenceCategory(userId, 'accessibility');
  },

  /**
   * Update accessibility preferences
   */
  async updateAccessibilityPreferences(
    userId: string,
    data: AccessibilityPreferencesUpdate
  ): Promise<PreferenceCategoryResponse> {
    return this.updatePreferenceCategory(userId, 'accessibility', data);
  },

  /**
   * Get language preferences
   */
  async getLanguagePreferences(
    userId: string
  ): Promise<PreferenceCategoryResponse> {
    return this.getPreferenceCategory(userId, 'language');
  },

  /**
   * Update language preferences
   */
  async updateLanguagePreferences(
    userId: string,
    data: LanguagePreferencesUpdate
  ): Promise<PreferenceCategoryResponse> {
    return this.updatePreferenceCategory(userId, 'language', data);
  },

  /**
   * Get security preferences
   */
  async getSecurityPreferences(
    userId: string
  ): Promise<PreferenceCategoryResponse> {
    return this.getPreferenceCategory(userId, 'security');
  },

  /**
   * Update security preferences
   */
  async updateSecurityPreferences(
    userId: string,
    data: SecurityPreferencesUpdate
  ): Promise<PreferenceCategoryResponse> {
    return this.updatePreferenceCategory(userId, 'security', data);
  },

  /**
   * Get social preferences
   */
  async getSocialPreferences(
    userId: string
  ): Promise<PreferenceCategoryResponse> {
    return this.getPreferenceCategory(userId, 'social');
  },

  /**
   * Update social preferences
   */
  async updateSocialPreferences(
    userId: string,
    data: SocialPreferencesUpdate
  ): Promise<PreferenceCategoryResponse> {
    return this.updatePreferenceCategory(userId, 'social', data);
  },

  /**
   * Get sound preferences
   */
  async getSoundPreferences(
    userId: string
  ): Promise<PreferenceCategoryResponse> {
    return this.getPreferenceCategory(userId, 'sound');
  },

  /**
   * Update sound preferences
   */
  async updateSoundPreferences(
    userId: string,
    data: SoundPreferencesUpdate
  ): Promise<PreferenceCategoryResponse> {
    return this.updatePreferenceCategory(userId, 'sound', data);
  },

  /**
   * Get theme preferences
   */
  async getThemePreferences(
    userId: string
  ): Promise<PreferenceCategoryResponse> {
    return this.getPreferenceCategory(userId, 'theme');
  },

  /**
   * Update theme preferences
   */
  async updateThemePreferences(
    userId: string,
    data: ThemePreferencesUpdate
  ): Promise<PreferenceCategoryResponse> {
    return this.updatePreferenceCategory(userId, 'theme', data);
  },

  // ============================================================================
  // Helper methods
  // ============================================================================

  /**
   * Reset preferences to defaults for a category
   * Implemented by passing empty object to update
   */
  async resetPreferenceCategory(
    userId: string,
    category: PreferenceCategory
  ): Promise<PreferenceCategoryResponse> {
    try {
      const response = await userManagementClient.put(
        `/users/${userId}/preferences/${category}`,
        {}
      );
      return response.data as PreferenceCategoryResponse;
    } catch (error) {
      handleUserManagementApiError(error);
      throw error;
    }
  },

  /**
   * Get all preferences with a user-friendly format
   * Returns a flat object with all preference values
   */
  async getAllPreferencesFlat(
    userId: string
  ): Promise<Record<string, unknown>> {
    try {
      const prefs = await this.getUserPreferences(userId);
      return {
        ...prefs.notification,
        ...prefs.display,
        ...prefs.privacy,
        ...prefs.accessibility,
        ...prefs.language,
        ...prefs.security,
        ...prefs.social,
        ...prefs.sound,
        ...prefs.theme,
      };
    } catch (error) {
      handleUserManagementApiError(error);
      throw error;
    }
  },
};
