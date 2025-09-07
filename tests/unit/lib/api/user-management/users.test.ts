import { usersApi } from '@/lib/api/user-management/users';
import { userManagementClient } from '@/lib/api/user-management/client';
import type {
  UserProfileResponse,
  UserProfileUpdateRequest,
  UserAccountDeleteRequestResponse,
  UserConfirmAccountDeleteResponse,
  UserSearchResponse,
  UserSearchResult,
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

describe('Users API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserProfile', () => {
    it('should get user profile successfully', async () => {
      const mockProfile: UserProfileResponse = {
        userId: '123',
        username: 'testuser',
        email: 'test@example.com',
        fullName: 'Test User',
        bio: 'Test bio',
        isActive: true,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      mockClient.get.mockResolvedValue({ data: mockProfile });

      const result = await usersApi.getUserProfile('123');

      expect(mockClient.get).toHaveBeenCalledWith('/users/123/profile');
      expect(result).toEqual(mockProfile);
    });

    it('should handle get user profile error', async () => {
      mockClient.get.mockRejectedValue(new Error('User not found'));

      await expect(usersApi.getUserProfile('123')).rejects.toThrow();
    });
  });

  describe('updateProfile', () => {
    it('should update user profile successfully', async () => {
      const updateRequest: UserProfileUpdateRequest = {
        fullName: 'Updated Name',
        bio: 'Updated bio',
      };

      const mockResponse: UserProfileResponse = {
        userId: '123',
        username: 'testuser',
        fullName: 'Updated Name',
        bio: 'Updated bio',
        isActive: true,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-02T00:00:00Z',
      };

      mockClient.put.mockResolvedValue({ data: mockResponse });

      const result = await usersApi.updateProfile(updateRequest);

      expect(mockClient.put).toHaveBeenCalledWith(
        '/users/profile',
        updateRequest
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle update profile validation error', async () => {
      const updateRequest: UserProfileUpdateRequest = {
        username: 'invalid@username',
      };

      mockClient.put.mockRejectedValue(new Error('Invalid username format'));

      await expect(usersApi.updateProfile(updateRequest)).rejects.toThrow(
        'Invalid username format'
      );
    });
  });

  describe('requestAccountDeletion', () => {
    it('should request account deletion successfully', async () => {
      const mockResponse: UserAccountDeleteRequestResponse = {
        userId: '123',
        confirmationToken: 'test-token-123',
        expiresAt: '2023-01-02T00:00:00Z',
      };

      mockClient.post.mockResolvedValue({ data: mockResponse });

      const result = await usersApi.requestAccountDeletion();

      expect(mockClient.post).toHaveBeenCalledWith(
        '/users/account/delete-request'
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle request deletion error', async () => {
      mockClient.post.mockRejectedValue(
        new Error('Account deletion not allowed')
      );

      await expect(usersApi.requestAccountDeletion()).rejects.toThrow();
    });
  });

  describe('confirmAccountDeletion', () => {
    it('should confirm account deletion successfully', async () => {
      const deleteRequest = {
        confirmationToken: 'test-token-123',
      };

      const mockResponse: UserConfirmAccountDeleteResponse = {
        userId: '123',
        deactivatedAt: '2023-01-01T00:00:00Z',
      };

      mockClient.delete.mockResolvedValue({ data: mockResponse });

      const result = await usersApi.confirmAccountDeletion(deleteRequest);

      expect(mockClient.delete).toHaveBeenCalledWith('/users/account', {
        data: deleteRequest,
      });
      expect(result).toEqual(mockResponse);
    });

    it('should handle invalid confirmation token', async () => {
      const deleteRequest = {
        confirmationToken: 'invalid-token',
      };

      mockClient.delete.mockRejectedValue(
        new Error('Invalid or expired token')
      );

      await expect(
        usersApi.confirmAccountDeletion(deleteRequest)
      ).rejects.toThrow();
    });
  });

  describe('searchUsers', () => {
    it('should search users with query parameters', async () => {
      const mockResponse: UserSearchResponse = {
        users: [
          {
            userId: '123',
            username: 'testuser',
            fullName: 'Test User',
            isActive: true,
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2023-01-01T00:00:00Z',
          },
        ],
        totalCount: 1,
        limit: 10,
        offset: 0,
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await usersApi.searchUsers({
        q: 'test',
        limit: 10,
        offset: 0,
      });

      expect(mockClient.get).toHaveBeenCalledWith(
        '/users/search?q=test&limit=10&offset=0'
      );
      expect(result).toEqual(mockResponse);
    });

    it('should search users without parameters', async () => {
      const mockResponse: UserSearchResponse = {
        users: [],
        totalCount: 0,
        limit: 20,
        offset: 0,
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await usersApi.searchUsers({});

      expect(mockClient.get).toHaveBeenCalledWith('/users/search');
      expect(result).toEqual(mockResponse);
    });

    it('should handle search with count_only parameter', async () => {
      const mockResponse: UserSearchResponse = {
        users: [],
        totalCount: 50,
        limit: 0,
        offset: 0,
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await usersApi.searchUsers({ count_only: true });

      expect(mockClient.get).toHaveBeenCalledWith(
        '/users/search?count_only=true'
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getUser', () => {
    it('should get basic user info successfully', async () => {
      const mockUser: UserSearchResult = {
        userId: '123',
        username: 'testuser',
        fullName: 'Test User',
        isActive: true,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      mockClient.get.mockResolvedValue({ data: mockUser });

      const result = await usersApi.getUser('123');

      expect(mockClient.get).toHaveBeenCalledWith('/users/123');
      expect(result).toEqual(mockUser);
    });

    it('should handle user not found', async () => {
      mockClient.get.mockRejectedValue(new Error('User not found'));

      await expect(usersApi.getUser('nonexistent')).rejects.toThrow();
    });
  });

  describe('getCurrentUserProfile', () => {
    it('should get current user profile using me identifier', async () => {
      const mockProfile: UserProfileResponse = {
        userId: 'current',
        username: 'currentuser',
        email: 'current@example.com',
        isActive: true,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      mockClient.get.mockResolvedValue({ data: mockProfile });

      const result = await usersApi.getCurrentUserProfile();

      expect(mockClient.get).toHaveBeenCalledWith('/users/me/profile');
      expect(result).toEqual(mockProfile);
    });
  });

  describe('getUsersBatch', () => {
    it('should get multiple users successfully', async () => {
      const mockUsers: UserSearchResult[] = [
        {
          userId: '123',
          username: 'user1',
          isActive: true,
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z',
        },
        {
          userId: '456',
          username: 'user2',
          isActive: true,
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z',
        },
      ];

      mockClient.get
        .mockResolvedValueOnce({ data: mockUsers[0] })
        .mockResolvedValueOnce({ data: mockUsers[1] });

      const result = await usersApi.getUsersBatch(['123', '456']);

      expect(mockClient.get).toHaveBeenCalledTimes(2);
      expect(mockClient.get).toHaveBeenCalledWith('/users/123');
      expect(mockClient.get).toHaveBeenCalledWith('/users/456');
      expect(result).toEqual(mockUsers);
    });

    it('should handle partial failures in batch request', async () => {
      const mockUser: UserSearchResult = {
        userId: '123',
        username: 'user1',
        isActive: true,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      mockClient.get
        .mockResolvedValueOnce({ data: mockUser })
        .mockRejectedValueOnce(new Error('User not found'));

      const result = await usersApi.getUsersBatch(['123', '456']);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(mockUser);
    });
  });

  describe('isUsernameAvailable', () => {
    it('should return true when username is available', async () => {
      const mockResponse: UserSearchResponse = {
        users: [],
        totalCount: 0,
        limit: 1,
        offset: 0,
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await usersApi.isUsernameAvailable('newuser');

      expect(result).toBe(true);
      expect(mockClient.get).toHaveBeenCalledWith(
        '/users/search?q=newuser&limit=1&count_only=true'
      );
    });

    it('should return false when username is taken', async () => {
      const mockResponse: UserSearchResponse = {
        users: [],
        totalCount: 1,
        limit: 1,
        offset: 0,
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await usersApi.isUsernameAvailable('existinguser');

      expect(result).toBe(false);
    });

    it('should return false on search error for safety', async () => {
      mockClient.get.mockRejectedValue(new Error('Search failed'));

      const result = await usersApi.isUsernameAvailable('erroruser');

      expect(result).toBe(false);
    });
  });

  describe('getUserWithFallback', () => {
    it('should return full profile when accessible', async () => {
      const mockProfile: UserProfileResponse = {
        userId: '123',
        username: 'testuser',
        email: 'test@example.com',
        fullName: 'Test User',
        isActive: true,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      mockClient.get.mockResolvedValue({ data: mockProfile });

      const result = await usersApi.getUserWithFallback('123');

      expect(mockClient.get).toHaveBeenCalledWith('/users/123/profile');
      expect(result).toEqual(mockProfile);
    });

    it('should fallback to basic info when profile access denied', async () => {
      const mockUser: UserSearchResult = {
        userId: '123',
        username: 'privateuser',
        isActive: true,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      const profileError = new Error('Access denied') as Error & {
        status: number;
      };
      profileError.status = 403;

      mockClient.get
        .mockRejectedValueOnce(profileError)
        .mockResolvedValueOnce({ data: mockUser });

      const result = await usersApi.getUserWithFallback('123');

      expect(mockClient.get).toHaveBeenCalledTimes(2);
      expect(mockClient.get).toHaveBeenCalledWith('/users/123/profile');
      expect(mockClient.get).toHaveBeenCalledWith('/users/123');
      expect(result).toEqual(mockUser);
    });

    it('should throw non-403 errors', async () => {
      const notFoundError = new Error('Not found') as Error & {
        status: number;
      };
      notFoundError.status = 404;

      mockClient.get.mockRejectedValue(notFoundError);

      await expect(usersApi.getUserWithFallback('123')).rejects.toThrow(
        'Not found'
      );
    });
  });
});
