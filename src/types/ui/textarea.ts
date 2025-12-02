import * as React from 'react';
import { type VariantProps } from 'class-variance-authority';
import {
  textareaVariants,
  recipeTextareaVariants,
} from '@/lib/ui/textarea-variants';

/**
 * Base textarea component props interface
 */
export interface TextareaProps
  extends
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  successMessage?: string;
  warningMessage?: string;
  required?: boolean;
  maxLength?: number;
  showCharacterCount?: boolean;
  autoResize?: boolean;
}

/**
 * Recipe textarea component props interface
 */
export interface RecipeTextareaProps
  extends
    Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'>,
    VariantProps<typeof recipeTextareaVariants> {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  successMessage?: string;
  required?: boolean;
  maxLength?: number;
  showCharacterCount?: boolean;
  autoResize?: boolean;
  minWords?: number;
  maxWords?: number;
  showWordCount?: boolean;
}

/**
 * Auto-expanding textarea component props interface
 */
export interface AutoTextareaProps extends TextareaProps {
  minRows?: number;
  maxRows?: number;
}
