import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { recipesApi } from '@/lib/api/recipe-scraper';
import {
  useCreateRecipeFromUrl,
  usePopularRecipes,
} from '@/hooks/recipe-scraper/use-recipe-scraper-recipes';
import type {
  CreateRecipeRequest,
  CreateRecipeResponse,
  PopularRecipesResponse,
} from '@/types/recipe-scraper';
import { IngredientUnitEnum } from '@/types/recipe-scraper';

// Mock the API module
jest.mock('@/lib/api/recipe-scraper', () => ({
  recipesApi: {
    createRecipe: jest.fn(),
    getPopularRecipes: jest.fn(),
  },
}));

const mockedRecipesApi = recipesApi as jest.Mocked<typeof recipesApi>;

// Test wrapper with QueryClient
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useCreateRecipeFromUrl', () => {
  it('should create a recipe from URL successfully', async () => {
    const mockRequest: CreateRecipeRequest = {
      recipeUrl:
        'https://www.allrecipes.com/recipe/10813/best-chocolate-chip-cookies/',
    };

    const mockResponse: CreateRecipeResponse = {
      recipe: {
        recipeId: 123,
        title: 'Classic Chocolate Chip Cookies',
        description:
          'Soft and chewy chocolate chip cookies that are perfect for any occasion',
        originUrl:
          'https://www.allrecipes.com/recipe/10813/best-chocolate-chip-cookies/',
        servings: 24,
        preparationTime: 15,
        cookingTime: 12,
        difficulty: 'easy',
        ingredients: [
          {
            ingredientId: 1,
            name: 'all-purpose flour',
            quantity: {
              amount: 2.25,
              measurement: IngredientUnitEnum.CUP,
            },
          },
          {
            ingredientId: 2,
            name: 'butter',
            quantity: {
              amount: 1.0,
              measurement: IngredientUnitEnum.CUP,
            },
          },
        ],
        steps: [
          {
            stepNumber: 1,
            instruction: 'Preheat oven to 375°F (190°C).',
            optional: false,
          },
          {
            stepNumber: 2,
            instruction: 'Mix flour and baking soda in a bowl.',
            optional: false,
          },
        ],
      },
    };

    mockedRecipesApi.createRecipe.mockResolvedValueOnce(mockResponse);

    const wrapper = createWrapper();
    const { result } = renderHook(() => useCreateRecipeFromUrl(), { wrapper });

    // Execute the mutation
    result.current.mutate(mockRequest);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockResponse);
    expect(mockedRecipesApi.createRecipe).toHaveBeenCalledWith(mockRequest);
    expect(mockedRecipesApi.createRecipe).toHaveBeenCalledTimes(1);
  });

  it('should handle errors when creating a recipe from URL', async () => {
    const mockRequest: CreateRecipeRequest = {
      recipeUrl: 'https://invalid-url.com/recipe',
    };

    const error = new Error('Unable to scrape recipe from the provided URL');
    mockedRecipesApi.createRecipe.mockRejectedValueOnce(error);

    const wrapper = createWrapper();
    const { result } = renderHook(() => useCreateRecipeFromUrl(), { wrapper });

    // Execute the mutation
    result.current.mutate(mockRequest);

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(error);
    expect(mockedRecipesApi.createRecipe).toHaveBeenCalledWith(mockRequest);
  });
});

describe('usePopularRecipes', () => {
  it('should fetch popular recipes with default parameters', async () => {
    const mockResponse: PopularRecipesResponse = {
      recipes: [
        {
          recipeName: 'Simple Macaroni and Cheese',
          url: 'https://www.allrecipes.com/recipe/231506/simple-macaroni-and-cheese/',
        },
        {
          recipeName: 'Baked Macaroni and Cheese',
          url: 'https://www.foodnetwork.com/recipes/alton-brown/baked-macaroni-and-cheese-recipe-1939524',
        },
      ],
      limit: 50,
      offset: 0,
      count: 150,
    };

    mockedRecipesApi.getPopularRecipes.mockResolvedValueOnce(mockResponse);

    const wrapper = createWrapper();
    const { result } = renderHook(() => usePopularRecipes(), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockResponse);
    expect(mockedRecipesApi.getPopularRecipes).toHaveBeenCalledWith(undefined);
    expect(mockedRecipesApi.getPopularRecipes).toHaveBeenCalledTimes(1);
  });

  it('should fetch popular recipes with custom parameters', async () => {
    const params = {
      limit: 20,
      offset: 10,
      countOnly: false,
    };

    const mockResponse: PopularRecipesResponse = {
      recipes: [
        {
          recipeName: 'Chocolate Chip Cookies',
          url: 'https://www.allrecipes.com/recipe/10813/best-chocolate-chip-cookies/',
        },
      ],
      limit: 20,
      offset: 10,
      count: 150,
    };

    mockedRecipesApi.getPopularRecipes.mockResolvedValueOnce(mockResponse);

    const wrapper = createWrapper();
    const { result } = renderHook(() => usePopularRecipes(params), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockResponse);
    expect(mockedRecipesApi.getPopularRecipes).toHaveBeenCalledWith(params);
    expect(mockedRecipesApi.getPopularRecipes).toHaveBeenCalledTimes(1);
  });

  it('should fetch popular recipes with countOnly parameter', async () => {
    const params = {
      countOnly: true,
    };

    const mockResponse: PopularRecipesResponse = {
      recipes: [],
      limit: 50,
      offset: 0,
      count: 150,
    };

    mockedRecipesApi.getPopularRecipes.mockResolvedValueOnce(mockResponse);

    const wrapper = createWrapper();
    const { result } = renderHook(() => usePopularRecipes(params), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockResponse);
    expect(mockedRecipesApi.getPopularRecipes).toHaveBeenCalledWith(params);
  });

  it('should handle errors when fetching popular recipes', async () => {
    const error = new Error('Service unavailable');
    mockedRecipesApi.getPopularRecipes.mockRejectedValueOnce(error);

    const wrapper = createWrapper();
    const { result } = renderHook(() => usePopularRecipes(), { wrapper });

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
