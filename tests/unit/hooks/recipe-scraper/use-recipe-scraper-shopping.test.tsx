import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { shoppingApi } from '@/lib/api/recipe-scraper';
import { useRecipeShoppingInfo } from '@/hooks/recipe-scraper/use-recipe-scraper-shopping';
import type { RecipeShoppingInfoResponse } from '@/types/recipe-scraper';
import { IngredientUnitEnum } from '@/types/recipe-scraper';

// Mock the API module
jest.mock('@/lib/api/recipe-scraper', () => ({
  shoppingApi: {
    getRecipeShoppingInfo: jest.fn(),
  },
}));

const mockedShoppingApi = shoppingApi as jest.Mocked<typeof shoppingApi>;

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

describe('useRecipeShoppingInfo', () => {
  it('should fetch recipe shopping information successfully', async () => {
    const recipeId = 123;
    const mockResponse: RecipeShoppingInfoResponse = {
      recipeId: 123,
      ingredients: {
        flour: {
          ingredientName: 'all-purpose flour',
          quantity: {
            amount: 2.5,
            measurement: IngredientUnitEnum.CUP,
          },
          estimatedPrice: '1.25',
        },
        sugar: {
          ingredientName: 'granulated sugar',
          quantity: {
            amount: 1.0,
            measurement: IngredientUnitEnum.CUP,
          },
          estimatedPrice: '0.75',
        },
        butter: {
          ingredientName: 'unsalted butter',
          quantity: {
            amount: 1.0,
            measurement: IngredientUnitEnum.CUP,
          },
          estimatedPrice: '3.50',
        },
        eggs: {
          ingredientName: 'large eggs',
          quantity: {
            amount: 2,
            measurement: IngredientUnitEnum.PIECE,
          },
          estimatedPrice: '0.50',
        },
      },
      totalEstimatedCost: '6.00',
    };

    mockedShoppingApi.getRecipeShoppingInfo.mockResolvedValueOnce(mockResponse);

    const wrapper = createWrapper();
    const { result } = renderHook(() => useRecipeShoppingInfo(recipeId), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockResponse);
    expect(mockedShoppingApi.getRecipeShoppingInfo).toHaveBeenCalledWith(
      recipeId
    );
    expect(mockedShoppingApi.getRecipeShoppingInfo).toHaveBeenCalledTimes(1);
  });

  it('should handle recipe with some ingredients having no price information', async () => {
    const recipeId = 456;
    const mockResponse: RecipeShoppingInfoResponse = {
      recipeId: 456,
      ingredients: {
        flour: {
          ingredientName: 'all-purpose flour',
          quantity: {
            amount: 2.0,
            measurement: IngredientUnitEnum.CUP,
          },
          estimatedPrice: '1.00',
        },
        'exotic-spice': {
          ingredientName: 'rare exotic spice',
          quantity: {
            amount: 1,
            measurement: IngredientUnitEnum.TSP,
          },
          estimatedPrice: null,
        },
        sugar: {
          ingredientName: 'brown sugar',
          quantity: {
            amount: 0.5,
            measurement: IngredientUnitEnum.CUP,
          },
          estimatedPrice: '0.40',
        },
      },
      totalEstimatedCost: '1.40',
    };

    mockedShoppingApi.getRecipeShoppingInfo.mockResolvedValueOnce(mockResponse);

    const wrapper = createWrapper();
    const { result } = renderHook(() => useRecipeShoppingInfo(recipeId), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockResponse);
    expect(
      result.current.data?.ingredients['exotic-spice'].estimatedPrice
    ).toBeNull();
    expect(result.current.data?.totalEstimatedCost).toBe('1.40');
  });

  it('should handle recipe with no ingredients', async () => {
    const recipeId = 789;
    const mockResponse: RecipeShoppingInfoResponse = {
      recipeId: 789,
      ingredients: {},
      totalEstimatedCost: '0.00',
    };

    mockedShoppingApi.getRecipeShoppingInfo.mockResolvedValueOnce(mockResponse);

    const wrapper = createWrapper();
    const { result } = renderHook(() => useRecipeShoppingInfo(recipeId), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockResponse);
    expect(Object.keys(result.current.data?.ingredients || {})).toHaveLength(0);
    expect(result.current.data?.totalEstimatedCost).toBe('0.00');
  });

  it('should handle high-cost recipe', async () => {
    const recipeId = 101;
    const mockResponse: RecipeShoppingInfoResponse = {
      recipeId: 101,
      ingredients: {
        'wagyu-beef': {
          ingredientName: 'wagyu beef',
          quantity: {
            amount: 2,
            measurement: IngredientUnitEnum.LB,
          },
          estimatedPrice: '150.00',
        },
        'black-truffle': {
          ingredientName: 'black truffle',
          quantity: {
            amount: 1,
            measurement: IngredientUnitEnum.OZ,
          },
          estimatedPrice: '75.00',
        },
        saffron: {
          ingredientName: 'saffron threads',
          quantity: {
            amount: 1,
            measurement: IngredientUnitEnum.PINCH,
          },
          estimatedPrice: '25.00',
        },
      },
      totalEstimatedCost: '250.00',
    };

    mockedShoppingApi.getRecipeShoppingInfo.mockResolvedValueOnce(mockResponse);

    const wrapper = createWrapper();
    const { result } = renderHook(() => useRecipeShoppingInfo(recipeId), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockResponse);
    expect(
      parseFloat(result.current.data?.totalEstimatedCost || '0')
    ).toBeGreaterThan(200);
  });

  it('should not fetch when recipeId is invalid', () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useRecipeShoppingInfo(0), { wrapper });

    expect(result.current.isFetching).toBe(false);
    expect(mockedShoppingApi.getRecipeShoppingInfo).not.toHaveBeenCalled();
  });

  it('should not fetch when recipeId is negative', () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useRecipeShoppingInfo(-1), { wrapper });

    expect(result.current.isFetching).toBe(false);
    expect(mockedShoppingApi.getRecipeShoppingInfo).not.toHaveBeenCalled();
  });

  it('should handle errors when fetching recipe shopping info', async () => {
    const recipeId = 123;
    const error = new Error('Recipe not found');
    mockedShoppingApi.getRecipeShoppingInfo.mockRejectedValueOnce(error);

    const wrapper = createWrapper();
    const { result } = renderHook(() => useRecipeShoppingInfo(recipeId), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(error);
  });

  it('should handle API service unavailable error', async () => {
    const recipeId = 123;
    const error = new Error('Shopping service temporarily unavailable');
    mockedShoppingApi.getRecipeShoppingInfo.mockRejectedValueOnce(error);

    const wrapper = createWrapper();
    const { result } = renderHook(() => useRecipeShoppingInfo(recipeId), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(error);
    expect(result.current.data).toBeUndefined();
  });
});

// Clean up mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});
