import type {
  User,
  UserSearchResult,
  UserProfileUpdateRequest,
  UserSearchResponse,
  UserAccountDeleteRequest,
  UserAccountDeleteRequestResponse,
  UserConfirmAccountDeleteResponse,
} from '@/types/user-management/user';

describe('User Management User Types', () => {
  describe('User', () => {
    it('should have all required properties', () => {
      const user: User = {
        userId: '123e4567-e89b-12d3-a456-426614174000',
        username: 'testuser',
        email: 'test@example.com',
        fullName: 'Test User',
        bio: 'A test user',
        isActive: true,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      expect(typeof user.userId).toBe('string');
      expect(typeof user.username).toBe('string');
      expect(typeof user.isActive).toBe('boolean');
      expect(typeof user.createdAt).toBe('string');
      expect(typeof user.updatedAt).toBe('string');
    });

    it('should allow null optional properties', () => {
      const user: User = {
        userId: '123e4567-e89b-12d3-a456-426614174000',
        username: 'testuser',
        email: null,
        fullName: null,
        bio: null,
        isActive: true,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      expect(user.email).toBeNull();
      expect(user.fullName).toBeNull();
      expect(user.bio).toBeNull();
    });

    it('should allow undefined optional properties', () => {
      const user: User = {
        userId: '123e4567-e89b-12d3-a456-426614174000',
        username: 'testuser',
        isActive: true,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      expect(user.email).toBeUndefined();
      expect(user.fullName).toBeUndefined();
      expect(user.bio).toBeUndefined();
    });
  });

  describe('UserSearchResult', () => {
    it('should have required properties for search results', () => {
      const searchResult: UserSearchResult = {
        userId: '123e4567-e89b-12d3-a456-426614174000',
        username: 'searchuser',
        fullName: 'Search User',
        isActive: true,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      expect(typeof searchResult.userId).toBe('string');
      expect(typeof searchResult.username).toBe('string');
      expect(typeof searchResult.isActive).toBe('boolean');
      expect(typeof searchResult.createdAt).toBe('string');
      expect(typeof searchResult.updatedAt).toBe('string');
    });
  });

  describe('UserProfileUpdateRequest', () => {
    it('should allow all optional properties', () => {
      const updateRequest: UserProfileUpdateRequest = {};
      expect(typeof updateRequest).toBe('object');
    });

    it('should allow partial updates', () => {
      const updateRequest: UserProfileUpdateRequest = {
        username: 'newusername',
        bio: 'Updated bio',
      };

      expect(updateRequest.username).toBe('newusername');
      expect(updateRequest.bio).toBe('Updated bio');
      expect(updateRequest.email).toBeUndefined();
      expect(updateRequest.fullName).toBeUndefined();
    });

    it('should allow null values', () => {
      const updateRequest: UserProfileUpdateRequest = {
        username: null,
        email: null,
        fullName: null,
        bio: null,
      };

      expect(updateRequest.username).toBeNull();
      expect(updateRequest.email).toBeNull();
      expect(updateRequest.fullName).toBeNull();
      expect(updateRequest.bio).toBeNull();
    });
  });

  describe('Account Deletion Types', () => {
    it('should validate UserAccountDeleteRequest', () => {
      const deleteRequest: UserAccountDeleteRequest = {
        confirmationToken: 'test-confirmation-token-123',
      };

      expect(typeof deleteRequest.confirmationToken).toBe('string');
    });

    it('should validate UserAccountDeleteRequestResponse', () => {
      const response: UserAccountDeleteRequestResponse = {
        userId: '123e4567-e89b-12d3-a456-426614174000',
        confirmationToken: 'test-confirmation-token-123',
        expiresAt: '2023-01-01T01:00:00Z',
      };

      expect(typeof response.userId).toBe('string');
      expect(typeof response.confirmationToken).toBe('string');
      expect(typeof response.expiresAt).toBe('string');
    });

    it('should validate UserConfirmAccountDeleteResponse', () => {
      const response: UserConfirmAccountDeleteResponse = {
        userId: '123e4567-e89b-12d3-a456-426614174000',
        deactivatedAt: '2023-01-01T00:00:00Z',
      };

      expect(typeof response.userId).toBe('string');
      expect(typeof response.deactivatedAt).toBe('string');
    });
  });

  describe('UserSearchResponse', () => {
    it('should extend PaginatedResponse structure', () => {
      const searchResponse: UserSearchResponse = {
        results: [
          {
            userId: '123e4567-e89b-12d3-a456-426614174000',
            username: 'user1',
            isActive: true,
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2023-01-01T00:00:00Z',
          },
        ],
        totalCount: 1,
        limit: 20,
        offset: 0,
      };

      expect(Array.isArray(searchResponse.results)).toBe(true);
      expect(typeof searchResponse.totalCount).toBe('number');
      expect(typeof searchResponse.limit).toBe('number');
      expect(typeof searchResponse.offset).toBe('number');
      expect(searchResponse.results![0]).toHaveProperty('userId');
      expect(searchResponse.results![0]).toHaveProperty('username');
    });
  });
});
