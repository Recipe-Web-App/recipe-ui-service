import * as React from 'react';
import { type VariantProps } from 'class-variance-authority';
import { viewToggleVariants } from '@/lib/ui/view-toggle-variants';
import { type ViewMode } from '@/stores/ui/view-preference-store';

/**
 * ViewToggle component props interface
 *
 * A toggle component for switching between grid and list views.
 * Can be used in controlled or uncontrolled mode.
 */
export interface ViewToggleProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>,
    VariantProps<typeof viewToggleVariants> {
  /**
   * Controlled value for the view mode
   * When provided, component works in controlled mode
   */
  value?: ViewMode;

  /**
   * Default value for uncontrolled mode
   * Only used when value prop is not provided
   */
  defaultValue?: ViewMode;

  /**
   * Callback fired when the view mode changes
   * @param value - The new view mode ('grid' | 'list')
   */
  onValueChange?: (value: ViewMode) => void;

  /**
   * Whether the toggle is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Accessible label for the toggle group
   * @default "Switch view mode"
   */
  'aria-label'?: string;

  /**
   * Additional CSS classes for the container
   */
  className?: string;
}

/**
 * Props for individual toggle buttons
 */
export interface ViewToggleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Whether this button is active */
  active?: boolean;
  /** Button size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Visual style variant */
  variant?: 'default' | 'outline' | 'ghost';
}

/**
 * Re-export ViewMode type for convenience
 */
export type { ViewMode };
