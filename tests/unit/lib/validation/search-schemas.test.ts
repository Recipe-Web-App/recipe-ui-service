import {
  searchQuerySchema,
  ingredientsListSchema,
  tagsListSchema,
  difficultySchema,
  maxPrepTimeSchema,
  maxCookTimeSchema,
  searchFormSchema,
  convertToSearchRecipesRequest,
  convertFromSearchRecipesRequest,
  searchFormDefaultValues,
  hasActiveFilters,
  countActiveFilters,
} from '@/lib/validation/search-schemas';
import { DifficultyLevel } from '@/types/recipe-management/common';
import type { SearchRecipesRequest } from '@/types/recipe-management/search';

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

  describe('difficultySchema', () => {
    it('should validate valid difficulty levels', () => {
      expect(difficultySchema.parse(DifficultyLevel.EASY)).toBe(
        DifficultyLevel.EASY
      );
      expect(difficultySchema.parse(DifficultyLevel.MEDIUM)).toBe(
        DifficultyLevel.MEDIUM
      );
    });

    it('should allow undefined', () => {
      expect(difficultySchema.parse(undefined)).toBeUndefined();
    });

    it('should reject invalid difficulty levels', () => {
      expect(() => difficultySchema.parse('INVALID')).toThrow();
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

  describe('searchFormSchema', () => {
    it('should validate complete search form data', () => {
      const formData = {
        query: 'pasta',
        ingredients: ['tomato', 'basil'],
        tags: ['italian', 'quick'],
        difficulty: DifficultyLevel.EASY,
        maxPrepTime: 30,
        maxCookTime: 60,
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
        difficulty: DifficultyLevel.EASY,
        maxPrepTime: 30,
        maxCookTime: 60,
      };
      const result = convertToSearchRecipesRequest(formData);
      expect(result).toEqual({
        recipeNameQuery: 'pasta',
        ingredients: ['tomato', 'basil'],
        tags: ['italian'],
        difficulty: DifficultyLevel.EASY,
        maxPreparationTime: 30,
        maxCookingTime: 60,
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
      };
      const result = convertToSearchRecipesRequest(formData);
      expect(result).toEqual({ recipeNameQuery: 'pizza' });
    });

    it('should omit empty arrays', () => {
      const formData = {
        query: 'soup',
        ingredients: [],
        tags: [],
        difficulty: undefined,
      };
      const result = convertToSearchRecipesRequest(formData);
      expect(result).toEqual({ recipeNameQuery: 'soup' });
    });
  });

  describe('convertFromSearchRecipesRequest', () => {
    it('should convert API request to form data', () => {
      const searchData: SearchRecipesRequest = {
        recipeNameQuery: 'pasta',
        ingredients: ['tomato'],
        tags: ['italian'],
        difficulty: DifficultyLevel.EASY,
        maxPreparationTime: 30,
        maxCookingTime: 60,
      };
      const result = convertFromSearchRecipesRequest(searchData);
      expect(result).toEqual({
        query: 'pasta',
        ingredients: ['tomato'],
        ingredientMatchMode: undefined,
        tags: ['italian'],
        difficulty: DifficultyLevel.EASY,
        maxPrepTime: 30,
        maxCookTime: 60,
        minServings: undefined,
        maxServings: undefined,
      });
    });

    it('should handle missing fields with defaults', () => {
      const searchData: SearchRecipesRequest = {};
      const result = convertFromSearchRecipesRequest(searchData);
      expect(result).toEqual({
        query: '',
        ingredients: [],
        ingredientMatchMode: undefined,
        tags: [],
        difficulty: undefined,
        maxPrepTime: undefined,
        maxCookTime: undefined,
        minServings: undefined,
        maxServings: undefined,
      });
    });
  });

  describe('searchFormDefaultValues', () => {
    it('should have correct default values', () => {
      expect(searchFormDefaultValues).toEqual({
        query: '',
        ingredients: [],
        ingredientMatchMode: undefined,
        tags: [],
        difficulty: undefined,
        maxPrepTime: undefined,
        maxCookTime: undefined,
        minServings: undefined,
        maxServings: undefined,
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
        difficulty: DifficultyLevel.EASY,
      };
      expect(hasActiveFilters(formData)).toBe(true);
    });

    it('should return true when time constraints are present', () => {
      const formData = { ...searchFormDefaultValues, maxPrepTime: 30 };
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
        ...searchFormDefaultValues,
        query: 'pasta',
        ingredients: ['tomato'],
        tags: ['italian'],
        difficulty: DifficultyLevel.EASY,
        maxPrepTime: 30,
        maxCookTime: 60,
      };
      expect(countActiveFilters(formData)).toBe(6);
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
