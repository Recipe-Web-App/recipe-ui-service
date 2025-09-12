import { shoppingApi } from '@/lib/api/recipe-scraper/shopping';
import { RecipeScraperApiError } from '@/lib/api/recipe-scraper/client';
import type {
  IngredientShoppingInfoResponse,
  RecipeShoppingInfoResponse,
  IngredientUnitEnum,
  Quantity,
} from '@/types/recipe-scraper';

// Mock the client
jest.mock('@/lib/api/recipe-scraper/client', () => {
  const originalModule = jest.requireActual('@/lib/api/recipe-scraper/client');
  return {
    ...originalModule,
    recipeScraperClient: {
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

describe('Recipe Scraper Shopping API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getIngredientShoppingInfo', () => {
    it('should fetch ingredient shopping info without parameters', async () => {
      const mockResponse: IngredientShoppingInfoResponse = {
        ingredientName: 'Tomatoes',
        quantity: {
          amount: 500,
          measurement: 'G' as IngredientUnitEnum,
        },
        estimatedPrice: '$2.99',
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await shoppingApi.getIngredientShoppingInfo(1);

      expect(mockClient.get).toHaveBeenCalledWith(
        '/api/recipe-scraper/ingredients/1/shopping-info'
      );
      expect(result).toEqual(mockResponse);
      expect(result.ingredientName).toBe('Tomatoes');
      expect(result.quantity.amount).toBe(500);
      expect(result.quantity.measurement).toBe('G');
      expect(result.estimatedPrice).toBe('$2.99');
    });

    it('should fetch ingredient shopping info with amount parameter', async () => {
      const mockResponse: IngredientShoppingInfoResponse = {
        ingredientName: 'Flour',
        quantity: {
          amount: 2,
          measurement: 'CUP' as IngredientUnitEnum,
        },
        estimatedPrice: '$1.50',
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await shoppingApi.getIngredientShoppingInfo(2, {
        amount: 2,
      });

      expect(mockClient.get).toHaveBeenCalledWith(
        '/api/recipe-scraper/ingredients/2/shopping-info?amount=2'
      );
      expect(result.quantity.amount).toBe(2);
    });

    it('should fetch ingredient shopping info with measurement parameter', async () => {
      const mockResponse: IngredientShoppingInfoResponse = {
        ingredientName: 'Milk',
        quantity: {
          amount: 1,
          measurement: 'L' as IngredientUnitEnum,
        },
        estimatedPrice: '$3.25',
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await shoppingApi.getIngredientShoppingInfo(3, {
        measurement: 'L' as IngredientUnitEnum,
      });

      expect(mockClient.get).toHaveBeenCalledWith(
        '/api/recipe-scraper/ingredients/3/shopping-info?measurement=L'
      );
      expect(result.quantity.measurement).toBe('L');
    });

    it('should fetch ingredient shopping info with both parameters', async () => {
      const mockResponse: IngredientShoppingInfoResponse = {
        ingredientName: 'Sugar',
        quantity: {
          amount: 3,
          measurement: 'TBSP' as IngredientUnitEnum,
        },
        estimatedPrice: '$0.25',
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await shoppingApi.getIngredientShoppingInfo(4, {
        amount: 3,
        measurement: 'TBSP' as IngredientUnitEnum,
      });

      expect(mockClient.get).toHaveBeenCalledWith(
        '/api/recipe-scraper/ingredients/4/shopping-info?amount=3&measurement=TBSP'
      );
      expect(result.quantity.amount).toBe(3);
      expect(result.quantity.measurement).toBe('TBSP');
    });

    it('should handle ingredient with null estimated price', async () => {
      const mockResponse: IngredientShoppingInfoResponse = {
        ingredientName: 'Exotic Spice',
        quantity: {
          amount: 1,
          measurement: 'PINCH' as IngredientUnitEnum,
        },
        estimatedPrice: null,
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await shoppingApi.getIngredientShoppingInfo(5);

      expect(result.estimatedPrice).toBeNull();
      expect(result.ingredientName).toBe('Exotic Spice');
    });

    it('should handle ingredient with undefined estimated price', async () => {
      const mockResponse: IngredientShoppingInfoResponse = {
        ingredientName: 'Seasonal Item',
        quantity: {
          amount: 250,
          measurement: 'G' as IngredientUnitEnum,
        },
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await shoppingApi.getIngredientShoppingInfo(6);

      expect(result.estimatedPrice).toBeUndefined();
    });

    it('should handle 404 error for non-existent ingredient', async () => {
      mockClient.get.mockRejectedValue(new Error('Ingredient not found'));

      await expect(shoppingApi.getIngredientShoppingInfo(999)).rejects.toThrow(
        'Ingredient not found'
      );
    });

    it('should handle API errors', async () => {
      mockClient.get.mockRejectedValue(new Error('Service unavailable'));

      await expect(shoppingApi.getIngredientShoppingInfo(1)).rejects.toThrow(
        'Service unavailable'
      );
    });
  });

  describe('getRecipeShoppingInfo', () => {
    it('should fetch recipe shopping info successfully', async () => {
      const mockIngredient1: IngredientShoppingInfoResponse = {
        ingredientName: 'Chicken Breast',
        quantity: {
          amount: 500,
          measurement: 'G' as IngredientUnitEnum,
        },
        estimatedPrice: '$8.99',
      };

      const mockIngredient2: IngredientShoppingInfoResponse = {
        ingredientName: 'Rice',
        quantity: {
          amount: 2,
          measurement: 'CUP' as IngredientUnitEnum,
        },
        estimatedPrice: '$1.50',
      };

      const mockIngredient3: IngredientShoppingInfoResponse = {
        ingredientName: 'Bell Peppers',
        quantity: {
          amount: 2,
          measurement: 'PIECE' as IngredientUnitEnum,
        },
        estimatedPrice: '$3.99',
      };

      const mockResponse: RecipeShoppingInfoResponse = {
        recipeId: 123,
        ingredients: {
          'chicken-breast': mockIngredient1,
          rice: mockIngredient2,
          'bell-peppers': mockIngredient3,
        },
        totalEstimatedCost: '$14.48',
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await shoppingApi.getRecipeShoppingInfo(123);

      expect(mockClient.get).toHaveBeenCalledWith(
        '/api/recipe-scraper/recipes/123/shopping-info'
      );
      expect(result).toEqual(mockResponse);
      expect(result.recipeId).toBe(123);
      expect(result.totalEstimatedCost).toBe('$14.48');
      expect(Object.keys(result.ingredients)).toHaveLength(3);
      expect(result.ingredients['chicken-breast'].estimatedPrice).toBe('$8.99');
      expect(result.ingredients.rice.estimatedPrice).toBe('$1.50');
      expect(result.ingredients['bell-peppers'].estimatedPrice).toBe('$3.99');
    });

    it('should handle recipe with ingredients without prices', async () => {
      const mockIngredient1: IngredientShoppingInfoResponse = {
        ingredientName: 'Salt',
        quantity: {
          amount: 1,
          measurement: 'TSP' as IngredientUnitEnum,
        },
        estimatedPrice: null,
      };

      const mockIngredient2: IngredientShoppingInfoResponse = {
        ingredientName: 'Water',
        quantity: {
          amount: 2,
          measurement: 'CUP' as IngredientUnitEnum,
        },
      };

      const mockResponse: RecipeShoppingInfoResponse = {
        recipeId: 456,
        ingredients: {
          salt: mockIngredient1,
          water: mockIngredient2,
        },
        totalEstimatedCost: '$0.00',
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await shoppingApi.getRecipeShoppingInfo(456);

      expect(result.ingredients.salt.estimatedPrice).toBeNull();
      expect(result.ingredients.water.estimatedPrice).toBeUndefined();
      expect(result.totalEstimatedCost).toBe('$0.00');
    });

    it('should handle recipe with single ingredient', async () => {
      const mockIngredient: IngredientShoppingInfoResponse = {
        ingredientName: 'Apple',
        quantity: {
          amount: 1,
          measurement: 'PIECE' as IngredientUnitEnum,
        },
        estimatedPrice: '$0.75',
      };

      const mockResponse: RecipeShoppingInfoResponse = {
        recipeId: 789,
        ingredients: {
          apple: mockIngredient,
        },
        totalEstimatedCost: '$0.75',
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await shoppingApi.getRecipeShoppingInfo(789);

      expect(Object.keys(result.ingredients)).toHaveLength(1);
      expect(result.ingredients.apple.ingredientName).toBe('Apple');
      expect(result.totalEstimatedCost).toBe('$0.75');
    });

    it('should handle recipe with empty ingredients', async () => {
      const mockResponse: RecipeShoppingInfoResponse = {
        recipeId: 101,
        ingredients: {},
        totalEstimatedCost: '$0.00',
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await shoppingApi.getRecipeShoppingInfo(101);

      expect(Object.keys(result.ingredients)).toHaveLength(0);
      expect(result.totalEstimatedCost).toBe('$0.00');
    });

    it('should handle complex ingredient names as keys', async () => {
      const mockIngredient: IngredientShoppingInfoResponse = {
        ingredientName: 'Extra Virgin Olive Oil',
        quantity: {
          amount: 2,
          measurement: 'TBSP' as IngredientUnitEnum,
        },
        estimatedPrice: '$0.50',
      };

      const mockResponse: RecipeShoppingInfoResponse = {
        recipeId: 202,
        ingredients: {
          'extra-virgin-olive-oil': mockIngredient,
        },
        totalEstimatedCost: '$0.50',
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await shoppingApi.getRecipeShoppingInfo(202);

      expect(result.ingredients['extra-virgin-olive-oil'].ingredientName).toBe(
        'Extra Virgin Olive Oil'
      );
    });

    it('should handle 404 error for non-existent recipe', async () => {
      mockClient.get.mockRejectedValue(new Error('Recipe not found'));

      await expect(shoppingApi.getRecipeShoppingInfo(9999)).rejects.toThrow(
        'Recipe not found'
      );
    });

    it('should handle API errors', async () => {
      mockClient.get.mockRejectedValue(new Error('Service unavailable'));

      await expect(shoppingApi.getRecipeShoppingInfo(123)).rejects.toThrow(
        'Service unavailable'
      );
    });

    it('should handle recipe with mixed price availability', async () => {
      const mockIngredient1: IngredientShoppingInfoResponse = {
        ingredientName: 'Pasta',
        quantity: {
          amount: 200,
          measurement: 'G' as IngredientUnitEnum,
        },
        estimatedPrice: '$1.99',
      };

      const mockIngredient2: IngredientShoppingInfoResponse = {
        ingredientName: 'Garlic',
        quantity: {
          amount: 3,
          measurement: 'CLOVE' as IngredientUnitEnum,
        },
        estimatedPrice: null,
      };

      const mockIngredient3: IngredientShoppingInfoResponse = {
        ingredientName: 'Parmesan Cheese',
        quantity: {
          amount: 50,
          measurement: 'G' as IngredientUnitEnum,
        },
        estimatedPrice: '$4.50',
      };

      const mockResponse: RecipeShoppingInfoResponse = {
        recipeId: 303,
        ingredients: {
          pasta: mockIngredient1,
          garlic: mockIngredient2,
          'parmesan-cheese': mockIngredient3,
        },
        totalEstimatedCost: '$6.49',
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await shoppingApi.getRecipeShoppingInfo(303);

      expect(result.ingredients.pasta.estimatedPrice).toBe('$1.99');
      expect(result.ingredients.garlic.estimatedPrice).toBeNull();
      expect(result.ingredients['parmesan-cheese'].estimatedPrice).toBe(
        '$4.50'
      );
      expect(result.totalEstimatedCost).toBe('$6.49');
    });
  });
});
