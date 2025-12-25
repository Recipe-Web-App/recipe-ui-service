import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import {
  MediaManagementApiError,
  handleMediaManagementApiError,
  buildQueryParams,
  mediaManagementClient,
  requestInterceptor,
  requestErrorHandler,
  responseInterceptor,
  responseErrorHandler,
} from '@/lib/api/media-management/client';
import { ErrorResponse } from '@/types/media-management';

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

describe('Media Management API Client', () => {
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
        require('@/lib/api/media-management/client');
        expect(mockedAxios.create).toHaveBeenCalledWith({
          baseURL: 'http://sous-chef-proxy.local/api/v1/media-management',
          timeout: 30000,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      });
    });

    it('should register request and response interceptors', () => {
      expect(mediaManagementClient.interceptors).toBeDefined();
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
    const originalWindow = global.window;
    const originalLocalStorage = global.localStorage;
    let mockLocalStorage: any;

    beforeEach(() => {
      mockLocalStorage = {
        removeItem: jest.fn(),
      };

      const mockLocation = {
        href: 'http://localhost/',
        assign: jest.fn(),
      };

      // Mock Object.defineProperty for location.href setter
      Object.defineProperty(mockLocation, 'href', {
        writable: true,
        value: 'http://localhost/',
      });

      (global as any).window = {
        localStorage: mockLocalStorage,
        location: mockLocation,
      };

      (global as any).localStorage = mockLocalStorage;
    });

    afterEach(() => {
      global.window = originalWindow;
      global.localStorage = originalLocalStorage;
    });

    it('should pass through 401 errors (handled by token refresh interceptor)', async () => {
      const error = {
        response: {
          status: 401,
          data: { message: 'Unauthorized' },
        },
        message: 'Unauthorized',
      } as AxiosError;

      // 401 errors are now passed through - token refresh interceptor handles them
      await expect(responseErrorHandler(error)).rejects.toBe(error);
      // Auth clearing is NOT done in responseErrorHandler anymore
      expect(mockLocalStorage.removeItem).not.toHaveBeenCalled();
    });

    it('should pass through 401 errors in SSR environment', async () => {
      delete (global as any).window;

      const error = {
        response: {
          status: 401,
          data: { message: 'Unauthorized' },
        },
        message: 'Unauthorized',
      } as AxiosError;

      // 401 errors are passed through (token refresh interceptor handles them)
      await expect(responseErrorHandler(error)).rejects.toBe(error);
    });

    it('should handle non-401 errors without special processing', async () => {
      const error = {
        response: {
          status: 400,
          data: { message: 'Bad Request' },
        },
        message: 'Bad Request',
      } as AxiosError;

      await expect(responseErrorHandler(error)).rejects.toBe(error);
      expect(mockLocalStorage.removeItem).not.toHaveBeenCalled();
      // Location should not be modified for non-401 errors
    });

    it('should handle network errors without response', async () => {
      const error = {
        message: 'Network Error',
      } as AxiosError;

      await expect(responseErrorHandler(error)).rejects.toBe(error);
      expect(mockLocalStorage.removeItem).not.toHaveBeenCalled();
    });
  });

  describe('Media Management API Client Utilities', () => {
    describe('MediaManagementApiError', () => {
      it('should create error with all properties', () => {
        const details = { field: 'value', code: 'INVALID_INPUT' };
        const error = new MediaManagementApiError('Test error', 400, details);

        expect(error.name).toBe('MediaManagementApiError');
        expect(error.message).toBe('Test error');
        expect(error.status).toBe(400);
        expect(error.details).toEqual(details);
        expect(error).toBeInstanceOf(Error);
      });

      it('should create error with minimal properties', () => {
        const error = new MediaManagementApiError('Simple error');

        expect(error.name).toBe('MediaManagementApiError');
        expect(error.message).toBe('Simple error');
        expect(error.status).toBeUndefined();
        expect(error.details).toBeUndefined();
      });

      it('should create error with partial properties', () => {
        const error = new MediaManagementApiError('Partial error', 403);

        expect(error.message).toBe('Partial error');
        expect(error.status).toBe(403);
        expect(error.details).toBeUndefined();
      });
    });

    describe('handleMediaManagementApiError', () => {
      it('should handle AxiosError with ErrorResponse data', () => {
        const errorResponse: ErrorResponse = {
          error: 'Bad Request',
          message: 'File too large',
          details: { maxSize: 50000000, actualSize: 52428800 },
        };

        const axiosError = {
          response: {
            status: 400,
            data: errorResponse,
          },
          message: 'Request failed',
        };

        expect(() => handleMediaManagementApiError(axiosError)).toThrow(
          MediaManagementApiError
        );

        try {
          handleMediaManagementApiError(axiosError);
        } catch (error) {
          expect(error).toBeInstanceOf(MediaManagementApiError);
          expect((error as MediaManagementApiError).message).toBe(
            'File too large'
          );
          expect((error as MediaManagementApiError).status).toBe(400);
          expect((error as MediaManagementApiError).details).toEqual({
            maxSize: 50000000,
            actualSize: 52428800,
          });
        }
      });

      it('should handle AxiosError with message field', () => {
        const axiosError = {
          response: {
            status: 413,
            data: {
              message: 'Upload size exceeded',
            },
          },
        };

        try {
          handleMediaManagementApiError(axiosError);
        } catch (error) {
          expect((error as MediaManagementApiError).message).toBe(
            'Upload size exceeded'
          );
          expect((error as MediaManagementApiError).status).toBe(413);
        }
      });

      it('should handle AxiosError without proper ErrorResponse data', () => {
        const axiosError = {
          response: {
            status: 500,
            data: { someOtherField: 'value' },
          },
          message: 'Internal server error',
        };

        try {
          handleMediaManagementApiError(axiosError);
        } catch (error) {
          expect((error as MediaManagementApiError).message).toBe(
            'Internal server error'
          );
          expect((error as MediaManagementApiError).status).toBe(500);
          expect((error as MediaManagementApiError).details).toBeUndefined();
        }
      });

      it('should handle AxiosError without response', () => {
        const axiosError = {
          message: 'Network error',
        };

        try {
          handleMediaManagementApiError(axiosError);
        } catch (error) {
          expect((error as MediaManagementApiError).message).toBe(
            'Network error'
          );
          expect((error as MediaManagementApiError).status).toBeUndefined();
        }
      });

      it('should handle standard Error objects', () => {
        const standardError = new Error('Connection timeout');

        try {
          handleMediaManagementApiError(standardError);
        } catch (error) {
          expect(error).toBeInstanceOf(MediaManagementApiError);
          expect((error as MediaManagementApiError).message).toBe(
            'Connection timeout'
          );
          expect((error as MediaManagementApiError).status).toBeUndefined();
        }
      });

      it('should handle unknown error types', () => {
        try {
          handleMediaManagementApiError('string error');
        } catch (error) {
          expect(error).toBeInstanceOf(MediaManagementApiError);
          expect((error as MediaManagementApiError).message).toBe(
            'An unexpected error occurred'
          );
        }
      });

      it('should handle null and undefined errors', () => {
        try {
          handleMediaManagementApiError(null);
        } catch (error) {
          expect((error as MediaManagementApiError).message).toBe(
            'An unexpected error occurred'
          );
        }

        try {
          handleMediaManagementApiError(undefined);
        } catch (error) {
          expect((error as MediaManagementApiError).message).toBe(
            'An unexpected error occurred'
          );
        }
      });

      it('should handle axios-like error with fallback to default message', () => {
        const axiosLikeError = {
          response: {
            status: 500,
            data: {},
          },
        };

        try {
          handleMediaManagementApiError(axiosLikeError);
        } catch (error) {
          expect(error).toBeInstanceOf(MediaManagementApiError);
          expect((error as MediaManagementApiError).message).toBe(
            'An unexpected error occurred'
          );
          expect((error as MediaManagementApiError).status).toBe(500);
        }
      });

      it('should handle error objects with data containing message', () => {
        const errorWithData = {
          message: 'Original message',
          status: 422,
          data: {
            message: 'Data message',
          },
        };

        try {
          handleMediaManagementApiError(errorWithData);
        } catch (error) {
          expect(error).toBeInstanceOf(MediaManagementApiError);
          expect((error as MediaManagementApiError).message).toBe(
            'Data message'
          );
          expect((error as MediaManagementApiError).status).toBe(422);
        }
      });
    });

    describe('buildQueryParams', () => {
      it('should build query string from simple parameters', () => {
        const params = { page: 1, limit: 10, status: 'Complete' };
        const result = buildQueryParams(params);

        expect(result).toBe('?page=1&limit=10&status=Complete');
      });

      it('should handle array parameters', () => {
        const params = { sort: ['title', 'date'], status: 'Pending' };
        const result = buildQueryParams(params);

        expect(result).toBe('?sort=title&sort=date&status=Pending');
      });

      it('should skip undefined, null, and empty string values', () => {
        const params = {
          page: 1,
          limit: undefined,
          status: null,
          search: '',
          filter: 'active',
        };
        const result = buildQueryParams(params);

        expect(result).toBe('?page=1&filter=active');
      });

      it('should return empty string when no valid parameters', () => {
        const params = { limit: undefined, status: null, search: '' };
        const result = buildQueryParams(params);

        expect(result).toBe('');
      });

      it('should handle empty object', () => {
        const result = buildQueryParams({});

        expect(result).toBe('');
      });

      it('should properly encode special characters', () => {
        const params = { search: 'test query', filter: 'category/subcategory' };
        const result = buildQueryParams(params);

        expect(result).toBe('?search=test+query&filter=category%2Fsubcategory');
      });

      it('should handle boolean values correctly', () => {
        const params = {
          active: true,
          deleted: false,
          includeProcessing: true,
        };

        const result = buildQueryParams(params);
        expect(result).toBe(
          '?active=true&deleted=false&includeProcessing=true'
        );
      });

      it('should handle numeric values including zero', () => {
        const params = {
          cursor: 0,
          limit: 0,
          mediaId: 123,
          recipeId: 456,
        };

        const result = buildQueryParams(params);
        expect(result).toBe('?cursor=0&limit=0&mediaId=123&recipeId=456');
      });

      it('should handle empty arrays', () => {
        const params = {
          tags: [],
          limit: 10,
          active: true,
        };

        const result = buildQueryParams(params);
        expect(result).toBe('?limit=10&active=true');
      });

      it('should handle mixed data types', () => {
        const params = {
          string: 'text',
          number: 42,
          boolean: true,
          array: ['a', 'b'],
          zero: 0,
          empty: '',
        };

        const result = buildQueryParams(params);
        expect(result).toBe(
          '?string=text&number=42&boolean=true&array=a&array=b&zero=0'
        );
      });

      it('should handle cursor-based pagination parameters', () => {
        const params = {
          cursor: 'eyJpZCI6MTI0fQ==',
          limit: 50,
          status: 'Complete',
        };

        const result = buildQueryParams(params);
        expect(result).toBe(
          '?cursor=eyJpZCI6MTI0fQ%3D%3D&limit=50&status=Complete'
        );
      });
    });
  });
});
