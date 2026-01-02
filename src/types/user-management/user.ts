import type { PaginatedResponse } from './common';

// Core User Types
export interface User {
  userId: string;
  username: string;
  email?: string | null;
  fullName?: string | null;
  bio?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserSearchResult {
  userId: string;
  username: string;
  fullName?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfileResponse {
  userId: string;
  username: string;
  email?: string | null;
  fullName?: string | null;
  bio?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Profile Management Types
export interface UserProfileUpdateRequest {
  username?: string | null;
  email?: string | null;
  fullName?: string | null;
  bio?: string | null;
}

export type UserSearchResponse = PaginatedResponse<UserSearchResult, 'results'>;

// Account Deletion Types
export interface UserAccountDeleteRequest {
  confirmationToken: string;
}

export interface UserAccountDeleteRequestResponse {
  userId: string;
  confirmationToken: string;
  expiresAt: string;
}

export interface UserConfirmAccountDeleteResponse {
  userId: string;
  deactivatedAt: string;
}
