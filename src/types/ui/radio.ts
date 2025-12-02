import * as React from 'react';
import type { VariantProps } from 'class-variance-authority';
import type {
  radioGroupVariants,
  radioInputVariants,
  radioLabelVariants,
  radioDescriptionVariants,
  radioFieldVariants,
  recipeRadioGroupVariants,
  recipeRadioVariants,
  animatedRadioVariants,
  radioIconVariants,
  radioCardVariants,
} from '@/lib/ui/radio-variants';

// Base radio props extending HTML input attributes
export interface BaseRadioProps {
  id?: string;
  value: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
}

// Radio option interface for individual radio items
export interface RadioOption {
  id: string;
  value: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
}

// Main RadioGroup component props
export interface RadioGroupProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'onChange'
> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  options: RadioOption[];
  disabled?: boolean;
  required?: boolean;
  name?: string;
  error?: string;
  helperText?: React.ReactNode;
  orientation?: VariantProps<typeof radioGroupVariants>['orientation'];
  size?: VariantProps<typeof radioInputVariants>['size'];
  variant?: VariantProps<typeof radioInputVariants>['variant'];
}

// Compound component props
export interface RadioGroupRootProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>,
    Omit<VariantProps<typeof radioGroupVariants>, 'disabled'> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  name?: string;
}

export interface RadioInputProps
  extends
    Omit<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      'onChange' | 'disabled'
    >,
    Omit<VariantProps<typeof radioInputVariants>, 'disabled'> {
  value: string;
  loading?: boolean;
  disabled?: boolean;
}

export interface RadioLabelProps
  extends
    React.LabelHTMLAttributes<HTMLLabelElement>,
    VariantProps<typeof radioLabelVariants> {}

export interface RadioDescriptionProps
  extends
    React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof radioDescriptionVariants> {}

export interface RadioIconProps
  extends
    React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof radioIconVariants> {
  checked?: boolean;
}

// Form field props
export interface RadioFieldProps
  extends
    Omit<RadioGroupProps, 'error'>,
    Omit<VariantProps<typeof radioFieldVariants>, 'error'> {
  label?: React.ReactNode;
  helperText?: React.ReactNode;
  error?: string;
}

// Recipe radio group props
export interface RecipeRadioOption {
  id: string;
  value: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  count?: number;
  disabled?: boolean;
  context?: VariantProps<typeof recipeRadioVariants>['context'];
  icon?: React.ReactNode;
}

export interface RecipeRadioGroupProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'title'>,
    VariantProps<typeof recipeRadioGroupVariants> {
  title?: React.ReactNode;
  options: RecipeRadioOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  showCounts?: boolean;
  maxWidth?: string;
}

// Animated radio props
export interface AnimatedRadioProps
  extends
    Omit<RadioGroupProps, 'loading'>,
    VariantProps<typeof animatedRadioVariants> {
  animationDuration?: number;
  loading?: boolean;
}

// Radio card props for recipe selection
export interface RadioCardProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'onSelect'>,
    VariantProps<typeof radioCardVariants> {
  value: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  image?: string;
  onSelect?: (value: string) => void;
}

// Recipe filter specific props
export interface RecipeFilterRadioGroupProps {
  title: string;
  filters: Array<{
    id: string;
    value: string;
    label: string;
    description?: string;
    count?: number;
    context: VariantProps<typeof recipeRadioVariants>['context'];
    icon?: React.ReactNode;
  }>;
  selectedValue?: string;
  onValueChange: (value: string) => void;
  required?: boolean;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

// Context types for compound components
export interface RadioContextValue {
  value?: string;
  onValueChange: (value: string) => void;
  disabled: boolean;
  required: boolean;
  name?: string;
  currentInputId?: string;
  setCurrentInputId?: (id: string) => void;
}

export interface RadioGroupContextValue {
  value?: string;
  setValue: (value: string) => void;
  clearSelection: () => void;
  disabled: boolean;
  required: boolean;
  name?: string;
}

// Cuisine selection props for recipe filters
export interface CuisineRadioGroupProps {
  selectedCuisine?: string;
  onCuisineChange: (cuisine: string) => void;
  cuisines: Array<{
    id: string;
    name: string;
    description?: string;
    count?: number;
    image?: string;
  }>;
  required?: boolean;
  showCounts?: boolean;
}

// Dietary preference props
export interface DietaryRadioGroupProps {
  selectedDiet?: string;
  onDietChange: (diet: string) => void;
  diets: Array<{
    id: string;
    name: string;
    description?: string;
    restrictions?: string[];
    icon?: React.ReactNode;
  }>;
  required?: boolean;
  showRestrictions?: boolean;
}

// Difficulty level props
export interface DifficultyRadioGroupProps {
  selectedDifficulty?: string;
  onDifficultyChange: (difficulty: string) => void;
  levels: Array<{
    id: string;
    name: string;
    description?: string;
    timeEstimate?: string;
    skillRequired?: string;
  }>;
  required?: boolean;
  showEstimates?: boolean;
}

// Meal type props
export interface MealTypeRadioGroupProps {
  selectedMealType?: string;
  onMealTypeChange: (mealType: string) => void;
  mealTypes: Array<{
    id: string;
    name: string;
    description?: string;
    timeOfDay?: string;
    icon?: React.ReactNode;
  }>;
  required?: boolean;
}

// Serving size props
export interface ServingSizeRadioGroupProps {
  selectedServingSize?: string;
  onServingSizeChange: (servingSize: string) => void;
  servingSizes: Array<{
    id: string;
    value: string;
    label: string;
    description?: string;
    portions: number;
  }>;
  required?: boolean;
  showPortions?: boolean;
}

// Advanced radio props for complex use cases
export interface AdvancedRadioProps extends RadioGroupProps {
  tooltip?: string;
  badge?: React.ReactNode;
  icon?: React.ReactNode;
  subText?: React.ReactNode;
  level?: number; // For nested/hierarchical radios
  searchable?: boolean;
  customRenderer?: (option: RadioOption) => React.ReactNode;
}

// Recipe preference form props
export interface RecipePreferenceFormProps {
  preferences: {
    cuisine?: string;
    diet?: string;
    difficulty?: string;
    mealType?: string;
    servingSize?: string;
    cookingTime?: string;
  };
  onPreferenceChange: (
    preferences: Partial<RecipePreferenceFormProps['preferences']>
  ) => void;
  showValidation?: boolean;
  required?: {
    cuisine?: boolean;
    diet?: boolean;
    difficulty?: boolean;
    mealType?: boolean;
    servingSize?: boolean;
    cookingTime?: boolean;
  };
}

// Filter state management for radio groups
export interface RadioFilterState {
  selectedValue?: string;
  disabled: boolean;
  required: boolean;
  error?: string;
}

export interface RadioFilterActions {
  setValue: (value: string) => void;
  clearValue: () => void;
  setDisabled: (disabled: boolean) => void;
  setRequired: (required: boolean) => void;
  setError: (error?: string) => void;
  reset: () => void;
}

// Validation props
export interface RadioValidationProps {
  required?: boolean;
  validator?: (value: string) => string | undefined;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

// Accessibility props
export interface RadioAccessibilityProps {
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean;
  'aria-required'?: boolean;
  role?: string;
}
