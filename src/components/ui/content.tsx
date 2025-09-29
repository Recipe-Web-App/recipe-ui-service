'use client';

import * as React from 'react';
import {
  ChevronLeft,
  RefreshCw,
  Home,
  AlertCircle,
  Wifi,
  Server,
} from 'lucide-react';
import { type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { useLayoutStore } from '@/stores/ui/layout-store';
import {
  contentVariants,
  contentPaneVariants,
  contentHeaderVariants,
  contentSkeletonVariants,
  contentErrorVariants,
  contentSectionVariants,
  contentGridVariants,
  contentListVariants,
  contentActionsVariants,
} from '@/lib/ui/content-variants';
import type {
  BaseContentProps,
  ContentPaneProps,
  ContentHeaderProps,
  ContentSkeletonProps,
  ContentErrorProps,
  ContentSectionProps,
  ContentGridProps,
  ContentListProps,
  ContentActionsProps,
  ContentProviderProps,
  ContentContextType,
  ContentError,
} from '@/types/ui/content';
import { ContentContext } from '@/hooks/components/ui/content-hooks';

// Import existing components
import { Button } from './button';
import { Skeleton, SkeletonText } from './skeleton';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
} from './breadcrumb';

/**
 * Base Content Component
 *
 * Foundation component for all content variants.
 */
const Content = React.forwardRef<HTMLDivElement, BaseContentProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(contentVariants({ variant, size }), className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Content.displayName = 'Content';

/**
 * Content Provider Component
 *
 * Provides content context for managing view modes and preferences.
 */
const ContentProvider: React.FC<ContentProviderProps> = ({
  children,
  defaultViewMode = 'grid',
  defaultContentWidth = 'contained',
}) => {
  const {
    viewMode,
    contentWidth,
    setViewMode,
    setContentWidth,
    toggleViewMode,
    toggleContentWidth,
  } = useLayoutStore();

  // Initialize defaults if not set
  React.useEffect(() => {
    if (!viewMode) setViewMode(defaultViewMode);
    if (!contentWidth) setContentWidth(defaultContentWidth);
  }, [
    viewMode,
    contentWidth,
    defaultViewMode,
    defaultContentWidth,
    setViewMode,
    setContentWidth,
  ]);

  const contextValue = React.useMemo<ContentContextType>(
    () => ({
      viewMode: viewMode || defaultViewMode,
      contentWidth: contentWidth || defaultContentWidth,
      setViewMode,
      setContentWidth,
      toggleViewMode,
      toggleContentWidth,
    }),
    [
      viewMode,
      contentWidth,
      defaultViewMode,
      defaultContentWidth,
      setViewMode,
      setContentWidth,
      toggleViewMode,
      toggleContentWidth,
    ]
  );

  return (
    <ContentContext.Provider value={contextValue}>
      {children}
    </ContentContext.Provider>
  );
};

/**
 * Content Pane Component
 *
 * Main content container with flexible view modes and responsive behavior.
 */
const ContentPane = React.forwardRef<HTMLDivElement, ContentPaneProps>(
  (
    {
      className,
      variant = 'default',
      viewMode,
      contentWidth,
      loading = false,
      error = null,
      header,
      actions,
      scrollable = true,
      padding = true,
      children,
      ...props
    },
    ref
  ) => {
    const layoutStore = useLayoutStore();

    // Use prop values or fallback to store values
    const effectiveViewMode = viewMode ?? layoutStore.viewMode;
    const effectiveContentWidth = contentWidth ?? layoutStore.contentWidth;

    // Handle loading state
    if (loading) {
      return (
        <main
          ref={ref}
          className={cn(
            contentPaneVariants({
              variant,
              viewMode: effectiveViewMode,
              contentWidth: effectiveContentWidth,
              scrollable,
              padding,
            }),
            className
          )}
          role="main"
          aria-label="Loading content"
          {...props}
        >
          {header}
          <ContentSkeleton viewMode={effectiveViewMode} showHeader={!header} />
        </main>
      );
    }

    // Handle error state
    if (error) {
      return (
        <main
          ref={ref}
          className={cn(
            contentPaneVariants({
              variant,
              viewMode: effectiveViewMode,
              contentWidth: effectiveContentWidth,
              scrollable,
              padding,
            }),
            className
          )}
          role="main"
          aria-label="Content error"
          {...props}
        >
          {header}
          <ContentError error={error} fullHeight />
          {actions && (
            <ContentActions align="center" border>
              {actions}
            </ContentActions>
          )}
        </main>
      );
    }

    return (
      <main
        ref={ref}
        className={cn(
          contentPaneVariants({
            variant,
            viewMode: effectiveViewMode,
            contentWidth: effectiveContentWidth,
            scrollable,
            padding,
          }),
          className
        )}
        role="main"
        {...props}
      >
        {header}
        {children}
        {actions && (
          <ContentActions align="between" border>
            {actions}
          </ContentActions>
        )}
      </main>
    );
  }
);
ContentPane.displayName = 'ContentPane';

/**
 * Content Header Component
 *
 * Header component with title, description, breadcrumbs, and actions.
 */
const ContentHeader = React.forwardRef<HTMLDivElement, ContentHeaderProps>(
  (
    {
      className,
      variant = 'default',
      title,
      description,
      breadcrumbs,
      actions,
      showDivider = false,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <header
        ref={ref}
        className={cn(
          contentHeaderVariants({ variant, showDivider }),
          className
        )}
        role="banner"
        {...props}
      >
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb">
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((item, index) => (
                  <BreadcrumbItem key={`${item.label}-${index}`}>
                    {item.current ? (
                      <BreadcrumbPage>
                        {item.icon && <span className="mr-2">{item.icon}</span>}
                        {item.label}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={item.href}>
                        {item.icon && <span className="mr-2">{item.icon}</span>}
                        {item.label}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </nav>
        )}

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2">
            {title && (
              <h1 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
                {title}
              </h1>
            )}
            {description && (
              <p className="text-muted-foreground max-w-2xl">{description}</p>
            )}
          </div>

          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>

        {children}
      </header>
    );
  }
);
ContentHeader.displayName = 'ContentHeader';

/**
 * Content Skeleton Component
 *
 * Loading skeleton that adapts to different view modes.
 */
const ContentSkeleton = React.forwardRef<HTMLDivElement, ContentSkeletonProps>(
  (
    {
      className,
      variant = 'default',
      viewMode = 'grid',
      count = 6,
      showHeader = true,
      children,
      ...props
    },
    ref
  ) => {
    const renderSkeletonItems = () => {
      switch (viewMode) {
        case 'grid':
        case 'card':
          return Array.from({ length: count }).map((_, index) => (
            <div key={index} className="space-y-3">
              <Skeleton className="h-48 w-full rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <SkeletonText lines="two" />
              </div>
            </div>
          ));

        case 'list':
          return Array.from({ length: count }).map((_, index) => (
            <div key={index} className="flex gap-4 p-4">
              <Skeleton className="h-16 w-16 flex-shrink-0 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/2" />
                <SkeletonText lines="two" />
                <div className="flex gap-2">
                  <Skeleton className="h-3 w-12" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            </div>
          ));

        case 'table':
          return (
            <div className="space-y-2">
              {/* Table header */}
              <div className="grid grid-cols-4 gap-4 border-b p-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="h-4 w-full" />
                ))}
              </div>
              {/* Table rows */}
              {Array.from({ length: count }).map((_, index) => (
                <div
                  key={index}
                  className="grid grid-cols-4 gap-4 border-b p-4"
                >
                  {Array.from({ length: 4 }).map((_, colIndex) => (
                    <Skeleton key={colIndex} className="h-4 w-full" />
                  ))}
                </div>
              ))}
            </div>
          );

        default:
          return Array.from({ length: count }).map((_, index) => (
            <Skeleton key={index} className="h-24 w-full rounded" />
          ));
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          contentSkeletonVariants({ variant, viewMode, showHeader }),
          className
        )}
        role="status"
        aria-label="Loading content..."
        {...props}
      >
        {showHeader && (
          <div className="mb-6 space-y-2">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        )}

        <div
          className={cn(
            viewMode === 'grid' &&
              'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
            viewMode === 'card' &&
              'grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3',
            viewMode === 'list' && 'space-y-4',
            viewMode === 'table' && 'w-full'
          )}
        >
          {renderSkeletonItems()}
        </div>

        {children}
      </div>
    );
  }
);
ContentSkeleton.displayName = 'ContentSkeleton';

/**
 * Content Error Component
 *
 * Error display with recovery actions and contextual messaging.
 */
const ContentError = React.forwardRef<HTMLDivElement, ContentErrorProps>(
  (
    {
      className,
      variant,
      error,
      title,
      description,
      onRetry,
      onGoBack,
      showActions = true,
      fullHeight = false,
      children,
      ...props
    },
    ref
  ) => {
    // Parse error information
    const errorInfo = React.useMemo(() => {
      if (typeof error === 'string') {
        return {
          type: 'generic' as const,
          title: title ?? 'Error',
          message: error,
          details: description,
        };
      }

      if (error instanceof Error) {
        return {
          type: 'generic' as const,
          title: title ?? error.name ?? 'Error',
          message: error.message,
          details: description ?? error.stack?.split('\n')[0],
        };
      }

      if (error && typeof error === 'object' && 'type' in error) {
        const contentError = error as ContentError;
        return {
          type: contentError.type,
          title:
            title ?? contentError.title ?? getErrorTitle(contentError.type),
          message: contentError.message ?? getErrorMessage(contentError.type),
          details: description ?? contentError.details,
          code: contentError.code,
        };
      }

      return {
        type: 'generic' as const,
        title: title ?? 'Something went wrong',
        message: 'An unexpected error occurred',
        details: description,
      };
    }, [error, title, description]);

    const getErrorIcon = (type: ContentError['type']) => {
      switch (type) {
        case 'network':
          return <Wifi className="text-muted-foreground h-12 w-12" />;
        case '404':
          return <AlertCircle className="text-muted-foreground h-12 w-12" />;
        case '500':
          return <Server className="text-destructive h-12 w-12" />;
        case 'unauthorized':
          return <AlertCircle className="text-warning h-12 w-12" />;
        case 'validation':
          return <AlertCircle className="text-warning h-12 w-12" />;
        default:
          return <AlertCircle className="text-muted-foreground h-12 w-12" />;
      }
    };

    const getErrorTitle = (type: ContentError['type']) => {
      switch (type) {
        case 'network':
          return 'Network Error';
        case '404':
          return 'Page Not Found';
        case '500':
          return 'Server Error';
        case 'unauthorized':
          return 'Access Denied';
        case 'validation':
          return 'Validation Error';
        default:
          return 'Error';
      }
    };

    const getErrorMessage = (type: ContentError['type']) => {
      switch (type) {
        case 'network':
          return 'Unable to connect to the server. Please check your internet connection.';
        case '404':
          return 'The page you are looking for could not be found.';
        case '500':
          return 'An internal server error occurred. Please try again later.';
        case 'unauthorized':
          return 'You do not have permission to access this resource.';
        case 'validation':
          return 'The provided data is invalid. Please check your input.';
        default:
          return 'An unexpected error occurred.';
      }
    };

    const effectiveVariant =
      variant ??
      (errorInfo.type as VariantProps<
        typeof contentErrorVariants
      >['variant']) ??
      'default';

    return (
      <div
        ref={ref}
        className={cn(
          contentErrorVariants({ variant: effectiveVariant, fullHeight }),
          className
        )}
        role="alert"
        aria-live="polite"
        {...props}
      >
        {getErrorIcon(errorInfo.type)}

        <div className="space-y-2 text-center">
          <h2 className="text-xl font-semibold">{errorInfo.title}</h2>
          <p className="text-muted-foreground max-w-md">{errorInfo.message}</p>
          {errorInfo.details && (
            <p className="text-muted-foreground/80 text-sm">
              {errorInfo.details}
            </p>
          )}
          {errorInfo.code && (
            <p className="text-muted-foreground/60 font-mono text-xs">
              Error Code: {errorInfo.code}
            </p>
          )}
        </div>

        {showActions && (onRetry ?? onGoBack) && (
          <div className="flex items-center gap-3">
            {onRetry && (
              <Button variant="default" onClick={onRetry} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
            )}
            {onGoBack && (
              <Button variant="outline" onClick={onGoBack} className="gap-2">
                <ChevronLeft className="h-4 w-4" />
                Go Back
              </Button>
            )}
            <Button
              variant="ghost"
              onClick={() => (window.location.href = '/')}
              className="gap-2"
            >
              <Home className="h-4 w-4" />
              Home
            </Button>
          </div>
        )}

        {children}
      </div>
    );
  }
);
ContentError.displayName = 'ContentError';

/**
 * Content Section Component
 *
 * Sectioned content with optional collapsible functionality.
 */
const ContentSection = React.forwardRef<HTMLDivElement, ContentSectionProps>(
  (
    {
      className,
      variant = 'default',
      title,
      description,
      collapsible = false,
      collapsed = false,
      onToggle,
      headerActions,
      padding = false,
      children,
      ...props
    },
    ref
  ) => {
    const [isCollapsed, setIsCollapsed] = React.useState(collapsed);

    const handleToggle = () => {
      const newCollapsed = !isCollapsed;
      setIsCollapsed(newCollapsed);
      onToggle?.(newCollapsed);
    };

    return (
      <section
        ref={ref}
        className={cn(
          contentSectionVariants({
            variant,
            collapsible,
            collapsed: isCollapsed,
            padding,
          }),
          className
        )}
        {...props}
      >
        {(title ?? description ?? headerActions ?? collapsible) && (
          <header className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              {title && (
                <h3 className="text-foreground text-lg font-semibold">
                  {title}
                </h3>
              )}
              {description && (
                <p className="text-muted-foreground mt-1 text-sm">
                  {description}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              {headerActions}
              {collapsible && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleToggle}
                  aria-expanded={!isCollapsed}
                  aria-label={
                    isCollapsed ? 'Expand section' : 'Collapse section'
                  }
                >
                  <ChevronLeft
                    className={cn(
                      'h-4 w-4 transition-transform',
                      isCollapsed ? '-rotate-90' : 'rotate-0'
                    )}
                  />
                </Button>
              )}
            </div>
          </header>
        )}

        <div
          className={cn(
            'transition-all duration-200 ease-in-out',
            isCollapsed && collapsible ? 'hidden' : 'block'
          )}
        >
          {children}
        </div>
      </section>
    );
  }
);
ContentSection.displayName = 'ContentSection';

/**
 * Content Grid Component
 *
 * Responsive grid container for content items.
 */
const ContentGrid = React.forwardRef<HTMLDivElement, ContentGridProps>(
  (
    {
      className,
      columns = 3,
      gap = 'lg',
      responsive = false,
      children,
      ...props
    },
    ref
  ) => {
    const gridColumns = columns as VariantProps<
      typeof contentGridVariants
    >['columns'];

    return (
      <div
        ref={ref}
        className={cn(
          contentGridVariants({ columns: gridColumns, gap, responsive }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
ContentGrid.displayName = 'ContentGrid';

/**
 * Content List Component
 *
 * List container with optional dividers and hover effects.
 */
const ContentList = React.forwardRef<HTMLDivElement, ContentListProps>(
  (
    {
      className,
      divided = false,
      spacing = 'md',
      hover = false,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          contentListVariants({ divided, spacing, hover }),
          className
        )}
        role="list"
        {...props}
      >
        {children}
      </div>
    );
  }
);
ContentList.displayName = 'ContentList';

/**
 * Content Actions Component
 *
 * Action bar for content with different alignment and styling options.
 */
const ContentActions = React.forwardRef<HTMLDivElement, ContentActionsProps>(
  (
    {
      className,
      align = 'left',
      sticky = false,
      border = false,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          contentActionsVariants({ align, sticky, border }),
          className
        )}
        role="toolbar"
        {...props}
      >
        {children}
      </div>
    );
  }
);
ContentActions.displayName = 'ContentActions';

export {
  Content,
  ContentProvider,
  ContentPane,
  ContentHeader,
  ContentSkeleton,
  ContentError,
  ContentSection,
  ContentGrid,
  ContentList,
  ContentActions,
};
