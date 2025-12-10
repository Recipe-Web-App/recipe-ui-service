import { searchApi } from '@/lib/api/recipe-management/search';
import { recipeManagementClient } from '@/lib/api/recipe-management/client';
import type {
  SearchRecipesRequest,
  SearchRecipesResponse,
  RecipeDto,
  DifficultyLevel,
} from '@/types/recipe-management';

// Mock the client
jest.mock('@/lib/api/recipe-management/client', () => ({
  recipeManagementClient: {
    post: jest.fn(),
  },
  handleRecipeManagementApiError: jest.fn(error => {
    throw error;
  }),
  buildQueryParams: jest.requireActual('@/lib/api/recipe-management/client')
    .buildQueryParams,
}));

const mockedClient = recipeManagementClient as jest.Mocked<
  typeof recipeManagementClient
>;

describe('Search API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockRecipe: RecipeDto = {
    recipeId: 1,
    userId: 'user-123',
    title: 'Italian Pasta Carbonara',
    description: 'Classic Italian pasta dish with eggs, cheese, and pancetta',
    servings: 4,
    difficulty: 'EASY' as DifficultyLevel,
    preparationTime: 15,
    cookingTime: 20,
    createdAt: '2023-01-01T10:00:00Z',
    updatedAt: '2023-01-02T10:00:00Z',
  };

  const mockSearchResponse: SearchRecipesResponse = {
    content: [mockRecipe],
    totalElements: 1,
    totalPages: 1,
    first: true,
    last: true,
    numberOfElements: 1,
  };

  describe('searchRecipes', () => {
    it('should search recipes with basic query', async () => {
      const searchRequest: SearchRecipesRequest = {
        recipeNameQuery: 'pasta',
      };

      mockedClient.post.mockResolvedValue({ data: mockSearchResponse });

      const result = await searchApi.searchRecipes(searchRequest);

      expect(mockedClient.post).toHaveBeenCalledWith(
        '/recipes/search',
        searchRequest
      );
      expect(result).toEqual(mockSearchResponse);
    });

    it('should search recipes with pagination parameters', async () => {
      const searchRequest: SearchRecipesRequest = {
        recipeNameQuery: 'italian',
      };

      const params = { page: 1, size: 10, sort: ['title,asc'] };

      mockedClient.post.mockResolvedValue({ data: mockSearchResponse });

      await searchApi.searchRecipes(searchRequest, params);

      expect(mockedClient.post).toHaveBeenCalledWith(
        '/recipes/search?page=1&size=10&sort=title%2Casc',
        searchRequest
      );
    });

    it('should search recipes with advanced filters', async () => {
      const advancedSearchRequest: SearchRecipesRequest = {
        recipeNameQuery: 'pasta',
        tags: ['italian', 'dinner'],
        difficulty: 'EASY' as DifficultyLevel,
        maxPreparationTime: 30,
        maxCookingTime: 45,
      };

      const filteredResults: SearchRecipesResponse = {
        ...mockSearchResponse,
        content: [
          {
            ...mockRecipe,
            title: 'Featured Pasta Recipe',
          },
        ],
      };

      mockedClient.post.mockResolvedValue({ data: filteredResults });

      const result = await searchApi.searchRecipes(advancedSearchRequest);

      expect(result.content[0].title).toBe('Featured Pasta Recipe');
    });

    it('should search recipes by ingredients', async () => {
      const ingredientSearchRequest: SearchRecipesRequest = {
        ingredients: ['eggs', 'cheese', 'pasta'],
      };

      const ingredientResults: SearchRecipesResponse = {
        ...mockSearchResponse,
        content: [
          {
            ...mockRecipe,
            title: 'Pasta with Eggs and Cheese',
          },
        ],
      };

      mockedClient.post.mockResolvedValue({ data: ingredientResults });

      const result = await searchApi.searchRecipes(ingredientSearchRequest);

      expect(mockedClient.post).toHaveBeenCalledWith(
        '/recipes/search',
        ingredientSearchRequest
      );
      expect(result.content[0].title).toBe('Pasta with Eggs and Cheese');
    });

    it('should search recipes with time constraints', async () => {
      const timeConstrainedRequest: SearchRecipesRequest = {
        maxPreparationTime: 30,
        maxCookingTime: 30,
      };

      const quickMealResults: SearchRecipesResponse = {
        ...mockSearchResponse,
        content: [
          {
            ...mockRecipe,
            title: 'Quick Pasta Salad',
            cookingTime: 20,
          },
        ],
      };

      mockedClient.post.mockResolvedValue({ data: quickMealResults });

      const result = await searchApi.searchRecipes(timeConstrainedRequest);

      expect(result.content[0].cookingTime).toBeLessThanOrEqual(30);
    });

    it('should search recipes with dietary preferences', async () => {
      const dietarySearchRequest: SearchRecipesRequest = {
        tags: ['vegetarian', 'gluten-free'],
        ingredients: ['vegetables', 'rice'],
      };

      const dietaryResults: SearchRecipesResponse = {
        ...mockSearchResponse,
        content: [
          {
            ...mockRecipe,
            title: 'Vegetarian Gluten-Free Pasta',
            description:
              'Delicious pasta made with rice noodles and vegetables',
          },
        ],
      };

      mockedClient.post.mockResolvedValue({ data: dietaryResults });

      const result = await searchApi.searchRecipes(dietarySearchRequest);

      expect(result.content[0].title).toContain('Vegetarian Gluten-Free');
    });

    it('should handle empty search results', async () => {
      const emptySearchRequest: SearchRecipesRequest = {
        recipeNameQuery: 'nonexistent recipe',
      };

      const emptyResults: SearchRecipesResponse = {
        content: [],
        totalElements: 0,
        totalPages: 0,
        first: true,
        last: true,
        numberOfElements: 0,
      };

      mockedClient.post.mockResolvedValue({ data: emptyResults });

      const result = await searchApi.searchRecipes(emptySearchRequest);

      expect(result.numberOfElements).toBe(0);
      expect(result.content).toHaveLength(0);
      expect(result.totalElements).toBe(0);
    });

    it('should search recipes with sorting options', async () => {
      const sortedSearchRequest: SearchRecipesRequest = {
        recipeNameQuery: 'chicken',
      };

      const sortedResults: SearchRecipesResponse = {
        ...mockSearchResponse,
        content: [
          {
            ...mockRecipe,
            title: 'Newest Chicken Recipe',
            createdAt: '2023-12-01T10:00:00Z',
          },
          {
            ...mockRecipe,
            recipeId: 2,
            title: 'Older Chicken Recipe',
            createdAt: '2023-06-01T10:00:00Z',
          },
        ],
        numberOfElements: 2,
        totalElements: 2,
      };

      mockedClient.post.mockResolvedValue({ data: sortedResults });

      const result = await searchApi.searchRecipes(sortedSearchRequest);

      expect(result.content).toHaveLength(2);
      expect(new Date(result.content[0].createdAt).getTime()).toBeGreaterThan(
        new Date(result.content[1].createdAt).getTime()
      );
    });

    it('should handle complex search with multiple criteria', async () => {
      const complexSearchRequest: SearchRecipesRequest = {
        recipeNameQuery: 'healthy dinner',
        tags: ['healthy', 'low-carb'],
        difficulty: 'EASY' as DifficultyLevel,
        maxPreparationTime: 30,
        maxCookingTime: 15,
        ingredients: ['chicken', 'vegetables'],
      };

      const complexResults: SearchRecipesResponse = {
        ...mockSearchResponse,
        content: [
          {
            ...mockRecipe,
            title: 'Healthy Keto Chicken Bowl',
            // averageRating and totalTimeMinutes are not part of RecipeDto
          },
        ],
      };

      mockedClient.post.mockResolvedValue({ data: complexResults });

      const result = await searchApi.searchRecipes(complexSearchRequest);

      expect(result.content[0].title).toContain('Healthy');
      expect(result.content[0].title).toContain('Healthy');
    });

    it('should handle search validation errors', async () => {
      const invalidSearchRequest: SearchRecipesRequest = {
        recipeNameQuery: '', // Empty query
        maxPreparationTime: -10, // Invalid negative time
      };

      const error = new Error('Invalid search parameters');
      mockedClient.post.mockRejectedValue(error);

      await expect(
        searchApi.searchRecipes(invalidSearchRequest)
      ).rejects.toThrow('Invalid search parameters');
    });

    it('should handle search service unavailable errors', async () => {
      const searchRequest: SearchRecipesRequest = {
        recipeNameQuery: 'pasta',
      };

      const error = new Error('Search service temporarily unavailable');
      mockedClient.post.mockRejectedValue(error);

      await expect(searchApi.searchRecipes(searchRequest)).rejects.toThrow(
        'Search service temporarily unavailable'
      );
    });

    it('should handle large result sets with pagination', async () => {
      const largeSearchRequest: SearchRecipesRequest = {
        recipeNameQuery: 'chicken',
      };

      const largeResultSet: SearchRecipesResponse = {
        content: Array.from({ length: 20 }, (_, i) => ({
          ...mockRecipe,
          recipeId: i + 1,
          title: `Chicken Recipe ${i + 1}`,
        })),
        totalElements: 150,
        totalPages: 8,
        first: true,
        last: false,
        numberOfElements: 20,
      };

      const paginationParams = { page: 0, size: 20 };

      mockedClient.post.mockResolvedValue({ data: largeResultSet });

      const result = await searchApi.searchRecipes(
        largeSearchRequest,
        paginationParams
      );

      expect(result.content).toHaveLength(20);
      expect(result.totalElements).toBe(150);
      expect(result.totalPages).toBe(8);
      expect(result.first).toBe(true);
      expect(result.last).toBe(false);
    });

    it('should handle search timeout errors', async () => {
      const searchRequest: SearchRecipesRequest = {
        recipeNameQuery: 'complex search with many filters',
        tags: ['tag1', 'tag2', 'tag3'],
        ingredients: ['ingredient1', 'ingredient2'],
      };

      const error = new Error('Search request timeout');
      mockedClient.post.mockRejectedValue(error);

      await expect(searchApi.searchRecipes(searchRequest)).rejects.toThrow(
        'Search request timeout'
      );
    });

    it('should search with fuzzy matching for typos', async () => {
      const typoSearchRequest: SearchRecipesRequest = {
        recipeNameQuery: 'spagetti carbonra', // Intentional typos
        // fuzzySearch is not part of SearchRecipesRequest
      };

      const fuzzyResults: SearchRecipesResponse = {
        ...mockSearchResponse,
        content: [
          {
            ...mockRecipe,
            title: 'Spaghetti Carbonara', // Correct spelling matched
          },
        ],
      };

      mockedClient.post.mockResolvedValue({ data: fuzzyResults });

      const result = await searchApi.searchRecipes(typoSearchRequest);

      expect(result.content[0].title).toBe('Spaghetti Carbonara');
    });
  });
});
