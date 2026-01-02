import { recipeNotificationsApi } from '@/lib/api/notification/recipe-notifications';
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

describe('Recipe Notifications API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('notifyRecipePublished', () => {
    it('should send recipe published notification', async () => {
      const mockResponse: BatchNotificationResponse = {
        message: 'Notifications queued',
        notifications: [
          { notification_id: 'notif-1', recipient_id: 'user-1' },
          { notification_id: 'notif-2', recipient_id: 'user-2' },
        ],
        queued_count: 2,
      };

      mockClient.post.mockResolvedValue({ data: mockResponse });

      const result = await recipeNotificationsApi.notifyRecipePublished({
        recipient_ids: ['user-1', 'user-2'],
        recipe_id: 123,
      });

      expect(mockClient.post).toHaveBeenCalledWith(
        '/notifications/recipe-published',
        { recipient_ids: ['user-1', 'user-2'], recipe_id: 123 }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle validation error', async () => {
      const error = new Error('Recipe not found');
      mockClient.post.mockRejectedValue(error);

      await expect(
        recipeNotificationsApi.notifyRecipePublished({
          recipient_ids: ['user-1'],
          recipe_id: 999,
        })
      ).rejects.toThrow('Recipe not found');
    });

    it('should handle network error', async () => {
      const error = new Error('Network error');
      mockClient.post.mockRejectedValue(error);

      await expect(
        recipeNotificationsApi.notifyRecipePublished({
          recipient_ids: ['user-1'],
          recipe_id: 123,
        })
      ).rejects.toThrow('Network error');
    });
  });

  describe('notifyRecipeLiked', () => {
    it('should send recipe liked notification', async () => {
      const mockResponse: BatchNotificationResponse = {
        message: 'Notification queued',
        notifications: [
          { notification_id: 'notif-1', recipient_id: 'author-1' },
        ],
        queued_count: 1,
      };

      mockClient.post.mockResolvedValue({ data: mockResponse });

      const result = await recipeNotificationsApi.notifyRecipeLiked({
        recipient_ids: ['author-1'],
        recipe_id: 123,
        liker_id: 'user-2',
      });

      expect(mockClient.post).toHaveBeenCalledWith(
        '/notifications/recipe-liked',
        {
          recipient_ids: ['author-1'],
          recipe_id: 123,
          liker_id: 'user-2',
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle forbidden error', async () => {
      const error = new Error('Forbidden');
      mockClient.post.mockRejectedValue(error);

      await expect(
        recipeNotificationsApi.notifyRecipeLiked({
          recipient_ids: ['author-1'],
          recipe_id: 123,
          liker_id: 'user-2',
        })
      ).rejects.toThrow('Forbidden');
    });
  });

  describe('notifyRecipeCommented', () => {
    it('should send recipe commented notification', async () => {
      const mockResponse: BatchNotificationResponse = {
        message: 'Notification queued',
        notifications: [
          { notification_id: 'notif-1', recipient_id: 'author-1' },
        ],
        queued_count: 1,
      };

      mockClient.post.mockResolvedValue({ data: mockResponse });

      const result = await recipeNotificationsApi.notifyRecipeCommented({
        recipient_ids: ['author-1'],
        comment_id: 456,
      });

      expect(mockClient.post).toHaveBeenCalledWith(
        '/notifications/recipe-commented',
        {
          recipient_ids: ['author-1'],
          comment_id: 456,
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle comment not found error', async () => {
      const error = new Error('Comment not found');
      mockClient.post.mockRejectedValue(error);

      await expect(
        recipeNotificationsApi.notifyRecipeCommented({
          recipient_ids: ['author-1'],
          comment_id: 999,
        })
      ).rejects.toThrow('Comment not found');
    });

    it('should handle server error', async () => {
      const error = new Error('Internal server error');
      mockClient.post.mockRejectedValue(error);

      await expect(
        recipeNotificationsApi.notifyRecipeCommented({
          recipient_ids: ['author-1'],
          comment_id: 456,
        })
      ).rejects.toThrow('Internal server error');
    });
  });
});
