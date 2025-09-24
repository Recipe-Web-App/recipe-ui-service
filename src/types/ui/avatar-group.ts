import type { ReactNode } from 'react';
import type { VariantProps } from 'class-variance-authority';
import type { avatarGroupVariants } from '@/lib/ui/avatar-group';

/**
 * User data interface for avatar group items
 */
export interface AvatarGroupUser {
  id: string;
  name: string;
  avatar?: string;
  role?: 'user' | 'chef' | 'admin' | 'guest';
  verified?: boolean;
  status?: 'online' | 'offline' | 'away' | 'busy';
}

/**
 * Layout modes for avatar group display
 */
export type AvatarGroupLayout = 'stacked' | 'grid' | 'inline';

/**
 * Avatar group base props
 */
export interface AvatarGroupBaseProps
  extends VariantProps<typeof avatarGroupVariants> {
  /**
   * Array of users to display
   */
  users: AvatarGroupUser[];

  /**
   * Maximum number of avatars to display before showing overflow
   */
  max?: number;

  /**
   * Layout mode for displaying avatars
   */
  layout?: AvatarGroupLayout;

  /**
   * Show tooltip on hover with user information
   */
  showTooltip?: boolean;

  /**
   * Custom render function for overflow indicator
   */
  renderOverflow?: (count: number) => ReactNode;

  /**
   * Click handler for individual avatars
   */
  onUserClick?: (user: AvatarGroupUser) => void;

  /**
   * Click handler for overflow indicator
   */
  onOverflowClick?: () => void;

  /**
   * Show user status indicators
   */
  showStatus?: boolean;

  /**
   * Custom spacing between avatars (in pixels or rem)
   */
  spacing?: number | string;

  /**
   * Animation on hover
   */
  animated?: boolean;

  /**
   * Custom className for the container
   */
  className?: string;

  /**
   * Accessibility label for the group
   */
  'aria-label'?: string;
}

/**
 * Props for avatar group component
 */
export interface AvatarGroupProps
  extends AvatarGroupBaseProps,
    Omit<React.HTMLAttributes<HTMLDivElement>, keyof AvatarGroupBaseProps> {}

/**
 * Props for overflow indicator component
 */
export interface AvatarGroupOverflowProps {
  count: number;
  size?: VariantProps<typeof avatarGroupVariants>['size'];
  onClick?: () => void;
  className?: string;
}

/**
 * Context data for recipe/meal plan sharing
 */
export interface AvatarGroupContext {
  type: 'recipe' | 'meal-plan' | 'collection';
  title?: string;
  totalCollaborators?: number;
  isPublic?: boolean;
}

/**
 * Extended props with context information
 */
export interface AvatarGroupWithContextProps extends AvatarGroupProps {
  context?: AvatarGroupContext;
}
