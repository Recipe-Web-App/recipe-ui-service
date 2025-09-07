import type {
  Notification,
  NotificationListResponse,
  NotificationCountResponse,
  NotificationReadResponse,
  NotificationReadAllResponse,
  NotificationDeleteRequest,
  NotificationDeleteResponse,
} from '@/types/user-management/notifications';

describe('User Management Notifications Types', () => {
  describe('Notification', () => {
    it('should have all required properties', () => {
      const notification: Notification = {
        notificationId: '123e4567-e89b-12d3-a456-426614174000',
        userId: '223e4567-e89b-12d3-a456-426614174000',
        title: 'New Follower',
        message: 'ChefMaster started following you',
        notificationType: 'follow',
        isRead: false,
        isDeleted: false,
        createdAt: '2023-01-01T12:00:00Z',
        updatedAt: '2023-01-01T12:00:00Z',
      };

      expect(typeof notification.notificationId).toBe('string');
      expect(typeof notification.userId).toBe('string');
      expect(typeof notification.title).toBe('string');
      expect(typeof notification.message).toBe('string');
      expect(typeof notification.notificationType).toBe('string');
      expect(typeof notification.isRead).toBe('boolean');
      expect(typeof notification.isDeleted).toBe('boolean');
      expect(typeof notification.createdAt).toBe('string');
      expect(typeof notification.updatedAt).toBe('string');
    });

    it('should handle read notification state', () => {
      const readNotification: Notification = {
        notificationId: '123e4567-e89b-12d3-a456-426614174000',
        userId: '223e4567-e89b-12d3-a456-426614174000',
        title: 'Recipe Liked',
        message: 'Someone liked your chocolate chip cookies recipe',
        notificationType: 'like',
        isRead: true,
        isDeleted: false,
        createdAt: '2023-01-01T10:00:00Z',
        updatedAt: '2023-01-01T12:30:00Z',
      };

      expect(readNotification.isRead).toBe(true);
      expect(readNotification.isDeleted).toBe(false);
    });

    it('should handle different notification types', () => {
      const types = ['follow', 'like', 'comment', 'recipe', 'system'];

      types.forEach(type => {
        const notification: Notification = {
          notificationId: `${type}-123e4567-e89b-12d3-a456-426614174000`,
          userId: '223e4567-e89b-12d3-a456-426614174000',
          title: `${type} notification`,
          message: `Test ${type} message`,
          notificationType: type,
          isRead: false,
          isDeleted: false,
          createdAt: '2023-01-01T12:00:00Z',
          updatedAt: '2023-01-01T12:00:00Z',
        };

        expect(notification.notificationType).toBe(type);
      });
    });
  });

  describe('NotificationListResponse', () => {
    it('should extend PaginatedResponse structure', () => {
      const response: NotificationListResponse = {
        notifications: [
          {
            notificationId: '123e4567-e89b-12d3-a456-426614174000',
            userId: '223e4567-e89b-12d3-a456-426614174000',
            title: 'Test Notification',
            message: 'This is a test',
            notificationType: 'test',
            isRead: false,
            isDeleted: false,
            createdAt: '2023-01-01T12:00:00Z',
            updatedAt: '2023-01-01T12:00:00Z',
          },
        ],
        results: [
          {
            notificationId: '123e4567-e89b-12d3-a456-426614174000',
            userId: '223e4567-e89b-12d3-a456-426614174000',
            title: 'Test Notification',
            message: 'This is a test',
            notificationType: 'test',
            isRead: false,
            isDeleted: false,
            createdAt: '2023-01-01T12:00:00Z',
            updatedAt: '2023-01-01T12:00:00Z',
          },
        ],
        totalCount: 1,
        limit: 20,
        offset: 0,
      };

      expect(Array.isArray(response.notifications)).toBe(true);
      expect(Array.isArray(response.results)).toBe(true);
      expect(typeof response.totalCount).toBe('number');
      expect(typeof response.limit).toBe('number');
      expect(typeof response.offset).toBe('number');
    });

    it('should handle empty notifications list', () => {
      const emptyResponse: NotificationListResponse = {
        notifications: [],
        results: [],
        totalCount: 0,
        limit: 20,
        offset: 0,
      };

      expect(emptyResponse.notifications).toHaveLength(0);
      expect(emptyResponse.results).toHaveLength(0);
      expect(emptyResponse.totalCount).toBe(0);
    });
  });

  describe('NotificationCountResponse', () => {
    it('should have totalCount property', () => {
      const countResponse: NotificationCountResponse = {
        totalCount: 15,
      };

      expect(typeof countResponse.totalCount).toBe('number');
      expect(countResponse.totalCount).toBe(15);
    });

    it('should handle zero count', () => {
      const zeroCountResponse: NotificationCountResponse = {
        totalCount: 0,
      };

      expect(zeroCountResponse.totalCount).toBe(0);
    });
  });

  describe('NotificationReadResponse', () => {
    it('should have message property', () => {
      const readResponse: NotificationReadResponse = {
        message: 'Notification marked as read successfully',
      };

      expect(typeof readResponse.message).toBe('string');
    });
  });

  describe('NotificationReadAllResponse', () => {
    it('should have message and readNotificationIds', () => {
      const readAllResponse: NotificationReadAllResponse = {
        message: 'All notifications marked as read successfully',
        readNotificationIds: [
          '123e4567-e89b-12d3-a456-426614174000',
          '223e4567-e89b-12d3-a456-426614174000',
        ],
      };

      expect(typeof readAllResponse.message).toBe('string');
      expect(Array.isArray(readAllResponse.readNotificationIds)).toBe(true);
      expect(readAllResponse.readNotificationIds).toHaveLength(2);
      readAllResponse.readNotificationIds.forEach(id => {
        expect(typeof id).toBe('string');
      });
    });

    it('should handle empty read list', () => {
      const emptyReadResponse: NotificationReadAllResponse = {
        message: 'No notifications to mark as read',
        readNotificationIds: [],
      };

      expect(emptyReadResponse.readNotificationIds).toHaveLength(0);
    });
  });

  describe('NotificationDeleteRequest', () => {
    it('should have notificationIds array', () => {
      const deleteRequest: NotificationDeleteRequest = {
        notificationIds: [
          '123e4567-e89b-12d3-a456-426614174000',
          '223e4567-e89b-12d3-a456-426614174000',
        ],
      };

      expect(Array.isArray(deleteRequest.notificationIds)).toBe(true);
      expect(deleteRequest.notificationIds).toHaveLength(2);
      deleteRequest.notificationIds.forEach(id => {
        expect(typeof id).toBe('string');
      });
    });

    it('should handle single notification deletion', () => {
      const singleDeleteRequest: NotificationDeleteRequest = {
        notificationIds: ['123e4567-e89b-12d3-a456-426614174000'],
      };

      expect(singleDeleteRequest.notificationIds).toHaveLength(1);
    });
  });

  describe('NotificationDeleteResponse', () => {
    it('should allow optional message and deleted_notification_ids', () => {
      const deleteResponse: NotificationDeleteResponse = {};

      expect(typeof deleteResponse).toBe('object');
      expect(deleteResponse.message).toBeUndefined();
      expect(deleteResponse.deleted_notification_ids).toBeUndefined();
    });

    it('should handle successful deletion response', () => {
      const successResponse: NotificationDeleteResponse = {
        message: 'Notifications deleted successfully',
        deleted_notification_ids: [
          '123e4567-e89b-12d3-a456-426614174000',
          '223e4567-e89b-12d3-a456-426614174000',
        ],
      };

      expect(typeof successResponse.message).toBe('string');
      expect(Array.isArray(successResponse.deleted_notification_ids)).toBe(
        true
      );
      expect(successResponse.deleted_notification_ids).toHaveLength(2);
    });

    it('should handle partial deletion response', () => {
      const partialResponse: NotificationDeleteResponse = {
        message: 'Some notifications could not be deleted',
        deleted_notification_ids: ['123e4567-e89b-12d3-a456-426614174000'],
      };

      expect(partialResponse.deleted_notification_ids).toHaveLength(1);
    });
  });
});
