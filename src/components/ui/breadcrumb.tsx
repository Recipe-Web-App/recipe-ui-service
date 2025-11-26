import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import {
  ChevronRight,
  MoreHorizontal,
  Slash,
  ArrowRight,
  Dot,
  Home,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  breadcrumbVariants,
  breadcrumbListVariants,
  breadcrumbItemVariants,
  breadcrumbLinkVariants,
  breadcrumbPageVariants,
  breadcrumbSeparatorVariants,
  breadcrumbEllipsisVariants,
  recipeBreadcrumbVariants,
} from '@/lib/ui/breadcrumb-variants';
import { Icon } from '@/components/ui/icon';
import type { IconName } from '@/types/ui/icon';
import type {
  BreadcrumbProps,
  BreadcrumbListProps,
  BreadcrumbItemProps,
  BreadcrumbLinkProps,
  BreadcrumbPageProps,
  BreadcrumbSeparatorProps,
  BreadcrumbEllipsisProps,
  RecipeBreadcrumbProps,
  BreadcrumbItem,
} from '@/types/ui/breadcrumb';

/**
 * Breadcrumb Component
 *
 * A hierarchical navigation component that shows the user's location
 * within a website or application structure.
 *
 * Features:
 * - Accessible navigation with proper ARIA attributes
 * - Responsive design with overflow handling
 * - Customizable separators and styling
 * - Recipe-specific navigation patterns
 * - Keyboard navigation support
 * - Icon support for breadcrumb items
 */
// Valid separator variant strings
const separatorVariants = ['chevron', 'slash', 'arrow', 'dot'] as const;
type SeparatorVariant = (typeof separatorVariants)[number];

const isSeparatorVariant = (value: unknown): value is SeparatorVariant =>
  typeof value === 'string' &&
  separatorVariants.includes(value as SeparatorVariant);

const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  (
    {
      className,
      size,
      items = [],
      separator,
      maxItems = 3,
      showHome = true,
      homeUrl = '/',
      children,
      ...props
    },
    ref
  ) => {
    const [isExpanded, setIsExpanded] = React.useState(false);

    // Determine if separator is a variant string or custom element
    const separatorVariant = isSeparatorVariant(separator)
      ? separator
      : undefined;
    const separatorElement = !isSeparatorVariant(separator)
      ? separator
      : undefined;

    // If children are provided, render them directly
    if (children) {
      return (
        <nav
          ref={ref}
          aria-label="Breadcrumb navigation"
          className={cn(breadcrumbVariants({ size }), className)}
          {...props}
        >
          {children}
        </nav>
      );
    }

    // Auto-generate breadcrumb from items prop
    const shouldCollapse = items.length > maxItems && !isExpanded;
    const visibleItems = shouldCollapse
      ? [items[0], ...items.slice(-2)]
      : items;
    const hiddenCount = shouldCollapse ? items.length - 3 : 0;

    return (
      <nav
        ref={ref}
        aria-label="Breadcrumb navigation"
        className={cn(breadcrumbVariants({ size }), className)}
        {...props}
      >
        <BreadcrumbList size={size}>
          {/* Home breadcrumb */}
          {showHome && items.length > 0 && (
            <>
              <BreadcrumbItem size={size}>
                <BreadcrumbLink href={homeUrl} size={size}>
                  <Home className="h-4 w-4" />
                  <span className="sr-only">Home</span>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator size={size} variant={separatorVariant}>
                {separatorElement}
              </BreadcrumbSeparator>
            </>
          )}

          {/* Breadcrumb items */}
          {visibleItems.map((item, index) => {
            const isLast = index === visibleItems.length - 1;
            const isFirst = index === 0;

            return (
              <React.Fragment key={item.id ?? item.label}>
                {/* Show ellipsis if items are collapsed */}
                {shouldCollapse && isFirst && hiddenCount > 0 && (
                  <>
                    <BreadcrumbItem size={size}>
                      <BreadcrumbEllipsis
                        size={size}
                        onClick={() => setIsExpanded(true)}
                        aria-label={`Show ${hiddenCount} hidden items`}
                      />
                    </BreadcrumbItem>
                    <BreadcrumbSeparator size={size} variant={separatorVariant}>
                      {separatorElement}
                    </BreadcrumbSeparator>
                  </>
                )}

                <BreadcrumbItem size={size}>
                  {isLast ? (
                    <BreadcrumbPage size={size} aria-current="page">
                      {item.icon && (
                        <Icon name={item.icon as IconName} size="sm" />
                      )}
                      {item.label}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink
                      href={item.href}
                      size={size}
                      aria-disabled={item.disabled}
                    >
                      {item.icon && (
                        <Icon name={item.icon as IconName} size="sm" />
                      )}
                      {item.label}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>

                {/* Separator (not after last item) */}
                {!isLast && (
                  <BreadcrumbSeparator size={size} variant={separatorVariant}>
                    {separatorElement}
                  </BreadcrumbSeparator>
                )}
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </nav>
    );
  }
);

Breadcrumb.displayName = 'Breadcrumb';

/**
 * BreadcrumbList Component
 *
 * Wraps breadcrumb items in a semantic ordered list
 */
const BreadcrumbList = React.forwardRef<HTMLOListElement, BreadcrumbListProps>(
  ({ className, size, children, ...props }, ref) => (
    <ol
      ref={ref}
      className={cn(breadcrumbListVariants({ size }), className)}
      {...props}
    >
      {children}
    </ol>
  )
);

BreadcrumbList.displayName = 'BreadcrumbList';

/**
 * BreadcrumbItem Component
 *
 * Individual breadcrumb item wrapper
 */
const BreadcrumbItem = React.forwardRef<HTMLLIElement, BreadcrumbItemProps>(
  ({ className, size, children, ...props }, ref) => (
    <li
      ref={ref}
      className={cn(breadcrumbItemVariants({ size }), className)}
      {...props}
    >
      {children}
    </li>
  )
);

BreadcrumbItem.displayName = 'BreadcrumbItem';

/**
 * BreadcrumbLink Component
 *
 * Navigatable breadcrumb link
 */
const BreadcrumbLink = React.forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'a';

    return (
      <Comp
        ref={ref}
        className={cn(breadcrumbLinkVariants({ variant, size }), className)}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);

BreadcrumbLink.displayName = 'BreadcrumbLink';

/**
 * BreadcrumbPage Component
 *
 * Current page indicator (non-clickable)
 */
const BreadcrumbPage = React.forwardRef<HTMLSpanElement, BreadcrumbPageProps>(
  ({ className, variant, size, children, ...props }, ref) => (
    <span
      ref={ref}
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn(breadcrumbPageVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </span>
  )
);

BreadcrumbPage.displayName = 'BreadcrumbPage';

/**
 * BreadcrumbSeparator Component
 *
 * Visual separator between breadcrumb items
 */
const BreadcrumbSeparator = React.forwardRef<
  HTMLLIElement,
  BreadcrumbSeparatorProps
>(({ className, variant = 'chevron', size, children, ...props }, ref) => {
  // Default separators based on variant
  const defaultSeparators = {
    chevron: <ChevronRight />,
    slash: <Slash />,
    arrow: <ArrowRight />,
    dot: <Dot />,
  };

  return (
    <li
      ref={ref}
      role="presentation"
      aria-hidden="true"
      className={cn(breadcrumbSeparatorVariants({ variant, size }), className)}
      {...props}
    >
      {children ??
        (variant === 'chevron'
          ? defaultSeparators.chevron
          : variant === 'slash'
            ? defaultSeparators.slash
            : variant === 'arrow'
              ? defaultSeparators.arrow
              : defaultSeparators.dot)}
    </li>
  );
});

BreadcrumbSeparator.displayName = 'BreadcrumbSeparator';

/**
 * BreadcrumbEllipsis Component
 *
 * Collapsible indicator for overflow breadcrumbs
 */
const BreadcrumbEllipsis = React.forwardRef<
  HTMLSpanElement,
  BreadcrumbEllipsisProps
>(({ className, size, onExpand, ...props }, ref) => (
  <span
    ref={ref}
    role="button"
    tabIndex={0}
    aria-label="Show more breadcrumbs"
    className={cn(breadcrumbEllipsisVariants({ size }), className)}
    onClick={onExpand}
    onKeyDown={e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onExpand?.();
      }
    }}
    {...props}
  >
    <MoreHorizontal />
    <span className="sr-only">More</span>
  </span>
));

BreadcrumbEllipsis.displayName = 'BreadcrumbEllipsis';

/**
 * RecipeBreadcrumb Component
 *
 * Recipe-specific breadcrumb for cooking workflows
 */
const RecipeBreadcrumb = React.forwardRef<
  HTMLDivElement,
  RecipeBreadcrumbProps
>(
  (
    {
      className,
      workflow,
      emphasis,
      items,
      currentStep,
      onStepClick,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          recipeBreadcrumbVariants({ workflow, emphasis }),
          className
        )}
        {...props}
      >
        {items.map((item, index) => {
          const isActive = item.id === currentStep || item.active;
          const isClickable =
            item.accessible !== false && (item.href ?? onStepClick);

          return (
            <React.Fragment key={item.id}>
              {/* Step Item */}
              <div
                className={cn(
                  'flex items-center gap-2',
                  isClickable && 'cursor-pointer hover:opacity-80',
                  isActive && 'font-medium'
                )}
                onClick={
                  isClickable
                    ? () => {
                        if (item.href) {
                          window.location.href = item.href;
                        } else {
                          onStepClick?.(item.id);
                        }
                      }
                    : undefined
                }
                onKeyDown={
                  isClickable
                    ? e => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          if (item.href) {
                            window.location.href = item.href;
                          } else {
                            onStepClick?.(item.id);
                          }
                        }
                      }
                    : undefined
                }
                tabIndex={isClickable ? 0 : undefined}
                role={isClickable ? 'button' : undefined}
              >
                {item.icon && (
                  <Icon
                    name={item.icon as IconName}
                    size="sm"
                    className={item.completed ? 'text-green-600' : undefined}
                  />
                )}
                <span className={isActive ? 'text-current' : 'text-current/80'}>
                  {item.label}
                </span>
                {item.completed && (
                  <Icon name="check" size="sm" className="text-green-600" />
                )}
              </div>

              {/* Separator */}
              {index < items.length - 1 && (
                <ChevronRight className="h-4 w-4 text-current/60" />
              )}
            </React.Fragment>
          );
        })}
        {children}
      </div>
    );
  }
);

RecipeBreadcrumb.displayName = 'RecipeBreadcrumb';

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
  RecipeBreadcrumb,
};

export type {
  BreadcrumbProps,
  BreadcrumbListProps,
  BreadcrumbItemProps,
  BreadcrumbLinkProps,
  BreadcrumbPageProps,
  BreadcrumbSeparatorProps,
  BreadcrumbEllipsisProps,
  RecipeBreadcrumbProps,
  BreadcrumbItem as BreadcrumbItemType,
};
