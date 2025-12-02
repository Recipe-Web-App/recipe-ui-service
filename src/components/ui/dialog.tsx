import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import {
  dialogOverlayVariants,
  dialogContentVariants,
  dialogHeaderVariants,
  dialogTitleVariants,
  dialogDescriptionVariants,
  dialogFooterVariants,
  dialogCloseVariants,
  confirmationDialogVariants,
  dialogIconVariants,
  recipeDialogVariants,
  dialogButtonVariants,
} from '@/lib/ui/dialog-variants';

/**
 * Dialog root component
 */
const Dialog = DialogPrimitive.Root;

/**
 * Dialog trigger component
 */
const DialogTrigger = DialogPrimitive.Trigger;

/**
 * Dialog portal component for rendering outside DOM tree
 */
const DialogPortal = DialogPrimitive.Portal;

/**
 * Dialog close component
 */
const DialogClose = DialogPrimitive.Close;

/**
 * Dialog overlay component with variants
 */
const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay> &
    VariantProps<typeof dialogOverlayVariants>
>(({ className, variant, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(dialogOverlayVariants({ variant }), className)}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

/**
 * Dialog content component with variants
 */
const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> &
    VariantProps<typeof dialogContentVariants> & {
      showCloseButton?: boolean;
    }
>(
  (
    { className, variant, size, showCloseButton = true, children, ...props },
    ref
  ) => (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(dialogContentVariants({ variant, size }), className)}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            className={cn(dialogCloseVariants({ variant }))}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
);
DialogContent.displayName = DialogPrimitive.Content.displayName;

/**
 * Dialog header component with variants
 */
const DialogHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> &
    VariantProps<typeof dialogHeaderVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(dialogHeaderVariants({ variant }), className)}
    {...props}
  />
));
DialogHeader.displayName = 'DialogHeader';

/**
 * Dialog footer component with variants
 */
const DialogFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> &
    VariantProps<typeof dialogFooterVariants>
>(({ className, layout, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(dialogFooterVariants({ layout }), className)}
    {...props}
  />
));
DialogFooter.displayName = 'DialogFooter';

/**
 * Dialog title component with variants
 */
const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title> &
    VariantProps<typeof dialogTitleVariants>
>(({ className, variant, size, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(dialogTitleVariants({ variant, size }), className)}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

/**
 * Dialog description component with variants
 */
const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description> &
    VariantProps<typeof dialogDescriptionVariants>
>(({ className, variant, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn(dialogDescriptionVariants({ variant }), className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

/**
 * Dialog icon component for confirmations
 */
const DialogIcon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof dialogIconVariants>
>(({ className, variant, size, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(dialogIconVariants({ variant, size }), className)}
    {...props}
  >
    {children}
  </div>
));
DialogIcon.displayName = 'DialogIcon';

/**
 * Dialog button component with action-specific styling
 */
const DialogButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> &
    VariantProps<typeof dialogButtonVariants>
>(({ className, intent, size, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(dialogButtonVariants({ intent, size }), className)}
    {...props}
  />
));
DialogButton.displayName = 'DialogButton';

/**
 * Confirmation dialog props interface
 */
export interface ConfirmationDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  type?: VariantProps<typeof confirmationDialogVariants>['type'];
  severity?: VariantProps<typeof confirmationDialogVariants>['severity'];
  variant?: VariantProps<typeof dialogContentVariants>['variant'];
  isLoading?: boolean;
  showCloseButton?: boolean;
  children?: React.ReactNode;
}

/**
 * Pre-built confirmation dialog component
 */
const ConfirmationDialog = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  ConfirmationDialogProps
>(
  (
    {
      open,
      onOpenChange,
      title,
      description,
      icon,
      confirmText = 'Confirm',
      cancelText = 'Cancel',
      onConfirm,
      onCancel,
      type = 'save',
      severity = 'medium',
      variant,
      isLoading = false,
      showCloseButton = true,
      children,
    },
    ref
  ) => {
    const handleConfirm = () => {
      onConfirm?.();
      onOpenChange?.(false);
    };

    const handleCancel = () => {
      onCancel?.();
      onOpenChange?.(false);
    };

    // Determine button intents based on type
    const getConfirmIntent = () => {
      switch (type) {
        case 'delete':
          return 'destructive';
        case 'save':
        case 'publish':
          return 'success';
        default:
          return 'primary';
      }
    };

    // Determine icon variant based on type
    const getIconVariant = () => {
      switch (type) {
        case 'delete':
        case 'discard':
          return 'destructive';
        case 'save':
        case 'publish':
          return 'success';
        default:
          return 'default';
      }
    };

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          ref={ref}
          variant={variant}
          showCloseButton={showCloseButton}
          className={cn(confirmationDialogVariants({ type, severity }))}
        >
          <DialogHeader>
            {icon && (
              <DialogIcon variant={getIconVariant()} className="mb-4">
                {icon}
              </DialogIcon>
            )}
            <DialogTitle>{title}</DialogTitle>
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>

          {children && <div className="py-4">{children}</div>}

          <DialogFooter>
            <DialogButton
              type="button"
              intent="secondary"
              onClick={handleCancel}
              disabled={isLoading}
            >
              {cancelText}
            </DialogButton>
            <DialogButton
              type="button"
              intent={getConfirmIntent()}
              onClick={handleConfirm}
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : confirmText}
            </DialogButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
);
ConfirmationDialog.displayName = 'ConfirmationDialog';

/**
 * Recipe confirmation dialog props interface
 */
export interface RecipeConfirmationDialogProps extends Omit<
  ConfirmationDialogProps,
  'type' | 'title'
> {
  action: VariantProps<typeof recipeDialogVariants>['action'];
  recipeName?: string;
  title?: string;
}

/**
 * Recipe-specific confirmation dialog component
 */
const RecipeConfirmationDialog = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  RecipeConfirmationDialogProps
>(
  (
    {
      action = 'save-recipe',
      recipeName,
      title,
      description,
      confirmText,
      cancelText = 'Cancel',
      ...props
    },
    ref
  ) => {
    // Generate action-specific content
    const getActionContent = () => {
      const name = recipeName ? ` "${recipeName}"` : ' this recipe';

      switch (action) {
        case 'delete-recipe':
          return {
            title: title ?? `Delete Recipe${name}`,
            description:
              description ??
              `Are you sure you want to delete${name}? This action cannot be undone.`,
            confirmText: confirmText ?? 'Delete Recipe',
            icon: '🗑️',
            type: 'delete' as const,
          };
        case 'save-recipe':
          return {
            title: title ?? `Save Recipe${name}`,
            description: description ?? `Save your changes to${name}?`,
            confirmText: confirmText ?? 'Save Recipe',
            icon: '💾',
            type: 'save' as const,
          };
        case 'publish-recipe':
          return {
            title: title ?? `Publish Recipe${name}`,
            description: description ?? `Make${name} public and searchable?`,
            confirmText: confirmText ?? 'Publish Recipe',
            icon: '🌍',
            type: 'publish' as const,
          };
        case 'share-recipe':
          return {
            title: title ?? `Share Recipe${name}`,
            description: description ?? `Generate a shareable link for${name}?`,
            confirmText: confirmText ?? 'Share Recipe',
            icon: '🔗',
            type: 'save' as const,
          };
        case 'export-recipe':
          return {
            title: title ?? `Export Recipe${name}`,
            description: description ?? `Export${name} to PDF or other format?`,
            confirmText: confirmText ?? 'Export Recipe',
            icon: '📁',
            type: 'save' as const,
          };
        case 'duplicate-recipe':
          return {
            title: title ?? `Duplicate Recipe${name}`,
            description: description ?? `Create a copy of${name}?`,
            confirmText: confirmText ?? 'Duplicate Recipe',
            icon: '📋',
            type: 'save' as const,
          };
        default:
          return {
            title: title ?? 'Confirm Action',
            description: description ?? 'Are you sure you want to proceed?',
            confirmText: confirmText ?? 'Confirm',
            icon: '❓',
            type: 'save' as const,
          };
      }
    };

    const actionContent = getActionContent();

    return (
      <ConfirmationDialog
        ref={ref}
        title={actionContent.title}
        description={actionContent.description}
        confirmText={actionContent.confirmText}
        cancelText={cancelText}
        type={actionContent.type}
        icon={<span className="text-2xl">{actionContent.icon}</span>}
        {...props}
      >
        <div className={cn(recipeDialogVariants({ action }))}>
          {props.children}
        </div>
      </ConfirmationDialog>
    );
  }
);
RecipeConfirmationDialog.displayName = 'RecipeConfirmationDialog';

/**
 * Alert dialog for simple confirmations
 */
export interface AlertDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  variant?: VariantProps<typeof dialogContentVariants>['variant'];
  isLoading?: boolean;
}

const AlertDialog = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  AlertDialogProps
>(
  (
    {
      open,
      onOpenChange,
      title,
      description,
      actionText = 'OK',
      onAction,
      variant = 'default',
      isLoading = false,
    },
    ref
  ) => {
    const handleAction = () => {
      onAction?.();
      onOpenChange?.(false);
    };

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent ref={ref} variant={variant} showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>

          <DialogFooter layout="center">
            <DialogButton
              type="button"
              intent="primary"
              onClick={handleAction}
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : actionText}
            </DialogButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
);
AlertDialog.displayName = 'AlertDialog';

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogIcon,
  DialogButton,
  ConfirmationDialog,
  RecipeConfirmationDialog,
  AlertDialog,
};
