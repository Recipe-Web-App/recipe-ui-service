import { systemNotificationsApi } from '@/lib/api/notification/system-notifications';
import { notificationClient } from '@/lib/api/notification/client';
import type { BatchNotificationResponse } from '@/types/notification';

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
}));

const mockClient = notificationClient as jest.Mocked<typeof notificationClient>;

describe('System Notifications API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('notifyPasswordReset', () => {
    it('should send password reset notification', async () => {
      const mockResponse: BatchNotificationResponse = {
        message: 'Notification queued',
        notifications: [{ notification_id: 'notif-1', recipient_id: 'user-1' }],
        queued_count: 1,
      };

      mockClient.post.mockResolvedValue({ data: mockResponse });

      const result = await systemNotificationsApi.notifyPasswordReset({
        recipient_ids: ['user-1'],
        reset_token: 'secure-reset-token-12345',
        expiry_hours: 24,
      });

      expect(mockClient.post).toHaveBeenCalledWith(
        '/notifications/password-reset',
        {
          recipient_ids: ['user-1'],
          reset_token: 'secure-reset-token-12345',
          expiry_hours: 24,
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle user not found error', async () => {
      const error = new Error('User not found');
      mockClient.post.mockRejectedValue(error);

      await expect(
        systemNotificationsApi.notifyPasswordReset({
          recipient_ids: ['invalid-user'],
          reset_token: 'secure-reset-token-12345',
          expiry_hours: 24,
        })
      ).rejects.toThrow('User not found');
    });

    it('should handle forbidden error', async () => {
      const error = new Error('Forbidden - admin scope required');
      mockClient.post.mockRejectedValue(error);

      await expect(
        systemNotificationsApi.notifyPasswordReset({
          recipient_ids: ['user-1'],
          reset_token: 'secure-reset-token-12345',
          expiry_hours: 24,
        })
      ).rejects.toThrow('Forbidden - admin scope required');
    });
  });

  describe('notifyWelcome', () => {
    it('should send welcome notification', async () => {
      const mockResponse: BatchNotificationResponse = {
        message: 'Notification queued',
        notifications: [
          { notification_id: 'notif-1', recipient_id: 'new-user-1' },
        ],
        queued_count: 1,
      };

      mockClient.post.mockResolvedValue({ data: mockResponse });

      const result = await systemNotificationsApi.notifyWelcome({
        recipient_ids: ['new-user-1'],
      });

      expect(mockClient.post).toHaveBeenCalledWith('/notifications/welcome', {
        recipient_ids: ['new-user-1'],
      });
      expect(result).toEqual(mockResponse);
    });

    it('should handle network error', async () => {
      const error = new Error('Network error');
      mockClient.post.mockRejectedValue(error);

      await expect(
        systemNotificationsApi.notifyWelcome({
          recipient_ids: ['new-user-1'],
        })
      ).rejects.toThrow('Network error');
    });
  });

  describe('notifyEmailChanged', () => {
    it('should send email changed notification', async () => {
      const mockResponse: BatchNotificationResponse = {
        message: 'Notification queued',
        notifications: [{ notification_id: 'notif-1', recipient_id: 'user-1' }],
        queued_count: 1,
      };

      mockClient.post.mockResolvedValue({ data: mockResponse });

      const result = await systemNotificationsApi.notifyEmailChanged({
        recipient_ids: ['user-1'],
        old_email: 'old@example.com',
        new_email: 'new@example.com',
      });

      expect(mockClient.post).toHaveBeenCalledWith(
        '/notifications/email-changed',
        {
          recipient_ids: ['user-1'],
          old_email: 'old@example.com',
          new_email: 'new@example.com',
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle validation error', async () => {
      const error = new Error('Invalid email format');
      mockClient.post.mockRejectedValue(error);

      await expect(
        systemNotificationsApi.notifyEmailChanged({
          recipient_ids: ['user-1'],
          old_email: 'invalid',
          new_email: 'new@example.com',
        })
      ).rejects.toThrow('Invalid email format');
    });

    it('should handle server error', async () => {
      const error = new Error('Internal server error');
      mockClient.post.mockRejectedValue(error);

      await expect(
        systemNotificationsApi.notifyEmailChanged({
          recipient_ids: ['user-1'],
          old_email: 'old@example.com',
          new_email: 'new@example.com',
        })
      ).rejects.toThrow('Internal server error');
    });
  });

  describe('notifyPasswordChanged', () => {
    it('should send password changed notification', async () => {
      const mockResponse: BatchNotificationResponse = {
        message: 'Notification queued',
        notifications: [{ notification_id: 'notif-1', recipient_id: 'user-1' }],
        queued_count: 1,
      };

      mockClient.post.mockResolvedValue({ data: mockResponse });

      const result = await systemNotificationsApi.notifyPasswordChanged({
        recipient_ids: ['user-1'],
      });

      expect(mockClient.post).toHaveBeenCalledWith(
        '/notifications/password-changed',
        { recipient_ids: ['user-1'] }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle forbidden error', async () => {
      const error = new Error('Forbidden');
      mockClient.post.mockRejectedValue(error);

      await expect(
        systemNotificationsApi.notifyPasswordChanged({
          recipient_ids: ['user-1'],
        })
      ).rejects.toThrow('Forbidden');
    });
  });

  describe('notifyMaintenance', () => {
    it('should send maintenance notification to all users', async () => {
      const mockResponse: BatchNotificationResponse = {
        message: 'Notifications queued',
        notifications: [
          { notification_id: 'notif-1', recipient_id: 'user-1' },
          { notification_id: 'notif-2', recipient_id: 'user-2' },
          { notification_id: 'notif-3', recipient_id: 'user-3' },
        ],
        queued_count: 3,
      };

      mockClient.post.mockResolvedValue({ data: mockResponse });

      const result = await systemNotificationsApi.notifyMaintenance({
        maintenance_start: '2025-11-01T00:00:00Z',
        maintenance_end: '2025-11-01T04:00:00Z',
        description: 'Scheduled database maintenance',
      });

      expect(mockClient.post).toHaveBeenCalledWith(
        '/notifications/maintenance',
        {
          maintenance_start: '2025-11-01T00:00:00Z',
          maintenance_end: '2025-11-01T04:00:00Z',
          description: 'Scheduled database maintenance',
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should send maintenance notification to admins only', async () => {
      const mockResponse: BatchNotificationResponse = {
        message: 'Notification queued',
        notifications: [
          { notification_id: 'notif-1', recipient_id: 'admin-1' },
        ],
        queued_count: 1,
      };

      mockClient.post.mockResolvedValue({ data: mockResponse });

      const result = await systemNotificationsApi.notifyMaintenance({
        maintenance_start: '2025-11-01T00:00:00Z',
        maintenance_end: '2025-11-01T04:00:00Z',
        description: 'Scheduled database maintenance',
        adminOnly: true,
      });

      expect(mockClient.post).toHaveBeenCalledWith(
        '/notifications/maintenance',
        {
          maintenance_start: '2025-11-01T00:00:00Z',
          maintenance_end: '2025-11-01T04:00:00Z',
          description: 'Scheduled database maintenance',
          adminOnly: true,
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle admin scope required error', async () => {
      const error = new Error('Forbidden - admin scope required');
      mockClient.post.mockRejectedValue(error);

      await expect(
        systemNotificationsApi.notifyMaintenance({
          maintenance_start: '2025-11-01T00:00:00Z',
          maintenance_end: '2025-11-01T04:00:00Z',
          description: 'Scheduled database maintenance',
        })
      ).rejects.toThrow('Forbidden - admin scope required');
    });

    it('should handle network error', async () => {
      const error = new Error('Network error');
      mockClient.post.mockRejectedValue(error);

      await expect(
        systemNotificationsApi.notifyMaintenance({
          maintenance_start: '2025-11-01T00:00:00Z',
          maintenance_end: '2025-11-01T04:00:00Z',
          description: 'Scheduled database maintenance',
        })
      ).rejects.toThrow('Network error');
    });
  });
});
