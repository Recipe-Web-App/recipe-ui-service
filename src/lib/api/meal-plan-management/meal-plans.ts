import {
  mealPlanManagementClient,
  handleMealPlanManagementApiError,
  buildQueryParams,
  type PaginationParams,
} from './client';
import type {
  CreateMealPlanDto,
  UpdateMealPlanDto,
  MealPlanResponseDto,
  PaginatedMealPlansResponse,
  MealPlanQueryResponse,
  ApiResponse,
  MealType,
} from '@/types/meal-plan-management';

export interface ListMealPlansParams extends PaginationParams {
  userId?: string;
  isActive?: boolean;
  startDateFrom?: string;
  endDateTo?: string;
  nameSearch?: string;
  descriptionSearch?: string;
  sortBy?: 'name' | 'startDate' | 'endDate' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
  includeRecipes?: boolean;
  includeArchived?: boolean;
}

export interface GetMealPlanByIdParams {
  viewMode?: 'full' | 'day' | 'week' | 'month';
  filterDate?: string;
  filterStartDate?: string;
  filterEndDate?: string;
  filterYear?: number;
  filterMonth?: number;
  mealType?: MealType;
  groupByMealType?: boolean;
  includeRecipes?: boolean;
  includeStatistics?: boolean;
}

export const mealPlansApi = {
  /**
   * Create a new meal plan
   * POST /meal-plans
   */
  async createMealPlan(
    data: CreateMealPlanDto
  ): Promise<ApiResponse<MealPlanResponseDto>> {
    try {
      const response = await mealPlanManagementClient.post('/meal-plans', data);
      return response.data as ApiResponse<MealPlanResponseDto>;
    } catch (error) {
      handleMealPlanManagementApiError(error);
      throw error;
    }
  },

  /**
   * List meal plans with pagination and filters
   * GET /meal-plans
   */
  async listMealPlans(
    params?: ListMealPlansParams
  ): Promise<PaginatedMealPlansResponse> {
    try {
      const queryString = params ? buildQueryParams(params) : '';
      const response = await mealPlanManagementClient.get(
        `/meal-plans${queryString ? `?${queryString}` : ''}`
      );
      return response.data as PaginatedMealPlansResponse;
    } catch (error) {
      handleMealPlanManagementApiError(error);
      throw error;
    }
  },

  /**
   * Get meal plan by ID with flexible viewing options
   * GET /meal-plans/{id}
   */
  async getMealPlanById(
    id: string,
    params?: GetMealPlanByIdParams
  ): Promise<MealPlanQueryResponse> {
    try {
      const queryString = params ? buildQueryParams(params) : '';
      const response = await mealPlanManagementClient.get(
        `/meal-plans/${id}${queryString ? `?${queryString}` : ''}`
      );
      return response.data as MealPlanQueryResponse;
    } catch (error) {
      handleMealPlanManagementApiError(error);
      throw error;
    }
  },

  /**
   * Update an existing meal plan
   * PUT /meal-plans/{id}
   */
  async updateMealPlan(
    id: string,
    data: UpdateMealPlanDto
  ): Promise<ApiResponse<MealPlanResponseDto>> {
    try {
      const response = await mealPlanManagementClient.put(
        `/meal-plans/${id}`,
        data
      );
      return response.data as ApiResponse<MealPlanResponseDto>;
    } catch (error) {
      handleMealPlanManagementApiError(error);
      throw error;
    }
  },

  /**
   * Delete a meal plan
   * DELETE /meal-plans/{id}
   */
  async deleteMealPlan(id: string): Promise<void> {
    try {
      await mealPlanManagementClient.delete(`/meal-plans/${id}`);
    } catch (error) {
      handleMealPlanManagementApiError(error);
      throw error;
    }
  },
};
