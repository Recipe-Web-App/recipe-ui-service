import {
  BookOpen,
  Calendar,
  Heart,
  User,
  ChefHat,
  ShoppingCart,
  Users,
  Palette,
  FolderHeart,
  Flame,
  TrendingUp,
  Share2,
  Plus,
  Timer,
  Wand2,
  PlayCircle,
  Activity,
  Compass,
  UserCog,
  LogOut,
  Settings,
} from 'lucide-react';

import type { NavItem } from '@/types/navigation';

// ============================================================================
// Sub-Navigation Definitions
// ============================================================================

/**
 * Recipes Sub-Navigation
 */
export const recipesSubNavigation: NavItem[] = [
  {
    id: 'recipes-create',
    label: 'Create Recipe',
    href: '/recipes/create',
    icon: Plus,
    metadata: {
      sortOrder: 10,
      requiredAuth: true,
      tooltip: 'Create a new recipe',
    },
  },
  {
    id: 'recipes-my-recipes',
    label: 'Browse My Recipes',
    href: '/recipes/my-recipes',
    icon: BookOpen,
    metadata: {
      sortOrder: 20,
      requiredAuth: true,
      tooltip: 'View your own recipes',
    },
  },
  {
    id: 'recipes-favorites',
    label: 'Browse Favorite Recipes',
    href: '/recipes/favorites',
    icon: Heart,
    metadata: {
      sortOrder: 30,
      requiredAuth: true,
      tooltip: 'View your favorite recipes',
    },
  },
  {
    id: 'recipes-popular',
    label: 'Browse Popular Recipes',
    href: '/recipes/popular',
    icon: TrendingUp,
    metadata: {
      sortOrder: 40,
      tooltip: 'Discover popular recipes',
    },
  },
  {
    id: 'recipes-trending',
    label: 'Browse Trending Recipes',
    href: '/recipes/trending',
    icon: Flame,
    metadata: {
      sortOrder: 50,
      tooltip: 'See what is trending now',
    },
  },
  {
    id: 'recipes-shared',
    label: 'Browse Shared Recipes',
    href: '/recipes/shared',
    icon: Share2,
    metadata: {
      sortOrder: 60,
      requiredAuth: true,
      tooltip: 'Recipes shared with you',
    },
  },
];

/**
 * Collections Sub-Navigation
 */
export const collectionsSubNavigation: NavItem[] = [
  {
    id: 'collections-create',
    label: 'Create Collection',
    href: '/collections/create',
    icon: Plus,
    metadata: {
      sortOrder: 10,
      requiredAuth: true,
      tooltip: 'Create a new collection',
    },
  },
  {
    id: 'collections-my-collections',
    label: 'Browse My Collections',
    href: '/collections/my-collections',
    icon: FolderHeart,
    metadata: {
      sortOrder: 20,
      requiredAuth: true,
      tooltip: 'View your collections',
    },
  },
  {
    id: 'collections-favorites',
    label: 'Browse Favorite Collections',
    href: '/collections/favorites',
    icon: Heart,
    metadata: {
      sortOrder: 30,
      requiredAuth: true,
      tooltip: 'Your favorite collections',
    },
  },
  {
    id: 'collections-trending',
    label: 'Browse Trending Collections',
    href: '/collections/trending',
    icon: Flame,
    metadata: {
      sortOrder: 50,
      tooltip: 'See trending collections',
    },
  },
  {
    id: 'collections-shared',
    label: 'Browse Shared Collections',
    href: '/collections/shared',
    icon: Share2,
    metadata: {
      sortOrder: 60,
      requiredAuth: true,
      tooltip: 'Collections shared with you',
    },
  },
];

/**
 * Meal Plans Sub-Navigation
 */
export const mealPlansSubNavigation: NavItem[] = [
  {
    id: 'meal-plans-create',
    label: 'Create Meal Plan',
    href: '/meal-plans/create',
    icon: Plus,
    metadata: {
      sortOrder: 10,
      requiredAuth: true,
      tooltip: 'Create a new meal plan',
    },
  },
  {
    id: 'meal-plans-my-plans',
    label: 'Browse My Meal Plans',
    href: '/meal-plans/my-plans',
    icon: Calendar,
    metadata: {
      sortOrder: 20,
      requiredAuth: true,
      tooltip: 'View your meal plans',
    },
  },
  {
    id: 'meal-plans-favorites',
    label: 'Browse Favorite Meal Plans',
    href: '/meal-plans/favorites',
    icon: Heart,
    metadata: {
      sortOrder: 30,
      requiredAuth: true,
      tooltip: 'Your favorite meal plans',
    },
  },
  {
    id: 'meal-plans-trending',
    label: 'Browse Trending Meal Plans',
    href: '/meal-plans/trending',
    icon: Flame,
    metadata: {
      sortOrder: 50,
      tooltip: 'See trending meal plans',
    },
  },
  {
    id: 'meal-plans-shared',
    label: 'Browse Shared Meal Plans',
    href: '/meal-plans/shared',
    icon: Share2,
    metadata: {
      sortOrder: 60,
      requiredAuth: true,
      tooltip: 'Meal plans shared with you',
    },
  },
];

/**
 * Shopping Lists Sub-Navigation
 */
export const shoppingListsSubNavigation: NavItem[] = [
  {
    id: 'shopping-lists-create',
    label: 'Create Shopping List',
    href: '/shopping-lists/create',
    icon: Plus,
    metadata: {
      sortOrder: 10,
      requiredAuth: true,
      tooltip: 'Create a new shopping list',
    },
  },
  {
    id: 'shopping-lists-browse',
    label: 'Browse My Shopping Lists',
    href: '/shopping-lists',
    icon: ShoppingCart,
    metadata: {
      sortOrder: 20,
      requiredAuth: true,
      tooltip: 'View your shopping lists',
    },
  },
];

/**
 * Kitchen Feed Sub-Navigation
 */
export const kitchenFeedSubNavigation: NavItem[] = [
  {
    id: 'feed-co-chefs',
    label: 'Co-Chef Recent Activity',
    href: '/feed/co-chefs',
    icon: Users,
    metadata: {
      sortOrder: 10,
      requiredAuth: true,
      tooltip: 'See what your co-chefs are cooking',
    },
  },
  {
    id: 'feed-my-activity',
    label: 'My Recent Activity',
    href: '/feed/my-activity',
    icon: Activity,
    metadata: {
      sortOrder: 20,
      requiredAuth: true,
      tooltip: 'View your activity',
    },
  },
  {
    id: 'feed-discover',
    label: 'Suggested Cooks to Follow',
    href: '/feed/discover',
    icon: Compass,
    metadata: {
      sortOrder: 30,
      requiredAuth: true,
      tooltip: 'Discover new chefs to follow',
    },
  },
];

/**
 * Sous Chef Sub-Navigation
 */
export const sousChefSubNavigation: NavItem[] = [
  {
    id: 'sous-chef-cook',
    label: 'Interactive Cooking Mode',
    href: '/sous-chef/cook',
    icon: PlayCircle,
    metadata: {
      sortOrder: 10,
      requiredAuth: true,
      tooltip: 'Step-by-step cooking guidance',
    },
  },
  {
    id: 'sous-chef-adapt',
    label: 'Smart Adaptation',
    href: '/sous-chef/adapt',
    icon: Wand2,
    metadata: {
      sortOrder: 20,
      requiredAuth: true,
      tooltip: 'AI-powered recipe adaptation',
    },
  },
  {
    id: 'sous-chef-timers',
    label: 'Cooking Timers',
    href: '/sous-chef/timers',
    icon: Timer,
    metadata: {
      sortOrder: 30,
      tooltip: 'Manage multiple cooking timers',
    },
  },
];

/**
 * Account Sub-Navigation
 */
export const accountSubNavigation: NavItem[] = [
  {
    id: 'account-profile',
    label: 'View Profile',
    href: '/account/profile',
    icon: User,
    metadata: {
      sortOrder: 10,
      requiredAuth: true,
      tooltip: 'View your public profile',
    },
  },
  {
    id: 'account-edit',
    label: 'Edit Profile',
    href: '/account/edit',
    icon: UserCog,
    metadata: {
      sortOrder: 20,
      requiredAuth: true,
      tooltip: 'Update your profile',
    },
  },
  {
    id: 'account-settings',
    label: 'Settings',
    href: '/account/settings',
    icon: Settings,
    metadata: {
      sortOrder: 25,
      requiredAuth: true,
      tooltip: 'Account and app preferences',
    },
  },
  {
    id: 'account-logout',
    label: 'Log Out',
    href: '#logout',
    icon: LogOut,
    metadata: {
      sortOrder: 30,
      requiredAuth: true,
      tooltip: 'Sign out of your account',
      isAction: true, // Special flag for modal trigger
    },
  },
];

/**
 * Components Demo Sub-Navigation (Dev only)
 */
export const componentsDemoSubNavigation: NavItem[] = [
  {
    id: 'components-overview',
    label: 'Overview',
    href: '/components-demo',
    metadata: { sortOrder: 0 },
  },
  {
    id: 'components-accordion',
    label: 'Accordion',
    href: '/components-demo/accordion',
    metadata: { sortOrder: 10 },
  },
  {
    id: 'components-alert',
    label: 'Alert',
    href: '/components-demo/alert',
    metadata: { sortOrder: 20 },
  },
  {
    id: 'components-avatar',
    label: 'Avatar',
    href: '/components-demo/avatar',
    metadata: { sortOrder: 30 },
  },
  {
    id: 'components-badge',
    label: 'Badge',
    href: '/components-demo/badge',
    metadata: { sortOrder: 40 },
  },
  {
    id: 'components-button',
    label: 'Button',
    href: '/components-demo/button',
    metadata: { sortOrder: 50 },
  },
  {
    id: 'components-card',
    label: 'Card',
    href: '/components-demo/card',
    metadata: { sortOrder: 60 },
  },
  {
    id: 'components-dropdown',
    label: 'Dropdown',
    href: '/components-demo/dropdown',
    metadata: { sortOrder: 70 },
  },
  {
    id: 'components-empty-state',
    label: 'Empty State',
    href: '/components-demo/empty-state',
    metadata: { sortOrder: 80 },
  },
  {
    id: 'components-toast',
    label: 'Toast',
    href: '/components-demo/toast',
    metadata: { sortOrder: 90 },
  },
];

// ============================================================================
// Top-Level Navigation
// ============================================================================

/**
 * Top-level navigation configuration with dropdown children
 * Note: Home is not included as the logo serves as the home link
 */
export const topLevelNavigation: NavItem[] = [
  // Recipes - Dropdown
  {
    id: 'recipes',
    label: 'Recipes',
    href: '/recipes',
    icon: BookOpen,
    children: recipesSubNavigation,
    metadata: {
      sortOrder: 10,
      showInMobile: true,
      showInDesktop: true,
      tooltip: 'Browse and manage recipes',
    },
  },

  // Collections - Dropdown
  {
    id: 'collections',
    label: 'Collections',
    href: '/collections',
    icon: FolderHeart,
    children: collectionsSubNavigation,
    metadata: {
      sortOrder: 20,
      showInMobile: true,
      showInDesktop: true,
      tooltip: 'Curated recipe collections',
    },
  },

  // Meal Plans - Dropdown
  {
    id: 'meal-plans',
    label: 'Meal Plans',
    href: '/meal-plans',
    icon: Calendar,
    children: mealPlansSubNavigation,
    metadata: {
      sortOrder: 30,
      showInMobile: true,
      showInDesktop: true,
      tooltip: 'Plan your meals',
    },
  },

  // Shopping Lists - Dropdown
  {
    id: 'shopping-lists',
    label: 'Shopping Lists',
    href: '/shopping-lists',
    icon: ShoppingCart,
    children: shoppingListsSubNavigation,
    metadata: {
      sortOrder: 40,
      showInMobile: true,
      showInDesktop: true,
      tooltip: 'Manage shopping lists',
      requiredAuth: true,
    },
  },

  // Kitchen Feed - Dropdown
  {
    id: 'kitchen-feed',
    label: 'Kitchen Feed',
    href: '/feed',
    icon: Users,
    children: kitchenFeedSubNavigation,
    metadata: {
      sortOrder: 50,
      showInMobile: true,
      showInDesktop: true,
      tooltip: 'Social activity feed',
      requiredAuth: true,
    },
  },

  // Sous Chef - Dropdown
  {
    id: 'sous-chef',
    label: 'Sous Chef',
    href: '/sous-chef',
    icon: ChefHat,
    children: sousChefSubNavigation,
    metadata: {
      sortOrder: 60,
      showInMobile: true,
      showInDesktop: true,
      tooltip: 'Cooking assistant tools',
    },
  },

  // Account - Dropdown
  {
    id: 'account',
    label: 'Account',
    href: '/account',
    icon: User,
    children: accountSubNavigation,
    metadata: {
      sortOrder: 70,
      showInMobile: true,
      showInDesktop: true,
      tooltip: 'Manage your account',
      requiredAuth: true,
    },
  },

  // Components Demo (Dev only)
  {
    id: 'components-demo',
    label: 'Components Demo',
    href: '/components-demo',
    icon: Palette,
    children: componentsDemoSubNavigation,
    metadata: {
      sortOrder: 1000,
      showInMobile: false,
      showInDesktop: true,
      tooltip: 'UI component demonstrations',
      featureFlag: 'SHOW_COMPONENTS_DEMO',
      badge: 'Dev',
      badgeVariant: 'info',
    },
  },
];

// ============================================================================
// Sub-Navigation Mapping
// ============================================================================

/**
 * Sub-navigation mapping by section ID
 * Used for sidebar contextual navigation
 */
export const subNavigationMap: Record<string, NavItem[]> = {
  recipes: recipesSubNavigation,
  collections: collectionsSubNavigation,
  'meal-plans': mealPlansSubNavigation,
  'shopping-lists': shoppingListsSubNavigation,
  'kitchen-feed': kitchenFeedSubNavigation,
  feed: kitchenFeedSubNavigation, // Alias for route matching
  'sous-chef': sousChefSubNavigation,
  account: accountSubNavigation,
  'components-demo': componentsDemoSubNavigation,
};

/**
 * Get sub-navigation for a specific section
 */
export const getSubNavigation = (sectionId: string): NavItem[] => {
  if (Object.hasOwn(subNavigationMap, sectionId)) {
    return subNavigationMap[sectionId as keyof typeof subNavigationMap];
  }
  return [];
};

// ============================================================================
// Footer Navigation
// ============================================================================

/**
 * Footer navigation links
 */
export const footerNavigation = {
  product: [
    { label: 'About', href: '/about' },
    { label: 'Features', href: '/features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Changelog', href: '/changelog' },
  ],
  support: [
    { label: 'Help Center', href: '/help' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'API Documentation', href: '/docs/api' },
    { label: 'Status Page', href: '/status' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
  ],
  social: [
    {
      label: 'GitHub',
      href: 'https://github.com/recipe-web-app',
      external: true,
    },
    {
      label: 'Twitter',
      href: 'https://twitter.com/recipewebapp',
      external: true,
    },
    {
      label: 'Discord',
      href: 'https://discord.gg/recipewebapp',
      external: true,
    },
  ],
};

// ============================================================================
// Quick Actions
// ============================================================================

/**
 * Quick actions for command palette and quick action menus
 */
export const quickActions: NavItem[] = [
  {
    id: 'quick-create-recipe',
    label: 'Create New Recipe',
    href: '/recipes/create',
    icon: ChefHat,
    metadata: {
      requiredAuth: true,
      tooltip: 'Quickly create a new recipe',
    },
  },
  {
    id: 'quick-meal-plan',
    label: 'Plan This Week',
    href: '/meal-plans/create',
    icon: Calendar,
    metadata: {
      requiredAuth: true,
      tooltip: 'Create a meal plan for this week',
    },
  },
  {
    id: 'quick-shopping-list',
    label: 'New Shopping List',
    href: '/shopping-lists/create',
    icon: ShoppingCart,
    metadata: {
      requiredAuth: true,
      tooltip: 'Create a new shopping list',
    },
  },
  {
    id: 'quick-timers',
    label: 'Cooking Timers',
    href: '/sous-chef/timers',
    icon: Timer,
    metadata: {
      tooltip: 'Open cooking timers',
    },
  },
];

// ============================================================================
// Default Export
// ============================================================================

/**
 * Default export containing all navigation configurations
 */
export const navigationConfig = {
  topLevel: topLevelNavigation,
  subNavigation: subNavigationMap,
  footer: footerNavigation,
  quickActions,
  getSubNavigation,
} as const;
