import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import {
  modalOverlayVariants,
  modalContentVariants,
  modalHeaderVariants,
  modalBodyVariants,
  modalTitleVariants,
  modalDescriptionVariants,
  modalCloseVariants,
} from '@/lib/ui/modal-variants';

/**
 * Modal root component props interface
 */
interface ModalProps extends DialogPrimitive.DialogProps {
  children?: React.ReactNode;
}

/**
 * Modal trigger component props interface
 */
interface ModalTriggerProps extends DialogPrimitive.DialogTriggerProps {
  asChild?: boolean;
}

/**
 * Modal overlay component props interface
 */
interface ModalOverlayProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>,
    VariantProps<typeof modalOverlayVariants> {}

/**
 * Modal content component props interface
 */
interface ModalContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    VariantProps<typeof modalContentVariants> {
  showClose?: boolean;
}

/**
 * Modal header component props interface
 */
type ModalHeaderProps = React.HTMLAttributes<HTMLDivElement>;

/**
 * Modal body component props interface
 */
type ModalBodyProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof modalBodyVariants>;

/**
 * Modal footer component props interface
 */
type ModalFooterProps = React.HTMLAttributes<HTMLDivElement>;

/**
 * Modal title component props interface
 */
type ModalTitleProps = React.ComponentPropsWithoutRef<
  typeof DialogPrimitive.Title
>;

/**
 * Modal description component props interface
 */
type ModalDescriptionProps = React.ComponentPropsWithoutRef<
  typeof DialogPrimitive.Description
>;

/**
 * Modal close component props interface
 */
type ModalCloseProps = React.ComponentPropsWithoutRef<
  typeof DialogPrimitive.Close
> &
  VariantProps<typeof modalCloseVariants>;

/**
 * Modal Root Component
 *
 * The root container for the modal. Handles the open/closed state and
 * provides context for all child components.
 *
 * @example
 * ```tsx
 * <Modal open={isOpen} onOpenChange={setIsOpen}>
 *   <ModalTrigger>Open Modal</ModalTrigger>
 *   <ModalContent>
 *     <ModalHeader>
 *       <ModalTitle>Modal Title</ModalTitle>
 *     </ModalHeader>
 *     <ModalBody>Modal content</ModalBody>
 *   </ModalContent>
 * </Modal>
 * ```
 */
const Modal: React.FC<ModalProps> = DialogPrimitive.Root;

/**
 * Modal Trigger Component
 *
 * Button that opens the modal when clicked. Automatically receives
 * proper ARIA attributes for accessibility.
 *
 * @example
 * ```tsx
 * <ModalTrigger asChild>
 *   <Button variant="primary">Open Recipe Details</Button>
 * </ModalTrigger>
 * ```
 */
const ModalTrigger = DialogPrimitive.Trigger;

/**
 * Modal Portal Component
 *
 * Renders the modal in a portal outside the normal DOM tree.
 * This ensures proper layering and prevents z-index issues.
 */
const ModalPortal = DialogPrimitive.Portal;

/**
 * Modal Overlay Component
 *
 * The backdrop behind the modal content. Handles click-outside-to-close
 * behavior and provides visual separation from the page content.
 *
 * @example
 * ```tsx
 * <ModalOverlay variant="dark" />
 * ```
 */
const ModalOverlay = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Overlay>,
  ModalOverlayProps
>(({ className, variant, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(modalOverlayVariants({ variant }), className)}
    {...props}
  />
));
ModalOverlay.displayName = 'ModalOverlay';

/**
 * Modal Content Component
 *
 * The main modal container that holds the modal content. Provides
 * automatic focus management, escape key handling, and animation.
 *
 * @example
 * ```tsx
 * <ModalContent variant="default" size="lg" showClose>
 *   <ModalHeader>
 *     <ModalTitle>Recipe Details</ModalTitle>
 *   </ModalHeader>
 *   <ModalBody scrollable>
 *     Long content that scrolls...
 *   </ModalBody>
 *   <ModalFooter>
 *     <Button>Save</Button>
 *   </ModalFooter>
 * </ModalContent>
 * ```
 */
const ModalContent = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  ModalContentProps
>(({ className, variant, size, showClose = true, children, ...props }, ref) => (
  <ModalPortal>
    {variant !== 'fullscreen' && <ModalOverlay variant="default" />}
    <DialogPrimitive.Content
      ref={ref}
      className={cn(modalContentVariants({ variant, size }), className)}
      {...props}
    >
      {children}
      {showClose && (
        <DialogPrimitive.Close className="hover:bg-accent focus:ring-ring absolute top-4 right-4 rounded-md p-2 opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:pointer-events-none">
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      )}
    </DialogPrimitive.Content>
  </ModalPortal>
));
ModalContent.displayName = 'ModalContent';

/**
 * Modal Header Component
 *
 * Container for the modal title and description. Provides consistent
 * spacing and layout for modal headers.
 *
 * @example
 * ```tsx
 * <ModalHeader>
 *   <ModalTitle>Delete Recipe</ModalTitle>
 *   <ModalDescription>
 *     This action cannot be undone.
 *   </ModalDescription>
 * </ModalHeader>
 * ```
 */
const ModalHeader: React.FC<ModalHeaderProps> = ({
  className,
  children,
  ...props
}) => (
  <div className={cn(modalHeaderVariants(), className)} {...props}>
    {children}
  </div>
);
ModalHeader.displayName = 'ModalHeader';

/**
 * Modal Body Component
 *
 * The main content area of the modal. Can be made scrollable for
 * long content while keeping the header and footer in view.
 *
 * @example
 * ```tsx
 * <ModalBody scrollable>
 *   <p>Long content that needs to scroll...</p>
 *   <RecipeInstructions />
 * </ModalBody>
 * ```
 */
const ModalBody: React.FC<ModalBodyProps> = ({
  className,
  scrollable,
  children,
  ...props
}) => (
  <div className={cn(modalBodyVariants({ scrollable }), className)} {...props}>
    {children}
  </div>
);
ModalBody.displayName = 'ModalBody';

/**
 * Modal Footer Component
 *
 * Container for action buttons and other footer content. Automatically
 * handles responsive layout (stacked on mobile, horizontal on desktop).
 *
 * @example
 * ```tsx
 * <ModalFooter>
 *   <Button variant="outline" onClick={onCancel}>
 *     Cancel
 *   </Button>
 *   <Button variant="destructive" onClick={onConfirm}>
 *     Delete Recipe
 *   </Button>
 * </ModalFooter>
 * ```
 */
const ModalFooter: React.FC<ModalFooterProps> = ({
  className,
  children,
  ...props
}) => (
  <div
    className={cn(
      'flex flex-col-reverse gap-2 p-6 pt-4 sm:flex-row sm:justify-center',
      className
    )}
    {...props}
  >
    {children}
  </div>
);
ModalFooter.displayName = 'ModalFooter';

/**
 * Modal Title Component
 *
 * The main heading for the modal. Automatically receives proper ARIA
 * attributes and connects to the modal content for screen readers.
 *
 * @example
 * ```tsx
 * <ModalTitle>Confirm Recipe Deletion</ModalTitle>
 * ```
 */
const ModalTitle = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Title>,
  ModalTitleProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(modalTitleVariants(), className)}
    {...props}
  />
));
ModalTitle.displayName = 'ModalTitle';

/**
 * Modal Description Component
 *
 * Descriptive text that provides additional context for the modal.
 * Automatically connects to screen readers for accessibility.
 *
 * @example
 * ```tsx
 * <ModalDescription>
 *   Are you sure you want to delete this recipe? This action cannot be undone.
 * </ModalDescription>
 * ```
 */
const ModalDescription = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Description>,
  ModalDescriptionProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn(modalDescriptionVariants(), className)}
    {...props}
  />
));
ModalDescription.displayName = 'ModalDescription';

/**
 * Modal Close Component
 *
 * Button that closes the modal when clicked. Can be customized with
 * different variants and used anywhere within the modal.
 *
 * @example
 * ```tsx
 * <ModalClose asChild>
 *   <Button variant="outline">Cancel</Button>
 * </ModalClose>
 * ```
 */
const ModalClose = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Close>,
  ModalCloseProps
>(({ className, variant, children, ...props }, ref) => (
  <DialogPrimitive.Close
    ref={ref}
    className={cn(modalCloseVariants({ variant }), className)}
    {...props}
  >
    {children}
  </DialogPrimitive.Close>
));
ModalClose.displayName = 'ModalClose';

export {
  Modal,
  ModalTrigger,
  ModalPortal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalTitle,
  ModalDescription,
  ModalClose,
};

export type {
  ModalProps,
  ModalTriggerProps,
  ModalOverlayProps,
  ModalContentProps,
  ModalHeaderProps,
  ModalBodyProps,
  ModalFooterProps,
  ModalTitleProps,
  ModalDescriptionProps,
  ModalCloseProps,
};
