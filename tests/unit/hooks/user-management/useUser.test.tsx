import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useUser,
  useCurrentUser,
  useSearchUsers,
  useUpdateCurrentUser,
  useRequestAccountDeletion,
  useConfirmAccountDeletion,
} from '@/hooks/user-management/useUser';
import { useAuthStore } from '@/stores/auth-store';
import { usersApi } from '@/lib/api/user-management';
import type {
  UserProfileResponse,
  UserSearchResponse,
  UserProfileUpdateRequest,
  UserAccountDeleteRequestResponse,
  UserConfirmAccountDeleteResponse,
} from '@/types/user-management';

// Mock the API
jest.mock('@/lib/api/user-management', () => ({
  usersApi: {
    getUserProfile: jest.fn(),
    searchUsers: jest.fn(),
    updateProfile: jest.fn(),
    requestAccountDeletion: jest.fn(),
    confirmAccountDeletion: jest.fn(),
  },
}));

// Mock the auth store
jest.mock('@/stores/auth-store', () => ({
  useAuthStore: jest.fn(),
}));

const mockedUsersApi = usersApi as jest.Mocked<typeof usersApi>;
const mockedUseAuthStore = useAuthStore as jest.MockedFunction<
  typeof useAuthStore
>;

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

describe('useUser hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseAuthStore.mockReturnValue({
      isAuthenticated: true,
      user: { id: 'user-123', name: 'Test User', email: 'test@example.com' },
      authUser: null,
      token: 'mock-token',
      setAuthUser: jest.fn(),
      setToken: jest.fn(),
      clearAuth: jest.fn(),
    });
  });

  describe('useUser', () => {
    it('should fetch user profile by ID', async () => {
      const mockUserProfile: UserProfileResponse = {
        userId: 'user-123',
        username: 'testuser',
        email: 'test@example.com',
        fullName: 'Test User',
        bio: 'Test bio',
        isActive: true,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-02T00:00:00Z',
      };

      mockedUsersApi.getUserProfile.mockResolvedValue(mockUserProfile);

      const { result } = renderHook(() => useUser('user-123'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedUsersApi.getUserProfile).toHaveBeenCalledWith('user-123');
      expect(result.current.data).toEqual(mockUserProfile);
    });

    it('should not fetch when userId is not provided', () => {
      const { result } = renderHook(() => useUser(''), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe('idle');
      expect(mockedUsersApi.getUserProfile).not.toHaveBeenCalled();
    });

    it('should handle user profile fetch error', async () => {
      const error = new Error('User not found');
      mockedUsersApi.getUserProfile.mockRejectedValue(error);

      const { result } = renderHook(() => useUser('nonexistent-user'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(result.current.error).toBe(error);
    });
  });

  describe('useCurrentUser', () => {
    it('should fetch current user profile using user.id from auth store', async () => {
      const mockCurrentUser: UserProfileResponse = {
        userId: 'user-123',
        username: 'testuser',
        email: 'test@example.com',
        fullName: 'Test User',
        bio: 'Test bio',
        isActive: true,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-02T00:00:00Z',
      };

      mockedUsersApi.getUserProfile.mockResolvedValue(mockCurrentUser);

      const { result } = renderHook(() => useCurrentUser(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // Should call getUserProfile with the user.id from auth store
      expect(mockedUsersApi.getUserProfile).toHaveBeenCalledWith('user-123');
      expect(result.current.data).toEqual(mockCurrentUser);
    });

    it('should not fetch when not authenticated', () => {
      mockedUseAuthStore.mockReturnValue({
        isAuthenticated: false,
        user: null,
        authUser: null,
        token: null,
        setAuthUser: jest.fn(),
        setToken: jest.fn(),
        clearAuth: jest.fn(),
      });

      const { result } = renderHook(() => useCurrentUser(), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe('idle');
      expect(mockedUsersApi.getUserProfile).not.toHaveBeenCalled();
    });

    it('should not fetch when user.id is not available', () => {
      mockedUseAuthStore.mockReturnValue({
        isAuthenticated: true,
        user: null,
        authUser: null,
        token: 'mock-token',
        setAuthUser: jest.fn(),
        setToken: jest.fn(),
        clearAuth: jest.fn(),
      });

      const { result } = renderHook(() => useCurrentUser(), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe('idle');
      expect(mockedUsersApi.getUserProfile).not.toHaveBeenCalled();
    });
  });

  describe('useSearchUsers', () => {
    it('should search users with query parameters', async () => {
      const mockSearchResponse: UserSearchResponse = {
        results: [
          {
            userId: 'user-123',
            username: 'testuser',
            fullName: 'Test User',
            isActive: true,
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2023-01-02T00:00:00Z',
          },
        ],
        totalCount: 1,
        limit: 10,
        offset: 0,
      };

      mockedUsersApi.searchUsers.mockResolvedValue(mockSearchResponse);

      const { result } = renderHook(
        () => useSearchUsers('test', { limit: 10, offset: 0 }),
        {
          wrapper: createWrapper(),
        }
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // Updated: 'q' param renamed to 'query' per OpenAPI spec
      expect(mockedUsersApi.searchUsers).toHaveBeenCalledWith({
        query: 'test',
        limit: 10,
        offset: 0,
      });
      expect(result.current.data).toEqual(mockSearchResponse);
    });

    it('should not search when query is empty', () => {
      const { result } = renderHook(() => useSearchUsers(''), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe('idle');
      expect(mockedUsersApi.searchUsers).not.toHaveBeenCalled();
    });

    it('should not search when query is too short', () => {
      const { result } = renderHook(() => useSearchUsers('a'), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe('idle');
      expect(mockedUsersApi.searchUsers).not.toHaveBeenCalled();
    });
  });

  describe('useUpdateCurrentUser', () => {
    it('should update current user profile', async () => {
      const updateRequest: UserProfileUpdateRequest = {
        bio: 'Updated bio',
      };

      const mockUpdatedProfile: UserProfileResponse = {
        userId: 'user-123',
        username: 'testuser',
        email: 'test@example.com',
        fullName: 'Test User',
        bio: 'Test bio',
        isActive: true,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-02T00:00:00Z',
      };

      mockedUsersApi.updateProfile.mockResolvedValue(mockUpdatedProfile);

      const { result } = renderHook(() => useUpdateCurrentUser(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(updateRequest);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedUsersApi.updateProfile).toHaveBeenCalledWith(updateRequest);
      expect(result.current.data).toEqual(mockUpdatedProfile);
    });

    it('should handle update error', async () => {
      const error = new Error('Update failed');
      mockedUsersApi.updateProfile.mockRejectedValue(error);

      const { result } = renderHook(() => useUpdateCurrentUser(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({
        bio: 'Failed Update',
      });

      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(result.current.error).toBe(error);
    });
  });

  describe('useRequestAccountDeletion', () => {
    it('should request account deletion successfully', async () => {
      const mockDeletionRequest: UserAccountDeleteRequestResponse = {
        userId: 'current-user-123',
        confirmationToken: 'deletion-token-123',
        expiresAt: '2023-01-08T00:00:00Z',
      };

      mockedUsersApi.requestAccountDeletion.mockResolvedValue(
        mockDeletionRequest
      );

      const { result } = renderHook(() => useRequestAccountDeletion(), {
        wrapper: createWrapper(),
      });

      result.current.mutate();

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedUsersApi.requestAccountDeletion).toHaveBeenCalledWith();
      expect(result.current.data).toEqual(mockDeletionRequest);
    });
  });

  describe('useConfirmAccountDeletion', () => {
    it('should confirm account deletion successfully', async () => {
      const mockConfirmationResponse: UserConfirmAccountDeleteResponse = {
        userId: 'current-user-123',
        deactivatedAt: '2023-01-08T00:00:00Z',
      };

      mockedUsersApi.confirmAccountDeletion.mockResolvedValue(
        mockConfirmationResponse
      );

      const { result } = renderHook(() => useConfirmAccountDeletion(), {
        wrapper: createWrapper(),
      });

      result.current.mutate('confirm-token-xyz');

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedUsersApi.confirmAccountDeletion).toHaveBeenCalledWith({
        confirmationToken: 'confirm-token-xyz',
      });
      expect(result.current.data).toEqual(mockConfirmationResponse);
    });

    it('should handle confirmation error', async () => {
      const error = new Error('Invalid confirmation token');
      mockedUsersApi.confirmAccountDeletion.mockRejectedValue(error);

      const { result } = renderHook(() => useConfirmAccountDeletion(), {
        wrapper: createWrapper(),
      });

      result.current.mutate('invalid-token');

      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(result.current.error).toBe(error);
    });
  });
});
