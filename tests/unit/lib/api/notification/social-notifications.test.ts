import { socialNotificationsApi } from '@/lib/api/notification/social-notifications';
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

describe('Social Notifications API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('notifyNewFollower', () => {
    it('should send new follower notification', async () => {
      const mockResponse: BatchNotificationResponse = {
        message: 'Notification queued',
        notifications: [{ notification_id: 'notif-1', recipient_id: 'user-1' }],
        queued_count: 1,
      };

      mockClient.post.mockResolvedValue({ data: mockResponse });

      const result = await socialNotificationsApi.notifyNewFollower({
        recipient_ids: ['user-1'],
        follower_id: 'user-2',
      });

      expect(mockClient.post).toHaveBeenCalledWith(
        '/notifications/new-follower',
        {
          recipient_ids: ['user-1'],
          follower_id: 'user-2',
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle user not found error', async () => {
      const error = new Error('User not found');
      mockClient.post.mockRejectedValue(error);

      await expect(
        socialNotificationsApi.notifyNewFollower({
          recipient_ids: ['invalid-user'],
          follower_id: 'user-2',
        })
      ).rejects.toThrow('User not found');
    });

    it('should handle forbidden error', async () => {
      const error = new Error('Forbidden - admin scope required');
      mockClient.post.mockRejectedValue(error);

      await expect(
        socialNotificationsApi.notifyNewFollower({
          recipient_ids: ['user-1'],
          follower_id: 'user-2',
        })
      ).rejects.toThrow('Forbidden - admin scope required');
    });
  });

  describe('notifyMention', () => {
    it('should send mention notification', async () => {
      const mockResponse: BatchNotificationResponse = {
        message: 'Notifications queued',
        notifications: [
          { notification_id: 'notif-1', recipient_id: 'user-1' },
          { notification_id: 'notif-2', recipient_id: 'user-2' },
        ],
        queued_count: 2,
      };

      mockClient.post.mockResolvedValue({ data: mockResponse });

      const result = await socialNotificationsApi.notifyMention({
        recipient_ids: ['user-1', 'user-2'],
        comment_id: 789,
      });

      expect(mockClient.post).toHaveBeenCalledWith('/notifications/mention', {
        recipient_ids: ['user-1', 'user-2'],
        comment_id: 789,
      });
      expect(result).toEqual(mockResponse);
    });

    it('should handle comment not found error', async () => {
      const error = new Error('Comment not found');
      mockClient.post.mockRejectedValue(error);

      await expect(
        socialNotificationsApi.notifyMention({
          recipient_ids: ['user-1'],
          comment_id: 999,
        })
      ).rejects.toThrow('Comment not found');
    });
  });

  describe('shareRecipe', () => {
    it('should share recipe with users', async () => {
      const mockResponse: BatchNotificationResponse = {
        message: 'Notifications queued',
        notifications: [
          { notification_id: 'notif-1', recipient_id: 'user-1' },
          { notification_id: 'notif-2', recipient_id: 'user-2' },
          { notification_id: 'notif-3', recipient_id: 'author-1' },
        ],
        queued_count: 3,
      };

      mockClient.post.mockResolvedValue({ data: mockResponse });

      const result = await socialNotificationsApi.shareRecipe({
        recipient_ids: ['user-1', 'user-2'],
        recipe_id: 123,
        sharer_id: 'sharer-1',
        share_message: 'Check out this recipe!',
      });

      expect(mockClient.post).toHaveBeenCalledWith(
        '/notifications/share-recipe',
        {
          recipient_ids: ['user-1', 'user-2'],
          recipe_id: 123,
          sharer_id: 'sharer-1',
          share_message: 'Check out this recipe!',
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should share recipe without message', async () => {
      const mockResponse: BatchNotificationResponse = {
        message: 'Notifications queued',
        notifications: [
          { notification_id: 'notif-1', recipient_id: 'user-1' },
          { notification_id: 'notif-2', recipient_id: 'author-1' },
        ],
        queued_count: 2,
      };

      mockClient.post.mockResolvedValue({ data: mockResponse });

      const result = await socialNotificationsApi.shareRecipe({
        recipient_ids: ['user-1'],
        recipe_id: 123,
        sharer_id: 'sharer-1',
      });

      expect(mockClient.post).toHaveBeenCalledWith(
        '/notifications/share-recipe',
        {
          recipient_ids: ['user-1'],
          recipe_id: 123,
          sharer_id: 'sharer-1',
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle recipe not found error', async () => {
      const error = new Error('Recipe not found');
      mockClient.post.mockRejectedValue(error);

      await expect(
        socialNotificationsApi.shareRecipe({
          recipient_ids: ['user-1'],
          recipe_id: 999,
          sharer_id: 'sharer-1',
        })
      ).rejects.toThrow('Recipe not found');
    });
  });

  describe('notifyRecipeCollected', () => {
    it('should send recipe collected notification', async () => {
      const mockResponse: BatchNotificationResponse = {
        message: 'Notification queued',
        notifications: [
          { notification_id: 'notif-1', recipient_id: 'author-1' },
        ],
        queued_count: 1,
      };

      mockClient.post.mockResolvedValue({ data: mockResponse });

      const result = await socialNotificationsApi.notifyRecipeCollected({
        recipient_ids: ['author-1'],
        recipe_id: 123,
        collector_id: 'user-2',
        collection_id: 456,
      });

      expect(mockClient.post).toHaveBeenCalledWith(
        '/notifications/recipe-collected',
        {
          recipient_ids: ['author-1'],
          recipe_id: 123,
          collector_id: 'user-2',
          collection_id: 456,
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle collection not found error', async () => {
      const error = new Error('Collection not found');
      mockClient.post.mockRejectedValue(error);

      await expect(
        socialNotificationsApi.notifyRecipeCollected({
          recipient_ids: ['author-1'],
          recipe_id: 123,
          collector_id: 'user-2',
          collection_id: 999,
        })
      ).rejects.toThrow('Collection not found');
    });

    it('should handle network error', async () => {
      const error = new Error('Network error');
      mockClient.post.mockRejectedValue(error);

      await expect(
        socialNotificationsApi.notifyRecipeCollected({
          recipient_ids: ['author-1'],
          recipe_id: 123,
          collector_id: 'user-2',
          collection_id: 456,
        })
      ).rejects.toThrow('Network error');
    });
  });
});
