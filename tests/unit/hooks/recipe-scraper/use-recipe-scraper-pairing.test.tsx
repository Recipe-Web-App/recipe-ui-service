import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { pairingApi } from '@/lib/api/recipe-scraper';
import { useRecipePairings } from '@/hooks/recipe-scraper/use-recipe-scraper-pairing';
import type { PairingSuggestionsResponse } from '@/types/recipe-scraper';

// Mock the API module
jest.mock('@/lib/api/recipe-scraper', () => ({
  pairingApi: {
    getPairingSuggestions: jest.fn(),
  },
}));

const mockedPairingApi = pairingApi as jest.Mocked<typeof pairingApi>;

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

describe('useRecipePairings', () => {
  it('should fetch recipe pairing suggestions with default parameters', async () => {
    const recipeId = 123;
    const mockResponse: PairingSuggestionsResponse = {
      recipeId: 123,
      pairingSuggestions: [
        {
          recipeName: 'Caesar Salad',
          url: 'https://www.foodnetwork.com/recipes/caesar-salad-recipe-1234567',
        },
        {
          recipeName: 'Garlic Bread',
          url: 'https://www.allrecipes.com/recipe/garlic-bread-recipe-7654321',
        },
        {
          recipeName: 'Red Wine Reduction',
          url: 'https://www.bonappetit.com/recipe/red-wine-reduction-9876543',
        },
      ],
      limit: 50,
      offset: 0,
      count: 25,
    };

    mockedPairingApi.getPairingSuggestions.mockResolvedValueOnce(mockResponse);

    const wrapper = createWrapper();
    const { result } = renderHook(() => useRecipePairings(recipeId), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockResponse);
    expect(mockedPairingApi.getPairingSuggestions).toHaveBeenCalledWith(
      recipeId,
      undefined
    );
    expect(mockedPairingApi.getPairingSuggestions).toHaveBeenCalledTimes(1);
  });

  it('should fetch recipe pairing suggestions with custom parameters', async () => {
    const recipeId = 123;
    const params = {
      limit: 10,
      offset: 5,
      countOnly: false,
    };

    const mockResponse: PairingSuggestionsResponse = {
      recipeId: 123,
      pairingSuggestions: [
        {
          recipeName: 'Grilled Asparagus',
          url: 'https://www.foodnetwork.com/recipes/grilled-asparagus-recipe-1111111',
        },
        {
          recipeName: 'Roasted Potatoes',
          url: 'https://www.allrecipes.com/recipe/roasted-potatoes-recipe-2222222',
        },
      ],
      limit: 10,
      offset: 5,
      count: 25,
    };

    mockedPairingApi.getPairingSuggestions.mockResolvedValueOnce(mockResponse);

    const wrapper = createWrapper();
    const { result } = renderHook(() => useRecipePairings(recipeId, params), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockResponse);
    expect(mockedPairingApi.getPairingSuggestions).toHaveBeenCalledWith(
      recipeId,
      params
    );
  });

  it('should fetch count only when countOnly parameter is true', async () => {
    const recipeId = 123;
    const params = {
      countOnly: true,
    };

    const mockResponse: PairingSuggestionsResponse = {
      recipeId: 123,
      pairingSuggestions: [],
      limit: 50,
      offset: 0,
      count: 25,
    };

    mockedPairingApi.getPairingSuggestions.mockResolvedValueOnce(mockResponse);

    const wrapper = createWrapper();
    const { result } = renderHook(() => useRecipePairings(recipeId, params), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockResponse);
    expect(result.current.data?.pairingSuggestions).toHaveLength(0);
    expect(result.current.data?.count).toBe(25);
    expect(mockedPairingApi.getPairingSuggestions).toHaveBeenCalledWith(
      recipeId,
      params
    );
  });

  it('should handle pagination with limit and offset', async () => {
    const recipeId = 456;
    const params = {
      limit: 5,
      offset: 10,
    };

    const mockResponse: PairingSuggestionsResponse = {
      recipeId: 456,
      pairingSuggestions: [
        {
          recipeName: 'Mashed Potatoes',
          url: 'https://www.foodnetwork.com/recipes/mashed-potatoes-recipe-3333333',
        },
        {
          recipeName: 'Green Beans',
          url: 'https://www.allrecipes.com/recipe/green-beans-recipe-4444444',
        },
      ],
      limit: 5,
      offset: 10,
      count: 50,
    };

    mockedPairingApi.getPairingSuggestions.mockResolvedValueOnce(mockResponse);

    const wrapper = createWrapper();
    const { result } = renderHook(() => useRecipePairings(recipeId, params), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockResponse);
    expect(result.current.data?.limit).toBe(5);
    expect(result.current.data?.offset).toBe(10);
    expect(mockedPairingApi.getPairingSuggestions).toHaveBeenCalledWith(
      recipeId,
      params
    );
  });

  it('should handle empty pairing suggestions', async () => {
    const recipeId = 789;
    const mockResponse: PairingSuggestionsResponse = {
      recipeId: 789,
      pairingSuggestions: [],
      limit: 50,
      offset: 0,
      count: 0,
    };

    mockedPairingApi.getPairingSuggestions.mockResolvedValueOnce(mockResponse);

    const wrapper = createWrapper();
    const { result } = renderHook(() => useRecipePairings(recipeId), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockResponse);
    expect(result.current.data?.pairingSuggestions).toHaveLength(0);
    expect(result.current.data?.count).toBe(0);
  });

  it('should not fetch when recipeId is invalid', () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useRecipePairings(0), { wrapper });

    expect(result.current.isFetching).toBe(false);
    expect(mockedPairingApi.getPairingSuggestions).not.toHaveBeenCalled();
  });

  it('should handle errors when fetching recipe pairing suggestions', async () => {
    const recipeId = 123;
    const error = new Error('Recipe not found');
    mockedPairingApi.getPairingSuggestions.mockRejectedValueOnce(error);

    const wrapper = createWrapper();
    const { result } = renderHook(() => useRecipePairings(recipeId), {
      wrapper,
    });

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
