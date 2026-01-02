import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { preferencesApi } from '@/lib/api/user-management';
import { QUERY_KEYS } from '@/constants';
import { useAuthStore } from '@/stores/auth-store';
import type {
  PreferenceCategory,
  UserPreferencesUpdateRequest,
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

// ============================================================================
// All Preferences Hooks
// ============================================================================

/**
 * Hook to get all user preferences
 * Can optionally filter by categories
 */
export const useUserPreferences = (
  userId: string,
  categories?: PreferenceCategory[]
) => {
  return useQuery({
    queryKey: [
      ...QUERY_KEYS.USER_MANAGEMENT.PREFERENCES,
      userId,
      { categories },
    ],
    queryFn: () => preferencesApi.getUserPreferences(userId, { categories }),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to get current user's preferences
 * Uses user.id from auth store
 */
export const useCurrentUserPreferences = (
  categories?: PreferenceCategory[]
) => {
  const { isAuthenticated, user } = useAuthStore();
  const userId = user?.id;

  return useQuery({
    queryKey: [
      ...QUERY_KEYS.USER_MANAGEMENT.PREFERENCES,
      'current',
      { categories },
    ],
    queryFn: () => {
      if (!userId) {
        throw new Error('User ID not available in auth store');
      }
      return preferencesApi.getUserPreferences(userId, { categories });
    },
    enabled: isAuthenticated && !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to update multiple preference categories at once
 */
export const useUpdateUserPreferences = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      data,
    }: {
      userId: string;
      data: UserPreferencesUpdateRequest;
    }) => preferencesApi.updateUserPreferences(userId, data),
    onSuccess: (_, { userId }) => {
      // Invalidate all preference queries for this user
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.USER_MANAGEMENT.PREFERENCES, userId],
      });
      // Also invalidate current user preferences if applicable
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.USER_MANAGEMENT.PREFERENCES, 'current'],
      });
    },
  });
};

// ============================================================================
// Category-Specific Query Hooks
// ============================================================================

/**
 * Hook to get a specific preference category
 */
export const usePreferenceCategory = (
  userId: string,
  category: PreferenceCategory
) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.USER_MANAGEMENT.PREFERENCES, userId, category],
    queryFn: () => preferencesApi.getPreferenceCategory(userId, category),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to get notification preferences
 */
export const useNotificationPreferences = (userId: string) => {
  return useQuery({
    queryKey: [
      ...QUERY_KEYS.USER_MANAGEMENT.PREFERENCES,
      userId,
      'notification',
    ],
    queryFn: () => preferencesApi.getNotificationPreferences(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Hook to get display preferences
 */
export const useDisplayPreferences = (userId: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.USER_MANAGEMENT.PREFERENCES, userId, 'display'],
    queryFn: () => preferencesApi.getDisplayPreferences(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Hook to get privacy preferences
 */
export const usePrivacyPreferences = (userId: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.USER_MANAGEMENT.PREFERENCES, userId, 'privacy'],
    queryFn: () => preferencesApi.getPrivacyPreferences(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Hook to get accessibility preferences
 */
export const useAccessibilityPreferences = (userId: string) => {
  return useQuery({
    queryKey: [
      ...QUERY_KEYS.USER_MANAGEMENT.PREFERENCES,
      userId,
      'accessibility',
    ],
    queryFn: () => preferencesApi.getAccessibilityPreferences(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Hook to get language preferences
 */
export const useLanguagePreferences = (userId: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.USER_MANAGEMENT.PREFERENCES, userId, 'language'],
    queryFn: () => preferencesApi.getLanguagePreferences(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Hook to get security preferences
 */
export const useSecurityPreferences = (userId: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.USER_MANAGEMENT.PREFERENCES, userId, 'security'],
    queryFn: () => preferencesApi.getSecurityPreferences(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Hook to get social preferences
 */
export const useSocialPreferences = (userId: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.USER_MANAGEMENT.PREFERENCES, userId, 'social'],
    queryFn: () => preferencesApi.getSocialPreferences(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Hook to get sound preferences
 */
export const useSoundPreferences = (userId: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.USER_MANAGEMENT.PREFERENCES, userId, 'sound'],
    queryFn: () => preferencesApi.getSoundPreferences(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Hook to get theme preferences
 */
export const useThemePreferences = (userId: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.USER_MANAGEMENT.PREFERENCES, userId, 'theme'],
    queryFn: () => preferencesApi.getThemePreferences(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// ============================================================================
// Category-Specific Mutation Hooks
// ============================================================================

/**
 * Hook to update notification preferences
 */
export const useUpdateNotificationPreferences = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      data,
    }: {
      userId: string;
      data: NotificationPreferencesUpdate;
    }) => preferencesApi.updateNotificationPreferences(userId, data),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({
        queryKey: [
          ...QUERY_KEYS.USER_MANAGEMENT.PREFERENCES,
          userId,
          'notification',
        ],
      });
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.USER_MANAGEMENT.PREFERENCES, userId],
        exact: false,
      });
    },
  });
};

/**
 * Hook to update display preferences
 */
export const useUpdateDisplayPreferences = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      data,
    }: {
      userId: string;
      data: DisplayPreferencesUpdate;
    }) => preferencesApi.updateDisplayPreferences(userId, data),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({
        queryKey: [
          ...QUERY_KEYS.USER_MANAGEMENT.PREFERENCES,
          userId,
          'display',
        ],
      });
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.USER_MANAGEMENT.PREFERENCES, userId],
        exact: false,
      });
    },
  });
};

/**
 * Hook to update privacy preferences
 */
export const useUpdatePrivacyPreferences = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      data,
    }: {
      userId: string;
      data: PrivacyPreferencesUpdate;
    }) => preferencesApi.updatePrivacyPreferences(userId, data),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({
        queryKey: [
          ...QUERY_KEYS.USER_MANAGEMENT.PREFERENCES,
          userId,
          'privacy',
        ],
      });
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.USER_MANAGEMENT.PREFERENCES, userId],
        exact: false,
      });
    },
  });
};

/**
 * Hook to update accessibility preferences
 */
export const useUpdateAccessibilityPreferences = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      data,
    }: {
      userId: string;
      data: AccessibilityPreferencesUpdate;
    }) => preferencesApi.updateAccessibilityPreferences(userId, data),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({
        queryKey: [
          ...QUERY_KEYS.USER_MANAGEMENT.PREFERENCES,
          userId,
          'accessibility',
        ],
      });
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.USER_MANAGEMENT.PREFERENCES, userId],
        exact: false,
      });
    },
  });
};

/**
 * Hook to update language preferences
 */
export const useUpdateLanguagePreferences = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      data,
    }: {
      userId: string;
      data: LanguagePreferencesUpdate;
    }) => preferencesApi.updateLanguagePreferences(userId, data),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({
        queryKey: [
          ...QUERY_KEYS.USER_MANAGEMENT.PREFERENCES,
          userId,
          'language',
        ],
      });
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.USER_MANAGEMENT.PREFERENCES, userId],
        exact: false,
      });
    },
  });
};

/**
 * Hook to update security preferences
 */
export const useUpdateSecurityPreferences = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      data,
    }: {
      userId: string;
      data: SecurityPreferencesUpdate;
    }) => preferencesApi.updateSecurityPreferences(userId, data),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({
        queryKey: [
          ...QUERY_KEYS.USER_MANAGEMENT.PREFERENCES,
          userId,
          'security',
        ],
      });
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.USER_MANAGEMENT.PREFERENCES, userId],
        exact: false,
      });
    },
  });
};

/**
 * Hook to update social preferences
 */
export const useUpdateSocialPreferences = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      data,
    }: {
      userId: string;
      data: SocialPreferencesUpdate;
    }) => preferencesApi.updateSocialPreferences(userId, data),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.USER_MANAGEMENT.PREFERENCES, userId, 'social'],
      });
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.USER_MANAGEMENT.PREFERENCES, userId],
        exact: false,
      });
    },
  });
};

/**
 * Hook to update sound preferences
 */
export const useUpdateSoundPreferences = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      data,
    }: {
      userId: string;
      data: SoundPreferencesUpdate;
    }) => preferencesApi.updateSoundPreferences(userId, data),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.USER_MANAGEMENT.PREFERENCES, userId, 'sound'],
      });
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.USER_MANAGEMENT.PREFERENCES, userId],
        exact: false,
      });
    },
  });
};

/**
 * Hook to update theme preferences
 */
export const useUpdateThemePreferences = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      data,
    }: {
      userId: string;
      data: ThemePreferencesUpdate;
    }) => preferencesApi.updateThemePreferences(userId, data),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.USER_MANAGEMENT.PREFERENCES, userId, 'theme'],
      });
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.USER_MANAGEMENT.PREFERENCES, userId],
        exact: false,
      });
    },
  });
};

// ============================================================================
// Helper Hooks
// ============================================================================

/**
 * Hook to reset a preference category to defaults
 */
export const useResetPreferenceCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      category,
    }: {
      userId: string;
      category: PreferenceCategory;
    }) => preferencesApi.resetPreferenceCategory(userId, category),
    onSuccess: (_, { userId, category }) => {
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.USER_MANAGEMENT.PREFERENCES, userId, category],
      });
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.USER_MANAGEMENT.PREFERENCES, userId],
        exact: false,
      });
    },
  });
};

/**
 * Hook to get all preferences in a flat format
 */
export const useAllPreferencesFlat = (userId: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.USER_MANAGEMENT.PREFERENCES, userId, 'flat'],
    queryFn: () => preferencesApi.getAllPreferencesFlat(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
