import {
  mealPlanManagementClient,
  MealPlanManagementApiError,
  handleMealPlanManagementApiError,
  buildQueryParams,
} from '@/lib/api/meal-plan-management/client';
import { AxiosError } from 'axios';

// Mock axios
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  })),
  AxiosError: jest.requireActual('axios').AxiosError,
}));

describe('Meal Plan Management Client', () => {
  describe('MealPlanManagementApiError', () => {
    it('should create error with message, status, and details', () => {
      const error = new MealPlanManagementApiError('Test error', 400, {
        field: 'invalid',
      });

      expect(error.name).toBe('MealPlanManagementApiError');
      expect(error.message).toBe('Test error');
      expect(error.status).toBe(400);
      expect(error.details).toEqual({ field: 'invalid' });
    });

    it('should create error with just message', () => {
      const error = new MealPlanManagementApiError('Test error');

      expect(error.name).toBe('MealPlanManagementApiError');
      expect(error.message).toBe('Test error');
      expect(error.status).toBeUndefined();
      expect(error.details).toBeUndefined();
    });
  });

  describe('handleMealPlanManagementApiError', () => {
    it('should handle AxiosError with error.message', () => {
      const axiosError = new AxiosError('Request failed');
      axiosError.response = {
        status: 400,
        data: { error: { message: 'Validation failed' } },
      } as any;

      expect(() => handleMealPlanManagementApiError(axiosError)).toThrow(
        MealPlanManagementApiError
      );
    });

    it('should handle AxiosError with message field', () => {
      const axiosError = new AxiosError('Request failed');
      axiosError.response = {
        status: 404,
        data: { message: 'Not found' },
      } as any;

      expect(() => handleMealPlanManagementApiError(axiosError)).toThrow(
        MealPlanManagementApiError
      );
    });

    it('should handle AxiosError with detail field', () => {
      const axiosError = new AxiosError('Request failed');
      axiosError.response = {
        status: 500,
        data: { detail: 'Internal server error' },
      } as any;

      expect(() => handleMealPlanManagementApiError(axiosError)).toThrow(
        MealPlanManagementApiError
      );
    });

    it('should handle axios-like error objects', () => {
      const axiosLikeError = {
        response: {
          status: 400,
          data: { error: { message: 'Bad request' } },
        },
        message: 'Request failed',
      };

      expect(() => handleMealPlanManagementApiError(axiosLikeError)).toThrow(
        MealPlanManagementApiError
      );
    });

    it('should handle error objects with message', () => {
      const errorWithMessage = {
        message: 'Generic error',
        status: 500,
        details: { code: 'INTERNAL_ERROR' },
      };

      expect(() => handleMealPlanManagementApiError(errorWithMessage)).toThrow(
        MealPlanManagementApiError
      );
    });

    it('should handle Error instances', () => {
      const error = new Error('Standard error');

      expect(() => handleMealPlanManagementApiError(error)).toThrow(
        MealPlanManagementApiError
      );
    });

    it('should handle unknown errors', () => {
      const unknownError = 'string error';

      expect(() => handleMealPlanManagementApiError(unknownError)).toThrow(
        MealPlanManagementApiError
      );
    });
  });

  describe('buildQueryParams', () => {
    it('should build query string from object', () => {
      const params = {
        page: 1,
        limit: 20,
        sort: 'name',
        isActive: true,
      };

      const result = buildQueryParams(params);
      expect(result).toBe('page=1&limit=20&sort=name&isActive=true');
    });

    it('should handle array values', () => {
      const params = {
        tags: ['breakfast', 'healthy'],
        ids: [1, 2, 3],
      };

      const result = buildQueryParams(params);
      expect(result).toBe('tags=breakfast&tags=healthy&ids=1&ids=2&ids=3');
    });

    it('should skip undefined and null values', () => {
      const params = {
        page: 1,
        limit: undefined,
        sort: null,
        isActive: true,
      };

      const result = buildQueryParams(params);
      expect(result).toBe('page=1&isActive=true');
    });

    it('should handle empty object', () => {
      const result = buildQueryParams({});
      expect(result).toBe('');
    });

    it('should convert values to strings', () => {
      const params = {
        page: 1,
        timestamp: new Date('2023-01-01T10:00:00Z'),
        isActive: false,
      };

      const result = buildQueryParams(params);
      expect(result).toContain('page=1');
      expect(result).toContain('isActive=false');
      expect(result).toContain('timestamp=');
    });
  });
});
