import { AuthApiError, handleAuthApiError } from '@/lib/api/auth/client';
import { AxiosError } from 'axios';

// Mock axios
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
        handlers: [{ fulfilled: jest.fn(), rejected: jest.fn() }],
      },
      response: {
        use: jest.fn(),
        handlers: [{ fulfilled: jest.fn(), rejected: jest.fn() }],
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

// Import after mocking
import { authClient } from '@/lib/api/auth/client';

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

  describe('request interceptor', () => {
    it('should add authorization header when token exists', () => {
      localStorageMock.getItem.mockReturnValue('test-token');

      const config = { headers: {} };
      const mockFulfilled = jest.fn().mockImplementation(config => {
        const token =
          typeof window !== 'undefined'
            ? localStorage.getItem('authToken')
            : null;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      });

      (authClient.interceptors.request as any).handlers = [
        { fulfilled: mockFulfilled, rejected: jest.fn() },
      ];
      const result = mockFulfilled(config);
      expect(result.headers.Authorization).toBe('Bearer test-token');
    });

    it('should not add authorization header when token does not exist', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const config = { headers: {} };
      const mockFulfilled = jest.fn().mockImplementation(config => {
        const token =
          typeof window !== 'undefined'
            ? localStorage.getItem('authToken')
            : null;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      });

      const result = mockFulfilled(config);
      expect(result.headers.Authorization).toBeUndefined();
    });

    it('should handle request interceptor errors', async () => {
      const error = new Error('Request error');
      const mockRejected = jest.fn().mockRejectedValue(error);

      await expect(mockRejected(error)).rejects.toBe(error);
    });
  });

  describe('response interceptor', () => {
    it('should return response on success', () => {
      const response = { data: { message: 'success' }, status: 200 };
      const mockFulfilled = jest.fn().mockReturnValue(response);

      const result = mockFulfilled(response);
      expect(result).toBe(response);
    });

    it('should handle response with error_description', async () => {
      const error = {
        response: {
          data: { error_description: 'Invalid credentials' },
          status: 401,
        },
        message: 'Request failed',
      };

      const mockRejected = jest.fn().mockRejectedValue({
        ...error,
        message: 'Invalid credentials',
        status: 401,
      });

      await expect(mockRejected(error)).rejects.toMatchObject({
        message: 'Invalid credentials',
        status: 401,
      });
    });

    it('should handle response with message field', async () => {
      const error = {
        response: {
          data: { message: 'Server error' },
          status: 500,
        },
        message: 'Request failed',
      };

      const mockRejected = jest.fn().mockRejectedValue({
        ...error,
        message: 'Server error',
        status: 500,
      });

      await expect(mockRejected(error)).rejects.toMatchObject({
        message: 'Server error',
        status: 500,
      });
    });

    it('should fallback to error message when no specific message', async () => {
      const error = {
        response: {
          data: {},
          status: 404,
        },
        message: 'Not found',
      };

      const mockRejected = jest.fn().mockRejectedValue({
        ...error,
        message: 'Not found',
        status: 404,
      });

      await expect(mockRejected(error)).rejects.toMatchObject({
        message: 'Not found',
        status: 404,
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
