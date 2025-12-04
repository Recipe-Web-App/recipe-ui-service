import { recipeScraperClient, handleRecipeScraperApiError } from './client';

export const adminApi = {
  /**
   * Clear the service cache
   * POST /admin/clear-cache
   */
  async clearCache(): Promise<{
    message: string;
    success: boolean;
  }> {
    try {
      const response = await recipeScraperClient.post('/admin/clear-cache');
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
