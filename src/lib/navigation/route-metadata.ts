import type { LucideIcon } from 'lucide-react';
import {
  BookOpen,
  Calendar,
  Heart,
  ShoppingCart,
  Users,
  User,
  Settings,
  Home,
  ChefHat,
  List,
  Plus,
  Download,
  Tag,
  BarChart3,
  TrendingUp,
} from 'lucide-react';
import type { RecipeNavigationPattern } from '@/types/ui/breadcrumb';

/**
 * Route metadata for breadcrumb generation and navigation
 */
export interface RouteMetadata {
  /** Route pattern (supports Next.js dynamic segments like [id]) */
  pattern: string;
  /** Human-readable label for the route */
  label: string;
  /** Optional icon for the route */
  icon?: LucideIcon;
  /** Parent route pattern (for breadcrumb hierarchy) */
  parent?: string;
  /** Recipe navigation pattern (if applicable) */
  recipePattern?: RecipeNavigationPattern;
  /** Whether this route requires authentication */
  requiresAuth?: boolean;
  /** Whether this route is hidden from breadcrumbs */
  hiddenFromBreadcrumbs?: boolean;
  /** Custom label resolver for dynamic routes */
  labelResolver?: (params: Record<string, string>) => Promise<string> | string;
  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Route metadata registry
 *
 * Maps route patterns to their metadata for breadcrumb generation,
 * navigation tracking, and route resolution.
 */
export const ROUTE_METADATA: RouteMetadata[] = [
  // Home
  {
    pattern: '/',
    label: 'Home',
    icon: Home,
    recipePattern: 'recipe-detail',
  },

  // Recipes
  {
    pattern: '/recipes',
    label: 'Recipes',
    icon: BookOpen,
    parent: '/',
    recipePattern: 'category-browse',
  },
  {
    pattern: '/recipes/create',
    label: 'Create Recipe',
    icon: Plus,
    parent: '/recipes',
    requiresAuth: true,
  },
  {
    pattern: '/recipes/import',
    label: 'Import Recipe',
    icon: Download,
    parent: '/recipes',
    requiresAuth: true,
  },
  {
    pattern: '/recipes/tags',
    label: 'Browse by Tags',
    icon: Tag,
    parent: '/recipes',
  },
  {
    pattern: '/recipes/tags/[tag]',
    label: 'Tag',
    icon: Tag,
    parent: '/recipes/tags',
    labelResolver: params => params.tag?.replace(/-/g, ' ') || 'Tag',
  },
  {
    pattern: '/recipes/collections',
    label: 'Collections',
    icon: List,
    parent: '/recipes',
    requiresAuth: true,
  },
  {
    pattern: '/recipes/collections/[id]',
    label: 'Collection',
    icon: List,
    parent: '/recipes/collections',
    labelResolver: async params => {
      // In real implementation, fetch collection name from API
      return `Collection ${params.id}`;
    },
  },
  {
    pattern: '/recipes/[id]',
    label: 'Recipe',
    icon: ChefHat,
    parent: '/recipes',
    recipePattern: 'recipe-detail',
    labelResolver: async params => {
      // In real implementation, fetch recipe name from API
      return `Recipe ${params.id}`;
    },
  },
  {
    pattern: '/recipes/[id]/edit',
    label: 'Edit Recipe',
    icon: ChefHat,
    parent: '/recipes/[id]',
    requiresAuth: true,
  },

  // Meal Plans
  {
    pattern: '/meal-plans',
    label: 'Meal Plans',
    icon: Calendar,
    parent: '/',
    recipePattern: 'meal-planning',
  },
  {
    pattern: '/meal-plans/create',
    label: 'Create Meal Plan',
    icon: Plus,
    parent: '/meal-plans',
    requiresAuth: true,
  },
  {
    pattern: '/meal-plans/templates',
    label: 'Templates',
    icon: List,
    parent: '/meal-plans',
  },
  {
    pattern: '/meal-plans/nutrition',
    label: 'Nutrition Overview',
    icon: BarChart3,
    parent: '/meal-plans',
    requiresAuth: true,
  },
  {
    pattern: '/meal-plans/[id]',
    label: 'Meal Plan',
    icon: Calendar,
    parent: '/meal-plans',
    labelResolver: async params => {
      // In real implementation, fetch meal plan name from API
      return `Meal Plan ${params.id}`;
    },
  },

  // Favorites
  {
    pattern: '/favorites',
    label: 'Favorites',
    icon: Heart,
    parent: '/',
    requiresAuth: true,
  },
  {
    pattern: '/favorites/recipes',
    label: 'Favorite Recipes',
    icon: BookOpen,
    parent: '/favorites',
    requiresAuth: true,
  },
  {
    pattern: '/favorites/collections',
    label: 'Favorite Collections',
    icon: List,
    parent: '/favorites',
    requiresAuth: true,
  },
  {
    pattern: '/favorites/meal-plans',
    label: 'Favorite Meal Plans',
    icon: Calendar,
    parent: '/favorites',
    requiresAuth: true,
  },

  // Shopping Lists
  {
    pattern: '/shopping',
    label: 'Shopping Lists',
    icon: ShoppingCart,
    parent: '/',
    requiresAuth: true,
  },
  {
    pattern: '/shopping/create',
    label: 'Create Shopping List',
    icon: Plus,
    parent: '/shopping',
    requiresAuth: true,
  },
  {
    pattern: '/shopping/[id]',
    label: 'Shopping List',
    icon: ShoppingCart,
    parent: '/shopping',
    labelResolver: async params => {
      // In real implementation, fetch shopping list name from API
      return `Shopping List ${params.id}`;
    },
  },

  // Social/Community
  {
    pattern: '/social',
    label: 'Community',
    icon: Users,
    parent: '/',
    requiresAuth: true,
  },
  {
    pattern: '/social/feed',
    label: 'Activity Feed',
    icon: TrendingUp,
    parent: '/social',
    requiresAuth: true,
  },
  {
    pattern: '/social/following',
    label: 'Following',
    icon: Users,
    parent: '/social',
    requiresAuth: true,
  },
  {
    pattern: '/social/discover',
    label: 'Discover Users',
    icon: Users,
    parent: '/social',
    requiresAuth: true,
  },
  {
    pattern: '/social/groups',
    label: 'Recipe Groups',
    icon: Users,
    parent: '/social',
    requiresAuth: true,
  },
  {
    pattern: '/social/groups/[id]',
    label: 'Group',
    icon: Users,
    parent: '/social/groups',
    labelResolver: async params => {
      // In real implementation, fetch group name from API
      return `Group ${params.id}`;
    },
  },

  // Profile
  {
    pattern: '/profile',
    label: 'Profile',
    icon: User,
    parent: '/',
    requiresAuth: true,
  },
  {
    pattern: '/profile/edit',
    label: 'Edit Profile',
    icon: User,
    parent: '/profile',
    requiresAuth: true,
  },
  {
    pattern: '/profile/[username]',
    label: 'User Profile',
    icon: User,
    parent: '/social',
    labelResolver: params => params.username || 'User',
  },

  // Analytics
  {
    pattern: '/analytics',
    label: 'Analytics',
    icon: BarChart3,
    parent: '/',
    requiresAuth: true,
  },

  // Settings
  {
    pattern: '/settings',
    label: 'Settings',
    icon: Settings,
    parent: '/',
  },
  {
    pattern: '/settings/account',
    label: 'Account Settings',
    icon: User,
    parent: '/settings',
    requiresAuth: true,
  },
  {
    pattern: '/settings/preferences',
    label: 'Preferences',
    icon: Settings,
    parent: '/settings',
  },
  {
    pattern: '/settings/notifications',
    label: 'Notifications',
    icon: Settings,
    parent: '/settings',
    requiresAuth: true,
  },
  {
    pattern: '/settings/privacy',
    label: 'Privacy & Security',
    icon: Settings,
    parent: '/settings',
    requiresAuth: true,
  },
  {
    pattern: '/settings/data',
    label: 'Data Management',
    icon: Settings,
    parent: '/settings',
    requiresAuth: true,
  },

  // Components Demo (dev only)
  {
    pattern: '/components-demo',
    label: 'Components Demo',
    icon: BookOpen,
    parent: '/',
  },
  {
    pattern: '/components-demo/[component]',
    label: 'Component',
    icon: BookOpen,
    parent: '/components-demo',
    labelResolver: params =>
      params.component
        ?.split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ') || 'Component',
  },

  // Auth routes (typically hidden from breadcrumbs)
  {
    pattern: '/login',
    label: 'Login',
    hiddenFromBreadcrumbs: true,
  },
  {
    pattern: '/register',
    label: 'Register',
    hiddenFromBreadcrumbs: true,
  },
  {
    pattern: '/forgot-password',
    label: 'Forgot Password',
    hiddenFromBreadcrumbs: true,
  },
];

/**
 * Get route metadata by pattern
 */
export function getRouteMetadataByPattern(
  pattern: string
): RouteMetadata | undefined {
  return ROUTE_METADATA.find(meta => meta.pattern === pattern);
}

/**
 * Get all route metadata
 */
export function getAllRouteMetadata(): RouteMetadata[] {
  return ROUTE_METADATA;
}

/**
 * Check if route requires authentication
 */
export function routeRequiresAuth(pattern: string): boolean {
  const metadata = getRouteMetadataByPattern(pattern);
  return metadata?.requiresAuth ?? false;
}

/**
 * Check if route is hidden from breadcrumbs
 */
export function isRouteHiddenFromBreadcrumbs(pattern: string): boolean {
  const metadata = getRouteMetadataByPattern(pattern);
  return metadata?.hiddenFromBreadcrumbs ?? false;
}
