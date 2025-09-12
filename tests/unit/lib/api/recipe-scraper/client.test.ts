import {
  RecipeScraperApiError,
  handleRecipeScraperApiError,
  buildQueryParams,
} from '@/lib/api/recipe-scraper/client';
import type { ErrorResponse } from '@/types/recipe-scraper';

describe('Recipe Scraper API Client Utilities', () => {
  describe('RecipeScraperApiError', () => {
    it('should create error with all properties', () => {
      const error = new RecipeScraperApiError(
        'Test error',
        400,
        'INVALID_URL',
        'validation_error'
      );

      expect(error.name).toBe('RecipeScraperApiError');
      expect(error.message).toBe('Test error');
      expect(error.status).toBe(400);
      expect(error.error_code).toBe('INVALID_URL');
      expect(error.error_type).toBe('validation_error');
      expect(error).toBeInstanceOf(Error);
    });

    it('should create error with minimal properties', () => {
      const error = new RecipeScraperApiError('Simple error');

      expect(error.name).toBe('RecipeScraperApiError');
      expect(error.message).toBe('Simple error');
      expect(error.status).toBeUndefined();
      expect(error.error_code).toBeUndefined();
      expect(error.error_type).toBeUndefined();
    });

    it('should create error with partial properties', () => {
      const error = new RecipeScraperApiError(
        'Partial error',
        403,
        'FORBIDDEN'
      );

      expect(error.message).toBe('Partial error');
      expect(error.status).toBe(403);
      expect(error.error_code).toBe('FORBIDDEN');
      expect(error.error_type).toBeUndefined();
    });
  });

  describe('handleRecipeScraperApiError', () => {
    it('should handle AxiosError with ErrorResponse', () => {
      const axiosError = {
        response: {
          status: 400,
          data: {
            detail: 'Invalid recipe URL',
            error_code: 'INVALID_RECIPE_URL',
            error_type: 'validation_error',
          } as ErrorResponse,
        },
        message: 'Request failed',
      };

      expect(() => handleRecipeScraperApiError(axiosError)).toThrow(
        RecipeScraperApiError
      );

      try {
        handleRecipeScraperApiError(axiosError);
      } catch (error) {
        expect(error).toBeInstanceOf(RecipeScraperApiError);
        const scraperError = error as RecipeScraperApiError;
        expect(scraperError.message).toBe('Invalid recipe URL');
        expect(scraperError.status).toBe(400);
        expect(scraperError.error_code).toBe('INVALID_RECIPE_URL');
        expect(scraperError.error_type).toBe('validation_error');
      }
    });

    it('should handle AxiosError without detail', () => {
      const axiosError = {
        response: {
          status: 500,
        },
        message: 'Network error',
      };

      expect(() => handleRecipeScraperApiError(axiosError)).toThrow(
        RecipeScraperApiError
      );

      try {
        handleRecipeScraperApiError(axiosError);
      } catch (error) {
        expect(error).toBeInstanceOf(RecipeScraperApiError);
        const scraperError = error as RecipeScraperApiError;
        expect(scraperError.message).toBe('Network error');
        expect(scraperError.status).toBe(500);
      }
    });

    it('should handle axios-like error object', () => {
      const axiosLikeError = {
        response: {
          status: 404,
          data: {
            detail: 'Recipe not found',
            error_code: 'RECIPE_NOT_FOUND',
          } as ErrorResponse,
        },
        message: 'Not found',
      };

      expect(() => handleRecipeScraperApiError(axiosLikeError)).toThrow(
        RecipeScraperApiError
      );

      try {
        handleRecipeScraperApiError(axiosLikeError);
      } catch (error) {
        expect(error).toBeInstanceOf(RecipeScraperApiError);
        const scraperError = error as RecipeScraperApiError;
        expect(scraperError.message).toBe('Recipe not found');
        expect(scraperError.status).toBe(404);
        expect(scraperError.error_code).toBe('RECIPE_NOT_FOUND');
      }
    });

    it('should handle axios-like error without data', () => {
      const axiosLikeError = {
        response: {
          status: 500,
        },
        message: 'Server error',
      };

      expect(() => handleRecipeScraperApiError(axiosLikeError)).toThrow(
        RecipeScraperApiError
      );

      try {
        handleRecipeScraperApiError(axiosLikeError);
      } catch (error) {
        expect(error).toBeInstanceOf(RecipeScraperApiError);
        const scraperError = error as RecipeScraperApiError;
        expect(scraperError.message).toBe('Server error');
        expect(scraperError.status).toBe(500);
      }
    });

    it('should handle error object with message', () => {
      const errorObj = {
        message: 'Custom error',
        status: 422,
        error_code: 'VALIDATION_ERROR',
        error_type: 'field_validation',
      };

      expect(() => handleRecipeScraperApiError(errorObj)).toThrow(
        RecipeScraperApiError
      );

      try {
        handleRecipeScraperApiError(errorObj);
      } catch (error) {
        expect(error).toBeInstanceOf(RecipeScraperApiError);
        const scraperError = error as RecipeScraperApiError;
        expect(scraperError.message).toBe('Custom error');
        expect(scraperError.status).toBe(422);
        expect(scraperError.error_code).toBe('VALIDATION_ERROR');
        expect(scraperError.error_type).toBe('field_validation');
      }
    });

    it('should handle Error instances', () => {
      const error = new Error('Standard error');

      expect(() => handleRecipeScraperApiError(error)).toThrow(
        RecipeScraperApiError
      );

      try {
        handleRecipeScraperApiError(error);
      } catch (caughtError) {
        expect(caughtError).toBeInstanceOf(RecipeScraperApiError);
        const scraperError = caughtError as RecipeScraperApiError;
        expect(scraperError.message).toBe('Standard error');
      }
    });

    it('should handle unknown error types', () => {
      const unknownError = 'Unknown error string';

      expect(() => handleRecipeScraperApiError(unknownError)).toThrow(
        RecipeScraperApiError
      );

      try {
        handleRecipeScraperApiError(unknownError);
      } catch (error) {
        expect(error).toBeInstanceOf(RecipeScraperApiError);
        const scraperError = error as RecipeScraperApiError;
        expect(scraperError.message).toBe('An unexpected error occurred');
      }
    });
  });

  describe('buildQueryParams', () => {
    it('should build query string from simple object', () => {
      const params = {
        limit: 10,
        offset: 0,
        include_total: true,
      };

      const result = buildQueryParams(params);
      expect(result).toBe('limit=10&offset=0&include_total=true');
    });

    it('should handle string values', () => {
      const params = {
        measurement: 'CUP',
        ingredient: 'flour',
      };

      const result = buildQueryParams(params);
      expect(result).toBe('measurement=CUP&ingredient=flour');
    });

    it('should handle array values', () => {
      const params = {
        categories: ['dessert', 'baking'],
        tags: ['easy', 'quick'],
      };

      const result = buildQueryParams(params);
      expect(result).toContain('categories=dessert');
      expect(result).toContain('categories=baking');
      expect(result).toContain('tags=easy');
      expect(result).toContain('tags=quick');
    });

    it('should skip undefined and null values', () => {
      const params = {
        limit: 10,
        offset: undefined,
        count_only: null,
        include_total: true,
      };

      const result = buildQueryParams(params);
      expect(result).toBe('limit=10&include_total=true');
    });

    it('should handle empty object', () => {
      const result = buildQueryParams({});
      expect(result).toBe('');
    });

    it('should handle numeric zero values', () => {
      const params = {
        offset: 0,
        limit: 0,
      };

      const result = buildQueryParams(params);
      expect(result).toBe('offset=0&limit=0');
    });

    it('should handle boolean false values', () => {
      const params = {
        count_only: false,
        include_total: true,
      };

      const result = buildQueryParams(params);
      expect(result).toBe('count_only=false&include_total=true');
    });

    it('should handle mixed data types', () => {
      const params = {
        recipe_id: 123,
        amount: 2.5,
        measurement: 'CUP',
        include_ingredients: true,
        tags: ['dessert', 'cookies'],
      };

      const result = buildQueryParams(params);
      expect(result).toContain('recipe_id=123');
      expect(result).toContain('amount=2.5');
      expect(result).toContain('measurement=CUP');
      expect(result).toContain('include_ingredients=true');
      expect(result).toContain('tags=dessert');
      expect(result).toContain('tags=cookies');
    });
  });
});
