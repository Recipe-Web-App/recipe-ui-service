import { ingredientsApi } from '@/lib/api/recipe-scraper/ingredients';
import { RecipeScraperApiError } from '@/lib/api/recipe-scraper/client';
import type {
  RecommendedSubstitutionsResponse,
  Ingredient,
  IngredientSubstitution,
  ConversionRatio,
  Quantity,
  IngredientUnitEnum,
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

describe('Recipe Scraper Ingredients API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getRecommendedSubstitutions', () => {
    it('should fetch substitutions without parameters', async () => {
      const mockIngredient: Ingredient = {
        ingredientId: 1,
        name: 'butter',
        quantity: {
          amount: 100,
          measurement: 'G' as IngredientUnitEnum,
        },
      };

      const mockSubstitution1: IngredientSubstitution = {
        ingredient: 'margarine',
        quantity: {
          amount: 100,
          measurement: 'G' as IngredientUnitEnum,
        },
        conversionRatio: {
          ratio: 1.0,
          measurement: 'G' as IngredientUnitEnum,
        },
      };

      const mockSubstitution2: IngredientSubstitution = {
        ingredient: 'coconut oil',
        quantity: {
          amount: 80,
          measurement: 'G' as IngredientUnitEnum,
        },
        conversionRatio: {
          ratio: 0.8,
          measurement: 'G' as IngredientUnitEnum,
        },
      };

      const mockResponse: RecommendedSubstitutionsResponse = {
        ingredient: mockIngredient,
        recommendedSubstitutions: [mockSubstitution1, mockSubstitution2],
        limit: 10,
        offset: 0,
        count: 2,
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await ingredientsApi.getRecommendedSubstitutions(1);

      expect(mockClient.get).toHaveBeenCalledWith(
        '/ingredients/1/recommended-substitutions'
      );
      expect(result).toEqual(mockResponse);
      expect(result.ingredient.name).toBe('butter');
      expect(result.recommendedSubstitutions).toHaveLength(2);
      expect(result.recommendedSubstitutions[0].ingredient).toBe('margarine');
      expect(result.recommendedSubstitutions[0].conversionRatio.ratio).toBe(
        1.0
      );
    });

    it('should fetch substitutions with pagination parameters', async () => {
      const mockResponse: RecommendedSubstitutionsResponse = {
        ingredient: {
          ingredientId: 2,
          name: 'eggs',
        },
        recommendedSubstitutions: [],
        limit: 5,
        offset: 10,
        count: 15,
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await ingredientsApi.getRecommendedSubstitutions(2, {
        limit: 5,
        offset: 10,
      });

      expect(mockClient.get).toHaveBeenCalledWith(
        '/ingredients/2/recommended-substitutions?limit=5&offset=10'
      );
      expect(result.limit).toBe(5);
      expect(result.offset).toBe(10);
      expect(result.count).toBe(15);
    });

    it('should fetch substitutions with count_only parameter', async () => {
      const mockResponse: RecommendedSubstitutionsResponse = {
        ingredient: {
          ingredientId: 3,
          name: 'milk',
        },
        recommendedSubstitutions: [],
        count: 8,
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await ingredientsApi.getRecommendedSubstitutions(3, {
        count_only: true,
      });

      expect(mockClient.get).toHaveBeenCalledWith(
        '/ingredients/3/recommended-substitutions?count_only=true'
      );
      expect(result.recommendedSubstitutions).toEqual([]);
      expect(result.count).toBe(8);
    });

    it('should fetch substitutions with amount and measurement', async () => {
      const mockSubstitution: IngredientSubstitution = {
        ingredient: 'applesauce',
        quantity: {
          amount: 0.5,
          measurement: 'CUP' as IngredientUnitEnum,
        },
        conversionRatio: {
          ratio: 0.5,
          measurement: 'CUP' as IngredientUnitEnum,
        },
      };

      const mockResponse: RecommendedSubstitutionsResponse = {
        ingredient: {
          ingredientId: 4,
          name: 'oil',
          quantity: {
            amount: 1,
            measurement: 'CUP' as IngredientUnitEnum,
          },
        },
        recommendedSubstitutions: [mockSubstitution],
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await ingredientsApi.getRecommendedSubstitutions(4, {
        amount: 1,
        measurement: 'CUP' as IngredientUnitEnum,
      });

      expect(mockClient.get).toHaveBeenCalledWith(
        '/ingredients/4/recommended-substitutions?amount=1&measurement=CUP'
      );
      expect(result.ingredient.quantity?.amount).toBe(1);
      expect(result.ingredient.quantity?.measurement).toBe('CUP');
      expect(result.recommendedSubstitutions[0].quantity?.amount).toBe(0.5);
    });

    it('should fetch substitutions with all parameters', async () => {
      const mockSubstitution: IngredientSubstitution = {
        ingredient: 'Greek yogurt',
        quantity: {
          amount: 2,
          measurement: 'TBSP' as IngredientUnitEnum,
        },
        conversionRatio: {
          ratio: 1.0,
          measurement: 'TBSP' as IngredientUnitEnum,
        },
      };

      const mockResponse: RecommendedSubstitutionsResponse = {
        ingredient: {
          ingredientId: 5,
          name: 'sour cream',
          quantity: {
            amount: 2,
            measurement: 'TBSP' as IngredientUnitEnum,
          },
        },
        recommendedSubstitutions: [mockSubstitution],
        limit: 3,
        offset: 0,
        count: 5,
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await ingredientsApi.getRecommendedSubstitutions(5, {
        limit: 3,
        offset: 0,
        count_only: false,
        amount: 2,
        measurement: 'TBSP' as IngredientUnitEnum,
      });

      expect(mockClient.get).toHaveBeenCalledWith(
        '/ingredients/5/recommended-substitutions?limit=3&offset=0&count_only=false&amount=2&measurement=TBSP'
      );
      expect(result.recommendedSubstitutions).toHaveLength(1);
      expect(result.recommendedSubstitutions[0].ingredient).toBe(
        'Greek yogurt'
      );
    });

    it('should handle substitutions with null quantities', async () => {
      const mockSubstitution: IngredientSubstitution = {
        ingredient: 'vanilla extract',
        quantity: null,
        conversionRatio: {
          ratio: 1.0,
          measurement: 'TSP' as IngredientUnitEnum,
        },
      };

      const mockResponse: RecommendedSubstitutionsResponse = {
        ingredient: {
          ingredientId: 6,
          name: 'vanilla essence',
          quantity: null,
        },
        recommendedSubstitutions: [mockSubstitution],
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await ingredientsApi.getRecommendedSubstitutions(6);

      expect(result.ingredient.quantity).toBeNull();
      expect(result.recommendedSubstitutions[0].quantity).toBeNull();
      expect(result.recommendedSubstitutions[0].conversionRatio.ratio).toBe(
        1.0
      );
    });

    it('should handle complex conversion ratios', async () => {
      const mockSubstitution: IngredientSubstitution = {
        ingredient: 'honey',
        quantity: {
          amount: 0.75,
          measurement: 'CUP' as IngredientUnitEnum,
        },
        conversionRatio: {
          ratio: 0.75,
          measurement: 'CUP' as IngredientUnitEnum,
        },
      };

      const mockResponse: RecommendedSubstitutionsResponse = {
        ingredient: {
          ingredientId: 7,
          name: 'sugar',
          quantity: {
            amount: 1,
            measurement: 'CUP' as IngredientUnitEnum,
          },
        },
        recommendedSubstitutions: [mockSubstitution],
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await ingredientsApi.getRecommendedSubstitutions(7, {
        amount: 1,
        measurement: 'CUP' as IngredientUnitEnum,
      });

      expect(result.recommendedSubstitutions[0].conversionRatio.ratio).toBe(
        0.75
      );
      expect(result.recommendedSubstitutions[0].quantity?.amount).toBe(0.75);
    });

    it('should handle 404 error for non-existent ingredient', async () => {
      mockClient.get.mockRejectedValue(new Error('Ingredient not found'));

      await expect(
        ingredientsApi.getRecommendedSubstitutions(999)
      ).rejects.toThrow('Ingredient not found');
    });

    it('should handle empty substitutions list', async () => {
      const mockResponse: RecommendedSubstitutionsResponse = {
        ingredient: {
          ingredientId: 8,
          name: 'exotic spice',
        },
        recommendedSubstitutions: [],
        count: 0,
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await ingredientsApi.getRecommendedSubstitutions(8);

      expect(result.recommendedSubstitutions).toEqual([]);
      expect(result.count).toBe(0);
    });

    it('should handle API errors', async () => {
      mockClient.get.mockRejectedValue(new Error('Service unavailable'));

      await expect(
        ingredientsApi.getRecommendedSubstitutions(1)
      ).rejects.toThrow('Service unavailable');
    });
  });
});
