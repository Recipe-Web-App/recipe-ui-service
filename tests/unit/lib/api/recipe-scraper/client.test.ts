import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import {
  RecipeScraperApiError,
  handleRecipeScraperApiError,
  buildQueryParams,
  recipeScraperClient,
  requestInterceptor,
  requestErrorHandler,
  responseInterceptor,
  responseErrorHandler,
} from '@/lib/api/recipe-scraper/client';
import type { ErrorResponse } from '@/types/recipe-scraper';

jest.mock('axios', () => ({
  create: jest.fn(() => ({
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  })),
  AxiosError: jest.fn((message?: string) => {
    const error = new Error(message);
    error.name = 'AxiosError';
    return error;
  }),
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Recipe Scraper API Client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Client Configuration', () => {
    beforeEach(() => {
      mockedAxios.create.mockReturnValue({
        interceptors: {
          request: { use: jest.fn() },
          response: { use: jest.fn() },
        },
      } as any);
    });

    it('should create axios client with correct configuration', () => {
      jest.isolateModules(() => {
        require('@/lib/api/recipe-scraper/client');
        expect(mockedAxios.create).toHaveBeenCalledWith({
          baseURL: 'http://sous-chef-proxy.local/api/recipe-scraper',
          timeout: 30000,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      });
    });

    it('should register request and response interceptors', () => {
      expect(recipeScraperClient.interceptors).toBeDefined();
    });
  });

  describe('Request Interceptor', () => {
    let mockConfig: InternalAxiosRequestConfig;

    beforeEach(() => {
      mockConfig = {
        headers: {},
        method: 'GET',
        url: '/test',
      } as InternalAxiosRequestConfig;

      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: jest.fn(),
        },
        writable: true,
      });
    });

    afterEach(() => {
      delete (global as any).window;
    });

    it('should add authorization header when token exists', () => {
      (localStorage.getItem as jest.Mock).mockReturnValue('test-token');

      const result = requestInterceptor(mockConfig);

      expect(localStorage.getItem).toHaveBeenCalledWith('authToken');
      expect(result.headers?.Authorization).toBe('Bearer test-token');
    });

    it('should not add authorization header when no token', () => {
      (localStorage.getItem as jest.Mock).mockReturnValue(null);

      const result = requestInterceptor(mockConfig);

      expect(result.headers?.Authorization).toBeUndefined();
    });

    it('should initialize headers object if not present', () => {
      (localStorage.getItem as jest.Mock).mockReturnValue('test-token');
      const configWithoutHeaders = {
        method: 'GET',
        url: '/test',
      } as InternalAxiosRequestConfig;

      const result = requestInterceptor(configWithoutHeaders);

      expect(result.headers).toBeDefined();
      expect(result.headers?.Authorization).toBe('Bearer test-token');
    });

    it('should handle SSR environment (no window)', () => {
      delete (global as any).window;

      const result = requestInterceptor(mockConfig);

      expect(result.headers?.Authorization).toBeUndefined();
    });

    it('should handle localStorage errors gracefully', () => {
      (localStorage.getItem as jest.Mock).mockImplementation(() => {
        throw new Error('localStorage error');
      });

      expect(() => requestInterceptor(mockConfig)).toThrow(
        'localStorage error'
      );
    });
  });

  describe('Request Error Handler', () => {
    it('should reject with the error', async () => {
      const error = new Error('Request failed');

      await expect(requestErrorHandler(error)).rejects.toBe(error);
    });
  });

  describe('Response Interceptor', () => {
    it('should return response unchanged', () => {
      const mockResponse = { data: { success: true }, status: 200 } as any;

      const result = responseInterceptor(mockResponse);

      expect(result).toBe(mockResponse);
    });
  });

  describe('Response Error Handler', () => {
    it('should handle errors with message field', () => {
      const error = {
        response: {
          status: 400,
          data: {
            message: 'Invalid URL format',
            error: 'INVALID_URL',
          } as ErrorResponse,
        },
        message: 'Bad Request',
      } as AxiosError;

      return expect(responseErrorHandler(error)).rejects.toEqual({
        ...error,
        message: 'Invalid URL format',
        status: 400,
      });
    });

    it('should fall back to axios error message', () => {
      const error = {
        response: {
          status: 500,
          data: {},
        },
        message: 'Internal Server Error',
      } as AxiosError;

      return expect(responseErrorHandler(error)).rejects.toEqual({
        ...error,
        message: 'Internal Server Error',
        status: 500,
      });
    });

    it('should use default message when no message is available', () => {
      const error = {
        response: {
          status: 500,
          data: {},
        },
      } as AxiosError;

      return expect(responseErrorHandler(error)).rejects.toEqual({
        ...error,
        message: 'An unexpected error occurred',
        status: 500,
      });
    });

    it('should handle network errors without response', () => {
      const error = {
        message: 'Network Error',
      } as AxiosError;

      return expect(responseErrorHandler(error)).rejects.toEqual({
        ...error,
        message: 'Network Error',
        status: undefined,
      });
    });
  });

  describe('Recipe Scraper API Client Utilities', () => {
    describe('RecipeScraperApiError', () => {
      it('should create error with all properties', () => {
        const error = new RecipeScraperApiError(
          'Test error',
          400,
          'INVALID_URL'
        );

        expect(error.name).toBe('RecipeScraperApiError');
        expect(error.message).toBe('Test error');
        expect(error.status).toBe(400);
        expect(error.error).toBe('INVALID_URL');
        expect(error).toBeInstanceOf(Error);
      });

      it('should create error with minimal properties', () => {
        const error = new RecipeScraperApiError('Simple error');

        expect(error.name).toBe('RecipeScraperApiError');
        expect(error.message).toBe('Simple error');
        expect(error.status).toBeUndefined();
        expect(error.error).toBeUndefined();
      });

      it('should create error with partial properties', () => {
        const error = new RecipeScraperApiError(
          'Partial error',
          403,
          'FORBIDDEN'
        );

        expect(error.message).toBe('Partial error');
        expect(error.status).toBe(403);
        expect(error.error).toBe('FORBIDDEN');
      });
    });

    describe('handleRecipeScraperApiError', () => {
      it('should handle AxiosError with ErrorResponse', () => {
        const axiosError = {
          response: {
            status: 400,
            data: {
              message: 'Invalid recipe URL',
              error: 'INVALID_RECIPE_URL',
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
          expect(scraperError.error).toBe('INVALID_RECIPE_URL');
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
              message: 'Recipe not found',
              error: 'RECIPE_NOT_FOUND',
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
          expect(scraperError.error).toBe('RECIPE_NOT_FOUND');
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
          error: 'VALIDATION_ERROR',
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
          expect(scraperError.error).toBe('VALIDATION_ERROR');
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

      it('should handle AxiosError instances with ErrorResponse', () => {
        const axiosError = new AxiosError('Bad Request');
        axiosError.response = {
          status: 400,
          data: {
            message: 'Recipe URL is invalid',
            error: 'INVALID_URL',
          } as ErrorResponse,
        } as any;

        expect(() => handleRecipeScraperApiError(axiosError)).toThrow(
          RecipeScraperApiError
        );

        try {
          handleRecipeScraperApiError(axiosError);
        } catch (error) {
          expect(error).toBeInstanceOf(RecipeScraperApiError);
          const scraperError = error as RecipeScraperApiError;
          expect(scraperError.message).toBe('Recipe URL is invalid');
          expect(scraperError.status).toBe(400);
          expect(scraperError.error).toBe('INVALID_URL');
        }
      });

      it('should handle AxiosError instances without ErrorResponse', () => {
        const axiosError = new AxiosError('Network Error');
        axiosError.message = 'Network Error';

        expect(() => handleRecipeScraperApiError(axiosError)).toThrow(
          'Network Error'
        );
      });

      it('should handle axios-like error with fallback to message', () => {
        const axiosLikeError = {
          response: {
            status: 500,
            data: {},
          },
          message: 'Service unavailable',
        };

        try {
          handleRecipeScraperApiError(axiosLikeError);
        } catch (error) {
          expect((error as RecipeScraperApiError).message).toBe(
            'Service unavailable'
          );
          expect((error as RecipeScraperApiError).status).toBe(500);
        }
      });

      it('should handle axios-like error with no message properties', () => {
        const axiosLikeError = {
          response: {
            status: 500,
            data: {},
          },
        };

        try {
          handleRecipeScraperApiError(axiosLikeError);
        } catch (error) {
          expect((error as RecipeScraperApiError).message).toBe(
            'An unexpected error occurred'
          );
          expect((error as RecipeScraperApiError).status).toBe(500);
        }
      });

      it('should handle standard Error instances', () => {
        const standardError = new Error('Custom error message');

        try {
          handleRecipeScraperApiError(standardError);
        } catch (error) {
          expect(error).toBeInstanceOf(RecipeScraperApiError);
          expect((error as RecipeScraperApiError).message).toBe(
            'Custom error message'
          );
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
});
