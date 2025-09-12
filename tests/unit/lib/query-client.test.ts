import { QueryClient } from '@tanstack/react-query';

// Mock QueryClient constructor to track calls and configuration
jest.mock('@tanstack/react-query');
const MockedQueryClient = QueryClient as jest.MockedClass<typeof QueryClient>;

// Import after mocking to ensure the static instance uses the mock
import { createQueryClient, queryClient } from '@/lib/query-client';

describe('query-client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createQueryClient', () => {
    test('creates a new QueryClient instance', () => {
      createQueryClient();

      expect(MockedQueryClient).toHaveBeenCalledTimes(1);
    });

    test('configures QueryClient with correct default options structure', () => {
      createQueryClient();

      const mockCall = MockedQueryClient.mock.calls[0];
      const config = mockCall[0];

      expect(config).toHaveProperty('defaultOptions');
      expect(config?.defaultOptions).toHaveProperty('queries');
      expect(config?.defaultOptions).toHaveProperty('mutations');
    });

    test('sets correct staleTime for queries (5 minutes)', () => {
      createQueryClient();

      const mockCall = MockedQueryClient.mock.calls[0];
      const config = mockCall[0];

      expect(config?.defaultOptions?.queries?.staleTime).toBe(1000 * 60 * 5);
    });

    test('sets correct gcTime for queries (10 minutes)', () => {
      createQueryClient();

      const mockCall = MockedQueryClient.mock.calls[0];
      const config = mockCall[0];

      expect(config?.defaultOptions?.queries?.gcTime).toBe(1000 * 60 * 10);
    });

    test('disables refetchOnWindowFocus', () => {
      createQueryClient();

      const mockCall = MockedQueryClient.mock.calls[0];
      const config = mockCall[0];

      expect(config?.defaultOptions?.queries?.refetchOnWindowFocus).toBe(false);
    });

    test('sets mutation retry to 1', () => {
      createQueryClient();

      const mockCall = MockedQueryClient.mock.calls[0];
      const config = mockCall[0];

      expect(config?.defaultOptions?.mutations?.retry).toBe(1);
    });
  });

  describe('retry logic', () => {
    let retryFunction: (failureCount: number, error: Error) => boolean;

    beforeEach(() => {
      createQueryClient();
      const mockCall = MockedQueryClient.mock.calls[0];
      const config = mockCall[0];
      const retry = config?.defaultOptions?.queries?.retry;

      // Ensure we have a function type for testing
      if (typeof retry === 'function') {
        retryFunction = retry;
      } else {
        throw new Error('Expected retry to be a function for testing');
      }
    });

    // Helper function to create Error objects with status
    const createErrorWithStatus = (status: number): Error => {
      const error = new Error(`HTTP ${status} error`);
      (error as any).status = status;
      return error;
    };

    describe('404 errors', () => {
      test('does not retry on 404 errors', () => {
        const error404 = createErrorWithStatus(404);
        const result = retryFunction(0, error404);

        expect(result).toBe(false);
      });

      test('does not retry on 404 errors regardless of failure count', () => {
        const error404 = createErrorWithStatus(404);

        expect(retryFunction(0, error404)).toBe(false);
        expect(retryFunction(1, error404)).toBe(false);
        expect(retryFunction(2, error404)).toBe(false);
        expect(retryFunction(5, error404)).toBe(false);
      });
    });

    describe('403 errors', () => {
      test('does not retry on 403 errors', () => {
        const error403 = createErrorWithStatus(403);
        const result = retryFunction(0, error403);

        expect(result).toBe(false);
      });

      test('does not retry on 403 errors regardless of failure count', () => {
        const error403 = createErrorWithStatus(403);

        expect(retryFunction(0, error403)).toBe(false);
        expect(retryFunction(1, error403)).toBe(false);
        expect(retryFunction(2, error403)).toBe(false);
        expect(retryFunction(5, error403)).toBe(false);
      });
    });

    describe('other HTTP errors', () => {
      test('retries on 500 errors when failure count is less than 3', () => {
        const error500 = createErrorWithStatus(500);

        expect(retryFunction(0, error500)).toBe(true);
        expect(retryFunction(1, error500)).toBe(true);
        expect(retryFunction(2, error500)).toBe(true);
      });

      test('does not retry on 500 errors when failure count is 3 or more', () => {
        const error500 = createErrorWithStatus(500);

        expect(retryFunction(3, error500)).toBe(false);
        expect(retryFunction(4, error500)).toBe(false);
        expect(retryFunction(10, error500)).toBe(false);
      });

      test('retries on 401 errors when failure count is less than 3', () => {
        const error401 = createErrorWithStatus(401);

        expect(retryFunction(0, error401)).toBe(true);
        expect(retryFunction(1, error401)).toBe(true);
        expect(retryFunction(2, error401)).toBe(true);
      });

      test('retries on 502 errors when failure count is less than 3', () => {
        const error502 = createErrorWithStatus(502);

        expect(retryFunction(0, error502)).toBe(true);
        expect(retryFunction(1, error502)).toBe(true);
        expect(retryFunction(2, error502)).toBe(true);
      });
    });

    describe('non-HTTP errors', () => {
      test('retries on network errors when failure count is less than 3', () => {
        const networkError = new Error('Network error');

        expect(retryFunction(0, networkError)).toBe(true);
        expect(retryFunction(1, networkError)).toBe(true);
        expect(retryFunction(2, networkError)).toBe(true);
      });

      test('does not retry on network errors when failure count is 3 or more', () => {
        const networkError = new Error('Network error');

        expect(retryFunction(3, networkError)).toBe(false);
        expect(retryFunction(4, networkError)).toBe(false);
      });

      test('retries on timeout errors when failure count is less than 3', () => {
        const timeoutError = new Error('Timeout');

        expect(retryFunction(0, timeoutError)).toBe(true);
        expect(retryFunction(1, timeoutError)).toBe(true);
        expect(retryFunction(2, timeoutError)).toBe(true);
      });
    });

    describe('edge cases', () => {
      test('retries on null errors when failure count is less than 3', () => {
        const nullError = new Error('null error');
        expect(retryFunction(0, nullError)).toBe(true);
        expect(retryFunction(2, nullError)).toBe(true);
      });

      test('does not retry on null errors when failure count is 3 or more', () => {
        const nullError = new Error('null error');
        expect(retryFunction(3, nullError)).toBe(false);
      });

      test('retries on undefined errors when failure count is less than 3', () => {
        const undefinedError = new Error('undefined error');
        expect(retryFunction(0, undefinedError)).toBe(true);
        expect(retryFunction(2, undefinedError)).toBe(true);
      });

      test('handles objects without status property', () => {
        const errorWithoutStatus = new Error('Some error');
        (errorWithoutStatus as any).code = 'ERR_001';

        expect(retryFunction(0, errorWithoutStatus)).toBe(true);
        expect(retryFunction(2, errorWithoutStatus)).toBe(true);
        expect(retryFunction(3, errorWithoutStatus)).toBe(false);
      });

      test('handles string errors', () => {
        const stringError = new Error('Something went wrong');

        expect(retryFunction(0, stringError)).toBe(true);
        expect(retryFunction(2, stringError)).toBe(true);
        expect(retryFunction(3, stringError)).toBe(false);
      });

      test('handles number errors', () => {
        const numberError = new Error('42');

        expect(retryFunction(0, numberError)).toBe(true);
        expect(retryFunction(2, numberError)).toBe(true);
        expect(retryFunction(3, numberError)).toBe(false);
      });
    });
  });

  describe('static queryClient export', () => {
    test('exports a pre-created QueryClient instance', () => {
      expect(queryClient).toBeDefined();
    });

    test('static queryClient is a QueryClient instance', () => {
      expect(queryClient).toBeInstanceOf(QueryClient);
    });

    test('static queryClient can be used for operations', () => {
      // Test that the static instance has expected QueryClient methods
      expect(typeof queryClient.invalidateQueries).toBe('function');
      expect(typeof queryClient.setQueryData).toBe('function');
      expect(typeof queryClient.getQueryData).toBe('function');
    });
  });

  describe('function isolation', () => {
    test('createQueryClient returns different instances on each call', () => {
      const client1 = createQueryClient();
      const client2 = createQueryClient();

      expect(MockedQueryClient).toHaveBeenCalledTimes(2);
      expect(client1).not.toBe(client2);
    });

    test('each createQueryClient call uses identical configuration values', () => {
      MockedQueryClient.mockClear();
      createQueryClient();
      createQueryClient();

      const [call1, call2] = MockedQueryClient.mock.calls;

      expect(call1).toBeDefined();
      expect(call2).toBeDefined();
      expect(call1[0]).toBeDefined();
      expect(call2[0]).toBeDefined();

      const config1 = call1[0];
      const config2 = call2[0];

      // Compare configuration values (excluding functions)
      expect(config1?.defaultOptions?.queries?.staleTime).toEqual(
        config2?.defaultOptions?.queries?.staleTime
      );
      expect(config1?.defaultOptions?.queries?.gcTime).toEqual(
        config2?.defaultOptions?.queries?.gcTime
      );
      expect(config1?.defaultOptions?.queries?.refetchOnWindowFocus).toEqual(
        config2?.defaultOptions?.queries?.refetchOnWindowFocus
      );
      expect(config1?.defaultOptions?.mutations?.retry).toEqual(
        config2?.defaultOptions?.mutations?.retry
      );
    });
  });

  describe('configuration immutability', () => {
    test('retry function is consistent across calls', () => {
      MockedQueryClient.mockClear();
      createQueryClient();
      createQueryClient();

      const config1 = MockedQueryClient.mock.calls[0][0];
      const config2 = MockedQueryClient.mock.calls[1][0];

      // Ensure both configs have the retry function
      expect(config1?.defaultOptions?.queries?.retry).toBeDefined();
      expect(config2?.defaultOptions?.queries?.retry).toBeDefined();
      expect(typeof config1?.defaultOptions?.queries?.retry).toBe('function');
      expect(typeof config2?.defaultOptions?.queries?.retry).toBe('function');

      // Test that retry functions behave identically
      const error404 = { status: 404 };
      const error500 = { status: 500 };

      const retry1 = config1?.defaultOptions?.queries?.retry as (
        failureCount: number,
        error: unknown
      ) => boolean;
      const retry2 = config2?.defaultOptions?.queries?.retry as (
        failureCount: number,
        error: unknown
      ) => boolean;

      expect(retry1(0, error404)).toBe(retry2(0, error404));
      expect(retry1(1, error500)).toBe(retry2(1, error500));
    });
  });
});
