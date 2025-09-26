import { type VariantProps } from 'class-variance-authority';
import {
  contentVariants,
  contentPaneVariants,
  contentHeaderVariants,
  contentSkeletonVariants,
  contentErrorVariants,
  contentGridVariants,
} from '@/lib/ui/content-variants';
import { type ViewMode } from './layout';

// Base content props
export interface BaseContentProps {
  variant?: VariantProps<typeof contentVariants>['variant'];
  size?: VariantProps<typeof contentVariants>['size'];
  className?: string;
  children?: React.ReactNode;
}

// Content pane props
export interface ContentPaneProps extends Omit<BaseContentProps, 'variant'> {
  variant?: VariantProps<typeof contentPaneVariants>['variant'];
  viewMode?: VariantProps<typeof contentPaneVariants>['viewMode'];
  contentWidth?: VariantProps<typeof contentPaneVariants>['contentWidth'];
  loading?: boolean;
  error?: Error | null;
  header?: React.ReactNode;
  actions?: React.ReactNode;
  scrollable?: boolean;
  padding?: boolean;
}

// Content header props
export interface ContentHeaderProps extends Omit<BaseContentProps, 'variant'> {
  variant?: VariantProps<typeof contentHeaderVariants>['variant'];
  title?: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  showDivider?: boolean;
}

// Breadcrumb item interface
export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
  icon?: React.ReactNode;
}

// Content skeleton props
export interface ContentSkeletonProps
  extends Omit<BaseContentProps, 'variant'> {
  variant?: VariantProps<typeof contentSkeletonVariants>['variant'];
  viewMode?: VariantProps<typeof contentSkeletonVariants>['viewMode'];
  count?: number;
  showHeader?: boolean;
}

// Content error props
export interface ContentErrorProps extends Omit<BaseContentProps, 'variant'> {
  variant?: VariantProps<typeof contentErrorVariants>['variant'];
  error?: Error | ContentError | string;
  title?: string;
  description?: string;
  onRetry?: () => void;
  onGoBack?: () => void;
  showActions?: boolean;
  fullHeight?: boolean;
}

// Content error types
export interface ContentError {
  type: 'network' | '404' | '500' | 'validation' | 'unauthorized' | 'generic';
  title?: string;
  message?: string;
  details?: string;
  code?: string | number;
}

// Content provider props
export interface ContentProviderProps {
  children: React.ReactNode;
  defaultViewMode?: ViewMode;
  defaultContentWidth?: 'full' | 'contained';
}

// Content context type
export interface ContentContextType {
  viewMode: ViewMode;
  contentWidth: 'full' | 'contained';
  setViewMode: (mode: ViewMode) => void;
  setContentWidth: (width: 'full' | 'contained') => void;
  toggleViewMode: () => void;
  toggleContentWidth: () => void;
}

// Content section props for complex layouts
export interface ContentSectionProps extends BaseContentProps {
  title?: string;
  description?: string;
  collapsible?: boolean;
  collapsed?: boolean;
  onToggle?: (collapsed: boolean) => void;
  headerActions?: React.ReactNode;
  padding?: boolean;
}

// Content grid props for grid layouts
export interface ContentGridProps extends Omit<BaseContentProps, 'variant'> {
  columns?: VariantProps<typeof contentGridVariants>['columns'] | number;
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  responsive?: boolean;
  minItemWidth?: number;
}

// Content list props for list layouts
export interface ContentListProps extends Omit<BaseContentProps, 'variant'> {
  divided?: boolean;
  spacing?: 'sm' | 'md' | 'lg';
  hover?: boolean;
}

// Content actions props
export interface ContentActionsProps extends BaseContentProps {
  align?: 'left' | 'center' | 'right' | 'between';
  sticky?: boolean;
  border?: boolean;
}
