import * as React from 'react';
import { type VariantProps } from 'class-variance-authority';
import { inputVariants } from '@/lib/ui/input-variants';

/**
 * Base Input component props interface
 */
export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  // Input styling
  variant?: 'default' | 'filled' | 'outlined';
  size?: 'sm' | 'default' | 'lg';
  state?: 'default' | 'error' | 'success' | 'warning';

  // Label and text
  label?: string;
  helperText?: string;
  errorText?: string;

  // Icons and interactions
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  clearable?: boolean;
  onClear?: () => void;

  // Advanced features
  loading?: boolean;
  floatingLabel?: boolean;
  showCharacterCount?: boolean;
  characterLimit?: number;

  // Container props
  containerClassName?: string;
  labelClassName?: string;
  helperClassName?: string;
}
