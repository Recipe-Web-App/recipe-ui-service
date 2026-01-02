import { managementApi } from '@/lib/api/notification/management';
import { notificationClient } from '@/lib/api/notification/client';
import {
  NotificationCategory,
  NotificationStatus,
  NotificationType,
  type NotificationDetail,
} from '@/types/notification';

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

describe('Management API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getNotificationById', () => {
    it('should get notification without message', async () => {
      const mockResponse: NotificationDetail = {
        notificationId: '770e8400-e29b-41d4-a716-446655440111',
        userId: '550e8400-e29b-41d4-a716-446655440001',
        notificationCategory: NotificationCategory.RECIPE_PUBLISHED,
        isRead: false,
        isDeleted: false,
        createdAt: '2025-10-28T14:30:00Z',
        updatedAt: '2025-10-28T14:30:15Z',
        notificationData: {
          templateVersion: '1.0',
          recipeId: 660,
          recipeTitle: "Grandma's Chocolate Chip Cookies",
          authorId: 'author-1',
          authorName: 'Chef John',
        },
        title: "New Recipe: Grandma's Chocolate Chip Cookies",
        message: 'Chef John published a new recipe',
        deliveryStatuses: [
          {
            notificationType: NotificationType.EMAIL,
            status: NotificationStatus.SENT,
            retryCount: 0,
            errorMessage: null,
            recipientEmail: 'john.doe@example.com',
            createdAt: '2025-10-28T14:30:00Z',
            updatedAt: '2025-10-28T14:30:15Z',
            queuedAt: '2025-10-28T14:30:01Z',
            sentAt: '2025-10-28T14:30:15Z',
            failedAt: null,
          },
        ],
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await managementApi.getNotificationById(
        '770e8400-e29b-41d4-a716-446655440111',
        false
      );

      expect(mockClient.get).toHaveBeenCalledWith(
        '/notifications/770e8400-e29b-41d4-a716-446655440111?include_message=false'
      );
      expect(result).toEqual(mockResponse);
    });

    it('should get notification with message', async () => {
      const mockResponse: NotificationDetail = {
        notificationId: '770e8400-e29b-41d4-a716-446655440111',
        userId: '550e8400-e29b-41d4-a716-446655440001',
        notificationCategory: NotificationCategory.RECIPE_SHARED,
        isRead: false,
        isDeleted: false,
        createdAt: '2025-10-28T14:30:00Z',
        updatedAt: '2025-10-28T14:30:15Z',
        notificationData: {
          templateVersion: '1.0',
          recipeId: 123,
          recipeTitle: 'Test Recipe',
          actorId: 'user-2',
          actorName: 'John Doe',
        },
        title: 'Recipe Shared',
        message: 'Full HTML email content here...',
        deliveryStatuses: [
          {
            notificationType: NotificationType.EMAIL,
            status: NotificationStatus.SENT,
            retryCount: 0,
            errorMessage: null,
            recipientEmail: 'john.doe@example.com',
            createdAt: '2025-10-28T14:30:00Z',
            updatedAt: '2025-10-28T14:30:15Z',
            queuedAt: '2025-10-28T14:30:01Z',
            sentAt: '2025-10-28T14:30:15Z',
            failedAt: null,
          },
        ],
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await managementApi.getNotificationById(
        '770e8400-e29b-41d4-a716-446655440111',
        true
      );

      expect(mockClient.get).toHaveBeenCalledWith(
        '/notifications/770e8400-e29b-41d4-a716-446655440111?include_message=true'
      );
      expect(result).toEqual(mockResponse);
      expect(result.message).toBeDefined();
    });

    it('should get notification with default includeMessage parameter', async () => {
      const mockResponse: NotificationDetail = {
        notificationId: '770e8400-e29b-41d4-a716-446655440111',
        userId: '550e8400-e29b-41d4-a716-446655440001',
        notificationCategory: NotificationCategory.RECIPE_SHARED,
        isRead: false,
        isDeleted: false,
        createdAt: '2025-10-28T14:30:00Z',
        updatedAt: '2025-10-28T14:30:01Z',
        notificationData: {
          templateVersion: '1.0',
          recipeId: 123,
          recipeTitle: 'Test Recipe',
          actorId: 'user-2',
          actorName: 'User',
        },
        title: 'Recipe Shared',
        message: 'User shared a recipe with you',
        deliveryStatuses: [
          {
            notificationType: NotificationType.EMAIL,
            status: NotificationStatus.QUEUED,
            retryCount: 0,
            errorMessage: null,
            recipientEmail: 'john.doe@example.com',
            createdAt: '2025-10-28T14:30:00Z',
            updatedAt: '2025-10-28T14:30:01Z',
            queuedAt: '2025-10-28T14:30:01Z',
            sentAt: null,
            failedAt: null,
          },
        ],
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await managementApi.getNotificationById(
        '770e8400-e29b-41d4-a716-446655440111'
      );

      expect(mockClient.get).toHaveBeenCalledWith(
        '/notifications/770e8400-e29b-41d4-a716-446655440111?include_message=false'
      );
      expect(result).toEqual(mockResponse);
    });

    it('should get notification with pending status', async () => {
      const mockResponse: NotificationDetail = {
        notificationId: '770e8400-e29b-41d4-a716-446655440112',
        userId: '550e8400-e29b-41d4-a716-446655440002',
        notificationCategory: NotificationCategory.RECIPE_SHARED,
        isRead: false,
        isDeleted: false,
        createdAt: '2025-10-28T14:35:00Z',
        updatedAt: '2025-10-28T14:35:00Z',
        notificationData: {
          templateVersion: '1.0',
          recipeId: 123,
          recipeTitle: 'Test Recipe',
          actorId: 'user-2',
          actorName: 'Jane Smith',
        },
        title: 'Recipe Shared',
        message: 'Jane Smith shared a recipe with you',
        deliveryStatuses: [
          {
            notificationType: NotificationType.EMAIL,
            status: NotificationStatus.PENDING,
            retryCount: 0,
            errorMessage: null,
            recipientEmail: 'jane.smith@example.com',
            createdAt: '2025-10-28T14:35:00Z',
            updatedAt: '2025-10-28T14:35:00Z',
            queuedAt: null,
            sentAt: null,
            failedAt: null,
          },
        ],
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await managementApi.getNotificationById(
        '770e8400-e29b-41d4-a716-446655440112',
        false
      );

      expect(result.deliveryStatuses[0].status).toBe(
        NotificationStatus.PENDING
      );
      expect(result.deliveryStatuses[0].queuedAt).toBeNull();
      expect(result.deliveryStatuses[0].sentAt).toBeNull();
    });

    it('should get notification with failed status', async () => {
      const mockResponse: NotificationDetail = {
        notificationId: '770e8400-e29b-41d4-a716-446655440113',
        userId: '550e8400-e29b-41d4-a716-446655440003',
        notificationCategory: NotificationCategory.RECIPE_SHARED,
        isRead: false,
        isDeleted: false,
        createdAt: '2025-10-28T14:40:00Z',
        updatedAt: '2025-10-28T14:40:30Z',
        notificationData: {
          templateVersion: '1.0',
          recipeId: 123,
          recipeTitle: 'Test Recipe',
          actorId: 'user-2',
          actorName: 'User',
        },
        title: 'Recipe Shared',
        message: 'User shared a recipe with you',
        deliveryStatuses: [
          {
            notificationType: NotificationType.EMAIL,
            status: NotificationStatus.FAILED,
            retryCount: 3,
            errorMessage: 'SMTP connection failed',
            recipientEmail: 'invalid@example.com',
            createdAt: '2025-10-28T14:40:00Z',
            updatedAt: '2025-10-28T14:40:30Z',
            queuedAt: '2025-10-28T14:40:01Z',
            sentAt: null,
            failedAt: '2025-10-28T14:40:30Z',
          },
        ],
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await managementApi.getNotificationById(
        '770e8400-e29b-41d4-a716-446655440113',
        false
      );

      expect(result.deliveryStatuses[0].status).toBe(NotificationStatus.FAILED);
      expect(result.deliveryStatuses[0].errorMessage).toBe(
        'SMTP connection failed'
      );
      expect(result.deliveryStatuses[0].retryCount).toBe(3);
      expect(result.deliveryStatuses[0].failedAt).toBeDefined();
    });

    it('should get notification with queued status', async () => {
      const mockResponse: NotificationDetail = {
        notificationId: '770e8400-e29b-41d4-a716-446655440114',
        userId: '550e8400-e29b-41d4-a716-446655440004',
        notificationCategory: NotificationCategory.RECIPE_SHARED,
        isRead: false,
        isDeleted: false,
        createdAt: '2025-10-28T14:45:00Z',
        updatedAt: '2025-10-28T14:45:01Z',
        notificationData: {
          templateVersion: '1.0',
          recipeId: 123,
          recipeTitle: 'Test Recipe',
          actorId: 'user-2',
          actorName: 'User',
        },
        title: 'Recipe Shared',
        message: 'User shared a recipe with you',
        deliveryStatuses: [
          {
            notificationType: NotificationType.EMAIL,
            status: NotificationStatus.QUEUED,
            retryCount: 0,
            errorMessage: null,
            recipientEmail: 'user@example.com',
            createdAt: '2025-10-28T14:45:00Z',
            updatedAt: '2025-10-28T14:45:01Z',
            queuedAt: '2025-10-28T14:45:01Z',
            sentAt: null,
            failedAt: null,
          },
        ],
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await managementApi.getNotificationById(
        '770e8400-e29b-41d4-a716-446655440114',
        false
      );

      expect(result.deliveryStatuses[0].status).toBe(NotificationStatus.QUEUED);
      expect(result.deliveryStatuses[0].queuedAt).toBeDefined();
      expect(result.deliveryStatuses[0].sentAt).toBeNull();
    });

    it('should handle 400 bad request error', async () => {
      const error = new Error('Invalid notification ID format');
      mockClient.get.mockRejectedValue(error);

      await expect(
        managementApi.getNotificationById('invalid-id', false)
      ).rejects.toThrow('Invalid notification ID format');
    });

    it('should handle 404 not found error', async () => {
      const error = new Error('Notification not found');
      mockClient.get.mockRejectedValue(error);

      await expect(
        managementApi.getNotificationById(
          '770e8400-e29b-41d4-a716-446655440999',
          false
        )
      ).rejects.toThrow('Notification not found');
    });

    it('should handle 403 forbidden error', async () => {
      const error = new Error(
        'You do not have permission to perform this action'
      );
      mockClient.get.mockRejectedValue(error);

      await expect(
        managementApi.getNotificationById(
          '770e8400-e29b-41d4-a716-446655440111',
          false
        )
      ).rejects.toThrow('You do not have permission to perform this action');
    });

    it('should handle network error', async () => {
      const error = new Error('Network Error');
      mockClient.get.mockRejectedValue(error);

      await expect(
        managementApi.getNotificationById(
          '770e8400-e29b-41d4-a716-446655440111',
          false
        )
      ).rejects.toThrow('Network Error');
    });

    it('should get notification with multiple delivery channels', async () => {
      const mockResponse: NotificationDetail = {
        notificationId: '770e8400-e29b-41d4-a716-446655440115',
        userId: '550e8400-e29b-41d4-a716-446655440005',
        notificationCategory: NotificationCategory.RECIPE_SHARED,
        isRead: false,
        isDeleted: false,
        createdAt: '2025-10-28T14:50:00Z',
        updatedAt: '2025-10-28T14:50:15Z',
        notificationData: {
          templateVersion: '1.0',
          recipeId: 123,
          recipeTitle: 'Test Recipe',
          actorId: 'user-2',
          actorName: 'User',
        },
        title: 'Recipe Shared',
        message: 'User shared a recipe with you',
        deliveryStatuses: [
          {
            notificationType: NotificationType.EMAIL,
            status: NotificationStatus.SENT,
            retryCount: 0,
            errorMessage: null,
            recipientEmail: 'emailonly@example.com',
            createdAt: '2025-10-28T14:50:00Z',
            updatedAt: '2025-10-28T14:50:15Z',
            queuedAt: '2025-10-28T14:50:01Z',
            sentAt: '2025-10-28T14:50:15Z',
            failedAt: null,
          },
          {
            notificationType: NotificationType.IN_APP,
            status: NotificationStatus.SENT,
            retryCount: 0,
            errorMessage: null,
            createdAt: '2025-10-28T14:50:00Z',
            updatedAt: '2025-10-28T14:50:02Z',
            queuedAt: '2025-10-28T14:50:01Z',
            sentAt: '2025-10-28T14:50:02Z',
            failedAt: null,
          },
        ],
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await managementApi.getNotificationById(
        '770e8400-e29b-41d4-a716-446655440115',
        false
      );

      expect(result.deliveryStatuses).toHaveLength(2);
      expect(result.deliveryStatuses[0].notificationType).toBe(
        NotificationType.EMAIL
      );
      expect(result.deliveryStatuses[1].notificationType).toBe(
        NotificationType.IN_APP
      );
    });

    it('should build URL without query string when buildQueryParams returns empty', async () => {
      const mockResponse: NotificationDetail = {
        notificationId: '770e8400-e29b-41d4-a716-446655440117',
        userId: '550e8400-e29b-41d4-a716-446655440006',
        notificationCategory: NotificationCategory.RECIPE_SHARED,
        isRead: false,
        isDeleted: false,
        createdAt: '2025-10-28T15:00:00Z',
        updatedAt: '2025-10-28T15:00:15Z',
        notificationData: {
          templateVersion: '1.0',
          recipeId: 123,
          recipeTitle: 'Test Recipe',
          actorId: 'user-2',
          actorName: 'User',
        },
        title: 'Recipe Shared',
        message: 'User shared a recipe with you',
        deliveryStatuses: [
          {
            notificationType: NotificationType.EMAIL,
            status: NotificationStatus.SENT,
            retryCount: 0,
            errorMessage: null,
            recipientEmail: 'user@example.com',
            createdAt: '2025-10-28T15:00:00Z',
            updatedAt: '2025-10-28T15:00:15Z',
            queuedAt: '2025-10-28T15:00:01Z',
            sentAt: '2025-10-28T15:00:15Z',
            failedAt: null,
          },
        ],
      };

      // Spy on buildQueryParams and mock it to return empty string
      const buildQueryParamsSpy = jest
        .spyOn(require('@/lib/api/notification/client'), 'buildQueryParams')
        .mockReturnValueOnce('');

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await managementApi.getNotificationById(
        '770e8400-e29b-41d4-a716-446655440117',
        false
      );

      expect(mockClient.get).toHaveBeenCalledWith(
        '/notifications/770e8400-e29b-41d4-a716-446655440117'
      );
      expect(result).toEqual(mockResponse);

      // Restore the original implementation
      buildQueryParamsSpy.mockRestore();
    });
  });

  describe('deleteNotification', () => {
    it('should delete a notification', async () => {
      mockClient.delete.mockResolvedValue({ data: undefined });

      await managementApi.deleteNotification(
        '770e8400-e29b-41d4-a716-446655440111'
      );

      expect(mockClient.delete).toHaveBeenCalledWith(
        '/notifications/770e8400-e29b-41d4-a716-446655440111'
      );
    });

    it('should handle 404 not found error on delete', async () => {
      const error = new Error('Notification not found');
      mockClient.delete.mockRejectedValue(error);

      await expect(
        managementApi.deleteNotification('770e8400-e29b-41d4-a716-446655440999')
      ).rejects.toThrow('Notification not found');
    });
  });

  describe('retryNotification', () => {
    it('should retry a failed notification', async () => {
      const mockResponse = {
        notificationId: '770e8400-e29b-41d4-a716-446655440111',
        status: NotificationStatus.QUEUED,
        message: 'Notification queued for retry',
      };

      mockClient.post.mockResolvedValue({ data: mockResponse });

      const result = await managementApi.retryNotification(
        '770e8400-e29b-41d4-a716-446655440111'
      );

      expect(mockClient.post).toHaveBeenCalledWith(
        '/notifications/770e8400-e29b-41d4-a716-446655440111/retry'
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle error when notification cannot be retried', async () => {
      const error = new Error(
        'Cannot retry notification that is not in FAILED status'
      );
      mockClient.post.mockRejectedValue(error);

      await expect(
        managementApi.retryNotification('770e8400-e29b-41d4-a716-446655440111')
      ).rejects.toThrow(
        'Cannot retry notification that is not in FAILED status'
      );
    });
  });
});
