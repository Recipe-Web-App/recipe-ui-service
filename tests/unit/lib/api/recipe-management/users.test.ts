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
    recipes: [mockRecipeDto],
    page: 0,
    size: 10,
    totalElements: 1,
    totalPages: 1,
    first: true,
    last: true,
    numberOfElements: 1,
    empty: false,
  };

  describe('getMyRecipes', () => {
    it('should get user recipes without parameters', async () => {
      mockedClient.get.mockResolvedValue({
        data: mockSearchResponse,
      });

      const result = await usersApi.getMyRecipes();

      expect(mockedClient.get).toHaveBeenCalledWith('/users/me/recipes');
      expect(result).toEqual(mockSearchResponse);
    });

    it('should get user recipes with pagination parameters', async () => {
      mockedClient.get.mockResolvedValue({
        data: mockSearchResponse,
      });

      const params = { page: 1, size: 10, sort: ['title,asc'] };
      await usersApi.getMyRecipes(params);

      expect(mockedClient.get).toHaveBeenCalledWith(
        '/users/me/recipes?page=1&size=10&sort=title%2Casc'
      );
    });

    it('should get user recipes with page only', async () => {
      mockedClient.get.mockResolvedValue({
        data: mockSearchResponse,
      });

      const params = { page: 2 };
      await usersApi.getMyRecipes(params);

      expect(mockedClient.get).toHaveBeenCalledWith('/users/me/recipes?page=2');
    });

    it('should get user recipes with size only', async () => {
      mockedClient.get.mockResolvedValue({
        data: mockSearchResponse,
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

    it('should return empty recipes when user has no recipes', async () => {
      const emptyResponse: SearchRecipesResponse = {
        recipes: [],
        page: 0,
        size: 10,
        totalElements: 0,
        totalPages: 0,
        first: true,
        last: true,
        numberOfElements: 0,
        empty: true,
      };
      mockedClient.get.mockResolvedValue({ data: emptyResponse });

      const result = await usersApi.getMyRecipes();

      expect(result.recipes).toHaveLength(0);
      expect(result.totalElements).toBe(0);
    });

    it('should return multiple recipes when user has many', async () => {
      const multipleRecipesResponse: SearchRecipesResponse = {
        recipes: [
          mockRecipeDto,
          { ...mockRecipeDto, recipeId: 2, title: 'My Second Recipe' },
          { ...mockRecipeDto, recipeId: 3, title: 'My Third Recipe' },
        ],
        page: 0,
        size: 10,
        totalElements: 3,
        totalPages: 1,
        first: true,
        last: true,
        numberOfElements: 3,
        empty: false,
      };
      mockedClient.get.mockResolvedValue({
        data: multipleRecipesResponse,
      });

      const result = await usersApi.getMyRecipes();

      expect(result.recipes).toHaveLength(3);
      expect(result.totalElements).toBe(3);
    });
  });
});
