import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsApi } from '@/lib/api/user-management';
import { QUERY_KEYS } from '@/constants';
import type {
  UserPreferences,
  NotificationPreferences,
} from '@/types/user-management';

/**
 * Hook to get user preferences (including notification preferences)
 */
export const useUserPreferences = () => {
  return useQuery({
    queryKey: QUERY_KEYS.USER_MANAGEMENT.PREFERENCES,
    queryFn: () => notificationsApi.getNotificationPreferences(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to get notification preferences specifically
 */
export const useNotificationPreferences = () => {
  return useQuery({
    queryKey: [...QUERY_KEYS.USER_MANAGEMENT.PREFERENCES, 'notifications'],
    queryFn: () => notificationsApi.getNotificationPreferences(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    select: (data: UserPreferences) => data.notification_preferences,
  });
};

/**
 * Hook to get display preferences
 */
export const useDisplayPreferences = () => {
  return useQuery({
    queryKey: [...QUERY_KEYS.USER_MANAGEMENT.PREFERENCES, 'display'],
    queryFn: () => notificationsApi.getNotificationPreferences(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    select: (data: UserPreferences) => data.display_preferences,
  });
};

/**
 * Hook to get privacy preferences
 */
export const usePrivacyPreferences = () => {
  return useQuery({
    queryKey: [...QUERY_KEYS.USER_MANAGEMENT.PREFERENCES, 'privacy'],
    queryFn: () => notificationsApi.getNotificationPreferences(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    select: (data: UserPreferences) => data.privacy_preferences,
  });
};

/**
 * Hook to update all user preferences
 */
export const useUpdateUserPreferences = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (preferences: UserPreferences) =>
      notificationsApi.updateNotificationPreferences(preferences),
    onMutate: async newPreferences => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.USER_MANAGEMENT.PREFERENCES,
      });

      // Snapshot the previous value
      const previousPreferences = queryClient.getQueryData<UserPreferences>(
        QUERY_KEYS.USER_MANAGEMENT.PREFERENCES
      );

      // Optimistically update to the new value
      queryClient.setQueryData<UserPreferences>(
        QUERY_KEYS.USER_MANAGEMENT.PREFERENCES,
        newPreferences
      );

      return { previousPreferences };
    },
    onSuccess: updatedPreferences => {
      // Update with the server response
      queryClient.setQueryData(
        QUERY_KEYS.USER_MANAGEMENT.PREFERENCES,
        updatedPreferences
      );
    },
    onError: (_, __, context) => {
      // Rollback on error
      if (context?.previousPreferences) {
        queryClient.setQueryData(
          QUERY_KEYS.USER_MANAGEMENT.PREFERENCES,
          context.previousPreferences
        );
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.USER_MANAGEMENT.PREFERENCES,
      });
    },
  });
};

/**
 * Hook to update notification preferences specifically
 */
export const useUpdateNotificationPreferences = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationPreferences: Partial<NotificationPreferences>) =>
      notificationsApi.updateNotificationTypeSettings(notificationPreferences),
    onMutate: async newNotificationPreferences => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.USER_MANAGEMENT.PREFERENCES,
      });

      // Snapshot the previous value
      const previousPreferences = queryClient.getQueryData<UserPreferences>(
        QUERY_KEYS.USER_MANAGEMENT.PREFERENCES
      );

      // Optimistically update notification preferences
      if (previousPreferences) {
        const updatedPreferences = {
          ...previousPreferences,
          notification_preferences: {
            ...previousPreferences.notification_preferences,
            ...newNotificationPreferences,
          },
        };

        queryClient.setQueryData<UserPreferences>(
          QUERY_KEYS.USER_MANAGEMENT.PREFERENCES,
          updatedPreferences
        );
      }

      return { previousPreferences };
    },
    onSuccess: updatedPreferences => {
      // Update with the server response
      queryClient.setQueryData(
        QUERY_KEYS.USER_MANAGEMENT.PREFERENCES,
        updatedPreferences
      );
    },
    onError: (_, __, context) => {
      // Rollback on error
      if (context?.previousPreferences) {
        queryClient.setQueryData(
          QUERY_KEYS.USER_MANAGEMENT.PREFERENCES,
          context.previousPreferences
        );
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.USER_MANAGEMENT.PREFERENCES,
      });
    },
  });
};

/**
 * Hook to update a single notification type setting
 */
export const useToggleNotificationSetting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      settingKey,
      value,
    }: {
      settingKey: keyof NotificationPreferences;
      value: boolean;
    }) => {
      return notificationsApi.updateNotificationTypeSettings({
        [settingKey]: value,
      });
    },
    onMutate: async ({ settingKey, value }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.USER_MANAGEMENT.PREFERENCES,
      });

      // Snapshot the previous value
      const previousPreferences = queryClient.getQueryData<UserPreferences>(
        QUERY_KEYS.USER_MANAGEMENT.PREFERENCES
      );

      // Optimistically update the specific setting
      if (previousPreferences) {
        const updatedPreferences = {
          ...previousPreferences,
          notification_preferences: {
            ...previousPreferences.notification_preferences,
            [settingKey]: value,
          },
        };

        queryClient.setQueryData<UserPreferences>(
          QUERY_KEYS.USER_MANAGEMENT.PREFERENCES,
          updatedPreferences
        );
      }

      return { previousPreferences, settingKey, value };
    },
    onSuccess: updatedPreferences => {
      // Update with the server response
      queryClient.setQueryData(
        QUERY_KEYS.USER_MANAGEMENT.PREFERENCES,
        updatedPreferences
      );
    },
    onError: (_, __, context) => {
      // Rollback on error
      if (context?.previousPreferences) {
        queryClient.setQueryData(
          QUERY_KEYS.USER_MANAGEMENT.PREFERENCES,
          context.previousPreferences
        );
      }
    },
  });
};

/**
 * Hook to update display preferences
 */
export const useUpdateDisplayPreferences = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      displayPreferences: Partial<UserPreferences['display_preferences']>
    ) => {
      // Get current preferences first, then update
      return queryClient
        .fetchQuery({
          queryKey: QUERY_KEYS.USER_MANAGEMENT.PREFERENCES,
          queryFn: () => notificationsApi.getNotificationPreferences(),
        })
        .then(currentPreferences => {
          const updatedPreferences = {
            ...currentPreferences,
            display_preferences: {
              ...currentPreferences.display_preferences,
              ...displayPreferences,
            },
          };
          return notificationsApi.updateNotificationPreferences(
            updatedPreferences
          );
        });
    },
    onSuccess: () => {
      // Invalidate preferences to refetch updated data
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.USER_MANAGEMENT.PREFERENCES,
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
    mutationFn: (
      privacyPreferences: Partial<UserPreferences['privacy_preferences']>
    ) => {
      // Get current preferences first, then update
      return queryClient
        .fetchQuery({
          queryKey: QUERY_KEYS.USER_MANAGEMENT.PREFERENCES,
          queryFn: () => notificationsApi.getNotificationPreferences(),
        })
        .then(currentPreferences => {
          const updatedPreferences = {
            ...currentPreferences,
            privacy_preferences: {
              ...currentPreferences.privacy_preferences,
              ...privacyPreferences,
            },
          };
          return notificationsApi.updateNotificationPreferences(
            updatedPreferences
          );
        });
    },
    onSuccess: () => {
      // Invalidate preferences to refetch updated data
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.USER_MANAGEMENT.PREFERENCES,
      });
    },
  });
};
