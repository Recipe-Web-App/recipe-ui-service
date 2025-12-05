import { usersApi } from '@/lib/api/recipe-management/users';
import { recipeManagementClient } from '@/lib/api/recipe-management/client';
import type {
  RecipeDto,
  SearchRecipesResponse,
  DifficultyLevel,
} from '@/types/recipe-management';

// Mock the client
jest.mock('@/lib/api/recipe-management/client', () => ({
  recipeManagementClient: {
    get: jest.fn(),
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

describe('Users API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockRecipeDto: RecipeDto = {
    recipeId: 1,
    userId: 'user-123',
    title: 'My Recipe',
    description: 'A recipe I created',
    servings: 4,
    difficulty: 'EASY' as DifficultyLevel,
    preparationTime: 15,
    cookingTime: 30,
    createdAt: '2023-01-01T10:00:00Z',
    updatedAt: '2023-01-02T10:00:00Z',
  };

  const mockSearchResponse: SearchRecipesResponse = {
    content: [mockRecipeDto],
    totalElements: 1,
    totalPages: 1,
    first: true,
    last: true,
    numberOfElements: 1,
  };

  describe('getMyRecipes', () => {
    it('should get user recipes without parameters', async () => {
      // Mock the actual backend response format (uses 'recipes' key)
      mockedClient.get.mockResolvedValue({
        data: { recipes: [mockRecipeDto] },
      });

      const result = await usersApi.getMyRecipes();

      expect(mockedClient.get).toHaveBeenCalledWith('/users/me/recipes');
      // API transforms { recipes: [...] } to SearchRecipesResponse format
      expect(result).toEqual(mockSearchResponse);
    });

    it('should get user recipes with pagination parameters', async () => {
      mockedClient.get.mockResolvedValue({
        data: { recipes: [mockRecipeDto] },
      });

      const params = { page: 1, size: 10, sort: ['title,asc'] };
      await usersApi.getMyRecipes(params);

      expect(mockedClient.get).toHaveBeenCalledWith(
        '/users/me/recipes?page=1&size=10&sort=title%2Casc'
      );
    });

    it('should get user recipes with page only', async () => {
      mockedClient.get.mockResolvedValue({
        data: { recipes: [mockRecipeDto] },
      });

      const params = { page: 2 };
      await usersApi.getMyRecipes(params);

      expect(mockedClient.get).toHaveBeenCalledWith('/users/me/recipes?page=2');
    });

    it('should get user recipes with size only', async () => {
      mockedClient.get.mockResolvedValue({
        data: { recipes: [mockRecipeDto] },
      });

      const params = { size: 20 };
      await usersApi.getMyRecipes(params);

      expect(mockedClient.get).toHaveBeenCalledWith(
        '/users/me/recipes?size=20'
      );
    });

    it('should handle errors', async () => {
      const error = new Error('Network error');
      mockedClient.get.mockRejectedValue(error);

      await expect(usersApi.getMyRecipes()).rejects.toThrow('Network error');
    });

    it('should handle unauthorized error', async () => {
      const error = new Error('Unauthorized');
      mockedClient.get.mockRejectedValue(error);

      await expect(usersApi.getMyRecipes()).rejects.toThrow('Unauthorized');
    });

    it('should return empty content when user has no recipes', async () => {
      mockedClient.get.mockResolvedValue({ data: { recipes: [] } });

      const result = await usersApi.getMyRecipes();

      expect(result.content).toHaveLength(0);
      expect(result.totalElements).toBe(0);
    });

    it('should return multiple recipes when user has many', async () => {
      const multipleRecipes = [
        mockRecipeDto,
        { ...mockRecipeDto, recipeId: 2, title: 'My Second Recipe' },
        { ...mockRecipeDto, recipeId: 3, title: 'My Third Recipe' },
      ];
      mockedClient.get.mockResolvedValue({
        data: { recipes: multipleRecipes },
      });

      const result = await usersApi.getMyRecipes();

      expect(result.content).toHaveLength(3);
      expect(result.totalElements).toBe(3);
    });
  });
});
