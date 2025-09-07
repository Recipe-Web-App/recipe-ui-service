import { socialApi } from '@/lib/api/user-management/social';
import {
  userManagementClient,
  buildQueryParams,
} from '@/lib/api/user-management/client';
import type {
  FollowResponse,
  GetFollowedUsersResponse,
  UserActivityResponse,
  UserActivityParams,
} from '@/types/user-management';

// Mock the client module
jest.mock('@/lib/api/user-management/client', () => ({
  userManagementClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
  handleUserManagementApiError: jest.fn(error => {
    throw error;
  }),
  buildQueryParams: jest.requireActual('@/lib/api/user-management/client')
    .buildQueryParams,
}));

const mockClient = userManagementClient as jest.Mocked<
  typeof userManagementClient
>;

describe('Social API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getFollowing', () => {
    it('should get following list successfully', async () => {
      const mockResponse: GetFollowedUsersResponse = {
        followedUsers: [
          {
            userId: '123',
            username: 'user1',
            fullName: 'User One',
            isActive: true,
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2023-01-01T00:00:00Z',
          },
        ],
        totalCount: 1,
        limit: 20,
        offset: 0,
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await socialApi.getFollowing('user123');

      expect(mockClient.get).toHaveBeenCalledWith('/users/user123/following');
      expect(result).toEqual(mockResponse);
    });

    it('should get following list with pagination parameters', async () => {
      const mockResponse: GetFollowedUsersResponse = {
        followedUsers: [],
        totalCount: 0,
        limit: 10,
        offset: 5,
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await socialApi.getFollowing('user123', {
        limit: 10,
        offset: 5,
      });

      expect(mockClient.get).toHaveBeenCalledWith(
        '/users/user123/following?limit=10&offset=5'
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle get following error', async () => {
      mockClient.get.mockRejectedValue(new Error('User not found'));

      await expect(socialApi.getFollowing('user123')).rejects.toThrow();
    });
  });

  describe('getFollowers', () => {
    it('should get followers list successfully', async () => {
      const mockResponse: GetFollowedUsersResponse = {
        followedUsers: [
          {
            userId: '456',
            username: 'follower1',
            fullName: 'Follower One',
            isActive: true,
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2023-01-01T00:00:00Z',
          },
        ],
        totalCount: 1,
        limit: 20,
        offset: 0,
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await socialApi.getFollowers('user123');

      expect(mockClient.get).toHaveBeenCalledWith('/users/user123/followers');
      expect(result).toEqual(mockResponse);
    });

    it('should get followers list with pagination parameters', async () => {
      const mockResponse: GetFollowedUsersResponse = {
        followedUsers: [],
        totalCount: 0,
        limit: 15,
        offset: 10,
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await socialApi.getFollowers('user123', {
        limit: 15,
        offset: 10,
      });

      expect(mockClient.get).toHaveBeenCalledWith(
        '/users/user123/followers?limit=15&offset=10'
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle get followers error', async () => {
      mockClient.get.mockRejectedValue(new Error('Access denied'));

      await expect(socialApi.getFollowers('user123')).rejects.toThrow();
    });
  });

  describe('toggleFollowUser', () => {
    it('should follow a user successfully', async () => {
      const mockResponse: FollowResponse = {
        message: 'Successfully followed user',
        isFollowing: true,
      };

      mockClient.put.mockResolvedValue({ data: mockResponse });

      const result = await socialApi.toggleFollowUser(
        'current-user',
        'target-user'
      );

      expect(mockClient.put).toHaveBeenCalledWith(
        '/users/current-user/follow/target-user'
      );
      expect(result).toEqual(mockResponse);
    });

    it('should unfollow a user successfully', async () => {
      const mockResponse: FollowResponse = {
        message: 'Successfully unfollowed user',
        isFollowing: false,
      };

      mockClient.put.mockResolvedValue({ data: mockResponse });

      const result = await socialApi.toggleFollowUser(
        'current-user',
        'target-user'
      );

      expect(mockClient.put).toHaveBeenCalledWith(
        '/users/current-user/follow/target-user'
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle toggle follow error', async () => {
      mockClient.put.mockRejectedValue(new Error('User not found'));

      await expect(
        socialApi.toggleFollowUser('current-user', 'target-user')
      ).rejects.toThrow();
    });
  });

  describe('getUserActivity', () => {
    it('should get user activity successfully', async () => {
      const mockResponse: UserActivityResponse = {
        userId: 'user123',
        recentRecipes: [],
        recentFollows: [],
        recentReviews: [],
        recentFavorites: [
          {
            recipeId: 1,
            title: 'Favorite Recipe',
            favoritedAt: '2023-01-01T00:00:00Z',
          },
        ],
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await socialApi.getUserActivity('user123');

      expect(mockClient.get).toHaveBeenCalledWith('/users/user123/activity');
      expect(result).toEqual(mockResponse);
    });

    it('should get user activity with parameters', async () => {
      const mockResponse: UserActivityResponse = {
        userId: 'user123',
        recentRecipes: [],
        recentFollows: [],
        recentReviews: [],
        recentFavorites: [],
      };

      const params: UserActivityParams = {
        per_type_limit: 10,
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await socialApi.getUserActivity('user123', params);

      expect(mockClient.get).toHaveBeenCalledWith(
        '/users/user123/activity?per_type_limit=10'
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle get user activity error', async () => {
      mockClient.get.mockRejectedValue(new Error('Activity not accessible'));

      await expect(socialApi.getUserActivity('user123')).rejects.toThrow();
    });
  });

  describe('getCurrentUserFollowing', () => {
    it('should get current user following list', async () => {
      const mockResponse: GetFollowedUsersResponse = {
        followedUsers: [
          {
            userId: '123',
            username: 'followed1',
            isActive: true,
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2023-01-01T00:00:00Z',
          },
        ],
        totalCount: 1,
        limit: 20,
        offset: 0,
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await socialApi.getCurrentUserFollowing();

      expect(mockClient.get).toHaveBeenCalledWith('/users/me/following');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getCurrentUserFollowers', () => {
    it('should get current user followers list', async () => {
      const mockResponse: GetFollowedUsersResponse = {
        followedUsers: [
          {
            userId: '456',
            username: 'follower1',
            isActive: true,
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2023-01-01T00:00:00Z',
          },
        ],
        totalCount: 1,
        limit: 20,
        offset: 0,
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await socialApi.getCurrentUserFollowers();

      expect(mockClient.get).toHaveBeenCalledWith('/users/me/followers');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('followUser', () => {
    it('should follow a user using current user context', async () => {
      const mockResponse: FollowResponse = {
        message: 'Successfully followed user',
        isFollowing: true,
      };

      mockClient.put.mockResolvedValue({ data: mockResponse });

      const result = await socialApi.followUser('target-user');

      expect(mockClient.put).toHaveBeenCalledWith(
        '/users/me/follow/target-user'
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('unfollowUser', () => {
    it('should unfollow a user using current user context', async () => {
      const mockResponse: FollowResponse = {
        message: 'Successfully unfollowed user',
        isFollowing: false,
      };

      mockClient.put.mockResolvedValue({ data: mockResponse });

      const result = await socialApi.unfollowUser('target-user');

      expect(mockClient.put).toHaveBeenCalledWith(
        '/users/me/follow/target-user'
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getCurrentUserActivity', () => {
    it('should get current user activity', async () => {
      const mockResponse: UserActivityResponse = {
        userId: 'current-user',
        recentRecipes: [],
        recentFollows: [],
        recentReviews: [],
        recentFavorites: [
          {
            recipeId: 2,
            title: 'Another Favorite Recipe',
            favoritedAt: '2023-01-01T00:00:00Z',
          },
        ],
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await socialApi.getCurrentUserActivity();

      expect(mockClient.get).toHaveBeenCalledWith('/users/me/activity');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('isFollowingUser', () => {
    it('should return true when user is following target user', async () => {
      const mockResponse: GetFollowedUsersResponse = {
        followedUsers: [
          {
            userId: 'target-user',
            username: 'targetuser',
            isActive: true,
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2023-01-01T00:00:00Z',
          },
        ],
        totalCount: 1,
        limit: 100,
        offset: 0,
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await socialApi.isFollowingUser('target-user');

      expect(mockClient.get).toHaveBeenCalledWith(
        '/users/me/following?limit=100'
      );
      expect(result).toBe(true);
    });

    it('should return false when user is not following target user', async () => {
      const mockResponse: GetFollowedUsersResponse = {
        followedUsers: [
          {
            userId: 'other-user',
            username: 'otheruser',
            isActive: true,
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2023-01-01T00:00:00Z',
          },
        ],
        totalCount: 1,
        limit: 100,
        offset: 0,
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await socialApi.isFollowingUser('target-user');

      expect(result).toBe(false);
    });

    it('should return false on error for safety', async () => {
      mockClient.get.mockRejectedValue(new Error('Network error'));

      const result = await socialApi.isFollowingUser('target-user');

      expect(result).toBe(false);
    });
  });

  describe('getMutualFollows', () => {
    it('should return mutual follows between users', async () => {
      const currentUserFollowing: GetFollowedUsersResponse = {
        followedUsers: [
          {
            userId: 'user1',
            username: 'user1',
            isActive: true,
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2023-01-01T00:00:00Z',
          },
          {
            userId: 'user2',
            username: 'user2',
            isActive: true,
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2023-01-01T00:00:00Z',
          },
          {
            userId: 'user3',
            username: 'user3',
            isActive: true,
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2023-01-01T00:00:00Z',
          },
        ],
        totalCount: 3,
        limit: 1000,
        offset: 0,
      };

      const targetUserFollowing: GetFollowedUsersResponse = {
        followedUsers: [
          {
            userId: 'user2',
            username: 'user2',
            isActive: true,
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2023-01-01T00:00:00Z',
          },
          {
            userId: 'user3',
            username: 'user3',
            isActive: true,
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2023-01-01T00:00:00Z',
          },
          {
            userId: 'user4',
            username: 'user4',
            isActive: true,
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2023-01-01T00:00:00Z',
          },
        ],
        totalCount: 3,
        limit: 1000,
        offset: 0,
      };

      mockClient.get
        .mockResolvedValueOnce({ data: currentUserFollowing })
        .mockResolvedValueOnce({ data: targetUserFollowing });

      const result = await socialApi.getMutualFollows('target-user');

      expect(mockClient.get).toHaveBeenCalledTimes(2);
      expect(mockClient.get).toHaveBeenCalledWith(
        '/users/me/following?limit=1000'
      );
      expect(mockClient.get).toHaveBeenCalledWith(
        '/users/target-user/following?limit=1000'
      );
      expect(result).toEqual(['user2', 'user3']);
    });

    it('should return empty array on error', async () => {
      mockClient.get.mockRejectedValue(new Error('Network error'));

      const result = await socialApi.getMutualFollows('target-user');

      expect(result).toEqual([]);
    });
  });

  describe('getFollowStats', () => {
    it('should return follow statistics', async () => {
      const followingResponse: GetFollowedUsersResponse = {
        followedUsers: [],
        totalCount: 15,
        limit: 0,
        offset: 0,
      };

      const followersResponse: GetFollowedUsersResponse = {
        followedUsers: [],
        totalCount: 8,
        limit: 0,
        offset: 0,
      };

      mockClient.get
        .mockResolvedValueOnce({ data: followingResponse })
        .mockResolvedValueOnce({ data: followersResponse });

      const result = await socialApi.getFollowStats('user123');

      expect(mockClient.get).toHaveBeenCalledTimes(2);
      expect(mockClient.get).toHaveBeenCalledWith(
        '/users/user123/following?count_only=true'
      );
      expect(mockClient.get).toHaveBeenCalledWith(
        '/users/user123/followers?count_only=true'
      );
      expect(result).toEqual({
        followingCount: 15,
        followersCount: 8,
      });
    });

    it('should return zero counts on error', async () => {
      mockClient.get.mockRejectedValue(new Error('User not found'));

      const result = await socialApi.getFollowStats('user123');

      expect(result).toEqual({
        followingCount: 0,
        followersCount: 0,
      });
    });
  });
});
