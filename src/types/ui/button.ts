import * as React from 'react';
import { type VariantProps } from 'class-variance-authority';
import { buttonVariants } from '@/lib/ui/button-variants';

/**
 * Button component props interface
 */
export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}
