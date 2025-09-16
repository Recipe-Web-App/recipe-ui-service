'use client';

import * as React from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { Circle } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import {
  radioGroupVariants,
  radioInputVariants,
  radioLabelVariants,
  radioDescriptionVariants,
  radioErrorVariants,
  radioFieldVariants,
  recipeRadioGroupVariants,
  radioGroupTitleVariants,
  recipeRadioVariants,
  animatedRadioVariants,
  radioIconVariants,
  radioCardVariants,
} from '@/lib/ui/radio-variants';
import type {
  RadioGroupProps,
  RadioGroupRootProps,
  RadioInputProps,
  RadioLabelProps,
  RadioDescriptionProps,
  RadioIconProps,
  RadioFieldProps,
  RecipeRadioGroupProps,
  AnimatedRadioProps,
  RadioCardProps,
  RadioContextValue,
  RadioGroupContextValue,
  RecipeRadioOption,
} from '@/types/ui/radio';
import {
  RadioContext,
  RadioGroupContext,
  useRadioContext,
  useRadioGroupContext,
  useRadioGroupState,
  useRadioFocus,
} from '@/hooks/components/ui/radio-hooks';

// Main RadioGroup Component
const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      className,
      value,
      defaultValue,
      onValueChange,
      options,
      disabled = false,
      required = false,
      name,
      error,
      helperText,
      orientation = 'vertical',
      size = 'md',
      variant = 'default',
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const errorId = error ? `${generatedId}-error` : undefined;
    const helperTextId = helperText ? `${generatedId}-helper` : undefined;

    const { value: currentValue, setValue } = useRadioGroupState(
      value,
      defaultValue,
      onValueChange
    );

    const { handleKeyDown } = useRadioFocus(options, currentValue);

    const { dir, ...restProps } = props;

    return (
      <RadioGroupPrimitive.Root
        ref={ref}
        value={currentValue}
        onValueChange={setValue}
        disabled={disabled}
        required={required}
        name={name}
        aria-invalid={!!error}
        aria-disabled={disabled}
        aria-describedby={cn(errorId, helperTextId)}
        onKeyDown={(e: React.KeyboardEvent) => handleKeyDown(e, setValue)}
        className={cn(
          radioGroupVariants({ orientation, disabled }),
          error && 'text-red-600',
          className
        )}
        dir={dir as 'ltr' | 'rtl' | undefined}
        {...restProps}
      >
        {options.map(option => (
          <div
            key={option.id}
            className={cn(
              'flex items-start gap-3',
              disabled && 'cursor-not-allowed opacity-50'
            )}
          >
            <RadioGroupPrimitive.Item
              value={option.value}
              id={option.id}
              disabled={disabled || option.disabled}
              className={cn(
                radioInputVariants({
                  size,
                  variant,
                  disabled: disabled || option.disabled,
                }),
                'mt-1'
              )}
            >
              <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
                {option.icon ?? <Circle className="h-2 w-2 fill-current" />}
              </RadioGroupPrimitive.Indicator>
            </RadioGroupPrimitive.Item>

            <div className="flex-1 space-y-1">
              {option.label && (
                <label
                  htmlFor={option.id}
                  className={cn(
                    radioLabelVariants({ size, required }),
                    disabled || option.disabled
                      ? 'cursor-not-allowed opacity-50'
                      : 'cursor-pointer'
                  )}
                >
                  {option.label}
                </label>
              )}
              {option.description && (
                <div className={cn(radioDescriptionVariants({ size }))}>
                  {option.description}
                </div>
              )}
            </div>
          </div>
        ))}

        {helperText && (
          <div
            id={helperTextId}
            className={cn(radioDescriptionVariants({ size }))}
          >
            {helperText}
          </div>
        )}

        {error && (
          <div
            id={errorId}
            className={cn(radioErrorVariants({ size }))}
            role="alert"
          >
            {error}
          </div>
        )}
      </RadioGroupPrimitive.Root>
    );
  }
);
RadioGroup.displayName = 'RadioGroup';

// Compound Components
const RadioGroupRoot = React.forwardRef<HTMLDivElement, RadioGroupRootProps>(
  (
    {
      className,
      orientation = 'vertical',
      disabled = false,
      value: controlledValue,
      defaultValue,
      onValueChange,
      required = false,
      name,
      children,
      ...props
    },
    ref
  ) => {
    const { value, setValue } = useRadioGroupState(
      controlledValue,
      defaultValue,
      onValueChange
    );

    const [currentInputId, setCurrentInputId] = React.useState<string>('');

    const contextValue: RadioContextValue = React.useMemo(
      () => ({
        value,
        onValueChange: setValue,
        disabled,
        required,
        name,
        currentInputId,
        setCurrentInputId,
      }),
      [value, setValue, disabled, required, name, currentInputId]
    );

    const { dir, ...restProps } = props;

    return (
      <RadioContext.Provider value={contextValue}>
        <RadioGroupPrimitive.Root
          ref={ref}
          value={value}
          onValueChange={setValue}
          disabled={disabled}
          required={required}
          name={name}
          className={cn(
            radioGroupVariants({ orientation, disabled }),
            className
          )}
          dir={dir as 'ltr' | 'rtl' | undefined}
          {...restProps}
        >
          {children}
        </RadioGroupPrimitive.Root>
      </RadioContext.Provider>
    );
  }
);
RadioGroupRoot.displayName = 'RadioGroupRoot';

const RadioInput = React.forwardRef<HTMLButtonElement, RadioInputProps>(
  (
    {
      className,
      size = 'md',
      variant = 'default',
      loading = false,
      value,
      id,
      ...props
    },
    ref
  ) => {
    const { disabled, setCurrentInputId } = useRadioContext();
    const generatedId = React.useId();
    const inputId = id ?? `radio-${value}-${generatedId}`;

    React.useEffect(() => {
      setCurrentInputId?.(inputId);
    }, [inputId, setCurrentInputId]);

    return (
      <RadioGroupPrimitive.Item
        ref={ref}
        id={inputId}
        value={value}
        disabled={disabled || loading}
        className={cn(
          radioInputVariants({ size, variant, disabled }),
          animatedRadioVariants({ loading }),
          className
        )}
        {...props}
      >
        <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
          <Circle className="h-2 w-2 fill-current" />
        </RadioGroupPrimitive.Indicator>
      </RadioGroupPrimitive.Item>
    );
  }
);
RadioInput.displayName = 'RadioInput';

const RadioIcon = React.forwardRef<HTMLSpanElement, RadioIconProps>(
  ({ className, size = 'md', checked, children, ...props }, ref) => {
    const contextValue = useRadioContext()?.value;
    const finalChecked = checked ?? contextValue !== undefined;

    return (
      <span
        ref={ref}
        className={cn(
          radioIconVariants({
            size,
            state: finalChecked ? 'checked' : 'unchecked',
          }),
          className
        )}
        {...props}
      >
        {children ??
          (finalChecked ? <Circle className="h-2 w-2 fill-current" /> : null)}
      </span>
    );
  }
);
RadioIcon.displayName = 'RadioIcon';

const RadioLabel = React.forwardRef<HTMLLabelElement, RadioLabelProps>(
  ({ className, size = 'md', required = false, htmlFor, ...props }, ref) => {
    const { disabled, currentInputId } = useRadioContext();

    return (
      <label
        ref={ref}
        htmlFor={htmlFor ?? currentInputId}
        className={cn(
          radioLabelVariants({ size, required }),
          disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
          className
        )}
        {...props}
      />
    );
  }
);
RadioLabel.displayName = 'RadioLabel';

const RadioDescription = React.forwardRef<
  HTMLSpanElement,
  RadioDescriptionProps
>(({ className, size = 'md', ...props }, ref) => {
  return (
    <span
      ref={ref}
      className={cn(radioDescriptionVariants({ size }), className)}
      {...props}
    />
  );
});
RadioDescription.displayName = 'RadioDescription';

// Radio Field (form field wrapper)
const RadioField = React.forwardRef<HTMLDivElement, RadioFieldProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className={cn(radioFieldVariants({ error: !!error }), className)}>
        <RadioGroup ref={ref} error={error} {...props} />
      </div>
    );
  }
);
RadioField.displayName = 'RadioField';

// Recipe Radio Group
const RecipeRadioGroup = React.forwardRef<
  HTMLDivElement,
  RecipeRadioGroupProps
>(
  (
    {
      className,
      variant = 'options',
      layout = 'vertical',
      title,
      options,
      value: controlledValue,
      defaultValue,
      onValueChange,
      disabled = false,
      required = false,
      name,
      showCounts = true,
      maxWidth,
      ...props
    },
    ref
  ) => {
    const { value, setValue } = useRadioGroupState(
      controlledValue,
      defaultValue,
      onValueChange
    );

    const contextValue: RadioGroupContextValue = React.useMemo(
      () => ({
        value,
        setValue,
        clearSelection: () => setValue(''),
        disabled,
        required,
        name,
      }),
      [value, setValue, disabled, required, name]
    );

    return (
      <RadioGroupContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(
            recipeRadioGroupVariants({ variant, layout }),
            className
          )}
          style={{ maxWidth }}
          {...props}
        >
          {title && (
            <h3 className={cn(radioGroupTitleVariants({ variant }))}>
              {title}
            </h3>
          )}

          <RadioGroupPrimitive.Root
            value={value}
            onValueChange={setValue}
            disabled={disabled}
            required={required}
            name={name}
            className={cn(
              layout === 'vertical' && 'space-y-3',
              layout === 'horizontal' && 'flex flex-wrap gap-4',
              layout === 'grid' && 'grid grid-cols-2 gap-3 md:grid-cols-3'
            )}
          >
            {options.map(option => (
              <RecipeRadioItem
                key={option.id}
                {...option}
                showCount={showCounts}
              />
            ))}
          </RadioGroupPrimitive.Root>
        </div>
      </RadioGroupContext.Provider>
    );
  }
);
RecipeRadioGroup.displayName = 'RecipeRadioGroup';

// Recipe Radio Item
const RecipeRadioItem = React.forwardRef<
  HTMLButtonElement,
  RecipeRadioOption & { showCount?: boolean }
>(
  (
    {
      id,
      value,
      label,
      description,
      count,
      context,
      icon,
      showCount,
      ...props
    },
    ref
  ) => {
    const { setValue } = useRadioGroupContext();

    const handleSelect = React.useCallback(() => {
      setValue(value);
    }, [value, setValue]);

    return (
      <div className="flex items-start gap-3">
        <RadioGroupPrimitive.Item
          ref={ref}
          value={value}
          id={id}
          className={cn(
            radioInputVariants({ size: 'md', variant: 'default' }),
            context && recipeRadioVariants({ context }),
            'mt-1'
          )}
          onClick={handleSelect}
          {...props}
        >
          <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
            {icon ?? <Circle className="h-2 w-2 fill-current" />}
          </RadioGroupPrimitive.Indicator>
        </RadioGroupPrimitive.Item>

        <div className="flex-1">
          <label
            htmlFor={id}
            className={cn(
              radioLabelVariants({ size: 'md' }),
              'flex w-full cursor-pointer items-center justify-between'
            )}
          >
            <span>{label}</span>
            {showCount && count !== undefined && (
              <span className="ml-2 text-xs text-gray-500">({count})</span>
            )}
          </label>
          {description && (
            <div className={cn(radioDescriptionVariants({ size: 'md' }))}>
              {description}
            </div>
          )}
        </div>
      </div>
    );
  }
);
RecipeRadioItem.displayName = 'RecipeRadioItem';

// Animated Radio
const AnimatedRadio = React.forwardRef<HTMLDivElement, AnimatedRadioProps>(
  (
    {
      animationDuration = 200,
      animation = 'none',
      loading = false,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <RadioGroup
        ref={ref}
        className={cn(
          animatedRadioVariants({ animation, loading }),
          animation === 'scale' && 'transition-transform hover:scale-105',
          className
        )}
        style={{
          transitionDuration: `${animationDuration}ms`,
        }}
        {...props}
      />
    );
  }
);
AnimatedRadio.displayName = 'AnimatedRadio';

// Radio Card for recipe selection
const RadioCard = React.forwardRef<HTMLDivElement, RadioCardProps>(
  (
    {
      className,
      value,
      label,
      description,
      icon,
      badge,
      image,
      selected = false,
      size = 'md',
      disabled = false,
      onSelect,
      ...props
    },
    ref
  ) => {
    const handleClick = React.useCallback(() => {
      if (!disabled) {
        onSelect?.(value);
      }
    }, [disabled, onSelect, value]);

    return (
      <div
        ref={ref}
        className={cn(
          radioCardVariants({ selected, size, disabled }),
          className
        )}
        onClick={handleClick}
        onKeyDown={(e: React.KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-pressed={selected ?? undefined}
        {...props}
      >
        <div className="flex items-start gap-3">
          {image && (
            <Image
              src={image}
              alt=""
              width={48}
              height={48}
              className="h-12 w-12 rounded object-cover"
            />
          )}
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900 dark:text-gray-100">
                {label}
              </h4>
              {badge && <div className="ml-2">{badge}</div>}
            </div>
            {description && (
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {description}
              </p>
            )}
          </div>
          {icon && (
            <div className="text-gray-400 dark:text-gray-500">{icon}</div>
          )}
        </div>
        {selected && (
          <div className="absolute top-2 right-2">
            <Circle className="h-3 w-3 fill-blue-500 text-blue-500" />
          </div>
        )}
      </div>
    );
  }
);
RadioCard.displayName = 'RadioCard';

export {
  RadioGroup,
  RadioGroupRoot,
  RadioInput,
  RadioIcon,
  RadioLabel,
  RadioDescription,
  RadioField,
  RecipeRadioGroup,
  RecipeRadioItem,
  AnimatedRadio,
  RadioCard,
};
