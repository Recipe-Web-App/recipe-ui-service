import { recipesApi } from '@/lib/api/recipes';
import { ApiError } from '@/lib/api/client';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Recipes API Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getRecipes', () => {
    test('should fetch recipes successfully', async () => {
      const mockResponse = {
        data: {
          data: [
            { id: '1', title: 'Test Recipe', description: 'Test Description' },
          ],
          success: true,
          message: 'Recipes fetched successfully',
          meta: { page: 1, limit: 10, total: 1, totalPages: 1 },
        },
      };

      // Mock successful response
      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await recipesApi.getRecipes({ page: 1, limit: 10 });

      expect(result.data).toHaveLength(1);
      expect(result.data[0].title).toBe('Test Recipe');
      expect(result.success).toBe(true);
    });

    test('should handle API errors correctly', async () => {
      const mockError = {
        response: {
          status: 404,
          data: { message: 'Recipes not found' },
        },
      };

      mockedAxios.get.mockRejectedValue(mockError);

      await expect(recipesApi.getRecipes()).rejects.toThrow(ApiError);
    });
  });

  describe('createRecipe', () => {
    test('should create recipe successfully', async () => {
      const newRecipe = {
        title: 'New Recipe',
        description: 'New Description',
        ingredients: ['ingredient1'],
        instructions: ['step1'],
        cookingTime: 30,
        servings: 4,
      };

      const mockResponse = {
        data: {
          data: { id: '2', ...newRecipe },
          success: true,
          message: 'Recipe created successfully',
        },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await recipesApi.createRecipe(newRecipe);

      expect(result.data.title).toBe('New Recipe');
      expect(result.success).toBe(true);
    });
  });
});
