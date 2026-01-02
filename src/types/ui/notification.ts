/**
 * UI-specific types for notification components
 *
 * These types are for UI state and display logic, not API data.
 * API notification types are in @/types/notification.
 */

/**
 * Notification filter options for the panel
 */
export type NotificationFilter = 'all' | 'social' | 'activity' | 'system';

/**
 * Notification type for color coding and styling
 */
export type NotificationDisplayType =
  | 'social'
  | 'activity'
  | 'system'
  | 'default';

/**
 * Notification panel position (for future use)
 */
export type NotificationPanelPosition =
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left';

/**
 * Notification item variant for different states
 */
export type NotificationItemVariant = 'default' | 'unread' | 'read';

/**
 * Props for notification action buttons
 */
export interface NotificationAction {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
}

/**
 * UI state for notification panel
 */
export interface NotificationPanelState {
  isPanelOpen: boolean;
  filter: NotificationFilter;
  lastCheckTime: Date | null;
}

/**
 * Utility type to map API notification type to display type
 */
export type NotificationTypeMapping = {
  [key: string]: NotificationDisplayType;
};

/**
 * Default mapping of notification categories to display types
 * Based on NotificationCategory enum from notification service OpenAPI spec
 */
export const DEFAULT_TYPE_MAPPING: NotificationTypeMapping = {
  // Social categories
  new_follower: 'social',
  mention: 'social',
  recipe_shared: 'social',
  recipe_collected: 'social',
  collection_invite: 'social',

  // Activity categories (recipe engagement)
  recipe_published: 'activity',
  recipe_liked: 'activity',
  recipe_commented: 'activity',
  recipe_rated: 'activity',
  recipe_featured: 'activity',
  recipe_trending: 'activity',

  // System categories
  welcome: 'system',
  password_reset: 'system', // pragma: allowlist secret
  password_changed: 'system', // pragma: allowlist secret
  email_changed: 'system',
  maintenance: 'system',
  system_alert: 'system',

  // Default fallback
  default: 'default',
};
