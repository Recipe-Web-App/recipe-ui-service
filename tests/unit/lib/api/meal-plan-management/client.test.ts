import {
  mealPlanManagementClient,
  MealPlanManagementApiError,
  handleMealPlanManagementApiError,
  buildQueryParams,
  requestInterceptor,
  requestErrorHandler,
  responseInterceptor,
  responseErrorHandler,
} from '@/lib/api/meal-plan-management/client';
import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// Mock axios
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    defaults: {
      baseURL: 'http://localhost:3000/api/v1/meal-plan-management',
      timeout: 30000,
      headers: { 'Content-Type': 'application/json' },
    },
    interceptors: {
      request: {
        use: jest.fn(),
      },
      response: {
        use: jest.fn(),
      },
    },
  })),
  AxiosError: jest.fn().mockImplementation(function (
    this: any,
    message: string
  ) {
    this.message = message;
    this.isAxiosError = true;
    return this;
  }),
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('Meal Plan Management Client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  describe('client configuration', () => {
    it('should be configured with correct base URL', () => {
      expect(mealPlanManagementClient.defaults.baseURL).toBe(
        'http://localhost:3000/api/v1/meal-plan-management'
      );
    });

    it('should have correct timeout', () => {
      expect(mealPlanManagementClient.defaults.timeout).toBe(30000);
    });

    it('should have correct headers', () => {
      expect(mealPlanManagementClient.defaults.headers['Content-Type']).toBe(
        'application/json'
      );
    });
  });

  describe('requestInterceptor', () => {
    it('should add authorization header when token exists', () => {
      localStorageMock.getItem.mockReturnValue('test-token');

      const config = { headers: {} } as InternalAxiosRequestConfig;
      const result = requestInterceptor(config);

      expect(result.headers.Authorization).toBe('Bearer test-token');
      expect(localStorageMock.getItem).toHaveBeenCalledWith('authToken');
    });

    it('should not add authorization header when token does not exist', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const config = { headers: {} } as InternalAxiosRequestConfig;
      const result = requestInterceptor(config);

      expect(result.headers.Authorization).toBeUndefined();
      expect(localStorageMock.getItem).toHaveBeenCalledWith('authToken');
    });

    it('should handle SSR scenario when window is undefined', () => {
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;

      const config = { headers: {} } as InternalAxiosRequestConfig;
      const result = requestInterceptor(config);

      expect(result.headers.Authorization).toBeUndefined();
      expect(localStorageMock.getItem).toHaveBeenCalledWith('authToken');

      global.window = originalWindow;
    });

    it('should preserve existing config properties', () => {
      localStorageMock.getItem.mockReturnValue('test-token');

      const config = {
        headers: { 'Custom-Header': 'value' } as any,
        method: 'POST',
        url: '/test',
      } as InternalAxiosRequestConfig;
      const result = requestInterceptor(config);

      expect(result.headers.Authorization).toBe('Bearer test-token');
      expect(result.headers['Custom-Header']).toBe('value');
      expect(result.method).toBe('POST');
      expect(result.url).toBe('/test');
    });

    it('should handle config without headers property', () => {
      localStorageMock.getItem.mockReturnValue('test-token');

      const config = {} as InternalAxiosRequestConfig;
      const result = requestInterceptor(config);

      expect(result.headers).toBeDefined();
      expect(result.headers.Authorization).toBe('Bearer test-token');
    });

    it('should handle localStorage exception', () => {
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error('localStorage not available');
      });

      const config = { headers: {} } as InternalAxiosRequestConfig;

      expect(() => requestInterceptor(config)).toThrow(
        'localStorage not available'
      );
    });
  });

  describe('requestErrorHandler', () => {
    it('should reject with the same error', async () => {
      const error = new Error('Request error');

      await expect(requestErrorHandler(error)).rejects.toBe(error);
    });
  });

  describe('responseInterceptor', () => {
    it('should return response unchanged', () => {
      const response: AxiosResponse = {
        data: { message: 'success' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as InternalAxiosRequestConfig,
      };

      const result = responseInterceptor(response);
      expect(result).toBe(response);
    });
  });

  describe('responseErrorHandler', () => {
    it('should handle error with error.message (priority 1)', async () => {
      const error: AxiosError = {
        response: {
          data: { error: { message: 'Validation failed' } },
          status: 400,
          statusText: 'Bad Request',
          headers: {},
          config: {} as InternalAxiosRequestConfig,
        },
        message: 'Request failed',
        name: 'AxiosError',
        config: {} as InternalAxiosRequestConfig,
        isAxiosError: true,
        toJSON: () => ({}),
      };

      await expect(responseErrorHandler(error)).rejects.toMatchObject({
        message: 'Validation failed',
        status: 400,
        response: error.response,
      });
    });

    it('should handle error with message field (priority 2)', async () => {
      const error: AxiosError = {
        response: {
          data: { message: 'Server error' },
          status: 500,
          statusText: 'Internal Server Error',
          headers: {},
          config: {} as InternalAxiosRequestConfig,
        },
        message: 'Request failed',
        name: 'AxiosError',
        config: {} as InternalAxiosRequestConfig,
        isAxiosError: true,
        toJSON: () => ({}),
      };

      await expect(responseErrorHandler(error)).rejects.toMatchObject({
        message: 'Server error',
        status: 500,
        response: error.response,
      });
    });

    it('should handle error with detail field (priority 3)', async () => {
      const error: AxiosError = {
        response: {
          data: { detail: 'Not found' },
          status: 404,
          statusText: 'Not Found',
          headers: {},
          config: {} as InternalAxiosRequestConfig,
        },
        message: 'Request failed',
        name: 'AxiosError',
        config: {} as InternalAxiosRequestConfig,
        isAxiosError: true,
        toJSON: () => ({}),
      };

      await expect(responseErrorHandler(error)).rejects.toMatchObject({
        message: 'Not found',
        status: 404,
        response: error.response,
      });
    });

    it('should fallback to error.message (priority 4)', async () => {
      const error: AxiosError = {
        response: {
          data: {},
          status: 500,
          statusText: 'Internal Server Error',
          headers: {},
          config: {} as InternalAxiosRequestConfig,
        },
        message: 'Network error',
        name: 'AxiosError',
        config: {} as InternalAxiosRequestConfig,
        isAxiosError: true,
        toJSON: () => ({}),
      };

      await expect(responseErrorHandler(error)).rejects.toMatchObject({
        message: 'Network error',
        status: 500,
        response: error.response,
      });
    });

    it('should use fallback message when all else fails', async () => {
      const error: AxiosError = {
        response: {
          data: {},
          status: 500,
          statusText: 'Internal Server Error',
          headers: {},
          config: {} as InternalAxiosRequestConfig,
        },
        message: null as any,
        name: 'AxiosError',
        config: {} as InternalAxiosRequestConfig,
        isAxiosError: true,
        toJSON: () => ({}),
      };

      await expect(responseErrorHandler(error)).rejects.toMatchObject({
        message: 'An unexpected error occurred',
        status: 500,
        response: error.response,
      });
    });

    it('should handle network errors without response', async () => {
      const error: AxiosError = {
        message: 'Network Error',
        name: 'AxiosError',
        config: {} as InternalAxiosRequestConfig,
        isAxiosError: true,
        toJSON: () => ({}),
      };

      await expect(responseErrorHandler(error)).rejects.toMatchObject({
        message: 'Network Error',
        status: undefined,
      });
    });

    it('should handle complex nested error structures', async () => {
      const error: AxiosError = {
        response: {
          data: {
            error: { message: 'Nested error' },
            message: 'Top-level message',
            detail: 'Detail message',
          },
          status: 400,
          statusText: 'Bad Request',
          headers: {},
          config: {} as InternalAxiosRequestConfig,
        },
        message: 'Request failed',
        name: 'AxiosError',
        config: {} as InternalAxiosRequestConfig,
        isAxiosError: true,
        toJSON: () => ({}),
      };

      await expect(responseErrorHandler(error)).rejects.toMatchObject({
        message: 'Nested error', // Should prioritize error.message
        status: 400,
      });
    });

    it('should handle empty string messages with fallback', async () => {
      const error: AxiosError = {
        response: {
          data: {
            error: { message: null },
            message: null,
            detail: null,
          },
          status: 500,
          statusText: 'Internal Server Error',
          headers: {},
          config: {} as InternalAxiosRequestConfig,
        },
        message: null as any,
        name: 'AxiosError',
        config: {} as InternalAxiosRequestConfig,
        isAxiosError: true,
        toJSON: () => ({}),
      };

      await expect(responseErrorHandler(error)).rejects.toMatchObject({
        message: 'An unexpected error occurred',
        status: 500,
      });
    });
  });

  describe('MealPlanManagementApiError', () => {
    it('should create error with message, status, and details', () => {
      const error = new MealPlanManagementApiError('Test error', 400, {
        field: 'invalid',
      });

      expect(error.name).toBe('MealPlanManagementApiError');
      expect(error.message).toBe('Test error');
      expect(error.status).toBe(400);
      expect(error.details).toEqual({ field: 'invalid' });
      expect(error instanceof Error).toBe(true);
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
        data: {
          error: { message: 'Validation failed' },
          details: { field: 'invalid' },
        },
      } as any;

      expect(() => handleMealPlanManagementApiError(axiosError)).toThrow(
        MealPlanManagementApiError
      );
      expect(() => handleMealPlanManagementApiError(axiosError)).toThrow(
        'Validation failed'
      );

      try {
        handleMealPlanManagementApiError(axiosError);
      } catch (error) {
        expect(error).toBeInstanceOf(MealPlanManagementApiError);
        expect((error as MealPlanManagementApiError).status).toBe(400);
        expect((error as MealPlanManagementApiError).details).toEqual({
          field: 'invalid',
        });
      }
    });

    it('should handle AxiosError with message field', () => {
      const axiosError = new AxiosError('Request failed');
      axiosError.response = {
        status: 500,
        data: { message: 'Internal server error' },
      } as any;

      expect(() => handleMealPlanManagementApiError(axiosError)).toThrow(
        'Internal server error'
      );
    });

    it('should handle AxiosError with detail field', () => {
      const axiosError = new AxiosError('Request failed');
      axiosError.response = {
        status: 404,
        data: { detail: 'Resource not found' },
      } as any;

      expect(() => handleMealPlanManagementApiError(axiosError)).toThrow(
        'Resource not found'
      );
    });

    it('should handle AxiosError without response data', () => {
      const axiosError = new AxiosError('Network error');
      axiosError.message = 'Network error';

      expect(() => handleMealPlanManagementApiError(axiosError)).toThrow(
        'Network error'
      );
    });

    it('should handle axios-like error objects with response', () => {
      const axiosLikeError = {
        response: {
          status: 400,
          data: {
            error: { message: 'Axios-like error' },
            details: { test: true },
          },
        },
        message: 'Request failed',
      };

      expect(() => handleMealPlanManagementApiError(axiosLikeError)).toThrow(
        MealPlanManagementApiError
      );
      expect(() => handleMealPlanManagementApiError(axiosLikeError)).toThrow(
        'Axios-like error'
      );

      try {
        handleMealPlanManagementApiError(axiosLikeError);
      } catch (error) {
        expect((error as MealPlanManagementApiError).status).toBe(400);
        expect((error as MealPlanManagementApiError).details).toEqual({
          test: true,
        });
      }
    });

    it('should handle error objects with message property', () => {
      const errorObj = {
        message: 'Custom error',
        status: 422,
        details: { validation: 'failed' },
      };

      expect(() => handleMealPlanManagementApiError(errorObj)).toThrow(
        'Custom error'
      );

      try {
        handleMealPlanManagementApiError(errorObj);
      } catch (error) {
        expect((error as MealPlanManagementApiError).status).toBe(422);
        expect((error as MealPlanManagementApiError).details).toEqual({
          validation: 'failed',
        });
      }
    });

    it('should handle generic Error instances', () => {
      const error = new Error('Generic error');

      expect(() => handleMealPlanManagementApiError(error)).toThrow(
        MealPlanManagementApiError
      );
      expect(() => handleMealPlanManagementApiError(error)).toThrow(
        'Generic error'
      );
    });

    it('should handle unknown error types', () => {
      const error = 'string error';

      expect(() => handleMealPlanManagementApiError(error)).toThrow(
        'An unexpected error occurred'
      );
    });

    it('should handle error priorities correctly', () => {
      const axiosError = new AxiosError('Original message');
      axiosError.response = {
        status: 400,
        data: {
          error: { message: 'Priority 1' },
          message: 'Priority 2',
          detail: 'Priority 3',
        },
      } as any;

      expect(() => handleMealPlanManagementApiError(axiosError)).toThrow(
        'Priority 1'
      );
    });

    it('should handle axios-like error with fallback to message field', () => {
      const axiosLikeError = {
        response: {
          status: 400,
          data: { message: 'Only message field' },
        },
        message: 'Request failed',
      };

      expect(() => handleMealPlanManagementApiError(axiosLikeError)).toThrow(
        'Only message field'
      );
    });

    it('should handle axios-like error with fallback to detail field', () => {
      const axiosLikeError = {
        response: {
          status: 404,
          data: { detail: 'Only detail field' },
        },
        message: 'Request failed',
      };

      expect(() => handleMealPlanManagementApiError(axiosLikeError)).toThrow(
        'Only detail field'
      );
    });

    it('should handle axios-like error with fallback to axios message', () => {
      const axiosLikeError = {
        response: {
          status: 500,
          data: {},
        },
        message: 'Axios-like message',
      };

      expect(() => handleMealPlanManagementApiError(axiosLikeError)).toThrow(
        'Axios-like message'
      );
    });

    it('should handle axios-like error with complete fallback', () => {
      const axiosLikeError = {
        response: {
          status: 500,
          data: {},
        },
      };

      expect(() => handleMealPlanManagementApiError(axiosLikeError)).toThrow(
        'An unexpected error occurred'
      );
    });
  });

  describe('buildQueryParams', () => {
    it('should build query string from object', () => {
      const params = {
        page: 1,
        limit: 10,
        search: 'test',
      };

      const result = buildQueryParams(params);
      expect(result).toBe('page=1&limit=10&search=test');
    });

    it('should handle array values', () => {
      const params = {
        tags: ['vegetarian', 'quick'],
        difficulty: 'easy',
      };

      const result = buildQueryParams(params);
      expect(result).toBe('tags=vegetarian&tags=quick&difficulty=easy');
    });

    it('should skip undefined and null values', () => {
      const params = {
        page: 1,
        search: undefined,
        tags: null,
        limit: 10,
      };

      const result = buildQueryParams(params);
      expect(result).toBe('page=1&limit=10');
    });

    it('should handle empty object', () => {
      const result = buildQueryParams({});
      expect(result).toBe('');
    });

    it('should convert values to strings', () => {
      const params = {
        active: true,
        count: 0,
        rating: 4.5,
      };

      const result = buildQueryParams(params);
      expect(result).toBe('active=true&count=0&rating=4.5');
    });

    it('should handle mixed data types', () => {
      const params = {
        text: 'hello world',
        numbers: [1, 2, 3],
        bool: false,
        nested: { should: 'be stringified' },
      };

      const result = buildQueryParams(params);
      // URLSearchParams encodes spaces as + not %20
      expect(result).toContain('text=hello+world');
      expect(result).toContain('numbers=1&numbers=2&numbers=3');
      expect(result).toContain('bool=false');
      expect(result).toContain('nested=%5Bobject+Object%5D');
    });
  });
});
