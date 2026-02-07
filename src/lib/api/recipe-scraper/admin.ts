import { recipeScraperClient, handleRecipeScraperApiError } from './client';

export const adminApi = {
  /**
   * Clear the service cache
   * DELETE /admin/cache
   */
  async clearCache(): Promise<{
    message: string;
  }> {
    try {
      const response = await recipeScraperClient.delete('/admin/cache');
      return response.data as {
        message: string;
      };
    } catch (error) {
      handleRecipeScraperApiError(error);
      throw error;
    }
  },
};
