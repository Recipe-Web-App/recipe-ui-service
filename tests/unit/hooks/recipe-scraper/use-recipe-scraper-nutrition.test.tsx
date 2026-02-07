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
import { IngredientUnitEnum, NutrientUnit } from '@/types/recipe-scraper';

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
          calories: { amount: 2500, measurement: NutrientUnit.KILOCALORIE },
          carbs: { amount: 125.5, measurement: NutrientUnit.GRAM },
          cholesterol: { amount: 15.2, measurement: NutrientUnit.MILLIGRAM },
          protein: { amount: 45.1, measurement: NutrientUnit.GRAM },
          sugar: { amount: 25.3, measurement: NutrientUnit.GRAM },
          addedSugar: { amount: 10.1, measurement: NutrientUnit.GRAM },
          fats: {
            total: { amount: 85.2, measurement: NutrientUnit.GRAM },
            saturated: { amount: 25.1, measurement: NutrientUnit.GRAM },
            monounsaturated: { amount: 35.8, measurement: NutrientUnit.GRAM },
            polyunsaturated: { amount: 15.9, measurement: NutrientUnit.GRAM },
            trans: { amount: 0.0, measurement: NutrientUnit.GRAM },
          },
          fiber: { amount: 12.8, measurement: NutrientUnit.GRAM },
          sodium: { amount: 1200.1, measurement: NutrientUnit.MILLIGRAM },
        },
        vitamins: {
          vitaminA: { amount: 2.5, measurement: NutrientUnit.MILLIGRAM },
          vitaminB6: { amount: 1.1, measurement: NutrientUnit.MILLIGRAM },
          vitaminB12: { amount: 0.8, measurement: NutrientUnit.MILLIGRAM },
          vitaminC: { amount: 15.2, measurement: NutrientUnit.MILLIGRAM },
          vitaminD: { amount: 0.5, measurement: NutrientUnit.MILLIGRAM },
          vitaminE: { amount: 3.3, measurement: NutrientUnit.MILLIGRAM },
          vitaminK: { amount: 1.1, measurement: NutrientUnit.MILLIGRAM },
        },
        minerals: {
          calcium: { amount: 250.5, measurement: NutrientUnit.MILLIGRAM },
          iron: { amount: 12.1, measurement: NutrientUnit.MILLIGRAM },
          magnesium: { amount: 85.2, measurement: NutrientUnit.MILLIGRAM },
          potassium: { amount: 450.7, measurement: NutrientUnit.MILLIGRAM },
          zinc: { amount: 8.8, measurement: NutrientUnit.MILLIGRAM },
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
          calories: { amount: 2500, measurement: NutrientUnit.KILOCALORIE },
          carbs: { amount: 125.5, measurement: NutrientUnit.GRAM },
          protein: { amount: 45.1, measurement: NutrientUnit.GRAM },
        },
      },
      ingredients: {
        flour: {
          quantity: {
            amount: 2.25,
            measurement: IngredientUnitEnum.CUP,
          },
          macroNutrients: {
            calories: { amount: 1800, measurement: NutrientUnit.KILOCALORIE },
            carbs: { amount: 95.5, measurement: NutrientUnit.GRAM },
            protein: { amount: 25.1, measurement: NutrientUnit.GRAM },
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
        calories: { amount: 455, measurement: NutrientUnit.KILOCALORIE },
        carbs: { amount: 95.4, measurement: NutrientUnit.GRAM },
        cholesterol: { amount: 0.0, measurement: NutrientUnit.MILLIGRAM },
        protein: { amount: 13.7, measurement: NutrientUnit.GRAM },
        sugar: { amount: 0.8, measurement: NutrientUnit.GRAM },
        addedSugar: { amount: 0.0, measurement: NutrientUnit.GRAM },
        fats: {
          total: { amount: 1.2, measurement: NutrientUnit.GRAM },
          saturated: { amount: 0.2, measurement: NutrientUnit.GRAM },
          monounsaturated: { amount: 0.1, measurement: NutrientUnit.GRAM },
          polyunsaturated: { amount: 0.5, measurement: NutrientUnit.GRAM },
          trans: { amount: 0.0, measurement: NutrientUnit.GRAM },
        },
        fiber: { amount: 3.4, measurement: NutrientUnit.GRAM },
      },
      vitamins: {
        vitaminA: { amount: 0.0, measurement: NutrientUnit.MILLIGRAM },
        vitaminB6: { amount: 0.14, measurement: NutrientUnit.MILLIGRAM },
        vitaminB12: { amount: 0.0, measurement: NutrientUnit.MILLIGRAM },
        vitaminC: { amount: 0.0, measurement: NutrientUnit.MILLIGRAM },
        vitaminD: { amount: 0.0, measurement: NutrientUnit.MILLIGRAM },
        vitaminE: { amount: 0.07, measurement: NutrientUnit.MILLIGRAM },
        vitaminK: { amount: 0.2, measurement: NutrientUnit.MILLIGRAM },
      },
      minerals: {
        calcium: { amount: 15.0, measurement: NutrientUnit.MILLIGRAM },
        iron: { amount: 4.6, measurement: NutrientUnit.MILLIGRAM },
        magnesium: { amount: 25.0, measurement: NutrientUnit.MILLIGRAM },
        potassium: { amount: 107.0, measurement: NutrientUnit.MILLIGRAM },
        zinc: { amount: 0.87, measurement: NutrientUnit.MILLIGRAM },
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
        calories: { amount: 1138, measurement: NutrientUnit.KILOCALORIE },
        carbs: { amount: 238.5, measurement: NutrientUnit.GRAM },
        protein: { amount: 34.3, measurement: NutrientUnit.GRAM },
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
