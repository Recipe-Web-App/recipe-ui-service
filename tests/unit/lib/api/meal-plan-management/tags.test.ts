import { tagsApi } from '@/lib/api/meal-plan-management/tags';
import { mealPlanManagementClient } from '@/lib/api/meal-plan-management/client';
import type {
  MealPlanTagDto,
  AddMealPlanTagsDto,
  MealPlanTagsApiResponse,
  PaginatedTagsResponse,
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

describe('Tags API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockTagDto: MealPlanTagDto = {
    tagId: 'tag-1',
    name: 'Weekly',
  };

  const mockTags: MealPlanTagDto[] = [
    mockTagDto,
    { tagId: 'tag-2', name: 'Budget' },
    { tagId: 'tag-3', name: 'Healthy' },
  ];

  const mockPaginatedResponse: PaginatedTagsResponse = {
    success: true,
    data: mockTags,
    meta: {
      page: 1,
      limit: 20,
      total: 3,
      totalPages: 1,
      hasNext: false,
      hasPrevious: false,
    },
  };

  const mockTagsApiResponse: MealPlanTagsApiResponse = {
    success: true,
    data: mockTags,
    message: 'Tags updated successfully',
  };

  describe('listMealPlanTags', () => {
    it('should list all tags without params', async () => {
      mockedClient.get.mockResolvedValue({ data: mockPaginatedResponse });

      const result = await tagsApi.listMealPlanTags();

      expect(mockedClient.get).toHaveBeenCalledWith('/meal-plans/tags');
      expect(result).toEqual(mockPaginatedResponse);
    });

    it('should list tags with all params', async () => {
      const params = {
        page: 2,
        limit: 10,
        nameSearch: 'week',
        sortBy: 'name' as const,
        sortOrder: 'asc' as const,
      };

      mockedClient.get.mockResolvedValue({ data: mockPaginatedResponse });

      const result = await tagsApi.listMealPlanTags(params);

      expect(mockedClient.get).toHaveBeenCalledWith(
        '/meal-plans/tags?page=2&limit=10&nameSearch=week&sortBy=name&sortOrder=asc'
      );
      expect(result).toEqual(mockPaginatedResponse);
    });

    it('should handle list tags error', async () => {
      const error = new Error('Network error');
      mockedClient.get.mockRejectedValue(error);

      await expect(tagsApi.listMealPlanTags()).rejects.toThrow(error);
    });
  });

  describe('getMealPlanTags', () => {
    it('should get tags for a meal plan successfully', async () => {
      mockedClient.get.mockResolvedValue({ data: mockTagsApiResponse });

      const result = await tagsApi.getMealPlanTags('meal-plan-1');

      expect(mockedClient.get).toHaveBeenCalledWith(
        '/meal-plans/meal-plan-1/tags'
      );
      expect(result).toEqual(mockTagsApiResponse);
    });

    it('should handle get meal plan tags error', async () => {
      const error = new Error('Not found');
      mockedClient.get.mockRejectedValue(error);

      await expect(tagsApi.getMealPlanTags('meal-plan-1')).rejects.toThrow(
        error
      );
    });
  });

  describe('addMealPlanTags', () => {
    it('should add tags to meal plan successfully', async () => {
      const addData: AddMealPlanTagsDto = {
        tags: ['Weekly', 'Budget'],
      };

      mockedClient.post.mockResolvedValue({ data: mockTagsApiResponse });

      const result = await tagsApi.addMealPlanTags('meal-plan-1', addData);

      expect(mockedClient.post).toHaveBeenCalledWith(
        '/meal-plans/meal-plan-1/tags',
        addData
      );
      expect(result).toEqual(mockTagsApiResponse);
    });

    it('should handle add tags error', async () => {
      const addData: AddMealPlanTagsDto = {
        tags: ['Invalid'],
      };

      const error = new Error('Validation failed');
      mockedClient.post.mockRejectedValue(error);

      await expect(
        tagsApi.addMealPlanTags('meal-plan-1', addData)
      ).rejects.toThrow(error);
    });
  });

  describe('replaceMealPlanTags', () => {
    it('should replace meal plan tags successfully', async () => {
      const replaceData: AddMealPlanTagsDto = {
        tags: ['Monthly', 'Premium'],
      };

      mockedClient.put.mockResolvedValue({ data: mockTagsApiResponse });

      const result = await tagsApi.replaceMealPlanTags(
        'meal-plan-1',
        replaceData
      );

      expect(mockedClient.put).toHaveBeenCalledWith(
        '/meal-plans/meal-plan-1/tags',
        replaceData
      );
      expect(result).toEqual(mockTagsApiResponse);
    });

    it('should handle replace tags error', async () => {
      const replaceData: AddMealPlanTagsDto = {
        tags: ['Invalid'],
      };

      const error = new Error('Update failed');
      mockedClient.put.mockRejectedValue(error);

      await expect(
        tagsApi.replaceMealPlanTags('meal-plan-1', replaceData)
      ).rejects.toThrow(error);
    });
  });

  describe('removeMealPlanTag', () => {
    it('should remove tag from meal plan successfully', async () => {
      mockedClient.delete.mockResolvedValue({ data: null });

      await tagsApi.removeMealPlanTag('meal-plan-1', 'tag-1');

      expect(mockedClient.delete).toHaveBeenCalledWith(
        '/meal-plans/meal-plan-1/tags/tag-1'
      );
    });

    it('should handle remove tag error', async () => {
      const error = new Error('Not found');
      mockedClient.delete.mockRejectedValue(error);

      await expect(
        tagsApi.removeMealPlanTag('meal-plan-1', 'tag-1')
      ).rejects.toThrow(error);
    });
  });
});
