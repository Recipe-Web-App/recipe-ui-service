import * as React from 'react';
import { type VariantProps } from 'class-variance-authority';
import {
  emptyStateVariants,
  emptyStateIconVariants,
  emptyStateTitleVariants,
  emptyStateDescriptionVariants,
  emptyStateActionsVariants,
} from '@/lib/ui/empty-state-variants';

/**
 * EmptyState component props interface
 */
export interface EmptyStateProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof emptyStateVariants> {
  asChild?: boolean;
}

/**
 * EmptyState Icon component props interface
 */
export interface EmptyStateIconProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof emptyStateIconVariants> {
  asChild?: boolean;
}

/**
 * EmptyState Title component props interface
 */
export interface EmptyStateTitleProps
  extends
    React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof emptyStateTitleVariants> {
  asChild?: boolean;
}

/**
 * EmptyState Description component props interface
 */
export interface EmptyStateDescriptionProps
  extends
    React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof emptyStateDescriptionVariants> {
  asChild?: boolean;
}

/**
 * EmptyState Actions component props interface
 */
export interface EmptyStateActionsProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof emptyStateActionsVariants> {
  asChild?: boolean;
}
