import { type VariantProps } from 'class-variance-authority';
import { type ratingVariants } from '@/lib/ui/rating-variants';

export type RatingType = 'star' | 'heart' | 'thumbs' | 'numeric';

export type RatingPrecision = 'full' | 'half';

export interface RatingProps extends VariantProps<typeof ratingVariants> {
  value?: number;
  maxValue?: number;
  precision?: RatingPrecision;
  interactive?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  showTooltip?: boolean;
  showValue?: boolean;
  showLabel?: boolean;
  label?: string;
  className?: string;
  onChange?: (value: number) => void;
  onHover?: (value: number | null) => void;
  'aria-label'?: string;
  'aria-describedby'?: string;
  id?: string;
  name?: string;
}

export interface RatingItemProps {
  index: number;
  filled: boolean;
  halfFilled?: boolean;
  interactive: boolean;
  disabled: boolean;
  size: 'sm' | 'md' | 'lg';
  type: RatingType;
  variant: 'default' | 'accent' | 'warning' | 'success';
  onRate?: (value: number) => void;
  onHover?: (value: number | null) => void;
  'aria-label'?: string;
}

export interface RatingTheme {
  filled: string;
  unfilled: string;
  hover: string;
  disabled: string;
}

export interface RatingDisplayConfig {
  icon: {
    filled: string;
    unfilled: string;
    half?: string;
  };
  theme: Record<'default' | 'accent' | 'warning' | 'success', RatingTheme>;
  size: Record<'sm' | 'md' | 'lg', string>;
}
