import { mealPlansApi } from '@/lib/api/meal-plan-management/meal-plans';
import { mealPlanManagementClient } from '@/lib/api/meal-plan-management/client';
import {
  MealType,
  type CreateMealPlanDto,
  type UpdateMealPlanDto,
  type MealPlanResponseDto,
  type PaginatedMealPlansResponse,
  type MealPlanQueryResponse,
  type ApiResponse,
} from '@/types/meal-plan-management';

// Mock the client
jest.mock('@/lib/api/meal-plan-management/client', () => ({
  mealPlanManagementClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
  handleMealPlanManagementApiError: jest.fn(error => {
    throw error;
  }),
  buildQueryParams: jest.requireActual('@/lib/api/meal-plan-management/client')
    .buildQueryParams,
}));

const mockedClient = mealPlanManagementClient as jest.Mocked<
  typeof mealPlanManagementClient
>;

describe('Meal Plans API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockMealPlanDto: MealPlanResponseDto = {
    id: 'meal-plan-1',
    userId: 'user-123',
    name: 'Weekly Meal Plan',
    description: 'Healthy meals for the week',
    startDate: '2024-03-11',
    endDate: '2024-03-17',
    isActive: true,
    createdAt: '2024-03-10T10:00:00Z',
    updatedAt: '2024-03-10T10:00:00Z',
    recipeCount: 14,
    durationDays: 7,
  };

  const mockApiResponse: ApiResponse<MealPlanResponseDto> = {
    success: true,
    data: mockMealPlanDto,
    message: 'Meal plan created successfully',
  };

  const mockPaginatedResponse: PaginatedMealPlansResponse = {
    success: true,
    data: [mockMealPlanDto],
    meta: {
      page: 1,
      limit: 20,
      total: 1,
      totalPages: 1,
      hasNext: false,
      hasPrevious: false,
    },
  };

  const mockQueryResponse: MealPlanQueryResponse = {
    success: true,
    viewMode: 'full',
    data: mockMealPlanDto,
  };

  describe('createMealPlan', () => {
    it('should create a meal plan successfully', async () => {
      const createData: CreateMealPlanDto = {
        name: 'Weekly Meal Plan',
        description: 'Healthy meals for the week',
        startDate: '2024-03-11',
        endDate: '2024-03-17',
        isActive: true,
      };

      mockedClient.post.mockResolvedValue({ data: mockApiResponse });

      const result = await mealPlansApi.createMealPlan(createData);

      expect(mockedClient.post).toHaveBeenCalledWith('/meal-plans', createData);
      expect(result).toEqual(mockApiResponse);
    });

    it('should handle create meal plan error', async () => {
      const createData: CreateMealPlanDto = {
        name: 'Weekly Meal Plan',
        startDate: '2024-03-11',
        endDate: '2024-03-17',
      };

      const error = new Error('Validation failed');
      mockedClient.post.mockRejectedValue(error);

      await expect(mealPlansApi.createMealPlan(createData)).rejects.toThrow(
        error
      );
    });
  });

  describe('listMealPlans', () => {
    it('should list meal plans without params', async () => {
      mockedClient.get.mockResolvedValue({ data: mockPaginatedResponse });

      const result = await mealPlansApi.listMealPlans();

      expect(mockedClient.get).toHaveBeenCalledWith('/meal-plans');
      expect(result).toEqual(mockPaginatedResponse);
    });

    it('should list meal plans with all params', async () => {
      const params = {
        page: 2,
        limit: 10,
        userId: 'user-123',
        isActive: true,
        startDateFrom: '2024-03-01',
        endDateTo: '2024-03-31',
        nameSearch: 'weekly',
        descriptionSearch: 'healthy',
        sortBy: 'createdAt' as const,
        sortOrder: 'desc' as const,
        includeRecipes: true,
        includeArchived: false,
      };

      mockedClient.get.mockResolvedValue({ data: mockPaginatedResponse });

      const result = await mealPlansApi.listMealPlans(params);

      expect(mockedClient.get).toHaveBeenCalledWith(
        '/meal-plans?page=2&limit=10&userId=user-123&isActive=true&startDateFrom=2024-03-01&endDateTo=2024-03-31&nameSearch=weekly&descriptionSearch=healthy&sortBy=createdAt&sortOrder=desc&includeRecipes=true&includeArchived=false'
      );
      expect(result).toEqual(mockPaginatedResponse);
    });

    it('should handle list meal plans error', async () => {
      const error = new Error('Network error');
      mockedClient.get.mockRejectedValue(error);

      await expect(mealPlansApi.listMealPlans()).rejects.toThrow(error);
    });
  });

  describe('getMealPlanById', () => {
    it('should get meal plan by id without params', async () => {
      mockedClient.get.mockResolvedValue({ data: mockQueryResponse });

      const result = await mealPlansApi.getMealPlanById('meal-plan-1');

      expect(mockedClient.get).toHaveBeenCalledWith('/meal-plans/meal-plan-1');
      expect(result).toEqual(mockQueryResponse);
    });

    it('should get meal plan by id with all params', async () => {
      const params = {
        viewMode: 'day' as const,
        filterDate: '2024-03-15',
        filterStartDate: '2024-03-11',
        filterEndDate: '2024-03-17',
        filterYear: 2024,
        filterMonth: 3,
        mealType: MealType.BREAKFAST,
        groupByMealType: true,
        includeRecipes: true,
        includeStatistics: true,
      };

      mockedClient.get.mockResolvedValue({ data: mockQueryResponse });

      const result = await mealPlansApi.getMealPlanById('meal-plan-1', params);

      expect(mockedClient.get).toHaveBeenCalledWith(
        '/meal-plans/meal-plan-1?viewMode=day&filterDate=2024-03-15&filterStartDate=2024-03-11&filterEndDate=2024-03-17&filterYear=2024&filterMonth=3&mealType=BREAKFAST&groupByMealType=true&includeRecipes=true&includeStatistics=true'
      );
      expect(result).toEqual(mockQueryResponse);
    });

    it('should handle get meal plan by id error', async () => {
      const error = new Error('Not found');
      mockedClient.get.mockRejectedValue(error);

      await expect(mealPlansApi.getMealPlanById('meal-plan-1')).rejects.toThrow(
        error
      );
    });
  });

  describe('updateMealPlan', () => {
    it('should update meal plan successfully', async () => {
      const updateData: UpdateMealPlanDto = {
        name: 'Updated Weekly Meal Plan',
        description: 'Updated healthy meals for the week',
      };

      mockedClient.put.mockResolvedValue({ data: mockApiResponse });

      const result = await mealPlansApi.updateMealPlan(
        'meal-plan-1',
        updateData
      );

      expect(mockedClient.put).toHaveBeenCalledWith(
        '/meal-plans/meal-plan-1',
        updateData
      );
      expect(result).toEqual(mockApiResponse);
    });

    it('should handle update meal plan error', async () => {
      const updateData: UpdateMealPlanDto = {
        name: 'Updated Weekly Meal Plan',
      };

      const error = new Error('Update failed');
      mockedClient.put.mockRejectedValue(error);

      await expect(
        mealPlansApi.updateMealPlan('meal-plan-1', updateData)
      ).rejects.toThrow(error);
    });
  });

  describe('deleteMealPlan', () => {
    it('should delete meal plan successfully', async () => {
      mockedClient.delete.mockResolvedValue({ data: null });

      await mealPlansApi.deleteMealPlan('meal-plan-1');

      expect(mockedClient.delete).toHaveBeenCalledWith(
        '/meal-plans/meal-plan-1'
      );
    });

    it('should handle delete meal plan error', async () => {
      const error = new Error('Delete failed');
      mockedClient.delete.mockRejectedValue(error);

      await expect(mealPlansApi.deleteMealPlan('meal-plan-1')).rejects.toThrow(
        error
      );
    });
  });
});
