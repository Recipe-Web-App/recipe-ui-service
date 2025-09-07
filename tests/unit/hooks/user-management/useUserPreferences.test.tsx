import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useUserPreferences,
  useNotificationPreferences,
  useDisplayPreferences,
  usePrivacyPreferences,
  useUpdateUserPreferences,
  useUpdateNotificationPreferences,
  useToggleNotificationSetting,
  useUpdateDisplayPreferences,
  useUpdatePrivacyPreferences,
} from '@/hooks/user-management/useUserPreferences';
import { notificationsApi } from '@/lib/api/user-management';
import type {
  UserPreferences,
  NotificationPreferences,
} from '@/types/user-management';

// Mock the API
jest.mock('@/lib/api/user-management', () => ({
  notificationsApi: {
    getNotificationPreferences: jest.fn(),
    updateNotificationPreferences: jest.fn(),
    updateNotificationTypeSettings: jest.fn(),
  },
}));

const mockedNotificationsApi = notificationsApi as jest.Mocked<
  typeof notificationsApi
>;

// Create wrapper component
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: Infinity },
      mutations: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const mockUserPreferences: UserPreferences = {
  notification_preferences: {
    email_notifications: true,
    push_notifications: true,
    follow_notifications: false,
    like_notifications: true,
    comment_notifications: true,
    recipe_notifications: true,
    system_notifications: false,
  },
  privacy_preferences: {
    profile_visibility: 'public',
    show_email: false,
    show_full_name: true,
    allow_follows: true,
    allow_messages: true,
  },
  display_preferences: {
    theme: 'light',
    language: 'en',
    timezone: 'UTC',
  },
};

describe('useUserPreferences hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useUserPreferences', () => {
    it('should fetch user preferences', async () => {
      mockedNotificationsApi.getNotificationPreferences.mockResolvedValue(
        mockUserPreferences
      );

      const { result } = renderHook(() => useUserPreferences(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(
        mockedNotificationsApi.getNotificationPreferences
      ).toHaveBeenCalled();
      expect(result.current.data).toEqual(mockUserPreferences);
    });

    it('should handle fetch error', async () => {
      const error = new Error('Failed to fetch preferences');
      mockedNotificationsApi.getNotificationPreferences.mockRejectedValue(
        error
      );

      const { result } = renderHook(() => useUserPreferences(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(result.current.error).toBe(error);
    });
  });

  describe('useNotificationPreferences', () => {
    it('should fetch notification preferences only', async () => {
      mockedNotificationsApi.getNotificationPreferences.mockResolvedValue(
        mockUserPreferences
      );

      const { result } = renderHook(() => useNotificationPreferences(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(
        mockedNotificationsApi.getNotificationPreferences
      ).toHaveBeenCalled();
      expect(result.current.data).toEqual(
        mockUserPreferences.notification_preferences
      );
    });
  });

  describe('useDisplayPreferences', () => {
    it('should fetch display preferences only', async () => {
      mockedNotificationsApi.getNotificationPreferences.mockResolvedValue(
        mockUserPreferences
      );

      const { result } = renderHook(() => useDisplayPreferences(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(
        mockedNotificationsApi.getNotificationPreferences
      ).toHaveBeenCalled();
      expect(result.current.data).toEqual(
        mockUserPreferences.display_preferences
      );
    });
  });

  describe('usePrivacyPreferences', () => {
    it('should fetch privacy preferences only', async () => {
      mockedNotificationsApi.getNotificationPreferences.mockResolvedValue(
        mockUserPreferences
      );

      const { result } = renderHook(() => usePrivacyPreferences(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(
        mockedNotificationsApi.getNotificationPreferences
      ).toHaveBeenCalled();
      expect(result.current.data).toEqual(
        mockUserPreferences.privacy_preferences
      );
    });
  });

  describe('useUpdateUserPreferences', () => {
    it('should update user preferences with optimistic update', async () => {
      const updatedPreferences: UserPreferences = {
        ...mockUserPreferences,
        notification_preferences: {
          ...mockUserPreferences.notification_preferences,
          email_notifications: false,
        },
      };

      mockedNotificationsApi.updateNotificationPreferences.mockResolvedValue(
        updatedPreferences
      );

      // Set up query client with existing data
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false, gcTime: Infinity },
          mutations: { retry: false },
        },
      });
      queryClient.setQueryData(
        ['userManagement', 'preferences'],
        mockUserPreferences
      );

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );

      const { result } = renderHook(() => useUpdateUserPreferences(), {
        wrapper,
      });

      result.current.mutate(updatedPreferences);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(
        mockedNotificationsApi.updateNotificationPreferences
      ).toHaveBeenCalledWith(updatedPreferences);
      expect(result.current.data).toEqual(updatedPreferences);
    });

    it('should handle update error and rollback optimistic update', async () => {
      const error = new Error('Failed to update preferences');
      mockedNotificationsApi.updateNotificationPreferences.mockRejectedValue(
        error
      );

      // Set up query client with existing data
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false, gcTime: Infinity },
          mutations: { retry: false },
        },
      });
      queryClient.setQueryData(
        ['userManagement', 'preferences'],
        mockUserPreferences
      );

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );

      const { result } = renderHook(() => useUpdateUserPreferences(), {
        wrapper,
      });

      const updatedPreferences = {
        ...mockUserPreferences,
        notification_preferences: {
          ...mockUserPreferences.notification_preferences,
          email_notifications: false,
        },
      };

      result.current.mutate(updatedPreferences);

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toBe(error);

      // Check that data was rolled back
      const rollbackData = queryClient.getQueryData([
        'userManagement',
        'preferences',
      ]);
      expect(rollbackData).toEqual(mockUserPreferences);
    });
  });

  describe('useUpdateNotificationPreferences', () => {
    it('should update notification preferences', async () => {
      const updatedPreferences: UserPreferences = {
        ...mockUserPreferences,
        notification_preferences: {
          ...mockUserPreferences.notification_preferences,
          push_notifications: false,
        },
      };

      mockedNotificationsApi.updateNotificationTypeSettings.mockResolvedValue(
        updatedPreferences
      );

      // Set up query client with existing data
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false, gcTime: Infinity },
          mutations: { retry: false },
        },
      });
      queryClient.setQueryData(
        ['userManagement', 'preferences'],
        mockUserPreferences
      );

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );

      const { result } = renderHook(() => useUpdateNotificationPreferences(), {
        wrapper,
      });

      const notificationUpdates: Partial<NotificationPreferences> = {
        push_notifications: false,
      };

      result.current.mutate(notificationUpdates);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(
        mockedNotificationsApi.updateNotificationTypeSettings
      ).toHaveBeenCalledWith(notificationUpdates);
      expect(result.current.data).toEqual(updatedPreferences);
    });
  });

  describe('useToggleNotificationSetting', () => {
    it('should toggle a single notification setting', async () => {
      const updatedPreferences: UserPreferences = {
        ...mockUserPreferences,
        notification_preferences: {
          ...mockUserPreferences.notification_preferences,
          email_notifications: false,
        },
      };

      mockedNotificationsApi.updateNotificationTypeSettings.mockResolvedValue(
        updatedPreferences
      );

      // Set up query client with existing data
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false, gcTime: Infinity },
          mutations: { retry: false },
        },
      });
      queryClient.setQueryData(
        ['userManagement', 'preferences'],
        mockUserPreferences
      );

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );

      const { result } = renderHook(() => useToggleNotificationSetting(), {
        wrapper,
      });

      result.current.mutate({
        settingKey: 'email_notifications',
        value: false,
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(
        mockedNotificationsApi.updateNotificationTypeSettings
      ).toHaveBeenCalledWith({
        email_notifications: false,
      });
      expect(result.current.data).toEqual(updatedPreferences);
    });

    it('should optimistically update the setting before API call', async () => {
      const updatedPreferences: UserPreferences = {
        ...mockUserPreferences,
        notification_preferences: {
          ...mockUserPreferences.notification_preferences,
          follow_notifications: true,
        },
      };

      // Delay the API response to allow testing optimistic updates
      mockedNotificationsApi.updateNotificationTypeSettings.mockImplementation(
        () =>
          new Promise(resolve =>
            setTimeout(() => resolve(updatedPreferences), 100)
          )
      );

      // Set up query client with existing data
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false, gcTime: Infinity },
          mutations: { retry: false },
        },
      });
      queryClient.setQueryData(
        ['userManagement', 'preferences'],
        mockUserPreferences
      );

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );

      const { result } = renderHook(() => useToggleNotificationSetting(), {
        wrapper,
      });

      result.current.mutate({
        settingKey: 'follow_notifications',
        value: true,
      });

      // Wait a bit for the optimistic update to occur
      await new Promise(resolve => setTimeout(resolve, 10));

      // Check optimistic update happened
      const optimisticData = queryClient.getQueryData([
        'userManagement',
        'preferences',
      ]) as UserPreferences;
      expect(
        optimisticData?.notification_preferences?.follow_notifications
      ).toBe(true);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(
        mockedNotificationsApi.updateNotificationTypeSettings
      ).toHaveBeenCalledWith({
        follow_notifications: true,
      });
    });
  });

  describe('useUpdateDisplayPreferences', () => {
    it('should update display preferences', async () => {
      const updatedPreferences: UserPreferences = {
        ...mockUserPreferences,
        display_preferences: {
          ...mockUserPreferences.display_preferences,
          theme: 'dark',
          language: 'es',
        },
      };

      // Mock fetchQuery to return current preferences first
      mockedNotificationsApi.getNotificationPreferences.mockResolvedValue(
        mockUserPreferences
      );
      mockedNotificationsApi.updateNotificationPreferences.mockResolvedValue(
        updatedPreferences
      );

      // Set up query client with existing data
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false, gcTime: Infinity },
          mutations: { retry: false },
        },
      });
      queryClient.setQueryData(
        ['userManagement', 'preferences'],
        mockUserPreferences
      );

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );

      const { result } = renderHook(() => useUpdateDisplayPreferences(), {
        wrapper,
      });

      const displayUpdates = {
        theme: 'dark' as const,
        language: 'es',
      };

      result.current.mutate(displayUpdates);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(
        mockedNotificationsApi.getNotificationPreferences
      ).toHaveBeenCalled();
      expect(
        mockedNotificationsApi.updateNotificationPreferences
      ).toHaveBeenCalledWith({
        ...mockUserPreferences,
        display_preferences: {
          ...mockUserPreferences.display_preferences,
          ...displayUpdates,
        },
      });
    });
  });

  describe('useUpdatePrivacyPreferences', () => {
    it('should update privacy preferences', async () => {
      const updatedPreferences: UserPreferences = {
        ...mockUserPreferences,
        privacy_preferences: {
          ...mockUserPreferences.privacy_preferences,
          profile_visibility: 'private',
          allow_follows: false,
        },
      };

      // Mock fetchQuery to return current preferences first
      mockedNotificationsApi.getNotificationPreferences.mockResolvedValue(
        mockUserPreferences
      );
      mockedNotificationsApi.updateNotificationPreferences.mockResolvedValue(
        updatedPreferences
      );

      // Set up query client with existing data
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false, gcTime: Infinity },
          mutations: { retry: false },
        },
      });
      queryClient.setQueryData(
        ['userManagement', 'preferences'],
        mockUserPreferences
      );

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );

      const { result } = renderHook(() => useUpdatePrivacyPreferences(), {
        wrapper,
      });

      const privacyUpdates = {
        profile_visibility: 'private' as const,
        allow_follows: false,
      };

      result.current.mutate(privacyUpdates);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(
        mockedNotificationsApi.getNotificationPreferences
      ).toHaveBeenCalled();
      expect(
        mockedNotificationsApi.updateNotificationPreferences
      ).toHaveBeenCalledWith({
        ...mockUserPreferences,
        privacy_preferences: {
          ...mockUserPreferences.privacy_preferences,
          ...privacyUpdates,
        },
      });
    });
  });
});
