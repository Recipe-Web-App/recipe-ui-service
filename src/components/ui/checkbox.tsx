'use client';

import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check, Minus, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  checkboxVariants,
  checkboxInputVariants,
  checkboxLabelVariants,
  checkboxDescriptionVariants,
  checkboxErrorVariants,
  checkboxFieldVariants,
  filterCheckboxGroupVariants,
  checkboxGroupTitleVariants,
  recipeCheckboxVariants,
  animatedCheckboxVariants,
  checkboxIconVariants,
  searchCheckboxVariants,
} from '@/lib/ui/checkbox-variants';
import type {
  CheckboxProps,
  CheckboxRootProps,
  CheckboxInputProps,
  CheckboxLabelProps,
  CheckboxDescriptionProps,
  CheckboxIconProps,
  CheckboxFieldProps,
  FilterCheckboxGroupProps,
  FilterCheckboxItemProps,
  AnimatedCheckboxProps,
  SearchCheckboxProps,
  MultiSelectFilterProps,
  CheckboxContextValue,
  CheckboxGroupContextValue,
} from '@/types/ui/checkbox';
import {
  CheckboxContext,
  CheckboxGroupContext,
  useCheckboxContext,
  useCheckboxGroupContext,
} from '@/hooks/components/ui/checkbox-hooks';

// Main Checkbox Component
const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  (
    {
      className,
      size = 'md',
      variant = 'default',
      orientation = 'horizontal',
      disabled = false,
      label,
      description,
      error,
      required = false,
      loading = false,
      checked,
      defaultChecked,
      indeterminate,
      onCheckedChange,
      checkedIcon,
      uncheckedIcon,
      indeterminateIcon,
      name,
      value,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const checkboxId = id ?? generatedId;
    const descriptionId = description ? `${checkboxId}-description` : undefined;
    const errorId = error ? `${checkboxId}-error` : undefined;

    return (
      <div
        className={cn(
          checkboxVariants({ orientation, disabled }),
          error && 'text-red-600',
          className
        )}
      >
        <CheckboxPrimitive.Root
          ref={ref}
          id={checkboxId}
          className={cn(
            checkboxInputVariants({ size, variant, disabled }),
            animatedCheckboxVariants({ loading: loading }),
            'ml-3'
          )}
          disabled={disabled || loading}
          checked={indeterminate ? 'indeterminate' : checked}
          defaultChecked={defaultChecked}
          onCheckedChange={onCheckedChange}
          name={name}
          value={value}
          aria-describedby={cn(descriptionId, errorId)}
          aria-invalid={!!error}
          aria-required={required}
          {...props}
        >
          <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
            {indeterminate
              ? (indeterminateIcon ?? <Minus className="h-3 w-3" />)
              : checked
                ? (checkedIcon ?? <Check className="h-3 w-3" />)
                : uncheckedIcon}
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>

        {(label ?? description ?? error) && (
          <div
            className={cn(
              'flex flex-col gap-1',
              orientation === 'horizontal' && 'ml-3',
              orientation === 'vertical' && 'mt-3',
              orientation === 'reverse-horizontal' && 'mr-3',
              orientation === 'reverse-vertical' && 'mb-3'
            )}
          >
            {label && (
              <label
                htmlFor={checkboxId}
                className={cn(
                  checkboxLabelVariants({ size, required }),
                  disabled && 'cursor-not-allowed opacity-50'
                )}
              >
                {label}
              </label>
            )}
            {description && (
              <span
                id={descriptionId}
                className={cn(checkboxDescriptionVariants({ size }))}
              >
                {description}
              </span>
            )}
            {error && (
              <span
                id={errorId}
                className={cn(checkboxErrorVariants({ size }))}
                role="alert"
              >
                {error}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }
);
Checkbox.displayName = 'Checkbox';

// Compound Components
const CheckboxRoot = React.forwardRef<HTMLDivElement, CheckboxRootProps>(
  (
    {
      className,
      orientation = 'horizontal',
      disabled = false,
      checked: controlledChecked,
      defaultChecked = false,
      onCheckedChange,
      required = false,
      name: _name,
      value: _value,
      children,
      ...props
    },
    ref
  ) => {
    const inputRef = React.useRef<HTMLButtonElement | null>(null);
    const [checked, setChecked] = React.useState<boolean | 'indeterminate'>(
      controlledChecked ?? defaultChecked
    );

    React.useEffect(() => {
      if (controlledChecked !== undefined) {
        setChecked(controlledChecked);
      }
    }, [controlledChecked]);

    const toggle = React.useCallback(() => {
      if (disabled) return;
      const newValue = checked === 'indeterminate' ? true : !checked;
      setChecked(newValue);
      onCheckedChange?.(newValue);
    }, [checked, disabled, onCheckedChange]);

    const contextValue: CheckboxContextValue = React.useMemo(
      () => ({
        checked,
        disabled,
        required,
        toggle,
        inputRef,
      }),
      [checked, disabled, required, toggle]
    );

    return (
      <CheckboxContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(checkboxVariants({ orientation, disabled }), className)}
          {...props}
        >
          {children}
        </div>
      </CheckboxContext.Provider>
    );
  }
);
CheckboxRoot.displayName = 'CheckboxRoot';

const CheckboxInput = React.forwardRef<HTMLButtonElement, CheckboxInputProps>(
  (
    { className, size = 'md', variant = 'default', loading = false, ...props },
    ref
  ) => {
    const { checked, disabled, toggle } = useCheckboxContext();

    return (
      <button
        ref={ref}
        type="button"
        role="checkbox"
        aria-checked={checked === 'indeterminate' ? 'mixed' : checked}
        data-state={
          checked === 'indeterminate'
            ? 'indeterminate'
            : checked
              ? 'checked'
              : 'unchecked'
        }
        disabled={disabled || loading}
        className={cn(
          checkboxInputVariants({ size, variant, disabled }),
          animatedCheckboxVariants({ loading }),
          className
        )}
        onClick={toggle}
        {...props}
      />
    );
  }
);
CheckboxInput.displayName = 'CheckboxInput';

const CheckboxIcon = React.forwardRef<HTMLSpanElement, CheckboxIconProps>(
  ({ className, size = 'md', checked, children, ...props }, ref) => {
    const contextChecked = useCheckboxContext()?.checked;
    const finalChecked = checked ?? contextChecked;

    return (
      <span
        ref={ref}
        className={cn(
          checkboxIconVariants({
            size,
            state:
              finalChecked === 'indeterminate'
                ? 'indeterminate'
                : finalChecked
                  ? 'checked'
                  : 'unchecked',
          }),
          className
        )}
        {...props}
      >
        {children ??
          (finalChecked === 'indeterminate' ? (
            <Minus className="h-3 w-3" />
          ) : finalChecked ? (
            <Check className="h-3 w-3" />
          ) : null)}
      </span>
    );
  }
);
CheckboxIcon.displayName = 'CheckboxIcon';

const CheckboxLabel = React.forwardRef<HTMLLabelElement, CheckboxLabelProps>(
  ({ className, size = 'md', required = false, ...props }, ref) => {
    const { disabled } = useCheckboxContext();

    return (
      <label
        ref={ref}
        className={cn(
          checkboxLabelVariants({ size, required }),
          disabled && 'cursor-not-allowed opacity-50',
          className
        )}
        {...props}
      />
    );
  }
);
CheckboxLabel.displayName = 'CheckboxLabel';

const CheckboxDescription = React.forwardRef<
  HTMLSpanElement,
  CheckboxDescriptionProps
>(({ className, size = 'md', ...props }, ref) => {
  return (
    <span
      ref={ref}
      className={cn(checkboxDescriptionVariants({ size }), className)}
      {...props}
    />
  );
});
CheckboxDescription.displayName = 'CheckboxDescription';

// Checkbox Field (form field wrapper)
const CheckboxField = React.forwardRef<HTMLButtonElement, CheckboxFieldProps>(
  ({ className, label, error, helperText, ...props }, ref) => {
    const fieldId = React.useId();

    return (
      <div className={cn(checkboxFieldVariants({ error: !!error }), className)}>
        <Checkbox
          ref={ref}
          id={fieldId}
          label={label}
          description={helperText}
          error={error}
          {...props}
        />
      </div>
    );
  }
);
CheckboxField.displayName = 'CheckboxField';

// Filter Checkbox Group
const FilterCheckboxGroup = React.forwardRef<
  HTMLDivElement,
  FilterCheckboxGroupProps
>(
  (
    {
      className,
      variant = 'filters',
      layout = 'vertical',
      title,
      items,
      values: controlledValues,
      onValuesChange,
      onBatchChange,
      searchable = false,
      searchPlaceholder = 'Search filters...',
      selectAll = false,
      clearAll = false,
      maxHeight,
      ...props
    },
    ref
  ) => {
    const [values, setValues] = React.useState<Record<string, boolean>>(() => {
      const initial: Record<string, boolean> = {};
      items.forEach(item => {
        initial[item.id] = item.defaultChecked ?? false;
      });
      return controlledValues ?? initial;
    });

    const [searchTerm, setSearchTerm] = React.useState('');

    React.useEffect(() => {
      if (controlledValues !== undefined) {
        setValues(controlledValues);
      }
    }, [controlledValues]);

    const setValue = React.useCallback(
      (id: string, value: boolean) => {
        setValues(prev => {
          const updated = { ...prev, [id]: value };
          onValuesChange?.(updated);
          React.startTransition(() => {
            onBatchChange?.(updated);
          });
          return updated;
        });
      },
      [onValuesChange, onBatchChange]
    );

    const selectAllItems = React.useCallback(() => {
      const updated: Record<string, boolean> = {};
      items.forEach(item => {
        if (!item.disabled) {
          updated[item.id] = true;
        }
      });
      setValues(prev => ({ ...prev, ...updated }));
      onValuesChange?.({ ...values, ...updated });
    }, [items, values, onValuesChange]);

    const clearAllItems = React.useCallback(() => {
      const updated: Record<string, boolean> = {};
      items.forEach(item => {
        updated[item.id] = false;
      });
      setValues(updated);
      onValuesChange?.(updated);
    }, [items, onValuesChange]);

    const filteredItems = React.useMemo(() => {
      if (!searchTerm) return items;
      return items.filter(item => {
        let labelText = '';
        if (typeof item.label === 'string') {
          labelText = item.label;
        } else if (React.isValidElement(item.label)) {
          labelText = '';
        } else if (item.label) {
          labelText = String(item.label);
        }
        return labelText.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }, [items, searchTerm]);

    const selectedCount = Object.values(values).filter(Boolean).length;
    const totalCount = items.length;
    const isAllSelected = selectedCount === totalCount && totalCount > 0;
    const isIndeterminate = selectedCount > 0 && selectedCount < totalCount;

    const contextValue: CheckboxGroupContextValue = React.useMemo(
      () => ({
        values,
        setValue,
        selectAll: selectAllItems,
        clearAll: clearAllItems,
        isAllSelected,
        isIndeterminate,
        selectedCount,
        totalCount,
      }),
      [
        values,
        setValue,
        selectAllItems,
        clearAllItems,
        isAllSelected,
        isIndeterminate,
        selectedCount,
        totalCount,
      ]
    );

    return (
      <CheckboxGroupContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(
            filterCheckboxGroupVariants({ variant, layout }),
            className
          )}
          style={{ maxHeight }}
          {...props}
        >
          {title && (
            <h3 className={cn(checkboxGroupTitleVariants({ variant }))}>
              {title}
            </h3>
          )}

          {(searchable || selectAll || clearAll) && (
            <div className="mb-4 space-y-2">
              {searchable && (
                <div className="relative">
                  <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder={searchPlaceholder}
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full rounded-md border border-gray-300 py-2 pr-3 pl-10 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              )}

              {(selectAll || clearAll) && (
                <div className="flex gap-2">
                  {selectAll && (
                    <button
                      type="button"
                      onClick={selectAllItems}
                      disabled={isAllSelected}
                      className="text-xs text-blue-600 hover:text-blue-700 disabled:text-gray-400"
                    >
                      Select All ({totalCount})
                    </button>
                  )}
                  {clearAll && (
                    <button
                      type="button"
                      onClick={clearAllItems}
                      disabled={selectedCount === 0}
                      className="text-xs text-gray-600 hover:text-gray-700 disabled:text-gray-400"
                    >
                      Clear All
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          <div
            className={cn(
              layout === 'vertical' && 'space-y-3',
              layout === 'horizontal' && 'flex flex-wrap gap-4',
              layout === 'grid' &&
                'grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4',
              maxHeight && 'overflow-y-auto'
            )}
          >
            {filteredItems.map(item => (
              <FilterCheckboxItem key={item.id} {...item} />
            ))}
          </div>

          {searchTerm && filteredItems.length === 0 && (
            <div className="py-8 text-center text-gray-500">
              No filters found for &ldquo;{searchTerm}&rdquo;
            </div>
          )}
        </div>
      </CheckboxGroupContext.Provider>
    );
  }
);
FilterCheckboxGroup.displayName = 'FilterCheckboxGroup';

// Filter Checkbox Item
const FilterCheckboxItem = React.forwardRef<
  HTMLButtonElement,
  FilterCheckboxItemProps
>(
  (
    { id, label, description, count, context, onCheckedChange, ...props },
    ref
  ) => {
    const { values, setValue } = useCheckboxGroupContext();

    const handleChange = React.useCallback(
      (checked: boolean | 'indeterminate') => {
        const booleanChecked = checked === true;
        setValue(id, booleanChecked);
        if (typeof onCheckedChange === 'function') {
          onCheckedChange(booleanChecked);
        }
      },
      [id, setValue, onCheckedChange]
    );

    // eslint-disable-next-line security/detect-object-injection
    const itemChecked = values[id] ?? false;

    return (
      <Checkbox
        ref={ref}
        checked={itemChecked}
        onCheckedChange={handleChange}
        className={cn(context && recipeCheckboxVariants({ context }))}
        label={
          <div className="flex w-full items-center justify-between">
            <span>{label}</span>
            {count !== undefined && (
              <span className="ml-2 text-xs text-gray-500">({count})</span>
            )}
          </div>
        }
        description={description}
        {...props}
      />
    );
  }
);
FilterCheckboxItem.displayName = 'FilterCheckboxItem';

// Animated Checkbox
const AnimatedCheckbox = React.forwardRef<
  HTMLButtonElement,
  AnimatedCheckboxProps
>(
  (
    { animationDuration = 200, animation = 'none', loading = false, ...props },
    ref
  ) => {
    return (
      <Checkbox
        ref={ref}
        className={cn(
          animatedCheckboxVariants({ animation, loading }),
          animation === 'scale' && 'transition-transform hover:scale-105'
        )}
        style={{
          transitionDuration: `${animationDuration}ms`,
        }}
        loading={loading}
        {...props}
      />
    );
  }
);
AnimatedCheckbox.displayName = 'AnimatedCheckbox';

// Search Checkbox
const SearchCheckbox = React.forwardRef<HTMLButtonElement, SearchCheckboxProps>(
  (
    {
      className,
      selected = false,
      searchTerm,
      highlightMatch = true,
      count,
      badge,
      label,
      ...props
    },
    ref
  ) => {
    const highlightedLabel = React.useMemo(() => {
      if (!highlightMatch || !searchTerm || typeof label !== 'string') {
        return label;
      }

      // Escape special regex characters to prevent ReDoS attacks
      const escapedSearchTerm = searchTerm.replace(
        /[.*+?^${}()|[\]\\]/g,
        '\\$&'
      );
      // eslint-disable-next-line security/detect-non-literal-regexp
      const parts = label.split(new RegExp(`(${escapedSearchTerm})`, 'gi')); // nosemgrep
      return parts.map((part, index) =>
        part.toLowerCase() === searchTerm.toLowerCase() ? (
          <mark
            key={`highlight-${index}-${part}`}
            className="bg-yellow-200 text-yellow-900"
          >
            {part}
          </mark>
        ) : (
          <span key={`text-${index}-${part}`}>{part}</span>
        )
      );
    }, [label, searchTerm, highlightMatch]);

    return (
      <div className={cn(searchCheckboxVariants({ selected }), className)}>
        <Checkbox
          ref={ref}
          label={
            <div className="flex w-full items-center justify-between">
              <span>{highlightedLabel}</span>
              <div className="flex items-center gap-2">
                {count !== undefined && (
                  <span className="text-xs text-gray-500">({count})</span>
                )}
                {badge && <span>{badge}</span>}
              </div>
            </div>
          }
          {...props}
        />
      </div>
    );
  }
);
SearchCheckbox.displayName = 'SearchCheckbox';

// Multi-Select Filter
const MultiSelectFilter = React.forwardRef<
  HTMLDivElement,
  MultiSelectFilterProps
>(
  (
    {
      title,
      options,
      selectedValues,
      onSelectionChange,
      searchable = true,
      placeholder = 'Search options...',
      maxSelections,
      variant = 'filters',
      layout = 'vertical',
      showCount = true,
      allowSelectAll = true,
      allowClearAll = true,
      ...props
    },
    ref
  ) => {
    const values = React.useMemo(() => {
      const result: Record<string, boolean> = {};
      options.forEach(option => {
        result[option.id] = selectedValues.includes(option.value ?? option.id);
      });
      return result;
    }, [options, selectedValues]);

    const handleValuesChange = React.useCallback(
      (newValues: Record<string, boolean>) => {
        const selected = Object.entries(newValues)
          .filter(([, checked]) => checked)
          .map(([id]) => {
            const option = options.find(opt => opt.id === id);
            return option?.value ?? id;
          });

        if (maxSelections && selected.length > maxSelections) {
          return;
        }

        onSelectionChange(selected);
      },
      [options, maxSelections, onSelectionChange]
    );

    return (
      <FilterCheckboxGroup
        ref={ref}
        title={
          showCount ? (
            <div className="flex items-center justify-between">
              <span>{title}</span>
              <span className="text-sm font-normal text-gray-500">
                {selectedValues.length}
                {maxSelections && ` / ${maxSelections}`}
              </span>
            </div>
          ) : (
            title
          )
        }
        items={options}
        values={values}
        onValuesChange={handleValuesChange}
        variant={variant}
        layout={layout}
        searchable={searchable}
        searchPlaceholder={placeholder}
        selectAll={allowSelectAll}
        clearAll={allowClearAll}
        {...props}
      />
    );
  }
);
MultiSelectFilter.displayName = 'MultiSelectFilter';

export {
  Checkbox,
  CheckboxRoot,
  CheckboxInput,
  CheckboxIcon,
  CheckboxLabel,
  CheckboxDescription,
  CheckboxField,
  FilterCheckboxGroup,
  FilterCheckboxItem,
  AnimatedCheckbox,
  SearchCheckbox,
  MultiSelectFilter,
};
