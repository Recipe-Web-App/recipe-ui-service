import type { WebRecipe } from '@/types/recipe-scraper/models';

/**
 * Extended WebRecipe data with extracted source domain for display
 */
export interface WebRecipeCardData extends WebRecipe {
  /** The domain extracted from the URL (e.g., "allrecipes.com") */
  sourceDomain: string;
}

/**
 * WebRecipeCard action handlers
 */
export interface WebRecipeCardActions {
  onClick?: () => void;
  onOpenExternal?: () => void;
  onImport?: () => void;
  onCopyLink?: () => void;
}

/**
 * WebRecipeCard component props
 */
export interface WebRecipeCardProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'>,
    WebRecipeCardActions {
  /** The web recipe data to display */
  recipe: WebRecipeCardData;
  /** Card visual variant */
  variant?: 'default' | 'outlined';
  /** Card size */
  size?: 'sm' | 'default' | 'lg';
  /** Whether to show quick action buttons */
  showQuickActions?: boolean;
  /** Whether the card is in loading state */
  loading?: boolean;
}

/**
 * WebRecipeListItem component props
 */
export interface WebRecipeListItemProps extends WebRecipeCardActions {
  /** The web recipe data to display */
  recipe: WebRecipeCardData;
  /** List item variant */
  variant?: 'default' | 'compact';
  /** Whether to show quick action buttons */
  showQuickActions?: boolean;
  /** Whether the item is in loading state */
  loading?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Extract domain from a URL
 *
 * @param url - The full URL string
 * @returns The domain name (e.g., "allrecipes.com")
 *
 * @example
 * extractDomain("https://www.allrecipes.com/recipe/123") // "allrecipes.com"
 * extractDomain("https://cooking.nytimes.com/recipes/456") // "cooking.nytimes.com"
 * extractDomain("invalid-url") // "unknown"
 */
export function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    // Remove 'www.' prefix if present for cleaner display
    return urlObj.hostname.replace(/^www\./, '');
  } catch {
    return 'unknown';
  }
}

/**
 * Convert WebRecipe to WebRecipeCardData by adding extracted domain
 *
 * @param recipe - The original WebRecipe from the API
 * @returns WebRecipeCardData with sourceDomain added
 */
export function mapWebRecipeToCardData(recipe: WebRecipe): WebRecipeCardData {
  return {
    ...recipe,
    sourceDomain: extractDomain(recipe.url),
  };
}
