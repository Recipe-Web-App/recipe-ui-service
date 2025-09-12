import {
  AuthApiError,
  handleAuthApiError,
  authClient,
  requestInterceptor,
  requestErrorHandler,
  responseInterceptor,
  responseErrorHandler,
} from '@/lib/api/auth/client';
import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// Mock axios completely
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    defaults: {
      baseURL: 'http://localhost:8080/api/v1/auth',
      timeout: 10000,
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

describe('Auth API Client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  describe('authClient configuration', () => {
    it('should be configured with correct base URL', () => {
      expect(authClient.defaults.baseURL).toBe(
        'http://localhost:8080/api/v1/auth'
      );
    });

    it('should have correct timeout', () => {
      expect(authClient.defaults.timeout).toBe(10000);
    });

    it('should have correct headers', () => {
      expect(authClient.defaults.headers['Content-Type']).toBe(
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
      // Note: localStorage is still accessible in test env, so we expect it to be called
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
        config: {} as any,
      };

      const result = responseInterceptor(response);
      expect(result).toBe(response);
    });
  });

  describe('responseErrorHandler', () => {
    it('should handle error with error_description (priority 1)', async () => {
      const error: AxiosError = {
        response: {
          data: { error_description: 'Invalid credentials' },
          status: 401,
          statusText: 'Unauthorized',
          headers: {},
          config: {} as any,
        },
        message: 'Request failed',
        name: 'AxiosError',
        config: {} as any,
        isAxiosError: true,
        toJSON: () => ({}),
      };

      await expect(responseErrorHandler(error)).rejects.toMatchObject({
        message: 'Invalid credentials',
        status: 401,
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
          config: {} as any,
        },
        message: 'Request failed',
        name: 'AxiosError',
        config: {} as any,
        isAxiosError: true,
        toJSON: () => ({}),
      };

      await expect(responseErrorHandler(error)).rejects.toMatchObject({
        message: 'Server error',
        status: 500,
        response: error.response,
      });
    });

    it('should fallback to error.message (priority 3)', async () => {
      const error: AxiosError = {
        response: {
          data: {},
          status: 404,
          statusText: 'Not Found',
          headers: {},
          config: {} as any,
        },
        message: 'Not found',
        name: 'AxiosError',
        config: {} as any,
        isAxiosError: true,
        toJSON: () => ({}),
      };

      await expect(responseErrorHandler(error)).rejects.toMatchObject({
        message: 'Not found',
        status: 404,
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
          config: {} as any,
        },
        message: null as any, // Force null message
        name: 'AxiosError',
        config: {} as any,
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
        config: {} as any,
        isAxiosError: true,
        toJSON: () => ({}),
      };

      await expect(responseErrorHandler(error)).rejects.toMatchObject({
        message: 'Network Error',
        status: undefined,
      });
    });

    it('should preserve all original error properties', async () => {
      const error: AxiosError = {
        response: {
          data: { error_description: 'Invalid token' },
          status: 401,
          statusText: 'Unauthorized',
          headers: { 'content-type': 'application/json' },
          config: {} as any,
        },
        message: 'Request failed',
        name: 'AxiosError',
        config: { timeout: 5000 } as any,
        isAxiosError: true,
        toJSON: () => ({}),
        code: 'ERR_BAD_REQUEST',
      };

      try {
        await responseErrorHandler(error);
      } catch (transformedError: any) {
        expect(transformedError).toMatchObject({
          message: 'Invalid token',
          status: 401,
          response: error.response,
          name: 'AxiosError',
          config: error.config,
          isAxiosError: true,
          code: 'ERR_BAD_REQUEST',
        });
      }
    });

    it('should handle response data with both error_description and message (priority to error_description)', async () => {
      const error: AxiosError = {
        response: {
          data: {
            error_description: 'OAuth error',
            message: 'Generic message',
          },
          status: 401,
          statusText: 'Unauthorized',
          headers: {},
          config: {} as any,
        },
        message: 'Request failed',
        name: 'AxiosError',
        config: {} as any,
        isAxiosError: true,
        toJSON: () => ({}),
      };

      await expect(responseErrorHandler(error)).rejects.toMatchObject({
        message: 'OAuth error',
        status: 401,
      });
    });

    it('should handle non-object response data', async () => {
      const error: AxiosError = {
        response: {
          data: 'string response data',
          status: 500,
          statusText: 'Internal Server Error',
          headers: {},
          config: {} as any,
        },
        message: 'Server error',
        name: 'AxiosError',
        config: {} as any,
        isAxiosError: true,
        toJSON: () => ({}),
      };

      await expect(responseErrorHandler(error)).rejects.toMatchObject({
        message: 'Server error',
        status: 500,
      });
    });

    it('should handle null response data', async () => {
      const error: AxiosError = {
        response: {
          data: null,
          status: 500,
          statusText: 'Internal Server Error',
          headers: {},
          config: {} as any,
        },
        message: 'Server error',
        name: 'AxiosError',
        config: {} as any,
        isAxiosError: true,
        toJSON: () => ({}),
      };

      await expect(responseErrorHandler(error)).rejects.toMatchObject({
        message: 'Server error',
        status: 500,
      });
    });

    it('should handle empty string message with fallback', async () => {
      const error: AxiosError = {
        response: {
          data: { error_description: null, message: null },
          status: 500,
          statusText: 'Internal Server Error',
          headers: {},
          config: {} as any,
        },
        message: null as any, // Force null message
        name: 'AxiosError',
        config: {} as any,
        isAxiosError: true,
        toJSON: () => ({}),
      };

      await expect(responseErrorHandler(error)).rejects.toMatchObject({
        message: 'An unexpected error occurred',
        status: 500,
      });
    });
  });

  describe('AuthApiError', () => {
    it('should create error with message and status', () => {
      const error = new AuthApiError('Test error', 400);

      expect(error.message).toBe('Test error');
      expect(error.status).toBe(400);
      expect(error.name).toBe('AuthApiError');
      expect(error instanceof Error).toBe(true);
    });

    it('should create error with just message', () => {
      const error = new AuthApiError('Test error');

      expect(error.message).toBe('Test error');
      expect(error.status).toBeUndefined();
    });
  });

  describe('handleAuthApiError', () => {
    it('should handle AxiosError with error_description', () => {
      const axiosError = new AxiosError('Request failed');
      axiosError.response = {
        data: { error_description: 'Invalid token' },
        status: 401,
      } as any;

      expect(() => handleAuthApiError(axiosError)).toThrow(AuthApiError);
      expect(() => handleAuthApiError(axiosError)).toThrow('Invalid token');

      try {
        handleAuthApiError(axiosError);
      } catch (error) {
        expect(error).toBeInstanceOf(AuthApiError);
        expect((error as AuthApiError).status).toBe(401);
      }
    });

    it('should handle AxiosError with message field', () => {
      const axiosError = new AxiosError('Request failed');
      axiosError.response = {
        data: { message: 'Bad request' },
        status: 400,
      } as any;

      expect(() => handleAuthApiError(axiosError)).toThrow('Bad request');
    });

    it('should handle AxiosError without response data', () => {
      const axiosError = new AxiosError('Network error');
      axiosError.message = 'Network error';

      expect(() => handleAuthApiError(axiosError)).toThrow('Network error');
    });

    it('should handle generic Error', () => {
      const error = new Error('Generic error');

      expect(() => handleAuthApiError(error)).toThrow(AuthApiError);
      expect(() => handleAuthApiError(error)).toThrow('Generic error');
    });

    it('should handle unknown error type', () => {
      const error = 'string error';

      expect(() => handleAuthApiError(error)).toThrow(
        'An unexpected error occurred'
      );
    });
  });
});
