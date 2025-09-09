import { recipesApi } from '@/lib/api/recipe-management/recipes';
import { recipeManagementClient } from '@/lib/api/recipe-management/client';
import type {
  RecipeDto,
  CreateRecipeRequest,
  UpdateRecipeRequest,
  SearchRecipesResponse,
  DifficultyLevel,
} from '@/types/recipe-management';

// Mock the client
jest.mock('@/lib/api/recipe-management/client', () => ({
  recipeManagementClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
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

describe('Recipes API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockRecipeDto: RecipeDto = {
    recipeId: 1,
    userId: 'user-123',
    title: 'Test Recipe',
    description: 'A delicious test recipe',
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

  describe('getAllRecipes', () => {
    it('should get all recipes without parameters', async () => {
      mockedClient.get.mockResolvedValue({ data: mockSearchResponse });

      const result = await recipesApi.getAllRecipes();

      expect(mockedClient.get).toHaveBeenCalledWith('/recipes');
      expect(result).toEqual(mockSearchResponse);
    });

    it('should get all recipes with pagination parameters', async () => {
      mockedClient.get.mockResolvedValue({ data: mockSearchResponse });

      const params = { page: 1, size: 10, sort: ['title,asc'] };
      await recipesApi.getAllRecipes(params);

      expect(mockedClient.get).toHaveBeenCalledWith(
        '/recipes?page=1&size=10&sort=title%2Casc'
      );
    });

    it('should handle errors', async () => {
      const error = new Error('Network error');
      mockedClient.get.mockRejectedValue(error);

      await expect(recipesApi.getAllRecipes()).rejects.toThrow('Network error');
    });
  });

  describe('createRecipe', () => {
    it('should create a new recipe', async () => {
      const createRequest: CreateRecipeRequest = {
        title: 'New Recipe',
        description: 'A new test recipe',
        servings: 4,
        difficulty: 'MEDIUM' as DifficultyLevel,
        prepTime: 20,
        cookTime: 40,
        ingredients: [
          {
            name: 'Test Ingredient',
            quantity: 1,
            unit: 'CUP',
            notes: 'Optional notes',
          },
        ],
        steps: [
          {
            stepNumber: 1,
            instruction: 'Test instruction',
            duration: 5,
          },
        ],
      };

      mockedClient.post.mockResolvedValue({ data: mockRecipeDto });

      const result = await recipesApi.createRecipe(createRequest);

      expect(mockedClient.post).toHaveBeenCalledWith('/recipes', createRequest);
      expect(result).toEqual(mockRecipeDto);
    });

    it('should handle creation errors', async () => {
      const createRequest: CreateRecipeRequest = {
        title: 'Invalid Recipe',
        servings: 0,
        ingredients: [],
        steps: [],
      };
      const error = new Error('Validation error');
      mockedClient.post.mockRejectedValue(error);

      await expect(recipesApi.createRecipe(createRequest)).rejects.toThrow(
        'Validation error'
      );
    });
  });

  describe('getRecipeById', () => {
    it('should get recipe by ID', async () => {
      mockedClient.get.mockResolvedValue({ data: mockRecipeDto });

      const result = await recipesApi.getRecipeById(1);

      expect(mockedClient.get).toHaveBeenCalledWith('/recipes/1');
      expect(result).toEqual(mockRecipeDto);
    });

    it('should handle not found error', async () => {
      const error = new Error('Recipe not found');
      mockedClient.get.mockRejectedValue(error);

      await expect(recipesApi.getRecipeById(999)).rejects.toThrow(
        'Recipe not found'
      );
    });
  });

  describe('updateRecipe', () => {
    it('should update existing recipe', async () => {
      const updateRequest: UpdateRecipeRequest = {
        title: 'Updated Recipe',
        description: 'Updated description',
        servings: 6,
        difficulty: 'HARD' as DifficultyLevel,
        prepTime: 25,
        cookTime: 45,
      };

      const updatedRecipe = { ...mockRecipeDto, ...updateRequest };
      mockedClient.put.mockResolvedValue({ data: updatedRecipe });

      const result = await recipesApi.updateRecipe(1, updateRequest);

      expect(mockedClient.put).toHaveBeenCalledWith(
        '/recipes/1',
        updateRequest
      );
      expect(result).toEqual(updatedRecipe);
    });

    it('should handle update errors', async () => {
      const updateRequest: UpdateRecipeRequest = {
        title: '',
      };
      const error = new Error('Invalid title');
      mockedClient.put.mockRejectedValue(error);

      await expect(recipesApi.updateRecipe(1, updateRequest)).rejects.toThrow(
        'Invalid title'
      );
    });
  });

  describe('deleteRecipe', () => {
    it('should delete recipe successfully', async () => {
      mockedClient.delete.mockResolvedValue({ data: undefined });

      await recipesApi.deleteRecipe(1);

      expect(mockedClient.delete).toHaveBeenCalledWith('/recipes/1');
    });

    it('should handle deletion errors', async () => {
      const error = new Error('Recipe not found');
      mockedClient.delete.mockRejectedValue(error);

      await expect(recipesApi.deleteRecipe(999)).rejects.toThrow(
        'Recipe not found'
      );
    });
  });

  describe('getRecipeDescription', () => {
    it('should get recipe description', async () => {
      const description = 'Detailed recipe description';
      mockedClient.get.mockResolvedValue({ data: description });

      const result = await recipesApi.getRecipeDescription(1);

      expect(mockedClient.get).toHaveBeenCalledWith('/recipes/1/description');
      expect(result).toBe(description);
    });

    it('should handle description fetch errors', async () => {
      const error = new Error('Description not available');
      mockedClient.get.mockRejectedValue(error);

      await expect(recipesApi.getRecipeDescription(1)).rejects.toThrow(
        'Description not available'
      );
    });
  });

  describe('getRecipeHistory', () => {
    it('should get recipe history', async () => {
      const history = 'Recipe revision history';
      mockedClient.get.mockResolvedValue({ data: history });

      const result = await recipesApi.getRecipeHistory(1);

      expect(mockedClient.get).toHaveBeenCalledWith('/recipes/1/history');
      expect(result).toBe(history);
    });

    it('should handle history fetch errors', async () => {
      const error = new Error('History not available');
      mockedClient.get.mockRejectedValue(error);

      await expect(recipesApi.getRecipeHistory(1)).rejects.toThrow(
        'History not available'
      );
    });
  });
});
