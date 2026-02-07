import { nutritionApi } from '@/lib/api/recipe-scraper/nutrition';
import { RecipeScraperApiError } from '@/lib/api/recipe-scraper/client';
import { NutrientUnit } from '@/types/recipe-scraper';
import type {
  RecipeNutritionalInfoResponse,
  IngredientNutritionalInfoResponse,
  IngredientUnitEnum,
  MacroNutrients,
  Vitamins,
  Minerals,
  AllergenEnum,
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

describe('Recipe Scraper Nutrition API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getRecipeNutritionalInfo', () => {
    it('should fetch recipe nutritional info without parameters', async () => {
      const mockResponse: RecipeNutritionalInfoResponse = {
        ingredients: null,
        missingIngredients: null,
        total: null,
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await nutritionApi.getRecipeNutritionalInfo(123);

      expect(mockClient.get).toHaveBeenCalledWith(
        '/recipes/123/nutritional-info'
      );
      expect(result).toEqual(mockResponse);
    });

    it('should fetch recipe nutritional info with total only', async () => {
      const mockTotal: IngredientNutritionalInfoResponse = {
        quantity: {
          amount: 8,
          measurement: 'PIECE' as IngredientUnitEnum,
        },
        macroNutrients: {
          calories: { amount: 2400, measurement: NutrientUnit.KILOCALORIE },
          carbs: { amount: 320, measurement: NutrientUnit.GRAM },
          protein: { amount: 80, measurement: NutrientUnit.GRAM },
          cholesterol: { amount: 200, measurement: NutrientUnit.MILLIGRAM },
          sugar: { amount: 150, measurement: NutrientUnit.GRAM },
          addedSugar: { amount: 100, measurement: NutrientUnit.GRAM },
          fats: {
            total: { amount: 90, measurement: NutrientUnit.GRAM },
            saturated: { amount: 30, measurement: NutrientUnit.GRAM },
            trans: { amount: 0, measurement: NutrientUnit.GRAM },
          },
          fiber: { amount: 25, measurement: NutrientUnit.GRAM },
        },
      };

      const mockResponse: RecipeNutritionalInfoResponse = {
        ingredients: null,
        missingIngredients: null,
        total: mockTotal,
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await nutritionApi.getRecipeNutritionalInfo(123, {
        includeTotal: true,
      });

      expect(mockClient.get).toHaveBeenCalledWith(
        '/recipes/123/nutritional-info?includeTotal=true'
      );
      expect(result.total).toEqual(mockTotal);
      expect(result.total?.macroNutrients?.calories?.amount).toBe(2400);
    });

    it('should fetch recipe nutritional info with ingredients', async () => {
      const mockIngredientInfo: IngredientNutritionalInfoResponse = {
        quantity: {
          amount: 100,
          measurement: 'G' as IngredientUnitEnum,
        },
        usdaFoodDescription: 'All-purpose flour',
        macroNutrients: {
          calories: { amount: 364, measurement: NutrientUnit.KILOCALORIE },
          carbs: { amount: 76.3, measurement: NutrientUnit.GRAM },
          protein: { amount: 10.3, measurement: NutrientUnit.GRAM },
        },
      };

      const mockResponse: RecipeNutritionalInfoResponse = {
        ingredients: {
          flour: mockIngredientInfo,
          sugar: mockIngredientInfo,
        },
        missingIngredients: [3, 4],
        total: null,
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await nutritionApi.getRecipeNutritionalInfo(456, {
        includeIngredients: true,
      });

      expect(mockClient.get).toHaveBeenCalledWith(
        '/recipes/456/nutritional-info?includeIngredients=true'
      );
      expect(result.ingredients).toBeDefined();
      expect(result.ingredients?.flour).toEqual(mockIngredientInfo);
      expect(result.missingIngredients).toEqual([3, 4]);
    });

    it('should fetch recipe nutritional info with both parameters', async () => {
      const mockResponse: RecipeNutritionalInfoResponse = {
        ingredients: {},
        missingIngredients: [],
        total: {
          quantity: { amount: 1, measurement: 'UNIT' as IngredientUnitEnum },
        },
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await nutritionApi.getRecipeNutritionalInfo(789, {
        includeTotal: true,
        includeIngredients: true,
      });

      expect(mockClient.get).toHaveBeenCalledWith(
        '/recipes/789/nutritional-info?includeTotal=true&includeIngredients=true'
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle 404 error for non-existent recipe', async () => {
      mockClient.get.mockRejectedValue(new Error('Recipe not found'));

      await expect(nutritionApi.getRecipeNutritionalInfo(999)).rejects.toThrow(
        'Recipe not found'
      );
    });

    it('should handle API errors', async () => {
      mockClient.get.mockRejectedValue(new Error('Service unavailable'));

      await expect(nutritionApi.getRecipeNutritionalInfo(123)).rejects.toThrow(
        'Service unavailable'
      );
    });
  });

  describe('getIngredientNutritionalInfo', () => {
    it('should fetch ingredient nutritional info without parameters', async () => {
      const mockResponse: IngredientNutritionalInfoResponse = {
        quantity: {
          amount: 100,
          measurement: 'G' as IngredientUnitEnum,
        },
        macroNutrients: {
          calories: { amount: 52, measurement: NutrientUnit.KILOCALORIE },
          carbs: { amount: 14, measurement: NutrientUnit.GRAM },
          protein: { amount: 0.3, measurement: NutrientUnit.GRAM },
        },
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await nutritionApi.getIngredientNutritionalInfo(1);

      expect(mockClient.get).toHaveBeenCalledWith(
        '/ingredients/1/nutritional-info'
      );
      expect(result).toEqual(mockResponse);
      expect(result.quantity.amount).toBe(100);
    });

    it('should fetch ingredient nutritional info with amount and measurement', async () => {
      const mockResponse: IngredientNutritionalInfoResponse = {
        quantity: {
          amount: 2,
          measurement: 'CUP' as IngredientUnitEnum,
        },
        usdaFoodDescription: 'Whole milk',
        macroNutrients: {
          calories: { amount: 300, measurement: NutrientUnit.KILOCALORIE },
          carbs: { amount: 24, measurement: NutrientUnit.GRAM },
          protein: { amount: 16, measurement: NutrientUnit.GRAM },
          cholesterol: { amount: 48, measurement: NutrientUnit.MILLIGRAM },
        },
        vitamins: {
          vitaminA: { amount: 0.4, measurement: NutrientUnit.MILLIGRAM },
          vitaminD: { amount: 0.002, measurement: NutrientUnit.MILLIGRAM },
          vitaminB12: { amount: 0.002, measurement: NutrientUnit.MILLIGRAM },
        },
        minerals: {
          calcium: { amount: 600, measurement: NutrientUnit.MILLIGRAM },
          potassium: { amount: 700, measurement: NutrientUnit.MILLIGRAM },
        },
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await nutritionApi.getIngredientNutritionalInfo(2, {
        amount: 2,
        measurement: 'CUP' as IngredientUnitEnum,
      });

      expect(mockClient.get).toHaveBeenCalledWith(
        '/ingredients/2/nutritional-info?amount=2&measurement=CUP'
      );
      expect(result).toEqual(mockResponse);
      expect(result.quantity.amount).toBe(2);
      expect(result.quantity.measurement).toBe('CUP');
      expect(result.vitamins?.vitaminD?.amount).toBe(0.002);
      expect(result.minerals?.calcium?.amount).toBe(600);
    });

    it('should fetch ingredient nutritional info with only amount', async () => {
      const mockResponse: IngredientNutritionalInfoResponse = {
        quantity: {
          amount: 150,
        },
        macroNutrients: {
          calories: { amount: 200, measurement: NutrientUnit.KILOCALORIE },
        },
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await nutritionApi.getIngredientNutritionalInfo(3, {
        amount: 150,
      });

      expect(mockClient.get).toHaveBeenCalledWith(
        '/ingredients/3/nutritional-info?amount=150'
      );
      expect(result.quantity.amount).toBe(150);
      expect(result.quantity.measurement).toBeUndefined();
    });

    it('should fetch ingredient nutritional info with only measurement', async () => {
      const mockResponse: IngredientNutritionalInfoResponse = {
        quantity: {
          amount: 1,
          measurement: 'TBSP' as IngredientUnitEnum,
        },
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await nutritionApi.getIngredientNutritionalInfo(4, {
        measurement: 'TBSP' as IngredientUnitEnum,
      });

      expect(mockClient.get).toHaveBeenCalledWith(
        '/ingredients/4/nutritional-info?measurement=TBSP'
      );
      expect(result.quantity.measurement).toBe('TBSP');
    });

    it('should handle comprehensive nutritional data', async () => {
      const mockResponse: IngredientNutritionalInfoResponse = {
        quantity: {
          amount: 100,
          measurement: 'G' as IngredientUnitEnum,
        },
        usdaFoodDescription: 'Raw almonds',
        macroNutrients: {
          calories: { amount: 579, measurement: NutrientUnit.KILOCALORIE },
          carbs: { amount: 21.6, measurement: NutrientUnit.GRAM },
          protein: { amount: 21.2, measurement: NutrientUnit.GRAM },
          cholesterol: { amount: 0, measurement: NutrientUnit.MILLIGRAM },
          sugar: { amount: 4.4, measurement: NutrientUnit.GRAM },
          addedSugar: { amount: 0, measurement: NutrientUnit.GRAM },
          fats: {
            total: { amount: 49.9, measurement: NutrientUnit.GRAM },
            saturated: { amount: 3.8, measurement: NutrientUnit.GRAM },
            monounsaturated: { amount: 31.6, measurement: NutrientUnit.GRAM },
            polyunsaturated: { amount: 12.3, measurement: NutrientUnit.GRAM },
            trans: { amount: 0, measurement: NutrientUnit.GRAM },
          },
          fiber: { amount: 12.5, measurement: NutrientUnit.GRAM },
        },
        vitamins: {
          vitaminA: { amount: 0, measurement: NutrientUnit.MILLIGRAM },
          vitaminB6: { amount: 0.137, measurement: NutrientUnit.MILLIGRAM },
          vitaminB12: { amount: 0, measurement: NutrientUnit.MILLIGRAM },
          vitaminC: { amount: 0, measurement: NutrientUnit.MILLIGRAM },
          vitaminD: { amount: 0, measurement: NutrientUnit.MILLIGRAM },
          vitaminE: { amount: 25.6, measurement: NutrientUnit.MILLIGRAM },
          vitaminK: { amount: 0, measurement: NutrientUnit.MILLIGRAM },
        },
        minerals: {
          calcium: { amount: 269, measurement: NutrientUnit.MILLIGRAM },
          iron: { amount: 3.7, measurement: NutrientUnit.MILLIGRAM },
          magnesium: { amount: 270, measurement: NutrientUnit.MILLIGRAM },
          potassium: { amount: 733, measurement: NutrientUnit.MILLIGRAM },
          zinc: { amount: 3.1, measurement: NutrientUnit.MILLIGRAM },
        },
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await nutritionApi.getIngredientNutritionalInfo(5, {
        amount: 100,
        measurement: 'G' as IngredientUnitEnum,
      });

      expect(result.usdaFoodDescription).toBe('Raw almonds');
      expect(result.macroNutrients?.fats?.polyunsaturated?.amount).toBe(12.3);
      expect(result.vitamins?.vitaminE?.amount).toBe(25.6);
      expect(result.minerals?.magnesium?.amount).toBe(270);
    });

    it('should handle 404 error for non-existent ingredient', async () => {
      mockClient.get.mockRejectedValue(new Error('Ingredient not found'));

      await expect(
        nutritionApi.getIngredientNutritionalInfo(999)
      ).rejects.toThrow('Ingredient not found');
    });

    it('should handle invalid measurement unit', async () => {
      mockClient.get.mockRejectedValue(new Error('Invalid measurement unit'));

      await expect(
        nutritionApi.getIngredientNutritionalInfo(1, {
          measurement: 'INVALID' as IngredientUnitEnum,
        })
      ).rejects.toThrow('Invalid measurement unit');
    });
  });
});
