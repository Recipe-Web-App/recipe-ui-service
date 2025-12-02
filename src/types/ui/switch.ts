import type { VariantProps } from 'class-variance-authority';
import type {
  switchVariants,
  switchTrackVariants,
  switchLabelVariants,
  recipeSwitchGroupVariants,
} from '@/lib/ui/switch-variants';

// Base Switch props
export interface SwitchProps
  extends
    Omit<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      'type' | 'disabled' | 'onChange'
    >,
    VariantProps<typeof switchTrackVariants>,
    VariantProps<typeof switchVariants> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: string;
  required?: boolean;
  loading?: boolean;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  checkedIcon?: React.ReactNode;
  uncheckedIcon?: React.ReactNode;
}

// Switch Root props (for compound component)
export interface SwitchRootProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>,
    VariantProps<typeof switchVariants> {
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  value?: string;
  onCheckedChange?: (checked: boolean) => void;
}

// Switch Track props
export interface SwitchTrackProps
  extends
    Omit<React.HTMLAttributes<HTMLButtonElement>, 'onClick'>,
    VariantProps<typeof switchTrackVariants> {
  checked?: boolean;
  disabled?: boolean;
  loading?: boolean;
}

// Switch Thumb props
export interface SwitchThumbProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  checked?: boolean;
  checkedIcon?: React.ReactNode;
  uncheckedIcon?: React.ReactNode;
}

// Switch Label props
export interface SwitchLabelProps
  extends
    React.LabelHTMLAttributes<HTMLLabelElement>,
    VariantProps<typeof switchLabelVariants> {
  required?: boolean;
}

// Switch Description props
export interface SwitchDescriptionProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// Switch Field props (form field wrapper)
export interface SwitchFieldProps extends SwitchProps {
  label: React.ReactNode;
  error?: string;
  helperText?: string;
}

// Recipe Switch Group props
export interface RecipeSwitchGroupProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof recipeSwitchGroupVariants> {
  title?: string;
  switches: RecipeSwitchItemProps[];
  onBatchChange?: (values: Record<string, boolean>) => void;
}

// Recipe Switch Item props
export interface RecipeSwitchItemProps extends Omit<SwitchProps, 'context'> {
  id: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  context?:
    | 'auto-save'
    | 'public-profile'
    | 'email-notifications'
    | 'weekly-meal-plan'
    | 'dietary-restrictions'
    | 'metric-units'
    | 'dark-mode'
    | 'show-nutrition'
    | 'recipe-suggestions'
    | 'shopping-list';
  defaultChecked?: boolean;
}

// Switch Context for compound components
export interface SwitchContextValue {
  checked: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'subtle';
  loading?: boolean;
  toggle: () => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

// Accessible Switch props (for screen readers)
export interface AccessibleSwitchProps extends SwitchProps {
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean;
  'aria-required'?: boolean;
}

// Switch Group Context
export interface SwitchGroupContextValue {
  values: Record<string, boolean>;
  setValue: (id: string, value: boolean) => void;
  disabled?: boolean;
}

// Animated Switch props
export interface AnimatedSwitchProps extends SwitchProps {
  animationDuration?: number;
  animationType?: 'slide' | 'fade' | 'scale';
}

// Settings Switch props (for preference pages)
export interface SettingsSwitchProps extends Omit<SwitchProps, 'onChange'> {
  category?:
    | 'preferences'
    | 'dietary'
    | 'notifications'
    | 'privacy'
    | 'features';
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  onChange?: (checked: boolean) => Promise<void>;
  optimisticUpdate?: boolean;
}
