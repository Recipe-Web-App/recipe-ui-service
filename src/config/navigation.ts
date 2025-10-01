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
    label: 'Components Demo',
    href: '/components-demo',
    icon: Palette,
    metadata: {
      sortOrder: 1000, // Show at bottom
      showInMobile: false, // Hide in mobile for cleaner experience
      showInDesktop: true,
      tooltip: 'UI component demonstrations',
      featureFlag: 'SHOW_COMPONENTS_DEMO',
      badge: 'Dev',
      badgeVariant: 'info',
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
      badgeVariant: 'info',
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
 * Components Demo section sub-navigation
 */
export const componentsDemoSubNavigation: NavItem[] = [
  {
    id: 'components-overview',
    label: 'Overview',
    href: '/components-demo',
    metadata: {
      sortOrder: 0,
    },
  },
  {
    id: 'components-accordion',
    label: 'Accordion',
    href: '/components-demo/accordion',
    metadata: {
      sortOrder: 10,
    },
  },
  {
    id: 'components-alert',
    label: 'Alert',
    href: '/components-demo/alert',
    metadata: {
      sortOrder: 20,
    },
  },
  {
    id: 'components-avatar',
    label: 'Avatar',
    href: '/components-demo/avatar',
    metadata: {
      sortOrder: 30,
    },
  },
  {
    id: 'components-avatar-group',
    label: 'Avatar Group',
    href: '/components-demo/avatar-group',
    metadata: {
      sortOrder: 40,
    },
  },
  {
    id: 'components-badge',
    label: 'Badge',
    href: '/components-demo/badge',
    metadata: {
      sortOrder: 50,
    },
  },
  {
    id: 'components-breadcrumb',
    label: 'Breadcrumb',
    href: '/components-demo/breadcrumb',
    metadata: {
      sortOrder: 60,
    },
  },
  {
    id: 'components-button',
    label: 'Button',
    href: '/components-demo/button',
    metadata: {
      sortOrder: 70,
    },
  },
  {
    id: 'components-card',
    label: 'Card',
    href: '/components-demo/card',
    metadata: {
      sortOrder: 80,
    },
  },
  {
    id: 'components-checkbox',
    label: 'Checkbox',
    href: '/components-demo/checkbox',
    metadata: {
      sortOrder: 90,
    },
  },
  {
    id: 'components-chip',
    label: 'Chip',
    href: '/components-demo/chip',
    metadata: {
      sortOrder: 100,
    },
  },
  {
    id: 'components-collapse',
    label: 'Collapse',
    href: '/components-demo/collapse',
    metadata: {
      sortOrder: 110,
    },
  },
  {
    id: 'components-command-palette',
    label: 'Command Palette',
    href: '/components-demo/command-palette',
    metadata: {
      sortOrder: 120,
    },
  },
  {
    id: 'components-content',
    label: 'Content',
    href: '/components-demo/content',
    metadata: {
      sortOrder: 130,
    },
  },
  {
    id: 'components-copy-button',
    label: 'Copy Button',
    href: '/components-demo/copy-button',
    metadata: {
      sortOrder: 140,
    },
  },
  {
    id: 'components-datepicker',
    label: 'Date Picker',
    href: '/components-demo/datepicker',
    metadata: {
      sortOrder: 150,
    },
  },
  {
    id: 'components-dialog',
    label: 'Dialog',
    href: '/components-demo/dialog',
    metadata: {
      sortOrder: 160,
    },
  },
  {
    id: 'components-disclosure',
    label: 'Disclosure',
    href: '/components-demo/disclosure',
    metadata: {
      sortOrder: 170,
    },
  },
  {
    id: 'components-divider',
    label: 'Divider',
    href: '/components-demo/divider',
    metadata: {
      sortOrder: 180,
    },
  },
  {
    id: 'components-drawer',
    label: 'Drawer',
    href: '/components-demo/drawer',
    metadata: {
      sortOrder: 190,
    },
  },
  {
    id: 'components-dropdown',
    label: 'Dropdown',
    href: '/components-demo/dropdown',
    metadata: {
      sortOrder: 200,
    },
  },
  {
    id: 'components-empty-state',
    label: 'Empty State',
    href: '/components-demo/empty-state',
    metadata: {
      sortOrder: 210,
    },
  },
  {
    id: 'components-error-boundary',
    label: 'Error Boundary',
    href: '/components-demo/error-boundary',
    metadata: {
      sortOrder: 220,
    },
  },
  {
    id: 'components-service-error-boundary',
    label: 'Service Error Boundary',
    href: '/components-demo/service-error-boundary',
    metadata: {
      sortOrder: 221,
    },
  },
  {
    id: 'components-page-error-boundary',
    label: 'Page Error Boundary',
    href: '/components-demo/page-error-boundary',
    metadata: {
      sortOrder: 222,
    },
  },
  {
    id: 'components-component-error-boundary',
    label: 'Component Error Boundary',
    href: '/components-demo/component-error-boundary',
    metadata: {
      sortOrder: 223,
    },
  },
  {
    id: 'components-error-page',
    label: 'Error Page',
    href: '/components-demo/error-page',
    metadata: {
      sortOrder: 224,
    },
  },
  {
    id: 'components-error-alert',
    label: 'Error Alert',
    href: '/components-demo/error-alert',
    metadata: {
      sortOrder: 225,
    },
  },
  {
    id: 'components-retry-button',
    label: 'Retry Button',
    href: '/components-demo/retry-button',
    metadata: {
      sortOrder: 226,
    },
  },
  {
    id: 'components-fab',
    label: 'FAB',
    href: '/components-demo/fab',
    metadata: {
      sortOrder: 230,
    },
  },
  {
    id: 'components-file-upload',
    label: 'File Upload',
    href: '/components-demo/file-upload',
    metadata: {
      sortOrder: 240,
    },
  },
  {
    id: 'components-icon',
    label: 'Icon',
    href: '/components-demo/icon',
    metadata: {
      sortOrder: 250,
    },
  },
  {
    id: 'components-image-gallery',
    label: 'Image Gallery',
    href: '/components-demo/image-gallery',
    metadata: {
      sortOrder: 260,
    },
  },
  {
    id: 'components-infinite-scroll',
    label: 'Infinite Scroll',
    href: '/components-demo/infinite-scroll',
    metadata: {
      sortOrder: 270,
    },
  },
  {
    id: 'components-input',
    label: 'Input',
    href: '/components-demo/input',
    metadata: {
      sortOrder: 280,
    },
  },
  {
    id: 'components-list',
    label: 'List',
    href: '/components-demo/list',
    metadata: {
      sortOrder: 290,
    },
  },
  {
    id: 'components-modal',
    label: 'Modal',
    href: '/components-demo/modal',
    metadata: {
      sortOrder: 300,
    },
  },
  {
    id: 'components-pagination',
    label: 'Pagination',
    href: '/components-demo/pagination',
    metadata: {
      sortOrder: 310,
    },
  },
  {
    id: 'components-popover',
    label: 'Popover',
    href: '/components-demo/popover',
    metadata: {
      sortOrder: 320,
    },
  },
  {
    id: 'components-progress',
    label: 'Progress',
    href: '/components-demo/progress',
    metadata: {
      sortOrder: 330,
    },
  },
  {
    id: 'components-radio',
    label: 'Radio Group',
    href: '/components-demo/radio',
    metadata: {
      sortOrder: 340,
    },
  },
  {
    id: 'components-rating',
    label: 'Rating',
    href: '/components-demo/rating',
    metadata: {
      sortOrder: 350,
    },
  },
  {
    id: 'components-search-input',
    label: 'Search Input',
    href: '/components-demo/search-input',
    metadata: {
      sortOrder: 360,
    },
  },
  {
    id: 'components-select',
    label: 'Select',
    href: '/components-demo/select',
    metadata: {
      sortOrder: 370,
    },
  },
  {
    id: 'components-sidebar',
    label: 'Sidebar',
    href: '/components-demo/sidebar',
    metadata: {
      sortOrder: 380,
    },
  },
  {
    id: 'components-skeleton',
    label: 'Skeleton',
    href: '/components-demo/skeleton',
    metadata: {
      sortOrder: 390,
    },
  },
  {
    id: 'components-slider',
    label: 'Slider',
    href: '/components-demo/slider',
    metadata: {
      sortOrder: 400,
    },
  },
  {
    id: 'components-spinner',
    label: 'Spinner',
    href: '/components-demo/spinner',
    metadata: {
      sortOrder: 410,
    },
  },
  {
    id: 'components-stepper',
    label: 'Stepper',
    href: '/components-demo/stepper',
    metadata: {
      sortOrder: 420,
    },
  },
  {
    id: 'components-switch',
    label: 'Switch',
    href: '/components-demo/switch',
    metadata: {
      sortOrder: 430,
    },
  },
  {
    id: 'components-table',
    label: 'Table',
    href: '/components-demo/table',
    metadata: {
      sortOrder: 440,
    },
  },
  {
    id: 'components-tabs',
    label: 'Tabs',
    href: '/components-demo/tabs',
    metadata: {
      sortOrder: 450,
    },
  },
  {
    id: 'components-textarea',
    label: 'Text Area',
    href: '/components-demo/textarea',
    metadata: {
      sortOrder: 460,
    },
  },
  {
    id: 'components-toast',
    label: 'Toast',
    href: '/components-demo/toast',
    metadata: {
      sortOrder: 470,
    },
  },
  {
    id: 'components-tooltip',
    label: 'Tooltip',
    href: '/components-demo/tooltip',
    metadata: {
      sortOrder: 480,
    },
  },
  {
    id: 'components-protected-route',
    label: 'Protected Route',
    href: '/components-demo/protected-route',
    metadata: {
      sortOrder: 490,
    },
  },
  {
    id: 'components-guest-route',
    label: 'Guest Route',
    href: '/components-demo/guest-route',
    metadata: {
      sortOrder: 500,
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
  'components-demo': componentsDemoSubNavigation,
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
