import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import {
  popoverContentVariants,
  popoverArrowVariants,
  popoverTriggerVariants,
  popoverCloseVariants,
} from '@/lib/ui/popover-variants';

/**
 * Popover root component
 */
const Popover = PopoverPrimitive.Root;

/**
 * Popover portal component
 */
const PopoverPortal = PopoverPrimitive.Portal;

/**
 * Popover anchor component for custom positioning
 */
const PopoverAnchor = PopoverPrimitive.Anchor;

/**
 * Popover trigger component props interface
 */
export interface PopoverTriggerProps
  extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger>,
    VariantProps<typeof popoverTriggerVariants> {
  asChild?: boolean;
}

/**
 * Popover trigger component
 */
const PopoverTrigger = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Trigger>,
  PopoverTriggerProps
>(({ className, variant, asChild = true, ...props }, ref) => (
  <PopoverPrimitive.Trigger
    ref={ref}
    asChild={asChild}
    className={cn(!asChild && popoverTriggerVariants({ variant }), className)}
    {...props}
  />
));
PopoverTrigger.displayName = PopoverPrimitive.Trigger.displayName;

/**
 * Popover close button component
 */
const PopoverClose = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Close>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Close>
>(({ className, ...props }, ref) => (
  <PopoverPrimitive.Close
    ref={ref}
    className={cn(popoverCloseVariants(), className)}
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
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
    <span className="sr-only">Close</span>
  </PopoverPrimitive.Close>
));
PopoverClose.displayName = PopoverPrimitive.Close.displayName;

/**
 * Popover content component props interface
 */
export interface PopoverContentProps
  extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>,
    VariantProps<typeof popoverContentVariants> {
  showArrow?: boolean;
  showClose?: boolean;
}

/**
 * Popover content component
 */
const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  PopoverContentProps
>(
  (
    {
      className,
      variant,
      size,
      showArrow = true,
      showClose = false,
      align = 'center',
      sideOffset = 4,
      children,
      ...props
    },
    ref
  ) => (
    <PopoverPortal>
      <PopoverPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        className={cn(popoverContentVariants({ variant, size }), className)}
        {...props}
      >
        {showClose && <PopoverClose />}
        {children}
        {showArrow && (
          <PopoverPrimitive.Arrow
            className={cn(popoverArrowVariants({ variant }))}
            width={10}
            height={5}
          />
        )}
      </PopoverPrimitive.Content>
    </PopoverPortal>
  )
);
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

/**
 * Simple popover wrapper component props interface
 */
export interface SimplePopoverProps
  extends Omit<PopoverContentProps, 'children' | 'content'> {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  modal?: boolean;
}

/**
 * Simple popover wrapper for easy usage
 */
const SimplePopover = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  SimplePopoverProps
>(
  (
    {
      content,
      children,
      side = 'bottom',
      align = 'center',
      variant,
      size,
      showArrow,
      showClose,
      open,
      defaultOpen,
      onOpenChange,
      modal = true,
      ...props
    },
    ref
  ) => (
    <Popover
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      modal={modal}
    >
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        ref={ref}
        side={side}
        align={align}
        variant={variant}
        size={size}
        showArrow={showArrow}
        showClose={showClose}
        {...props}
      >
        {content}
      </PopoverContent>
    </Popover>
  )
);
SimplePopover.displayName = 'SimplePopover';

/**
 * Menu popover component props interface
 */
export interface MenuPopoverProps
  extends Omit<SimplePopoverProps, 'content' | 'children'> {
  items: Array<
    | {
        label: string;
        icon?: React.ReactNode;
        onClick?: () => void;
        disabled?: boolean;
        shortcut?: string;
        divider?: false;
      }
    | {
        divider: true;
        label?: never;
        icon?: never;
        onClick?: never;
        disabled?: never;
        shortcut?: never;
      }
  >;
  children: React.ReactNode;
}

/**
 * Menu popover for action lists
 */
const MenuPopover = React.forwardRef<
  React.ComponentRef<typeof PopoverPrimitive.Content>,
  MenuPopoverProps
>(({ items, children, variant = 'light', size = 'default', ...props }, ref) => {
  const content = (
    <div className="w-full">
      {items.map((item, index) => {
        if (item.divider) {
          return (
            <div
              key={`divider-${index}`}
              className="my-1 h-px bg-gray-200 dark:bg-gray-700"
            />
          );
        }
        return (
          <button
            key={`${item.label}-${index}`}
            onClick={item.onClick}
            disabled={item.disabled}
            className={cn(
              'flex w-full items-center justify-between rounded-sm px-2 py-1.5 text-sm transition-colors outline-none',
              item.disabled
                ? 'cursor-not-allowed opacity-50'
                : 'hover:bg-gray-100 focus:bg-gray-100 dark:hover:bg-gray-800 dark:focus:bg-gray-800'
            )}
          >
            <span className="flex items-center gap-2">
              {item.icon && <span className="h-4 w-4">{item.icon}</span>}
              <span>{item.label}</span>
            </span>
            {item.shortcut && (
              <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">
                {item.shortcut}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );

  return (
    <SimplePopover
      ref={ref}
      content={content}
      variant={variant}
      size={size}
      {...props}
    >
      {children}
    </SimplePopover>
  );
});
MenuPopover.displayName = 'MenuPopover';

/**
 * Form popover component props interface
 */
export interface FormPopoverProps
  extends Omit<SimplePopoverProps, 'content' | 'children'> {
  title?: string;
  description?: string;
  children: React.ReactNode;
  form: React.ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
  submitLabel?: string;
  cancelLabel?: string;
}

/**
 * Form popover for inline editing
 */
const FormPopover = React.forwardRef<
  React.ComponentRef<typeof PopoverPrimitive.Content>,
  FormPopoverProps
>(
  (
    {
      title,
      description,
      children,
      form,
      onSubmit,
      submitLabel = 'Save',
      cancelLabel = 'Cancel',
      variant = 'light',
      size = 'lg',
      onOpenChange,
      ...props
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);

    const handleOpenChange = React.useCallback(
      (newOpen: boolean) => {
        setOpen(newOpen);
        onOpenChange?.(newOpen);
      },
      [onOpenChange]
    );

    const handleSubmit = React.useCallback(
      (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit?.(e);
        setOpen(false);
      },
      [onSubmit]
    );

    const content = (
      <form onSubmit={handleSubmit} className="space-y-4">
        {title && <h3 className="text-lg font-semibold">{title}</h3>}
        {description && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {description}
          </p>
        )}
        <div className="space-y-3">{form}</div>
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            {cancelLabel}
          </button>
          <button
            type="submit"
            className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            {submitLabel}
          </button>
        </div>
      </form>
    );

    return (
      <SimplePopover
        ref={ref}
        content={content}
        variant={variant}
        size={size}
        open={open}
        onOpenChange={handleOpenChange}
        {...props}
      >
        {children}
      </SimplePopover>
    );
  }
);
FormPopover.displayName = 'FormPopover';

/**
 * Confirm popover component props interface
 */
export interface ConfirmPopoverProps
  extends Omit<SimplePopoverProps, 'content' | 'children'> {
  title?: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmVariant?: 'default' | 'danger' | 'warning';
  children: React.ReactNode;
}

/**
 * Confirmation popover for dangerous actions
 */
const ConfirmPopover = React.forwardRef<
  React.ComponentRef<typeof PopoverPrimitive.Content>,
  ConfirmPopoverProps
>(
  (
    {
      title,
      description,
      confirmLabel = 'Confirm',
      cancelLabel = 'Cancel',
      onConfirm,
      onCancel,
      confirmVariant = 'default',
      children,
      variant = 'light',
      size = 'default',
      onOpenChange,
      ...props
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);

    const handleOpenChange = React.useCallback(
      (newOpen: boolean) => {
        setOpen(newOpen);
        onOpenChange?.(newOpen);
      },
      [onOpenChange]
    );

    const handleConfirm = React.useCallback(() => {
      onConfirm?.();
      setOpen(false);
    }, [onConfirm]);

    const handleCancel = React.useCallback(() => {
      onCancel?.();
      setOpen(false);
    }, [onCancel]);

    const confirmButtonClass = cn(
      'rounded px-3 py-1.5 text-sm font-medium text-white',
      {
        'bg-blue-600 hover:bg-blue-700': confirmVariant === 'default',
        'bg-red-600 hover:bg-red-700': confirmVariant === 'danger',
        'bg-yellow-600 hover:bg-yellow-700': confirmVariant === 'warning',
      }
    );

    const content = (
      <div className="space-y-4">
        {title && <h3 className="text-lg font-semibold">{title}</h3>}
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {description}
        </p>
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={handleCancel}
            className="rounded px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className={confirmButtonClass}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    );

    return (
      <SimplePopover
        ref={ref}
        content={content}
        variant={variant}
        size={size}
        open={open}
        onOpenChange={handleOpenChange}
        {...props}
      >
        {children}
      </SimplePopover>
    );
  }
);
ConfirmPopover.displayName = 'ConfirmPopover';

export {
  Popover,
  PopoverPortal,
  PopoverAnchor,
  PopoverTrigger,
  PopoverContent,
  PopoverClose,
  SimplePopover,
  MenuPopover,
  FormPopover,
  ConfirmPopover,
};
