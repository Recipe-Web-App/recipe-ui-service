import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { nutritionApi } from '@/lib/api/recipe-scraper';
import {
  useRecipeNutritionalInfo,
  useIngredientNutritionalInfo,
} from '@/hooks/recipe-scraper/use-recipe-scraper-nutrition';
import type {
  RecipeNutritionalInfoResponse,
  IngredientNutritionalInfoResponse,
} from '@/types/recipe-scraper';
import { IngredientUnitEnum } from '@/types/recipe-scraper';

// Mock the API module
jest.mock('@/lib/api/recipe-scraper', () => ({
  nutritionApi: {
    getRecipeNutritionalInfo: jest.fn(),
    getIngredientNutritionalInfo: jest.fn(),
  },
}));

const mockedNutritionApi = nutritionApi as jest.Mocked<typeof nutritionApi>;

// Test wrapper with QueryClient
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useRecipeNutritionalInfo', () => {
  it('should fetch recipe nutritional information with default parameters', async () => {
    const recipeId = 123;
    const mockResponse: RecipeNutritionalInfoResponse = {
      total: {
        quantity: {
          amount: 1,
          measurement: IngredientUnitEnum.UNIT,
        },
        macroNutrients: {
          calories: 2500,
          carbsG: '125.5',
          cholesterolMg: '15.2',
          proteinG: '45.1',
          sugars: {
            sugarG: '25.3',
            addedSugarsG: '10.1',
          },
          fats: {
            fatG: '85.2',
            saturatedFatG: '25.1',
            monounsaturatedFatG: '35.8',
            polyunsaturatedFatG: '15.9',
            omega3FatG: '2.5',
            omega6FatG: '8.2',
            omega9FatG: '12.1',
            transFatG: '0.0',
          },
          fibers: {
            fiberG: '12.8',
            solubleFiberG: '5.2',
            insolubleFiberG: '7.6',
          },
        },
        vitamins: {
          vitaminAMg: '2.5',
          vitaminB6Mg: '1.1',
          vitaminB12Mg: '0.8',
          vitaminCMg: '15.2',
          vitaminDMg: '0.5',
          vitaminEMg: '3.3',
          vitaminKMg: '1.1',
        },
        minerals: {
          calciumMg: '250.5',
          ironMg: '12.1',
          magnesiumMg: '85.2',
          potassiumMg: '450.7',
          sodiumMg: '1200.1',
          zincMg: '8.8',
        },
      },
    };

    mockedNutritionApi.getRecipeNutritionalInfo.mockResolvedValueOnce(
      mockResponse
    );

    const wrapper = createWrapper();
    const { result } = renderHook(() => useRecipeNutritionalInfo(recipeId), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockResponse);
    expect(mockedNutritionApi.getRecipeNutritionalInfo).toHaveBeenCalledWith(
      recipeId,
      undefined
    );
    expect(mockedNutritionApi.getRecipeNutritionalInfo).toHaveBeenCalledTimes(
      1
    );
  });

  it('should fetch recipe nutritional information with custom parameters', async () => {
    const recipeId = 123;
    const params = {
      include_total: true,
      include_ingredients: true,
    };

    const mockResponse: RecipeNutritionalInfoResponse = {
      total: {
        quantity: {
          amount: 1,
          measurement: IngredientUnitEnum.UNIT,
        },
        macroNutrients: {
          calories: 2500,
          carbsG: '125.5',
          proteinG: '45.1',
        },
      },
      ingredients: {
        flour: {
          quantity: {
            amount: 2.25,
            measurement: IngredientUnitEnum.CUP,
          },
          macroNutrients: {
            calories: 1800,
            carbsG: '95.5',
            proteinG: '25.1',
          },
        },
      },
      missingIngredients: [],
    };

    mockedNutritionApi.getRecipeNutritionalInfo.mockResolvedValueOnce(
      mockResponse
    );

    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useRecipeNutritionalInfo(recipeId, params),
      { wrapper }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockResponse);
    expect(mockedNutritionApi.getRecipeNutritionalInfo).toHaveBeenCalledWith(
      recipeId,
      params
    );
  });

  it('should not fetch when recipeId is invalid', () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useRecipeNutritionalInfo(0), {
      wrapper,
    });

    expect(result.current.isFetching).toBe(false);
    expect(mockedNutritionApi.getRecipeNutritionalInfo).not.toHaveBeenCalled();
  });

  it('should handle errors when fetching recipe nutritional info', async () => {
    const recipeId = 123;
    const error = new Error('Recipe not found');
    mockedNutritionApi.getRecipeNutritionalInfo.mockRejectedValueOnce(error);

    const wrapper = createWrapper();
    const { result } = renderHook(() => useRecipeNutritionalInfo(recipeId), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(error);
  });
});

describe('useIngredientNutritionalInfo', () => {
  it('should fetch ingredient nutritional information with default parameters', async () => {
    const ingredientId = 456;
    const mockResponse: IngredientNutritionalInfoResponse = {
      quantity: {
        amount: 1,
        measurement: IngredientUnitEnum.CUP,
      },
      macroNutrients: {
        calories: 455,
        carbsG: '95.4',
        cholesterolMg: '0.0',
        proteinG: '13.7',
        sugars: {
          sugarG: '0.8',
          addedSugarsG: '0.0',
        },
        fats: {
          fatG: '1.2',
          saturatedFatG: '0.2',
          monounsaturatedFatG: '0.1',
          polyunsaturatedFatG: '0.5',
          omega3FatG: '0.02',
          omega6FatG: '0.48',
          omega9FatG: '0.08',
          transFatG: '0.0',
        },
        fibers: {
          fiberG: '3.4',
          solubleFiberG: '1.1',
          insolubleFiberG: '2.3',
        },
      },
      vitamins: {
        vitaminAMg: '0.0',
        vitaminB6Mg: '0.14',
        vitaminB12Mg: '0.0',
        vitaminCMg: '0.0',
        vitaminDMg: '0.0',
        vitaminEMg: '0.07',
        vitaminKMg: '0.2',
      },
      minerals: {
        calciumMg: '15.0',
        ironMg: '4.6',
        magnesiumMg: '25.0',
        potassiumMg: '107.0',
        sodiumMg: '2.0',
        zincMg: '0.87',
      },
    };

    mockedNutritionApi.getIngredientNutritionalInfo.mockResolvedValueOnce(
      mockResponse
    );

    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useIngredientNutritionalInfo(ingredientId),
      { wrapper }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockResponse);
    expect(
      mockedNutritionApi.getIngredientNutritionalInfo
    ).toHaveBeenCalledWith(ingredientId, undefined);
    expect(
      mockedNutritionApi.getIngredientNutritionalInfo
    ).toHaveBeenCalledTimes(1);
  });

  it('should fetch ingredient nutritional information with custom parameters', async () => {
    const ingredientId = 456;
    const params = {
      amount: 2.5,
      measurement: IngredientUnitEnum.CUP,
    };

    const mockResponse: IngredientNutritionalInfoResponse = {
      quantity: {
        amount: 2.5,
        measurement: IngredientUnitEnum.CUP,
      },
      macroNutrients: {
        calories: 1138,
        carbsG: '238.5',
        proteinG: '34.3',
      },
    };

    mockedNutritionApi.getIngredientNutritionalInfo.mockResolvedValueOnce(
      mockResponse
    );

    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useIngredientNutritionalInfo(ingredientId, params),
      { wrapper }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockResponse);
    expect(
      mockedNutritionApi.getIngredientNutritionalInfo
    ).toHaveBeenCalledWith(ingredientId, params);
  });

  it('should not fetch when ingredientId is invalid', () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useIngredientNutritionalInfo(0), {
      wrapper,
    });

    expect(result.current.isFetching).toBe(false);
    expect(
      mockedNutritionApi.getIngredientNutritionalInfo
    ).not.toHaveBeenCalled();
  });

  it('should handle errors when fetching ingredient nutritional info', async () => {
    const ingredientId = 456;
    const error = new Error('Ingredient not found');
    mockedNutritionApi.getIngredientNutritionalInfo.mockRejectedValueOnce(
      error
    );

    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useIngredientNutritionalInfo(ingredientId),
      { wrapper }
    );

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(error);
  });
});

// Clean up mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});
