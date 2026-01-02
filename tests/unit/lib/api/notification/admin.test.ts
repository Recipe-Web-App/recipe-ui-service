import { adminApi } from '@/lib/api/notification/admin';
import { notificationClient } from '@/lib/api/notification/client';
import type {
  NotificationStats,
  RetryFailedResponse,
  RetryStatusResponse,
  TemplateListResponse,
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

describe('Notification Admin API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getStats', () => {
    it('should get notification statistics without params', async () => {
      const mockResponse: NotificationStats = {
        total_notifications: 1000,
        status_breakdown: {
          SENT: 950,
          FAILED: 30,
          PENDING: 20,
        },
        type_breakdown: {
          EMAIL: 600,
          IN_APP: 400,
        },
        success_rate: 0.95,
        average_send_time_seconds: 2.5,
        failed_notifications: {
          total: 30,
          by_error_type: { SMTP_ERROR: 20, TIMEOUT: 10 },
        },
        retry_statistics: {
          total_retried: 25,
          currently_retrying: 5,
          exhausted_retries: 10,
          average_retries_before_success: 1.5,
          retry_success_rate: 0.8,
        },
        date_range: {
          start: '2025-10-01',
          end: '2025-10-31',
        },
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await adminApi.getStats();

      expect(mockClient.get).toHaveBeenCalledWith('/stats');
      expect(result).toEqual(mockResponse);
    });

    it('should get notification statistics with date params', async () => {
      const mockResponse: NotificationStats = {
        total_notifications: 500,
        status_breakdown: {
          SENT: 480,
          FAILED: 10,
          PENDING: 10,
        },
        type_breakdown: {},
        success_rate: 0.96,
        average_send_time_seconds: 2.0,
        failed_notifications: {
          total: 10,
          by_error_type: {},
        },
        retry_statistics: {
          total_retried: 0,
          currently_retrying: 0,
          exhausted_retries: 0,
          average_retries_before_success: 0,
          retry_success_rate: 0,
        },
        date_range: {
          start: '2025-10-01',
          end: '2025-10-31',
        },
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await adminApi.getStats({
        start_date: '2025-10-01',
        end_date: '2025-10-31',
      });

      expect(mockClient.get).toHaveBeenCalledWith(
        '/stats?start_date=2025-10-01&end_date=2025-10-31'
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle forbidden error', async () => {
      const error = new Error('Forbidden - admin scope required');
      mockClient.get.mockRejectedValue(error);

      await expect(adminApi.getStats()).rejects.toThrow(
        'Forbidden - admin scope required'
      );
    });

    it('should handle network error', async () => {
      const error = new Error('Network error');
      mockClient.get.mockRejectedValue(error);

      await expect(adminApi.getStats()).rejects.toThrow('Network error');
    });
  });

  describe('retryFailedNotifications', () => {
    it('should retry failed notifications without maxFailures', async () => {
      const mockResponse: RetryFailedResponse = {
        message: 'Retry initiated',
        queued_count: 15,
        remaining_failed: 5,
        total_eligible: 20,
      };

      mockClient.post.mockResolvedValue({ data: mockResponse });

      const result = await adminApi.retryFailedNotifications();

      expect(mockClient.post).toHaveBeenCalledWith(
        '/notifications/retry-failed',
        {}
      );
      expect(result).toEqual(mockResponse);
    });

    it('should retry failed notifications with maxFailures', async () => {
      const mockResponse: RetryFailedResponse = {
        message: 'Retry initiated',
        queued_count: 5,
        remaining_failed: 0,
        total_eligible: 5,
      };

      mockClient.post.mockResolvedValue({ data: mockResponse });

      const result = await adminApi.retryFailedNotifications(2);

      expect(mockClient.post).toHaveBeenCalledWith(
        '/notifications/retry-failed',
        { max_failures: 2 }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle no notifications to retry', async () => {
      const mockResponse: RetryFailedResponse = {
        message: 'No failed notifications to retry',
        queued_count: 0,
        remaining_failed: 0,
        total_eligible: 0,
      };

      mockClient.post.mockResolvedValue({ data: mockResponse });

      const result = await adminApi.retryFailedNotifications();

      expect(result).toEqual(mockResponse);
    });

    it('should handle forbidden error', async () => {
      const error = new Error('Forbidden - admin scope required');
      mockClient.post.mockRejectedValue(error);

      await expect(adminApi.retryFailedNotifications()).rejects.toThrow(
        'Forbidden - admin scope required'
      );
    });

    it('should handle server error', async () => {
      const error = new Error('Internal server error');
      mockClient.post.mockRejectedValue(error);

      await expect(adminApi.retryFailedNotifications()).rejects.toThrow(
        'Internal server error'
      );
    });
  });

  describe('getRetryStatus', () => {
    it('should get retry status', async () => {
      const mockResponse: RetryStatusResponse = {
        failed_retryable: 20,
        failed_exhausted: 10,
        currently_queued: 5,
        safe_to_retry: false,
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await adminApi.getRetryStatus();

      expect(mockClient.get).toHaveBeenCalledWith(
        '/notifications/retry-status'
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle empty retry status', async () => {
      const mockResponse: RetryStatusResponse = {
        failed_retryable: 0,
        failed_exhausted: 0,
        currently_queued: 0,
        safe_to_retry: true,
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await adminApi.getRetryStatus();

      expect(result).toEqual(mockResponse);
    });

    it('should handle forbidden error', async () => {
      const error = new Error('Forbidden');
      mockClient.get.mockRejectedValue(error);

      await expect(adminApi.getRetryStatus()).rejects.toThrow('Forbidden');
    });
  });

  describe('getTemplates', () => {
    it('should get available templates', async () => {
      const mockResponse: TemplateListResponse = {
        templates: [
          {
            template_type: 'recipe_published',
            display_name: 'Recipe Published',
            description: 'Notification when a recipe is published',
            required_fields: ['recipe_id', 'recipient_ids'],
            endpoint: '/notifications/recipe-published',
          },
          {
            template_type: 'new_follower',
            display_name: 'New Follower',
            description: 'Notification when someone follows you',
            required_fields: ['follower_id', 'recipient_ids'],
            endpoint: '/notifications/new-follower',
          },
        ],
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await adminApi.getTemplates();

      expect(mockClient.get).toHaveBeenCalledWith('/templates');
      expect(result).toEqual(mockResponse);
    });

    it('should handle empty template list', async () => {
      const mockResponse: TemplateListResponse = {
        templates: [],
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await adminApi.getTemplates();

      expect(result).toEqual(mockResponse);
    });

    it('should handle forbidden error', async () => {
      const error = new Error('Forbidden - admin scope required');
      mockClient.get.mockRejectedValue(error);

      await expect(adminApi.getTemplates()).rejects.toThrow(
        'Forbidden - admin scope required'
      );
    });

    it('should handle network error', async () => {
      const error = new Error('Network error');
      mockClient.get.mockRejectedValue(error);

      await expect(adminApi.getTemplates()).rejects.toThrow('Network error');
    });
  });
});
