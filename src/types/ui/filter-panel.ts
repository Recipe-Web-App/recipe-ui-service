import * as React from 'react';
import { type VariantProps } from 'class-variance-authority';
import { filterPanelVariants } from '@/lib/ui/filter-panel-variants';

/**
 * Filter type enumeration
 */
export type FilterType = 'search' | 'checkbox' | 'range' | 'select' | 'custom';

/**
 * Base filter configuration interface
 */
export interface BaseFilterConfig {
  /** Unique identifier for the filter */
  id: string;
  /** Display label for the filter section */
  label?: string;
  /** Help text or description */
  description?: string;
  /** Whether the filter is disabled */
  disabled?: boolean;
  /** Whether the filter is initially collapsed (accordion) */
  defaultCollapsed?: boolean;
}

/**
 * Search filter configuration
 */
export interface SearchFilterConfig extends BaseFilterConfig {
  type: 'search';
  /** Placeholder text for search input */
  placeholder?: string;
  /** Whether to show search icon */
  showSearchIcon?: boolean;
  /** Whether to show clear button */
  showClearButton?: boolean;
  /** Debounce delay in milliseconds */
  debounceDelay?: number;
  /** Loading state */
  loading?: boolean;
}

/**
 * Checkbox option
 */
export interface CheckboxOption {
  /** Unique identifier */
  id: string;
  /** Display label */
  label: React.ReactNode;
  /** Optional description */
  description?: string;
  /** Result count for this option */
  count?: number;
  /** Whether the option is disabled */
  disabled?: boolean;
  /** Default checked state */
  defaultChecked?: boolean;
}

/**
 * Checkbox filter configuration
 */
export interface CheckboxFilterConfig extends BaseFilterConfig {
  type: 'checkbox';
  /** Array of checkbox options */
  options: CheckboxOption[];
  /** Whether to show search within options */
  searchable?: boolean;
  /** Search placeholder text */
  searchPlaceholder?: string;
  /** Whether to show "Select All" button */
  showSelectAll?: boolean;
  /** Whether to show "Clear All" button */
  showClearAll?: boolean;
  /** Maximum number of selections allowed */
  maxSelections?: number;
  /** Layout variant */
  layout?: 'vertical' | 'horizontal' | 'grid';
}

/**
 * Range filter configuration
 */
export interface RangeFilterConfig extends BaseFilterConfig {
  type: 'range';
  /** Minimum value */
  min: number;
  /** Maximum value */
  max: number;
  /** Step increment */
  step?: number;
  /** Display unit (e.g., 'min', 'km', '$') */
  unit?: string;
  /** Value formatter function */
  formatValue?: (value: number) => string;
  /** Whether to show tick marks */
  showTicks?: boolean;
  /** Whether to show value labels */
  showValue?: boolean;
  /** Value position */
  valuePosition?: 'tooltip' | 'inline' | 'bottom';
}

/**
 * Select option
 */
export interface SelectOption {
  /** Option value */
  value: string;
  /** Display label */
  label: string;
  /** Whether the option is disabled */
  disabled?: boolean;
}

/**
 * Select filter configuration
 */
export interface SelectFilterConfig extends BaseFilterConfig {
  type: 'select';
  /** Array of select options */
  options: SelectOption[];
  /** Placeholder text */
  placeholder?: string;
  /** Whether the select is required */
  required?: boolean;
  /** Default selected value */
  defaultValue?: string;
}

/**
 * Custom filter configuration (for extensibility)
 */
export interface CustomFilterConfig extends BaseFilterConfig {
  type: 'custom';
  /** Custom render function */
  render: (props: {
    value: unknown;
    onChange: (value: unknown) => void;
    disabled?: boolean;
  }) => React.ReactNode;
}

/**
 * Union type for all filter configurations
 */
export type FilterConfig =
  | SearchFilterConfig
  | CheckboxFilterConfig
  | RangeFilterConfig
  | SelectFilterConfig
  | CustomFilterConfig;

/**
 * Filter values type
 * Maps filter IDs to their values
 */
export interface FilterValues {
  [filterId: string]:
    | string // search, select
    | string[] // checkbox (selected IDs)
    | [number, number] // range
    | unknown; // custom
}

/**
 * Filter panel variant props
 */
export interface FilterPanelVariantProps extends VariantProps<
  typeof filterPanelVariants
> {
  variant?: 'default' | 'compact' | 'full';
  size?: 'sm' | 'md' | 'lg';
  position?: 'sidebar' | 'drawer' | 'modal';
}

/**
 * Filter panel component props
 */
export interface FilterPanelProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>,
    FilterPanelVariantProps {
  // Filter Configuration
  /** Array of filter configurations */
  filters: FilterConfig[];
  /** Current filter values (controlled) */
  values: FilterValues;
  /** Callback when filter values change */
  onValuesChange: (values: FilterValues) => void;

  // Display Options
  /** Panel title */
  title?: string;
  /** Whether the panel can be collapsed (mobile) */
  collapsible?: boolean;
  /** Default collapsed state */
  defaultCollapsed?: boolean;
  /** Whether to show the header */
  showHeader?: boolean;
  /** Whether to show the footer */
  showFooter?: boolean;
  /** Whether to show the "Apply" button */
  showApplyButton?: boolean;

  // Actions
  /** Callback when "Clear All" is clicked */
  onClear?: () => void;
  /** Callback when "Reset" is clicked */
  onReset?: () => void;
  /** Callback when "Apply" is clicked (if showApplyButton is true) */
  onApply?: (values: FilterValues) => void;

  // Result Information
  /** Total number of results with current filters */
  totalResults?: number;
  /** Whether to show result count */
  showResultCount?: boolean;
  /** Loading state for results */
  loadingResults?: boolean;

  // Styling
  /** Additional CSS class for container */
  className?: string;
  /** Additional CSS class for header */
  headerClassName?: string;
  /** Additional CSS class for body */
  bodyClassName?: string;
  /** Additional CSS class for footer */
  footerClassName?: string;

  // Accessibility
  /** ARIA label for the filter panel */
  'aria-label'?: string;
  /** ARIA description for the filter panel */
  'aria-describedby'?: string;
}

/**
 * Filter section props (internal)
 */
export interface FilterSectionProps {
  filter: FilterConfig;
  value: unknown;
  onChange: (value: unknown) => void;
  disabled?: boolean;
}

/**
 * Helper function to get default value for a filter
 */
export function getDefaultFilterValue(filter: FilterConfig): unknown {
  switch (filter.type) {
    case 'search':
      return '';
    case 'checkbox':
      return filter.options
        .filter(opt => opt.defaultChecked)
        .map(opt => opt.id);
    case 'range':
      return [filter.min, filter.max];
    case 'select':
      return filter.defaultValue ?? '';
    case 'custom':
      return undefined;
    default:
      return undefined;
  }
}

/**
 * Helper function to check if filter has non-default value
 */
export function isFilterActive(filter: FilterConfig, value: unknown): boolean {
  const defaultValue = getDefaultFilterValue(filter);

  switch (filter.type) {
    case 'search':
      return typeof value === 'string' && value.trim() !== '';
    case 'checkbox':
      return (
        Array.isArray(value) &&
        value.length > 0 &&
        JSON.stringify(value.sort()) !==
          JSON.stringify((defaultValue as string[]).sort())
      );
    case 'range':
      return (
        Array.isArray(value) &&
        value.length === 2 &&
        (value[0] !== filter.min || value[1] !== filter.max)
      );
    case 'select':
      return value !== defaultValue;
    case 'custom':
      return value !== undefined && value !== null;
    default:
      return false;
  }
}

/**
 * Helper function to get active filter count
 */
export function getActiveFilterCount(
  filters: FilterConfig[],
  values: FilterValues
): number {
  return filters.filter(filter => {
    const value = values[filter.id];
    return isFilterActive(filter, value);
  }).length;
}

/**
 * Helper function to clear all filters
 */
export function getClearedFilterValues(filters: FilterConfig[]): FilterValues {
  const cleared: FilterValues = {};
  filters.forEach(filter => {
    cleared[filter.id] = getDefaultFilterValue(filter);
  });
  return cleared;
}

/**
 * Helper function to reset filters to default values
 */
export function getResetFilterValues(filters: FilterConfig[]): FilterValues {
  const reset: FilterValues = {};
  filters.forEach(filter => {
    reset[filter.id] = getDefaultFilterValue(filter);
  });
  return reset;
}
