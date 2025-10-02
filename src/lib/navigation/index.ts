/**
 * Navigation utilities - Centralized exports
 *
 * This file provides a single import point for all navigation utilities
 */

// Route metadata
export {
  getRouteMetadataByPattern,
  getAllRouteMetadata,
  routeRequiresAuth,
  isRouteHiddenFromBreadcrumbs,
  ROUTE_METADATA,
} from './route-metadata';
export type { RouteMetadata } from './route-metadata';

// Route helpers
export {
  parseRouteParams,
  matchRoutePattern,
  findMatchingRouteMetadata,
  getParentRouteMetadata,
  buildBreadcrumbTrail,
  buildRouteWithParams,
  getRouteSegments,
  getParentPath,
  isChildRoute,
  getRouteDepth,
  normalizePathname,
  areRoutesEqual,
} from './route-helpers';

// Breadcrumb utilities
export {
  generateBreadcrumbsFromPath,
  enrichBreadcrumbsWithContext,
  collapseBreadcrumbs,
  buildRecipeBreadcrumb,
  detectNavigationPattern,
  filterBreadcrumbsByAuth,
  mergeBreadcrumbs,
  formatBreadcrumbLabel,
  getBreadcrumbConfig,
  resolveDynamicLabels,
} from './breadcrumb-utils';
