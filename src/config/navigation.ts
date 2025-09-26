import {
  BookOpen,
  Calendar,
  Heart,
  User,
  Settings,
  Home,
  ChefHat,
  ShoppingCart,
  Users,
  BarChart3,
  Palette,
} from 'lucide-react';

import type { NavItem } from '@/types/navigation';

/**
 * Top-level navigation configuration for the Recipe UI Service
 * This defines the main navigation structure that will be used
 * across the application in the sidebar and mobile menu.
 */
export const topLevelNavigation: NavItem[] = [
  {
    id: 'home',
    label: 'Home',
    href: '/',
    icon: Home,
    metadata: {
      sortOrder: 0,
      showInMobile: true,
      showInDesktop: true,
      tooltip: 'Go to homepage',
    },
  },
  {
    id: 'recipes',
    label: 'Recipes',
    href: '/recipes',
    icon: BookOpen,
    metadata: {
      sortOrder: 10,
      showInMobile: true,
      showInDesktop: true,
      tooltip: 'Browse and manage recipes',
    },
  },
  {
    id: 'meal-plans',
    label: 'Meal Plans',
    href: '/meal-plans',
    icon: Calendar,
    metadata: {
      sortOrder: 20,
      showInMobile: true,
      showInDesktop: true,
      tooltip: 'Plan your meals and create schedules',
      featureFlag: 'ENABLE_MEAL_PLANNING',
    },
  },
  {
    id: 'favorites',
    label: 'Favorites',
    href: '/favorites',
    icon: Heart,
    metadata: {
      sortOrder: 30,
      showInMobile: true,
      showInDesktop: true,
      tooltip: 'Your favorite recipes',
      requiredAuth: true,
    },
  },
  {
    id: 'shopping',
    label: 'Shopping Lists',
    href: '/shopping',
    icon: ShoppingCart,
    metadata: {
      sortOrder: 40,
      showInMobile: true,
      showInDesktop: true,
      tooltip: 'Manage your shopping lists',
      featureFlag: 'ENABLE_GROCERY_LISTS',
      requiredAuth: true,
    },
  },
  {
    id: 'social',
    label: 'Community',
    href: '/social',
    icon: Users,
    metadata: {
      sortOrder: 50,
      showInMobile: true,
      showInDesktop: true,
      tooltip: 'Connect with other food enthusiasts',
      featureFlag: 'ENABLE_SOCIAL_FEATURES',
      requiredAuth: true,
    },
  },
  {
    id: 'profile',
    label: 'Profile',
    href: '/profile',
    icon: User,
    metadata: {
      sortOrder: 80,
      showInMobile: true,
      showInDesktop: true,
      tooltip: 'Manage your profile and preferences',
      requiredAuth: true,
      featureFlag: 'ENABLE_USER_PROFILES',
    },
  },
  {
    id: 'analytics',
    label: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    metadata: {
      sortOrder: 90,
      showInMobile: false,
      showInDesktop: true,
      tooltip: 'View cooking analytics and insights',
      requiredAuth: true,
      featureFlag: 'ENABLE_ANALYTICS',
      requiredRoles: ['admin', 'premium'],
    },
  },
  {
    id: 'settings',
    label: 'Settings',
    href: '/settings',
    icon: Settings,
    metadata: {
      sortOrder: 100,
      showInMobile: true,
      showInDesktop: true,
      tooltip: 'Application settings and preferences',
    },
  },
  {
    id: 'components-demo',
    label: 'Components',
    href: '/components-demo',
    icon: Palette,
    metadata: {
      sortOrder: 1000, // Show at bottom
      showInMobile: false, // Hide in mobile for cleaner experience
      showInDesktop: true,
      tooltip: 'UI component demonstrations',
      featureFlag: 'SHOW_COMPONENTS_DEMO',
      badge: 'Dev',
      badgeVariant: 'secondary',
    },
  },
];

/**
 * Sub-navigation configurations for specific sections
 * These define the navigation items that appear in the sidebar
 * when users are in specific sections of the application.
 */

/**
 * Recipe section sub-navigation
 * Defines navigation items available when in the recipes section
 */
export const recipeSubNavigation: NavItem[] = [
  {
    id: 'recipes-browse',
    label: 'Browse Recipes',
    href: '/recipes',
    metadata: {
      sortOrder: 10,
    },
  },
  {
    id: 'recipes-create',
    label: 'Create Recipe',
    href: '/recipes/create',
    metadata: {
      sortOrder: 20,
      requiredAuth: true,
      featureFlag: 'ENABLE_RECIPE_CREATION',
    },
  },
  {
    id: 'recipes-import',
    label: 'Import Recipe',
    href: '/recipes/import',
    metadata: {
      sortOrder: 30,
      requiredAuth: true,
      featureFlag: 'ENABLE_RECIPE_IMPORT',
      badge: 'New',
      badgeVariant: 'primary',
    },
  },
  {
    id: 'recipes-collections',
    label: 'Collections',
    href: '/recipes/collections',
    metadata: {
      sortOrder: 40,
      requiredAuth: true,
    },
  },
  {
    id: 'recipes-tags',
    label: 'Browse by Tags',
    href: '/recipes/tags',
    metadata: {
      sortOrder: 50,
    },
  },
];

/**
 * Meal planning section sub-navigation
 */
export const mealPlanSubNavigation: NavItem[] = [
  {
    id: 'meal-plans-calendar',
    label: 'Calendar View',
    href: '/meal-plans',
    metadata: {
      sortOrder: 10,
      requiredAuth: true,
    },
  },
  {
    id: 'meal-plans-create',
    label: 'Create Meal Plan',
    href: '/meal-plans/create',
    metadata: {
      sortOrder: 20,
      requiredAuth: true,
    },
  },
  {
    id: 'meal-plans-templates',
    label: 'Meal Plan Templates',
    href: '/meal-plans/templates',
    metadata: {
      sortOrder: 30,
      requiredAuth: true,
    },
  },
  {
    id: 'meal-plans-nutrition',
    label: 'Nutrition Overview',
    href: '/meal-plans/nutrition',
    metadata: {
      sortOrder: 40,
      requiredAuth: true,
    },
  },
];

/**
 * Social/Community section sub-navigation
 */
export const socialSubNavigation: NavItem[] = [
  {
    id: 'social-feed',
    label: 'Activity Feed',
    href: '/social',
    metadata: {
      sortOrder: 10,
      requiredAuth: true,
    },
  },
  {
    id: 'social-following',
    label: 'Following',
    href: '/social/following',
    metadata: {
      sortOrder: 20,
      requiredAuth: true,
    },
  },
  {
    id: 'social-discover',
    label: 'Discover Users',
    href: '/social/discover',
    metadata: {
      sortOrder: 30,
      requiredAuth: true,
    },
  },
  {
    id: 'social-groups',
    label: 'Recipe Groups',
    href: '/social/groups',
    metadata: {
      sortOrder: 40,
      requiredAuth: true,
    },
  },
];

/**
 * Settings section sub-navigation
 */
export const settingsSubNavigation: NavItem[] = [
  {
    id: 'settings-account',
    label: 'Account Settings',
    href: '/settings/account',
    metadata: {
      sortOrder: 10,
      requiredAuth: true,
    },
  },
  {
    id: 'settings-preferences',
    label: 'Preferences',
    href: '/settings/preferences',
    metadata: {
      sortOrder: 20,
    },
  },
  {
    id: 'settings-notifications',
    label: 'Notifications',
    href: '/settings/notifications',
    metadata: {
      sortOrder: 30,
      requiredAuth: true,
    },
  },
  {
    id: 'settings-privacy',
    label: 'Privacy & Security',
    href: '/settings/privacy',
    metadata: {
      sortOrder: 40,
      requiredAuth: true,
    },
  },
  {
    id: 'settings-data',
    label: 'Data Management',
    href: '/settings/data',
    metadata: {
      sortOrder: 50,
      requiredAuth: true,
    },
  },
];

/**
 * Sub-navigation mapping by section ID
 * Maps top-level navigation IDs to their respective sub-navigation items
 */
export const subNavigationMap: Record<string, NavItem[]> = {
  recipes: recipeSubNavigation,
  'meal-plans': mealPlanSubNavigation,
  social: socialSubNavigation,
  settings: settingsSubNavigation,
};

/**
 * Get sub-navigation for a specific section
 */
export const getSubNavigation = (sectionId: string): NavItem[] => {
  // ESLint disable: dynamic object access is safe here with known section IDs
  // eslint-disable-next-line security/detect-object-injection
  return subNavigationMap[sectionId] || [];
};

/**
 * Footer navigation links
 * These appear in the application footer
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

/**
 * Quick actions for common tasks
 * These can be used in command palette or quick action menus
 */
export const quickActions: NavItem[] = [
  {
    id: 'quick-create-recipe',
    label: 'Create New Recipe',
    href: '/recipes/create',
    icon: ChefHat,
    metadata: {
      requiredAuth: true,
      featureFlag: 'ENABLE_RECIPE_CREATION',
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
      featureFlag: 'ENABLE_MEAL_PLANNING',
      tooltip: 'Create a meal plan for this week',
    },
  },
  {
    id: 'quick-import',
    label: 'Import Recipe',
    href: '/recipes/import',
    icon: BookOpen,
    metadata: {
      requiredAuth: true,
      featureFlag: 'ENABLE_RECIPE_IMPORT',
      tooltip: 'Import recipe from URL',
    },
  },
  {
    id: 'quick-shopping-list',
    label: 'New Shopping List',
    href: '/shopping/create',
    icon: ShoppingCart,
    metadata: {
      requiredAuth: true,
      featureFlag: 'ENABLE_GROCERY_LISTS',
      tooltip: 'Create a new shopping list',
    },
  },
];

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
