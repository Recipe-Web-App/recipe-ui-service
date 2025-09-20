import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';
import { badgeVariants } from '@/lib/ui/badge-variants';
import { type BadgeProps } from '@/types/ui/badge';

/**
 * Badge Component
 *
 * A flexible, accessible badge component for tags, categories, and status indicators.
 * Built with Tailwind CSS and class-variance-authority for type-safe variants.
 *
 * Features:
 * - Multiple variants (default, secondary, destructive, outline, success, warning, info)
 * - Multiple sizes (sm, default, lg)
 * - Full keyboard accessibility
 * - Polymorphic component support (asChild prop)
 * - Optimized for recipe app use cases (categories, difficulty, status, time)
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Badge>New</Badge>
 *
 * // With variants and sizes
 * <Badge variant="success" size="lg">Published</Badge>
 * <Badge variant="warning">Draft</Badge>
 * <Badge variant="outline" size="sm">15 min</Badge>
 *
 * // Recipe app examples
 * <Badge variant="info">Vegetarian</Badge>
 * <Badge variant="success">Easy</Badge>
 * <Badge variant="secondary">Dessert</Badge>
 *
 * // Polymorphic usage
 * <Badge asChild>
 *   <Link href="/category/dessert">Dessert</Link>
 * </Badge>
 * ```
 */
const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    if (asChild) {
      return (
        <Slot
          className={cn(badgeVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        />
      );
    }

    return (
      <div
        className={cn(badgeVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };
export type { BadgeProps };
