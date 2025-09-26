import { type LucideIcon } from 'lucide-react';

/**
 * Navigation item metadata for enhanced functionality
 */
export interface NavMetadata {
  /** Badge text or number to display next to the navigation item */
  badge?: string | number;
  /** Badge variant for styling */
  badgeVariant?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'destructive'
    | 'outline';
  /** Whether authentication is required to access this item */
  requiredAuth?: boolean;
  /** Required user roles to access this item */
  requiredRoles?: string[];
  /** Feature flag that controls visibility of this item */
  featureFlag?: string;
  /** Sort order for positioning (lower numbers appear first) */
  sortOrder?: number;
  /** Whether this item should be shown in mobile navigation */
  showInMobile?: boolean;
  /** Whether this item should be shown in desktop navigation */
  showInDesktop?: boolean;
  /** Custom CSS classes for styling */
  className?: string;
  /** Tooltip text to show on hover */
  tooltip?: string;
  /** Whether this item is disabled */
  disabled?: boolean;
  /** External URL indicator */
  external?: boolean;
  /** Whether to open link in new tab/window */
  target?: '_blank' | '_self' | '_parent' | '_top';
}

/**
 * Core navigation item structure
 */
export interface NavItem {
  /** Unique identifier for the navigation item */
  id: string;
  /** Display label for the navigation item */
  label: string;
  /** URL path for the navigation item */
  href?: string;
  /** Lucide icon component */
  icon?: LucideIcon;
  /** Child navigation items for hierarchical navigation */
  children?: NavItem[];
  /** Additional metadata for the navigation item */
  metadata?: NavMetadata;
}

/**
 * Breadcrumb item for navigation trails
 */
export interface Breadcrumb {
  /** Unique identifier for the breadcrumb */
  id?: string;
  /** Display label for the breadcrumb */
  label: string;
  /** URL path for the breadcrumb (optional for current page) */
  href?: string;
  /** Lucide icon component for the breadcrumb */
  icon?: LucideIcon;
  /** Whether this is the current/active breadcrumb */
  current?: boolean;
}

/**
 * Navigation configuration for folder-based routing
 * Used in _meta.json files
 */
export interface FolderNavConfig {
  /** Navigation item configuration */
  navigation?: {
    /** Display label override */
    label?: string;
    /** Icon name from the icon registry */
    icon?: string;
    /** Sort order for positioning */
    sortOrder?: number;
    /** Whether authentication is required */
    requiredAuth?: boolean;
    /** Required user roles */
    requiredRoles?: string[];
    /** Badge configuration */
    badge?: string | number;
    /** Badge variant */
    badgeVariant?: NavMetadata['badgeVariant'];
    /** Feature flag requirement */
    featureFlag?: string;
    /** Whether to show in mobile navigation */
    showInMobile?: boolean;
    /** Whether to show in desktop navigation */
    showInDesktop?: boolean;
    /** Custom tooltip text */
    tooltip?: string;
    /** Whether this item is disabled */
    disabled?: boolean;
    /** External URL indicator */
    external?: boolean;
    /** Link target */
    target?: NavMetadata['target'];
  };
}

/**
 * Navigation context for sub-navigation generation
 */
export interface NavigationContext {
  /** Current route path */
  currentPath: string;
  /** User authentication status */
  isAuthenticated?: boolean;
  /** User roles */
  userRoles?: string[];
  /** Active feature flags */
  featureFlags?: Record<string, boolean>;
  /** Mobile/desktop context */
  isMobile?: boolean;
}

/**
 * Navigation processing result
 */
export interface ProcessedNavItem extends NavItem {
  /** Whether this item is currently active */
  active: boolean;
  /** Whether this item is visible based on auth/flags */
  visible: boolean;
  /** Processed children with context applied */
  children?: ProcessedNavItem[];
  /** Full path including parent paths */
  fullPath: string;
  /** Depth level in the navigation hierarchy */
  level: number;
}

/**
 * Navigation generation options
 */
export interface NavGenerationOptions {
  /** Base path for relative URL generation */
  basePath?: string;
  /** Maximum depth to traverse */
  maxDepth?: number;
  /** Whether to include disabled items */
  includeDisabled?: boolean;
  /** Custom sorting function */
  sortFn?: (a: NavItem, b: NavItem) => number;
  /** Filter function for items */
  filterFn?: (item: NavItem, context: NavigationContext) => boolean;
}

/**
 * Navigation store state interface
 * Extends the navigation store from Job 1
 */
export interface NavigationState {
  // Sidebar state
  isSidebarOpen: boolean;
  isSidebarCollapsed: boolean;

  // Mobile state
  isMobileMenuOpen: boolean;

  // Navigation tracking
  breadcrumbs: Breadcrumb[];
  activeRoute: string;
  navigationHistory: string[];

  // Navigation configuration
  topLevelNavigation: NavItem[];
  currentSubNavigation: NavItem[];

  // Actions
  toggleSidebar: () => void;
  collapseSidebar: (collapsed: boolean) => void;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  setActiveRoute: (route: string) => void;
  setBreadcrumbs: (breadcrumbs: Breadcrumb[]) => void;
  pushToHistory: (route: string) => void;
  setTopLevelNavigation: (navigation: NavItem[]) => void;
  setCurrentSubNavigation: (navigation: NavItem[]) => void;
}

/**
 * Type guard to check if an item has children
 */
export const hasChildren = (
  item: NavItem
): item is NavItem & { children: NavItem[] } => {
  return Boolean(item.children && item.children.length > 0);
};

/**
 * Type guard to check if an item is external
 */
export const isExternalLink = (item: NavItem): boolean => {
  return (
    Boolean(item.metadata?.external) || Boolean(item.href?.startsWith('http'))
  );
};

/**
 * Type guard to check if an item requires authentication
 */
export const requiresAuth = (item: NavItem): boolean => {
  return Boolean(item.metadata?.requiredAuth);
};

/**
 * Type guard to check if an item is disabled
 */
export const isDisabled = (item: NavItem): boolean => {
  return Boolean(item.metadata?.disabled);
};

/**
 * Utility type for navigation item with required href
 */
export type NavigableItem = NavItem & { href: string };

/**
 * Utility type for extracting navigation item IDs
 */
export type NavItemId<T extends NavItem> = T['id'];

/**
 * Utility type for navigation configuration keys
 */
export type NavConfigKey = keyof FolderNavConfig['navigation'];

/**
 * Type for icon name strings (from icon registry)
 */
export type IconName = string;

/**
 * Type for route parameters in dynamic navigation
 */
export type RouteParams = Record<string, string | string[]>;
