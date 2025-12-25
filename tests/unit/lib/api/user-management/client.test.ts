import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import {
  UserManagementApiError,
  handleUserManagementApiError,
  createFormData,
  buildQueryParams,
  userManagementClient,
  requestInterceptor,
  requestErrorHandler,
  responseInterceptor,
  responseErrorHandler,
  getRequiredScopes,
} from '@/lib/api/user-management/client';

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

describe('User Management API Client', () => {
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
      // Re-import the module to trigger the client creation
      jest.isolateModules(() => {
        require('@/lib/api/user-management/client');
        expect(mockedAxios.create).toHaveBeenCalledWith({
          baseURL: 'http://sous-chef-proxy.local/api/v1/user-management',
          timeout: 15000,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      });
    });

    it('should register request and response interceptors', () => {
      expect(userManagementClient.interceptors).toBeDefined();
    });
  });

  describe('getRequiredScopes', () => {
    it('should return correct scopes for user profile endpoints', () => {
      expect(getRequiredScopes('GET', '/users/123/profile')).toEqual([
        'user:read',
      ]);
      expect(getRequiredScopes('GET', '/users/abc-def/profile')).toEqual([
        'user:read',
      ]);
      expect(getRequiredScopes('PUT', '/users/profile')).toEqual([
        'user:write',
      ]);
    });

    it('should return correct scopes for user search', () => {
      expect(getRequiredScopes('GET', '/users/search')).toEqual(['user:read']);
    });

    it('should return correct scopes for user endpoints with numeric IDs', () => {
      expect(getRequiredScopes('GET', '/users/123')).toEqual(['user:read']);
      expect(getRequiredScopes('GET', '/users/456')).toEqual(['user:read']);
    });

    it('should return correct scopes for user endpoints with UUID IDs', () => {
      expect(
        getRequiredScopes('GET', '/users/550e8400-e29b-41d4-a716-446655440000')
      ).toEqual(['user:read']);
    });

    it('should return correct scopes for following/followers endpoints', () => {
      expect(getRequiredScopes('GET', '/123/following')).toEqual(['user:read']);
      expect(getRequiredScopes('GET', '/123/followers')).toEqual(['user:read']);
      expect(getRequiredScopes('PUT', '/123/follow/456')).toEqual([
        'user:write',
      ]);
    });

    it('should return correct scopes for activity endpoints', () => {
      expect(getRequiredScopes('GET', '/users/123/activity')).toEqual([
        'user:read',
      ]);
    });

    it('should return correct scopes for notification endpoints', () => {
      expect(getRequiredScopes('GET', '/notifications')).toEqual(['user:read']);
      expect(getRequiredScopes('GET', '/notifications/preferences')).toEqual([
        'user:read',
      ]);
      expect(getRequiredScopes('PUT', '/notifications/123/read')).toEqual([
        'user:write',
      ]);
      expect(getRequiredScopes('PUT', '/notifications/read-all')).toEqual([
        'user:write',
      ]);
      expect(getRequiredScopes('PUT', '/notifications/preferences')).toEqual([
        'user:write',
      ]);
    });

    it('should return correct scopes for account management endpoints', () => {
      expect(
        getRequiredScopes('POST', '/users/account/delete-request')
      ).toEqual(['user:write']);
      expect(getRequiredScopes('DELETE', '/users/account')).toEqual([
        'user:write',
      ]);
    });

    it('should return correct scopes for admin endpoints', () => {
      expect(getRequiredScopes('GET', '/admin/users')).toEqual(['admin']);
      expect(getRequiredScopes('DELETE', '/admin/users/123')).toEqual([
        'admin',
      ]);
    });

    it('should return correct scopes for metrics endpoints', () => {
      expect(getRequiredScopes('GET', '/metrics/usage')).toEqual(['admin']);
      expect(getRequiredScopes('POST', '/metrics/events')).toEqual(['admin']);
    });

    it('should return default scope for unknown endpoints', () => {
      expect(getRequiredScopes('GET', '/unknown/endpoint')).toEqual([
        'user:read',
      ]);
      expect(getRequiredScopes('POST', '/some/new/endpoint')).toEqual([
        'user:read',
      ]);
    });

    it('should handle case insensitive method matching', () => {
      expect(getRequiredScopes('get', '/users/123/profile')).toEqual([
        'user:read',
      ]);
      expect(getRequiredScopes('put', '/users/profile')).toEqual([
        'user:write',
      ]);
      expect(getRequiredScopes('post', '/metrics/events')).toEqual(['admin']);
    });

    it('should handle URLs with query parameters', () => {
      expect(getRequiredScopes('GET', '/users/search?q=test')).toEqual([
        'user:read',
      ]);
      expect(
        getRequiredScopes('GET', '/users/123/profile?include=stats')
      ).toEqual(['user:read']);
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

    it('should add required scopes header when method and url are present', () => {
      (localStorage.getItem as jest.Mock).mockReturnValue('test-token');
      mockConfig.method = 'GET';
      mockConfig.url = '/users/123/profile';

      const result = requestInterceptor(mockConfig);

      expect(result.headers?.['X-Required-Scopes']).toBe('user:read');
    });

    it('should not add scopes header when method or url is missing', () => {
      (localStorage.getItem as jest.Mock).mockReturnValue('test-token');
      const configWithoutMethod = {
        headers: {},
        url: '/test',
      } as InternalAxiosRequestConfig;

      const result = requestInterceptor(configWithoutMethod);

      expect(result.headers?.['X-Required-Scopes']).toBeUndefined();
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
    it('should handle 403 OAuth2 scope errors', () => {
      const error = {
        response: {
          status: 403,
          data: {
            error_code: 'insufficient_scope',
            required_scopes: ['admin', 'user:write'],
          },
        },
      } as AxiosError;

      return expect(responseErrorHandler(error)).rejects.toEqual({
        ...error,
        message: 'Insufficient OAuth2 scopes. Required: admin, user:write',
        status: 403,
        scopes: ['admin', 'user:write'],
        errorCode: 'insufficient_scope',
      });
    });

    it('should handle 403 errors without OAuth2 scope information', () => {
      const error = {
        response: {
          status: 403,
          data: {
            message: 'Access denied',
          },
        },
        message: 'Forbidden',
      } as AxiosError;

      return expect(responseErrorHandler(error)).rejects.toEqual({
        ...error,
        message: 'Access denied',
        status: 403,
      });
    });

    it('should handle errors with error_description', () => {
      const error = {
        response: {
          status: 400,
          data: {
            error_description: 'Invalid request format',
          },
        },
        message: 'Bad Request',
      } as AxiosError;

      return expect(responseErrorHandler(error)).rejects.toEqual({
        ...error,
        message: 'Invalid request format',
        status: 400,
      });
    });

    it('should handle errors with message field', () => {
      const error = {
        response: {
          status: 422,
          data: {
            message: 'Validation failed',
          },
        },
        message: 'Unprocessable Entity',
      } as AxiosError;

      return expect(responseErrorHandler(error)).rejects.toEqual({
        ...error,
        message: 'Validation failed',
        status: 422,
      });
    });

    it('should handle errors with detail field', () => {
      const error = {
        response: {
          status: 404,
          data: {
            detail: 'User not found',
          },
        },
        message: 'Not Found',
      } as AxiosError;

      return expect(responseErrorHandler(error)).rejects.toEqual({
        ...error,
        message: 'User not found',
        status: 404,
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

  describe('User Management API Client Utilities', () => {
    describe('UserManagementApiError', () => {
      it('should create error with all properties', () => {
        const error = new UserManagementApiError(
          'Test error',
          400,
          ['user:read', 'user:write'],
          'validation_failed'
        );

        expect(error.name).toBe('UserManagementApiError');
        expect(error.message).toBe('Test error');
        expect(error.status).toBe(400);
        expect(error.scopes).toEqual(['user:read', 'user:write']);
        expect(error.errorCode).toBe('validation_failed');
        expect(error).toBeInstanceOf(Error);
      });

      it('should create error with minimal properties', () => {
        const error = new UserManagementApiError('Simple error');

        expect(error.name).toBe('UserManagementApiError');
        expect(error.message).toBe('Simple error');
        expect(error.status).toBeUndefined();
        expect(error.scopes).toBeUndefined();
        expect(error.errorCode).toBeUndefined();
      });

      it('should create error with partial properties', () => {
        const error = new UserManagementApiError('Partial error', 403);

        expect(error.message).toBe('Partial error');
        expect(error.status).toBe(403);
        expect(error.scopes).toBeUndefined();
        expect(error.errorCode).toBeUndefined();
      });
    });

    describe('handleUserManagementApiError', () => {
      it('should handle AxiosError with OAuth2 scope information', () => {
        const axiosError = new AxiosError('Forbidden');
        axiosError.response = {
          status: 403,
          data: {
            error_description: 'Insufficient OAuth2 scopes',
            required_scopes: ['admin'],
            error_code: 'insufficient_scopes',
          },
        } as any;

        expect(() => handleUserManagementApiError(axiosError)).toThrow(
          UserManagementApiError
        );

        try {
          handleUserManagementApiError(axiosError);
        } catch (error) {
          expect(error).toBeInstanceOf(UserManagementApiError);
          expect((error as UserManagementApiError).message).toBe(
            'Insufficient OAuth2 scopes'
          );
          expect((error as UserManagementApiError).status).toBe(403);
          expect((error as UserManagementApiError).scopes).toEqual(['admin']);
          expect((error as UserManagementApiError).errorCode).toBe(
            'insufficient_scopes'
          );
        }
      });

      it('should handle AxiosError with error_description', () => {
        const axiosError = new AxiosError('Bad Request');
        axiosError.response = {
          status: 400,
          data: {
            error_description: 'Invalid request format',
          },
        } as any;

        expect(() => handleUserManagementApiError(axiosError)).toThrow(
          UserManagementApiError
        );

        try {
          handleUserManagementApiError(axiosError);
        } catch (error) {
          expect((error as UserManagementApiError).message).toBe(
            'Invalid request format'
          );
          expect((error as UserManagementApiError).status).toBe(400);
        }
      });

      it('should handle AxiosError with message field', () => {
        const axiosError = new AxiosError('Validation failed');
        axiosError.response = {
          status: 422,
          data: {
            message: 'Validation error',
          },
        } as any;

        try {
          handleUserManagementApiError(axiosError);
        } catch (error) {
          expect((error as UserManagementApiError).message).toBe(
            'Validation error'
          );
          expect((error as UserManagementApiError).status).toBe(422);
        }
      });

      it('should handle AxiosError with detail field', () => {
        const axiosError = new AxiosError('Not Found');
        axiosError.response = {
          status: 404,
          data: {
            detail: 'Resource not found',
          },
        } as any;

        try {
          handleUserManagementApiError(axiosError);
        } catch (error) {
          expect((error as UserManagementApiError).message).toBe(
            'Resource not found'
          );
          expect((error as UserManagementApiError).status).toBe(404);
        }
      });

      it('should handle AxiosError without response data', () => {
        const axiosError = new AxiosError('Network error');
        axiosError.message = 'Network error';

        expect(() => handleUserManagementApiError(axiosError)).toThrow(
          'Network error'
        );
      });

      it('should handle axios-like error objects with OAuth2 scope information', () => {
        const axiosLikeError = {
          response: {
            status: 403,
            data: {
              error_description: 'Insufficient OAuth2 scopes',
              required_scopes: ['admin'],
              error_code: 'insufficient_scopes',
            },
          },
        };

        expect(() => handleUserManagementApiError(axiosLikeError)).toThrow(
          UserManagementApiError
        );

        try {
          handleUserManagementApiError(axiosLikeError);
        } catch (error) {
          expect(error).toBeInstanceOf(UserManagementApiError);
          expect((error as UserManagementApiError).message).toBe(
            'Insufficient OAuth2 scopes'
          );
          expect((error as UserManagementApiError).status).toBe(403);
          expect((error as UserManagementApiError).scopes).toEqual(['admin']);
          expect((error as UserManagementApiError).errorCode).toBe(
            'insufficient_scopes'
          );
        }
      });

      it('should handle custom error objects with scope information', () => {
        const customError = {
          message: 'Custom scope error',
          status: 403,
          scopes: ['user:write'],
          errorCode: 'write_permission_required',
        };

        try {
          handleUserManagementApiError(customError);
        } catch (error) {
          expect((error as UserManagementApiError).message).toBe(
            'Custom scope error'
          );
          expect((error as UserManagementApiError).status).toBe(403);
          expect((error as UserManagementApiError).scopes).toEqual([
            'user:write',
          ]);
          expect((error as UserManagementApiError).errorCode).toBe(
            'write_permission_required'
          );
        }
      });

      it('should handle standard Error objects', () => {
        const standardError = new Error('Network timeout');

        try {
          handleUserManagementApiError(standardError);
        } catch (error) {
          expect(error).toBeInstanceOf(UserManagementApiError);
          expect((error as UserManagementApiError).message).toBe(
            'Network timeout'
          );
        }
      });

      it('should handle unknown error types', () => {
        try {
          handleUserManagementApiError('string error');
        } catch (error) {
          expect(error).toBeInstanceOf(UserManagementApiError);
          expect((error as UserManagementApiError).message).toBe(
            'An unexpected error occurred'
          );
        }
      });

      it('should handle axios-like error with fallback to message', () => {
        const axiosLikeError = {
          response: {
            status: 500,
            data: {},
          },
          message: 'Request timeout',
        };

        try {
          handleUserManagementApiError(axiosLikeError);
        } catch (error) {
          expect((error as UserManagementApiError).message).toBe(
            'Request timeout'
          );
          expect((error as UserManagementApiError).status).toBe(500);
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
          handleUserManagementApiError(axiosLikeError);
        } catch (error) {
          expect((error as UserManagementApiError).message).toBe(
            'An unexpected error occurred'
          );
          expect((error as UserManagementApiError).status).toBe(500);
        }
      });

      it('should handle null and undefined errors', () => {
        try {
          handleUserManagementApiError(null);
        } catch (error) {
          expect((error as UserManagementApiError).message).toBe(
            'An unexpected error occurred'
          );
        }

        try {
          handleUserManagementApiError(undefined);
        } catch (error) {
          expect((error as UserManagementApiError).message).toBe(
            'An unexpected error occurred'
          );
        }
      });
    });

    describe('createFormData', () => {
      it('should create FormData from object with mixed data types', () => {
        const testFile = new File(['content'], 'test.txt', {
          type: 'text/plain',
        });
        const data = {
          name: 'Test User',
          avatar: testFile,
          age: 25,
          active: true,
          score: 95.5,
        };

        const formData = createFormData(data);

        expect(formData).toBeInstanceOf(FormData);
        expect(formData.get('name')).toBe('Test User');
        expect(formData.get('avatar')).toBe(testFile);
        expect(formData.get('age')).toBe('25');
        expect(formData.get('active')).toBe('true');
        expect(formData.get('score')).toBe('95.5');
      });

      it('should handle File objects correctly', () => {
        const imageFile = new File(['binary'], 'avatar.jpg', {
          type: 'image/jpeg',
        });
        const data = {
          profilePicture: imageFile,
          name: 'User',
        };

        const formData = createFormData(data);

        expect(formData.get('profilePicture')).toBe(imageFile);
        expect(formData.get('name')).toBe('User');
      });

      it('should skip undefined and null values', () => {
        const data = {
          name: 'Valid Name',
          undefined_field: undefined,
          null_field: null,
          empty_string: '',
          zero_value: 0,
          false_value: false,
        };

        const formData = createFormData(data);

        expect(formData.get('name')).toBe('Valid Name');
        expect(formData.get('undefined_field')).toBeNull();
        expect(formData.get('null_field')).toBeNull();
        expect(formData.get('empty_string')).toBe('');
        expect(formData.get('zero_value')).toBe('0');
        expect(formData.get('false_value')).toBe('false');
      });

      it('should handle empty object', () => {
        const formData = createFormData({});

        expect(formData).toBeInstanceOf(FormData);
        expect(Array.from(formData.keys())).toHaveLength(0);
      });

      it('should handle arrays by converting to strings', () => {
        const data = {
          tags: ['javascript', 'typescript'],
          numbers: [1, 2, 3],
        };

        const formData = createFormData(data);

        expect(formData.get('tags')).toBe('javascript,typescript');
        expect(formData.get('numbers')).toBe('1,2,3');
      });
    });

    describe('buildQueryParams', () => {
      it('should build query string from simple object', () => {
        const params = {
          limit: 10,
          offset: 0,
          search: 'test query',
        };

        const queryString = buildQueryParams(params);
        expect(queryString).toBe('limit=10&offset=0&search=test+query');
      });

      it('should handle array parameters correctly', () => {
        const params = {
          tags: ['javascript', 'typescript', 'react'],
          categories: ['frontend', 'backend'],
          limit: 20,
        };

        const queryString = buildQueryParams(params);
        expect(queryString).toBe(
          'tags=javascript&tags=typescript&tags=react&categories=frontend&categories=backend&limit=20'
        );
      });

      it('should skip undefined and null values', () => {
        const params = {
          limit: 10,
          offset: undefined,
          search: null,
          active: true,
          page: 0,
        };

        const queryString = buildQueryParams(params);
        expect(queryString).toBe('limit=10&active=true&page=0');
      });

      it('should handle boolean values correctly', () => {
        const params = {
          active: true,
          deleted: false,
          archived: true,
        };

        const queryString = buildQueryParams(params);
        expect(queryString).toBe('active=true&deleted=false&archived=true');
      });

      it('should handle numeric values including zero', () => {
        const params = {
          page: 0,
          limit: 0,
          count: 100,
          rating: 4.5,
        };

        const queryString = buildQueryParams(params);
        expect(queryString).toBe('page=0&limit=0&count=100&rating=4.5');
      });

      it('should handle empty arrays', () => {
        const params = {
          tags: [],
          limit: 10,
          active: true,
        };

        const queryString = buildQueryParams(params);
        expect(queryString).toBe('limit=10&active=true');
      });

      it('should handle empty object', () => {
        const queryString = buildQueryParams({});
        expect(queryString).toBe('');
      });

      it('should properly encode special characters', () => {
        const params = {
          search: 'hello & world',
          email: 'test@example.com',
          name: 'user name',
        };

        const queryString = buildQueryParams(params);
        expect(queryString).toBe(
          'search=hello+%26+world&email=test%40example.com&name=user+name'
        );
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

        const queryString = buildQueryParams(params);
        expect(queryString).toBe(
          'string=text&number=42&boolean=true&array=a&array=b&zero=0&empty='
        );
      });
    });
  });
});
