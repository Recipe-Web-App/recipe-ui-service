import * as React from 'react';
import type { VariantProps } from 'class-variance-authority';
import type {
  checkboxVariants,
  checkboxInputVariants,
  checkboxLabelVariants,
  checkboxDescriptionVariants,
  checkboxFieldVariants,
  filterCheckboxGroupVariants,
  recipeCheckboxVariants,
  animatedCheckboxVariants,
  checkboxIconVariants,
  searchCheckboxVariants,
} from '@/lib/ui/checkbox-variants';

// Base checkbox props extending HTML input attributes
export interface BaseCheckboxProps {
  id?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  indeterminate?: boolean;
  onCheckedChange?: (checked: boolean | 'indeterminate') => void;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  value?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
}

// Main Checkbox component props
export interface CheckboxProps extends BaseCheckboxProps {
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: string;
  loading?: boolean;
  checkedIcon?: React.ReactNode;
  uncheckedIcon?: React.ReactNode;
  indeterminateIcon?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  orientation?: VariantProps<typeof checkboxVariants>['orientation'];
  size?: VariantProps<typeof checkboxInputVariants>['size'];
  variant?: VariantProps<typeof checkboxInputVariants>['variant'];
}

// Compound component props
export interface CheckboxRootProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultChecked'>,
    Omit<VariantProps<typeof checkboxVariants>, 'disabled'> {
  checked?: boolean | 'indeterminate';
  defaultChecked?: boolean | 'indeterminate';
  onCheckedChange?: (checked: boolean | 'indeterminate') => void;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  value?: string;
}

export interface CheckboxInputProps
  extends
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'disabled'>,
    Omit<VariantProps<typeof checkboxInputVariants>, 'disabled'> {
  loading?: boolean;
  disabled?: boolean;
}

export interface CheckboxLabelProps
  extends
    React.LabelHTMLAttributes<HTMLLabelElement>,
    VariantProps<typeof checkboxLabelVariants> {}

export interface CheckboxDescriptionProps
  extends
    React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof checkboxDescriptionVariants> {}

export interface CheckboxIconProps
  extends
    React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof checkboxIconVariants> {
  checked?: boolean | 'indeterminate';
}

// Form field props
export interface CheckboxFieldProps
  extends
    Omit<CheckboxProps, 'error'>,
    Omit<VariantProps<typeof checkboxFieldVariants>, 'error'> {
  label?: React.ReactNode;
  helperText?: React.ReactNode;
  error?: string;
}

// Filter checkbox group props
export interface FilterCheckboxItemProps {
  id: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  value?: string;
  defaultChecked?: boolean;
  disabled?: boolean;
  count?: number;
  context?: VariantProps<typeof recipeCheckboxVariants>['context'];
  onCheckedChange?: (checked: boolean) => void;
}

export interface FilterCheckboxGroupProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, 'title'>,
    VariantProps<typeof filterCheckboxGroupVariants> {
  title?: React.ReactNode;
  items: FilterCheckboxItemProps[];
  values?: Record<string, boolean>;
  onValuesChange?: (values: Record<string, boolean>) => void;
  onBatchChange?: (values: Record<string, boolean>) => void;
  searchable?: boolean;
  searchPlaceholder?: string;
  selectAll?: boolean;
  clearAll?: boolean;
  maxHeight?: string;
}

// Animated checkbox props
export interface AnimatedCheckboxProps
  extends
    Omit<CheckboxProps, 'loading'>,
    VariantProps<typeof animatedCheckboxVariants> {
  animationDuration?: number;
  loading?: boolean;
}

// Search checkbox props
export interface SearchCheckboxProps
  extends
    Omit<CheckboxProps, 'disabled'>,
    VariantProps<typeof searchCheckboxVariants> {
  searchTerm?: string;
  highlightMatch?: boolean;
  count?: number;
  badge?: React.ReactNode;
  disabled?: boolean;
}

// Multi-select filter props
export interface MultiSelectFilterProps {
  title: string;
  options: FilterCheckboxItemProps[];
  selectedValues: string[];
  onSelectionChange: (values: string[]) => void;
  searchable?: boolean;
  placeholder?: string;
  maxSelections?: number;
  variant?: VariantProps<typeof filterCheckboxGroupVariants>['variant'];
  layout?: VariantProps<typeof filterCheckboxGroupVariants>['layout'];
  showCount?: boolean;
  allowSelectAll?: boolean;
  allowClearAll?: boolean;
}

// Recipe filter specific props
export interface RecipeFilterGroupProps {
  title: string;
  filters: Array<{
    id: string;
    label: string;
    description?: string;
    count?: number;
    context: VariantProps<typeof recipeCheckboxVariants>['context'];
  }>;
  selectedFilters: string[];
  onFiltersChange: (filters: string[]) => void;
  searchable?: boolean;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

// Context types for compound components
export interface CheckboxContextValue {
  checked: boolean | 'indeterminate';
  disabled: boolean;
  required: boolean;
  toggle: () => void;
  inputRef: React.RefObject<HTMLButtonElement | null>;
}

export interface CheckboxGroupContextValue {
  values: Record<string, boolean>;
  setValue: (id: string, value: boolean) => void;
  selectAll: () => void;
  clearAll: () => void;
  isAllSelected: boolean;
  isIndeterminate: boolean;
  selectedCount: number;
  totalCount: number;
}

// Advanced checkbox props
export interface AdvancedCheckboxProps extends CheckboxProps {
  tooltip?: string;
  badge?: React.ReactNode;
  icon?: React.ReactNode;
  subOptions?: FilterCheckboxItemProps[];
  collapsible?: boolean;
  level?: number; // For nested/hierarchical checkboxes
}

// Bulk action props for filter management
export interface BulkActionProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onClearAll: () => void;
  onInvertSelection?: () => void;
  actions?: Array<{
    label: string;
    icon?: React.ReactNode;
    action: (selectedIds: string[]) => void;
    variant?: 'default' | 'destructive';
  }>;
}

// Filter state management
export interface FilterState {
  searchTerm: string;
  selectedValues: Record<string, boolean>;
  collapsed: Record<string, boolean>;
  sortBy: 'name' | 'count' | 'recent';
  sortOrder: 'asc' | 'desc';
}

export interface FilterActions {
  setSearchTerm: (term: string) => void;
  toggleValue: (id: string) => void;
  setValues: (values: Record<string, boolean>) => void;
  selectAll: () => void;
  clearAll: () => void;
  toggleGroup: (groupId: string) => void;
  setSortBy: (sortBy: FilterState['sortBy']) => void;
  setSortOrder: (order: FilterState['sortOrder']) => void;
  reset: () => void;
}
