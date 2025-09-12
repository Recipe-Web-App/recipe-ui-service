/**
 * Unit tests for recipe media integration hooks
 */

import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useRecipeMedia,
  useIngredientMedia,
  useStepMedia,
  useAllRecipeMedia,
  useRecipeMediaManager,
} from '@/hooks/media-management/useRecipeMedia';
import { mediaApi } from '@/lib/api/media-management';
import { QUERY_KEYS } from '@/constants';

// Mock the media API
jest.mock('@/lib/api/media-management', () => ({
  mediaApi: {
    getMediaByRecipe: jest.fn(),
    getMediaByIngredient: jest.fn(),
    getMediaByStep: jest.fn(),
  },
}));

const mockedMediaApi = mediaApi as jest.Mocked<typeof mediaApi>;

// Test wrapper component
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useRecipeMedia', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch recipe media successfully', async () => {
    const mockMediaIds = [1, 2, 3];
    mockedMediaApi.getMediaByRecipe.mockResolvedValue(mockMediaIds);

    const { result } = renderHook(() => useRecipeMedia(123), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockedMediaApi.getMediaByRecipe).toHaveBeenCalledWith(123);
    expect(result.current.data).toEqual(mockMediaIds);
  });

  it('should have correct initial state', () => {
    const { result } = renderHook(() => useRecipeMedia(123), {
      wrapper: createWrapper(),
    });

    expect(result.current.data).toBeUndefined();
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('should respect enabled flag', () => {
    const { result } = renderHook(() => useRecipeMedia(123, false), {
      wrapper: createWrapper(),
    });

    expect(result.current.fetchStatus).toBe('idle');
    expect(mockedMediaApi.getMediaByRecipe).not.toHaveBeenCalled();
  });

  it('should handle errors', async () => {
    const mockError = new Error('Recipe media fetch failed');
    mockedMediaApi.getMediaByRecipe.mockRejectedValue(mockError);

    const { result } = renderHook(() => useRecipeMedia(123), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(mockError);
    expect(mockedMediaApi.getMediaByRecipe).toHaveBeenCalledWith(123);
  });
});

describe('useIngredientMedia', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch ingredient media successfully', async () => {
    const mockMediaIds = [4, 5];
    mockedMediaApi.getMediaByIngredient.mockResolvedValue(mockMediaIds);

    const { result } = renderHook(() => useIngredientMedia(123, 456), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockedMediaApi.getMediaByIngredient).toHaveBeenCalledWith(123, 456);
    expect(result.current.data).toEqual(mockMediaIds);
  });

  it('should have correct initial state', () => {
    const { result } = renderHook(() => useIngredientMedia(123, 456), {
      wrapper: createWrapper(),
    });

    expect(result.current.data).toBeUndefined();
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('should respect enabled flag', () => {
    const { result } = renderHook(() => useIngredientMedia(123, 456, false), {
      wrapper: createWrapper(),
    });

    expect(result.current.fetchStatus).toBe('idle');
    expect(mockedMediaApi.getMediaByIngredient).not.toHaveBeenCalled();
  });

  it('should handle errors', async () => {
    const mockError = new Error('Ingredient media fetch failed');
    mockedMediaApi.getMediaByIngredient.mockRejectedValue(mockError);

    const { result } = renderHook(() => useIngredientMedia(123, 456), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(mockError);
    expect(mockedMediaApi.getMediaByIngredient).toHaveBeenCalledWith(123, 456);
  });
});

describe('useStepMedia', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch step media successfully', async () => {
    const mockMediaIds = [6, 7, 8];
    mockedMediaApi.getMediaByStep.mockResolvedValue(mockMediaIds);

    const { result } = renderHook(() => useStepMedia(123, 789), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockedMediaApi.getMediaByStep).toHaveBeenCalledWith(123, 789);
    expect(result.current.data).toEqual(mockMediaIds);
  });

  it('should have correct initial state', () => {
    const { result } = renderHook(() => useStepMedia(123, 789), {
      wrapper: createWrapper(),
    });

    expect(result.current.data).toBeUndefined();
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('should respect enabled flag', () => {
    const { result } = renderHook(() => useStepMedia(123, 789, false), {
      wrapper: createWrapper(),
    });

    expect(result.current.fetchStatus).toBe('idle');
    expect(mockedMediaApi.getMediaByStep).not.toHaveBeenCalled();
  });

  it('should handle errors', async () => {
    const mockError = new Error('Step media fetch failed');
    mockedMediaApi.getMediaByStep.mockRejectedValue(mockError);

    const { result } = renderHook(() => useStepMedia(123, 789), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(mockError);
    expect(mockedMediaApi.getMediaByStep).toHaveBeenCalledWith(123, 789);
  });
});

describe('useAllRecipeMedia', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch all recipe media and provide recipeMedia alias', async () => {
    const mockMediaIds = [1, 2, 3];
    mockedMediaApi.getMediaByRecipe.mockResolvedValue(mockMediaIds);

    const { result } = renderHook(() => useAllRecipeMedia(123), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockedMediaApi.getMediaByRecipe).toHaveBeenCalledWith(123);
    expect(result.current.data).toEqual(mockMediaIds);
    expect(result.current.recipeMedia).toEqual(mockMediaIds);
  });

  it('should respect enabled flag', () => {
    const { result } = renderHook(() => useAllRecipeMedia(123, false), {
      wrapper: createWrapper(),
    });

    expect(result.current.fetchStatus).toBe('idle');
    expect(mockedMediaApi.getMediaByRecipe).not.toHaveBeenCalled();
  });
});

describe('useRecipeMediaManager', () => {
  it('should provide query key helpers', () => {
    const { result } = renderHook(() => useRecipeMediaManager());

    expect(result.current.getRecipeMediaQueryKey(123)).toEqual([
      ...QUERY_KEYS.MEDIA_MANAGEMENT.RECIPE_MEDIA,
      123,
    ]);

    expect(result.current.getIngredientMediaQueryKey(123, 456)).toEqual([
      ...QUERY_KEYS.MEDIA_MANAGEMENT.INGREDIENT_MEDIA,
      123,
      456,
    ]);

    expect(result.current.getStepMediaQueryKey(123, 789)).toEqual([
      ...QUERY_KEYS.MEDIA_MANAGEMENT.STEP_MEDIA,
      123,
      789,
    ]);
  });

  it('should provide media presence helper', () => {
    const { result } = renderHook(() => useRecipeMediaManager());

    expect(result.current.hasMedia([1, 2, 3])).toBe(true);
    expect(result.current.hasMedia([])).toBe(false);
    expect(result.current.hasMedia(undefined)).toBe(false);
    expect(result.current.hasMedia(null as any)).toBe(false);
  });
});
