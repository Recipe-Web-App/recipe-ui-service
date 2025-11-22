import { shareApi } from '@/lib/api/notification/share';
import { notificationClient } from '@/lib/api/notification/client';
import type {
  ShareRecipeRequest,
  BatchNotificationResponse,
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
}));

const mockClient = notificationClient as jest.Mocked<typeof notificationClient>;

describe('Share API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('shareRecipe', () => {
    it('should share recipe successfully', async () => {
      const shareRequest: ShareRecipeRequest = {
        recipient_ids: [
          '550e8400-e29b-41d4-a716-446655440001',
          '550e8400-e29b-41d4-a716-446655440002',
        ],
        recipe_id: 123,
        sharer_id: '550e8400-e29b-41d4-a716-446655440003',
        share_message: 'Check out this amazing recipe!',
      };

      const mockResponse: BatchNotificationResponse = {
        notifications: [
          {
            notification_id: '770e8400-e29b-41d4-a716-446655440111',
            recipient_id: '550e8400-e29b-41d4-a716-446655440001',
          },
          {
            notification_id: '770e8400-e29b-41d4-a716-446655440112',
            recipient_id: '550e8400-e29b-41d4-a716-446655440002',
          },
          {
            notification_id: '770e8400-e29b-41d4-a716-446655440113',
            recipient_id: '660e8400-e29b-41d4-a716-446655440099',
          },
        ],
        queued_count: 3,
        message: 'Notifications queued successfully',
      };

      mockClient.post.mockResolvedValue({ data: mockResponse });

      const result = await shareApi.shareRecipe(shareRequest);

      expect(mockClient.post).toHaveBeenCalledWith(
        '/notifications/share-recipe',
        shareRequest
      );
      expect(result).toEqual(mockResponse);
    });

    it('should share recipe without optional fields', async () => {
      const shareRequest: ShareRecipeRequest = {
        recipient_ids: ['550e8400-e29b-41d4-a716-446655440001'],
        recipe_id: 456,
      };

      const mockResponse: BatchNotificationResponse = {
        notifications: [
          {
            notification_id: '770e8400-e29b-41d4-a716-446655440114',
            recipient_id: '550e8400-e29b-41d4-a716-446655440001',
          },
        ],
        queued_count: 1,
        message: 'Notification queued successfully',
      };

      mockClient.post.mockResolvedValue({ data: mockResponse });

      const result = await shareApi.shareRecipe(shareRequest);

      expect(mockClient.post).toHaveBeenCalledWith(
        '/notifications/share-recipe',
        shareRequest
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle single recipient', async () => {
      const shareRequest: ShareRecipeRequest = {
        recipient_ids: ['550e8400-e29b-41d4-a716-446655440001'],
        recipe_id: 789,
        sharer_id: '550e8400-e29b-41d4-a716-446655440005',
      };

      const mockResponse: BatchNotificationResponse = {
        notifications: [
          {
            notification_id: '770e8400-e29b-41d4-a716-446655440115',
            recipient_id: '550e8400-e29b-41d4-a716-446655440001',
          },
          {
            notification_id: '770e8400-e29b-41d4-a716-446655440116',
            recipient_id: 'author-uuid',
          },
        ],
        queued_count: 2,
        message: 'Notifications queued successfully',
      };

      mockClient.post.mockResolvedValue({ data: mockResponse });

      const result = await shareApi.shareRecipe(shareRequest);

      expect(mockClient.post).toHaveBeenCalledWith(
        '/notifications/share-recipe',
        shareRequest
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle share recipe with max recipients', async () => {
      const recipientIds = Array.from(
        { length: 100 },
        (_, i) =>
          `550e8400-e29b-41d4-a716-4466554400${String(i).padStart(2, '0')}`
      );

      const shareRequest: ShareRecipeRequest = {
        recipient_ids: recipientIds,
        recipe_id: 999,
      };

      const mockResponse: BatchNotificationResponse = {
        notifications: recipientIds.map((id, index) => ({
          notification_id: `notification-${index}`,
          recipient_id: id,
        })),
        queued_count: 100,
        message: 'Notifications queued successfully',
      };

      mockClient.post.mockResolvedValue({ data: mockResponse });

      const result = await shareApi.shareRecipe(shareRequest);

      expect(mockClient.post).toHaveBeenCalledWith(
        '/notifications/share-recipe',
        shareRequest
      );
      expect(result).toEqual(mockResponse);
      expect(result.queued_count).toBe(100);
    });

    it('should handle 400 bad request error', async () => {
      const shareRequest: ShareRecipeRequest = {
        recipient_ids: [],
        recipe_id: 123,
      };

      const error = new Error('Invalid request parameters');
      mockClient.post.mockRejectedValue(error);

      await expect(shareApi.shareRecipe(shareRequest)).rejects.toThrow(
        'Invalid request parameters'
      );
      expect(mockClient.post).toHaveBeenCalledWith(
        '/notifications/share-recipe',
        shareRequest
      );
    });

    it('should handle 403 forbidden error', async () => {
      const shareRequest: ShareRecipeRequest = {
        recipient_ids: ['550e8400-e29b-41d4-a716-446655440001'],
        recipe_id: 123,
      };

      const error = new Error(
        'You do not have permission to perform this action'
      );
      mockClient.post.mockRejectedValue(error);

      await expect(shareApi.shareRecipe(shareRequest)).rejects.toThrow(
        'You do not have permission to perform this action'
      );
    });

    it('should handle 404 recipe not found error', async () => {
      const shareRequest: ShareRecipeRequest = {
        recipient_ids: ['550e8400-e29b-41d4-a716-446655440001'],
        recipe_id: 99999,
      };

      const error = new Error('Recipe not found');
      mockClient.post.mockRejectedValue(error);

      await expect(shareApi.shareRecipe(shareRequest)).rejects.toThrow(
        'Recipe not found'
      );
    });

    it('should handle 429 rate limit error', async () => {
      const shareRequest: ShareRecipeRequest = {
        recipient_ids: ['550e8400-e29b-41d4-a716-446655440001'],
        recipe_id: 123,
      };

      const error = new Error('Rate limit exceeded. Please try again later.');
      mockClient.post.mockRejectedValue(error);

      await expect(shareApi.shareRecipe(shareRequest)).rejects.toThrow(
        'Rate limit exceeded. Please try again later.'
      );
    });

    it('should handle network error', async () => {
      const shareRequest: ShareRecipeRequest = {
        recipient_ids: ['550e8400-e29b-41d4-a716-446655440001'],
        recipe_id: 123,
      };

      const error = new Error('Network Error');
      mockClient.post.mockRejectedValue(error);

      await expect(shareApi.shareRecipe(shareRequest)).rejects.toThrow(
        'Network Error'
      );
    });
  });
});
