import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { allergensApi } from '@/lib/api/recipe-scraper';
import {
  useIngredientAllergens,
  useRecipeAllergens,
} from '@/hooks/recipe-scraper/use-recipe-scraper-allergens';
import type {
  IngredientAllergenResponse,
  RecipeAllergenResponse,
} from '@/types/recipe-scraper';
import {
  AllergenEnum,
  AllergenPresenceTypeEnum,
  AllergenDataSourceEnum,
} from '@/types/recipe-scraper';

// Mock the API module
jest.mock('@/lib/api/recipe-scraper', () => ({
  allergensApi: {
    getIngredientAllergens: jest.fn(),
    getRecipeAllergens: jest.fn(),
  },
}));

const mockedAllergensApi = allergensApi as jest.Mocked<typeof allergensApi>;

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

describe('useIngredientAllergens', () => {
  it('should fetch allergens for a valid ingredient', async () => {
    const ingredientId = 1;
    const mockResponse: IngredientAllergenResponse = {
      ingredientId: 1,
      ingredientName: 'wheat flour',
      usdaFoodDescription: 'Wheat flour, white, all-purpose',
      allergens: [
        {
          allergen: AllergenEnum.GLUTEN,
          presenceType: AllergenPresenceTypeEnum.CONTAINS,
          confidenceScore: 0.95,
          sourceNotes: 'USDA database match',
        },
      ],
      dataSource: AllergenDataSourceEnum.USDA,
      overallConfidence: 0.95,
    };

    mockedAllergensApi.getIngredientAllergens.mockResolvedValueOnce(
      mockResponse
    );

    const wrapper = createWrapper();
    const { result } = renderHook(() => useIngredientAllergens(ingredientId), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockResponse);
    expect(mockedAllergensApi.getIngredientAllergens).toHaveBeenCalledWith(
      ingredientId
    );
    expect(mockedAllergensApi.getIngredientAllergens).toHaveBeenCalledTimes(1);
  });

  it('should not fetch when ingredientId is invalid', () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useIngredientAllergens(0), {
      wrapper,
    });

    expect(result.current.isFetching).toBe(false);
    expect(mockedAllergensApi.getIngredientAllergens).not.toHaveBeenCalled();
  });

  it('should handle errors when fetching ingredient allergens', async () => {
    const ingredientId = 1;
    const error = new Error('Ingredient not found');
    mockedAllergensApi.getIngredientAllergens.mockRejectedValueOnce(error);

    const wrapper = createWrapper();
    const { result } = renderHook(() => useIngredientAllergens(ingredientId), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(error);
  });
});

describe('useRecipeAllergens', () => {
  it('should fetch allergens for a valid recipe', async () => {
    const recipeId = 1;
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

    mockedAllergensApi.getRecipeAllergens.mockResolvedValueOnce(mockResponse);

    const wrapper = createWrapper();
    const { result } = renderHook(() => useRecipeAllergens(recipeId), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockResponse);
    expect(mockedAllergensApi.getRecipeAllergens).toHaveBeenCalledWith(
      recipeId,
      undefined
    );
    expect(mockedAllergensApi.getRecipeAllergens).toHaveBeenCalledTimes(1);
  });

  it('should fetch allergens with includeIngredientDetails parameter', async () => {
    const recipeId = 1;
    const params = { includeIngredientDetails: true };
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

    mockedAllergensApi.getRecipeAllergens.mockResolvedValueOnce(mockResponse);

    const wrapper = createWrapper();
    const { result } = renderHook(() => useRecipeAllergens(recipeId, params), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockResponse);
    expect(mockedAllergensApi.getRecipeAllergens).toHaveBeenCalledWith(
      recipeId,
      params
    );
  });

  it('should not fetch when recipeId is invalid', () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useRecipeAllergens(0), {
      wrapper,
    });

    expect(result.current.isFetching).toBe(false);
    expect(mockedAllergensApi.getRecipeAllergens).not.toHaveBeenCalled();
  });

  it('should handle errors when fetching recipe allergens', async () => {
    const recipeId = 1;
    const error = new Error('Recipe not found');
    mockedAllergensApi.getRecipeAllergens.mockRejectedValueOnce(error);

    const wrapper = createWrapper();
    const { result } = renderHook(() => useRecipeAllergens(recipeId), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(error);
  });
});

afterEach(() => {
  jest.clearAllMocks();
});
