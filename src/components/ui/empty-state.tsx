import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';
import {
  emptyStateVariants,
  emptyStateIconVariants,
  emptyStateTitleVariants,
  emptyStateDescriptionVariants,
  emptyStateActionsVariants,
} from '@/lib/ui/empty-state-variants';
import {
  type EmptyStateProps,
  type EmptyStateIconProps,
  type EmptyStateTitleProps,
  type EmptyStateDescriptionProps,
  type EmptyStateActionsProps,
} from '@/types/ui/empty-state';

/**
 * EmptyState Component
 *
 * A flexible, accessible empty state component built with Tailwind CSS and
 * class-variance-authority for type-safe styling variants.
 *
 * Features:
 * - Multiple visual variants (default, search, minimal, illustrated, error)
 * - Three sizes (sm, md, lg) for different contexts
 * - Compound component pattern for flexible layouts
 * - Full accessibility support with semantic HTML
 * - Responsive design with mobile-first approach
 * - Polymorphic rendering with asChild prop
 *
 * @example
 * ```tsx
 * <EmptyState variant="search" size="lg">
 *   <EmptyStateIcon>🔍</EmptyStateIcon>
 *   <EmptyStateTitle>No recipes found</EmptyStateTitle>
 *   <EmptyStateDescription>
 *     Try adjusting your search terms or browse our featured recipes.
 *   </EmptyStateDescription>
 *   <EmptyStateActions>
 *     <Button variant="outline">Clear Filters</Button>
 *     <Button>Browse Recipes</Button>
 *   </EmptyStateActions>
 * </EmptyState>
 * ```
 */
const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'div';

    return (
      <Comp
        ref={ref}
        className={cn(emptyStateVariants({ variant, size, className }))}
        role="status"
        aria-live="polite"
        {...props}
      />
    );
  }
);
EmptyState.displayName = 'EmptyState';

/**
 * EmptyState Icon Component
 *
 * Container for icons, illustrations, or visual elements in empty states.
 * Provides consistent sizing and spacing for visual content.
 *
 * @example
 * ```tsx
 * <EmptyStateIcon>
 *   <SearchIcon className="h-12 w-12" />
 * </EmptyStateIcon>
 * ```
 */
const EmptyStateIcon = React.forwardRef<HTMLDivElement, EmptyStateIconProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'div';

    return (
      <Comp
        ref={ref}
        className={cn(emptyStateIconVariants({ variant, size, className }))}
        aria-hidden="true"
        {...props}
      />
    );
  }
);
EmptyStateIcon.displayName = 'EmptyStateIcon';

/**
 * EmptyState Title Component
 *
 * Heading element for empty state titles. Provides consistent typography
 * and spacing for empty state headings.
 *
 * @example
 * ```tsx
 * <EmptyStateTitle>No recipes found</EmptyStateTitle>
 * ```
 */
const EmptyStateTitle = React.forwardRef<
  HTMLHeadingElement,
  EmptyStateTitleProps
>(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'h3';

  return (
    <Comp
      ref={ref}
      className={cn(emptyStateTitleVariants({ variant, size, className }))}
      {...props}
    />
  );
});
EmptyStateTitle.displayName = 'EmptyStateTitle';

/**
 * EmptyState Description Component
 *
 * Description element for empty states. Provides consistent typography
 * for explanatory text and helpful messaging.
 *
 * @example
 * ```tsx
 * <EmptyStateDescription>
 *   Try adjusting your search terms or browse our featured recipes.
 * </EmptyStateDescription>
 * ```
 */
const EmptyStateDescription = React.forwardRef<
  HTMLParagraphElement,
  EmptyStateDescriptionProps
>(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'p';

  return (
    <Comp
      ref={ref}
      className={cn(
        emptyStateDescriptionVariants({ variant, size, className })
      )}
      {...props}
    />
  );
});
EmptyStateDescription.displayName = 'EmptyStateDescription';

/**
 * EmptyState Actions Component
 *
 * Container for action buttons and interactive elements.
 * Provides flexible layout options for call-to-action buttons.
 *
 * @example
 * ```tsx
 * <EmptyStateActions layout="horizontal">
 *   <Button variant="outline">Clear Filters</Button>
 *   <Button>Browse Recipes</Button>
 * </EmptyStateActions>
 * ```
 */
const EmptyStateActions = React.forwardRef<
  HTMLDivElement,
  EmptyStateActionsProps
>(({ className, layout, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'div';

  return (
    <Comp
      ref={ref}
      className={cn(emptyStateActionsVariants({ layout, size, className }))}
      {...props}
    />
  );
});
EmptyStateActions.displayName = 'EmptyStateActions';

export {
  EmptyState,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateDescription,
  EmptyStateActions,
};

export type {
  EmptyStateProps,
  EmptyStateIconProps,
  EmptyStateTitleProps,
  EmptyStateDescriptionProps,
  EmptyStateActionsProps,
};
