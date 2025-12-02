import * as React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import {
  selectTriggerVariants,
  selectContentVariants,
  selectItemVariants,
  selectLabelVariants,
  selectSeparatorVariants,
  selectScrollButtonVariants,
} from '@/lib/ui/select-variants';

/**
 * Select root component
 */
const Select = SelectPrimitive.Root;

/**
 * Select group component
 */
const SelectGroup = SelectPrimitive.Group;

/**
 * Select value component
 */
const SelectValue = SelectPrimitive.Value;

/**
 * Select trigger component props interface
 */
export interface SelectTriggerProps
  extends
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>,
    VariantProps<typeof selectTriggerVariants> {
  error?: boolean;
}

/**
 * Select trigger component
 */
const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  SelectTriggerProps
>(({ className, variant, size, error, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(selectTriggerVariants({ variant, size, error, className }))}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4 opacity-50"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

/**
 * Select scroll up button component
 */
const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(selectScrollButtonVariants(), className)}
    {...props}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <path d="m18 15-6-6-6 6" />
    </svg>
  </SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

/**
 * Select scroll down button component
 */
const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(selectScrollButtonVariants(), className)}
    {...props}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  </SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName;

/**
 * Select content component props interface
 */
export interface SelectContentProps
  extends
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>,
    VariantProps<typeof selectContentVariants> {}

/**
 * Select content component
 */
const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  SelectContentProps
>(
  (
    { className, variant, size, children, position = 'popper', ...props },
    ref
  ) => (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        ref={ref}
        className={cn(selectContentVariants({ variant, size, className }))}
        position={position}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            'p-1',
            position === 'popper' &&
              'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]'
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
);
SelectContent.displayName = SelectPrimitive.Content.displayName;

/**
 * Select label component
 */
const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn(selectLabelVariants(), className)}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

/**
 * Select item component props interface
 */
export interface SelectItemProps
  extends
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>,
    VariantProps<typeof selectItemVariants> {}

/**
 * Select item component
 */
const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  SelectItemProps
>(({ className, variant, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(selectItemVariants({ variant, className }))}
    {...props}
  >
    <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
        >
          <polyline points="20,6 9,17 4,12" />
        </svg>
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

/**
 * Select separator component
 */
const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn(selectSeparatorVariants(), className)}
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

/**
 * Convenience component for complete select field with label and error
 */
export interface SelectFieldProps extends Omit<
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Root>,
  'children'
> {
  label?: string;
  error?: string;
  required?: boolean;
  placeholder?: string;
  children: React.ReactNode;
  className?: string;
  triggerProps?: Omit<SelectTriggerProps, 'children'>;
  contentProps?: SelectContentProps;
  variant?: SelectTriggerProps['variant'];
  size?: SelectTriggerProps['size'];
}

/**
 * Complete select field component with label and error handling
 */
const SelectField = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  SelectFieldProps
>(
  (
    {
      label,
      error,
      required,
      placeholder,
      children,
      className,
      triggerProps,
      contentProps,
      variant,
      size,
      ...props
    },
    ref
  ) => {
    const id = React.useId();
    const errorId = `${id}-error`;
    const hasError = Boolean(error);

    return (
      <div className={cn('space-y-2', className)}>
        {label && (
          <label
            htmlFor={id}
            className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}
        <Select {...props}>
          <SelectTrigger
            ref={ref}
            id={id}
            error={hasError}
            variant={variant}
            size={size}
            aria-describedby={hasError ? errorId : undefined}
            aria-invalid={hasError}
            {...triggerProps}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent {...contentProps}>{children}</SelectContent>
        </Select>
        {error && (
          <p
            id={errorId}
            role="alert"
            className="text-sm font-medium text-red-500"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);
SelectField.displayName = 'SelectField';

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
  SelectField,
};
