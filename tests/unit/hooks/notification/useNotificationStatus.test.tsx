import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useNotificationStatus,
  useNotificationStatusOnce,
} from '@/hooks/notification/useNotificationStatus';
import { managementApi } from '@/lib/api/notification';
import {
  NotificationCategory,
  NotificationStatus,
  NotificationType,
  type NotificationDetail,
} from '@/types/notification';

// Mock the API
jest.mock('@/lib/api/notification', () => ({
  managementApi: {
    getNotificationById: jest.fn(),
  },
}));

const mockedManagementApi = managementApi as jest.Mocked<typeof managementApi>;

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

describe('useNotificationStatus hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useNotificationStatus', () => {
    it('should fetch notification status with default includeMessage', async () => {
      const mockNotification: NotificationDetail = {
        notificationId: '770e8400-e29b-41d4-a716-446655440111',
        userId: '550e8400-e29b-41d4-a716-446655440001',
        notificationCategory: NotificationCategory.RECIPE_SHARED,
        isRead: false,
        isDeleted: false,
        createdAt: '2025-10-28T14:30:00Z',
        updatedAt: '2025-10-28T14:30:15Z',
        notificationData: {
          templateVersion: '1.0',
          recipeId: 123,
          recipeTitle: 'Test Recipe',
          actorId: 'user-2',
          actorName: 'John Doe',
        },
        title: 'Recipe Shared',
        message: 'John Doe shared a recipe with you',
        deliveryStatuses: [
          {
            notificationType: NotificationType.EMAIL,
            status: NotificationStatus.SENT,
            retryCount: 0,
            errorMessage: null,
            recipientEmail: 'john.doe@example.com',
            createdAt: '2025-10-28T14:30:00Z',
            updatedAt: '2025-10-28T14:30:15Z',
            queuedAt: '2025-10-28T14:30:01Z',
            sentAt: '2025-10-28T14:30:15Z',
            failedAt: null,
          },
        ],
      };

      mockedManagementApi.getNotificationById.mockResolvedValue(
        mockNotification
      );

      const { result } = renderHook(
        () =>
          useNotificationStatus('770e8400-e29b-41d4-a716-446655440111', false),
        {
          wrapper: createWrapper(),
        }
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedManagementApi.getNotificationById).toHaveBeenCalledWith(
        '770e8400-e29b-41d4-a716-446655440111',
        false
      );
      expect(result.current.data).toEqual(mockNotification);
    });

    it('should fetch notification status with message included', async () => {
      const mockNotification: NotificationDetail = {
        notificationId: '770e8400-e29b-41d4-a716-446655440111',
        userId: '550e8400-e29b-41d4-a716-446655440001',
        notificationCategory: NotificationCategory.RECIPE_SHARED,
        isRead: false,
        isDeleted: false,
        createdAt: '2025-10-28T14:30:00Z',
        updatedAt: '2025-10-28T14:30:15Z',
        notificationData: {
          templateVersion: '1.0',
          recipeId: 123,
          recipeTitle: 'Test Recipe',
          actorId: 'user-2',
          actorName: 'John Doe',
        },
        title: 'Recipe Shared',
        message: 'Full HTML email content here...',
        deliveryStatuses: [
          {
            notificationType: NotificationType.EMAIL,
            status: NotificationStatus.SENT,
            retryCount: 0,
            errorMessage: null,
            recipientEmail: 'john.doe@example.com',
            createdAt: '2025-10-28T14:30:00Z',
            updatedAt: '2025-10-28T14:30:15Z',
            queuedAt: '2025-10-28T14:30:01Z',
            sentAt: '2025-10-28T14:30:15Z',
            failedAt: null,
          },
        ],
      };

      mockedManagementApi.getNotificationById.mockResolvedValue(
        mockNotification
      );

      const { result } = renderHook(
        () =>
          useNotificationStatus('770e8400-e29b-41d4-a716-446655440111', true),
        {
          wrapper: createWrapper(),
        }
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedManagementApi.getNotificationById).toHaveBeenCalledWith(
        '770e8400-e29b-41d4-a716-446655440111',
        true
      );
      expect(result.current.data).toEqual(mockNotification);
      expect(result.current.data?.message).toBeDefined();
    });

    it('should not fetch when notificationId is undefined', () => {
      const { result } = renderHook(() => useNotificationStatus(undefined), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe('idle');
      expect(mockedManagementApi.getNotificationById).not.toHaveBeenCalled();
    });

    it('should handle notification with pending status', async () => {
      const mockNotification: NotificationDetail = {
        notificationId: '770e8400-e29b-41d4-a716-446655440112',
        userId: '550e8400-e29b-41d4-a716-446655440002',
        notificationCategory: NotificationCategory.RECIPE_SHARED,
        isRead: false,
        isDeleted: false,
        createdAt: '2025-10-28T14:35:00Z',
        updatedAt: '2025-10-28T14:35:00Z',
        notificationData: {
          templateVersion: '1.0',
          recipeId: 123,
          recipeTitle: 'Test Recipe',
          actorId: 'user-2',
          actorName: 'Jane Smith',
        },
        title: 'Recipe Shared',
        message: 'Jane Smith shared a recipe with you',
        deliveryStatuses: [
          {
            notificationType: NotificationType.EMAIL,
            status: NotificationStatus.PENDING,
            retryCount: 0,
            errorMessage: null,
            recipientEmail: 'jane.smith@example.com',
            createdAt: '2025-10-28T14:35:00Z',
            updatedAt: '2025-10-28T14:35:00Z',
            queuedAt: null,
            sentAt: null,
            failedAt: null,
          },
        ],
      };

      mockedManagementApi.getNotificationById.mockResolvedValue(
        mockNotification
      );

      const { result } = renderHook(
        () => useNotificationStatus('770e8400-e29b-41d4-a716-446655440112'),
        {
          wrapper: createWrapper(),
        }
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.deliveryStatuses[0].status).toBe(
        NotificationStatus.PENDING
      );
      expect(result.current.data?.deliveryStatuses[0].queuedAt).toBeNull();
      expect(result.current.data?.deliveryStatuses[0].sentAt).toBeNull();
    });

    it('should handle notification with queued status', async () => {
      const mockNotification: NotificationDetail = {
        notificationId: '770e8400-e29b-41d4-a716-446655440113',
        userId: '550e8400-e29b-41d4-a716-446655440003',
        notificationCategory: NotificationCategory.RECIPE_SHARED,
        isRead: false,
        isDeleted: false,
        createdAt: '2025-10-28T14:40:00Z',
        updatedAt: '2025-10-28T14:40:01Z',
        notificationData: {
          templateVersion: '1.0',
          recipeId: 123,
          recipeTitle: 'Test Recipe',
          actorId: 'user-2',
          actorName: 'User',
        },
        title: 'Recipe Shared',
        message: 'User shared a recipe with you',
        deliveryStatuses: [
          {
            notificationType: NotificationType.EMAIL,
            status: NotificationStatus.QUEUED,
            retryCount: 0,
            errorMessage: null,
            recipientEmail: 'user@example.com',
            createdAt: '2025-10-28T14:40:00Z',
            updatedAt: '2025-10-28T14:40:01Z',
            queuedAt: '2025-10-28T14:40:01Z',
            sentAt: null,
            failedAt: null,
          },
        ],
      };

      mockedManagementApi.getNotificationById.mockResolvedValue(
        mockNotification
      );

      const { result } = renderHook(
        () => useNotificationStatus('770e8400-e29b-41d4-a716-446655440113'),
        {
          wrapper: createWrapper(),
        }
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.deliveryStatuses[0].status).toBe(
        NotificationStatus.QUEUED
      );
      expect(result.current.data?.deliveryStatuses[0].queuedAt).toBeDefined();
      expect(result.current.data?.deliveryStatuses[0].sentAt).toBeNull();
    });

    it('should handle notification with failed status', async () => {
      const mockNotification: NotificationDetail = {
        notificationId: '770e8400-e29b-41d4-a716-446655440114',
        userId: '550e8400-e29b-41d4-a716-446655440004',
        notificationCategory: NotificationCategory.RECIPE_SHARED,
        isRead: false,
        isDeleted: false,
        createdAt: '2025-10-28T14:45:00Z',
        updatedAt: '2025-10-28T14:45:30Z',
        notificationData: {
          templateVersion: '1.0',
          recipeId: 123,
          recipeTitle: 'Test Recipe',
          actorId: 'user-2',
          actorName: 'User',
        },
        title: 'Recipe Shared',
        message: 'User shared a recipe with you',
        deliveryStatuses: [
          {
            notificationType: NotificationType.EMAIL,
            status: NotificationStatus.FAILED,
            retryCount: 3,
            errorMessage: 'SMTP connection failed',
            recipientEmail: 'invalid@example.com',
            createdAt: '2025-10-28T14:45:00Z',
            updatedAt: '2025-10-28T14:45:30Z',
            queuedAt: '2025-10-28T14:45:01Z',
            sentAt: null,
            failedAt: '2025-10-28T14:45:30Z',
          },
        ],
      };

      mockedManagementApi.getNotificationById.mockResolvedValue(
        mockNotification
      );

      const { result } = renderHook(
        () => useNotificationStatus('770e8400-e29b-41d4-a716-446655440114'),
        {
          wrapper: createWrapper(),
        }
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.deliveryStatuses[0].status).toBe(
        NotificationStatus.FAILED
      );
      expect(result.current.data?.deliveryStatuses[0].errorMessage).toBe(
        'SMTP connection failed'
      );
      expect(result.current.data?.deliveryStatuses[0].retryCount).toBe(3);
      expect(result.current.data?.deliveryStatuses[0].failedAt).toBeDefined();
    });

    it('should handle notification with multiple delivery channels', async () => {
      const mockNotification: NotificationDetail = {
        notificationId: '770e8400-e29b-41d4-a716-446655440115',
        userId: '550e8400-e29b-41d4-a716-446655440005',
        notificationCategory: NotificationCategory.RECIPE_SHARED,
        isRead: false,
        isDeleted: false,
        createdAt: '2025-10-28T14:50:00Z',
        updatedAt: '2025-10-28T14:50:15Z',
        notificationData: {
          templateVersion: '1.0',
          recipeId: 123,
          recipeTitle: 'Test Recipe',
          actorId: 'user-2',
          actorName: 'User',
        },
        title: 'Recipe Shared',
        message: 'User shared a recipe with you',
        deliveryStatuses: [
          {
            notificationType: NotificationType.EMAIL,
            status: NotificationStatus.SENT,
            retryCount: 0,
            errorMessage: null,
            recipientEmail: 'user@example.com',
            createdAt: '2025-10-28T14:50:00Z',
            updatedAt: '2025-10-28T14:50:15Z',
            queuedAt: '2025-10-28T14:50:01Z',
            sentAt: '2025-10-28T14:50:15Z',
            failedAt: null,
          },
          {
            notificationType: NotificationType.IN_APP,
            status: NotificationStatus.SENT,
            retryCount: 0,
            errorMessage: null,
            createdAt: '2025-10-28T14:50:00Z',
            updatedAt: '2025-10-28T14:50:02Z',
            queuedAt: '2025-10-28T14:50:01Z',
            sentAt: '2025-10-28T14:50:02Z',
            failedAt: null,
          },
        ],
      };

      mockedManagementApi.getNotificationById.mockResolvedValue(
        mockNotification
      );

      const { result } = renderHook(
        () => useNotificationStatus('770e8400-e29b-41d4-a716-446655440115'),
        {
          wrapper: createWrapper(),
        }
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.deliveryStatuses).toHaveLength(2);
      expect(result.current.data?.deliveryStatuses[0].notificationType).toBe(
        NotificationType.EMAIL
      );
      expect(result.current.data?.deliveryStatuses[1].notificationType).toBe(
        NotificationType.IN_APP
      );
    });

    it('should handle 404 not found error', async () => {
      const error = new Error('Notification not found');
      mockedManagementApi.getNotificationById.mockRejectedValue(error);

      const { result } = renderHook(
        () => useNotificationStatus('770e8400-e29b-41d4-a716-446655440999'),
        {
          wrapper: createWrapper(),
        }
      );

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(error);
    });

    it('should handle 403 forbidden error', async () => {
      const error = new Error(
        'You do not have permission to perform this action'
      );
      mockedManagementApi.getNotificationById.mockRejectedValue(error);

      const { result } = renderHook(
        () => useNotificationStatus('770e8400-e29b-41d4-a716-446655440111'),
        {
          wrapper: createWrapper(),
        }
      );

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(error);
    });

    it('should handle network error', async () => {
      const error = new Error('Network Error');
      mockedManagementApi.getNotificationById.mockRejectedValue(error);

      const { result } = renderHook(
        () => useNotificationStatus('770e8400-e29b-41d4-a716-446655440111'),
        {
          wrapper: createWrapper(),
        }
      );

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(error);
    });
  });

  describe('useNotificationStatusOnce', () => {
    it('should fetch notification status once without polling', async () => {
      const mockNotification: NotificationDetail = {
        notificationId: '770e8400-e29b-41d4-a716-446655440111',
        userId: '550e8400-e29b-41d4-a716-446655440001',
        notificationCategory: NotificationCategory.RECIPE_SHARED,
        isRead: false,
        isDeleted: false,
        createdAt: '2025-10-28T14:30:00Z',
        updatedAt: '2025-10-28T14:30:15Z',
        notificationData: {
          templateVersion: '1.0',
          recipeId: 123,
          recipeTitle: 'Test Recipe',
          actorId: 'user-2',
          actorName: 'John Doe',
        },
        title: 'Recipe Shared',
        message: 'John Doe shared a recipe with you',
        deliveryStatuses: [
          {
            notificationType: NotificationType.EMAIL,
            status: NotificationStatus.SENT,
            retryCount: 0,
            errorMessage: null,
            recipientEmail: 'john.doe@example.com',
            createdAt: '2025-10-28T14:30:00Z',
            updatedAt: '2025-10-28T14:30:15Z',
            queuedAt: '2025-10-28T14:30:01Z',
            sentAt: '2025-10-28T14:30:15Z',
            failedAt: null,
          },
        ],
      };

      mockedManagementApi.getNotificationById.mockResolvedValue(
        mockNotification
      );

      const { result } = renderHook(
        () =>
          useNotificationStatusOnce(
            '770e8400-e29b-41d4-a716-446655440111',
            false
          ),
        {
          wrapper: createWrapper(),
        }
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedManagementApi.getNotificationById).toHaveBeenCalledWith(
        '770e8400-e29b-41d4-a716-446655440111',
        false
      );
      expect(result.current.data).toEqual(mockNotification);
    });

    it('should not fetch when notificationId is undefined', () => {
      const { result } = renderHook(
        () => useNotificationStatusOnce(undefined),
        {
          wrapper: createWrapper(),
        }
      );

      expect(result.current.fetchStatus).toBe('idle');
      expect(mockedManagementApi.getNotificationById).not.toHaveBeenCalled();
    });

    it('should fetch with message included', async () => {
      const mockNotification: NotificationDetail = {
        notificationId: '770e8400-e29b-41d4-a716-446655440111',
        userId: '550e8400-e29b-41d4-a716-446655440001',
        notificationCategory: NotificationCategory.RECIPE_SHARED,
        isRead: false,
        isDeleted: false,
        createdAt: '2025-10-28T14:30:00Z',
        updatedAt: '2025-10-28T14:30:15Z',
        notificationData: {
          templateVersion: '1.0',
          recipeId: 123,
          recipeTitle: 'Test Recipe',
          actorId: 'user-2',
          actorName: 'John Doe',
        },
        title: 'Recipe Shared',
        message: 'Full HTML content',
        deliveryStatuses: [
          {
            notificationType: NotificationType.EMAIL,
            status: NotificationStatus.SENT,
            retryCount: 0,
            errorMessage: null,
            recipientEmail: 'john.doe@example.com',
            createdAt: '2025-10-28T14:30:00Z',
            updatedAt: '2025-10-28T14:30:15Z',
            queuedAt: '2025-10-28T14:30:01Z',
            sentAt: '2025-10-28T14:30:15Z',
            failedAt: null,
          },
        ],
      };

      mockedManagementApi.getNotificationById.mockResolvedValue(
        mockNotification
      );

      const { result } = renderHook(
        () =>
          useNotificationStatusOnce(
            '770e8400-e29b-41d4-a716-446655440111',
            true
          ),
        {
          wrapper: createWrapper(),
        }
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedManagementApi.getNotificationById).toHaveBeenCalledWith(
        '770e8400-e29b-41d4-a716-446655440111',
        true
      );
      expect(result.current.data?.message).toBeDefined();
    });

    it('should handle errors', async () => {
      const error = new Error('Notification not found');
      mockedManagementApi.getNotificationById.mockRejectedValue(error);

      const { result } = renderHook(
        () => useNotificationStatusOnce('770e8400-e29b-41d4-a716-446655440999'),
        {
          wrapper: createWrapper(),
        }
      );

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(error);
    });
  });
});
