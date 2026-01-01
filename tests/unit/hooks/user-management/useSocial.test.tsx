import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useFollowing,
  useFollowers,
  useFollowUser,
  useUnfollowUser,
  useIsFollowing,
  useMutualFollows,
  useFollowStats,
  useUserActivity,
} from '@/hooks/user-management/useSocial';
import { socialApi } from '@/lib/api/user-management';
import type {
  GetFollowedUsersResponse,
  FollowResponse,
  UserActivityResponse,
  UserActivityParams,
} from '@/types/user-management';

// Mock the API
jest.mock('@/lib/api/user-management', () => ({
  socialApi: {
    getFollowing: jest.fn(),
    getFollowers: jest.fn(),
    followUser: jest.fn(),
    unfollowUser: jest.fn(),
    isFollowingUser: jest.fn(),
    getMutualFollows: jest.fn(),
    getFollowStats: jest.fn(),
    getUserActivity: jest.fn(),
  },
}));

const mockedSocialApi = socialApi as jest.Mocked<typeof socialApi>;

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

describe('useSocial hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useFollowing', () => {
    it('should fetch following list for a user', async () => {
      const mockFollowingResponse: GetFollowedUsersResponse = {
        followedUsers: [
          {
            userId: 'following-user-1',
            username: 'followinguser1',
            email: 'following1@example.com',
            fullName: 'Following User 1',
            bio: 'Following user 1 bio',
            isActive: true,
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2023-01-02T00:00:00Z',
          },
        ],
        totalCount: 1,
        limit: 100,
        offset: 0,
      };

      mockedSocialApi.getFollowing.mockResolvedValue(mockFollowingResponse);

      const { result } = renderHook(() => useFollowing('user-123', 10, 0), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedSocialApi.getFollowing).toHaveBeenCalledWith('user-123', {
        limit: 10,
        offset: 0,
      });
      expect(result.current.data).toEqual(mockFollowingResponse);
    });

    it('should not fetch when userId is empty', () => {
      const { result } = renderHook(() => useFollowing(''), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe('idle');
      expect(mockedSocialApi.getFollowing).not.toHaveBeenCalled();
    });
  });

  describe('useFollowers', () => {
    it('should fetch followers list for a user', async () => {
      const mockFollowersResponse: GetFollowedUsersResponse = {
        followedUsers: [
          {
            userId: 'following-user-1',
            username: 'followinguser1',
            email: 'following1@example.com',
            fullName: 'Following User 1',
            bio: 'Following user 1 bio',
            isActive: true,
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2023-01-02T00:00:00Z',
          },
        ],
        totalCount: 1,
        limit: 100,
        offset: 0,
      };

      mockedSocialApi.getFollowers.mockResolvedValue(mockFollowersResponse);

      const { result } = renderHook(() => useFollowers('user-123', 10, 0), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedSocialApi.getFollowers).toHaveBeenCalledWith('user-123', {
        limit: 10,
        offset: 0,
      });
      expect(result.current.data).toEqual(mockFollowersResponse);
    });
  });

  describe('useFollowUser', () => {
    it('should follow a user successfully', async () => {
      const mockFollowResponse: FollowResponse = {
        message: 'Now following user',
        isFollowing: true,
      };

      mockedSocialApi.followUser.mockResolvedValue(mockFollowResponse);

      const { result } = renderHook(() => useFollowUser(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({
        userId: 'current-user-123',
        targetUserId: 'target-user-456',
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedSocialApi.followUser).toHaveBeenCalledWith(
        'current-user-123',
        'target-user-456'
      );
      expect(result.current.data).toEqual(mockFollowResponse);
    });

    it('should handle follow error', async () => {
      const error = new Error('Cannot follow user');
      mockedSocialApi.followUser.mockRejectedValue(error);

      const { result } = renderHook(() => useFollowUser(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({
        userId: 'current-user-123',
        targetUserId: 'target-user-456',
      });

      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(result.current.error).toBe(error);
    });
  });

  describe('useUnfollowUser', () => {
    it('should unfollow a user successfully', async () => {
      const mockUnfollowResponse: FollowResponse = {
        message: 'Now unfollowing user',
        isFollowing: false,
      };

      mockedSocialApi.unfollowUser.mockResolvedValue(mockUnfollowResponse);

      const { result } = renderHook(() => useUnfollowUser(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({
        userId: 'current-user-123',
        targetUserId: 'target-user-456',
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedSocialApi.unfollowUser).toHaveBeenCalledWith(
        'current-user-123',
        'target-user-456'
      );
      expect(result.current.data).toEqual(mockUnfollowResponse);
    });
  });

  describe('useIsFollowing', () => {
    it('should check if user is following target user', async () => {
      const mockFollowStatus = true;

      mockedSocialApi.isFollowingUser.mockResolvedValue(mockFollowStatus);

      const { result } = renderHook(
        () => useIsFollowing('current-user-123', 'target-user-456'),
        {
          wrapper: createWrapper(),
        }
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedSocialApi.isFollowingUser).toHaveBeenCalledWith(
        'current-user-123',
        'target-user-456'
      );
      expect(result.current.data).toEqual(mockFollowStatus);
    });

    it('should not check when userId is empty', () => {
      const { result } = renderHook(
        () => useIsFollowing('', 'target-user-456'),
        {
          wrapper: createWrapper(),
        }
      );

      expect(result.current.fetchStatus).toBe('idle');
      expect(mockedSocialApi.isFollowingUser).not.toHaveBeenCalled();
    });

    it('should not check when targetUserId is empty', () => {
      const { result } = renderHook(
        () => useIsFollowing('current-user-123', ''),
        {
          wrapper: createWrapper(),
        }
      );

      expect(result.current.fetchStatus).toBe('idle');
      expect(mockedSocialApi.isFollowingUser).not.toHaveBeenCalled();
    });
  });

  describe('useMutualFollows', () => {
    it('should get mutual follows with target user', async () => {
      const mockMutualFollows: string[] = [
        'mutual-user-1',
        'mutual-user-2',
        'mutual-user-3',
      ];

      mockedSocialApi.getMutualFollows.mockResolvedValue(mockMutualFollows);

      const { result } = renderHook(
        () => useMutualFollows('current-user-123', 'target-user-456'),
        {
          wrapper: createWrapper(),
        }
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedSocialApi.getMutualFollows).toHaveBeenCalledWith(
        'current-user-123',
        'target-user-456'
      );
      expect(result.current.data).toEqual(mockMutualFollows);
    });

    it('should not fetch when userId is empty', () => {
      const { result } = renderHook(
        () => useMutualFollows('', 'target-user-456'),
        {
          wrapper: createWrapper(),
        }
      );

      expect(result.current.fetchStatus).toBe('idle');
      expect(mockedSocialApi.getMutualFollows).not.toHaveBeenCalled();
    });
  });

  describe('useFollowStats', () => {
    it('should get follow statistics for user', async () => {
      const mockFollowStats = {
        followersCount: 100,
        followingCount: 50,
      };

      mockedSocialApi.getFollowStats.mockResolvedValue(mockFollowStats);

      const { result } = renderHook(() => useFollowStats('user-123'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedSocialApi.getFollowStats).toHaveBeenCalledWith('user-123');
      expect(result.current.data).toEqual(mockFollowStats);
    });
  });

  describe('useUserActivity', () => {
    it('should fetch user activity with parameters', async () => {
      const mockActivityResponse: UserActivityResponse = {
        userId: 'user-123',
        recentRecipes: [
          {
            recipeId: 1,
            title: 'Test Recipe',
            createdAt: '2023-01-08T00:00:00Z',
          },
        ],
        recentFollows: [
          {
            userId: 'followed-user-1',
            username: 'followeduser1',
            followedAt: '2023-01-07T00:00:00Z',
          },
        ],
        recentReviews: [
          {
            reviewId: 1,
            recipeId: 1,
            rating: 5,
            comment: 'Great recipe!',
            createdAt: '2023-01-06T00:00:00Z',
          },
        ],
        recentFavorites: [
          {
            recipeId: 2,
            title: 'Favorite Recipe',
            favoritedAt: '2023-01-05T00:00:00Z',
          },
        ],
      };

      mockedSocialApi.getUserActivity.mockResolvedValue(mockActivityResponse);

      const activityParams: UserActivityParams = {
        per_type_limit: 10,
      };

      const { result } = renderHook(
        () => useUserActivity('user-123', activityParams),
        {
          wrapper: createWrapper(),
        }
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedSocialApi.getUserActivity).toHaveBeenCalledWith(
        'user-123',
        activityParams
      );
      expect(result.current.data).toEqual(mockActivityResponse);
    });

    it('should not fetch when userId is empty', () => {
      const { result } = renderHook(() => useUserActivity(''), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe('idle');
      expect(mockedSocialApi.getUserActivity).not.toHaveBeenCalled();
    });
  });
});
