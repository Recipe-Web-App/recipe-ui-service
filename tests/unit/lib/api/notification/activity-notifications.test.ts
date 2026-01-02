import { activityNotificationsApi } from '@/lib/api/notification/activity-notifications';
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

describe('Activity Notifications API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('notifyRecipeRated', () => {
    it('should send recipe rated notification', async () => {
      const mockResponse: BatchNotificationResponse = {
        message: 'Notification queued',
        notifications: [
          { notification_id: 'notif-1', recipient_id: 'author-1' },
        ],
        queued_count: 1,
      };

      mockClient.post.mockResolvedValue({ data: mockResponse });

      const result = await activityNotificationsApi.notifyRecipeRated({
        recipient_ids: ['author-1'],
        recipe_id: 123,
        rater_id: 'user-2',
      });

      expect(mockClient.post).toHaveBeenCalledWith(
        '/notifications/recipe-rated',
        {
          recipient_ids: ['author-1'],
          recipe_id: 123,
          rater_id: 'user-2',
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle recipe not found error', async () => {
      const error = new Error('Recipe not found');
      mockClient.post.mockRejectedValue(error);

      await expect(
        activityNotificationsApi.notifyRecipeRated({
          recipient_ids: ['author-1'],
          recipe_id: 999,
          rater_id: 'user-2',
        })
      ).rejects.toThrow('Recipe not found');
    });

    it('should handle forbidden error', async () => {
      const error = new Error('Forbidden');
      mockClient.post.mockRejectedValue(error);

      await expect(
        activityNotificationsApi.notifyRecipeRated({
          recipient_ids: ['author-1'],
          recipe_id: 123,
          rater_id: 'user-2',
        })
      ).rejects.toThrow('Forbidden');
    });
  });

  describe('notifyRecipeFeatured', () => {
    it('should send recipe featured notification', async () => {
      const mockResponse: BatchNotificationResponse = {
        message: 'Notification queued',
        notifications: [
          { notification_id: 'notif-1', recipient_id: 'author-1' },
        ],
        queued_count: 1,
      };

      mockClient.post.mockResolvedValue({ data: mockResponse });

      const result = await activityNotificationsApi.notifyRecipeFeatured({
        recipient_ids: ['author-1'],
        recipe_id: 123,
        featured_reason: 'Top rated this week',
      });

      expect(mockClient.post).toHaveBeenCalledWith(
        '/notifications/recipe-featured',
        {
          recipient_ids: ['author-1'],
          recipe_id: 123,
          featured_reason: 'Top rated this week',
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should send notification without reason', async () => {
      const mockResponse: BatchNotificationResponse = {
        message: 'Notification queued',
        notifications: [
          { notification_id: 'notif-1', recipient_id: 'author-1' },
        ],
        queued_count: 1,
      };

      mockClient.post.mockResolvedValue({ data: mockResponse });

      const result = await activityNotificationsApi.notifyRecipeFeatured({
        recipient_ids: ['author-1'],
        recipe_id: 123,
      });

      expect(mockClient.post).toHaveBeenCalledWith(
        '/notifications/recipe-featured',
        {
          recipient_ids: ['author-1'],
          recipe_id: 123,
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle admin scope required error', async () => {
      const error = new Error('Forbidden - admin scope required');
      mockClient.post.mockRejectedValue(error);

      await expect(
        activityNotificationsApi.notifyRecipeFeatured({
          recipient_ids: ['author-1'],
          recipe_id: 123,
        })
      ).rejects.toThrow('Forbidden - admin scope required');
    });
  });

  describe('notifyRecipeTrending', () => {
    it('should send recipe trending notification', async () => {
      const mockResponse: BatchNotificationResponse = {
        message: 'Notification queued',
        notifications: [
          { notification_id: 'notif-1', recipient_id: 'author-1' },
        ],
        queued_count: 1,
      };

      mockClient.post.mockResolvedValue({ data: mockResponse });

      const result = await activityNotificationsApi.notifyRecipeTrending({
        recipient_ids: ['author-1'],
        recipe_id: 123,
        trending_metrics: '500 views in 24 hours',
      });

      expect(mockClient.post).toHaveBeenCalledWith(
        '/notifications/recipe-trending',
        {
          recipient_ids: ['author-1'],
          recipe_id: 123,
          trending_metrics: '500 views in 24 hours',
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should send notification without metrics', async () => {
      const mockResponse: BatchNotificationResponse = {
        message: 'Notification queued',
        notifications: [
          { notification_id: 'notif-1', recipient_id: 'author-1' },
        ],
        queued_count: 1,
      };

      mockClient.post.mockResolvedValue({ data: mockResponse });

      const result = await activityNotificationsApi.notifyRecipeTrending({
        recipient_ids: ['author-1'],
        recipe_id: 123,
      });

      expect(mockClient.post).toHaveBeenCalledWith(
        '/notifications/recipe-trending',
        {
          recipient_ids: ['author-1'],
          recipe_id: 123,
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle network error', async () => {
      const error = new Error('Network error');
      mockClient.post.mockRejectedValue(error);

      await expect(
        activityNotificationsApi.notifyRecipeTrending({
          recipient_ids: ['author-1'],
          recipe_id: 123,
        })
      ).rejects.toThrow('Network error');
    });

    it('should handle server error', async () => {
      const error = new Error('Internal server error');
      mockClient.post.mockRejectedValue(error);

      await expect(
        activityNotificationsApi.notifyRecipeTrending({
          recipient_ids: ['author-1'],
          recipe_id: 123,
        })
      ).rejects.toThrow('Internal server error');
    });
  });
});
