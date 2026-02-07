import { allergensApi } from '@/lib/api/recipe-scraper/allergens';
import type {
  IngredientAllergenResponse,
  RecipeAllergenResponse,
  AllergenInfo,
} from '@/types/recipe-scraper';
import {
  AllergenEnum,
  AllergenPresenceTypeEnum,
  AllergenDataSourceEnum,
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

describe('Recipe Scraper Allergens API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getIngredientAllergens', () => {
    it('should fetch allergens for an ingredient', async () => {
      const mockAllergen: AllergenInfo = {
        allergen: AllergenEnum.GLUTEN,
        presenceType: AllergenPresenceTypeEnum.CONTAINS,
        confidenceScore: 0.95,
        sourceNotes: 'USDA database match',
      };

      const mockResponse: IngredientAllergenResponse = {
        ingredientId: 1,
        ingredientName: 'wheat flour',
        usdaFoodDescription: 'Wheat flour, white, all-purpose',
        allergens: [mockAllergen],
        dataSource: AllergenDataSourceEnum.USDA,
        overallConfidence: 0.95,
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await allergensApi.getIngredientAllergens(1);

      expect(mockClient.get).toHaveBeenCalledWith('/ingredients/1/allergens');
      expect(result).toEqual(mockResponse);
      expect(result.allergens).toHaveLength(1);
      expect(result.allergens[0].allergen).toBe(AllergenEnum.GLUTEN);
      expect(result.allergens[0].presenceType).toBe(
        AllergenPresenceTypeEnum.CONTAINS
      );
    });

    it('should handle ingredient with multiple allergens', async () => {
      const mockResponse: IngredientAllergenResponse = {
        ingredientId: 2,
        ingredientName: 'chocolate chip cookie',
        allergens: [
          {
            allergen: AllergenEnum.GLUTEN,
            presenceType: AllergenPresenceTypeEnum.CONTAINS,
            confidenceScore: 0.98,
          },
          {
            allergen: AllergenEnum.MILK,
            presenceType: AllergenPresenceTypeEnum.CONTAINS,
            confidenceScore: 0.95,
          },
          {
            allergen: AllergenEnum.SOYBEANS,
            presenceType: AllergenPresenceTypeEnum.MAY_CONTAIN,
            confidenceScore: 0.6,
          },
        ],
        dataSource: AllergenDataSourceEnum.USDA,
        overallConfidence: 0.84,
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await allergensApi.getIngredientAllergens(2);

      expect(result.allergens).toHaveLength(3);
      expect(result.overallConfidence).toBe(0.84);
    });

    it('should handle ingredient with no allergens', async () => {
      const mockResponse: IngredientAllergenResponse = {
        ingredientId: 3,
        ingredientName: 'salt',
        allergens: [],
        dataSource: AllergenDataSourceEnum.USDA,
        overallConfidence: 1.0,
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await allergensApi.getIngredientAllergens(3);

      expect(result.allergens).toEqual([]);
      expect(result.overallConfidence).toBe(1.0);
    });

    it('should handle ingredient with null optional fields', async () => {
      const mockResponse: IngredientAllergenResponse = {
        ingredientId: null,
        ingredientName: null,
        usdaFoodDescription: null,
        allergens: [],
        dataSource: null,
        overallConfidence: null,
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await allergensApi.getIngredientAllergens(99);

      expect(result.ingredientId).toBeNull();
      expect(result.ingredientName).toBeNull();
      expect(result.dataSource).toBeNull();
    });

    it('should handle 404 error for non-existent ingredient', async () => {
      mockClient.get.mockRejectedValue(new Error('Ingredient not found'));

      await expect(allergensApi.getIngredientAllergens(999)).rejects.toThrow(
        'Ingredient not found'
      );
    });

    it('should handle API errors', async () => {
      mockClient.get.mockRejectedValue(new Error('Service unavailable'));

      await expect(allergensApi.getIngredientAllergens(1)).rejects.toThrow(
        'Service unavailable'
      );
    });
  });

  describe('getRecipeAllergens', () => {
    it('should fetch allergens for a recipe without parameters', async () => {
      const mockResponse: RecipeAllergenResponse = {
        contains: [AllergenEnum.GLUTEN, AllergenEnum.MILK],
        mayContain: [AllergenEnum.SOYBEANS],
        allergens: [
          {
            allergen: AllergenEnum.GLUTEN,
            presenceType: AllergenPresenceTypeEnum.CONTAINS,
            confidenceScore: 0.97,
          },
          {
            allergen: AllergenEnum.MILK,
            presenceType: AllergenPresenceTypeEnum.CONTAINS,
            confidenceScore: 0.95,
          },
          {
            allergen: AllergenEnum.SOYBEANS,
            presenceType: AllergenPresenceTypeEnum.MAY_CONTAIN,
            confidenceScore: 0.55,
          },
        ],
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await allergensApi.getRecipeAllergens(1);

      expect(mockClient.get).toHaveBeenCalledWith('/recipes/1/allergens');
      expect(result.contains).toEqual([AllergenEnum.GLUTEN, AllergenEnum.MILK]);
      expect(result.mayContain).toEqual([AllergenEnum.SOYBEANS]);
      expect(result.allergens).toHaveLength(3);
    });

    it('should fetch allergens with includeIngredientDetails parameter', async () => {
      const mockResponse: RecipeAllergenResponse = {
        contains: [AllergenEnum.GLUTEN],
        mayContain: [],
        allergens: [
          {
            allergen: AllergenEnum.GLUTEN,
            presenceType: AllergenPresenceTypeEnum.CONTAINS,
          },
        ],
        ingredientDetails: {
          'wheat flour': {
            ingredientId: 1,
            ingredientName: 'wheat flour',
            allergens: [
              {
                allergen: AllergenEnum.GLUTEN,
                presenceType: AllergenPresenceTypeEnum.CONTAINS,
                confidenceScore: 0.98,
              },
            ],
            dataSource: AllergenDataSourceEnum.USDA,
            overallConfidence: 0.98,
          },
        },
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await allergensApi.getRecipeAllergens(1, {
        includeIngredientDetails: true,
      });

      expect(mockClient.get).toHaveBeenCalledWith(
        '/recipes/1/allergens?includeIngredientDetails=true'
      );
      expect(result.ingredientDetails).toBeDefined();
      expect(result.ingredientDetails?.['wheat flour']?.allergens).toHaveLength(
        1
      );
    });

    it('should handle recipe with no allergens', async () => {
      const mockResponse: RecipeAllergenResponse = {
        contains: [],
        mayContain: [],
        allergens: [],
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await allergensApi.getRecipeAllergens(2);

      expect(result.contains).toEqual([]);
      expect(result.mayContain).toEqual([]);
      expect(result.allergens).toEqual([]);
    });

    it('should handle recipe with missing ingredients', async () => {
      const mockResponse: RecipeAllergenResponse = {
        contains: [AllergenEnum.MILK],
        mayContain: [],
        allergens: [
          {
            allergen: AllergenEnum.MILK,
            presenceType: AllergenPresenceTypeEnum.CONTAINS,
          },
        ],
        missingIngredients: [5, 8, 12],
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await allergensApi.getRecipeAllergens(3);

      expect(result.missingIngredients).toEqual([5, 8, 12]);
    });

    it('should handle 404 error for non-existent recipe', async () => {
      mockClient.get.mockRejectedValue(new Error('Recipe not found'));

      await expect(allergensApi.getRecipeAllergens(999)).rejects.toThrow(
        'Recipe not found'
      );
    });

    it('should handle API errors', async () => {
      mockClient.get.mockRejectedValue(new Error('Service unavailable'));

      await expect(allergensApi.getRecipeAllergens(1)).rejects.toThrow(
        'Service unavailable'
      );
    });
  });
});
