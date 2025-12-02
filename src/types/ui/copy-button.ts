import * as React from 'react';
import { type VariantProps } from 'class-variance-authority';
import { copyButtonVariants } from '@/lib/ui/copy-button-variants';
import type { IconName } from './icon';

/**
 * Copy operation result status
 */
export type CopyStatus = 'idle' | 'copying' | 'success' | 'error';

/**
 * Copy content types for recipe-specific functionality
 */
export type CopyContentType =
  | 'text'
  | 'url'
  | 'recipe-url'
  | 'ingredients'
  | 'instructions'
  | 'nutrition'
  | 'formatted-recipe';

/**
 * Recipe-specific copy data structure
 */
export interface RecipeCopyData {
  type: CopyContentType;
  title?: string;
  content: string;
  metadata?: {
    servings?: number;
    prepTime?: string;
    cookTime?: string;
    difficulty?: string;
    tags?: string[];
  };
}

/**
 * Copy operation callbacks
 */
export interface CopyCallbacks {
  onCopyStart?: () => void;
  onCopySuccess?: (content: string) => void;
  onCopyError?: (error: Error) => void;
  onStatusChange?: (status: CopyStatus) => void;
}

/**
 * Accessibility options for copy functionality
 */
export interface CopyAccessibility {
  copyLabel?: string;
  copyingLabel?: string;
  successLabel?: string;
  errorLabel?: string;
  announceToScreenReader?: boolean;
  keyboardShortcut?: string;
}

/**
 * Copy button animation options
 */
export interface CopyAnimationOptions {
  duration?: number;
  showFeedback?: boolean;
  feedbackDuration?: number;
  iconTransition?: boolean;
  successAnimation?: 'none' | 'bounce' | 'scale' | 'pulse';
  errorAnimation?: 'none' | 'shake' | 'pulse';
}

/**
 * Advanced copy options
 */
export interface CopyOptions {
  format?: 'plain' | 'html' | 'markdown' | 'json';
  fallbackMethod?: 'execCommand' | 'textarea' | 'none';
  showTooltip?: boolean;
  tooltipContent?: string;
  preventMultipleCopies?: boolean;
  resetDelay?: number;
  maxLength?: number;
  transformContent?: (content: string) => string;
}

/**
 * Base CopyButton component props
 */
export interface CopyButtonProps
  extends
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'content'>,
    Omit<VariantProps<typeof copyButtonVariants>, 'animation'>,
    CopyCallbacks,
    CopyAccessibility,
    CopyOptions {
  /**
   * Content to copy to clipboard
   */
  content: string | (() => string) | (() => Promise<string>);

  /**
   * Recipe-specific copy data (optional)
   */
  recipeData?: RecipeCopyData;

  /**
   * Display text for the button
   */
  children?: React.ReactNode;

  /**
   * Icon to display (defaults to 'copy')
   */
  icon?: IconName;

  /**
   * Success icon (defaults to 'check')
   */
  successIcon?: IconName;

  /**
   * Error icon (defaults to 'alert-circle')
   */
  errorIcon?: IconName;

  /**
   * Whether to show icon only (no text)
   */
  iconOnly?: boolean;

  /**
   * Custom success message
   */
  successMessage?: string;

  /**
   * Custom error message
   */
  errorMessage?: string;

  /**
   * Animation configuration
   */
  animation?: CopyAnimationOptions;

  /**
   * Polymorphic component support
   */
  asChild?: boolean;

  /**
   * Loading state
   */
  loading?: boolean;

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Copy button state for internal use
 */
export interface CopyButtonState {
  status: CopyStatus;
  lastCopyTime: number | null;
  error: Error | null;
  showFeedback: boolean;
}

/**
 * Copy result returned by copy operations
 */
export interface CopyResult {
  success: boolean;
  content?: string;
  error?: Error;
  method?: 'clipboard' | 'execCommand' | 'fallback';
  timestamp: number;
}

/**
 * Browser clipboard API support detection
 */
export interface ClipboardSupport {
  modern: boolean; // navigator.clipboard available
  legacy: boolean; // document.execCommand available
  writeText: boolean;
  readText: boolean;
  writeHtml: boolean;
}

/**
 * Copy context for advanced use cases
 */
export interface CopyContext {
  support: ClipboardSupport;
  lastResult: CopyResult | null;
  isSecureContext: boolean;
  userAgent: string;
}

/**
 * Hook return type for useCopyButton
 */
export interface UseCopyButtonReturn {
  copyToClipboard: (content?: string) => Promise<CopyResult>;
  status: CopyStatus;
  error: Error | null;
  isSupported: boolean;
  context: CopyContext;
  resetStatus: () => void;
}

/**
 * Recipe-specific copy button variants
 */
export interface RecipeCopyButtonProps extends Omit<
  CopyButtonProps,
  'content' | 'recipeData' | 'recipe'
> {
  recipe: {
    id: string;
    title: string;
    url?: string;
    ingredients?: Array<{
      name: string;
      amount?: string;
      unit?: string;
    }>;
    instructions?: Array<{
      step: number;
      instruction: string;
    }>;
    nutrition?: Record<string, string | number>;
    metadata?: {
      servings?: number;
      prepTime?: string;
      cookTime?: string;
      difficulty?: string;
      tags?: string[];
    };
  };
  copyType: CopyContentType;
}

/**
 * Compound component props for CopyButton.Group
 */
export interface CopyButtonGroupProps {
  children: React.ReactNode;
  spacing?: 'none' | 'sm' | 'default' | 'lg';
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

/**
 * Export all types for external use
 */
export type {
  CopyStatus as CopyButtonStatus,
  CopyContentType as CopyButtonContentType,
  RecipeCopyData as CopyButtonRecipeData,
  CopyCallbacks as CopyButtonCallbacks,
  CopyAccessibility as CopyButtonAccessibility,
  CopyAnimationOptions as CopyButtonAnimationOptions,
  CopyOptions as CopyButtonOptions,
  CopyButtonState as CopyButtonInternalState,
  CopyResult as CopyButtonResult,
  ClipboardSupport as CopyButtonClipboardSupport,
  CopyContext as CopyButtonContext,
  UseCopyButtonReturn as CopyButtonHookReturn,
};
