import * as React from 'react';
import { type VariantProps } from 'class-variance-authority';
import { fabVariants } from '@/lib/ui/floating-action-button-variants';

/**
 * Base FAB props interface
 */
export interface FloatingActionButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof fabVariants> {
  /**
   * Icon element to display in the FAB
   */
  icon?: React.ReactNode;

  /**
   * Extended FAB with text label
   */
  label?: string;

  /**
   * Position of the FAB on the screen
   */
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';

  /**
   * Whether the FAB is extended (shows label)
   */
  extended?: boolean;

  /**
   * Loading state for the FAB
   */
  loading?: boolean;

  /**
   * Whether to render the FAB in a portal
   */
  usePortal?: boolean;

  /**
   * Custom z-index for the FAB
   */
  zIndex?: number;

  /**
   * Offset from the edge of the screen in pixels
   */
  offset?: number;

  /**
   * Whether to show a tooltip on hover
   */
  tooltipLabel?: string;

  /**
   * Custom aria-label for accessibility
   */
  ariaLabel?: string;
}

/**
 * Speed Dial action item interface
 */
export interface SpeedDialAction {
  /**
   * Unique identifier for the action
   */
  id: string;

  /**
   * Icon to display for this action
   */
  icon: React.ReactNode;

  /**
   * Label for the action
   */
  label: string;

  /**
   * Click handler for the action
   */
  onClick: () => void;

  /**
   * Whether this action is disabled
   */
  disabled?: boolean;

  /**
   * Custom aria-label for this action
   */
  ariaLabel?: string;
}

/**
 * Speed Dial FAB props interface
 */
export interface SpeedDialProps extends Omit<
  FloatingActionButtonProps,
  'onClick'
> {
  /**
   * Actions to display when the speed dial is open
   */
  actions: SpeedDialAction[];

  /**
   * Whether the speed dial is open
   */
  open?: boolean;

  /**
   * Controlled open state handler
   */
  onOpenChange?: (open: boolean) => void;

  /**
   * Direction to expand the speed dial
   */
  direction?: 'up' | 'down' | 'left' | 'right';

  /**
   * Whether to show labels for actions
   */
  showLabels?: boolean;

  /**
   * Backdrop click behavior
   */
  onBackdropClick?: () => void;

  /**
   * Whether to show backdrop when open
   */
  showBackdrop?: boolean;
}

/**
 * FAB Group container props for multiple FABs
 */
export interface FABGroupProps {
  /**
   * FAB components to group
   */
  children: React.ReactNode;

  /**
   * Position of the FAB group
   */
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';

  /**
   * Direction to stack FABs
   */
  direction?: 'vertical' | 'horizontal';

  /**
   * Spacing between FABs
   */
  spacing?: number;

  /**
   * Offset from the edge
   */
  offset?: number;
}
