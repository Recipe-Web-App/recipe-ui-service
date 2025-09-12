import { recipeScraperClient, handleRecipeScraperApiError } from './client';

export const adminApi = {
  /**
   * Clear the service cache
   * POST /api/recipe-scraper/admin/clear-cache
   */
  async clearCache(): Promise<{
    message: string;
    success: boolean;
  }> {
    try {
      const response = await recipeScraperClient.post(
        '/api/recipe-scraper/admin/clear-cache'
      );
      return response.data as {
        message: string;
        success: boolean;
      };
    } catch (error) {
      handleRecipeScraperApiError(error);
      throw error;
    }
  },
};
