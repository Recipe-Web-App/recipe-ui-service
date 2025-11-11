import { favoritesApi } from '@/lib/api/recipe-management/favorites';
import { recipeManagementClient } from '@/lib/api/recipe-management/client';
import type {
  RecipeFavoriteDto,
  GetFavoriteRecipesParams,
  FavoriteRecipesResponse,
} from '@/types/recipe-management/favorite';
import { DifficultyLevel } from '@/types/recipe-management/common';

// Mock the client
jest.mock('@/lib/api/recipe-management/client', () => ({
  recipeManagementClient: {
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
  },
  buildQueryParams: jest.requireActual('@/lib/api/recipe-management/client')
    .buildQueryParams,
}));

const mockedClient = recipeManagementClient as jest.Mocked<
  typeof recipeManagementClient
>;

describe('Favorites API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockFavoriteDto: RecipeFavoriteDto = {
    recipeId: 123,
    userId: 'user-456-uuid',
    favoritedAt: '2023-01-01T10:00:00Z',
  };

  const mockFavoriteRecipesResponse: FavoriteRecipesResponse = {
    content: [
      {
        recipeId: 123,
        userId: 'user-789',
        title: 'Chocolate Chip Cookies',
        description: 'Classic homemade cookies',
        servings: 24,
        preparationTime: 15,
        cookingTime: 12,
        difficulty: DifficultyLevel.EASY,
        createdAt: '2023-01-01T10:00:00Z',
      },
    ],
    totalElements: 1,
    totalPages: 1,
    first: true,
    last: true,
    numberOfElements: 1,
  };

  describe('getFavoriteRecipes', () => {
    it('should get favorite recipes without parameters', async () => {
      mockedClient.get.mockResolvedValue({ data: mockFavoriteRecipesResponse });

      const result = await favoritesApi.getFavoriteRecipes();

      expect(mockedClient.get).toHaveBeenCalledWith('/favorites/recipes');
      expect(result).toEqual(mockFavoriteRecipesResponse);
    });

    it('should get favorite recipes with userId', async () => {
      const params: GetFavoriteRecipesParams = {
        userId: 'user-123-uuid',
      };
      mockedClient.get.mockResolvedValue({ data: mockFavoriteRecipesResponse });

      const result = await favoritesApi.getFavoriteRecipes(params);

      expect(mockedClient.get).toHaveBeenCalledWith(
        '/favorites/recipes?userId=user-123-uuid'
      );
      expect(result).toEqual(mockFavoriteRecipesResponse);
    });

    it('should get favorite recipes with pagination', async () => {
      const params: GetFavoriteRecipesParams = {
        page: 1,
        size: 10,
        sort: ['favoritedAt,desc'],
      };
      mockedClient.get.mockResolvedValue({ data: mockFavoriteRecipesResponse });

      const result = await favoritesApi.getFavoriteRecipes(params);

      expect(mockedClient.get).toHaveBeenCalledWith(
        '/favorites/recipes?page=1&size=10&sort=favoritedAt%2Cdesc'
      );
      expect(result).toEqual(mockFavoriteRecipesResponse);
    });

    it('should get favorite recipes with userId and pagination', async () => {
      const params: GetFavoriteRecipesParams = {
        userId: 'user-456-uuid',
        page: 0,
        size: 20,
      };
      mockedClient.get.mockResolvedValue({ data: mockFavoriteRecipesResponse });

      const result = await favoritesApi.getFavoriteRecipes(params);

      expect(mockedClient.get).toHaveBeenCalledWith(
        '/favorites/recipes?userId=user-456-uuid&page=0&size=20'
      );
      expect(result).toEqual(mockFavoriteRecipesResponse);
    });

    it('should handle empty favorites list', async () => {
      const emptyResponse: FavoriteRecipesResponse = {
        content: [],
        totalElements: 0,
        totalPages: 0,
        first: true,
        last: true,
        numberOfElements: 0,
      };
      mockedClient.get.mockResolvedValue({ data: emptyResponse });

      const result = await favoritesApi.getFavoriteRecipes();

      expect(result.content).toHaveLength(0);
      expect(result.totalElements).toBe(0);
    });

    it('should handle unauthorized access (401)', async () => {
      const error = new Error('Unauthorized');
      mockedClient.get.mockRejectedValue(error);

      await expect(favoritesApi.getFavoriteRecipes()).rejects.toThrow(
        'Unauthorized'
      );
    });

    it('should handle forbidden access to private favorites (403)', async () => {
      const params: GetFavoriteRecipesParams = {
        userId: 'private-user-uuid',
      };
      const error = new Error(
        "User's favorites are private. Only followers can view them."
      );
      mockedClient.get.mockRejectedValue(error);

      await expect(favoritesApi.getFavoriteRecipes(params)).rejects.toThrow(
        "User's favorites are private. Only followers can view them."
      );
    });
  });

  describe('favoriteRecipe', () => {
    it('should favorite a recipe successfully', async () => {
      mockedClient.post.mockResolvedValue({ data: mockFavoriteDto });

      const result = await favoritesApi.favoriteRecipe(123);

      expect(mockedClient.post).toHaveBeenCalledWith('/favorites/recipes/123');
      expect(result).toEqual(mockFavoriteDto);
      expect(result.recipeId).toBe(123);
    });

    it('should handle recipe not found (404)', async () => {
      const error = new Error('Recipe not found');
      mockedClient.post.mockRejectedValue(error);

      await expect(favoritesApi.favoriteRecipe(999)).rejects.toThrow(
        'Recipe not found'
      );
    });

    it('should handle already favorited (409)', async () => {
      const error = new Error('User has already favorited this recipe');
      mockedClient.post.mockRejectedValue(error);

      await expect(favoritesApi.favoriteRecipe(123)).rejects.toThrow(
        'User has already favorited this recipe'
      );
    });

    it('should handle unauthorized access (401)', async () => {
      const error = new Error('Unauthorized');
      mockedClient.post.mockRejectedValue(error);

      await expect(favoritesApi.favoriteRecipe(123)).rejects.toThrow(
        'Unauthorized'
      );
    });
  });

  describe('unfavoriteRecipe', () => {
    it('should unfavorite a recipe successfully', async () => {
      mockedClient.delete.mockResolvedValue({ data: undefined });

      await favoritesApi.unfavoriteRecipe(123);

      expect(mockedClient.delete).toHaveBeenCalledWith(
        '/favorites/recipes/123'
      );
    });

    it('should handle favorite not found (404)', async () => {
      const error = new Error('Favorite not found for this user and recipe');
      mockedClient.delete.mockRejectedValue(error);

      await expect(favoritesApi.unfavoriteRecipe(999)).rejects.toThrow(
        'Favorite not found for this user and recipe'
      );
    });

    it('should handle unauthorized access (401)', async () => {
      const error = new Error('Unauthorized');
      mockedClient.delete.mockRejectedValue(error);

      await expect(favoritesApi.unfavoriteRecipe(123)).rejects.toThrow(
        'Unauthorized'
      );
    });

    it('should handle recipe not found (404)', async () => {
      const error = new Error('Recipe not found');
      mockedClient.delete.mockRejectedValue(error);

      await expect(favoritesApi.unfavoriteRecipe(123)).rejects.toThrow(
        'Recipe not found'
      );
    });
  });

  describe('isRecipeFavorited', () => {
    it('should return true when recipe is favorited', async () => {
      mockedClient.get.mockResolvedValue({ data: true });

      const result = await favoritesApi.isRecipeFavorited(123);

      expect(mockedClient.get).toHaveBeenCalledWith(
        '/favorites/recipes/123/is-favorited'
      );
      expect(result).toBe(true);
    });

    it('should return false when recipe is not favorited', async () => {
      mockedClient.get.mockResolvedValue({ data: false });

      const result = await favoritesApi.isRecipeFavorited(456);

      expect(mockedClient.get).toHaveBeenCalledWith(
        '/favorites/recipes/456/is-favorited'
      );
      expect(result).toBe(false);
    });

    it('should handle unauthorized access (401)', async () => {
      const error = new Error('Unauthorized');
      mockedClient.get.mockRejectedValue(error);

      await expect(favoritesApi.isRecipeFavorited(123)).rejects.toThrow(
        'Unauthorized'
      );
    });

    it('should handle recipe not found (404)', async () => {
      const error = new Error('Recipe not found');
      mockedClient.get.mockRejectedValue(error);

      await expect(favoritesApi.isRecipeFavorited(999)).rejects.toThrow(
        'Recipe not found'
      );
    });
  });
});
