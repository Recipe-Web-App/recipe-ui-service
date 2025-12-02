import * as React from 'react';
import type { VariantProps } from 'class-variance-authority';
import type {
  infiniteScrollVariants,
  infiniteScrollItemVariants,
  infiniteScrollLoadingVariants,
  infiniteScrollErrorVariants,
} from '@/lib/ui/infinite-scroll-variants';

// Base infinite scroll props
export interface BaseInfiniteScrollProps {
  id?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  role?: 'list' | 'grid' | 'feed';
}

// Intersection Observer configuration
export interface IntersectionObserverConfig {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
}

// Loading states
export type LoadingState =
  | 'idle'
  | 'loading'
  | 'loadingMore'
  | 'error'
  | 'complete';

// Error handling
export interface InfiniteScrollError {
  message: string;
  code?: string;
  retryable?: boolean;
  details?: Record<string, unknown>;
}

// Item render function types
export interface InfiniteScrollItemContext<T> {
  item: T;
  index: number;
  isLast: boolean;
  isFirst: boolean;
}

export type InfiniteScrollRenderItem<T> = (
  context: InfiniteScrollItemContext<T>
) => React.ReactNode;

// Main InfiniteScroll component props
export interface InfiniteScrollProps<T = unknown>
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, 'onLoad' | 'role'>,
    BaseInfiniteScrollProps,
    VariantProps<typeof infiniteScrollVariants> {
  // Data and rendering
  items: T[];
  renderItem: InfiniteScrollRenderItem<T>;
  hasNextPage?: boolean;
  getItemKey?: (item: T, index: number) => string | number;

  // Loading and pagination
  onLoadMore?: () => void | Promise<void>;
  loadingState?: LoadingState;
  loadingComponent?: React.ComponentType<InfiniteScrollLoadingProps>;
  loadingText?: string;

  // Error handling
  error?: InfiniteScrollError | string | null;
  errorComponent?: React.ComponentType<InfiniteScrollErrorProps>;
  onRetry?: () => void;

  // Intersection Observer configuration
  observerConfig?: IntersectionObserverConfig;
  loadMoreThreshold?: number; // Distance from bottom to trigger load (in pixels)

  // Empty state
  emptyComponent?: React.ComponentType<InfiniteScrollEmptyProps>;
  emptyText?: string;

  // Performance options
  enableVirtualization?: boolean;
  itemHeight?: number | ((index: number) => number);
  overscan?: number;

  // Accessibility
  announceLoadingText?: string;
  announceErrorText?: string;
  announceCompletedText?: string;

  // Recipe-specific options
  recipeContext?: 'recipes' | 'search-results' | 'favorites' | 'meal-plans';
  showMetadata?: boolean;
  enableImageLazyLoading?: boolean;

  // Internal properties (prefixed with _ to indicate they're for internal use)
  _enableVirtualization?: boolean;
  _itemHeight?: number | ((index: number) => number);
  _overscan?: number;
  _showMetadata?: boolean;
  _enableImageLazyLoading?: boolean;
}

// InfiniteScroll item wrapper props
export interface InfiniteScrollItemProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof infiniteScrollItemVariants> {
  children: React.ReactNode;
  index?: number;
  isLast?: boolean;
  isFirst?: boolean;
}

// Loading component props
export interface InfiniteScrollLoadingProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof infiniteScrollLoadingVariants> {
  text?: string;
  showSkeleton?: boolean;
  skeletonCount?: number;
  loadingState?: LoadingState;
}

// Error component props
export interface InfiniteScrollErrorProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof infiniteScrollErrorVariants> {
  error: InfiniteScrollError | string;
  onRetry?: () => void;
  retryText?: string;
  showRetryButton?: boolean;
}

// Empty state component props
export interface InfiniteScrollEmptyProps extends React.HTMLAttributes<HTMLDivElement> {
  text?: string;
  icon?: React.ReactNode;
  actionButton?: React.ReactNode;
}

// Recipe-specific types
export interface Recipe {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  cookTime?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  rating?: number;
  categories?: string[];
  author?: {
    name: string;
    avatar?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface SearchResult {
  id: string;
  type: 'recipe' | 'ingredient' | 'user' | 'collection';
  title: string;
  description?: string;
  imageUrl?: string;
  relevanceScore?: number;
  metadata?: Record<string, unknown>;
  recipe?: Recipe;
}

// Recipe-specific infinite scroll props
export interface RecipeInfiniteScrollProps extends Omit<
  InfiniteScrollProps<Recipe>,
  'renderItem' | 'recipeContext'
> {
  renderItem?: InfiniteScrollRenderItem<Recipe>;
  recipeContext: 'recipes' | 'favorites' | 'meal-plans';
  showAuthor?: boolean;
  showRating?: boolean;
  showCookTime?: boolean;
  showCategories?: boolean;
  cardVariant?: 'default' | 'compact' | 'detailed';
}

export interface SearchResultsInfiniteScrollProps extends Omit<
  InfiniteScrollProps<SearchResult>,
  'renderItem' | 'recipeContext'
> {
  renderItem?: InfiniteScrollRenderItem<SearchResult>;
  recipeContext: 'search-results';
  searchQuery?: string;
  highlightQuery?: boolean;
  showResultType?: boolean;
  showRelevanceScore?: boolean;
  groupByType?: boolean;
  _groupByType?: boolean;
}

// Virtual scrolling types
export interface VirtualScrollConfig {
  enabled: boolean;
  itemHeight: number | ((index: number) => number);
  overscan: number;
  containerHeight?: number;
}

export interface VirtualScrollState {
  scrollTop: number;
  containerHeight: number;
  visibleStartIndex: number;
  visibleEndIndex: number;
  totalHeight: number;
}

// Hook return types
export interface UseInfiniteScrollReturn<T> {
  items: T[];
  loadingState: LoadingState;
  error: InfiniteScrollError | string | null;
  hasNextPage: boolean;
  loadMore: () => void;
  retry: () => void;
  reset: () => void;
  isLoading: boolean;
  isLoadingMore: boolean;
  isError: boolean;
  isComplete: boolean;
}

export interface UseIntersectionObserverReturn {
  ref: React.RefObject<Element>;
  isIntersecting: boolean;
  entry: IntersectionObserverEntry | null;
}

export interface UseVirtualScrollReturn {
  containerProps: {
    ref: React.RefObject<HTMLDivElement>;
    onScroll: (event: React.UIEvent<HTMLDivElement>) => void;
    style: React.CSSProperties;
  };
  itemProps: (index: number) => {
    style: React.CSSProperties;
    'data-index': number;
  };
  visibleItems: Array<{ index: number; item: unknown }>;
  scrollToIndex: (index: number) => void;
  scrollToTop: () => void;
}

// Performance monitoring types
export interface InfiniteScrollMetrics {
  totalItems: number;
  loadedPages: number;
  averageLoadTime: number;
  errorCount: number;
  retryCount: number;
  lastLoadTime: number;
  memoryUsage?: number;
}

// Context types for compound components
export interface InfiniteScrollContextValue<T> {
  items: T[];
  loadingState: LoadingState;
  error: InfiniteScrollError | string | null;
  recipeContext?: InfiniteScrollProps<T>['recipeContext'];
  loadMore: () => void;
  retry: () => void;
  metrics: InfiniteScrollMetrics;
}

// Event types
export interface InfiniteScrollLoadEvent {
  currentPage: number;
  totalItems: number;
  loadTime: number;
}

export interface InfiniteScrollErrorEvent {
  error: InfiniteScrollError | string;
  currentPage: number;
  retryCount: number;
}

// Accessibility helpers
export interface InfiniteScrollA11yProps {
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-live'?: 'polite' | 'assertive' | 'off';
  'aria-busy'?: boolean;
  'aria-setsize'?: number;
  'aria-posinset'?: number;
  role?: 'list' | 'grid' | 'feed' | 'log';
}

export interface InfiniteScrollItemA11yProps {
  'aria-setsize'?: number;
  'aria-posinset'?: number;
  'aria-label'?: string;
  'aria-describedby'?: string;
  role?: 'listitem' | 'gridcell' | 'article';
  tabIndex?: number;
}

// Configuration for different use cases
export interface InfiniteScrollConfig {
  // Performance settings
  loadMoreThreshold: number;
  debounceDelay: number;
  retryDelay: number;
  maxRetries: number;

  // Virtual scrolling
  virtualScrolling: {
    enabled: boolean;
    itemHeight: number;
    overscan: number;
    bufferSize: number;
  };

  // Image loading
  imageLoading: {
    lazy: boolean;
    placeholder: string;
    errorFallback?: string;
    loadingIndicator: boolean;
  };

  // Accessibility
  accessibility: {
    announcements: boolean;
    liveRegion: 'polite' | 'assertive';
    skipNavigation: boolean;
    focusManagement: boolean;
  };

  // Recipe-specific
  recipeDisplay: {
    showAuthor: boolean;
    showRating: boolean;
    showCookTime: boolean;
    showCategories: boolean;
    compactMode?: boolean;
  };
}

// Default configurations for different contexts
export const defaultInfiniteScrollConfigs: Record<
  NonNullable<InfiniteScrollProps['recipeContext']>,
  Partial<InfiniteScrollConfig>
> = {
  recipes: {
    loadMoreThreshold: 200,
    virtualScrolling: {
      enabled: true,
      itemHeight: 280,
      overscan: 2,
      bufferSize: 5,
    },
    imageLoading: {
      lazy: true,
      placeholder: '/placeholder-recipe.jpg',
      loadingIndicator: true,
    },
    recipeDisplay: {
      showAuthor: true,
      showRating: true,
      showCookTime: true,
      showCategories: false,
    },
  },
  'search-results': {
    loadMoreThreshold: 150,
    virtualScrolling: {
      enabled: true,
      itemHeight: 120,
      overscan: 3,
      bufferSize: 10,
    },
    imageLoading: {
      lazy: true,
      placeholder: '/placeholder-search.jpg',
      loadingIndicator: false,
    },
    recipeDisplay: {
      showAuthor: false,
      showRating: false,
      showCookTime: true,
      showCategories: true,
    },
  },
  favorites: {
    loadMoreThreshold: 300,
    virtualScrolling: {
      enabled: false,
      itemHeight: 320,
      overscan: 1,
      bufferSize: 3,
    },
    imageLoading: {
      lazy: false,
      placeholder: '/placeholder-favorite.jpg',
      loadingIndicator: true,
    },
    recipeDisplay: {
      showAuthor: true,
      showRating: true,
      showCookTime: true,
      showCategories: true,
    },
  },
  'meal-plans': {
    loadMoreThreshold: 250,
    virtualScrolling: {
      enabled: true,
      itemHeight: 200,
      overscan: 2,
      bufferSize: 5,
    },
    imageLoading: {
      lazy: true,
      placeholder: '/placeholder-meal.jpg',
      loadingIndicator: true,
    },
    recipeDisplay: {
      showAuthor: false,
      showRating: false,
      showCookTime: true,
      showCategories: false,
    },
  },
};
