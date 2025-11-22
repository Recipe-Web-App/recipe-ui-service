import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useShareRecipe } from '@/hooks/notification/useShareRecipe';
import { shareApi } from '@/lib/api/notification';
import type {
  ShareRecipeRequest,
  BatchNotificationResponse,
} from '@/types/notification';

// Mock the API
jest.mock('@/lib/api/notification', () => ({
  shareApi: {
    shareRecipe: jest.fn(),
  },
}));

const mockedShareApi = shareApi as jest.Mocked<typeof shareApi>;

// Create wrapper component
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: Infinity },
      mutations: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useShareRecipe hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should share recipe successfully', async () => {
    const shareRequest: ShareRecipeRequest = {
      recipient_ids: [
        '550e8400-e29b-41d4-a716-446655440001',
        '550e8400-e29b-41d4-a716-446655440002',
      ],
      recipe_id: 123,
      sharer_id: '550e8400-e29b-41d4-a716-446655440003',
      share_message: 'Check out this amazing recipe!',
    };

    const mockResponse: BatchNotificationResponse = {
      notifications: [
        {
          notification_id: '770e8400-e29b-41d4-a716-446655440111',
          recipient_id: '550e8400-e29b-41d4-a716-446655440001',
        },
        {
          notification_id: '770e8400-e29b-41d4-a716-446655440112',
          recipient_id: '550e8400-e29b-41d4-a716-446655440002',
        },
        {
          notification_id: '770e8400-e29b-41d4-a716-446655440113',
          recipient_id: '660e8400-e29b-41d4-a716-446655440099',
        },
      ],
      queued_count: 3,
      message: 'Notifications queued successfully',
    };

    mockedShareApi.shareRecipe.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useShareRecipe(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(shareRequest);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockedShareApi.shareRecipe).toHaveBeenCalledWith(shareRequest);
    expect(result.current.data).toEqual(mockResponse);
  });

  it('should share recipe without optional fields', async () => {
    const shareRequest: ShareRecipeRequest = {
      recipient_ids: ['550e8400-e29b-41d4-a716-446655440001'],
      recipe_id: 456,
    };

    const mockResponse: BatchNotificationResponse = {
      notifications: [
        {
          notification_id: '770e8400-e29b-41d4-a716-446655440114',
          recipient_id: '550e8400-e29b-41d4-a716-446655440001',
        },
        {
          notification_id: '770e8400-e29b-41d4-a716-446655440115',
          recipient_id: 'author-uuid',
        },
      ],
      queued_count: 2,
      message: 'Notifications queued successfully',
    };

    mockedShareApi.shareRecipe.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useShareRecipe(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(shareRequest);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockedShareApi.shareRecipe).toHaveBeenCalledWith(shareRequest);
    expect(result.current.data).toEqual(mockResponse);
  });

  it('should handle share recipe error', async () => {
    const shareRequest: ShareRecipeRequest = {
      recipient_ids: [],
      recipe_id: 123,
    };

    const error = new Error('Invalid request parameters');
    mockedShareApi.shareRecipe.mockRejectedValue(error);

    const { result } = renderHook(() => useShareRecipe(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(shareRequest);

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(mockedShareApi.shareRecipe).toHaveBeenCalledWith(shareRequest);
    expect(result.current.error).toEqual(error);
  });

  it('should handle 403 forbidden error', async () => {
    const shareRequest: ShareRecipeRequest = {
      recipient_ids: ['550e8400-e29b-41d4-a716-446655440001'],
      recipe_id: 123,
    };

    const error = new Error(
      'You do not have permission to perform this action'
    );
    mockedShareApi.shareRecipe.mockRejectedValue(error);

    const { result } = renderHook(() => useShareRecipe(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(shareRequest);

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toEqual(error);
  });

  it('should handle 404 recipe not found error', async () => {
    const shareRequest: ShareRecipeRequest = {
      recipient_ids: ['550e8400-e29b-41d4-a716-446655440001'],
      recipe_id: 99999,
    };

    const error = new Error('Recipe not found');
    mockedShareApi.shareRecipe.mockRejectedValue(error);

    const { result } = renderHook(() => useShareRecipe(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(shareRequest);

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toEqual(error);
  });

  it('should handle 429 rate limit error', async () => {
    const shareRequest: ShareRecipeRequest = {
      recipient_ids: ['550e8400-e29b-41d4-a716-446655440001'],
      recipe_id: 123,
    };

    const error = new Error('Rate limit exceeded. Please try again later.');
    mockedShareApi.shareRecipe.mockRejectedValue(error);

    const { result } = renderHook(() => useShareRecipe(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(shareRequest);

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toEqual(error);
  });

  it('should handle network error', async () => {
    const shareRequest: ShareRecipeRequest = {
      recipient_ids: ['550e8400-e29b-41d4-a716-446655440001'],
      recipe_id: 123,
    };

    const error = new Error('Network Error');
    mockedShareApi.shareRecipe.mockRejectedValue(error);

    const { result } = renderHook(() => useShareRecipe(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(shareRequest);

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toEqual(error);
  });

  it('should reset mutation state', async () => {
    const shareRequest: ShareRecipeRequest = {
      recipient_ids: ['550e8400-e29b-41d4-a716-446655440001'],
      recipe_id: 123,
    };

    const mockResponse: BatchNotificationResponse = {
      notifications: [
        {
          notification_id: '770e8400-e29b-41d4-a716-446655440116',
          recipient_id: '550e8400-e29b-41d4-a716-446655440001',
        },
      ],
      queued_count: 1,
      message: 'Notification queued successfully',
    };

    mockedShareApi.shareRecipe.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useShareRecipe(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(shareRequest);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    result.current.reset();

    await waitFor(() => {
      expect(result.current.isIdle).toBe(true);
      expect(result.current.data).toBeUndefined();
    });
  });

  it('should handle multiple recipients', async () => {
    const shareRequest: ShareRecipeRequest = {
      recipient_ids: [
        '550e8400-e29b-41d4-a716-446655440001',
        '550e8400-e29b-41d4-a716-446655440002',
        '550e8400-e29b-41d4-a716-446655440003',
        '550e8400-e29b-41d4-a716-446655440004',
        '550e8400-e29b-41d4-a716-446655440005',
      ],
      recipe_id: 789,
      sharer_id: '550e8400-e29b-41d4-a716-446655440010',
    };

    const mockResponse: BatchNotificationResponse = {
      notifications: Array.from({ length: 6 }, (_, i) => ({
        notification_id: `notification-${i}`,
        recipient_id: `recipient-${i}`,
      })),
      queued_count: 6,
      message: 'Notifications queued successfully',
    };

    mockedShareApi.shareRecipe.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useShareRecipe(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(shareRequest);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockedShareApi.shareRecipe).toHaveBeenCalledWith(shareRequest);
    expect(result.current.data?.queued_count).toBe(6);
    expect(result.current.data?.notifications).toHaveLength(6);
  });
});
