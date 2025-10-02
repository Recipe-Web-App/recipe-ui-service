import {
  getRouteMetadataByPattern,
  getAllRouteMetadata,
  type RouteMetadata,
} from './route-metadata';
import type { BreadcrumbItem } from '@/types/ui/breadcrumb';

/**
 * Parse route parameters from a pathname given a pattern
 *
 * @example
 * parseRouteParams('/recipes/123', '/recipes/[id]')
 * // Returns: { id: '123' }
 *
 * parseRouteParams('/recipes/tags/italian', '/recipes/tags/[tag]')
 * // Returns: { tag: 'italian' }
 */
export function parseRouteParams(
  pathname: string,
  pattern: string
): Record<string, string> {
  const params: Record<string, string> = {};

  const pathnameSegments = pathname.split('/').filter(Boolean);
  const patternSegments = pattern.split('/').filter(Boolean);

  if (pathnameSegments.length !== patternSegments.length) {
    return params;
  }

  patternSegments.forEach((segment, index) => {
    // Check if segment is a dynamic parameter (e.g., [id], [slug])
    const dynamicMatch = /^\[(.+)\]$/.exec(segment);

    if (dynamicMatch) {
      // Extract parameter name from [paramName]
      const paramName = dynamicMatch[1];
      // Set parameter value from pathname
      // eslint-disable-next-line security/detect-object-injection
      params[paramName] = pathnameSegments[index] || '';
    }
  });

  return params;
}

/**
 * Match a pathname to a route pattern
 *
 * @example
 * matchRoutePattern('/recipes/123', '/recipes/[id]')
 * // Returns: true
 *
 * matchRoutePattern('/recipes/create', '/recipes/[id]')
 * // Returns: false (exact match required for non-dynamic segments)
 */
export function matchRoutePattern(pathname: string, pattern: string): boolean {
  const pathnameSegments = pathname.split('/').filter(Boolean);
  const patternSegments = pattern.split('/').filter(Boolean);

  // Must have same number of segments
  if (pathnameSegments.length !== patternSegments.length) {
    return false;
  }

  // Check each segment
  return patternSegments.every((segment, index) => {
    // Dynamic segment (e.g., [id]) matches any value
    if (segment.startsWith('[') && segment.endsWith(']')) {
      return true;
    }

    // Static segment must match exactly
    // eslint-disable-next-line security/detect-object-injection
    return segment === pathnameSegments[index];
  });
}

/**
 * Find the best matching route metadata for a pathname
 *
 * Prioritizes exact matches, then dynamic routes by specificity
 */
export function findMatchingRouteMetadata(
  pathname: string
): RouteMetadata | undefined {
  const allMetadata = getAllRouteMetadata();

  // First, try to find exact match
  const exactMatch = allMetadata.find(meta => meta.pattern === pathname);
  if (exactMatch) {
    return exactMatch;
  }

  // Then, find matching dynamic routes
  const matchingRoutes = allMetadata.filter(meta =>
    matchRoutePattern(pathname, meta.pattern)
  );

  if (matchingRoutes.length === 0) {
    return undefined;
  }

  // Sort by specificity (fewer dynamic segments = more specific)
  const sortedMatches = matchingRoutes.toSorted((a, b) => {
    const aDynamicCount = (a.pattern.match(/\[/g) ?? []).length;
    const bDynamicCount = (b.pattern.match(/\[/g) ?? []).length;
    return aDynamicCount - bDynamicCount;
  });

  return sortedMatches[0];
}

/**
 * Get the parent route metadata for a given route
 */
export function getParentRouteMetadata(
  metadata: RouteMetadata
): RouteMetadata | undefined {
  if (!metadata.parent) {
    return undefined;
  }

  return getRouteMetadataByPattern(metadata.parent);
}

/**
 * Build a full breadcrumb trail for a route
 *
 * Recursively builds the breadcrumb hierarchy from root to current route
 */
export async function buildBreadcrumbTrail(
  pathname: string
): Promise<BreadcrumbItem[]> {
  const metadata = findMatchingRouteMetadata(pathname);

  if (!metadata) {
    // Fallback to simple path-based breadcrumbs
    return buildFallbackBreadcrumbs(pathname);
  }

  // Hidden routes don't generate breadcrumbs
  if (metadata.hiddenFromBreadcrumbs) {
    return [];
  }

  const breadcrumbs: BreadcrumbItem[] = [];

  // Recursively build parent breadcrumbs
  if (metadata.parent) {
    const parentMetadata = getParentRouteMetadata(metadata);
    if (parentMetadata) {
      const parentBreadcrumbs = await buildBreadcrumbTrail(metadata.parent);
      breadcrumbs.push(...parentBreadcrumbs);
    }
  }

  // Resolve label for current route
  let label = metadata.label;
  if (metadata.labelResolver) {
    const params = parseRouteParams(pathname, metadata.pattern);
    label = await Promise.resolve(metadata.labelResolver(params));
  }

  // Add current route breadcrumb
  breadcrumbs.push({
    id: metadata.pattern,
    label,
    href: pathname,
    icon: metadata.icon?.name,
  });

  return breadcrumbs;
}

/**
 * Build fallback breadcrumbs from pathname segments
 *
 * Used when no route metadata is found
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
      href,
    });
  });

  return breadcrumbs;
}

/**
 * Build a URL with route parameters
 *
 * @example
 * buildRouteWithParams('/recipes/[id]', { id: '123' })
 * // Returns: '/recipes/123'
 *
 * buildRouteWithParams('/recipes/tags/[tag]', { tag: 'italian' })
 * // Returns: '/recipes/tags/italian'
 */
export function buildRouteWithParams(
  pattern: string,
  params: Record<string, string>
): string {
  let route = pattern;

  // Replace each [param] with its value
  Object.entries(params).forEach(([key, value]) => {
    route = route.replace(`[${key}]`, value);
  });

  return route;
}

/**
 * Extract route segments from a pathname
 *
 * @example
 * getRouteSegments('/recipes/123/edit')
 * // Returns: ['recipes', '123', 'edit']
 */
export function getRouteSegments(pathname: string): string[] {
  return pathname.split('/').filter(Boolean);
}

/**
 * Get the parent path of a route
 *
 * @example
 * getParentPath('/recipes/123/edit')
 * // Returns: '/recipes/123'
 *
 * getParentPath('/recipes')
 * // Returns: '/'
 */
export function getParentPath(pathname: string): string {
  const segments = getRouteSegments(pathname);

  if (segments.length === 0) {
    return '/';
  }

  if (segments.length === 1) {
    return '/';
  }

  return '/' + segments.slice(0, -1).join('/');
}

/**
 * Check if a route is a child of another route
 *
 * @example
 * isChildRoute('/recipes/123', '/recipes')
 * // Returns: true
 *
 * isChildRoute('/meal-plans', '/recipes')
 * // Returns: false
 */
export function isChildRoute(childPath: string, parentPath: string): boolean {
  if (parentPath === '/') {
    return childPath !== '/';
  }

  return (
    childPath.startsWith(parentPath + '/') ||
    childPath === parentPath + '/' ||
    childPath === parentPath
  );
}

/**
 * Get the depth of a route (number of segments)
 *
 * @example
 * getRouteDepth('/recipes/123/edit')
 * // Returns: 3
 *
 * getRouteDepth('/')
 * // Returns: 0
 */
export function getRouteDepth(pathname: string): number {
  if (pathname === '/') {
    return 0;
  }

  return getRouteSegments(pathname).length;
}

/**
 * Normalize a pathname by removing trailing slashes and ensuring leading slash
 */
export function normalizePathname(pathname: string): string {
  if (!pathname || pathname === '/') {
    return '/';
  }

  // Remove trailing slash
  const normalized = pathname.replace(/\/$/, '');

  // Ensure leading slash
  return normalized.startsWith('/') ? normalized : `/${normalized}`;
}

/**
 * Check if two routes are the same (accounting for normalization)
 */
export function areRoutesEqual(route1: string, route2: string): boolean {
  return normalizePathname(route1) === normalizePathname(route2);
}
