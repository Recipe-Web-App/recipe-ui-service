import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '@/lib/api/user-management';
import { QUERY_KEYS } from '@/constants';
import { useAuthStore } from '@/stores/auth-store';
import type {
  UserProfileUpdateRequest,
  PaginationParams,
} from '@/types/user-management';

/**
 * Hook to fetch a specific user by ID
 */
export const useUser = (userId: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.USER_MANAGEMENT.USER, userId],
    queryFn: () => usersApi.getUserProfile(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to fetch the current authenticated user
 */
export const useCurrentUser = () => {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: [...QUERY_KEYS.USER_MANAGEMENT.USER, 'current'],
    queryFn: () => usersApi.getCurrentUserProfile(),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to search users by query
 */
export const useSearchUsers = (query: string, params?: PaginationParams) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.USER_MANAGEMENT.USERS, 'search', query, params],
    queryFn: () => usersApi.searchUsers({ q: query, ...params }),
    enabled: !!query && query.length >= 2, // Only search with at least 2 characters
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to update the current user's profile
 */
export const useUpdateCurrentUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UserProfileUpdateRequest) =>
      usersApi.updateProfile(data),
    onSuccess: () => {
      // Invalidate current user query
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.USER_MANAGEMENT.USER, 'current'],
      });

      // Invalidate users search cache
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.USER_MANAGEMENT.USERS,
      });
    },
  });
};

/**
 * Hook to request account deletion
 */
export const useRequestAccountDeletion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => usersApi.requestAccountDeletion(),
    onSuccess: () => {
      // Invalidate current user query
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.USER_MANAGEMENT.USER, 'current'],
      });
    },
  });
};

/**
 * Hook to confirm account deletion
 */
export const useConfirmAccountDeletion = () => {
  const queryClient = useQueryClient();
  const { clearAuth } = useAuthStore();

  return useMutation({
    mutationFn: (token: string) =>
      usersApi.confirmAccountDeletion({ confirmationToken: token }),
    onSuccess: () => {
      // Clear auth and all queries
      clearAuth();
      queryClient.clear();
    },
  });
};
