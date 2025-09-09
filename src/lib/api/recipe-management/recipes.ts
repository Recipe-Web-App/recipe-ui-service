import {
  recipeManagementClient,
  handleRecipeManagementApiError,
  buildQueryParams,
  type PaginationParams,
} from './client';
import type {
  RecipeDto,
  CreateRecipeRequest,
  UpdateRecipeRequest,
  SearchRecipesResponse,
} from '@/types/recipe-management';

export const recipesApi = {
  /**
   * Get all recipes with pagination
   * GET /recipes
   */
  async getAllRecipes(
    params?: PaginationParams
  ): Promise<SearchRecipesResponse> {
    try {
      const queryString = params ? buildQueryParams(params) : '';
      const response = await recipeManagementClient.get(
        `/recipes${queryString ? `?${queryString}` : ''}`
      );
      return response.data as SearchRecipesResponse;
    } catch (error) {
      handleRecipeManagementApiError(error);
      throw error;
    }
  },

  /**
   * Create new recipe
   * POST /recipes
   */
  async createRecipe(data: CreateRecipeRequest): Promise<RecipeDto> {
    try {
      const response = await recipeManagementClient.post('/recipes', data);
      return response.data as RecipeDto;
    } catch (error) {
      handleRecipeManagementApiError(error);
      throw error;
    }
  },

  /**
   * Get recipe by ID
   * GET /recipes/{recipeId}
   */
  async getRecipeById(recipeId: number): Promise<RecipeDto> {
    try {
      const response = await recipeManagementClient.get(`/recipes/${recipeId}`);
      return response.data as RecipeDto;
    } catch (error) {
      handleRecipeManagementApiError(error);
      throw error;
    }
  },

  /**
   * Update recipe
   * PUT /recipes/{recipeId}
   */
  async updateRecipe(
    recipeId: number,
    data: UpdateRecipeRequest
  ): Promise<RecipeDto> {
    try {
      const response = await recipeManagementClient.put(
        `/recipes/${recipeId}`,
        data
      );
      return response.data as RecipeDto;
    } catch (error) {
      handleRecipeManagementApiError(error);
      throw error;
    }
  },

  /**
   * Delete recipe
   * DELETE /recipes/{recipeId}
   */
  async deleteRecipe(recipeId: number): Promise<void> {
    try {
      await recipeManagementClient.delete(`/recipes/${recipeId}`);
    } catch (error) {
      handleRecipeManagementApiError(error);
      throw error;
    }
  },

  /**
   * Get recipe description
   * GET /recipes/{recipeId}/description
   */
  async getRecipeDescription(recipeId: number): Promise<string> {
    try {
      const response = await recipeManagementClient.get(
        `/recipes/${recipeId}/description`
      );
      return response.data as string;
    } catch (error) {
      handleRecipeManagementApiError(error);
      throw error;
    }
  },

  /**
   * Get recipe history
   * GET /recipes/{recipeId}/history
   */
  async getRecipeHistory(recipeId: number): Promise<string> {
    try {
      const response = await recipeManagementClient.get(
        `/recipes/${recipeId}/history`
      );
      return response.data as string;
    } catch (error) {
      handleRecipeManagementApiError(error);
      throw error;
    }
  },
};
