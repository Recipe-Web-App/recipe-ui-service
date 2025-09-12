import { pairingApi } from '@/lib/api/recipe-scraper/pairing';
import { RecipeScraperApiError } from '@/lib/api/recipe-scraper/client';
import type {
  PairingSuggestionsResponse,
  WebRecipe,
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

describe('Recipe Scraper Pairing API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getPairingSuggestions', () => {
    it('should fetch pairing suggestions without parameters', async () => {
      const mockSuggestion1: WebRecipe = {
        recipeName: 'Caesar Salad',
        url: 'https://example.com/caesar-salad',
      };

      const mockSuggestion2: WebRecipe = {
        recipeName: 'Garlic Bread',
        url: 'https://example.com/garlic-bread',
      };

      const mockSuggestion3: WebRecipe = {
        recipeName: 'Red Wine',
        url: 'https://example.com/red-wine-pairing',
      };

      const mockResponse: PairingSuggestionsResponse = {
        recipeId: 123,
        pairingSuggestions: [mockSuggestion1, mockSuggestion2, mockSuggestion3],
        limit: 10,
        offset: 0,
        count: 3,
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await pairingApi.getPairingSuggestions(123);

      expect(mockClient.get).toHaveBeenCalledWith(
        '/api/recipe-scraper/recipes/123/pairing-suggestions'
      );
      expect(result).toEqual(mockResponse);
      expect(result.recipeId).toBe(123);
      expect(result.pairingSuggestions).toHaveLength(3);
      expect(result.pairingSuggestions[0].recipeName).toBe('Caesar Salad');
      expect(result.pairingSuggestions[1].recipeName).toBe('Garlic Bread');
      expect(result.pairingSuggestions[2].recipeName).toBe('Red Wine');
    });

    it('should fetch pairing suggestions with pagination parameters', async () => {
      const mockSuggestion: WebRecipe = {
        recipeName: 'Chocolate Mousse',
        url: 'https://example.com/chocolate-mousse',
      };

      const mockResponse: PairingSuggestionsResponse = {
        recipeId: 456,
        pairingSuggestions: [mockSuggestion],
        limit: 5,
        offset: 10,
        count: 25,
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await pairingApi.getPairingSuggestions(456, {
        limit: 5,
        offset: 10,
      });

      expect(mockClient.get).toHaveBeenCalledWith(
        '/api/recipe-scraper/recipes/456/pairing-suggestions?limit=5&offset=10'
      );
      expect(result.limit).toBe(5);
      expect(result.offset).toBe(10);
      expect(result.count).toBe(25);
      expect(result.pairingSuggestions).toHaveLength(1);
    });

    it('should fetch pairing suggestions with count_only parameter', async () => {
      const mockResponse: PairingSuggestionsResponse = {
        recipeId: 789,
        pairingSuggestions: [],
        limit: 0,
        offset: 0,
        count: 18,
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await pairingApi.getPairingSuggestions(789, {
        count_only: true,
      });

      expect(mockClient.get).toHaveBeenCalledWith(
        '/api/recipe-scraper/recipes/789/pairing-suggestions?count_only=true'
      );
      expect(result.pairingSuggestions).toEqual([]);
      expect(result.count).toBe(18);
    });

    it('should fetch pairing suggestions with all parameters', async () => {
      const mockSuggestion1: WebRecipe = {
        recipeName: 'Greek Salad',
        url: 'https://example.com/greek-salad',
      };

      const mockSuggestion2: WebRecipe = {
        recipeName: 'Tzatziki',
        url: 'https://example.com/tzatziki',
      };

      const mockResponse: PairingSuggestionsResponse = {
        recipeId: 101,
        pairingSuggestions: [mockSuggestion1, mockSuggestion2],
        limit: 3,
        offset: 5,
        count: 12,
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await pairingApi.getPairingSuggestions(101, {
        limit: 3,
        offset: 5,
        count_only: false,
      });

      expect(mockClient.get).toHaveBeenCalledWith(
        '/api/recipe-scraper/recipes/101/pairing-suggestions?limit=3&offset=5&count_only=false'
      );
      expect(result.pairingSuggestions).toHaveLength(2);
      expect(result.pairingSuggestions[0].recipeName).toBe('Greek Salad');
      expect(result.pairingSuggestions[1].recipeName).toBe('Tzatziki');
      expect(result.limit).toBe(3);
      expect(result.offset).toBe(5);
      expect(result.count).toBe(12);
    });

    it('should handle empty pairing suggestions', async () => {
      const mockResponse: PairingSuggestionsResponse = {
        recipeId: 999,
        pairingSuggestions: [],
        limit: 10,
        offset: 0,
        count: 0,
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await pairingApi.getPairingSuggestions(999);

      expect(result.pairingSuggestions).toEqual([]);
      expect(result.count).toBe(0);
    });

    it('should handle pairing suggestions for different recipe types', async () => {
      const mockPizzaPairings: WebRecipe[] = [
        {
          recipeName: 'Antipasto Salad',
          url: 'https://example.com/antipasto-salad',
        },
        {
          recipeName: 'Chianti Wine',
          url: 'https://example.com/chianti-wine',
        },
        {
          recipeName: 'Tiramisu',
          url: 'https://example.com/tiramisu',
        },
      ];

      const mockResponse: PairingSuggestionsResponse = {
        recipeId: 202,
        pairingSuggestions: mockPizzaPairings,
        limit: 10,
        offset: 0,
        count: 3,
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await pairingApi.getPairingSuggestions(202);

      expect(result.pairingSuggestions).toHaveLength(3);
      expect(result.pairingSuggestions.map(p => p.recipeName)).toEqual([
        'Antipasto Salad',
        'Chianti Wine',
        'Tiramisu',
      ]);
    });

    it('should handle pagination beyond available results', async () => {
      const mockResponse: PairingSuggestionsResponse = {
        recipeId: 303,
        pairingSuggestions: [],
        limit: 10,
        offset: 100,
        count: 15,
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await pairingApi.getPairingSuggestions(303, {
        limit: 10,
        offset: 100,
      });

      expect(result.pairingSuggestions).toEqual([]);
      expect(result.offset).toBe(100);
      expect(result.count).toBe(15);
    });

    it('should handle 404 error for non-existent recipe', async () => {
      mockClient.get.mockRejectedValue(new Error('Recipe not found'));

      await expect(pairingApi.getPairingSuggestions(9999)).rejects.toThrow(
        'Recipe not found'
      );
    });

    it('should handle API errors', async () => {
      mockClient.get.mockRejectedValue(new Error('Service unavailable'));

      await expect(pairingApi.getPairingSuggestions(123)).rejects.toThrow(
        'Service unavailable'
      );
    });

    it('should handle invalid parameters', async () => {
      mockClient.get.mockRejectedValue(
        new Error('Invalid limit parameter: must be positive')
      );

      await expect(
        pairingApi.getPairingSuggestions(123, { limit: -1 })
      ).rejects.toThrow('Invalid limit parameter: must be positive');
    });

    it('should handle long recipe names in suggestions', async () => {
      const mockSuggestion: WebRecipe = {
        recipeName:
          "Traditional Italian Grandmother's Secret Recipe Homemade Pasta with Fresh Basil and Aged Parmesan Cheese",
        url: 'https://example.com/long-recipe-name',
      };

      const mockResponse: PairingSuggestionsResponse = {
        recipeId: 404,
        pairingSuggestions: [mockSuggestion],
        limit: 10,
        offset: 0,
        count: 1,
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await pairingApi.getPairingSuggestions(404);

      expect(result.pairingSuggestions[0].recipeName).toBe(
        "Traditional Italian Grandmother's Secret Recipe Homemade Pasta with Fresh Basil and Aged Parmesan Cheese"
      );
    });
  });
});
