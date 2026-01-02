import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  UserPreferencesResponse,
  DisplayPreferences,
  NotificationPreferences,
  PrivacyPreferences,
  ThemeEnum,
} from '@/types/user-management';

interface PreferencesState {
  // Backend preferences (synced with user-management service)
  preferences: UserPreferencesResponse | null;

  // Loading and sync states
  isLoading: boolean;
  isSync: boolean;
  lastSyncedAt: number | null;

  // Actions for managing preferences
  setPreferences: (preferences: UserPreferencesResponse) => void;
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
  getTheme: () => ThemeEnum | undefined;
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
      setPreferences: (preferences: UserPreferencesResponse) => {
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
            userId: current?.userId ?? '',
            display: {
              ...current?.display,
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
            userId: current?.userId ?? '',
            notification: {
              ...current?.notification,
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
            userId: current?.userId ?? '',
            privacy: {
              ...current?.privacy,
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
        return get().preferences?.display;
      },

      getNotificationPreferences: () => {
        return get().preferences?.notification;
      },

      getPrivacyPreferences: () => {
        return get().preferences?.privacy;
      },

      getTheme: () => {
        return get().preferences?.theme?.customTheme;
      },

      getLanguage: () => {
        return get().preferences?.language?.primaryLanguage;
      },

      getTimezone: () => {
        // Timezone is no longer in display preferences per new schema
        return undefined;
      },

      // Utility methods
      isPreferenceSet: (category: 'notification' | 'privacy' | 'display') => {
        const preferences = get().preferences;
        if (!preferences) return false;

        switch (category) {
          case 'notification':
            return (
              !!preferences.notification &&
              Object.keys(preferences.notification).length > 0
            );
          case 'privacy':
            return (
              !!preferences.privacy &&
              Object.keys(preferences.privacy).length > 0
            );
          case 'display':
            return (
              !!preferences.display &&
              Object.keys(preferences.display).length > 0
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
