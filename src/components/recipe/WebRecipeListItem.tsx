import * as React from 'react';
import { cn } from '@/lib/utils';
import { ListItem } from '@/components/ui/list';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  webRecipeListItemVariants,
  webRecipeListItemContentVariants,
  webRecipeListItemTitleVariants,
  webRecipeListItemActionsVariants,
  webRecipeCardSourceVariants,
} from '@/lib/ui/web-recipe-card-variants';
import type { WebRecipeListItemProps } from '@/types/ui/web-recipe-card';
import { ExternalLink, Copy, Download, Globe } from 'lucide-react';

/**
 * WebRecipeListItem Component
 *
 * A compact horizontal list item for displaying external web recipes.
 * Optimized for scanning and quick browsing in list view mode.
 *
 * **Layout:**
 * ```
 * [External Icon] [Recipe Name] [Source Domain] [Actions]
 * ```
 *
 * @example
 * ```tsx
 * <WebRecipeListItem
 *   recipe={{
 *     recipeName: 'Best Chocolate Chip Cookies',
 *     url: 'https://www.allrecipes.com/recipe/123',
 *     sourceDomain: 'allrecipes.com',
 *   }}
 *   variant="default"
 *   onOpenExternal={() => window.open(url, '_blank')}
 *   onCopyLink={() => navigator.clipboard.writeText(url)}
 * />
 * ```
 */
export const WebRecipeListItem = React.forwardRef<
  HTMLLIElement,
  WebRecipeListItemProps
>(
  (
    {
      recipe,
      variant = 'default',
      showQuickActions = true,
      loading = false,
      onClick,
      onOpenExternal,
      onImport,
      onCopyLink,
      className,
    },
    ref
  ) => {
    // Handler to open external link
    const handleOpenExternal = React.useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onOpenExternal) {
          onOpenExternal();
        } else {
          window.open(recipe.url, '_blank', 'noopener,noreferrer');
        }
      },
      [onOpenExternal, recipe.url]
    );

    // Handler to copy link
    const handleCopyLink = React.useCallback(
      async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onCopyLink) {
          onCopyLink();
        } else {
          try {
            await navigator.clipboard.writeText(recipe.url);
          } catch {
            // Silently fail if clipboard is not available
          }
        }
      },
      [onCopyLink, recipe.url]
    );

    // Handler to import recipe
    const handleImport = React.useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onImport) {
          onImport();
        }
      },
      [onImport]
    );

    // Show loading skeleton
    if (loading) {
      return (
        <ListItem
          ref={ref}
          className={cn(webRecipeListItemVariants({ variant }), className)}
        >
          <Skeleton className="h-4 w-4 shrink-0" />
          <div className={cn(webRecipeListItemContentVariants({ variant }))}>
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-5 w-24 rounded-full" />
          </div>
          <Skeleton className="h-8 w-20" />
        </ListItem>
      );
    }

    const isInteractive = Boolean(onClick);

    return (
      <ListItem
        ref={ref}
        className={cn(webRecipeListItemVariants({ variant }), className)}
        onSelect={isInteractive ? onClick : undefined}
        aria-label={
          isInteractive
            ? `View external recipe: ${recipe.recipeName}`
            : undefined
        }
      >
        {/* External Link Icon */}
        <Tooltip>
          <TooltipTrigger asChild>
            <ExternalLink
              className="text-muted-foreground h-4 w-4 shrink-0"
              aria-hidden="true"
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>External recipe</p>
          </TooltipContent>
        </Tooltip>

        {/* Content: Recipe Name and Source */}
        <div className={cn(webRecipeListItemContentVariants({ variant }))}>
          <span
            className={cn(webRecipeListItemTitleVariants({ variant }))}
            title={recipe.recipeName}
          >
            {recipe.recipeName}
          </span>

          <Badge
            variant="secondary"
            className={cn(webRecipeCardSourceVariants({ size: 'sm' }))}
          >
            <Globe className="h-3 w-3" aria-hidden="true" />
            <span>{recipe.sourceDomain}</span>
          </Badge>
        </div>

        {/* Actions */}
        {showQuickActions && (
          <div className={cn(webRecipeListItemActionsVariants({ variant }))}>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleOpenExternal}
              className="gap-1"
            >
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="sr-only sm:not-sr-only">Open</span>
            </Button>

            {onImport && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={handleImport}
                    aria-label="Import recipe"
                  >
                    <Download className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Import to App</p>
                </TooltipContent>
              </Tooltip>
            )}

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleCopyLink}
                  aria-label="Copy link"
                >
                  <Copy className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy Link</p>
              </TooltipContent>
            </Tooltip>
          </div>
        )}
      </ListItem>
    );
  }
);

WebRecipeListItem.displayName = 'WebRecipeListItem';

/**
 * WebRecipeListItemSkeleton Component
 *
 * Pre-built skeleton for web recipe list items.
 */
export const WebRecipeListItemSkeleton = React.forwardRef<
  HTMLLIElement,
  {
    className?: string;
    variant?: 'default' | 'compact';
  }
>(({ className, variant = 'default' }, ref) => {
  return (
    <WebRecipeListItem
      ref={ref}
      recipe={{ recipeName: '', url: '', sourceDomain: '' }}
      loading
      variant={variant}
      className={className}
    />
  );
});

WebRecipeListItemSkeleton.displayName = 'WebRecipeListItemSkeleton';

export type { WebRecipeListItemProps };
