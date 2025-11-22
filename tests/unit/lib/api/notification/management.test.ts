import { managementApi } from '@/lib/api/notification/management';
import {
  notificationClient,
  buildQueryParams,
} from '@/lib/api/notification/client';
import {
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
        notification_id: '770e8400-e29b-41d4-a716-446655440111',
        recipient_id: '550e8400-e29b-41d4-a716-446655440001',
        recipient_email: 'john.doe@example.com',
        subject: "New Recipe: Grandma's Chocolate Chip Cookies",
        notification_type: NotificationType.EMAIL,
        status: NotificationStatus.SENT,
        error_message: '',
        retry_count: 0,
        max_retries: 3,
        created_at: '2025-10-28T14:30:00Z',
        queued_at: '2025-10-28T14:30:01Z',
        sent_at: '2025-10-28T14:30:15Z',
        failed_at: null,
        metadata: {
          template_type: 'recipe_published',
          recipe_id: 660,
        },
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
      expect(result.message).toBeUndefined();
    });

    it('should get notification with message', async () => {
      const mockResponse: NotificationDetail = {
        notification_id: '770e8400-e29b-41d4-a716-446655440111',
        recipient_id: '550e8400-e29b-41d4-a716-446655440001',
        recipient_email: 'john.doe@example.com',
        subject: 'Recipe Shared',
        message: 'Full HTML email content here...',
        notification_type: NotificationType.EMAIL,
        status: NotificationStatus.SENT,
        error_message: '',
        retry_count: 0,
        max_retries: 3,
        created_at: '2025-10-28T14:30:00Z',
        queued_at: '2025-10-28T14:30:01Z',
        sent_at: '2025-10-28T14:30:15Z',
        failed_at: null,
        metadata: {
          template_type: 'share_recipe',
          recipe_id: 123,
        },
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
        notification_id: '770e8400-e29b-41d4-a716-446655440111',
        recipient_id: '550e8400-e29b-41d4-a716-446655440001',
        recipient_email: 'john.doe@example.com',
        subject: 'Recipe Shared',
        notification_type: NotificationType.EMAIL,
        status: NotificationStatus.QUEUED,
        error_message: '',
        retry_count: 0,
        max_retries: 3,
        created_at: '2025-10-28T14:30:00Z',
        queued_at: '2025-10-28T14:30:01Z',
        sent_at: null,
        failed_at: null,
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
        notification_id: '770e8400-e29b-41d4-a716-446655440112',
        recipient_id: '550e8400-e29b-41d4-a716-446655440002',
        recipient_email: 'jane.smith@example.com',
        subject: 'Recipe Shared',
        notification_type: NotificationType.EMAIL,
        status: NotificationStatus.PENDING,
        error_message: '',
        retry_count: 0,
        max_retries: 3,
        created_at: '2025-10-28T14:35:00Z',
        queued_at: null,
        sent_at: null,
        failed_at: null,
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await managementApi.getNotificationById(
        '770e8400-e29b-41d4-a716-446655440112',
        false
      );

      expect(result.status).toBe(NotificationStatus.PENDING);
      expect(result.queued_at).toBeNull();
      expect(result.sent_at).toBeNull();
    });

    it('should get notification with failed status', async () => {
      const mockResponse: NotificationDetail = {
        notification_id: '770e8400-e29b-41d4-a716-446655440113',
        recipient_id: '550e8400-e29b-41d4-a716-446655440003',
        recipient_email: 'invalid@example.com',
        subject: 'Recipe Shared',
        notification_type: NotificationType.EMAIL,
        status: NotificationStatus.FAILED,
        error_message: 'SMTP connection failed',
        retry_count: 3,
        max_retries: 3,
        created_at: '2025-10-28T14:40:00Z',
        queued_at: '2025-10-28T14:40:01Z',
        sent_at: null,
        failed_at: '2025-10-28T14:40:30Z',
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await managementApi.getNotificationById(
        '770e8400-e29b-41d4-a716-446655440113',
        false
      );

      expect(result.status).toBe(NotificationStatus.FAILED);
      expect(result.error_message).toBe('SMTP connection failed');
      expect(result.retry_count).toBe(3);
      expect(result.failed_at).toBeDefined();
    });

    it('should get notification with queued status', async () => {
      const mockResponse: NotificationDetail = {
        notification_id: '770e8400-e29b-41d4-a716-446655440114',
        recipient_id: '550e8400-e29b-41d4-a716-446655440004',
        recipient_email: 'user@example.com',
        subject: 'Recipe Shared',
        notification_type: NotificationType.EMAIL,
        status: NotificationStatus.QUEUED,
        error_message: '',
        retry_count: 0,
        max_retries: 3,
        created_at: '2025-10-28T14:45:00Z',
        queued_at: '2025-10-28T14:45:01Z',
        sent_at: null,
        failed_at: null,
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await managementApi.getNotificationById(
        '770e8400-e29b-41d4-a716-446655440114',
        false
      );

      expect(result.status).toBe(NotificationStatus.QUEUED);
      expect(result.queued_at).toBeDefined();
      expect(result.sent_at).toBeNull();
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

    it('should handle notification with null recipient_id', async () => {
      const mockResponse: NotificationDetail = {
        notification_id: '770e8400-e29b-41d4-a716-446655440115',
        recipient_id: null,
        recipient_email: 'emailonly@example.com',
        subject: 'Recipe Shared',
        notification_type: NotificationType.EMAIL,
        status: NotificationStatus.SENT,
        error_message: '',
        retry_count: 0,
        max_retries: 3,
        created_at: '2025-10-28T14:50:00Z',
        queued_at: '2025-10-28T14:50:01Z',
        sent_at: '2025-10-28T14:50:15Z',
        failed_at: null,
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await managementApi.getNotificationById(
        '770e8400-e29b-41d4-a716-446655440115',
        false
      );

      expect(result.recipient_id).toBeNull();
      expect(result.recipient_email).toBe('emailonly@example.com');
    });

    it('should handle notification with metadata', async () => {
      const mockResponse: NotificationDetail = {
        notification_id: '770e8400-e29b-41d4-a716-446655440116',
        recipient_id: '550e8400-e29b-41d4-a716-446655440005',
        recipient_email: 'user@example.com',
        subject: 'Recipe Shared',
        notification_type: NotificationType.EMAIL,
        status: NotificationStatus.SENT,
        error_message: '',
        retry_count: 0,
        max_retries: 3,
        created_at: '2025-10-28T14:55:00Z',
        queued_at: '2025-10-28T14:55:01Z',
        sent_at: '2025-10-28T14:55:15Z',
        failed_at: null,
        metadata: {
          template_type: 'share_recipe',
          recipe_id: 123,
          sharer_id: '550e8400-e29b-41d4-a716-446655440006',
          share_message: 'Check this out!',
        },
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await managementApi.getNotificationById(
        '770e8400-e29b-41d4-a716-446655440116',
        false
      );

      expect(result.metadata).toBeDefined();
      expect(result.metadata?.template_type).toBe('share_recipe');
      expect(result.metadata?.recipe_id).toBe(123);
    });

    it('should build URL without query string when buildQueryParams returns empty', async () => {
      const mockResponse: NotificationDetail = {
        notification_id: '770e8400-e29b-41d4-a716-446655440117',
        recipient_id: '550e8400-e29b-41d4-a716-446655440006',
        recipient_email: 'user@example.com',
        subject: 'Recipe Shared',
        notification_type: NotificationType.EMAIL,
        status: NotificationStatus.SENT,
        error_message: '',
        retry_count: 0,
        max_retries: 3,
        created_at: '2025-10-28T15:00:00Z',
        queued_at: '2025-10-28T15:00:01Z',
        sent_at: '2025-10-28T15:00:15Z',
        failed_at: null,
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
});
