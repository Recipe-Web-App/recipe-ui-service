import * as React from 'react';
import { type VariantProps } from 'class-variance-authority';
import { type LucideIcon } from 'lucide-react';
import { quickActionsVariants } from '@/lib/ui/quick-actions-variants';

/**
 * Position of the quick actions overlay on the parent container
 */
export type QuickActionPosition =
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left';

/**
 * Variant types for individual action buttons
 */
export type QuickActionVariant = 'default' | 'destructive' | 'ghost';

/**
 * Individual quick action configuration
 */
export interface QuickAction {
  /** Unique identifier for the action */
  id: string;
  /** Lucide icon component to display */
  icon: LucideIcon;
  /** Accessible label for the action (used in tooltips and screen readers) */
  label: string;
  /** Callback function when action is clicked */
  onClick: () => void;
  /** Visual variant of the action button */
  variant?: QuickActionVariant;
  /** Whether the action is disabled */
  disabled?: boolean;
  /** Optional ARIA description for additional context */
  'aria-describedby'?: string;
}

/**
 * Quick actions variant props
 */
export interface QuickActionsVariantProps
  extends VariantProps<typeof quickActionsVariants> {
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Position of the overlay */
  position?: QuickActionPosition;
}

/**
 * Quick actions component props
 */
export interface QuickActionsProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>,
    QuickActionsVariantProps {
  // Core Configuration
  /** Array of quick action configurations */
  actions: QuickAction[];

  // Display Options
  /** Maximum number of actions to show before overflow menu (default: 3) */
  maxVisible?: number;
  /** Position of the quick actions overlay (default: 'top-right') */
  position?: QuickActionPosition;
  /** Size of the action buttons */
  size?: 'sm' | 'md' | 'lg';

  // Behavior
  /** Whether to show the overlay on hover (default: true) */
  showOnHover?: boolean;
  /** Whether to show the overlay on focus (default: true) */
  showOnFocus?: boolean;

  // Styling
  /** Additional CSS class for the container */
  className?: string;
  /** Additional CSS class for the overlay */
  overlayClassName?: string;
  /** Additional CSS class for action buttons */
  actionClassName?: string;

  // Callbacks
  /** Callback when the overflow menu is opened */
  onOverflowOpen?: () => void;
  /** Callback when the overflow menu is closed */
  onOverflowClose?: () => void;
  /** Callback when any action is clicked (before individual onClick) */
  onActionClick?: (action: QuickAction) => void;

  // Accessibility
  /** ARIA label for the quick actions container */
  'aria-label'?: string;
  /** ARIA description for the quick actions container */
  'aria-describedby'?: string;
}

/**
 * Quick action button props (internal component)
 */
export interface QuickActionButtonProps {
  /** The action configuration */
  action: QuickAction;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Additional CSS class */
  className?: string;
  /** Callback when clicked */
  onClick: (action: QuickAction) => void;
}

/**
 * Overflow menu props (internal component)
 */
export interface OverflowMenuProps {
  /** Actions to display in the overflow menu */
  actions: QuickAction[];
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Additional CSS class */
  className?: string;
  /** Callback when an action is clicked */
  onActionClick: (action: QuickAction) => void;
  /** Callback when menu opens */
  onOpenChange?: (open: boolean) => void;
}

/**
 * Helper function to split actions into visible and overflow
 */
export interface ActionSplit {
  /** Actions to display directly */
  visible: QuickAction[];
  /** Actions to display in overflow menu */
  overflow: QuickAction[];
}

/**
 * Helper function to determine grid layout based on action count
 */
export type GridLayout = '1x1' | '2x1' | '2x2' | '3x1' | '3x2';

/**
 * Helper function to split actions into visible and overflow
 *
 * @param actions - All actions to split
 * @param maxVisible - Maximum number of visible actions (default: 3)
 * @returns Object with visible and overflow action arrays
 */
export function splitActions(
  actions: QuickAction[],
  maxVisible: number = 3
): ActionSplit {
  if (actions.length <= maxVisible) {
    return { visible: actions, overflow: [] };
  }

  return {
    visible: actions.slice(0, maxVisible),
    overflow: actions.slice(maxVisible),
  };
}

/**
 * Helper function to determine grid layout based on action count
 *
 * @param count - Number of actions to display
 * @returns Grid layout string for CSS grid-template configuration
 */
export function getGridLayout(count: number): GridLayout {
  if (count === 1) return '1x1';
  if (count === 2) return '2x1';
  if (count === 3) return '3x1';
  if (count === 4) return '2x2';
  if (count === 5) return '3x2';
  return '3x2'; // Default for 6+ actions
}

/**
 * Helper function to get position classes for absolute positioning
 *
 * @param position - Position of the quick actions overlay
 * @returns Tailwind classes for positioning
 */
export function getPositionClasses(position: QuickActionPosition): string {
  switch (position) {
    case 'top-right':
      return 'top-2 right-2';
    case 'top-left':
      return 'top-2 left-2';
    case 'bottom-right':
      return 'bottom-2 right-2';
    case 'bottom-left':
      return 'bottom-2 left-2';
    default:
      return 'top-2 right-2';
  }
}

/**
 * Helper function to check if any action is disabled
 *
 * @param actions - Array of actions to check
 * @returns True if at least one action is disabled
 */
export function hasDisabledAction(actions: QuickAction[]): boolean {
  return actions.some(action => action.disabled === true);
}

/**
 * Helper function to get enabled actions
 *
 * @param actions - Array of actions to filter
 * @returns Array of enabled actions only
 */
export function getEnabledActions(actions: QuickAction[]): QuickAction[] {
  return actions.filter(action => !action.disabled);
}

/**
 * Helper function to get disabled actions
 *
 * @param actions - Array of actions to filter
 * @returns Array of disabled actions only
 */
export function getDisabledActions(actions: QuickAction[]): QuickAction[] {
  return actions.filter(action => action.disabled === true);
}
