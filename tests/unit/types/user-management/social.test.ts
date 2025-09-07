import type {
  FollowResponse,
  GetFollowedUsersResponse,
  RecipeSummary,
  UserSummary,
  ReviewSummary,
  FavoriteSummary,
  UserActivityResponse,
  UserActivityParams,
} from '@/types/user-management/social';

describe('User Management Social Types', () => {
  describe('FollowResponse', () => {
    it('should have message and isFollowing properties', () => {
      const followResponse: FollowResponse = {
        message: 'Successfully followed user',
        isFollowing: true,
      };

      expect(typeof followResponse.message).toBe('string');
      expect(typeof followResponse.isFollowing).toBe('boolean');
    });

    it('should handle unfollow response', () => {
      const unfollowResponse: FollowResponse = {
        message: 'Successfully unfollowed user',
        isFollowing: false,
      };

      expect(unfollowResponse.isFollowing).toBe(false);
    });
  });

  describe('GetFollowedUsersResponse', () => {
    it('should have totalCount as required field', () => {
      const response: GetFollowedUsersResponse = {
        totalCount: 42,
      };

      expect(typeof response.totalCount).toBe('number');
      expect(response.followedUsers).toBeUndefined();
      expect(response.limit).toBeUndefined();
      expect(response.offset).toBeUndefined();
    });

    it('should handle full response with user list', () => {
      const response: GetFollowedUsersResponse = {
        totalCount: 2,
        followedUsers: [
          {
            userId: '123e4567-e89b-12d3-a456-426614174000',
            username: 'user1',
            isActive: true,
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2023-01-01T00:00:00Z',
          },
          {
            userId: '223e4567-e89b-12d3-a456-426614174000',
            username: 'user2',
            isActive: true,
            createdAt: '2023-01-02T00:00:00Z',
            updatedAt: '2023-01-02T00:00:00Z',
          },
        ],
        limit: 20,
        offset: 0,
      };

      expect(response.totalCount).toBe(2);
      expect(Array.isArray(response.followedUsers)).toBe(true);
      expect(response.followedUsers).toHaveLength(2);
      expect(typeof response.limit).toBe('number');
      expect(typeof response.offset).toBe('number');
    });

    it('should handle null followedUsers for count-only requests', () => {
      const response: GetFollowedUsersResponse = {
        totalCount: 100,
        followedUsers: null,
        limit: null,
        offset: null,
      };

      expect(response.totalCount).toBe(100);
      expect(response.followedUsers).toBeNull();
      expect(response.limit).toBeNull();
      expect(response.offset).toBeNull();
    });
  });

  describe('RecipeSummary', () => {
    it('should have required properties', () => {
      const recipe: RecipeSummary = {
        recipeId: 12345,
        title: 'Chocolate Chip Cookies',
        createdAt: '2023-01-01T10:00:00Z',
      };

      expect(typeof recipe.recipeId).toBe('number');
      expect(typeof recipe.title).toBe('string');
      expect(typeof recipe.createdAt).toBe('string');
    });
  });

  describe('UserSummary', () => {
    it('should have required properties', () => {
      const userSummary: UserSummary = {
        userId: '123e4567-e89b-12d3-a456-426614174000',
        username: 'chefmaster',
        followedAt: '2023-01-01T12:00:00Z',
      };

      expect(typeof userSummary.userId).toBe('string');
      expect(typeof userSummary.username).toBe('string');
      expect(typeof userSummary.followedAt).toBe('string');
    });
  });

  describe('ReviewSummary', () => {
    it('should have required properties', () => {
      const review: ReviewSummary = {
        reviewId: 67890,
        recipeId: 12345,
        rating: 4.5,
        createdAt: '2023-01-01T15:00:00Z',
      };

      expect(typeof review.reviewId).toBe('number');
      expect(typeof review.recipeId).toBe('number');
      expect(typeof review.rating).toBe('number');
      expect(typeof review.createdAt).toBe('string');
      expect(review.comment).toBeUndefined();
    });

    it('should allow optional comment', () => {
      const reviewWithComment: ReviewSummary = {
        reviewId: 67891,
        recipeId: 12345,
        rating: 5.0,
        comment: 'Amazing recipe, loved it!',
        createdAt: '2023-01-01T15:30:00Z',
      };

      expect(typeof reviewWithComment.comment).toBe('string');
    });

    it('should allow null comment', () => {
      const reviewWithNullComment: ReviewSummary = {
        reviewId: 67892,
        recipeId: 12345,
        rating: 3.0,
        comment: null,
        createdAt: '2023-01-01T16:00:00Z',
      };

      expect(reviewWithNullComment.comment).toBeNull();
    });
  });

  describe('FavoriteSummary', () => {
    it('should have required properties', () => {
      const favorite: FavoriteSummary = {
        recipeId: 12345,
        title: 'Best Pasta Recipe',
        favoritedAt: '2023-01-01T18:00:00Z',
      };

      expect(typeof favorite.recipeId).toBe('number');
      expect(typeof favorite.title).toBe('string');
      expect(typeof favorite.favoritedAt).toBe('string');
    });
  });

  describe('UserActivityResponse', () => {
    it('should have all required activity arrays', () => {
      const activity: UserActivityResponse = {
        userId: '123e4567-e89b-12d3-a456-426614174000',
        recentRecipes: [
          {
            recipeId: 1,
            title: 'Recipe 1',
            createdAt: '2023-01-01T00:00:00Z',
          },
        ],
        recentFollows: [
          {
            userId: '223e4567-e89b-12d3-a456-426614174000',
            username: 'followeduser',
            followedAt: '2023-01-01T00:00:00Z',
          },
        ],
        recentReviews: [
          {
            reviewId: 1,
            recipeId: 1,
            rating: 5.0,
            createdAt: '2023-01-01T00:00:00Z',
          },
        ],
        recentFavorites: [
          {
            recipeId: 2,
            title: 'Favorite Recipe',
            favoritedAt: '2023-01-01T00:00:00Z',
          },
        ],
      };

      expect(typeof activity.userId).toBe('string');
      expect(Array.isArray(activity.recentRecipes)).toBe(true);
      expect(Array.isArray(activity.recentFollows)).toBe(true);
      expect(Array.isArray(activity.recentReviews)).toBe(true);
      expect(Array.isArray(activity.recentFavorites)).toBe(true);
    });

    it('should allow empty activity arrays', () => {
      const emptyActivity: UserActivityResponse = {
        userId: '123e4567-e89b-12d3-a456-426614174000',
        recentRecipes: [],
        recentFollows: [],
        recentReviews: [],
        recentFavorites: [],
      };

      expect(emptyActivity.recentRecipes).toHaveLength(0);
      expect(emptyActivity.recentFollows).toHaveLength(0);
      expect(emptyActivity.recentReviews).toHaveLength(0);
      expect(emptyActivity.recentFavorites).toHaveLength(0);
    });
  });

  describe('UserActivityParams', () => {
    it('should allow optional per_type_limit', () => {
      const params: UserActivityParams = {};
      expect(typeof params).toBe('object');
      expect(params.per_type_limit).toBeUndefined();
    });

    it('should validate per_type_limit parameter', () => {
      const params: UserActivityParams = {
        per_type_limit: 10,
      };

      expect(typeof params.per_type_limit).toBe('number');
      expect(params.per_type_limit).toBe(10);
    });
  });
});
