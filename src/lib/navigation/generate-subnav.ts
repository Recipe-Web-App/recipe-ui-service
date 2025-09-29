import fs from 'fs';
import path from 'path';
import sanitizeFilename from 'sanitize-filename';
import type { LucideIcon } from 'lucide-react';
import { getIcon } from '@/lib/ui/icon-registry';
import { featureFlags } from '@/lib/features/flags';
import type {
  NavItem,
  FolderNavConfig,
  NavigationContext,
  ProcessedNavItem,
  NavGenerationOptions,
} from '@/types/navigation';

/**
 * Safely joins path segments after sanitization using industry-standard sanitization.
 * Returns null if any segment becomes empty after sanitization.
 */
const safeJoinPath = (
  basePath: string,
  ...segments: string[]
): string | null => {
  // Sanitize all segments using the standard sanitize-filename package
  const sanitizedSegments = segments.map(segment =>
    sanitizeFilename(segment, { replacement: '' })
  );

  // Check if any segment became empty after sanitization
  if (sanitizedSegments.some(segment => segment === '')) {
    return null;
  }

  // Use path.join with sanitized segments - this is now safe
  const normalizedBase = path.normalize(basePath);
  // All segments have been sanitized using the industry-standard sanitize-filename package
  const joined = path.join(normalizedBase, ...sanitizedSegments); // nosemgrep: javascript.lang.security.audit.path-traversal.path-join-resolve-traversal.path-join-resolve-traversal
  const finalPath = path.normalize(joined);

  return finalPath;
};

/**
 * Default navigation generation options
 */
const DEFAULT_OPTIONS: Required<NavGenerationOptions> = {
  basePath: '',
  maxDepth: 3,
  includeDisabled: false,
  sortFn: (a, b) => (a.metadata?.sortOrder ?? 0) - (b.metadata?.sortOrder ?? 0),
  filterFn: () => true,
};

/**
 * Generate breadcrumbs from a path
 */
export const generateBreadcrumbs = (
  pathname: string
): Array<{ label: string; href?: string }> => {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: Array<{ label: string; href?: string }> = [
    { label: 'Home', href: '/' },
  ];

  let currentPath = '';
  for (let i = 0; i < segments.length; i++) {
    // ESLint disable: array index access is safe within bounds-checked loop
    // eslint-disable-next-line security/detect-object-injection
    const segment = segments[i];
    if (!segment) {
      continue;
    }

    currentPath += `/${segment}`;
    const isLast = i === segments.length - 1;

    // Convert segment to readable label
    const label = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    const breadcrumb: { label: string; href?: string } = {
      label,
    };

    if (!isLast) {
      breadcrumb.href = currentPath;
    }

    breadcrumbs.push(breadcrumb);
  }

  return breadcrumbs;
};

/**
 * Read and parse _meta.json file from a directory
 */
const readMetaFile = (dirPath: string): FolderNavConfig | null => {
  try {
    // Use safe path joining
    const metaPath = safeJoinPath(dirPath, '_meta.json');
    if (!metaPath) {
      console.warn('Invalid path for _meta.json');
      return null;
    }

    if (!fs.existsSync(metaPath)) {
      return null;
    }

    const metaContent = fs.readFileSync(metaPath, 'utf-8');
    const config = JSON.parse(metaContent) as FolderNavConfig;

    // Validate the config structure
    if (typeof config !== 'object' || config === null) {
      console.warn('Invalid _meta.json format in directory');
      return null;
    }

    return config;
  } catch (error) {
    console.warn('Failed to read _meta.json from directory', { error });
    return null;
  }
};

/**
 * Generate navigation item from directory path and metadata
 */
const generateNavItemFromPath = (
  dirPath: string,
  basePath: string,
  _options: Required<NavGenerationOptions>
): NavItem | null => {
  const relativePath = path.relative(basePath, dirPath);
  const segments = relativePath.split(path.sep).filter(Boolean);

  if (segments.length === 0) return null;

  const folderName = segments[segments.length - 1];

  // Skip if this looks like a Next.js special folder
  if (
    folderName.startsWith('(') ||
    folderName.startsWith('_') ||
    folderName === 'api'
  ) {
    return null;
  }

  // Read metadata file
  const metaConfig = readMetaFile(dirPath);
  const navConfig = metaConfig?.navigation;

  // Generate basic nav item properties
  const id = segments.join('-');
  const href = `/${segments.join('/')}`;

  // Generate default label from folder name
  const defaultLabel = folderName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const label = navConfig?.label ?? defaultLabel;

  // Get icon from registry if specified
  const iconComponent = navConfig?.icon ? getIcon(navConfig.icon) : undefined;

  const navItem: NavItem = {
    id,
    label,
    href,
    icon: iconComponent != null ? (iconComponent as LucideIcon) : undefined, // Type compatibility with LucideIcon
    metadata: {
      sortOrder: navConfig?.sortOrder ?? 0,
      requiredAuth: navConfig?.requiredAuth,
      requiredRoles: navConfig?.requiredRoles,
      featureFlag: navConfig?.featureFlag,
      badge: navConfig?.badge,
      badgeVariant: navConfig?.badgeVariant,
      showInMobile: navConfig?.showInMobile,
      showInDesktop: navConfig?.showInDesktop,
      tooltip: navConfig?.tooltip,
      disabled: navConfig?.disabled,
      external: navConfig?.external,
      target: navConfig?.target,
    },
  };

  return navItem;
};

/**
 * Recursively scan directory for navigation items
 */
const scanDirectoryForNavItems = (
  dirPath: string,
  basePath: string,
  currentDepth: number,
  _options: Required<NavGenerationOptions>
): NavItem[] => {
  if (currentDepth >= _options.maxDepth) {
    return [];
  }

  try {
    if (!fs.existsSync(dirPath) || !fs.statSync(dirPath).isDirectory()) {
      return [];
    }

    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    const navItems: NavItem[] = [];

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;

      // Validate entry name using sanitization - if it changes, it was potentially dangerous
      const sanitizedEntryName = sanitizeFilename(entry.name, {
        replacement: '',
      });
      if (sanitizedEntryName !== entry.name || sanitizedEntryName === '') {
        continue; // Skip entries that require sanitization or become empty
      }

      const fullPath = safeJoinPath(dirPath, entry.name);
      if (!fullPath) {
        continue; // Skip if path joining failed
      }

      const navItem = generateNavItemFromPath(fullPath, basePath, _options);

      if (!navItem) continue;

      // Check if this directory has a page.tsx file (indicating it's routable)
      const pageFilePath = safeJoinPath(fullPath, 'page.tsx');
      const hasPage = pageFilePath ? fs.existsSync(pageFilePath) : false;

      if (!hasPage) {
        // If no page.tsx, remove href but keep item for grouping children
        delete navItem.href;
      }

      // Recursively scan for children
      const children = scanDirectoryForNavItems(
        fullPath,
        basePath,
        currentDepth + 1,
        _options
      );
      if (children.length > 0) {
        navItem.children = children.sort(_options.sortFn);
      }

      navItems.push(navItem);
    }

    return navItems.sort(_options.sortFn);
  } catch (error) {
    console.warn('Failed to scan directory', { error });
    return [];
  }
};

/**
 * Generate navigation items from filesystem structure
 */
export const generateNavigationFromFileSystem = (
  appDir: string,
  routeGroup?: string,
  _options: Partial<NavGenerationOptions> = {}
): NavItem[] => {
  const finalOptions = { ...DEFAULT_OPTIONS, ..._options };

  // Normalize the base app directory
  const normalizedAppDir = path.normalize(appDir);

  // Validate it's an absolute path
  if (!path.isAbsolute(normalizedAppDir)) {
    console.warn('App directory must be an absolute path');
    return [];
  }

  let scanPath = normalizedAppDir;

  if (routeGroup) {
    // Validate route group name using sanitization - if it changes, it was potentially dangerous
    const sanitizedRouteGroup = sanitizeFilename(routeGroup, {
      replacement: '',
    });
    if (sanitizedRouteGroup !== routeGroup || sanitizedRouteGroup === '') {
      console.warn('Invalid route group name');
      return [];
    }

    const groupPath = safeJoinPath(normalizedAppDir, routeGroup);
    if (!groupPath) {
      console.warn('Failed to create route group path');
      return [];
    }
    scanPath = groupPath;
  }

  return scanDirectoryForNavItems(scanPath, scanPath, 0, finalOptions);
};

/**
 * Process navigation items with context (auth, feature flags, etc.)
 */
export const processNavigationWithContext = (
  navItems: NavItem[],
  context: NavigationContext,
  _options: Partial<NavGenerationOptions> = {}
): ProcessedNavItem[] => {
  const finalOptions = { ...DEFAULT_OPTIONS, ..._options };

  const processItem = (
    item: NavItem,
    level: number = 0
  ): ProcessedNavItem | null => {
    // Check feature flag
    if (
      item.metadata?.featureFlag &&
      !featureFlags.isEnabled(
        item.metadata.featureFlag as Parameters<
          typeof featureFlags.isEnabled
        >[0]
      )
    ) {
      return null;
    }

    // Check authentication requirement
    if (item.metadata?.requiredAuth && !context.isAuthenticated) {
      return null;
    }

    // Check required roles
    if (item.metadata?.requiredRoles && context.userRoles) {
      const hasRequiredRole = item.metadata.requiredRoles.some(role =>
        context.userRoles?.includes(role)
      );
      if (!hasRequiredRole) {
        return null;
      }
    }

    // Check mobile/desktop visibility
    if (context.isMobile && item.metadata?.showInMobile === false) {
      return null;
    }
    if (!context.isMobile && item.metadata?.showInDesktop === false) {
      return null;
    }

    // Check if disabled and whether to include
    if (item.metadata?.disabled && !finalOptions.includeDisabled) {
      return null;
    }

    // Apply custom filter
    if (!finalOptions.filterFn(item, context)) {
      return null;
    }

    // Determine if item is active
    const isActive = Boolean(
      item.href === context.currentPath ||
        (item.href && context.currentPath.startsWith(item.href + '/'))
    );

    // Process children
    const processedChildren = item.children
      ?.map(child => processItem(child, level + 1))
      .filter((child): child is ProcessedNavItem => child !== null);

    const processedItem: ProcessedNavItem = {
      ...item,
      active: isActive,
      visible: true,
      children:
        processedChildren && processedChildren.length > 0
          ? processedChildren
          : undefined,
      fullPath: item.href ?? '',
      level,
    };

    return processedItem;
  };

  return navItems
    .map(item => processItem(item))
    .filter((item): item is ProcessedNavItem => item !== null)
    .sort(finalOptions.sortFn);
};

/**
 * Find the active navigation item in a navigation tree
 */
export const findActiveNavItem = (
  navItems: NavItem[],
  currentPath: string
): NavItem | null => {
  for (const item of navItems) {
    if (item.href === currentPath) {
      return item;
    }

    if (item.children) {
      const childResult = findActiveNavItem(item.children, currentPath);
      if (childResult) {
        return childResult;
      }
    }

    // Check if current path starts with item path (for nested routes)
    if (item.href && currentPath.startsWith(item.href + '/')) {
      return item;
    }
  }

  return null;
};

/**
 * Get the parent navigation item for a given path
 */
export const getParentNavItem = (
  navItems: NavItem[],
  currentPath: string
): NavItem | null => {
  const pathSegments = currentPath.split('/').filter(Boolean);

  if (pathSegments.length <= 1) {
    return null;
  }

  const parentPath = '/' + pathSegments.slice(0, -1).join('/');
  return findActiveNavItem(navItems, parentPath);
};

/**
 * Get navigation path (breadcrumb trail) to a specific item
 */
export const getNavigationPath = (
  navItems: NavItem[],
  targetPath: string
): NavItem[] => {
  const path: NavItem[] = [];

  const findPath = (items: NavItem[]): boolean => {
    for (const item of items) {
      if (item.href === targetPath) {
        path.push(item);
        return true;
      }

      if (item.children) {
        path.push(item);
        if (findPath(item.children)) {
          return true;
        }
        path.pop();
      }
    }
    return false;
  };

  findPath(navItems);
  return path;
};

/**
 * Flatten navigation tree into a single array
 */
export const flattenNavigation = (navItems: NavItem[]): NavItem[] => {
  const flattened: NavItem[] = [];
  const visited = new Set<string>();

  const flatten = (items: NavItem[]) => {
    for (const item of items) {
      // Prevent circular references
      if (visited.has(item.id)) {
        continue;
      }

      visited.add(item.id);
      flattened.push(item);

      if (item.children) {
        flatten(item.children);
      }

      visited.delete(item.id);
    }
  };

  flatten(navItems);
  return flattened;
};

/**
 * Search navigation items by label or href
 */
export const searchNavigation = (
  navItems: NavItem[],
  query: string
): NavItem[] => {
  const results: NavItem[] = [];
  const lowerQuery = query.toLowerCase();
  const visited = new Set<string>();

  const search = (items: NavItem[]) => {
    for (const item of items) {
      // Prevent circular references
      if (visited.has(item.id)) {
        continue;
      }

      visited.add(item.id);

      const labelMatch = item.label.toLowerCase().includes(lowerQuery);
      const hrefMatch = item.href?.toLowerCase().includes(lowerQuery);

      if (labelMatch || hrefMatch) {
        results.push(item);
      }

      if (item.children) {
        search(item.children);
      }

      visited.delete(item.id);
    }
  };

  search(navItems);
  return results;
};

/**
 * Default export with commonly used functions
 */
export const navigationUtils = {
  generateFromFileSystem: generateNavigationFromFileSystem,
  processWithContext: processNavigationWithContext,
  findActive: findActiveNavItem,
  getParent: getParentNavItem,
  getPath: getNavigationPath,
  flatten: flattenNavigation,
  search: searchNavigation,
  generateBreadcrumbs,
} as const;
