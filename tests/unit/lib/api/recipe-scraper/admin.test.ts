import { adminApi } from '@/lib/api/recipe-scraper/admin';
import { RecipeScraperApiError } from '@/lib/api/recipe-scraper/client';

// Mock the client
jest.mock('@/lib/api/recipe-scraper/client', () => {
  const originalModule = jest.requireActual('@/lib/api/recipe-scraper/client');
  return {
    ...originalModule,
    recipeScraperClient: {
      delete: jest.fn(),
    },
    handleRecipeScraperApiError: jest
      .fn()
      .mockImplementation((error: unknown) => {
        if (error instanceof Error) {
          throw new originalModule.RecipeScraperApiError(error.message, 500);
        }
        throw new originalModule.RecipeScraperApiError('Unknown error', 500);
      }),
  };
});

const mockClient =
  require('@/lib/api/recipe-scraper/client').recipeScraperClient;

describe('Recipe Scraper Admin API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('clearCache', () => {
    it('should clear cache successfully', async () => {
      const mockResponse = {
        message: 'Cache cleared successfully',
      };

      mockClient.delete.mockResolvedValue({ data: mockResponse });

      const result = await adminApi.clearCache();

      expect(mockClient.delete).toHaveBeenCalledWith('/admin/cache');
      expect(result).toEqual(mockResponse);
      expect(result.message).toBe('Cache cleared successfully');
    });

    it('should handle successful cache clear with different message', async () => {
      const mockResponse = {
        message: 'All caches have been invalidated and cleared',
      };

      mockClient.delete.mockResolvedValue({ data: mockResponse });

      const result = await adminApi.clearCache();

      expect(result.message).toBe(
        'All caches have been invalidated and cleared'
      );
    });

    it('should handle cache clear failure', async () => {
      const mockResponse = {
        message: 'Failed to clear some cache entries',
      };

      mockClient.delete.mockResolvedValue({ data: mockResponse });

      const result = await adminApi.clearCache();

      expect(result.message).toBe('Failed to clear some cache entries');
    });

    it('should handle unauthorized access', async () => {
      mockClient.delete.mockRejectedValue(
        new Error('Unauthorized: Admin access required')
      );

      await expect(adminApi.clearCache()).rejects.toThrow(
        'Unauthorized: Admin access required'
      );
      expect(mockClient.delete).toHaveBeenCalledWith('/admin/cache');
    });

    it('should handle forbidden access', async () => {
      mockClient.delete.mockRejectedValue(
        new Error('Forbidden: Insufficient permissions')
      );

      await expect(adminApi.clearCache()).rejects.toThrow(
        'Forbidden: Insufficient permissions'
      );
    });

    it('should handle service unavailable error', async () => {
      mockClient.delete.mockRejectedValue(
        new Error('Service temporarily unavailable')
      );

      await expect(adminApi.clearCache()).rejects.toThrow(
        'Service temporarily unavailable'
      );
    });

    it('should handle internal server error', async () => {
      mockClient.delete.mockRejectedValue(
        new Error('Internal server error during cache operation')
      );

      await expect(adminApi.clearCache()).rejects.toThrow(
        'Internal server error during cache operation'
      );
    });

    it('should handle network timeout', async () => {
      mockClient.delete.mockRejectedValue(new Error('Request timeout'));

      await expect(adminApi.clearCache()).rejects.toThrow('Request timeout');
    });

    it('should handle unknown error', async () => {
      mockClient.delete.mockRejectedValue(new Error('Unknown error occurred'));

      await expect(adminApi.clearCache()).rejects.toThrow(
        'Unknown error occurred'
      );
    });

    it('should handle successful response with additional metadata', async () => {
      const mockResponse = {
        message: 'Cache cleared: 1,247 entries removed',
      };

      mockClient.delete.mockResolvedValue({ data: mockResponse });

      const result = await adminApi.clearCache();

      expect(result.message).toContain('1,247 entries');
    });

    it('should handle partial success response', async () => {
      const mockResponse = {
        message: 'Cache partially cleared: some entries could not be removed',
      };

      mockClient.delete.mockResolvedValue({ data: mockResponse });

      const result = await adminApi.clearCache();

      expect(result.message).toContain('partially cleared');
    });
  });
});
