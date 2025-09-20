import * as React from 'react';
import { type VariantProps } from 'class-variance-authority';
import { badgeVariants } from '@/lib/ui/badge-variants';

/**
 * Badge component props interface
 */
export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  asChild?: boolean;
}
