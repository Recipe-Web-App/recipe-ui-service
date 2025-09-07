import type { User } from './user';

// Social Relationship Types
export interface FollowResponse {
  message: string;
  isFollowing: boolean;
}

export interface GetFollowedUsersResponse {
  totalCount: number;
  followedUsers?: User[] | null;
  limit?: number | null;
  offset?: number | null;
}

// User Activity Types
export interface RecipeSummary {
  recipeId: number;
  title: string;
  createdAt: string;
}

export interface UserSummary {
  userId: string;
  username: string;
  followedAt: string;
}

export interface ReviewSummary {
  reviewId: number;
  recipeId: number;
  rating: number;
  comment?: string | null;
  createdAt: string;
}

export interface FavoriteSummary {
  recipeId: number;
  title: string;
  favoritedAt: string;
}

export interface UserActivityResponse {
  userId: string;
  recentRecipes: RecipeSummary[];
  recentFollows: UserSummary[];
  recentReviews: ReviewSummary[];
  recentFavorites: FavoriteSummary[];
}

// Query Parameters
export interface UserActivityParams {
  per_type_limit?: number;
}

// Re-export related common types
export type { User } from './user';
