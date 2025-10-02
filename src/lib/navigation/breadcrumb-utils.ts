import {
  buildBreadcrumbTrail,
  findMatchingRouteMetadata,
  parseRouteParams,
} from './route-helpers';
import type {
  BreadcrumbItem,
  RecipeNavigationPattern,
  BreadcrumbConfig,
} from '@/types/ui/breadcrumb';
import type { NavigationContext } from '@/types/navigation';

/**
 * Generate breadcrumbs from a pathname using route metadata
 *
 * This is the main entry point for breadcrumb generation.
 * It uses route metadata to build intelligent breadcrumb trails.
 */
export async function generateBreadcrumbsFromPath(
  pathname: string,
  config?: Partial<BreadcrumbConfig>
): Promise<BreadcrumbItem[]> {
  try {
    const breadcrumbs = await buildBreadcrumbTrail(pathname);

    // Apply config options
    if (config?.maxItems && breadcrumbs.length > config.maxItems) {
      return collapseBreadcrumbs(breadcrumbs, config.maxItems);
    }

    // Remove home if configured
    if (config?.showHome === false && breadcrumbs[0]?.label === 'Home') {
      return breadcrumbs.slice(1);
    }

    // Remove icons if configured
    if (config?.showIcons === false) {
      return breadcrumbs.map(item => ({
        ...item,
        icon: undefined,
      }));
    }

    return breadcrumbs;
  } catch (error) {
    console.error('Error generating breadcrumbs:', error);
    return buildFallbackBreadcrumbs(pathname);
  }
}

/**
 * Enrich breadcrumb items with additional metadata from navigation context
 *
 * Adds contextual information like authentication status, feature flags, etc.
 */
export function enrichBreadcrumbsWithContext(
  breadcrumbs: BreadcrumbItem[],
  context: NavigationContext
): BreadcrumbItem[] {
  return breadcrumbs.map((item, index) => {
    const isLast = index === breadcrumbs.length - 1;

    return {
      ...item,
      // Last item is the current page (no href)
      href: isLast ? undefined : item.href,
      metadata: {
        ...item.metadata,
        current: isLast,
        depth: index,
        isAuthenticated: context.isAuthenticated,
      },
    };
  });
}

/**
 * Collapse breadcrumbs when there are too many items
 *
 * Strategy: Keep first item (usually home), last 2 items, and collapse middle
 */
export function collapseBreadcrumbs(
  breadcrumbs: BreadcrumbItem[],
  maxItems: number
): BreadcrumbItem[] {
  if (breadcrumbs.length <= maxItems) {
    return breadcrumbs;
  }

  // Always keep first and last 2 items
  const first = breadcrumbs[0];
  const last = breadcrumbs.slice(-2);

  // Calculate how many items to show from middle
  const remainingSlots = maxItems - 3; // -3 for first, ellipsis, and last 2

  if (remainingSlots <= 0) {
    // Not enough space, just show first, ellipsis, and last 2
    return [
      first,
      {
        id: 'ellipsis',
        label: '...',
        metadata: {
          isEllipsis: true,
          hiddenCount: breadcrumbs.length - 3,
        },
      },
      ...last,
    ];
  }

  // Show some middle items
  const middleStart = 1;
  const middleItems = breadcrumbs.slice(
    middleStart,
    middleStart + remainingSlots
  );

  return [
    first,
    ...middleItems,
    {
      id: 'ellipsis',
      label: '...',
      metadata: {
        isEllipsis: true,
        hiddenCount: breadcrumbs.length - (middleItems.length + 3),
      },
    },
    ...last,
  ];
}

/**
 * Build recipe-specific breadcrumb based on navigation pattern
 */
export function buildRecipeBreadcrumb(
  pattern: RecipeNavigationPattern,
  params: {
    recipeId?: string;
    recipeName?: string;
    category?: string;
    cuisine?: string;
    collectionId?: string;
    collectionName?: string;
    searchQuery?: string;
  }
): BreadcrumbItem[] {
  switch (pattern) {
    case 'category-browse':
      // Home > Recipes > Italian > Pasta
      return [
        { id: 'home', label: 'Home', href: '/' },
        { id: 'recipes', label: 'Recipes', href: '/recipes' },
        ...(params.category
          ? [
              {
                id: `category-${params.category}`,
                label: params.category,
                href: `/recipes/category/${params.category}`,
              },
            ]
          : []),
        ...(params.cuisine
          ? [
              {
                id: `cuisine-${params.cuisine}`,
                label: params.cuisine,
              },
            ]
          : []),
      ];

    case 'recipe-detail':
      // Home > Recipes > Recipe Name
      return [
        { id: 'home', label: 'Home', href: '/' },
        { id: 'recipes', label: 'Recipes', href: '/recipes' },
        ...(params.recipeName
          ? [
              {
                id: `recipe-${params.recipeId}`,
                label: params.recipeName,
              },
            ]
          : []),
      ];

    case 'cooking-workflow':
      // Planning > Shopping > Cooking > Serving
      return [
        {
          id: 'planning',
          label: 'Planning',
          href: '/recipes/workflow/planning',
        },
        {
          id: 'shopping',
          label: 'Shopping',
          href: '/recipes/workflow/shopping',
        },
        {
          id: 'cooking',
          label: 'Cooking',
          href: '/recipes/workflow/cooking',
        },
        { id: 'serving', label: 'Serving' },
      ];

    case 'user-collection':
      // Home > My Recipes > Collection Name
      return [
        { id: 'home', label: 'Home', href: '/' },
        { id: 'my-recipes', label: 'My Recipes', href: '/recipes' },
        ...(params.collectionName
          ? [
              {
                id: `collection-${params.collectionId}`,
                label: params.collectionName,
              },
            ]
          : []),
      ];

    case 'search-results':
      // Home > Search > "pasta recipes"
      return [
        { id: 'home', label: 'Home', href: '/' },
        { id: 'search', label: 'Search', href: '/search' },
        ...(params.searchQuery
          ? [
              {
                id: `search-${params.searchQuery}`,
                label: `"${params.searchQuery}"`,
              },
            ]
          : []),
      ];

    case 'meal-planning':
      // Home > Meal Plans > This Week
      return [
        { id: 'home', label: 'Home', href: '/' },
        { id: 'meal-plans', label: 'Meal Plans', href: '/meal-plans' },
        { id: 'current-week', label: 'This Week' },
      ];

    default:
      return [{ id: 'home', label: 'Home', href: '/' }];
  }
}

/**
 * Detect navigation pattern from pathname
 */
export function detectNavigationPattern(
  pathname: string
): RecipeNavigationPattern {
  const metadata = findMatchingRouteMetadata(pathname);

  if (metadata?.recipePattern) {
    return metadata.recipePattern;
  }

  // Fallback detection based on path structure
  if (pathname.includes('/search')) {
    return 'search-results';
  }

  if (pathname.includes('/workflow')) {
    return 'cooking-workflow';
  }

  if (pathname.includes('/meal-plans')) {
    return 'meal-planning';
  }

  if (pathname.includes('/collections')) {
    return 'user-collection';
  }

  if (pathname.includes('/recipes/')) {
    return 'recipe-detail';
  }

  return 'category-browse';
}

/**
 * Filter breadcrumbs based on authentication and permissions
 */
export function filterBreadcrumbsByAuth(
  breadcrumbs: BreadcrumbItem[],
  isAuthenticated: boolean
): BreadcrumbItem[] {
  return breadcrumbs.filter(item => {
    const metadata = item.metadata as { requiresAuth?: boolean } | undefined;

    // If item requires auth and user is not authenticated, filter it out
    if (metadata?.requiresAuth && !isAuthenticated) {
      return false;
    }

    return true;
  });
}

/**
 * Build fallback breadcrumbs from pathname (used when metadata lookup fails)
 */
function buildFallbackBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) {
    return [{ id: 'home', label: 'Home', href: '/' }];
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { id: 'home', label: 'Home', href: '/' },
  ];

  segments.forEach((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/');

    // Format segment for display
    const label = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    breadcrumbs.push({
      id: href,
      label,
      href: index < segments.length - 1 ? href : undefined,
    });
  });

  return breadcrumbs;
}

/**
 * Merge custom breadcrumb items with auto-generated ones
 *
 * Useful for pages that want to override or extend auto-generated breadcrumbs
 */
export function mergeBreadcrumbs(
  autoBreadcrumbs: BreadcrumbItem[],
  customBreadcrumbs: BreadcrumbItem[]
): BreadcrumbItem[] {
  if (customBreadcrumbs.length === 0) {
    return autoBreadcrumbs;
  }

  // Custom breadcrumbs completely replace auto-generated ones
  // (can be enhanced to support partial merging if needed)
  return customBreadcrumbs;
}

/**
 * Format breadcrumb label with parameters
 *
 * Useful for dynamic labels with variable substitution
 */
export function formatBreadcrumbLabel(
  template: string,
  params: Record<string, string>
): string {
  let label = template;

  Object.entries(params).forEach(([key, value]) => {
    label = label.replace(`{${key}}`, value);
  });

  return label;
}

/**
 * Get breadcrumb configuration from route metadata
 */
export function getBreadcrumbConfig(pathname: string): BreadcrumbConfig {
  const metadata = findMatchingRouteMetadata(pathname);
  const pattern = metadata?.recipePattern ?? detectNavigationPattern(pathname);

  return {
    pattern,
    showIcons: true,
    showHome: true,
    maxItems: 5,
    separator: 'chevron',
    variant: 'default',
  };
}

/**
 * Resolve dynamic breadcrumb labels asynchronously
 *
 * Fetches data from API if needed for dynamic routes
 */
export async function resolveDynamicLabels(
  breadcrumbs: BreadcrumbItem[],
  pathname: string
): Promise<BreadcrumbItem[]> {
  const metadata = findMatchingRouteMetadata(pathname);

  if (!metadata?.labelResolver) {
    return breadcrumbs;
  }

  // Parse params from pathname
  const params = parseRouteParams(pathname, metadata.pattern);

  // Find the breadcrumb that needs dynamic label resolution
  const updatedBreadcrumbs = await Promise.all(
    breadcrumbs.map(async item => {
      if (item.id === metadata.pattern && metadata.labelResolver) {
        const resolvedLabel = await Promise.resolve(
          metadata.labelResolver(params)
        );
        return {
          ...item,
          label: resolvedLabel,
        };
      }
      return item;
    })
  );

  return updatedBreadcrumbs;
}
