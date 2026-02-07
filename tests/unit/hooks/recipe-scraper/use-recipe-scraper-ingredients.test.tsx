import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ingredientsApi, shoppingApi } from '@/lib/api/recipe-scraper';
import {
  useIngredientSubstitutions,
  useIngredientShoppingInfo,
} from '@/hooks/recipe-scraper/use-recipe-scraper-ingredients';
import type {
  RecommendedSubstitutionsResponse,
  IngredientShoppingInfoResponse,
} from '@/types/recipe-scraper';
import { IngredientUnitEnum } from '@/types/recipe-scraper';

// Mock the API modules
jest.mock('@/lib/api/recipe-scraper', () => ({
  ingredientsApi: {
    getRecommendedSubstitutions: jest.fn(),
  },
  shoppingApi: {
    getIngredientShoppingInfo: jest.fn(),
  },
}));

const mockedIngredientsApi = ingredientsApi as jest.Mocked<
  typeof ingredientsApi
>;
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

describe('useIngredientSubstitutions', () => {
  it('should fetch ingredient substitutions with default parameters', async () => {
    const ingredientId = 1;
    const mockResponse: RecommendedSubstitutionsResponse = {
      ingredient: {
        ingredientId: 1,
        name: 'all-purpose flour',
        quantity: {
          amount: 2.25,
          measurement: IngredientUnitEnum.CUP,
        },
      },
      recommendedSubstitutions: [
        {
          ingredient: 'whole wheat flour',
          quantity: {
            amount: 2.25,
            measurement: IngredientUnitEnum.CUP,
          },
          conversionRatio: {
            ratio: 1.0,
            measurement: IngredientUnitEnum.CUP,
          },
        },
        {
          ingredient: 'cake flour',
          quantity: {
            amount: 2.5,
            measurement: IngredientUnitEnum.CUP,
          },
          conversionRatio: {
            ratio: 1.1,
            measurement: IngredientUnitEnum.CUP,
          },
        },
      ],
      limit: 50,
      offset: 0,
      count: 25,
    };

    mockedIngredientsApi.getRecommendedSubstitutions.mockResolvedValueOnce(
      mockResponse
    );

    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useIngredientSubstitutions(ingredientId),
      { wrapper }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockResponse);
    expect(
      mockedIngredientsApi.getRecommendedSubstitutions
    ).toHaveBeenCalledWith(ingredientId, undefined);
    expect(
      mockedIngredientsApi.getRecommendedSubstitutions
    ).toHaveBeenCalledTimes(1);
  });

  it('should fetch ingredient substitutions with custom parameters', async () => {
    const ingredientId = 1;
    const params = {
      limit: 10,
      offset: 5,
      countOnly: false,
      amount: 2.25,
      measurement: IngredientUnitEnum.CUP,
    };

    const mockResponse: RecommendedSubstitutionsResponse = {
      ingredient: {
        ingredientId: 1,
        name: 'all-purpose flour',
        quantity: {
          amount: 2.25,
          measurement: IngredientUnitEnum.CUP,
        },
      },
      recommendedSubstitutions: [
        {
          ingredient: 'whole wheat flour',
          conversionRatio: {
            ratio: 1.0,
            measurement: IngredientUnitEnum.CUP,
          },
        },
      ],
      limit: 10,
      offset: 5,
      count: 25,
    };

    mockedIngredientsApi.getRecommendedSubstitutions.mockResolvedValueOnce(
      mockResponse
    );

    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useIngredientSubstitutions(ingredientId, params),
      { wrapper }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockResponse);
    expect(
      mockedIngredientsApi.getRecommendedSubstitutions
    ).toHaveBeenCalledWith(ingredientId, params);
  });

  it('should fetch count only when countOnly parameter is true', async () => {
    const ingredientId = 1;
    const params = {
      countOnly: true,
    };

    const mockResponse: RecommendedSubstitutionsResponse = {
      ingredient: {
        ingredientId: 1,
        name: 'all-purpose flour',
      },
      recommendedSubstitutions: [],
      limit: 50,
      offset: 0,
      count: 25,
    };

    mockedIngredientsApi.getRecommendedSubstitutions.mockResolvedValueOnce(
      mockResponse
    );

    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useIngredientSubstitutions(ingredientId, params),
      { wrapper }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockResponse);
    expect(
      mockedIngredientsApi.getRecommendedSubstitutions
    ).toHaveBeenCalledWith(ingredientId, params);
  });

  it('should not fetch when ingredientId is invalid', () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useIngredientSubstitutions(0), {
      wrapper,
    });

    expect(result.current.isFetching).toBe(false);
    expect(
      mockedIngredientsApi.getRecommendedSubstitutions
    ).not.toHaveBeenCalled();
  });

  it('should handle errors when fetching ingredient substitutions', async () => {
    const ingredientId = 1;
    const error = new Error('Ingredient not found');
    mockedIngredientsApi.getRecommendedSubstitutions.mockRejectedValueOnce(
      error
    );

    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useIngredientSubstitutions(ingredientId),
      { wrapper }
    );

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(error);
  });
});

describe('useIngredientShoppingInfo', () => {
  it('should fetch ingredient shopping information with default parameters', async () => {
    const ingredientId = 1;
    const mockResponse: IngredientShoppingInfoResponse = {
      ingredientName: 'all-purpose flour',
      quantity: {
        amount: 1,
        measurement: IngredientUnitEnum.CUP,
      },
      estimatedPrice: '1.25',
    };

    mockedShoppingApi.getIngredientShoppingInfo.mockResolvedValueOnce(
      mockResponse
    );

    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useIngredientShoppingInfo(ingredientId),
      { wrapper }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockResponse);
    expect(mockedShoppingApi.getIngredientShoppingInfo).toHaveBeenCalledWith(
      ingredientId,
      undefined
    );
    expect(mockedShoppingApi.getIngredientShoppingInfo).toHaveBeenCalledTimes(
      1
    );
  });

  it('should fetch ingredient shopping information with custom parameters', async () => {
    const ingredientId = 1;
    const params = {
      amount: 2.5,
      measurement: IngredientUnitEnum.CUP,
    };

    const mockResponse: IngredientShoppingInfoResponse = {
      ingredientName: 'all-purpose flour',
      quantity: {
        amount: 2.5,
        measurement: IngredientUnitEnum.CUP,
      },
      estimatedPrice: '3.12',
    };

    mockedShoppingApi.getIngredientShoppingInfo.mockResolvedValueOnce(
      mockResponse
    );

    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useIngredientShoppingInfo(ingredientId, params),
      { wrapper }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockResponse);
    expect(mockedShoppingApi.getIngredientShoppingInfo).toHaveBeenCalledWith(
      ingredientId,
      params
    );
  });

  it('should handle price unavailable scenario', async () => {
    const ingredientId = 1;
    const mockResponse: IngredientShoppingInfoResponse = {
      ingredientName: 'exotic ingredient',
      quantity: {
        amount: 1,
        measurement: IngredientUnitEnum.UNIT,
      },
      estimatedPrice: null,
    };

    mockedShoppingApi.getIngredientShoppingInfo.mockResolvedValueOnce(
      mockResponse
    );

    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useIngredientShoppingInfo(ingredientId),
      { wrapper }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockResponse);
    expect(result.current.data?.estimatedPrice).toBeNull();
  });

  it('should not fetch when ingredientId is invalid', () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useIngredientShoppingInfo(0), {
      wrapper,
    });

    expect(result.current.isFetching).toBe(false);
    expect(mockedShoppingApi.getIngredientShoppingInfo).not.toHaveBeenCalled();
  });

  it('should handle errors when fetching ingredient shopping info', async () => {
    const ingredientId = 1;
    const error = new Error('Ingredient not found');
    mockedShoppingApi.getIngredientShoppingInfo.mockRejectedValueOnce(error);

    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useIngredientShoppingInfo(ingredientId),
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
