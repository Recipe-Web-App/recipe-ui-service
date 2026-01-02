import { userNotificationsApi } from '@/lib/api/notification/user-notifications';
import { notificationClient } from '@/lib/api/notification/client';
import type {
  UserNotificationListResponse,
  UserNotificationCountResponse,
} from '@/types/notification';
import { NotificationCategory } from '@/types/notification';

// Mock the client module
jest.mock('@/lib/api/notification/client', () => ({
  notificationClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
  handleNotificationApiError: jest.fn(error => {
    throw error;
  }),
  buildQueryParams: jest.requireActual('@/lib/api/notification/client')
    .buildQueryParams,
}));

const mockClient = notificationClient as jest.Mocked<typeof notificationClient>;

describe('User Notifications API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getMyNotifications', () => {
    it('should get notifications without params', async () => {
      const mockResponse: UserNotificationListResponse = {
        notifications: [
          {
            notificationId: 'notif-1',
            userId: 'user-1',
            title: 'Test Notification',
            message: 'Test message',
            notificationCategory: NotificationCategory.NEW_FOLLOWER,
            isRead: false,
            isDeleted: false,
            createdAt: '2025-10-28T14:30:00Z',
            updatedAt: '2025-10-28T14:30:00Z',
            notificationData: {
              templateVersion: '1.0',
              followerId: 'user-2',
              followerName: 'John',
            },
          },
        ],
        totalCount: 1,
        offset: 0,
        limit: 20,
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await userNotificationsApi.getMyNotifications();

      expect(mockClient.get).toHaveBeenCalledWith('/users/me/notifications');
      expect(result).toEqual(mockResponse);
    });

    it('should get notifications with pagination params', async () => {
      const mockResponse: UserNotificationListResponse = {
        notifications: [],
        totalCount: 0,
        offset: 10,
        limit: 10,
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await userNotificationsApi.getMyNotifications({
        offset: 10,
        limit: 10,
      });

      expect(mockClient.get).toHaveBeenCalledWith(
        '/users/me/notifications?offset=10&limit=10'
      );
      expect(result).toEqual(mockResponse);
    });

    it('should return count only when countOnly is true', async () => {
      const mockResponse: UserNotificationCountResponse = {
        totalCount: 5,
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await userNotificationsApi.getMyNotifications({
        countOnly: true,
      });

      expect(mockClient.get).toHaveBeenCalledWith(
        '/users/me/notifications?countOnly=true'
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle errors', async () => {
      const error = new Error('Network error');
      mockClient.get.mockRejectedValue(error);

      await expect(userNotificationsApi.getMyNotifications()).rejects.toThrow(
        'Network error'
      );
    });
  });

  describe('getUnreadNotificationCount', () => {
    it('should get unread notification count', async () => {
      const mockResponse: UserNotificationCountResponse = {
        totalCount: 5,
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await userNotificationsApi.getUnreadNotificationCount();

      expect(mockClient.get).toHaveBeenCalledWith(
        '/users/me/notifications?countOnly=true'
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle errors', async () => {
      const error = new Error('Unauthorized');
      mockClient.get.mockRejectedValue(error);

      await expect(
        userNotificationsApi.getUnreadNotificationCount()
      ).rejects.toThrow('Unauthorized');
    });
  });

  describe('markNotificationAsRead', () => {
    it('should mark notification as read', async () => {
      const mockResponse = {
        message: 'Notification marked as read',
        notificationId: 'notif-1',
      };

      mockClient.put.mockResolvedValue({ data: mockResponse });

      const result =
        await userNotificationsApi.markNotificationAsRead('notif-1');

      expect(mockClient.put).toHaveBeenCalledWith(
        '/users/me/notifications/notif-1/read'
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle 404 error', async () => {
      const error = new Error('Notification not found');
      mockClient.put.mockRejectedValue(error);

      await expect(
        userNotificationsApi.markNotificationAsRead('invalid-id')
      ).rejects.toThrow('Notification not found');
    });
  });

  describe('markAllNotificationsAsRead', () => {
    it('should mark all notifications as read', async () => {
      const mockResponse = {
        message: 'All notifications marked as read',
        markedNotificationIds: ['notif-1', 'notif-2', 'notif-3'],
      };

      mockClient.put.mockResolvedValue({ data: mockResponse });

      const result = await userNotificationsApi.markAllNotificationsAsRead();

      expect(mockClient.put).toHaveBeenCalledWith(
        '/users/me/notifications/read-all'
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle errors', async () => {
      const error = new Error('Server error');
      mockClient.put.mockRejectedValue(error);

      await expect(
        userNotificationsApi.markAllNotificationsAsRead()
      ).rejects.toThrow('Server error');
    });
  });

  describe('deleteNotifications', () => {
    it('should delete multiple notifications', async () => {
      const mockResponse = {
        message: 'Notifications deleted',
        deletedNotificationIds: ['notif-1', 'notif-2'],
      };

      mockClient.delete.mockResolvedValue({ data: mockResponse });

      const result = await userNotificationsApi.deleteNotifications([
        'notif-1',
        'notif-2',
      ]);

      expect(mockClient.delete).toHaveBeenCalledWith(
        '/users/me/notifications',
        {
          data: { notificationIds: ['notif-1', 'notif-2'] },
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle errors', async () => {
      const error = new Error('Forbidden');
      mockClient.delete.mockRejectedValue(error);

      await expect(
        userNotificationsApi.deleteNotifications(['notif-1'])
      ).rejects.toThrow('Forbidden');
    });
  });

  describe('deleteNotification', () => {
    it('should delete a single notification', async () => {
      const mockResponse = {
        message: 'Notification deleted',
        deletedNotificationIds: ['notif-1'],
      };

      mockClient.delete.mockResolvedValue({ data: mockResponse });

      const result = await userNotificationsApi.deleteNotification('notif-1');

      expect(mockClient.delete).toHaveBeenCalledWith(
        '/users/me/notifications',
        {
          data: { notificationIds: ['notif-1'] },
        }
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getUserNotifications', () => {
    it('should get notifications for a specific user', async () => {
      const mockResponse: UserNotificationListResponse = {
        notifications: [],
        totalCount: 0,
        offset: 0,
        limit: 20,
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result =
        await userNotificationsApi.getUserNotifications('user-123');

      expect(mockClient.get).toHaveBeenCalledWith(
        '/users/user-123/notifications'
      );
      expect(result).toEqual(mockResponse);
    });

    it('should get notifications with params', async () => {
      const mockResponse: UserNotificationListResponse = {
        notifications: [],
        totalCount: 0,
        offset: 10,
        limit: 10,
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await userNotificationsApi.getUserNotifications(
        'user-123',
        { offset: 10, limit: 10 }
      );

      expect(mockClient.get).toHaveBeenCalledWith(
        '/users/user-123/notifications?offset=10&limit=10'
      );
      expect(result).toEqual(mockResponse);
    });

    it('should return count only when specified', async () => {
      const mockResponse: UserNotificationCountResponse = {
        totalCount: 10,
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await userNotificationsApi.getUserNotifications(
        'user-123',
        { countOnly: true }
      );

      expect(result).toEqual(mockResponse);
    });

    it('should handle 403 forbidden error', async () => {
      const error = new Error('Forbidden - admin access required');
      mockClient.get.mockRejectedValue(error);

      await expect(
        userNotificationsApi.getUserNotifications('user-123')
      ).rejects.toThrow('Forbidden - admin access required');
    });
  });

  describe('getAllNotifications', () => {
    it('should get all notifications', async () => {
      const mockResponse: UserNotificationListResponse = {
        notifications: [],
        totalCount: 0,
        offset: 0,
        limit: 20,
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await userNotificationsApi.getAllNotifications();

      expect(mockClient.get).toHaveBeenCalledWith('/users/me/notifications');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getUnreadNotifications', () => {
    it('should get unread notifications', async () => {
      const mockResponse: UserNotificationListResponse = {
        notifications: [],
        totalCount: 0,
        offset: 0,
        limit: 20,
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await userNotificationsApi.getUnreadNotifications();

      expect(mockClient.get).toHaveBeenCalledWith('/users/me/notifications');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('clearReadNotifications', () => {
    it('should clear read notifications', async () => {
      const mockNotifications: UserNotificationListResponse = {
        notifications: [
          {
            notificationId: 'notif-1',
            userId: 'user-1',
            title: 'Read Notification',
            message: 'Message',
            notificationCategory: NotificationCategory.NEW_FOLLOWER,
            isRead: true,
            isDeleted: false,
            createdAt: '2025-10-28T14:30:00Z',
            updatedAt: '2025-10-28T14:30:00Z',
            notificationData: {
              templateVersion: '1.0',
              followerId: 'user-2',
              followerName: 'John',
            },
          },
          {
            notificationId: 'notif-2',
            userId: 'user-1',
            title: 'Unread Notification',
            message: 'Message',
            notificationCategory: NotificationCategory.NEW_FOLLOWER,
            isRead: false,
            isDeleted: false,
            createdAt: '2025-10-28T14:30:00Z',
            updatedAt: '2025-10-28T14:30:00Z',
            notificationData: {
              templateVersion: '1.0',
              followerId: 'user-3',
              followerName: 'Jane',
            },
          },
        ],
        totalCount: 2,
        offset: 0,
        limit: 1000,
      };

      const deleteResponse = {
        message: 'Notifications deleted',
        deletedNotificationIds: ['notif-1'],
      };

      mockClient.get.mockResolvedValue({ data: mockNotifications });
      mockClient.delete.mockResolvedValue({ data: deleteResponse });

      const result = await userNotificationsApi.clearReadNotifications();

      expect(mockClient.delete).toHaveBeenCalledWith(
        '/users/me/notifications',
        {
          data: { notificationIds: ['notif-1'] },
        }
      );
      expect(result).toEqual(deleteResponse);
    });

    it('should return empty result when no notifications exist', async () => {
      const mockNotifications: UserNotificationListResponse = {
        notifications: [],
        totalCount: 0,
        offset: 0,
        limit: 1000,
      };

      mockClient.get.mockResolvedValue({ data: mockNotifications });

      const result = await userNotificationsApi.clearReadNotifications();

      expect(result).toEqual({
        message: 'No notifications to clear',
        deletedNotificationIds: [],
      });
      expect(mockClient.delete).not.toHaveBeenCalled();
    });

    it('should return empty result when no read notifications', async () => {
      const mockNotifications: UserNotificationListResponse = {
        notifications: [
          {
            notificationId: 'notif-1',
            userId: 'user-1',
            title: 'Unread',
            message: 'Message',
            notificationCategory: NotificationCategory.NEW_FOLLOWER,
            isRead: false,
            isDeleted: false,
            createdAt: '2025-10-28T14:30:00Z',
            updatedAt: '2025-10-28T14:30:00Z',
            notificationData: {
              templateVersion: '1.0',
              followerId: 'user-2',
              followerName: 'John',
            },
          },
        ],
        totalCount: 1,
        offset: 0,
        limit: 1000,
      };

      mockClient.get.mockResolvedValue({ data: mockNotifications });

      const result = await userNotificationsApi.clearReadNotifications();

      expect(result).toEqual({
        message: 'No read notifications to clear',
        deletedNotificationIds: [],
      });
      expect(mockClient.delete).not.toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      const error = new Error('Server error');
      mockClient.get.mockRejectedValue(error);

      await expect(
        userNotificationsApi.clearReadNotifications()
      ).rejects.toThrow('Server error');
    });
  });

  describe('hasNewNotifications', () => {
    it('should check for new notifications without lastCheckTime', async () => {
      const countResponse: UserNotificationCountResponse = {
        totalCount: 3,
      };

      mockClient.get.mockResolvedValue({ data: countResponse });

      const result = await userNotificationsApi.hasNewNotifications();

      expect(result).toEqual({ hasNew: true, count: 3 });
    });

    it('should return false when no unread notifications', async () => {
      const countResponse: UserNotificationCountResponse = {
        totalCount: 0,
      };

      mockClient.get.mockResolvedValue({ data: countResponse });

      const result = await userNotificationsApi.hasNewNotifications();

      expect(result).toEqual({ hasNew: false, count: 0 });
    });

    it('should check for new notifications since lastCheckTime', async () => {
      const countResponse: UserNotificationCountResponse = {
        totalCount: 2,
      };

      const listResponse: UserNotificationListResponse = {
        notifications: [
          {
            notificationId: 'notif-1',
            userId: 'user-1',
            title: 'New',
            message: 'Message',
            notificationCategory: NotificationCategory.NEW_FOLLOWER,
            isRead: false,
            isDeleted: false,
            createdAt: '2025-10-29T14:30:00Z',
            updatedAt: '2025-10-29T14:30:00Z',
            notificationData: {
              templateVersion: '1.0',
              followerId: 'user-2',
              followerName: 'John',
            },
          },
        ],
        totalCount: 1,
        offset: 0,
        limit: 10,
      };

      mockClient.get
        .mockResolvedValueOnce({ data: countResponse })
        .mockResolvedValueOnce({ data: listResponse });

      const result = await userNotificationsApi.hasNewNotifications(
        '2025-10-28T14:30:00Z'
      );

      expect(result).toEqual({ hasNew: true, count: 1 });
    });

    it('should return false when no new notifications since lastCheckTime', async () => {
      const countResponse: UserNotificationCountResponse = {
        totalCount: 2,
      };

      const listResponse: UserNotificationListResponse = {
        notifications: [
          {
            notificationId: 'notif-1',
            userId: 'user-1',
            title: 'Old',
            message: 'Message',
            notificationCategory: NotificationCategory.NEW_FOLLOWER,
            isRead: false,
            isDeleted: false,
            createdAt: '2025-10-27T14:30:00Z',
            updatedAt: '2025-10-27T14:30:00Z',
            notificationData: {
              templateVersion: '1.0',
              followerId: 'user-2',
              followerName: 'John',
            },
          },
        ],
        totalCount: 1,
        offset: 0,
        limit: 10,
      };

      mockClient.get
        .mockResolvedValueOnce({ data: countResponse })
        .mockResolvedValueOnce({ data: listResponse });

      const result = await userNotificationsApi.hasNewNotifications(
        '2025-10-28T14:30:00Z'
      );

      expect(result).toEqual({ hasNew: false, count: 0 });
    });

    it('should handle errors gracefully', async () => {
      const error = new Error('Network error');
      mockClient.get.mockRejectedValue(error);

      const result = await userNotificationsApi.hasNewNotifications();

      expect(result).toEqual({ hasNew: false, count: 0 });
    });
  });
});
