import * as React from 'react';
import { type VariantProps } from 'class-variance-authority';
import { quantityInputVariants } from '@/lib/ui/quantity-input-variants';
import { type SmartStepConfig } from '@/lib/utils/smart-step';

/**
 * QuantityInput component props interface
 *
 * A specialized numeric input with +/- buttons and smart stepping support.
 */
export interface QuantityInputProps
  extends
    Omit<
      React.InputHTMLAttributes<HTMLInputElement>,
      'size' | 'type' | 'onChange' | 'value'
    >,
    VariantProps<typeof quantityInputVariants> {
  /** Current value (number or empty string for unset) */
  value?: number | '';

  /** Value change handler - receives the numeric value directly */
  onChange?: (value: number | '') => void;

  /** Minimum allowed value (default: 0.01) */
  min?: number;

  /** Maximum allowed value (default: 10000) */
  max?: number;

  /** Enable smart stepping based on value (default: true) */
  smartStep?: boolean;

  /** Custom smart step configuration (overrides defaults when smartStep is true) */
  stepConfig?: SmartStepConfig;

  /** Fixed step value (only used when smartStep is false) */
  step?: number;

  /** Number of decimal places for rounding (default: 2) */
  precision?: number;

  /** Default value to use when input is empty and user increments (default: 1) */
  defaultValue?: number;

  /** Show +/- buttons (default: true) */
  showButtons?: boolean;

  // Styling variants
  /** Size variant */
  size?: 'sm' | 'default' | 'lg';

  /** Visual state */
  state?: 'default' | 'error' | 'success' | 'warning';

  // Label and text
  /** Label text */
  label?: string;

  /** Helper text displayed below input */
  helperText?: string;

  /** Error text (overrides helperText and sets error state) */
  errorText?: string;

  // Container props
  /** Additional className for container */
  containerClassName?: string;

  /** Additional className for label */
  labelClassName?: string;

  /** Additional className for helper text */
  helperClassName?: string;

  /** Additional className for the input field */
  inputClassName?: string;
}
