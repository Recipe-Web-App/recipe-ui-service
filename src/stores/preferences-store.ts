import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  UserPreferences,
  DisplayPreferences,
  NotificationPreferences,
  PrivacyPreferences,
  Theme,
} from '@/types/user-management';

interface PreferencesState {
  // Backend preferences (synced with user-management service)
  preferences: UserPreferences | null;

  // Loading and sync states
  isLoading: boolean;
  isSync: boolean;
  lastSyncedAt: number | null;

  // Actions for managing preferences
  setPreferences: (preferences: UserPreferences) => void;
  updateDisplayPreferences: (preferences: Partial<DisplayPreferences>) => void;
  updateNotificationPreferences: (
    preferences: Partial<NotificationPreferences>
  ) => void;
  updatePrivacyPreferences: (preferences: Partial<PrivacyPreferences>) => void;

  // Sync management
  setLoading: (loading: boolean) => void;
  markSynced: () => void;
  markOutOfSync: () => void;
  clearPreferences: () => void;

  // Getters
  getDisplayPreferences: () => DisplayPreferences | undefined;
  getNotificationPreferences: () => NotificationPreferences | undefined;
  getPrivacyPreferences: () => PrivacyPreferences | undefined;
  getTheme: () => Theme | undefined;
  getLanguage: () => string | undefined;
  getTimezone: () => string | undefined;

  // Utility methods
  isPreferenceSet: (
    category: 'notification' | 'privacy' | 'display'
  ) => boolean;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set, get) => ({
      // Initial state
      preferences: null,
      isLoading: false,
      isSync: true,
      lastSyncedAt: null,

      // Actions for managing preferences
      setPreferences: (preferences: UserPreferences) => {
        set({
          preferences,
          isSync: true,
          lastSyncedAt: Date.now(),
        });
      },

      updateDisplayPreferences: (updates: Partial<DisplayPreferences>) => {
        const current = get().preferences;
        set({
          preferences: {
            ...current,
            display_preferences: {
              ...current?.display_preferences,
              ...updates,
            },
          },
          isSync: false,
        });
      },

      updateNotificationPreferences: (
        updates: Partial<NotificationPreferences>
      ) => {
        const current = get().preferences;
        set({
          preferences: {
            ...current,
            notification_preferences: {
              ...current?.notification_preferences,
              ...updates,
            },
          },
          isSync: false,
        });
      },

      updatePrivacyPreferences: (updates: Partial<PrivacyPreferences>) => {
        const current = get().preferences;
        set({
          preferences: {
            ...current,
            privacy_preferences: {
              ...current?.privacy_preferences,
              ...updates,
            },
          },
          isSync: false,
        });
      },

      // Sync management
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      markSynced: () => {
        set({
          isSync: true,
          lastSyncedAt: Date.now(),
        });
      },

      markOutOfSync: () => {
        set({ isSync: false });
      },

      clearPreferences: () => {
        set({
          preferences: null,
          isSync: true,
          lastSyncedAt: null,
        });
      },

      // Getters
      getDisplayPreferences: () => {
        return get().preferences?.display_preferences;
      },

      getNotificationPreferences: () => {
        return get().preferences?.notification_preferences;
      },

      getPrivacyPreferences: () => {
        return get().preferences?.privacy_preferences;
      },

      getTheme: () => {
        return get().preferences?.display_preferences?.theme;
      },

      getLanguage: () => {
        return get().preferences?.display_preferences?.language;
      },

      getTimezone: () => {
        return get().preferences?.display_preferences?.timezone;
      },

      // Utility methods
      isPreferenceSet: (category: 'notification' | 'privacy' | 'display') => {
        const preferences = get().preferences;
        if (!preferences) return false;

        switch (category) {
          case 'notification':
            return (
              !!preferences.notification_preferences &&
              Object.keys(preferences.notification_preferences).length > 0
            );
          case 'privacy':
            return (
              !!preferences.privacy_preferences &&
              Object.keys(preferences.privacy_preferences).length > 0
            );
          case 'display':
            return (
              !!preferences.display_preferences &&
              Object.keys(preferences.display_preferences).length > 0
            );
          default:
            return false;
        }
      },
    }),
    {
      name: 'user-preferences-storage',
      partialize: state => ({
        preferences: state.preferences,
        lastSyncedAt: state.lastSyncedAt,
      }),
    }
  )
);
