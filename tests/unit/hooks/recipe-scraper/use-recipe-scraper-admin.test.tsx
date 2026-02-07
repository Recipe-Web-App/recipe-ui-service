import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { adminApi } from '@/lib/api/recipe-scraper';
import { useClearRecipeScraperCache } from '@/hooks/recipe-scraper/use-recipe-scraper-admin';

// Mock the API module
jest.mock('@/lib/api/recipe-scraper', () => ({
  adminApi: {
    clearCache: jest.fn(),
  },
}));

const mockedAdminApi = adminApi as jest.Mocked<typeof adminApi>;

// Test wrapper with QueryClient
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useClearRecipeScraperCache', () => {
  it('should clear cache successfully', async () => {
    const mockResponse = {
      message: 'Cache cleared successfully',
    };

    mockedAdminApi.clearCache.mockResolvedValueOnce(mockResponse);

    const wrapper = createWrapper();
    const { result } = renderHook(() => useClearRecipeScraperCache(), {
      wrapper,
    });

    // Execute the mutation
    result.current.mutate();

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockResponse);
    expect(mockedAdminApi.clearCache).toHaveBeenCalledTimes(1);
    expect(mockedAdminApi.clearCache).toHaveBeenCalledWith();
  });

  it('should handle authorization errors', async () => {
    const error = new Error('Authentication required');
    mockedAdminApi.clearCache.mockRejectedValueOnce(error);

    const wrapper = createWrapper();
    const { result } = renderHook(() => useClearRecipeScraperCache(), {
      wrapper,
    });

    // Execute the mutation
    result.current.mutate();

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(error);
    expect(mockedAdminApi.clearCache).toHaveBeenCalledTimes(1);
  });

  it('should handle insufficient permissions error', async () => {
    const error = new Error('Insufficient permissions for this operation');
    mockedAdminApi.clearCache.mockRejectedValueOnce(error);

    const wrapper = createWrapper();
    const { result } = renderHook(() => useClearRecipeScraperCache(), {
      wrapper,
    });

    // Execute the mutation
    result.current.mutate();

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(error);
    expect(result.current.data).toBeUndefined();
  });

  it('should handle service unavailable error', async () => {
    const error = new Error('Service temporarily unavailable');
    mockedAdminApi.clearCache.mockRejectedValueOnce(error);

    const wrapper = createWrapper();
    const { result } = renderHook(() => useClearRecipeScraperCache(), {
      wrapper,
    });

    // Execute the mutation
    result.current.mutate();

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(error);
  });

  it('should reset state properly after error', async () => {
    const error = new Error('Cache clear failed');
    mockedAdminApi.clearCache.mockRejectedValueOnce(error);

    const wrapper = createWrapper();
    const { result } = renderHook(() => useClearRecipeScraperCache(), {
      wrapper,
    });

    // Execute the mutation that will fail
    result.current.mutate();

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(error);

    // Reset the mutation state
    result.current.reset();

    await waitFor(() => {
      expect(result.current.isIdle).toBe(true);
    });

    expect(result.current.error).toBeNull();
    expect(result.current.data).toBeUndefined();
  });

  it('should properly handle mutation loading state', async () => {
    // Create a promise that we can resolve manually
    let resolvePromise: (value: { message: string }) => void;
    const promise = new Promise<{ message: string }>(resolve => {
      resolvePromise = resolve;
    });

    mockedAdminApi.clearCache.mockReturnValueOnce(promise);

    const wrapper = createWrapper();
    const { result } = renderHook(() => useClearRecipeScraperCache(), {
      wrapper,
    });

    // Initial state should be idle
    expect(result.current.isIdle).toBe(true);

    // Execute the mutation
    result.current.mutate();

    // Wait for the pending state to be set
    await waitFor(() => {
      expect(result.current.isPending).toBe(true);
    });

    expect(result.current.isIdle).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isError).toBe(false);

    // Resolve the promise
    resolvePromise!({ message: 'Cache cleared successfully' });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.isPending).toBe(false);
    expect(result.current.data).toEqual({
      message: 'Cache cleared successfully',
    });
  });

  it('should handle partial cache clear success', async () => {
    const mockResponse = {
      message: 'Cache partially cleared - some entries failed',
    };

    mockedAdminApi.clearCache.mockResolvedValueOnce(mockResponse);

    const wrapper = createWrapper();
    const { result } = renderHook(() => useClearRecipeScraperCache(), {
      wrapper,
    });

    // Execute the mutation
    result.current.mutate();

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockResponse);
    expect(result.current.data?.message).toContain('partially cleared');
  });
});

// Clean up mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});
