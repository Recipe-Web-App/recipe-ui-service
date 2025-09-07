import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useNotifications,
  useAllNotifications,
  useUnreadNotifications,
  useReadNotifications,
  useNotificationsByType,
  useUnreadNotificationCount,
  useHasNewNotifications,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
  useDeleteNotification,
  useDeleteNotifications,
  useClearReadNotifications,
} from '@/hooks/user-management/useNotifications';
import { notificationsApi } from '@/lib/api/user-management';
import type {
  NotificationListResponse,
  NotificationCountResponse,
  NotificationReadResponse,
  NotificationReadAllResponse,
  NotificationDeleteResponse,
} from '@/types/user-management';

// Mock the API
jest.mock('@/lib/api/user-management', () => ({
  notificationsApi: {
    getNotifications: jest.fn(),
    getAllNotifications: jest.fn(),
    getUnreadNotifications: jest.fn(),
    getReadNotifications: jest.fn(),
    getNotificationsByType: jest.fn(),
    getUnreadNotificationCount: jest.fn(),
    hasNewNotifications: jest.fn(),
    markNotificationAsRead: jest.fn(),
    markAllNotificationsAsRead: jest.fn(),
    deleteNotification: jest.fn(),
    deleteNotifications: jest.fn(),
    clearReadNotifications: jest.fn(),
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

describe('useNotifications hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useNotifications', () => {
    it('should fetch notifications with filters', async () => {
      const mockNotificationsResponse: NotificationListResponse = {
        notifications: [
          {
            notificationId: 'notification-1',
            userId: 'user-123',
            title: 'New Follower',
            message: 'Someone started following you',
            notificationType: 'follow',
            isRead: false,
            isDeleted: false,
            createdAt: '2023-01-08T00:00:00Z',
            updatedAt: '2023-01-08T00:00:00Z',
          },
        ],
        totalCount: 1,
        limit: 10,
        offset: 0,
      };

      mockedNotificationsApi.getNotifications.mockResolvedValue(
        mockNotificationsResponse
      );

      const filters = { is_read: false, limit: 10, offset: 0 };
      const { result } = renderHook(() => useNotifications(filters), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedNotificationsApi.getNotifications).toHaveBeenCalledWith(
        filters
      );
      expect(result.current.data).toEqual(mockNotificationsResponse);
    });

    it('should fetch notifications without filters', async () => {
      const mockResponse: NotificationListResponse = {
        notifications: [],
        totalCount: 0,
        limit: 0,
        offset: 0,
      };

      mockedNotificationsApi.getNotifications.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useNotifications(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedNotificationsApi.getNotifications).toHaveBeenCalledWith(
        undefined
      );
      expect(result.current.data).toEqual(mockResponse);
    });
  });

  describe('useAllNotifications', () => {
    it('should fetch all notifications', async () => {
      const mockAllNotifications: NotificationListResponse = {
        notifications: [
          {
            notificationId: 'notification-1',
            userId: 'user-123',
            title: 'New Follower',
            message: 'Someone started following you',
            notificationType: 'follow',
            isRead: false,
            isDeleted: false,
            createdAt: '2023-01-08T00:00:00Z',
            updatedAt: '2023-01-08T00:00:00Z',
          },
        ],
        totalCount: 1,
        limit: 10,
        offset: 0,
      };

      mockedNotificationsApi.getAllNotifications.mockResolvedValue(
        mockAllNotifications
      );

      const { result } = renderHook(() => useAllNotifications(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedNotificationsApi.getAllNotifications).toHaveBeenCalled();
      expect(result.current.data).toEqual(mockAllNotifications);
    });
  });

  describe('useUnreadNotifications', () => {
    it('should fetch unread notifications', async () => {
      const mockUnreadNotifications: NotificationListResponse = {
        notifications: [
          {
            notificationId: 'notification-1',
            userId: 'user-123',
            title: 'New Follower',
            message: 'Someone started following you',
            notificationType: 'follow',
            isRead: false,
            isDeleted: false,
            createdAt: '2023-01-08T00:00:00Z',
            updatedAt: '2023-01-08T00:00:00Z',
          },
        ],
        totalCount: 1,
        limit: 10,
        offset: 0,
      };

      mockedNotificationsApi.getUnreadNotifications.mockResolvedValue(
        mockUnreadNotifications
      );

      const params = { limit: 10 };
      const { result } = renderHook(() => useUnreadNotifications(params), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(
        mockedNotificationsApi.getUnreadNotifications
      ).toHaveBeenCalledWith(params);
      expect(result.current.data).toEqual(mockUnreadNotifications);
    });
  });

  describe('useReadNotifications', () => {
    it('should fetch read notifications', async () => {
      const mockReadNotifications: NotificationListResponse = {
        notifications: [
          {
            notificationId: 'notification-1',
            userId: 'user-123',
            title: 'New Follower',
            message: 'Someone started following you',
            notificationType: 'follow',
            isRead: true,
            isDeleted: false,
            createdAt: '2023-01-08T00:00:00Z',
            updatedAt: '2023-01-08T00:00:00Z',
          },
        ],
        totalCount: 1,
        limit: 10,
        offset: 0,
      };

      mockedNotificationsApi.getReadNotifications.mockResolvedValue(
        mockReadNotifications
      );

      const params = { limit: 10 };
      const { result } = renderHook(() => useReadNotifications(params), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedNotificationsApi.getReadNotifications).toHaveBeenCalledWith(
        params
      );
      expect(result.current.data).toEqual(mockReadNotifications);
    });
  });

  describe('useNotificationsByType', () => {
    it('should fetch notifications by type', async () => {
      const mockNotificationsByType: NotificationListResponse = {
        notifications: [
          {
            notificationId: 'notification-1',
            userId: 'user-123',
            title: 'New Follower',
            message: 'Someone started following you',
            notificationType: 'follow',
            isRead: false,
            isDeleted: false,
            createdAt: '2023-01-08T00:00:00Z',
            updatedAt: '2023-01-08T00:00:00Z',
          },
        ],
        totalCount: 1,
        limit: 10,
        offset: 0,
      };

      mockedNotificationsApi.getNotificationsByType.mockResolvedValue(
        mockNotificationsByType
      );

      const notificationType = 'follow';
      const params = { limit: 10 };
      const { result } = renderHook(
        () => useNotificationsByType(notificationType, params),
        {
          wrapper: createWrapper(),
        }
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(
        mockedNotificationsApi.getNotificationsByType
      ).toHaveBeenCalledWith(notificationType, params);
      expect(result.current.data).toEqual(mockNotificationsByType);
    });

    it('should not fetch when notificationType is empty', () => {
      const { result } = renderHook(() => useNotificationsByType(''), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe('idle');
      expect(
        mockedNotificationsApi.getNotificationsByType
      ).not.toHaveBeenCalled();
    });
  });

  describe('useUnreadNotificationCount', () => {
    it('should fetch unread notification count', async () => {
      const mockCountResponse: NotificationCountResponse = {
        totalCount: 5,
      };

      mockedNotificationsApi.getUnreadNotificationCount.mockResolvedValue(
        mockCountResponse
      );

      const { result } = renderHook(() => useUnreadNotificationCount(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(
        mockedNotificationsApi.getUnreadNotificationCount
      ).toHaveBeenCalled();
      expect(result.current.data).toEqual(mockCountResponse);
    });
  });

  describe('useHasNewNotifications', () => {
    it('should check for new notifications', async () => {
      const mockHasNewResponse = { hasNew: true, count: 3 };

      mockedNotificationsApi.hasNewNotifications.mockResolvedValue(
        mockHasNewResponse
      );

      const lastCheckTime = '2023-01-07T00:00:00Z';
      const { result } = renderHook(
        () => useHasNewNotifications(lastCheckTime),
        {
          wrapper: createWrapper(),
        }
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedNotificationsApi.hasNewNotifications).toHaveBeenCalledWith(
        lastCheckTime
      );
      expect(result.current.data).toEqual(mockHasNewResponse);
    });
  });

  describe('useMarkNotificationAsRead', () => {
    it('should mark notification as read with optimistic update', async () => {
      const mockReadResponse: NotificationReadResponse = {
        message: 'Notification marked as read',
      };

      mockedNotificationsApi.markNotificationAsRead.mockResolvedValue(
        mockReadResponse
      );

      // Set up query client with existing count data
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false, gcTime: Infinity },
          mutations: { retry: false },
        },
      });
      queryClient.setQueryData(['userManagement', 'unreadCount'], {
        totalCount: 5,
      });

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );

      const { result } = renderHook(() => useMarkNotificationAsRead(), {
        wrapper,
      });

      result.current.mutate('notification-1');

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(
        mockedNotificationsApi.markNotificationAsRead
      ).toHaveBeenCalledWith('notification-1');
      expect(result.current.data).toEqual(mockReadResponse);

      // Check that optimistic update occurred
      const updatedCount = queryClient.getQueryData([
        'userManagement',
        'unreadCount',
      ]);
      expect(updatedCount).toEqual({ totalCount: 4 });
    });

    it('should handle mark as read error and rollback', async () => {
      const error = new Error('Failed to mark as read');
      mockedNotificationsApi.markNotificationAsRead.mockRejectedValue(error);

      // Set up query client with existing count data
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false, gcTime: Infinity },
          mutations: { retry: false },
        },
      });
      queryClient.setQueryData(['userManagement', 'unreadCount'], {
        totalCount: 5,
      });

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );

      const { result } = renderHook(() => useMarkNotificationAsRead(), {
        wrapper,
      });

      result.current.mutate('notification-1');

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toBe(error);

      // Check that count was rolled back
      const rollbackCount = queryClient.getQueryData([
        'userManagement',
        'unreadCount',
      ]);
      expect(rollbackCount).toEqual({ totalCount: 5 });
    });
  });

  describe('useMarkAllNotificationsAsRead', () => {
    it('should mark all notifications as read with optimistic update', async () => {
      const mockReadAllResponse: NotificationReadAllResponse = {
        message: 'All notifications marked as read',
        readNotificationIds: [
          'notification-1',
          'notification-2',
          'notification-3',
        ],
      };

      mockedNotificationsApi.markAllNotificationsAsRead.mockResolvedValue(
        mockReadAllResponse
      );

      // Set up query client with existing count data
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false, gcTime: Infinity },
          mutations: { retry: false },
        },
      });
      queryClient.setQueryData(['userManagement', 'unreadCount'], {
        totalCount: 3,
      });

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );

      const { result } = renderHook(() => useMarkAllNotificationsAsRead(), {
        wrapper,
      });

      result.current.mutate();

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(
        mockedNotificationsApi.markAllNotificationsAsRead
      ).toHaveBeenCalled();
      expect(result.current.data).toEqual(mockReadAllResponse);

      // Check that optimistic update set count to 0
      const updatedCount = queryClient.getQueryData([
        'userManagement',
        'unreadCount',
      ]);
      expect(updatedCount).toEqual({ totalCount: 0 });
    });
  });

  describe('useDeleteNotification', () => {
    it('should delete single notification', async () => {
      const mockDeleteResponse: NotificationDeleteResponse = {
        message: 'Notification deleted successfully',
        deleted_notification_ids: ['notification-1'],
      };

      mockedNotificationsApi.deleteNotification.mockResolvedValue(
        mockDeleteResponse
      );

      const { result } = renderHook(() => useDeleteNotification(), {
        wrapper: createWrapper(),
      });

      result.current.mutate('notification-1');

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedNotificationsApi.deleteNotification).toHaveBeenCalledWith(
        'notification-1'
      );
      expect(result.current.data).toEqual(mockDeleteResponse);
    });
  });

  describe('useDeleteNotifications', () => {
    it('should delete multiple notifications', async () => {
      const mockDeleteMultipleResponse: NotificationDeleteResponse = {
        message: '3 notifications deleted successfully',
        deleted_notification_ids: [
          'notification-1',
          'notification-2',
          'notification-3',
        ],
      };

      mockedNotificationsApi.deleteNotifications.mockResolvedValue(
        mockDeleteMultipleResponse
      );

      const notificationIds = [
        'notification-1',
        'notification-2',
        'notification-3',
      ];
      const { result } = renderHook(() => useDeleteNotifications(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(notificationIds);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedNotificationsApi.deleteNotifications).toHaveBeenCalledWith(
        notificationIds
      );
      expect(result.current.data).toEqual(mockDeleteMultipleResponse);
    });
  });

  describe('useClearReadNotifications', () => {
    it('should clear all read notifications', async () => {
      const mockClearResponse: NotificationDeleteResponse = {
        message: 'All read notifications cleared',
        deleted_notification_ids: [
          'notification-1',
          'notification-2',
          'notification-3',
        ],
      };

      mockedNotificationsApi.clearReadNotifications.mockResolvedValue(
        mockClearResponse
      );

      const { result } = renderHook(() => useClearReadNotifications(), {
        wrapper: createWrapper(),
      });

      result.current.mutate();

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedNotificationsApi.clearReadNotifications).toHaveBeenCalled();
      expect(result.current.data).toEqual(mockClearResponse);
    });
  });
});
