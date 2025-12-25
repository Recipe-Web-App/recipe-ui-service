import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import {
  NotificationApiError,
  handleNotificationApiError,
  buildQueryParams,
  notificationClient,
  requestInterceptor,
  requestErrorHandler,
  responseInterceptor,
  responseErrorHandler,
} from '@/lib/api/notification/client';

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

describe('Notification API Client', () => {
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
        require('@/lib/api/notification/client');
        expect(mockedAxios.create).toHaveBeenCalledWith({
          baseURL: 'http://sous-chef-proxy.local/api/v1/notification',
          timeout: 15000,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      });
    });

    it('should register request and response interceptors', () => {
      expect(notificationClient.interceptors).toBeDefined();
    });
  });

  describe('Request Interceptor', () => {
    let mockConfig: InternalAxiosRequestConfig;

    beforeEach(() => {
      mockConfig = {
        headers: {},
        method: 'POST',
        url: '/notifications/share-recipe',
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
        method: 'POST',
        url: '/notifications/share-recipe',
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
      const mockResponse = {
        data: { queued_count: 2, message: 'Success' },
        status: 202,
      } as any;

      const result = responseInterceptor(mockResponse);

      expect(result).toBe(mockResponse);
    });
  });

  describe('Response Error Handler', () => {
    it('should handle errors with error field', () => {
      const error = {
        response: {
          status: 400,
          data: {
            error: 'bad_request',
          },
        },
        message: 'Bad Request',
      } as AxiosError;

      return expect(responseErrorHandler(error)).rejects.toEqual({
        ...error,
        message: 'bad_request',
        status: 400,
      });
    });

    it('should handle errors with message field', () => {
      const error = {
        response: {
          status: 403,
          data: {
            message: 'You do not have permission to perform this action',
          },
        },
        message: 'Forbidden',
      } as AxiosError;

      return expect(responseErrorHandler(error)).rejects.toEqual({
        ...error,
        message: 'You do not have permission to perform this action',
        status: 403,
      });
    });

    it('should handle errors with detail field', () => {
      const error = {
        response: {
          status: 404,
          data: {
            detail: 'Notification not found',
          },
        },
        message: 'Not Found',
      } as AxiosError;

      return expect(responseErrorHandler(error)).rejects.toEqual({
        ...error,
        message: 'Notification not found',
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

    it('should handle rate limit errors', () => {
      const error = {
        response: {
          status: 429,
          data: {
            error: 'rate_limit_exceeded',
            message: 'Rate limit exceeded. Please try again later.',
            detail: 'Limit: 100 requests per minute',
          },
        },
        message: 'Too Many Requests',
      } as AxiosError;

      return expect(responseErrorHandler(error)).rejects.toEqual({
        ...error,
        message: 'rate_limit_exceeded',
        status: 429,
      });
    });
  });

  describe('Notification API Client Utilities', () => {
    describe('NotificationApiError', () => {
      it('should create error with all properties', () => {
        const details = { recipient_id: 'abc123', template: 'share_recipe' };
        const error = new NotificationApiError('Test error', 400, details);

        expect(error.name).toBe('NotificationApiError');
        expect(error.message).toBe('Test error');
        expect(error.status).toBe(400);
        expect(error.details).toEqual(details);
        expect(error).toBeInstanceOf(Error);
      });

      it('should create error with minimal properties', () => {
        const error = new NotificationApiError('Simple error');

        expect(error.name).toBe('NotificationApiError');
        expect(error.message).toBe('Simple error');
        expect(error.status).toBeUndefined();
        expect(error.details).toBeUndefined();
      });

      it('should create error with partial properties', () => {
        const error = new NotificationApiError('Forbidden', 403);

        expect(error.message).toBe('Forbidden');
        expect(error.status).toBe(403);
        expect(error.details).toBeUndefined();
      });
    });

    describe('handleNotificationApiError', () => {
      it('should handle AxiosError with error field', () => {
        const axiosError = new AxiosError('Bad Request');
        axiosError.response = {
          status: 400,
          data: {
            error: 'Invalid request parameters',
            details: { field: 'recipient_ids' },
          },
        } as any;

        expect(() => handleNotificationApiError(axiosError)).toThrow(
          NotificationApiError
        );

        try {
          handleNotificationApiError(axiosError);
        } catch (error) {
          expect(error).toBeInstanceOf(NotificationApiError);
          expect((error as NotificationApiError).message).toBe(
            'Invalid request parameters'
          );
          expect((error as NotificationApiError).status).toBe(400);
          expect((error as NotificationApiError).details).toEqual({
            field: 'recipient_ids',
          });
        }
      });

      it('should handle AxiosError with message field', () => {
        const axiosError = new AxiosError('Forbidden');
        axiosError.response = {
          status: 403,
          data: {
            message: 'Requires notification:admin scope',
          },
        } as any;

        try {
          handleNotificationApiError(axiosError);
        } catch (error) {
          expect((error as NotificationApiError).message).toBe(
            'Requires notification:admin scope'
          );
          expect((error as NotificationApiError).status).toBe(403);
        }
      });

      it('should handle AxiosError with detail field', () => {
        const axiosError = new AxiosError('Not Found');
        axiosError.response = {
          status: 404,
          data: {
            detail: 'Notification not found',
          },
        } as any;

        try {
          handleNotificationApiError(axiosError);
        } catch (error) {
          expect((error as NotificationApiError).message).toBe(
            'Notification not found'
          );
          expect((error as NotificationApiError).status).toBe(404);
        }
      });

      it('should handle AxiosError without response data', () => {
        const axiosError = new AxiosError('Network error');
        axiosError.message = 'Network error';

        expect(() => handleNotificationApiError(axiosError)).toThrow(
          'Network error'
        );
      });

      it('should handle axios-like error with error field', () => {
        const axiosError = {
          response: {
            status: 400,
            data: {
              error: 'Invalid recipient count',
              details: { max: 100 },
            },
          },
        };

        expect(() => handleNotificationApiError(axiosError)).toThrow(
          NotificationApiError
        );

        try {
          handleNotificationApiError(axiosError);
        } catch (error) {
          expect(error).toBeInstanceOf(NotificationApiError);
          expect((error as NotificationApiError).message).toBe(
            'Invalid recipient count'
          );
          expect((error as NotificationApiError).status).toBe(400);
          expect((error as NotificationApiError).details).toEqual({ max: 100 });
        }
      });

      it('should handle axios-like error objects', () => {
        const axiosLikeError = {
          response: {
            status: 429,
            data: {
              error: 'rate_limit_exceeded',
              details: { limit: 100, window: '1 minute' },
            },
          },
        };

        try {
          handleNotificationApiError(axiosLikeError);
        } catch (error) {
          expect((error as NotificationApiError).message).toBe(
            'rate_limit_exceeded'
          );
          expect((error as NotificationApiError).status).toBe(429);
          expect((error as NotificationApiError).details).toEqual({
            limit: 100,
            window: '1 minute',
          });
        }
      });

      it('should handle custom error objects', () => {
        const customError = {
          message: 'Custom notification error',
          status: 500,
          details: { code: 'notification_failed' },
        };

        try {
          handleNotificationApiError(customError);
        } catch (error) {
          expect((error as NotificationApiError).message).toBe(
            'Custom notification error'
          );
          expect((error as NotificationApiError).status).toBe(500);
          expect((error as NotificationApiError).details).toEqual({
            code: 'notification_failed',
          });
        }
      });

      it('should handle standard Error objects', () => {
        const standardError = new Error('SMTP connection failed');

        try {
          handleNotificationApiError(standardError);
        } catch (error) {
          expect(error).toBeInstanceOf(NotificationApiError);
          expect((error as NotificationApiError).message).toBe(
            'SMTP connection failed'
          );
        }
      });

      it('should handle unknown error types', () => {
        try {
          handleNotificationApiError('string error');
        } catch (error) {
          expect(error).toBeInstanceOf(NotificationApiError);
          expect((error as NotificationApiError).message).toBe(
            'An unexpected error occurred'
          );
        }
      });

      it('should handle null and undefined errors', () => {
        try {
          handleNotificationApiError(null);
        } catch (error) {
          expect((error as NotificationApiError).message).toBe(
            'An unexpected error occurred'
          );
        }

        try {
          handleNotificationApiError(undefined);
        } catch (error) {
          expect((error as NotificationApiError).message).toBe(
            'An unexpected error occurred'
          );
        }
      });

      it('should fallback to axiosLikeError.message when response.data is empty', () => {
        const axiosError = {
          response: {
            status: 500,
            data: {},
          },
          message: 'Request failed with status code 500',
        };

        try {
          handleNotificationApiError(axiosError);
        } catch (error) {
          expect((error as NotificationApiError).message).toBe(
            'Request failed with status code 500'
          );
          expect((error as NotificationApiError).status).toBe(500);
        }
      });

      it('should fallback to default message when no error info is available', () => {
        const axiosError = {
          response: {
            status: 500,
            data: {},
          },
        };

        try {
          handleNotificationApiError(axiosError);
        } catch (error) {
          expect((error as NotificationApiError).message).toBe(
            'An unexpected error occurred'
          );
          expect((error as NotificationApiError).status).toBe(500);
        }
      });

      it('should handle Error instance through instanceof check', () => {
        // Create an Error-like object that is an instance of Error
        // but doesn't have 'message' as an own property
        const errorInstance = Object.create(Error.prototype);
        errorInstance.name = 'CustomError';
        // Set message on prototype, not as own property
        Object.defineProperty(errorInstance, 'message', {
          value: 'Custom error message',
          enumerable: false,
          writable: true,
          configurable: true,
        });

        try {
          handleNotificationApiError(errorInstance);
        } catch (error) {
          expect(error).toBeInstanceOf(NotificationApiError);
          // Should use the message from the Error instance
          expect((error as NotificationApiError).message).toBeDefined();
        }
      });
    });

    describe('buildQueryParams', () => {
      it('should build query string from simple object', () => {
        const params = {
          include_message: false,
          page: 1,
          page_size: 20,
        };

        const queryString = buildQueryParams(params);
        expect(queryString).toBe('include_message=false&page=1&page_size=20');
      });

      it('should handle boolean parameters correctly', () => {
        const params = {
          include_message: true,
          count_only: false,
        };

        const queryString = buildQueryParams(params);
        expect(queryString).toBe('include_message=true&count_only=false');
      });

      it('should skip undefined and null values', () => {
        const params = {
          include_message: true,
          page: undefined,
          status: null,
          page_size: 10,
        };

        const queryString = buildQueryParams(params);
        expect(queryString).toBe('include_message=true&page_size=10');
      });

      it('should handle array parameters correctly', () => {
        const params = {
          status: ['sent', 'failed', 'queued'],
          notification_type: ['email'],
        };

        const queryString = buildQueryParams(params);
        expect(queryString).toBe(
          'status=sent&status=failed&status=queued&notification_type=email'
        );
      });

      it('should handle numeric values including zero', () => {
        const params = {
          page: 0,
          page_size: 0,
          limit: 100,
        };

        const queryString = buildQueryParams(params);
        expect(queryString).toBe('page=0&page_size=0&limit=100');
      });

      it('should handle empty arrays', () => {
        const params = {
          status: [],
          page_size: 20,
        };

        const queryString = buildQueryParams(params);
        expect(queryString).toBe('page_size=20');
      });

      it('should handle empty object', () => {
        const queryString = buildQueryParams({});
        expect(queryString).toBe('');
      });

      it('should properly encode special characters', () => {
        const params = {
          recipient_email: 'user@example.com',
          subject: 'Recipe shared: Chicken & Rice',
        };

        const queryString = buildQueryParams(params);
        expect(queryString).toBe(
          'recipient_email=user%40example.com&subject=Recipe+shared%3A+Chicken+%26+Rice'
        );
      });

      it('should handle mixed data types', () => {
        const params = {
          include_message: true,
          page: 1,
          status: ['sent', 'failed'],
          notification_type: 'email',
        };

        const queryString = buildQueryParams(params);
        expect(queryString).toBe(
          'include_message=true&page=1&status=sent&status=failed&notification_type=email'
        );
      });
    });
  });
});
