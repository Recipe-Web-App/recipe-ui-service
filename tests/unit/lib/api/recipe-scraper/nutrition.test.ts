import { nutritionApi } from '@/lib/api/recipe-scraper/nutrition';
import { RecipeScraperApiError } from '@/lib/api/recipe-scraper/client';
import type {
  RecipeNutritionalInfoResponse,
  IngredientNutritionalInfoResponse,
  IngredientUnitEnum,
  MacroNutrients,
  Vitamins,
  Minerals,
  IngredientClassification,
  AllergenEnum,
  FoodGroupEnum,
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
        '/api/recipe-scraper/recipes/123/nutritional-info'
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
          calories: 2400,
          carbsG: '320',
          proteinG: '80',
          cholesterolMg: '200',
          sugars: {
            sugarG: '150',
            addedSugarsG: '100',
          },
          fats: {
            fatG: '90',
            saturatedFatG: '30',
            transFatG: '0',
          },
          fibers: {
            fiberG: '25',
            solubleFiberG: '10',
            insolubleFiberG: '15',
          },
        },
      };

      const mockResponse: RecipeNutritionalInfoResponse = {
        ingredients: null,
        missingIngredients: null,
        total: mockTotal,
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await nutritionApi.getRecipeNutritionalInfo(123, {
        include_total: true,
      });

      expect(mockClient.get).toHaveBeenCalledWith(
        '/api/recipe-scraper/recipes/123/nutritional-info?include_total=true'
      );
      expect(result.total).toEqual(mockTotal);
      expect(result.total?.macroNutrients?.calories).toBe(2400);
    });

    it('should fetch recipe nutritional info with ingredients', async () => {
      const mockIngredientInfo: IngredientNutritionalInfoResponse = {
        quantity: {
          amount: 100,
          measurement: 'G' as IngredientUnitEnum,
        },
        classification: {
          allergies: ['GLUTEN' as AllergenEnum, 'WHEAT' as AllergenEnum],
          foodGroups: ['GRAINS' as FoodGroupEnum],
          nutriscoreScore: 3,
          nutriscoreGrade: 'B',
          productName: 'All-purpose flour',
          brands: 'Generic',
          categories: 'Baking ingredients',
        },
        macroNutrients: {
          calories: 364,
          carbsG: '76.3',
          proteinG: '10.3',
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
        include_ingredients: true,
      });

      expect(mockClient.get).toHaveBeenCalledWith(
        '/api/recipe-scraper/recipes/456/nutritional-info?include_ingredients=true'
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
        include_total: true,
        include_ingredients: true,
      });

      expect(mockClient.get).toHaveBeenCalledWith(
        '/api/recipe-scraper/recipes/789/nutritional-info?include_total=true&include_ingredients=true'
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
          calories: 52,
          carbsG: '14',
          proteinG: '0.3',
        },
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await nutritionApi.getIngredientNutritionalInfo(1);

      expect(mockClient.get).toHaveBeenCalledWith(
        '/api/recipe-scraper/ingredients/1/nutritional-info'
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
        classification: {
          allergies: ['MILK' as AllergenEnum],
          foodGroups: ['DAIRY' as FoodGroupEnum],
          nutriscoreScore: 1,
          nutriscoreGrade: 'A',
          productName: 'Whole milk',
        },
        macroNutrients: {
          calories: 300,
          carbsG: '24',
          proteinG: '16',
          cholesterolMg: '48',
        },
        vitamins: {
          vitaminAMg: '0.4',
          vitaminDMg: '0.002',
          vitaminB12Mg: '0.002',
        },
        minerals: {
          calciumMg: '600',
          potassiumMg: '700',
          sodiumMg: '200',
        },
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await nutritionApi.getIngredientNutritionalInfo(2, {
        amount: 2,
        measurement: 'CUP' as IngredientUnitEnum,
      });

      expect(mockClient.get).toHaveBeenCalledWith(
        '/api/recipe-scraper/ingredients/2/nutritional-info?amount=2&measurement=CUP'
      );
      expect(result).toEqual(mockResponse);
      expect(result.quantity.amount).toBe(2);
      expect(result.quantity.measurement).toBe('CUP');
      expect(result.vitamins?.vitaminDMg).toBe('0.002');
      expect(result.minerals?.calciumMg).toBe('600');
    });

    it('should fetch ingredient nutritional info with only amount', async () => {
      const mockResponse: IngredientNutritionalInfoResponse = {
        quantity: {
          amount: 150,
        },
        macroNutrients: {
          calories: 200,
        },
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await nutritionApi.getIngredientNutritionalInfo(3, {
        amount: 150,
      });

      expect(mockClient.get).toHaveBeenCalledWith(
        '/api/recipe-scraper/ingredients/3/nutritional-info?amount=150'
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
        '/api/recipe-scraper/ingredients/4/nutritional-info?measurement=TBSP'
      );
      expect(result.quantity.measurement).toBe('TBSP');
    });

    it('should handle comprehensive nutritional data', async () => {
      const mockResponse: IngredientNutritionalInfoResponse = {
        quantity: {
          amount: 100,
          measurement: 'G' as IngredientUnitEnum,
        },
        classification: {
          allergies: ['TREE_NUTS' as AllergenEnum],
          foodGroups: ['NUTS_SEEDS' as FoodGroupEnum],
          nutriscoreScore: -1,
          nutriscoreGrade: 'A',
          productName: 'Raw almonds',
          brands: 'Organic Valley',
          categories: 'Nuts, Seeds',
        },
        macroNutrients: {
          calories: 579,
          carbsG: '21.6',
          proteinG: '21.2',
          cholesterolMg: '0',
          sugars: {
            sugarG: '4.4',
            addedSugarsG: '0',
          },
          fats: {
            fatG: '49.9',
            saturatedFatG: '3.8',
            monounsaturatedFatG: '31.6',
            polyunsaturatedFatG: '12.3',
            omega3FatG: '0.003',
            omega6FatG: '12.3',
            transFatG: '0',
          },
          fibers: {
            fiberG: '12.5',
            solubleFiberG: '1',
            insolubleFiberG: '11.5',
          },
        },
        vitamins: {
          vitaminAMg: '0',
          vitaminB6Mg: '0.137',
          vitaminB12Mg: '0',
          vitaminCMg: '0',
          vitaminDMg: '0',
          vitaminEMg: '25.6',
          vitaminKMg: '0',
        },
        minerals: {
          calciumMg: '269',
          ironMg: '3.7',
          magnesiumMg: '270',
          potassiumMg: '733',
          sodiumMg: '1',
          zincMg: '3.1',
        },
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await nutritionApi.getIngredientNutritionalInfo(5, {
        amount: 100,
        measurement: 'G' as IngredientUnitEnum,
      });

      expect(result.classification?.nutriscoreGrade).toBe('A');
      expect(result.macroNutrients?.fats?.omega6FatG).toBe('12.3');
      expect(result.vitamins?.vitaminEMg).toBe('25.6');
      expect(result.minerals?.magnesiumMg).toBe('270');
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
