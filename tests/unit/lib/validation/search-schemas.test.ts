import {
  searchQuerySchema,
  ingredientsListSchema,
  tagsListSchema,
  difficultyListSchema,
  maxPrepTimeSchema,
  maxCookTimeSchema,
  minRatingSchema,
  sortBySchema,
  searchFormSchema,
  convertToSearchRecipesRequest,
  convertFromSearchRecipesRequest,
  searchFormDefaultValues,
  hasActiveFilters,
  countActiveFilters,
} from '@/lib/validation/search-schemas';
import { DifficultyLevel } from '@/types/recipe-management/common';
import type { SearchRecipesRequest } from '@/types/recipe-management/search';
import { SearchSortBy } from '@/types/recipe-management/search';

describe('Search Schemas', () => {
  describe('searchQuerySchema', () => {
    it('should validate valid search queries', () => {
      expect(searchQuerySchema.parse('pasta')).toBe('pasta');
      expect(searchQuerySchema.parse('chocolate cake')).toBe('chocolate cake');
    });

    it('should allow undefined queries', () => {
      expect(searchQuerySchema.parse(undefined)).toBeUndefined();
    });

    it('should trim whitespace', () => {
      expect(searchQuerySchema.parse('  pizza  ')).toBe('pizza');
    });

    it('should reject queries less than 2 characters', () => {
      expect(() => searchQuerySchema.parse('a')).toThrow(
        'Search query must be at least 2 characters'
      );
    });

    it('should reject queries exceeding 200 characters', () => {
      const longQuery = 'a'.repeat(201);
      expect(() => searchQuerySchema.parse(longQuery)).toThrow(
        'Search query must not exceed 200 characters'
      );
    });
  });

  describe('ingredientsListSchema', () => {
    it('should validate valid ingredient lists', () => {
      const ingredients = ['tomato', 'basil', 'mozzarella'];
      expect(ingredientsListSchema.parse(ingredients)).toEqual(ingredients);
    });

    it('should allow undefined', () => {
      expect(ingredientsListSchema.parse(undefined)).toBeUndefined();
    });

    it('should trim ingredient names', () => {
      expect(ingredientsListSchema.parse(['  tomato  '])).toEqual(['tomato']);
    });

    it('should reject empty ingredient names', () => {
      expect(() => ingredientsListSchema.parse([''])).toThrow(
        'Ingredient name is required'
      );
    });

    it('should reject ingredient names exceeding 100 characters', () => {
      const longIngredient = 'a'.repeat(101);
      expect(() => ingredientsListSchema.parse([longIngredient])).toThrow(
        'Ingredient name must not exceed 100 characters'
      );
    });

    it('should reject lists with more than 20 ingredients', () => {
      const tooManyIngredients = Array(21).fill('ingredient');
      expect(() => ingredientsListSchema.parse(tooManyIngredients)).toThrow(
        'Cannot search with more than 20 ingredients'
      );
    });
  });

  describe('tagsListSchema', () => {
    it('should validate valid tag lists', () => {
      const tags = ['vegetarian', 'quick', 'healthy'];
      expect(tagsListSchema.parse(tags)).toEqual(tags);
    });

    it('should allow undefined', () => {
      expect(tagsListSchema.parse(undefined)).toBeUndefined();
    });

    it('should trim tag names', () => {
      expect(tagsListSchema.parse(['  vegan  '])).toEqual(['vegan']);
    });

    it('should reject empty tags', () => {
      expect(() => tagsListSchema.parse([''])).toThrow('Tag is required');
    });

    it('should reject tags exceeding 50 characters', () => {
      const longTag = 'a'.repeat(51);
      expect(() => tagsListSchema.parse([longTag])).toThrow(
        'Tag must not exceed 50 characters'
      );
    });

    it('should reject lists with more than 10 tags', () => {
      const tooManyTags = Array(11).fill('tag');
      expect(() => tagsListSchema.parse(tooManyTags)).toThrow(
        'Cannot search with more than 10 tags'
      );
    });
  });

  describe('difficultyListSchema', () => {
    it('should validate valid difficulty lists', () => {
      const difficulties = [DifficultyLevel.EASY, DifficultyLevel.MEDIUM];
      expect(difficultyListSchema.parse(difficulties)).toEqual(difficulties);
    });

    it('should allow undefined', () => {
      expect(difficultyListSchema.parse(undefined)).toBeUndefined();
    });

    it('should reject invalid difficulty levels', () => {
      expect(() => difficultyListSchema.parse(['INVALID'])).toThrow();
    });
  });

  describe('maxPrepTimeSchema', () => {
    it('should validate valid prep times', () => {
      expect(maxPrepTimeSchema.parse(30)).toBe(30);
      expect(maxPrepTimeSchema.parse(1440)).toBe(1440);
    });

    it('should allow undefined', () => {
      expect(maxPrepTimeSchema.parse(undefined)).toBeUndefined();
    });

    it('should reject non-integer values', () => {
      expect(() => maxPrepTimeSchema.parse(30.5)).toThrow(
        'Prep time must be a whole number'
      );
    });

    it('should reject values less than 1', () => {
      expect(() => maxPrepTimeSchema.parse(0)).toThrow(
        'Prep time must be at least 1 minute'
      );
    });

    it('should reject values exceeding 1440', () => {
      expect(() => maxPrepTimeSchema.parse(1441)).toThrow(
        'Prep time must not exceed 1440 minutes'
      );
    });
  });

  describe('maxCookTimeSchema', () => {
    it('should validate valid cook times', () => {
      expect(maxCookTimeSchema.parse(60)).toBe(60);
      expect(maxCookTimeSchema.parse(1440)).toBe(1440);
    });

    it('should allow undefined', () => {
      expect(maxCookTimeSchema.parse(undefined)).toBeUndefined();
    });

    it('should reject non-integer values', () => {
      expect(() => maxCookTimeSchema.parse(60.5)).toThrow(
        'Cook time must be a whole number'
      );
    });

    it('should reject values less than 1', () => {
      expect(() => maxCookTimeSchema.parse(0)).toThrow(
        'Cook time must be at least 1 minute'
      );
    });

    it('should reject values exceeding 1440', () => {
      expect(() => maxCookTimeSchema.parse(1441)).toThrow(
        'Cook time must not exceed 1440 minutes'
      );
    });
  });

  describe('minRatingSchema', () => {
    it('should validate valid ratings', () => {
      expect(minRatingSchema.parse(1)).toBe(1);
      expect(minRatingSchema.parse(3)).toBe(3);
      expect(minRatingSchema.parse(5)).toBe(5);
    });

    it('should allow undefined', () => {
      expect(minRatingSchema.parse(undefined)).toBeUndefined();
    });

    it('should reject ratings below 1', () => {
      expect(() => minRatingSchema.parse(0)).toThrow(
        'Rating must be at least 1 star'
      );
    });

    it('should reject ratings above 5', () => {
      expect(() => minRatingSchema.parse(6)).toThrow(
        'Rating must not exceed 5 stars'
      );
    });
  });

  describe('sortBySchema', () => {
    it('should validate valid sort options', () => {
      expect(sortBySchema.parse(SearchSortBy.RATING_DESC)).toBe(
        SearchSortBy.RATING_DESC
      );
      expect(sortBySchema.parse(SearchSortBy.DATE_ASC)).toBe(
        SearchSortBy.DATE_ASC
      );
    });

    it('should allow undefined', () => {
      expect(sortBySchema.parse(undefined)).toBeUndefined();
    });

    it('should reject invalid sort options', () => {
      expect(() => sortBySchema.parse('INVALID')).toThrow();
    });
  });

  describe('searchFormSchema', () => {
    it('should validate complete search form data', () => {
      const formData = {
        query: 'pasta',
        ingredients: ['tomato', 'basil'],
        tags: ['italian', 'quick'],
        difficulty: [DifficultyLevel.EASY],
        maxPrepTime: 30,
        maxCookTime: 60,
        minRating: 4,
        sortBy: SearchSortBy.RATING_DESC,
      };
      expect(searchFormSchema.parse(formData)).toEqual(formData);
    });

    it('should allow partial search form data', () => {
      const formData = {
        query: 'pizza',
      };
      const result = searchFormSchema.parse(formData);
      expect(result.query).toBe('pizza');
    });

    it('should allow empty search form', () => {
      const formData = {};
      expect(() => searchFormSchema.parse(formData)).not.toThrow();
    });
  });

  describe('convertToSearchRecipesRequest', () => {
    it('should convert complete form data to API request', () => {
      const formData = {
        query: 'pasta',
        ingredients: ['tomato', 'basil'],
        tags: ['italian'],
        difficulty: [DifficultyLevel.EASY, DifficultyLevel.MEDIUM],
        maxPrepTime: 30,
        maxCookTime: 60,
        minRating: 4,
        sortBy: SearchSortBy.RATING_DESC,
      };
      const result = convertToSearchRecipesRequest(formData);
      expect(result).toEqual({
        query: 'pasta',
        ingredients: ['tomato', 'basil'],
        tags: ['italian'],
        difficulty: [DifficultyLevel.EASY, DifficultyLevel.MEDIUM],
        maxPrepTime: 30,
        maxCookTime: 60,
        minRating: 4,
        sortBy: SearchSortBy.RATING_DESC,
      });
    });

    it('should omit undefined fields', () => {
      const formData = {
        query: 'pizza',
        ingredients: undefined,
        tags: undefined,
        difficulty: undefined,
        maxPrepTime: undefined,
        maxCookTime: undefined,
        minRating: undefined,
        sortBy: undefined,
      };
      const result = convertToSearchRecipesRequest(formData);
      expect(result).toEqual({ query: 'pizza' });
    });

    it('should omit empty arrays', () => {
      const formData = {
        query: 'soup',
        ingredients: [],
        tags: [],
        difficulty: [],
      };
      const result = convertToSearchRecipesRequest(formData);
      expect(result).toEqual({ query: 'soup' });
    });
  });

  describe('convertFromSearchRecipesRequest', () => {
    it('should convert API request to form data', () => {
      const searchData: SearchRecipesRequest = {
        query: 'pasta',
        ingredients: ['tomato'],
        tags: ['italian'],
        difficulty: [DifficultyLevel.EASY],
        maxPrepTime: 30,
        maxCookTime: 60,
        minRating: 4,
        sortBy: SearchSortBy.RATING_DESC,
      };
      const result = convertFromSearchRecipesRequest(searchData);
      expect(result).toEqual({
        query: 'pasta',
        ingredients: ['tomato'],
        tags: ['italian'],
        difficulty: [DifficultyLevel.EASY],
        maxPrepTime: 30,
        maxCookTime: 60,
        minRating: 4,
        sortBy: SearchSortBy.RATING_DESC,
      });
    });

    it('should handle missing fields with defaults', () => {
      const searchData: SearchRecipesRequest = {};
      const result = convertFromSearchRecipesRequest(searchData);
      expect(result).toEqual({
        query: '',
        ingredients: [],
        tags: [],
        difficulty: [],
        maxPrepTime: undefined,
        maxCookTime: undefined,
        minRating: undefined,
        sortBy: undefined,
      });
    });
  });

  describe('searchFormDefaultValues', () => {
    it('should have correct default values', () => {
      expect(searchFormDefaultValues).toEqual({
        query: '',
        ingredients: [],
        tags: [],
        difficulty: [],
        maxPrepTime: undefined,
        maxCookTime: undefined,
        minRating: undefined,
        sortBy: undefined,
      });
    });
  });

  describe('hasActiveFilters', () => {
    it('should return true when query is present', () => {
      const formData = { ...searchFormDefaultValues, query: 'pasta' };
      expect(hasActiveFilters(formData)).toBe(true);
    });

    it('should return true when ingredients are present', () => {
      const formData = { ...searchFormDefaultValues, ingredients: ['tomato'] };
      expect(hasActiveFilters(formData)).toBe(true);
    });

    it('should return true when tags are present', () => {
      const formData = { ...searchFormDefaultValues, tags: ['italian'] };
      expect(hasActiveFilters(formData)).toBe(true);
    });

    it('should return true when difficulty is present', () => {
      const formData = {
        ...searchFormDefaultValues,
        difficulty: [DifficultyLevel.EASY],
      };
      expect(hasActiveFilters(formData)).toBe(true);
    });

    it('should return true when time constraints are present', () => {
      const formData = { ...searchFormDefaultValues, maxPrepTime: 30 };
      expect(hasActiveFilters(formData)).toBe(true);
    });

    it('should return true when rating is present', () => {
      const formData = { ...searchFormDefaultValues, minRating: 4 };
      expect(hasActiveFilters(formData)).toBe(true);
    });

    it('should return false when no filters are active', () => {
      expect(hasActiveFilters(searchFormDefaultValues)).toBe(false);
    });

    it('should return false when query is less than 2 characters', () => {
      const formData = { ...searchFormDefaultValues, query: 'a' };
      expect(hasActiveFilters(formData)).toBe(false);
    });
  });

  describe('countActiveFilters', () => {
    it('should count all active filters', () => {
      const formData = {
        query: 'pasta',
        ingredients: ['tomato'],
        tags: ['italian'],
        difficulty: [DifficultyLevel.EASY],
        maxPrepTime: 30,
        maxCookTime: 60,
        minRating: 4,
        sortBy: undefined,
      };
      expect(countActiveFilters(formData)).toBe(7);
    });

    it('should return 0 when no filters are active', () => {
      expect(countActiveFilters(searchFormDefaultValues)).toBe(0);
    });

    it('should not count query less than 2 characters', () => {
      const formData = { ...searchFormDefaultValues, query: 'a' };
      expect(countActiveFilters(formData)).toBe(0);
    });

    it('should not count empty arrays', () => {
      const formData = {
        ...searchFormDefaultValues,
        ingredients: [],
        tags: [],
      };
      expect(countActiveFilters(formData)).toBe(0);
    });
  });
});
