'use client';

import * as React from 'react';
import { ChevronDown, X, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SearchInput } from '@/components/ui/search-input';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { FilterCheckboxGroup } from '@/components/ui/checkbox';
import { RangeSlider } from '@/components/ui/slider';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import {
  filterPanelVariants,
  filterPanelHeaderVariants,
  filterPanelTitleVariants,
  filterPanelBadgeVariants,
  filterPanelCollapseButtonVariants,
  filterPanelBodyVariants,
  filterPanelSectionVariants,
  filterSectionDescriptionVariants,
  filterPanelFooterVariants,
  filterPanelResultCountVariants,
  filterPanelActionsVariants,
  filterPanelButtonVariants,
  filterPanelEmptyVariants,
  filterPanelChevronVariants,
} from '@/lib/ui/filter-panel-variants';
import type {
  FilterPanelProps,
  FilterConfig,
  SearchFilterConfig,
  CheckboxFilterConfig,
  RangeFilterConfig,
  SelectFilterConfig,
  CustomFilterConfig,
  FilterSectionProps,
} from '@/types/ui/filter-panel';
import {
  getActiveFilterCount,
  getClearedFilterValues,
  getResetFilterValues,
} from '@/types/ui/filter-panel';

/**
 * FilterPanel Component
 *
 * A generic, configurable filter panel that composes existing UI components
 * (SearchInput, Accordion, Checkbox, Slider, Select) to provide a flexible
 * filtering system for browse pages.
 *
 * Features:
 * - Multiple filter types (search, checkbox, range, select, custom)
 * - Collapsible on mobile
 * - Clear all / Reset filters
 * - Active filter count badge
 * - Result count display
 * - Fully accessible (WCAG 2.1 AA)
 *
 * @example
 * ```tsx
 * <FilterPanel
 *   title="Filter Recipes"
 *   filters={[
 *     { type: 'search', id: 'search', placeholder: 'Search...' },
 *     { type: 'checkbox', id: 'categories', label: 'Categories', options: [...] },
 *     { type: 'range', id: 'time', label: 'Cook Time', min: 0, max: 120 },
 *   ]}
 *   values={filterValues}
 *   onValuesChange={setFilterValues}
 *   totalResults={42}
 *   showResultCount
 * />
 * ```
 */
export const FilterPanel = React.forwardRef<HTMLDivElement, FilterPanelProps>(
  (
    {
      // Filter configuration
      filters,
      values,
      onValuesChange,

      // Display options
      title = 'Filters',
      collapsible = true,
      defaultCollapsed = false,
      showHeader = true,
      showFooter = true,
      showApplyButton = false,

      // Actions
      onClear,
      onReset,
      onApply,

      // Result information
      totalResults,
      showResultCount = false,
      loadingResults = false,

      // Styling
      className,
      headerClassName,
      bodyClassName,
      footerClassName,
      variant,
      size,
      position,

      // Accessibility
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedby,

      ...props
    },
    ref
  ) => {
    // Collapsed state (mobile)
    const [collapsed, setCollapsed] = React.useState(defaultCollapsed);

    // Active filter count
    const activeFilterCount = React.useMemo(
      () => getActiveFilterCount(filters, values),
      [filters, values]
    );

    // Check if filters are at default state
    const isAtDefault = React.useMemo(() => {
      const defaultValues = getResetFilterValues(filters);
      return JSON.stringify(values) === JSON.stringify(defaultValues);
    }, [filters, values]);

    // Handle clear all
    const handleClearAll = React.useCallback(() => {
      const clearedValues = getClearedFilterValues(filters);
      onValuesChange(clearedValues);
      onClear?.();
    }, [filters, onValuesChange, onClear]);

    // Handle reset
    const handleReset = React.useCallback(() => {
      const resetValues = getResetFilterValues(filters);
      onValuesChange(resetValues);
      onReset?.();
    }, [filters, onValuesChange, onReset]);

    // Handle apply
    const handleApply = React.useCallback(() => {
      onApply?.(values);
    }, [onApply, values]);

    // Handle collapse toggle
    const handleCollapseToggle = React.useCallback(() => {
      setCollapsed(prev => !prev);
    }, []);

    // Handle filter value change
    const handleFilterChange = React.useCallback(
      (filterId: string, value: unknown) => {
        onValuesChange({
          ...values,
          [filterId]: value,
        });
      },
      [values, onValuesChange]
    );

    return (
      <div
        ref={ref}
        className={cn(
          filterPanelVariants({ variant, size, position }),
          className
        )}
        role="region"
        aria-label={ariaLabel ?? 'Filter panel'}
        aria-describedby={ariaDescribedby}
        {...props}
      >
        {/* Header */}
        {showHeader && (
          <div
            className={cn(
              filterPanelHeaderVariants({
                size,
                collapsible: collapsible,
              }),
              headerClassName
            )}
            onClick={collapsible ? handleCollapseToggle : undefined}
            onKeyDown={
              collapsible
                ? e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleCollapseToggle();
                    }
                  }
                : undefined
            }
            role={collapsible ? 'button' : undefined}
            tabIndex={collapsible ? 0 : undefined}
            aria-expanded={collapsible ? !collapsed : undefined}
          >
            <div className="flex items-center gap-2">
              <h2 className={cn(filterPanelTitleVariants({ size }))}>
                {title}
              </h2>
              {activeFilterCount > 0 && (
                <span
                  className={cn(filterPanelBadgeVariants({ size }))}
                  aria-label={`${activeFilterCount} active ${
                    activeFilterCount === 1 ? 'filter' : 'filters'
                  }`}
                >
                  {activeFilterCount}
                </span>
              )}
            </div>

            {collapsible && (
              <button
                type="button"
                className={cn(
                  filterPanelCollapseButtonVariants({
                    size,
                    collapsed,
                  })
                )}
                aria-label={collapsed ? 'Expand filters' : 'Collapse filters'}
                onClick={e => {
                  e.stopPropagation();
                  handleCollapseToggle();
                }}
              >
                <ChevronDown
                  className={cn(filterPanelChevronVariants({ collapsed }))}
                  aria-hidden="true"
                />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div
          className={cn(
            filterPanelBodyVariants({
              size,
              collapsed: collapsible ? collapsed : false,
              maxHeight: position === 'sidebar' ? 'lg' : 'full',
            }),
            bodyClassName
          )}
        >
          {filters.length === 0 ? (
            <div className={cn(filterPanelEmptyVariants({ size }))}>
              <p className="text-gray-500 dark:text-gray-400">
                No filters available
              </p>
            </div>
          ) : (
            <Accordion type="multiple" defaultValue={filters.map(f => f.id)}>
              {filters.map(filter => (
                <div
                  key={filter.id}
                  className={cn(filterPanelSectionVariants({ size }))}
                >
                  <FilterSection
                    filter={filter}
                    value={values[filter.id]}
                    onChange={value => handleFilterChange(filter.id, value)}
                    disabled={filter.disabled}
                  />
                </div>
              ))}
            </Accordion>
          )}
        </div>

        {/* Footer */}
        {showFooter && (
          <div
            className={cn(
              filterPanelFooterVariants({
                size,
                layout: showResultCount ? 'split' : 'horizontal',
              }),
              footerClassName
            )}
          >
            {/* Result count */}
            {showResultCount && (
              <div
                className={cn(
                  filterPanelResultCountVariants({
                    size,
                    loading: loadingResults,
                  })
                )}
                aria-live="polite"
                aria-atomic="true"
              >
                {loadingResults ? (
                  'Loading...'
                ) : (
                  <>
                    {totalResults ?? 0}{' '}
                    {totalResults === 1 ? 'result' : 'results'}
                  </>
                )}
              </div>
            )}

            {/* Action buttons */}
            <div
              className={cn(
                filterPanelActionsVariants({ layout: 'horizontal', size })
              )}
            >
              <button
                type="button"
                className={cn(
                  filterPanelButtonVariants({
                    intent: 'ghost',
                    size,
                  })
                )}
                onClick={handleClearAll}
                disabled={activeFilterCount === 0}
                aria-label="Clear all filters"
              >
                <X className="mr-1.5 h-4 w-4" aria-hidden="true" />
                Clear
              </button>

              <button
                type="button"
                className={cn(
                  filterPanelButtonVariants({
                    intent: 'ghost',
                    size,
                  })
                )}
                onClick={handleReset}
                disabled={isAtDefault}
                aria-label="Reset filters to default"
              >
                <RotateCcw className="mr-1.5 h-4 w-4" aria-hidden="true" />
                Reset
              </button>

              {showApplyButton && (
                <button
                  type="button"
                  className={cn(
                    filterPanelButtonVariants({
                      intent: 'primary',
                      size,
                    })
                  )}
                  onClick={handleApply}
                  aria-label="Apply filters"
                >
                  Apply
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
);

FilterPanel.displayName = 'FilterPanel';

/**
 * FilterSection Component (Internal)
 *
 * Renders a single filter section based on its type
 */
const FilterSection: React.FC<FilterSectionProps> = ({
  filter,
  value,
  onChange,
  disabled,
}) => {
  const sectionContent = React.useMemo(() => {
    switch (filter.type) {
      case 'search':
        return (
          <SearchFilterSection
            filter={filter}
            value={value}
            onChange={onChange}
            disabled={disabled}
          />
        );
      case 'checkbox':
        return (
          <CheckboxFilterSection
            filter={filter}
            value={value}
            onChange={onChange}
            disabled={disabled}
          />
        );
      case 'range':
        return (
          <RangeFilterSection
            filter={filter}
            value={value}
            onChange={onChange}
            disabled={disabled}
          />
        );
      case 'select':
        return (
          <SelectFilterSection
            filter={filter}
            value={value}
            onChange={onChange}
            disabled={disabled}
          />
        );
      case 'custom':
        return (
          <CustomFilterSection
            filter={filter}
            value={value}
            onChange={onChange}
            disabled={disabled}
          />
        );
      default:
        return null;
    }
  }, [filter, value, onChange, disabled]);

  // For search filters, render without accordion
  if (filter.type === 'search') {
    return <div className="mb-3">{sectionContent}</div>;
  }

  // For other filters, render within accordion
  return (
    <AccordionItem value={filter.id} disabled={disabled}>
      <AccordionTrigger disabled={disabled}>
        {filter.label ?? filter.id}
      </AccordionTrigger>
      <AccordionContent>
        {filter.description && (
          <p className={cn(filterSectionDescriptionVariants({ size: 'md' }))}>
            {filter.description}
          </p>
        )}
        {sectionContent}
      </AccordionContent>
    </AccordionItem>
  );
};

/**
 * Search Filter Section
 */
const SearchFilterSection: React.FC<{
  filter: SearchFilterConfig;
  value: unknown;
  onChange: (value: unknown) => void;
  disabled?: boolean;
}> = ({ filter, value, onChange, disabled }) => {
  const stringValue = typeof value === 'string' ? value : '';

  return (
    <SearchInput
      value={stringValue}
      onChange={e => onChange(e.target.value)}
      placeholder={filter.placeholder}
      showSearchIcon={filter.showSearchIcon ?? true}
      showClearButton={filter.showClearButton ?? true}
      disabled={disabled ?? filter.disabled}
      loading={filter.loading}
      debounceConfig={
        filter.debounceDelay ? { delay: filter.debounceDelay } : undefined
      }
      aria-label={filter.label ?? 'Search filter'}
    />
  );
};

/**
 * Checkbox Filter Section
 */
const CheckboxFilterSection: React.FC<{
  filter: CheckboxFilterConfig;
  value: unknown;
  onChange: (value: unknown) => void;
  disabled?: boolean;
}> = ({ filter, value, onChange }) => {
  const handleValuesChange = React.useCallback(
    (newValues: Record<string, boolean>) => {
      const selected = Object.entries(newValues)
        .filter(([, checked]) => checked)
        .map(([id]) => id);
      onChange(selected);
    },
    [onChange]
  );

  const valuesMap = React.useMemo(() => {
    const selectedIds = Array.isArray(value) ? value : [];
    const map: Record<string, boolean> = {};
    filter.options.forEach(option => {
      map[option.id] = selectedIds.includes(option.id);
    });
    return map;
  }, [filter.options, value]);

  return (
    <FilterCheckboxGroup
      items={filter.options}
      values={valuesMap}
      onValuesChange={handleValuesChange}
      searchable={filter.searchable}
      searchPlaceholder={filter.searchPlaceholder}
      selectAll={filter.showSelectAll}
      clearAll={filter.showClearAll}
      layout={filter.layout ?? 'vertical'}
      variant="filters"
    />
  );
};

/**
 * Range Filter Section
 */
const RangeFilterSection: React.FC<{
  filter: RangeFilterConfig;
  value: unknown;
  onChange: (value: unknown) => void;
  disabled?: boolean;
}> = ({ filter, value, onChange, disabled }) => {
  const rangeValue: [number, number] =
    Array.isArray(value) && value.length === 2
      ? [value[0] as number, value[1] as number]
      : [filter.min, filter.max];

  return (
    <RangeSlider
      value={rangeValue}
      onValueChange={onChange as (value: [number, number]) => void}
      min={filter.min}
      max={filter.max}
      step={filter.step ?? 1}
      unit={filter.unit}
      formatValue={filter.formatValue}
      showTicks={filter.showTicks}
      showValue={filter.showValue ?? true}
      valuePosition={filter.valuePosition ?? 'inline'}
      disabled={disabled ?? filter.disabled}
      aria-label={filter.label ?? 'Range filter'}
    />
  );
};

/**
 * Select Filter Section
 */
const SelectFilterSection: React.FC<{
  filter: SelectFilterConfig;
  value: unknown;
  onChange: (value: unknown) => void;
  disabled?: boolean;
}> = ({ filter, value, onChange, disabled }) => {
  const stringValue =
    typeof value === 'string' ? value : (filter.defaultValue ?? '');

  return (
    <Select
      value={stringValue}
      onValueChange={onChange as (value: string) => void}
      disabled={disabled ?? filter.disabled}
    >
      <SelectTrigger aria-label={filter.label ?? 'Select filter'}>
        <SelectValue placeholder={filter.placeholder} />
      </SelectTrigger>
      <SelectContent>
        {filter.options.map(option => (
          <SelectItem
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

/**
 * Custom Filter Section
 */
const CustomFilterSection: React.FC<{
  filter: CustomFilterConfig;
  value: unknown;
  onChange: (value: unknown) => void;
  disabled?: boolean;
}> = ({ filter, value, onChange, disabled }) => {
  return (
    <>
      {filter.render({
        value,
        onChange,
        disabled: disabled ?? filter.disabled,
      })}
    </>
  );
};

export type { FilterPanelProps, FilterConfig };
