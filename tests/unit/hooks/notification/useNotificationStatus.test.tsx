import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useNotificationStatus,
  useNotificationStatusOnce,
} from '@/hooks/notification/useNotificationStatus';
import { managementApi } from '@/lib/api/notification';
import {
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
        notification_id: '770e8400-e29b-41d4-a716-446655440111',
        recipient_id: '550e8400-e29b-41d4-a716-446655440001',
        recipient_email: 'john.doe@example.com',
        subject: 'Recipe Shared',
        notification_type: NotificationType.EMAIL,
        status: NotificationStatus.SENT,
        error_message: '',
        retry_count: 0,
        max_retries: 3,
        created_at: '2025-10-28T14:30:00Z',
        queued_at: '2025-10-28T14:30:01Z',
        sent_at: '2025-10-28T14:30:15Z',
        failed_at: null,
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
        notification_id: '770e8400-e29b-41d4-a716-446655440111',
        recipient_id: '550e8400-e29b-41d4-a716-446655440001',
        recipient_email: 'john.doe@example.com',
        subject: 'Recipe Shared',
        message: 'Full HTML email content here...',
        notification_type: NotificationType.EMAIL,
        status: NotificationStatus.SENT,
        error_message: '',
        retry_count: 0,
        max_retries: 3,
        created_at: '2025-10-28T14:30:00Z',
        queued_at: '2025-10-28T14:30:01Z',
        sent_at: '2025-10-28T14:30:15Z',
        failed_at: null,
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
        notification_id: '770e8400-e29b-41d4-a716-446655440112',
        recipient_id: '550e8400-e29b-41d4-a716-446655440002',
        recipient_email: 'jane.smith@example.com',
        subject: 'Recipe Shared',
        notification_type: NotificationType.EMAIL,
        status: NotificationStatus.PENDING,
        error_message: '',
        retry_count: 0,
        max_retries: 3,
        created_at: '2025-10-28T14:35:00Z',
        queued_at: null,
        sent_at: null,
        failed_at: null,
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

      expect(result.current.data?.status).toBe(NotificationStatus.PENDING);
      expect(result.current.data?.queued_at).toBeNull();
      expect(result.current.data?.sent_at).toBeNull();
    });

    it('should handle notification with queued status', async () => {
      const mockNotification: NotificationDetail = {
        notification_id: '770e8400-e29b-41d4-a716-446655440113',
        recipient_id: '550e8400-e29b-41d4-a716-446655440003',
        recipient_email: 'user@example.com',
        subject: 'Recipe Shared',
        notification_type: NotificationType.EMAIL,
        status: NotificationStatus.QUEUED,
        error_message: '',
        retry_count: 0,
        max_retries: 3,
        created_at: '2025-10-28T14:40:00Z',
        queued_at: '2025-10-28T14:40:01Z',
        sent_at: null,
        failed_at: null,
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

      expect(result.current.data?.status).toBe(NotificationStatus.QUEUED);
      expect(result.current.data?.queued_at).toBeDefined();
      expect(result.current.data?.sent_at).toBeNull();
    });

    it('should handle notification with failed status', async () => {
      const mockNotification: NotificationDetail = {
        notification_id: '770e8400-e29b-41d4-a716-446655440114',
        recipient_id: '550e8400-e29b-41d4-a716-446655440004',
        recipient_email: 'invalid@example.com',
        subject: 'Recipe Shared',
        notification_type: NotificationType.EMAIL,
        status: NotificationStatus.FAILED,
        error_message: 'SMTP connection failed',
        retry_count: 3,
        max_retries: 3,
        created_at: '2025-10-28T14:45:00Z',
        queued_at: '2025-10-28T14:45:01Z',
        sent_at: null,
        failed_at: '2025-10-28T14:45:30Z',
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

      expect(result.current.data?.status).toBe(NotificationStatus.FAILED);
      expect(result.current.data?.error_message).toBe('SMTP connection failed');
      expect(result.current.data?.retry_count).toBe(3);
      expect(result.current.data?.failed_at).toBeDefined();
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
        notification_id: '770e8400-e29b-41d4-a716-446655440111',
        recipient_id: '550e8400-e29b-41d4-a716-446655440001',
        recipient_email: 'john.doe@example.com',
        subject: 'Recipe Shared',
        notification_type: NotificationType.EMAIL,
        status: NotificationStatus.SENT,
        error_message: '',
        retry_count: 0,
        max_retries: 3,
        created_at: '2025-10-28T14:30:00Z',
        queued_at: '2025-10-28T14:30:01Z',
        sent_at: '2025-10-28T14:30:15Z',
        failed_at: null,
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
        notification_id: '770e8400-e29b-41d4-a716-446655440111',
        recipient_id: '550e8400-e29b-41d4-a716-446655440001',
        recipient_email: 'john.doe@example.com',
        subject: 'Recipe Shared',
        message: 'Full HTML content',
        notification_type: NotificationType.EMAIL,
        status: NotificationStatus.SENT,
        error_message: '',
        retry_count: 0,
        max_retries: 3,
        created_at: '2025-10-28T14:30:00Z',
        queued_at: '2025-10-28T14:30:01Z',
        sent_at: '2025-10-28T14:30:15Z',
        failed_at: null,
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
