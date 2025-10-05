'use client';

import * as React from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import { cn } from '@/lib/utils';
import {
  switchVariants,
  switchTrackVariants,
  switchThumbVariants,
  switchLabelVariants,
  switchDescriptionVariants,
  recipeSwitchGroupVariants,
  recipeSwitchVariants,
  switchGroupTitleVariants,
  animatedSwitchVariants,
  switchFieldVariants,
  switchErrorVariants,
} from '@/lib/ui/switch-variants';
import type {
  SwitchProps,
  SwitchRootProps,
  SwitchTrackProps,
  SwitchThumbProps,
  SwitchLabelProps,
  SwitchDescriptionProps,
  SwitchFieldProps,
  RecipeSwitchGroupProps,
  RecipeSwitchItemProps,
  SwitchContextValue,
  SwitchGroupContextValue,
  AnimatedSwitchProps,
  SettingsSwitchProps,
} from '@/types/ui/switch';
import {
  SwitchContext,
  SwitchGroupContext,
  useSwitchContext,
  useSwitchGroupContext,
} from '@/hooks/components/ui/switch-hooks';

// Main Switch Component
const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
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
      onCheckedChange,
      checkedIcon,
      uncheckedIcon,
      name,
      value,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const switchId = id ?? generatedId;
    const descriptionId = description ? `${switchId}-description` : undefined;
    const errorId = error ? `${switchId}-error` : undefined;

    return (
      <div
        className={cn(
          switchVariants({ orientation, disabled }),
          error && 'text-error',
          className
        )}
      >
        <SwitchPrimitive.Root
          ref={ref}
          id={switchId}
          className={cn(
            switchTrackVariants({ size, variant, disabled }),
            animatedSwitchVariants({ loading }),
            'ml-3'
          )}
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          disabled={disabled || loading}
          checked={checked}
          defaultChecked={defaultChecked}
          onCheckedChange={onCheckedChange}
          name={name}
          value={value}
          aria-describedby={cn(descriptionId, errorId)}
          aria-invalid={!!error}
          aria-required={required}
          {...props}
        >
          <SwitchPrimitive.Thumb className={cn(switchThumbVariants({ size }))}>
            {(checked ?? defaultChecked) ? checkedIcon : uncheckedIcon}
          </SwitchPrimitive.Thumb>
        </SwitchPrimitive.Root>

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
                htmlFor={switchId}
                className={cn(
                  switchLabelVariants({ size, required }),
                  disabled && 'cursor-not-allowed opacity-50'
                )}
              >
                {label}
              </label>
            )}
            {description && (
              <span
                id={descriptionId}
                className={cn(switchDescriptionVariants({ size }))}
              >
                {description}
              </span>
            )}
            {error && (
              <span
                id={errorId}
                className={cn(switchErrorVariants({ size }))}
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
Switch.displayName = 'Switch';

// Compound Components
const SwitchRoot = React.forwardRef<HTMLDivElement, SwitchRootProps>(
  (
    {
      className,
      orientation = 'horizontal',
      disabled = false,
      checked: controlledChecked,
      defaultChecked = false,
      onCheckedChange,
      children,
      ...props
    },
    ref
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null!);
    const [checked, setChecked] = React.useState(
      controlledChecked ?? defaultChecked
    );

    React.useEffect(() => {
      if (controlledChecked !== undefined) {
        setChecked(controlledChecked);
      }
    }, [controlledChecked]);

    const toggle = React.useCallback(() => {
      if (disabled) return;
      const newValue = !checked;
      setChecked(newValue);
      onCheckedChange?.(newValue);
    }, [checked, disabled, onCheckedChange]);

    const contextValue: SwitchContextValue = React.useMemo(
      () => ({
        checked,
        disabled,
        toggle,
        inputRef,
      }),
      [checked, disabled, toggle]
    );

    return (
      <SwitchContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(switchVariants({ orientation, disabled }), className)}
          {...props}
        >
          {children}
        </div>
      </SwitchContext.Provider>
    );
  }
);
SwitchRoot.displayName = 'SwitchRoot';

const SwitchTrack = React.forwardRef<HTMLButtonElement, SwitchTrackProps>(
  (
    { className, size = 'md', variant = 'default', loading = false, ...props },
    ref
  ) => {
    const { checked, disabled, toggle } = useSwitchContext();

    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={checked}
        data-state={checked ? 'checked' : 'unchecked'}
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- Need || to handle false values
        disabled={disabled || loading}
        className={cn(
          switchTrackVariants({ size, variant, disabled }),
          animatedSwitchVariants({ loading }),
          className
        )}
        onClick={toggle}
        {...props}
      />
    );
  }
);
SwitchTrack.displayName = 'SwitchTrack';

const SwitchThumb = React.forwardRef<HTMLSpanElement, SwitchThumbProps>(
  ({ className, size = 'md', checkedIcon, uncheckedIcon, ...props }, ref) => {
    const { checked } = useSwitchContext();

    return (
      <span
        ref={ref}
        data-state={checked ? 'checked' : 'unchecked'}
        className={cn(switchThumbVariants({ size }), className)}
        {...props}
      >
        {checked ? checkedIcon : uncheckedIcon}
      </span>
    );
  }
);
SwitchThumb.displayName = 'SwitchThumb';

const SwitchLabel = React.forwardRef<HTMLLabelElement, SwitchLabelProps>(
  ({ className, size = 'md', required = false, ...props }, ref) => {
    const { disabled } = useSwitchContext();

    return (
      <label
        ref={ref}
        className={cn(
          switchLabelVariants({ size, required }),
          disabled && 'cursor-not-allowed opacity-50',
          className
        )}
        {...props}
      />
    );
  }
);
SwitchLabel.displayName = 'SwitchLabel';

const SwitchDescription = React.forwardRef<
  HTMLSpanElement,
  SwitchDescriptionProps
>(({ className, size = 'md', ...props }, ref) => {
  return (
    <span
      ref={ref}
      className={cn(switchDescriptionVariants({ size }), className)}
      {...props}
    />
  );
});
SwitchDescription.displayName = 'SwitchDescription';

// Switch Field (form field wrapper)
const SwitchField = React.forwardRef<HTMLButtonElement, SwitchFieldProps>(
  ({ className, label, error, helperText, ...props }, ref) => {
    const fieldId = React.useId();

    return (
      <div className={cn(switchFieldVariants({ error: !!error }), className)}>
        <Switch
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
SwitchField.displayName = 'SwitchField';

// Recipe Switch Group
const RecipeSwitchGroup = React.forwardRef<
  HTMLDivElement,
  RecipeSwitchGroupProps
>(
  (
    {
      className,
      variant = 'preferences',
      title,
      switches,
      onBatchChange,
      ...props
    },
    ref
  ) => {
    const [values, setValues] = React.useState<Record<string, boolean>>(() => {
      const initial: Record<string, boolean> = {};
      switches.forEach(s => {
        initial[s.id] = s.defaultChecked ?? false;
      });
      return initial;
    });

    const setValue = React.useCallback(
      (id: string, value: boolean) => {
        setValues(prev => {
          const updated = { ...prev, [id]: value };
          // Defer the callback to avoid setState during render
          React.startTransition(() => {
            onBatchChange?.(updated);
          });
          return updated;
        });
      },
      [onBatchChange]
    );

    const contextValue: SwitchGroupContextValue = React.useMemo(
      () => ({
        values,
        setValue,
      }),
      [values, setValue]
    );

    return (
      <SwitchGroupContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(recipeSwitchGroupVariants({ variant }), className)}
          {...props}
        >
          {title && (
            <h3 className={cn(switchGroupTitleVariants({ variant }))}>
              {title}
            </h3>
          )}
          <div className="space-y-3">
            {switches.map(switchProps => (
              <RecipeSwitchItem key={switchProps.id} {...switchProps} />
            ))}
          </div>
        </div>
      </SwitchGroupContext.Provider>
    );
  }
);
RecipeSwitchGroup.displayName = 'RecipeSwitchGroup';

// Recipe Switch Item
const RecipeSwitchItem = React.forwardRef<
  HTMLButtonElement,
  RecipeSwitchItemProps
>(({ id, context, className, onCheckedChange, ...props }, ref) => {
  const { values, setValue } = useSwitchGroupContext();

  const handleChange = React.useCallback(
    (checked: boolean) => {
      setValue(id, checked);
      onCheckedChange?.(checked);
    },
    [id, setValue, onCheckedChange]
  );

  // eslint-disable-next-line security/detect-object-injection
  const itemChecked = values[id] ?? false;

  return (
    <Switch
      ref={ref}
      checked={itemChecked}
      onCheckedChange={handleChange}
      className={cn(context && recipeSwitchVariants({ context }), className)}
      {...props}
    />
  );
});
RecipeSwitchItem.displayName = 'RecipeSwitchItem';

// Animated Switch
const AnimatedSwitch = React.forwardRef<HTMLButtonElement, AnimatedSwitchProps>(
  ({ animationDuration = 200, animationType = 'slide', ...props }, ref) => {
    return (
      <Switch
        ref={ref}
        className={cn(
          animationType === 'fade' && 'transition-opacity',
          animationType === 'scale' && 'transition-transform hover:scale-105',
          '[transition-duration:var(--switch-duration,200ms)]'
        )}
        style={
          {
            '--switch-duration': `${animationDuration}ms`,
          } as React.CSSProperties
        }
        {...props}
      />
    );
  }
);
AnimatedSwitch.displayName = 'AnimatedSwitch';

// Settings Switch
const SettingsSwitch = React.forwardRef<HTMLButtonElement, SettingsSwitchProps>(
  ({ icon, badge, onChange, optimisticUpdate = true, ...props }, ref) => {
    const [isUpdating, setIsUpdating] = React.useState(false);
    const [optimisticValue, setOptimisticValue] = React.useState(props.checked);

    const handleChange = React.useCallback(
      async (checked: boolean) => {
        if (onChange) {
          if (optimisticUpdate) {
            setOptimisticValue(checked);
          }
          setIsUpdating(true);
          try {
            await onChange(checked);
          } catch (error) {
            // Revert optimistic update on error
            if (optimisticUpdate) {
              setOptimisticValue(!checked);
            }
            throw error;
          } finally {
            setIsUpdating(false);
          }
        }
        props.onCheckedChange?.(checked);
      },
      [onChange, optimisticUpdate, props]
    );

    return (
      <div className="flex items-center gap-3">
        {icon && <span className="text-lg">{icon}</span>}
        <Switch
          ref={ref}
          checked={optimisticUpdate ? optimisticValue : props.checked}
          onCheckedChange={handleChange}
          loading={isUpdating}
          {...props}
        />
        {badge && <span className="ml-auto">{badge}</span>}
      </div>
    );
  }
);
SettingsSwitch.displayName = 'SettingsSwitch';

export {
  Switch,
  SwitchRoot,
  SwitchTrack,
  SwitchThumb,
  SwitchLabel,
  SwitchDescription,
  SwitchField,
  RecipeSwitchGroup,
  RecipeSwitchItem,
  AnimatedSwitch,
  SettingsSwitch,
};
