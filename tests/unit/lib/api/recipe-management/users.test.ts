import { usersApi } from '@/lib/api/recipe-management/users';
import { recipeManagementClient } from '@/lib/api/recipe-management/client';
import type {
  RecipeDto,
  SearchRecipesResponse,
  DifficultyLevel,
  CollectionDto,
  PageCollectionDto,
  CollectionVisibility,
  CollaborationMode,
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

  const mockCollectionDto: CollectionDto = {
    collectionId: 1,
    userId: 'user-123',
    name: 'My Collection',
    description: 'A collection I created',
    visibility: 'PRIVATE' as CollectionVisibility,
    collaborationMode: 'VIEW_ONLY' as CollaborationMode,
    recipeCount: 5,
    collaboratorCount: 0,
    createdAt: '2023-01-01T10:00:00Z',
    updatedAt: '2023-01-02T10:00:00Z',
  };

  const mockPageCollectionDto: PageCollectionDto = {
    content: [mockCollectionDto],
    number: 0,
    size: 10,
    totalElements: 1,
    totalPages: 1,
    first: true,
    last: true,
    numberOfElements: 1,
    empty: false,
    sort: { sorted: false, unsorted: true, empty: true },
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

  describe('getMyCollections', () => {
    it('should get user collections without parameters', async () => {
      mockedClient.get.mockResolvedValue({
        data: mockPageCollectionDto,
      });

      const result = await usersApi.getMyCollections();

      expect(mockedClient.get).toHaveBeenCalledWith('/users/me/collections');
      expect(result).toEqual(mockPageCollectionDto);
    });

    it('should get user collections with pagination parameters', async () => {
      mockedClient.get.mockResolvedValue({
        data: mockPageCollectionDto,
      });

      const params = { page: 1, size: 10, sort: ['name,asc'] };
      await usersApi.getMyCollections(params);

      expect(mockedClient.get).toHaveBeenCalledWith(
        '/users/me/collections?page=1&size=10&sort=name%2Casc'
      );
    });

    it('should get user collections with page only', async () => {
      mockedClient.get.mockResolvedValue({
        data: mockPageCollectionDto,
      });

      const params = { page: 2 };
      await usersApi.getMyCollections(params);

      expect(mockedClient.get).toHaveBeenCalledWith(
        '/users/me/collections?page=2'
      );
    });

    it('should get user collections with size only', async () => {
      mockedClient.get.mockResolvedValue({
        data: mockPageCollectionDto,
      });

      const params = { size: 20 };
      await usersApi.getMyCollections(params);

      expect(mockedClient.get).toHaveBeenCalledWith(
        '/users/me/collections?size=20'
      );
    });

    it('should get user collections with includeCollaborations true', async () => {
      mockedClient.get.mockResolvedValue({
        data: mockPageCollectionDto,
      });

      const params = { includeCollaborations: true };
      await usersApi.getMyCollections(params);

      expect(mockedClient.get).toHaveBeenCalledWith(
        '/users/me/collections?includeCollaborations=true'
      );
    });

    it('should get user collections with includeCollaborations false', async () => {
      mockedClient.get.mockResolvedValue({
        data: mockPageCollectionDto,
      });

      const params = { includeCollaborations: false };
      await usersApi.getMyCollections(params);

      expect(mockedClient.get).toHaveBeenCalledWith(
        '/users/me/collections?includeCollaborations=false'
      );
    });

    it('should get user collections with pagination and includeCollaborations', async () => {
      mockedClient.get.mockResolvedValue({
        data: mockPageCollectionDto,
      });

      const params = { page: 0, size: 12, includeCollaborations: true };
      await usersApi.getMyCollections(params);

      expect(mockedClient.get).toHaveBeenCalledWith(
        '/users/me/collections?page=0&size=12&includeCollaborations=true'
      );
    });

    it('should handle errors', async () => {
      const error = new Error('Network error');
      mockedClient.get.mockRejectedValue(error);

      await expect(usersApi.getMyCollections()).rejects.toThrow(
        'Network error'
      );
    });

    it('should handle unauthorized error', async () => {
      const error = new Error('Unauthorized');
      mockedClient.get.mockRejectedValue(error);

      await expect(usersApi.getMyCollections()).rejects.toThrow('Unauthorized');
    });

    it('should return empty collections when user has no collections', async () => {
      const emptyResponse: PageCollectionDto = {
        content: [],
        number: 0,
        size: 10,
        totalElements: 0,
        totalPages: 0,
        first: true,
        last: true,
        numberOfElements: 0,
        empty: true,
        sort: { sorted: false, unsorted: true, empty: true },
      };
      mockedClient.get.mockResolvedValue({ data: emptyResponse });

      const result = await usersApi.getMyCollections();

      expect(result.content).toHaveLength(0);
      expect(result.totalElements).toBe(0);
      expect(result.empty).toBe(true);
    });

    it('should return multiple collections when user has many', async () => {
      const multipleCollectionsResponse: PageCollectionDto = {
        content: [
          mockCollectionDto,
          {
            ...mockCollectionDto,
            collectionId: 2,
            name: 'My Second Collection',
          },
          {
            ...mockCollectionDto,
            collectionId: 3,
            name: 'My Third Collection',
          },
        ],
        number: 0,
        size: 10,
        totalElements: 3,
        totalPages: 1,
        first: true,
        last: true,
        numberOfElements: 3,
        empty: false,
        sort: { sorted: false, unsorted: true, empty: true },
      };
      mockedClient.get.mockResolvedValue({
        data: multipleCollectionsResponse,
      });

      const result = await usersApi.getMyCollections();

      expect(result.content).toHaveLength(3);
      expect(result.totalElements).toBe(3);
    });
  });
});
