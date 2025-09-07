import type { PaginatedResponse, ProfileVisibility, Theme } from './common';

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

export type UserSearchResponse = PaginatedResponse<UserSearchResult>;

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

// User Preferences Types
export interface NotificationPreferences {
  email_notifications?: boolean;
  push_notifications?: boolean;
  follow_notifications?: boolean;
  like_notifications?: boolean;
  comment_notifications?: boolean;
  recipe_notifications?: boolean;
  system_notifications?: boolean;
}

export interface PrivacyPreferences {
  profile_visibility?: ProfileVisibility;
  show_email?: boolean;
  show_full_name?: boolean;
  allow_follows?: boolean;
  allow_messages?: boolean;
}

export interface DisplayPreferences {
  theme?: Theme;
  language?: string;
  timezone?: string;
}

export interface UserPreferences {
  notification_preferences?: NotificationPreferences;
  privacy_preferences?: PrivacyPreferences;
  display_preferences?: DisplayPreferences;
}

export interface UserPreferenceResponse {
  preferences?: UserPreferences;
}

export interface UpdateUserPreferenceRequest {
  notification_preferences?: NotificationPreferences;
  privacy_preferences?: PrivacyPreferences;
  display_preferences?: DisplayPreferences;
}
