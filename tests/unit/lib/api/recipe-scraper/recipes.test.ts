import { recipesApi } from '@/lib/api/recipe-scraper/recipes';
import { RecipeScraperApiError } from '@/lib/api/recipe-scraper/client';
import type {
  CreateRecipeRequest,
  CreateRecipeResponse,
  PopularRecipesResponse,
  Recipe,
  WebRecipe,
  Ingredient,
  RecipeStep,
  Quantity,
  IngredientUnitEnum,
} from '@/types/recipe-scraper';

// Mock the client
jest.mock('@/lib/api/recipe-scraper/client', () => {
  const originalModule = jest.requireActual('@/lib/api/recipe-scraper/client');
  return {
    ...originalModule,
    recipeScraperClient: {
      post: jest.fn(),
      get: jest.fn(),
    },
    handleRecipeScraperApiError: jest
      .fn()
      .mockImplementation((error: unknown) => {
        if (error instanceof Error) {
          throw new originalModule.RecipeScraperApiError(error.message, 500);
        }
        throw new originalModule.RecipeScraperApiError('Unknown error', 500);
      }),
    buildQueryParams: originalModule.buildQueryParams,
  };
});

const mockClient =
  require('@/lib/api/recipe-scraper/client').recipeScraperClient;

describe('Recipe Scraper Recipes API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createRecipe', () => {
    it('should create a recipe successfully from URL', async () => {
      const mockRequest: CreateRecipeRequest = {
        recipeUrl: 'https://example.com/recipe/chocolate-cake',
      };

      const mockIngredient: Ingredient = {
        ingredientId: 1,
        name: 'flour',
        quantity: {
          amount: 2,
          measurement: 'CUP' as IngredientUnitEnum,
        },
      };

      const mockStep: RecipeStep = {
        stepNumber: 1,
        instruction: 'Preheat oven to 350°F',
        optional: false,
        timerSeconds: null,
        createdAt: '2025-01-31T12:00:00Z',
      };

      const mockRecipe: Recipe = {
        recipeId: 123,
        title: 'Chocolate Cake',
        description: 'A delicious chocolate cake',
        originUrl: 'https://example.com/recipe/chocolate-cake',
        servings: 8,
        preparationTime: 15,
        cookingTime: 30,
        difficulty: 'medium',
        ingredients: [mockIngredient],
        steps: [mockStep],
      };

      const mockResponse: CreateRecipeResponse = {
        recipe: mockRecipe,
      };

      mockClient.post.mockResolvedValue({ data: mockResponse });

      const result = await recipesApi.createRecipe(mockRequest);

      expect(mockClient.post).toHaveBeenCalledWith('/recipes', mockRequest);
      expect(result).toEqual(mockResponse);
      expect(result.recipe.recipeId).toBe(123);
      expect(result.recipe.title).toBe('Chocolate Cake');
      expect(result.recipe.ingredients).toHaveLength(1);
      expect(result.recipe.ingredients[0].name).toBe('flour');
      expect(result.recipe.steps).toHaveLength(1);
      expect(result.recipe.difficulty).toBe('medium');
    });

    it('should handle recipe with minimal data', async () => {
      const mockRequest: CreateRecipeRequest = {
        recipeUrl: 'https://example.com/simple-recipe',
      };

      const mockRecipe: Recipe = {
        title: 'Simple Recipe',
        ingredients: [],
        steps: [],
        description: null,
        originUrl: null,
        servings: null,
        preparationTime: null,
        cookingTime: null,
        difficulty: null,
      };

      const mockResponse: CreateRecipeResponse = {
        recipe: mockRecipe,
      };

      mockClient.post.mockResolvedValue({ data: mockResponse });

      const result = await recipesApi.createRecipe(mockRequest);

      expect(result.recipe.title).toBe('Simple Recipe');
      expect(result.recipe.ingredients).toEqual([]);
      expect(result.recipe.steps).toEqual([]);
      expect(result.recipe.recipeId).toBeUndefined();
    });

    it('should handle invalid URL error', async () => {
      const mockRequest: CreateRecipeRequest = {
        recipeUrl: 'not-a-valid-url',
      };

      mockClient.post.mockRejectedValue(new Error('Invalid recipe URL'));

      await expect(recipesApi.createRecipe(mockRequest)).rejects.toThrow(
        'Invalid recipe URL'
      );
      expect(mockClient.post).toHaveBeenCalledWith('/recipes', mockRequest);
    });

    it('should handle scraping error', async () => {
      const mockRequest: CreateRecipeRequest = {
        recipeUrl: 'https://example.com/broken-recipe',
      };

      mockClient.post.mockRejectedValue(
        new Error('Unable to scrape recipe from the provided URL')
      );

      await expect(recipesApi.createRecipe(mockRequest)).rejects.toThrow(
        'Unable to scrape recipe from the provided URL'
      );
    });
  });

  describe('getPopularRecipes', () => {
    it('should fetch popular recipes without parameters', async () => {
      const mockWebRecipe1: WebRecipe = {
        recipeName: 'Spaghetti Carbonara',
        url: 'https://example.com/carbonara',
      };

      const mockWebRecipe2: WebRecipe = {
        recipeName: 'Chicken Tikka Masala',
        url: 'https://example.com/tikka-masala',
      };

      const mockResponse: PopularRecipesResponse = {
        recipes: [mockWebRecipe1, mockWebRecipe2],
        limit: 10,
        offset: 0,
        count: 2,
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await recipesApi.getPopularRecipes();

      expect(mockClient.get).toHaveBeenCalledWith('/recipes/popular');
      expect(result).toEqual(mockResponse);
      expect(result.recipes).toHaveLength(2);
      expect(result.recipes[0].recipeName).toBe('Spaghetti Carbonara');
      expect(result.recipes[1].recipeName).toBe('Chicken Tikka Masala');
      expect(result.limit).toBe(10);
      expect(result.offset).toBe(0);
      expect(result.count).toBe(2);
    });

    it('should fetch popular recipes with pagination parameters', async () => {
      const mockResponse: PopularRecipesResponse = {
        recipes: [],
        limit: 20,
        offset: 40,
        count: 100,
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await recipesApi.getPopularRecipes({
        limit: 20,
        offset: 40,
      });

      expect(mockClient.get).toHaveBeenCalledWith(
        '/recipes/popular?limit=20&offset=40'
      );
      expect(result.limit).toBe(20);
      expect(result.offset).toBe(40);
      expect(result.count).toBe(100);
    });

    it('should fetch popular recipes with countOnly parameter', async () => {
      const mockResponse: PopularRecipesResponse = {
        recipes: [],
        limit: 0,
        offset: 0,
        count: 1500,
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await recipesApi.getPopularRecipes({
        countOnly: true,
      });

      expect(mockClient.get).toHaveBeenCalledWith(
        '/recipes/popular?countOnly=true'
      );
      expect(result.recipes).toEqual([]);
      expect(result.count).toBe(1500);
    });

    it('should fetch popular recipes with all parameters', async () => {
      const mockWebRecipe: WebRecipe = {
        recipeName: 'Pizza Margherita',
        url: 'https://example.com/pizza',
      };

      const mockResponse: PopularRecipesResponse = {
        recipes: [mockWebRecipe],
        limit: 5,
        offset: 10,
        count: 50,
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await recipesApi.getPopularRecipes({
        limit: 5,
        offset: 10,
        countOnly: false,
      });

      expect(mockClient.get).toHaveBeenCalledWith(
        '/recipes/popular?limit=5&offset=10&countOnly=false'
      );
      expect(result.recipes).toHaveLength(1);
      expect(result.recipes[0].recipeName).toBe('Pizza Margherita');
      expect(result.limit).toBe(5);
      expect(result.offset).toBe(10);
    });

    it('should handle empty results', async () => {
      const mockResponse: PopularRecipesResponse = {
        recipes: [],
        limit: 10,
        offset: 1000,
        count: 100,
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await recipesApi.getPopularRecipes({
        offset: 1000,
      });

      expect(result.recipes).toEqual([]);
      expect(result.count).toBe(100);
      expect(result.offset).toBe(1000);
    });

    it('should handle API errors', async () => {
      mockClient.get.mockRejectedValue(new Error('Service unavailable'));

      await expect(recipesApi.getPopularRecipes()).rejects.toThrow(
        'Service unavailable'
      );
      expect(mockClient.get).toHaveBeenCalledWith('/recipes/popular');
    });

    it('should handle invalid limit parameter', async () => {
      mockClient.get.mockRejectedValue(
        new Error('Limit must be between 1 and 100')
      );

      await expect(
        recipesApi.getPopularRecipes({ limit: 500 })
      ).rejects.toThrow('Limit must be between 1 and 100');
    });
  });
});
