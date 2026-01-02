import { notificationsApi } from '@/lib/api/user-management/notifications';
import { userManagementClient } from '@/lib/api/user-management/client';
import type {
  NotificationListResponse,
  NotificationCountResponse,
  NotificationReadResponse,
  NotificationReadAllResponse,
  NotificationDeleteResponse,
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

describe('Notifications API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getNotifications', () => {
    it('should get notifications list successfully', async () => {
      const mockResponse: NotificationListResponse = {
        notifications: [
          {
            notificationId: 'notif1',
            userId: 'user123',
            notificationType: 'follow',
            title: 'New Follower',
            message: 'User John started following you',
            isRead: false,
            isDeleted: false,
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2023-01-01T00:00:00Z',
          },
        ],
        totalCount: 1,
        limit: 20,
        offset: 0,
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await notificationsApi.getNotifications();

      expect(mockClient.get).toHaveBeenCalledWith('/notifications');
      expect(result).toEqual(mockResponse);
    });

    it('should get notifications with filter parameters', async () => {
      const mockResponse: NotificationListResponse = {
        notifications: [],
        totalCount: 0,
        limit: 10,
        offset: 5,
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await notificationsApi.getNotifications({
        is_read: false,
        notification_type: 'follow',
        limit: 10,
        offset: 5,
      });

      expect(mockClient.get).toHaveBeenCalledWith(
        '/notifications?is_read=false&notification_type=follow&limit=10&offset=5'
      );
      expect(result).toEqual(mockResponse);
    });

    it('should get notifications count only', async () => {
      const mockResponse: NotificationListResponse = {
        notifications: [],
        totalCount: 25,
        limit: 0,
        offset: 0,
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await notificationsApi.getNotifications({
        count_only: true,
      });

      expect(mockClient.get).toHaveBeenCalledWith(
        '/notifications?count_only=true'
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle get notifications error', async () => {
      mockClient.get.mockRejectedValue(new Error('Access denied'));

      await expect(notificationsApi.getNotifications()).rejects.toThrow();
    });
  });

  describe('getUnreadNotificationCount', () => {
    it('should get unread notification count successfully', async () => {
      const mockResponse: NotificationCountResponse = {
        totalCount: 5,
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await notificationsApi.getUnreadNotificationCount();

      expect(mockClient.get).toHaveBeenCalledWith(
        '/notifications?is_read=false&count_only=true'
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle count error', async () => {
      mockClient.get.mockRejectedValue(new Error('Service unavailable'));

      await expect(
        notificationsApi.getUnreadNotificationCount()
      ).rejects.toThrow();
    });
  });

  describe('markNotificationAsRead', () => {
    it('should mark notification as read successfully', async () => {
      const mockResponse: NotificationReadResponse = {
        message: 'Notification marked as read',
      };

      mockClient.put.mockResolvedValue({ data: mockResponse });

      const result = await notificationsApi.markNotificationAsRead('notif1');

      expect(mockClient.put).toHaveBeenCalledWith('/notifications/notif1/read');
      expect(result).toEqual(mockResponse);
    });

    it('should handle mark as read error', async () => {
      mockClient.put.mockRejectedValue(new Error('Notification not found'));

      await expect(
        notificationsApi.markNotificationAsRead('notif1')
      ).rejects.toThrow();
    });
  });

  describe('markAllNotificationsAsRead', () => {
    it('should mark all notifications as read successfully', async () => {
      const mockResponse: NotificationReadAllResponse = {
        message: 'All notifications marked as read',
        readNotificationIds: [],
      };

      mockClient.put.mockResolvedValue({ data: mockResponse });

      const result = await notificationsApi.markAllNotificationsAsRead();

      expect(mockClient.put).toHaveBeenCalledWith('/notifications/read-all');
      expect(result).toEqual(mockResponse);
    });

    it('should handle mark all as read error', async () => {
      mockClient.put.mockRejectedValue(new Error('Service error'));

      await expect(
        notificationsApi.markAllNotificationsAsRead()
      ).rejects.toThrow();
    });
  });

  describe('deleteNotifications', () => {
    it('should delete notifications successfully', async () => {
      const mockResponse: NotificationDeleteResponse = {
        message: 'Notifications deleted successfully',
      };

      mockClient.delete.mockResolvedValue({ data: mockResponse });

      const result = await notificationsApi.deleteNotifications([
        'notif1',
        'notif2',
      ]);

      expect(mockClient.delete).toHaveBeenCalledWith('/notifications', {
        data: { notificationIds: ['notif1', 'notif2'] },
      });
      expect(result).toEqual(mockResponse);
    });

    it('should handle delete notifications error', async () => {
      mockClient.delete.mockRejectedValue(new Error('Delete failed'));

      await expect(
        notificationsApi.deleteNotifications(['notif1'])
      ).rejects.toThrow();
    });
  });

  describe('deleteNotification', () => {
    it('should delete single notification', async () => {
      const mockResponse: NotificationDeleteResponse = {
        message: 'Notification deleted successfully',
      };

      mockClient.delete.mockResolvedValue({ data: mockResponse });

      const result = await notificationsApi.deleteNotification('notif1');

      expect(mockClient.delete).toHaveBeenCalledWith('/notifications', {
        data: { notificationIds: ['notif1'] },
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getAllNotifications', () => {
    it('should get all notifications', async () => {
      const mockResponse: NotificationListResponse = {
        notifications: [
          {
            notificationId: 'notif2',
            userId: 'user123',
            notificationType: 'like',
            title: 'Recipe Liked',
            message: 'Someone liked your recipe',
            isRead: false,
            isDeleted: false,
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2023-01-01T00:00:00Z',
          },
        ],
        totalCount: 1,
        limit: 20,
        offset: 0,
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await notificationsApi.getAllNotifications();

      expect(mockClient.get).toHaveBeenCalledWith('/notifications');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getUnreadNotifications', () => {
    it('should get unread notifications', async () => {
      const mockResponse: NotificationListResponse = {
        notifications: [
          {
            notificationId: 'notif2',
            userId: 'user123',
            notificationType: 'comment',
            title: 'New Comment',
            message: 'Someone commented on your recipe',
            isRead: false,
            isDeleted: false,
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2023-01-01T00:00:00Z',
          },
        ],
        totalCount: 1,
        limit: 20,
        offset: 0,
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await notificationsApi.getUnreadNotifications({
        limit: 10,
      });

      expect(mockClient.get).toHaveBeenCalledWith(
        '/notifications?limit=10&is_read=false'
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getReadNotifications', () => {
    it('should get read notifications', async () => {
      const mockResponse: NotificationListResponse = {
        notifications: [
          {
            notificationId: 'notif3',
            userId: 'user123',
            notificationType: 'system',
            title: 'System Update',
            message: 'New features available',
            isRead: true,
            isDeleted: false,
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2023-01-01T00:00:00Z',
          },
        ],
        totalCount: 1,
        limit: 20,
        offset: 0,
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await notificationsApi.getReadNotifications({ offset: 5 });

      expect(mockClient.get).toHaveBeenCalledWith(
        '/notifications?offset=5&is_read=true'
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getNotificationsByType', () => {
    it('should get notifications by type', async () => {
      const mockResponse: NotificationListResponse = {
        notifications: [
          {
            notificationId: 'notif4',
            userId: 'user123',
            notificationType: 'follow',
            title: 'New Follower',
            message: 'User Jane started following you',
            isRead: false,
            isDeleted: false,
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2023-01-01T00:00:00Z',
          },
        ],
        totalCount: 1,
        limit: 20,
        offset: 0,
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await notificationsApi.getNotificationsByType('follow');

      expect(mockClient.get).toHaveBeenCalledWith(
        '/notifications?notification_type=follow'
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('clearReadNotifications', () => {
    it('should clear read notifications successfully', async () => {
      const readNotificationsResponse: NotificationListResponse = {
        notifications: [
          {
            notificationId: 'read1',
            userId: 'user123',
            notificationType: 'like',
            title: 'Recipe Liked',
            message: 'Someone liked your recipe',
            isRead: true,
            isDeleted: false,
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2023-01-01T00:00:00Z',
          },
          {
            notificationId: 'read2',
            userId: 'user123',
            notificationType: 'comment',
            title: 'New Comment',
            message: 'Someone commented on your recipe',
            isRead: true,
            isDeleted: false,
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2023-01-01T00:00:00Z',
          },
        ],
        totalCount: 2,
        limit: 1000,
        offset: 0,
      };

      const deleteResponse: NotificationDeleteResponse = {
        message: 'Read notifications cleared',
      };

      mockClient.get.mockResolvedValue({ data: readNotificationsResponse });
      mockClient.delete.mockResolvedValue({ data: deleteResponse });

      const result = await notificationsApi.clearReadNotifications();

      expect(mockClient.get).toHaveBeenCalledWith(
        '/notifications?limit=1000&is_read=true'
      );
      expect(mockClient.delete).toHaveBeenCalledWith('/notifications', {
        data: { notificationIds: ['read1', 'read2'] },
      });
      expect(result).toEqual(deleteResponse);
    });

    it('should return message when no read notifications to clear', async () => {
      const emptyResponse: NotificationListResponse = {
        notifications: [],
        totalCount: 0,
        limit: 1000,
        offset: 0,
      };

      mockClient.get.mockResolvedValue({ data: emptyResponse });

      const result = await notificationsApi.clearReadNotifications();

      expect(result).toEqual({ message: 'No read notifications to clear' });
      expect(mockClient.delete).not.toHaveBeenCalled();
    });

    it('should handle clear read notifications error', async () => {
      mockClient.get.mockRejectedValue(
        new Error('Failed to fetch read notifications')
      );

      await expect(notificationsApi.clearReadNotifications()).rejects.toThrow();
    });
  });

  describe('hasNewNotifications', () => {
    it('should return true when there are unread notifications without lastCheckTime', async () => {
      const countResponse: NotificationCountResponse = {
        totalCount: 3,
      };

      mockClient.get.mockResolvedValue({ data: countResponse });

      const result = await notificationsApi.hasNewNotifications();

      expect(mockClient.get).toHaveBeenCalledWith(
        '/notifications?is_read=false&count_only=true'
      );
      expect(result).toEqual({
        hasNew: true,
        count: 3,
      });
    });

    it('should return false when there are no unread notifications', async () => {
      const countResponse: NotificationCountResponse = {
        totalCount: 0,
      };

      mockClient.get.mockResolvedValue({ data: countResponse });

      const result = await notificationsApi.hasNewNotifications();

      expect(result).toEqual({
        hasNew: false,
        count: 0,
      });
    });

    it('should check for notifications newer than lastCheckTime', async () => {
      const countResponse: NotificationCountResponse = {
        totalCount: 2,
      };

      const recentNotifications: NotificationListResponse = {
        notifications: [
          {
            notificationId: 'new1',
            userId: 'user123',
            notificationType: 'follow',
            title: 'New Follower',
            message: 'User Bob started following you',
            isRead: false,
            isDeleted: false,
            createdAt: '2023-01-02T00:00:00Z',
            updatedAt: '2023-01-02T00:00:00Z',
          },
          {
            notificationId: 'old1',
            userId: 'user123',
            notificationType: 'like',
            title: 'Recipe Liked',
            message: 'Someone liked your recipe',
            isRead: false,
            isDeleted: false,
            createdAt: '2022-12-31T00:00:00Z',
            updatedAt: '2022-12-31T00:00:00Z',
          },
        ],
        totalCount: 2,
        limit: 10,
        offset: 0,
      };

      mockClient.get
        .mockResolvedValueOnce({ data: countResponse })
        .mockResolvedValueOnce({ data: recentNotifications });

      const result = await notificationsApi.hasNewNotifications(
        '2023-01-01T00:00:00Z'
      );

      expect(mockClient.get).toHaveBeenCalledWith(
        '/notifications?is_read=false&count_only=true'
      );
      expect(mockClient.get).toHaveBeenCalledWith(
        '/notifications?limit=10&is_read=false'
      );
      expect(result).toEqual({
        hasNew: true,
        count: 1,
      });
    });

    it('should return false with count 0 on error', async () => {
      mockClient.get.mockRejectedValue(new Error('Network error'));

      const result = await notificationsApi.hasNewNotifications();

      expect(result).toEqual({
        hasNew: false,
        count: 0,
      });
    });
  });
});
