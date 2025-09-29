'use client';

import * as React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import {
  infiniteScrollVariants,
  infiniteScrollItemVariants,
  infiniteScrollLoadingVariants,
  infiniteScrollErrorVariants,
  infiniteScrollEmptyVariants,
  recipeSkeletonVariants,
  recipeCardVariants,
  searchResultVariants,
  spinnerAnimationVariants,
} from '@/lib/ui/infinite-scroll-variants';
import type {
  InfiniteScrollProps,
  InfiniteScrollItemProps,
  InfiniteScrollLoadingProps,
  InfiniteScrollErrorProps,
  InfiniteScrollEmptyProps,
  RecipeInfiniteScrollProps,
  SearchResultsInfiniteScrollProps,
  InfiniteScrollError,
  LoadingState,
  Recipe,
  SearchResult,
  UseIntersectionObserverReturn,
  InfiniteScrollMetrics,
} from '@/types/ui/infinite-scroll';
import { AlertTriangle, RefreshCw, Loader2, Search } from 'lucide-react';

// Create context for shared state
const InfiniteScrollContext = React.createContext<{
  loadingState: LoadingState;
  error: InfiniteScrollError | string | null;
  recipeContext?: InfiniteScrollProps['recipeContext'];
  metrics: InfiniteScrollMetrics;
}>({
  loadingState: 'idle',
  error: null,
  metrics: {
    totalItems: 0,
    loadedPages: 0,
    averageLoadTime: 0,
    errorCount: 0,
    retryCount: 0,
    lastLoadTime: 0,
  },
});

// Custom hooks
const useIntersectionObserver = (
  config: {
    root?: Element | null;
    rootMargin?: string;
    threshold?: number | number[];
  } = {}
): UseIntersectionObserverReturn => {
  const [entry, setEntry] = React.useState<IntersectionObserverEntry | null>(
    null
  );
  const elementRef = React.useRef<Element | null>(null);

  React.useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => setEntry(entry), {
      root: config.root,
      rootMargin: config.rootMargin ?? '0px',
      threshold: config.threshold ?? 0.1,
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [config.root, config.rootMargin, config.threshold]);

  return {
    ref: elementRef as React.RefObject<Element>,
    isIntersecting: entry?.isIntersecting ?? false,
    entry,
  };
};

const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  React.useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

// Spinner component
const Spinner = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: 'default' | 'dots' | 'wave' | 'pulse';
    size?: 'sm' | 'md' | 'lg';
    speed?: 'slow' | 'normal' | 'fast';
  }
>(
  (
    { className, variant = 'default', size = 'md', speed = 'normal', ...props },
    ref
  ) => (
    <div
      ref={ref}
      className={cn(
        spinnerAnimationVariants({ variant, size, speed }),
        className
      )}
      {...props}
    >
      {variant === 'default' && <Loader2 className="h-full w-full" />}
      {variant === 'dots' && (
        <div className="flex space-x-1">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="h-2 w-2 animate-bounce rounded-full bg-current"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      )}
      {variant === 'wave' && (
        <div className="flex space-x-1">
          {[0, 1, 2, 3, 4].map(i => (
            <div
              key={i}
              className="h-4 w-1 animate-pulse bg-current"
              style={{
                animationDelay: `${i * 0.1}s`,
                height: `${Math.sin((i / 4) * Math.PI) * 12 + 8}px`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
);
Spinner.displayName = 'Spinner';

// Default loading component
const DefaultInfiniteScrollLoading = React.forwardRef<
  HTMLDivElement,
  InfiniteScrollLoadingProps
>(
  (
    {
      className,
      variant = 'spinner',
      size = 'md',
      position = 'bottom',
      state = 'loading',
      text,
      showSkeleton = false,
      skeletonCount = 3,
      loadingState = 'loading',
      ...props
    },
    ref
  ) => {
    const getLoadingText = () => {
      if (text) return text;
      switch (loadingState) {
        case 'loading':
          return 'Loading recipes...';
        case 'loadingMore':
          return 'Loading more recipes...';
        case 'error':
          return 'Failed to load recipes';
        case 'complete':
          return 'All recipes loaded';
        default:
          return 'Loading...';
      }
    };

    if (showSkeleton && variant === 'skeleton') {
      return (
        <div
          ref={ref}
          className={cn(
            infiniteScrollLoadingVariants({ variant, size, position, state }),
            className
          )}
          {...props}
        >
          {Array.from({ length: skeletonCount }).map((_, index) => (
            <div
              key={index}
              className="border-border w-full space-y-3 rounded-lg border p-4"
            >
              <div
                className={cn(recipeSkeletonVariants({ variant: 'image' }))}
              />
              <div className="space-y-2">
                <div
                  className={cn(recipeSkeletonVariants({ variant: 'title' }))}
                />
                <div
                  className={cn(
                    recipeSkeletonVariants({ variant: 'description' })
                  )}
                />
                <div className="flex justify-between">
                  <div
                    className={cn(
                      recipeSkeletonVariants({ variant: 'metadata' })
                    )}
                  />
                  <div
                    className={cn(
                      recipeSkeletonVariants({ variant: 'rating' })
                    )}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          infiniteScrollLoadingVariants({ variant, size, position, state }),
          className
        )}
        role="status"
        aria-live="polite"
        aria-label={getLoadingText()}
        {...props}
      >
        {variant === 'spinner' && (
          <Spinner variant="default" size={size === 'sm' ? 'sm' : 'md'} />
        )}
        {variant === 'dots' && (
          <Spinner variant="dots" size={size === 'sm' ? 'sm' : 'md'} />
        )}
        {variant === 'wave' && (
          <Spinner variant="wave" size={size === 'sm' ? 'sm' : 'md'} />
        )}
        {variant === 'pulse' && (
          <Spinner variant="pulse" size={size === 'sm' ? 'sm' : 'md'} />
        )}
        <span className="text-sm font-medium">{getLoadingText()}</span>
      </div>
    );
  }
);
DefaultInfiniteScrollLoading.displayName = 'DefaultInfiniteScrollLoading';

// Default error component
const DefaultInfiniteScrollError = React.forwardRef<
  HTMLDivElement,
  InfiniteScrollErrorProps
>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      error,
      onRetry,
      retryText = 'Try again',
      showRetryButton = true,
      retryable = true,
      ...props
    },
    ref
  ) => {
    const errorMessage = typeof error === 'string' ? error : error.message;
    const isRetryable =
      typeof error === 'string' ? retryable : (error.retryable ?? retryable);

    return (
      <div
        ref={ref}
        className={cn(
          infiniteScrollErrorVariants({
            variant,
            size,
            retryable: isRetryable,
          }),
          className
        )}
        role="alert"
        aria-live="assertive"
        {...props}
      >
        <AlertTriangle className="mb-2 h-8 w-8" />
        <h3 className="mb-2 font-semibold">Something went wrong</h3>
        <p className="mb-4 text-sm opacity-90">{errorMessage}</p>
        {isRetryable && showRetryButton && onRetry && (
          <button
            onClick={onRetry}
            className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <RefreshCw className="h-4 w-4" />
            {retryText}
          </button>
        )}
      </div>
    );
  }
);
DefaultInfiniteScrollError.displayName = 'DefaultInfiniteScrollError';

// Default empty state component
const DefaultInfiniteScrollEmpty = React.forwardRef<
  HTMLDivElement,
  InfiniteScrollEmptyProps
>(
  (
    { className, text = 'No recipes found', icon, actionButton, ...props },
    ref
  ) => (
    <div
      ref={ref}
      className={cn(
        infiniteScrollEmptyVariants({ variant: 'default', size: 'md' }),
        className
      )}
      {...props}
    >
      {icon ?? <Search className="mb-4 h-12 w-12 opacity-50" />}
      <h3 className="mb-2 text-lg font-semibold">No results</h3>
      <p className="text-sm opacity-75">{text}</p>
      {actionButton && <div className="mt-4">{actionButton}</div>}
    </div>
  )
);
DefaultInfiniteScrollEmpty.displayName = 'DefaultInfiniteScrollEmpty';

// InfiniteScroll item wrapper
const InfiniteScrollItem = React.forwardRef<
  HTMLDivElement,
  InfiniteScrollItemProps
>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      loading = false,
      isFirst = false,
      isLast = false,
      index,
      children,
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      className={cn(
        infiniteScrollItemVariants({ variant, size, loading, isFirst, isLast }),
        className
      )}
      data-index={index}
      data-first={isFirst}
      data-last={isLast}
      {...props}
    >
      {children}
    </div>
  )
);
InfiniteScrollItem.displayName = 'InfiniteScrollItem';

// Main InfiniteScroll component
function InfiniteScrollInner<T = unknown>(
  {
    className,
    variant = 'default',
    size = 'md',
    gridCols,
    recipeContext,
    loading = false,
    virtualized = false,
    items = [],
    renderItem,
    hasNextPage = false,
    getItemKey,
    onLoadMore,
    loadingState = 'idle',
    loadingComponent: LoadingComponent = DefaultInfiniteScrollLoading,
    loadingText,
    error = null,
    errorComponent: ErrorComponent = DefaultInfiniteScrollError,
    onRetry,
    observerConfig = {},
    loadMoreThreshold = 200,
    emptyComponent: EmptyComponent = DefaultInfiniteScrollEmpty,
    emptyText,
    _enableVirtualization = false,
    _itemHeight,
    _overscan = 5,
    announceLoadingText,
    announceErrorText,
    announceCompletedText,
    _showMetadata = true,
    _enableImageLazyLoading = true,
    children,
    ...props
  }: InfiniteScrollProps<T>,
  ref: React.Ref<HTMLDivElement>
) {
  const [metrics, setMetrics] = React.useState<InfiniteScrollMetrics>({
    totalItems: items.length,
    loadedPages: 0,
    averageLoadTime: 0,
    errorCount: 0,
    retryCount: 0,
    lastLoadTime: 0,
  });

  // Intersection observer for loading more items
  const { ref: loadMoreRef, isIntersecting } = useIntersectionObserver({
    rootMargin: `0px 0px ${loadMoreThreshold}px 0px`,
    threshold: 0.1,
    ...observerConfig,
  });

  // Debounce intersection to prevent rapid calls
  const debouncedIsIntersecting = useDebounce(isIntersecting, 100);

  // Track loading performance
  const loadStartTime = React.useRef<number>(0);

  // Handle loading more items
  const handleLoadMore = React.useCallback(async () => {
    if (
      !onLoadMore ||
      loadingState === 'loading' ||
      loadingState === 'loadingMore' ||
      !hasNextPage
    ) {
      return;
    }

    loadStartTime.current = Date.now();

    try {
      await onLoadMore();
      const loadTime = Date.now() - loadStartTime.current;

      setMetrics(prev => ({
        ...prev,
        loadedPages: prev.loadedPages + 1,
        lastLoadTime: loadTime,
        averageLoadTime:
          prev.loadedPages === 0
            ? loadTime
            : (prev.averageLoadTime + loadTime) / 2,
        totalItems: items.length,
      }));
    } catch (err) {
      setMetrics(prev => ({
        ...prev,
        errorCount: prev.errorCount + 1,
      }));
      // Log error for debugging but don't re-throw to avoid unhandled promises
      console.error('Failed to load more items:', err);
    }
  }, [onLoadMore, loadingState, hasNextPage, items.length]);

  // Handle retry
  const handleRetry = React.useCallback(() => {
    if (onRetry) {
      setMetrics(prev => ({
        ...prev,
        retryCount: prev.retryCount + 1,
      }));
      onRetry();
    } else {
      handleLoadMore();
    }
  }, [onRetry, handleLoadMore]);

  // Trigger loading when intersecting
  React.useEffect(() => {
    if (debouncedIsIntersecting && hasNextPage && loadingState === 'idle') {
      handleLoadMore();
    }
  }, [debouncedIsIntersecting, hasNextPage, loadingState, handleLoadMore]);

  // Get default item key
  const getDefaultItemKey = React.useCallback(
    (item: T, index: number) => {
      if (getItemKey) {
        return getItemKey(item, index);
      }

      if (item && typeof item === 'object' && 'id' in item) {
        return (item as { id: string | number }).id;
      }

      return index;
    },
    [getItemKey]
  );

  // Context value
  const contextValue = React.useMemo(
    () => ({
      loadingState,
      error,
      recipeContext,
      metrics,
    }),
    [loadingState, error, recipeContext, metrics]
  );

  // Announce loading states for screen readers
  React.useEffect(() => {
    if (!announceLoadingText && !announceErrorText && !announceCompletedText)
      return;

    let message = '';
    switch (loadingState) {
      case 'loading':
        message = announceLoadingText ?? 'Loading content';
        break;
      case 'loadingMore':
        message = announceLoadingText ?? 'Loading more content';
        break;
      case 'error':
        message = announceErrorText ?? 'Error loading content';
        break;
      case 'complete':
        message = announceCompletedText ?? 'All content loaded';
        break;
    }

    if (message) {
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.className = 'sr-only';
      announcement.textContent = message;
      document.body.appendChild(announcement);

      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);
    }
  }, [
    loadingState,
    announceLoadingText,
    announceErrorText,
    announceCompletedText,
  ]);

  // Show loading state when items are empty and loading
  if (items.length === 0 && loadingState === 'loading') {
    return (
      <InfiniteScrollContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(
            infiniteScrollVariants({
              variant,
              size,
              recipeContext,
              loading: true,
            }),
            className
          )}
          role="feed"
          aria-busy={true}
          aria-label="Infinite scroll content"
          {...props}
        >
          <LoadingComponent
            variant="spinner"
            size={size}
            loadingState={loadingState}
            text={loadingText}
          />
        </div>
      </InfiniteScrollContext.Provider>
    );
  }

  // Show empty state
  if (items.length === 0 && loadingState !== 'loading' && !error) {
    return (
      <InfiniteScrollContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(
            infiniteScrollVariants({
              variant,
              size,
              recipeContext,
              loading: false,
            }),
            className
          )}
          {...props}
        >
          <EmptyComponent text={emptyText} />
        </div>
      </InfiniteScrollContext.Provider>
    );
  }

  return (
    <InfiniteScrollContext.Provider value={contextValue}>
      <div
        ref={ref}
        className={cn(
          infiniteScrollVariants({
            variant,
            size,
            gridCols,
            recipeContext,
            loading,
            virtualized,
          }),
          className
        )}
        role="feed"
        aria-busy={loadingState === 'loading' || loadingState === 'loadingMore'}
        aria-label="Infinite scroll content"
        {...props}
      >
        {/* Render items */}
        {items.map((item, index) => (
          <InfiniteScrollItem
            key={getDefaultItemKey(item, index)}
            index={index}
            isFirst={index === 0}
            isLast={index === items.length - 1}
            loading={loadingState === 'loading'}
          >
            {renderItem({
              item,
              index,
              isFirst: index === 0,
              isLast: index === items.length - 1,
            })}
          </InfiniteScrollItem>
        ))}

        {/* Loading more indicator */}
        {hasNextPage && loadingState === 'loadingMore' && (
          <LoadingComponent
            variant="spinner"
            size={size}
            loadingState={loadingState}
            text={loadingText}
          />
        )}

        {/* Error state */}
        {error && (
          <ErrorComponent
            error={error}
            onRetry={handleRetry}
            showRetryButton={true}
          />
        )}

        {/* Load more trigger element */}
        {hasNextPage && !error && (
          <div
            ref={loadMoreRef as React.RefObject<HTMLDivElement>}
            className="h-1 w-full"
            aria-hidden="true"
          />
        )}

        {/* Completion message */}
        {!hasNextPage && items.length > 0 && loadingState === 'complete' && (
          <div className="text-muted-foreground py-8 text-center text-sm">
            All recipes loaded ({items.length} total)
          </div>
        )}

        {children}
      </div>
    </InfiniteScrollContext.Provider>
  );
}

const InfiniteScroll = React.forwardRef(InfiniteScrollInner) as <T = unknown>(
  props: InfiniteScrollProps<T> & { ref?: React.Ref<HTMLDivElement> }
) => ReturnType<typeof InfiniteScrollInner>;

// Manually assign displayName
Object.defineProperty(InfiniteScroll, 'displayName', {
  value: 'InfiniteScroll',
  configurable: true,
});

// Recipe-specific infinite scroll component
const RecipeInfiniteScroll = React.forwardRef<
  HTMLDivElement,
  RecipeInfiniteScrollProps
>(
  (
    {
      renderItem,
      showAuthor = true,
      showRating = true,
      showCookTime = true,
      showCategories = false,
      cardVariant = 'default',
      ...props
    },
    ref
  ) => {
    const defaultRenderItem = React.useCallback(
      ({
        item: recipe,
      }: {
        item: Recipe;
        index: number;
        isFirst: boolean;
        isLast: boolean;
      }) => (
        <article
          className={cn(
            recipeCardVariants({ variant: cardVariant, interactive: true }),
            'focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'
          )}
          aria-label={`Recipe: ${recipe.title}`}
        >
          {recipe.imageUrl && (
            <div className="aspect-video overflow-hidden">
              <Image
                src={recipe.imageUrl ?? '/placeholder-recipe.jpg'}
                alt={recipe.title}
                width={400}
                height={225}
                className="h-full w-full object-cover transition-transform duration-200 hover:scale-105"
                loading={props.enableImageLazyLoading ? 'lazy' : 'eager'}
              />
            </div>
          )}
          <div className="p-4">
            <h3 className="mb-2 line-clamp-2 text-lg font-semibold">
              {recipe.title}
            </h3>
            {recipe.description && (
              <p className="text-muted-foreground mb-3 line-clamp-2 text-sm">
                {recipe.description}
              </p>
            )}

            <div className="text-muted-foreground flex items-center justify-between text-xs">
              <div className="flex items-center gap-4">
                {showCookTime && recipe.cookTime && (
                  <span>{recipe.cookTime} min</span>
                )}
                {recipe.difficulty && (
                  <span className="capitalize">{recipe.difficulty}</span>
                )}
              </div>

              {showRating && recipe.rating && (
                <div className="flex items-center gap-1">
                  <span>⭐</span>
                  <span>{recipe.rating}</span>
                </div>
              )}
            </div>

            {showAuthor && recipe.author && (
              <div className="border-border mt-3 flex items-center gap-2 border-t pt-3">
                {recipe.author.avatar && (
                  <Image
                    src={recipe.author.avatar ?? '/placeholder-avatar.jpg'}
                    alt={recipe.author.name}
                    width={24}
                    height={24}
                    className="h-6 w-6 rounded-full"
                  />
                )}
                <span className="text-muted-foreground text-xs">
                  by {recipe.author.name}
                </span>
              </div>
            )}

            {showCategories &&
              recipe.categories &&
              recipe.categories.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {recipe.categories.slice(0, 3).map(category => (
                    <span
                      key={category}
                      className="bg-muted text-muted-foreground rounded-full px-2 py-1 text-xs"
                    >
                      {category}
                    </span>
                  ))}
                  {recipe.categories.length > 3 && (
                    <span className="bg-muted text-muted-foreground rounded-full px-2 py-1 text-xs">
                      +{recipe.categories.length - 3}
                    </span>
                  )}
                </div>
              )}
          </div>
        </article>
      ),
      [
        cardVariant,
        showAuthor,
        showRating,
        showCookTime,
        showCategories,
        props.enableImageLazyLoading,
      ]
    );

    return (
      <InfiniteScroll<Recipe>
        ref={ref}
        renderItem={renderItem ?? defaultRenderItem}
        {...props}
      />
    );
  }
);
RecipeInfiniteScroll.displayName = 'RecipeInfiniteScroll';

// Search results infinite scroll component
const SearchResultsInfiniteScroll = React.forwardRef<
  HTMLDivElement,
  SearchResultsInfiniteScrollProps
>(
  (
    {
      renderItem,
      searchQuery,
      highlightQuery = true,
      showResultType = true,
      showRelevanceScore = false,
      _groupByType = false,
      ...props
    },
    ref
  ) => {
    const highlightText = React.useCallback(
      (text: string, query?: string) => {
        if (!query || !highlightQuery) return text;

        // Use simple string replacement for security compliance
        const lowerText = text.toLowerCase();
        const lowerQuery = query.toLowerCase();
        const index = lowerText.indexOf(lowerQuery);

        if (index === -1) return text;

        const beforeMatch = text.slice(0, index);
        const match = text.slice(index, index + query.length);
        const afterMatch = text.slice(index + query.length);

        return `${beforeMatch}<mark class="bg-highlight-light">${match}</mark>${afterMatch}`;
      },
      [highlightQuery]
    );

    const defaultRenderItem = React.useCallback(
      ({ item: result }: { item: SearchResult; index: number }) => (
        <article
          className={cn(
            searchResultVariants({
              variant: 'default',
              resultType: result.type,
              interactive: true,
            }),
            'focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'
          )}
          aria-label={`${result.type}: ${result.title}`}
        >
          {result.imageUrl && (
            <Image
              src={result.imageUrl ?? '/placeholder-search.jpg'}
              alt={result.title}
              width={48}
              height={48}
              className="h-12 w-12 rounded object-cover"
              loading={props.enableImageLazyLoading ? 'lazy' : 'eager'}
            />
          )}

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between">
              <h3
                className="line-clamp-1 font-medium"
                dangerouslySetInnerHTML={{
                  __html: highlightText(result.title, searchQuery),
                }}
              />
              {showResultType && (
                <span className="result-type-indicator ml-2 rounded-full px-2 py-1 text-xs font-medium">
                  {result.type}
                </span>
              )}
            </div>

            {result.description && (
              <p
                className="text-muted-foreground mt-1 line-clamp-2 text-sm"
                dangerouslySetInnerHTML={{
                  __html: highlightText(result.description, searchQuery),
                }}
              />
            )}

            {showRelevanceScore && result.relevanceScore && (
              <div className="text-muted-foreground mt-2 text-xs">
                Relevance: {Math.round(result.relevanceScore * 100)}%
              </div>
            )}
          </div>
        </article>
      ),
      [
        searchQuery,
        highlightText,
        showResultType,
        showRelevanceScore,
        props.enableImageLazyLoading,
      ]
    );

    return (
      <InfiniteScroll<SearchResult>
        ref={ref}
        variant="default"
        renderItem={renderItem ?? defaultRenderItem}
        {...props}
      />
    );
  }
);
SearchResultsInfiniteScroll.displayName = 'SearchResultsInfiniteScroll';

// Export all components
export {
  InfiniteScroll,
  InfiniteScrollItem,
  RecipeInfiniteScroll,
  SearchResultsInfiniteScroll,
  DefaultInfiniteScrollLoading,
  DefaultInfiniteScrollError,
  DefaultInfiniteScrollEmpty,
  Spinner,
  InfiniteScrollContext,
};

export type {
  InfiniteScrollProps,
  InfiniteScrollItemProps,
  InfiniteScrollLoadingProps,
  InfiniteScrollErrorProps,
  InfiniteScrollEmptyProps,
  RecipeInfiniteScrollProps,
  SearchResultsInfiniteScrollProps,
  Recipe,
  SearchResult,
  LoadingState,
  InfiniteScrollError,
};
