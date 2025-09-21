import * as React from 'react';
import { type VariantProps } from 'class-variance-authority';
import {
  spinnerVariants,
  spinnerWrapperVariants,
} from '@/lib/ui/spinner-variants';

export interface SpinnerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'color'>,
    VariantProps<typeof spinnerVariants> {
  /**
   * If true, renders component as child element
   */
  asChild?: boolean;
  /**
   * Optional label for the spinner (for screen readers)
   */
  label?: string;
  /**
   * If true, shows spinner as a fullscreen overlay
   */
  overlay?: boolean;
  /**
   * If true, centers the spinner in its container
   */
  centered?: boolean;
  /**
   * Optional text to display alongside the spinner
   */
  text?: string;
  /**
   * Position of the text relative to the spinner
   */
  textPosition?: 'bottom' | 'right';
}

export interface SpinnerContentProps {
  variant?: SpinnerProps['variant'];
}

export type SpinnerWrapperProps = VariantProps<typeof spinnerWrapperVariants>;
