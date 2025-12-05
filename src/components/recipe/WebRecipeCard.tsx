import * as React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  webRecipeCardVariants,
  webRecipeCardHeaderVariants,
  webRecipeCardTitleVariants,
  webRecipeCardIconVariants,
  webRecipeCardContentVariants,
  webRecipeCardSourceVariants,
  webRecipeCardFooterVariants,
  webRecipeCardActionsVariants,
  webRecipeCardSkeletonVariants,
} from '@/lib/ui/web-recipe-card-variants';
import type { WebRecipeCardProps } from '@/types/ui/web-recipe-card';
import { ExternalLink, Copy, Download, Globe } from 'lucide-react';

/**
 * WebRecipeCard Component
 *
 * A specialized card component for displaying external web recipes with:
 * - Recipe name with external link indicator
 * - Source domain badge
 * - Actions: Open in new tab, Import to app, Copy link
 *
 * Uses dashed border styling to visually distinguish from internal recipe cards.
 *
 * @example
 * ```tsx
 * <WebRecipeCard
 *   recipe={{
 *     recipeName: 'Best Chocolate Chip Cookies',
 *     url: 'https://www.allrecipes.com/recipe/123',
 *     sourceDomain: 'allrecipes.com',
 *   }}
 *   variant="default"
 *   size="default"
 *   onOpenExternal={() => window.open(url, '_blank')}
 *   onCopyLink={() => navigator.clipboard.writeText(url)}
 * />
 * ```
 */
export const WebRecipeCard = React.forwardRef<
  HTMLDivElement,
  WebRecipeCardProps
>(
  (
    {
      recipe,
      variant = 'default',
      size = 'default',
      showQuickActions = true,
      loading = false,
      onClick,
      onOpenExternal,
      onImport,
      onCopyLink,
      className,
      ...props
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
        <Card
          ref={ref}
          variant="outlined"
          className={cn(webRecipeCardVariants({ variant, size }), className)}
          {...props}
        >
          <div className={cn(webRecipeCardHeaderVariants({ size }))}>
            <Skeleton
              className={cn(
                webRecipeCardSkeletonVariants({ type: 'title', size })
              )}
            />
          </div>
          <div className={cn(webRecipeCardContentVariants({ size }))}>
            <Skeleton
              className={cn(
                webRecipeCardSkeletonVariants({ type: 'source', size })
              )}
            />
          </div>
          <div className={cn(webRecipeCardFooterVariants({ size }))}>
            <Skeleton
              className={cn(
                webRecipeCardSkeletonVariants({ type: 'actions', size })
              )}
            />
          </div>
        </Card>
      );
    }

    const isInteractive = Boolean(onClick);

    return (
      <Card
        ref={ref}
        variant="outlined"
        className={cn(webRecipeCardVariants({ variant, size }), className)}
        onClick={isInteractive ? onClick : undefined}
        interactive={isInteractive}
        role={isInteractive ? 'button' : undefined}
        tabIndex={isInteractive ? 0 : undefined}
        aria-label={
          isInteractive
            ? `View external recipe: ${recipe.recipeName}`
            : undefined
        }
        {...props}
      >
        {/* Header with Title and External Icon */}
        <div className={cn(webRecipeCardHeaderVariants({ size }))}>
          <h3
            className={cn(
              webRecipeCardTitleVariants({ size, interactive: isInteractive })
            )}
            title={recipe.recipeName}
          >
            {recipe.recipeName}
          </h3>
          <Tooltip>
            <TooltipTrigger asChild>
              <ExternalLink
                className={cn(webRecipeCardIconVariants({ size }))}
                aria-hidden="true"
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>External recipe</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Content with Source Domain */}
        <div className={cn(webRecipeCardContentVariants({ size }))}>
          <Badge
            variant="secondary"
            className={cn(webRecipeCardSourceVariants({ size }))}
          >
            <Globe className="h-3 w-3" aria-hidden="true" />
            <span>{recipe.sourceDomain}</span>
          </Badge>
        </div>

        {/* Footer with Actions */}
        <CardFooter className={cn(webRecipeCardFooterVariants({ size }))}>
          <Button
            variant="default"
            size="sm"
            onClick={handleOpenExternal}
            className="gap-1"
            aria-label="Open recipe"
          >
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">Open</span>
          </Button>

          {showQuickActions && (
            <div className={cn(webRecipeCardActionsVariants({ size }))}>
              {onImport && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleImport}
                      aria-label="Import recipe to your collection"
                    >
                      <Download className="h-4 w-4" />
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
                    onClick={handleCopyLink}
                    aria-label="Copy recipe link"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy Link</p>
                </TooltipContent>
              </Tooltip>
            </div>
          )}
        </CardFooter>
      </Card>
    );
  }
);

WebRecipeCard.displayName = 'WebRecipeCard';

/**
 * WebRecipeCardSkeleton Component
 *
 * Pre-built skeleton for web recipe cards.
 */
export const WebRecipeCardSkeleton = React.forwardRef<
  HTMLDivElement,
  {
    className?: string;
    size?: 'sm' | 'default' | 'lg';
  }
>(({ className, size = 'default' }, ref) => {
  return (
    <WebRecipeCard
      ref={ref}
      recipe={{ recipeName: '', url: '', sourceDomain: '' }}
      loading
      size={size}
      className={className}
    />
  );
});

WebRecipeCardSkeleton.displayName = 'WebRecipeCardSkeleton';

export type { WebRecipeCardProps };
