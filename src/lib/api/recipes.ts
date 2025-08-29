import { apiClient, handleApiError } from './client';
import { Recipe, ApiResponse, PaginatedResponse } from '@/types';
import { API_ROUTES } from '@/constants';

export interface GetRecipesParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface CreateRecipeData {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  cookingTime: number;
  servings: number;
  imageUrl?: string;
}

export const recipesApi = {
  async getRecipes(
    params: GetRecipesParams = {}
  ): Promise<PaginatedResponse<Recipe[]>> {
    try {
      const response = await apiClient.get(API_ROUTES.RECIPES, { params });
      return response.data as PaginatedResponse<Recipe[]>;
    } catch (error) {
      return handleApiError(error);
    }
  },

  async getRecipeById(id: string): Promise<ApiResponse<Recipe>> {
    try {
      const response = await apiClient.get(`${API_ROUTES.RECIPES}/${id}`);
      return response.data as ApiResponse<Recipe>;
    } catch (error) {
      return handleApiError(error);
    }
  },

  async createRecipe(data: CreateRecipeData): Promise<ApiResponse<Recipe>> {
    try {
      const response = await apiClient.post(API_ROUTES.RECIPES, data);
      return response.data as ApiResponse<Recipe>;
    } catch (error) {
      return handleApiError(error);
    }
  },

  async updateRecipe(
    id: string,
    data: Partial<CreateRecipeData>
  ): Promise<ApiResponse<Recipe>> {
    try {
      const response = await apiClient.patch(
        `${API_ROUTES.RECIPES}/${id}`,
        data
      );
      return response.data as ApiResponse<Recipe>;
    } catch (error) {
      return handleApiError(error);
    }
  },

  async deleteRecipe(id: string): Promise<ApiResponse<null>> {
    try {
      const response = await apiClient.delete(`${API_ROUTES.RECIPES}/${id}`);
      return response.data as ApiResponse<null>;
    } catch (error) {
      return handleApiError(error);
    }
  },
};
