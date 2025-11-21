'use client';

import React from 'react';
import Link from 'next/link';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

const components = [
  {
    name: 'BrowseGrid',
    path: '/components-demo/browse-grid',
    description: 'Generic grid wrapper for browsing content with pagination',
    variants: 4,
    status: 'ready',
  },
  {
    name: 'BrowseList',
    path: '/components-demo/browse-list',
    description: 'Compact list view for browsing content with pagination',
    variants: 4,
    status: 'ready',
  },
  {
    name: 'Button',
    path: '/components-demo/button',
    description: 'Flexible, accessible button component',
    variants: 6,
    status: 'ready',
  },
  {
    name: 'Input',
    path: '/components-demo/input',
    description: 'Comprehensive input with validation and features',
    variants: 3,
    status: 'ready',
  },
  {
    name: 'Card',
    path: '/components-demo/card',
    description: 'Container component with multiple variants',
    variants: 5,
    status: 'ready',
  },
  {
    name: 'Modal',
    path: '/components-demo/modal',
    description: 'Accessible modal dialogs and overlays',
    variants: 4,
    status: 'ready',
  },
  {
    name: 'Toast',
    path: '/components-demo/toast',
    description: 'Notification system with auto-dismiss',
    variants: 5,
    status: 'ready',
  },
  {
    name: 'Skeleton',
    path: '/components-demo/skeleton',
    description: 'Loading state placeholders',
    variants: 6,
    status: 'ready',
  },
  {
    name: 'Badge',
    path: '/components-demo/badge',
    description: 'Tags, categories, and status indicators',
    variants: 7,
    status: 'ready',
  },
  {
    name: 'Dropdown',
    path: '/components-demo/dropdown',
    description: 'Menus, select options, and action lists',
    variants: 8,
    status: 'ready',
  },
  {
    name: 'Tabs',
    path: '/components-demo/tabs',
    description: 'Organized content in tabbed interface',
    variants: 9,
    status: 'ready',
  },
  {
    name: 'Select',
    path: '/components-demo/select',
    description: 'Category selection, filters, and form controls',
    variants: 4,
    status: 'ready',
  },
  {
    name: 'Tooltip',
    path: '/components-demo/tooltip',
    description: 'Contextual help for cooking terms and UI elements',
    variants: 6,
    status: 'ready',
  },
  {
    name: 'Dialog',
    path: '/components-demo/dialog',
    description: 'Confirmations, alerts, and recipe-specific actions',
    variants: 8,
    status: 'ready',
  },
  {
    name: 'Alert',
    path: '/components-demo/alert',
    description: 'Notifications, status messages, and user feedback',
    variants: 10,
    status: 'ready',
  },
  {
    name: 'Switch',
    path: '/components-demo/switch',
    description: 'Toggle switches for settings and preferences',
    variants: 11,
    status: 'ready',
  },
  {
    name: 'Checkbox',
    path: '/components-demo/checkbox',
    description: 'Multi-select filters and form controls',
    variants: 12,
    status: 'ready',
  },
  {
    name: 'Radio',
    path: '/components-demo/radio',
    description: 'Exclusive selection for preferences and options',
    variants: 10,
    status: 'ready',
  },
  {
    name: 'Avatar',
    path: '/components-demo/avatar',
    description: 'User profile images and chef avatars',
    variants: 8,
    status: 'ready',
  },
  {
    name: 'Progress',
    path: '/components-demo/progress',
    description: 'Progress bars for cooking and upload states',
    variants: 8,
    status: 'ready',
  },
  {
    name: 'Accordion',
    path: '/components-demo/accordion',
    description: 'Collapsible content for recipes and FAQs',
    variants: 5,
    status: 'ready',
  },
  {
    name: 'Textarea',
    path: '/components-demo/textarea',
    description: 'Multi-line text input for recipes and reviews',
    variants: 5,
    status: 'ready',
  },
  {
    name: 'Popover',
    path: '/components-demo/popover',
    description: 'Floating content container for actions and information',
    variants: 7,
    status: 'ready',
  },
  {
    name: 'Table',
    path: '/components-demo/table',
    description: 'Data tables with recipe-specific variants',
    variants: 12,
    status: 'ready',
  },
  {
    name: 'Slider',
    path: '/components-demo/slider',
    description: 'Range and value sliders for interactive input',
    variants: 15,
    status: 'ready',
  },
  {
    name: 'DatePicker',
    path: '/components-demo/datepicker',
    description: 'Date and time selection with recipe-specific variants',
    variants: 7,
    status: 'ready',
  },
  {
    name: 'List',
    path: '/components-demo/list',
    description: 'Flexible lists with icons, checkmarks, and recipe variants',
    variants: 12,
    status: 'ready',
  },
  {
    name: 'Divider',
    path: '/components-demo/divider',
    description: 'Horizontal/vertical separators with recipe-specific variants',
    variants: 8,
    status: 'ready',
  },
  {
    name: 'Stepper',
    path: '/components-demo/stepper',
    description: 'Multi-step workflows, recipe wizards, and cooking mode',
    variants: 12,
    status: 'ready',
  },
  {
    name: 'Pagination',
    path: '/components-demo/pagination',
    description: 'Page navigation controls with multiple configurations',
    variants: 4,
    status: 'ready',
  },
  {
    name: 'Icon',
    path: '/components-demo/icon',
    description: 'Standard icon system with comprehensive icon collection',
    variants: 15,
    status: 'ready',
  },
  {
    name: 'Breadcrumb',
    path: '/components-demo/breadcrumb',
    description: 'Hierarchical navigation with overflow handling',
    variants: 8,
    status: 'ready',
  },
  {
    name: 'Drawer',
    path: '/components-demo/drawer',
    description: 'Off-canvas panels for navigation and recipe management',
    variants: 12,
    status: 'ready',
  },
  {
    name: 'Chip',
    path: '/components-demo/chip',
    description: 'Interactive tags for ingredients, filters, and dynamic lists',
    variants: 10,
    status: 'ready',
  },
  {
    name: 'File Upload',
    path: '/components-demo/file-upload',
    description: 'Drag-and-drop upload zone with validation and preview',
    variants: 8,
    status: 'ready',
  },
  {
    name: 'Disclosure',
    path: '/components-demo/disclosure',
    description: 'Simple toggle for showing/hiding content sections',
    variants: 8,
    status: 'ready',
  },
  {
    name: 'Collapse',
    path: '/components-demo/collapse',
    description:
      'Utility component for expanding/collapsing content with smooth animation',
    variants: 10,
    status: 'ready',
  },
  {
    name: 'Rating',
    path: '/components-demo/rating',
    description:
      'Visual indicator for feedback or quality (e.g., stars, hearts, recipe ratings)',
    variants: 12,
    status: 'ready',
  },
  {
    name: 'Spinner',
    path: '/components-demo/spinner',
    description: 'Versatile loading indicator with multiple animations',
    variants: 8,
    status: 'ready',
  },
  {
    name: 'EmptyState',
    path: '/components-demo/empty-state',
    description:
      'For when lists/grids have no content (no recipes, empty search results)',
    variants: 8,
    status: 'ready',
  },
  {
    name: 'ErrorBoundary',
    path: '/components-demo/error-boundary',
    description:
      'Gracefully handle and display errors with retry functionality',
    variants: 5,
    status: 'ready',
  },
  {
    name: 'Service Error Boundary',
    path: '/components-demo/service-error-boundary',
    description:
      'Service-specific error handling with intelligent retry logic and health status',
    variants: 6,
    status: 'ready',
  },
  {
    name: 'Page Error Boundary',
    path: '/components-demo/page-error-boundary',
    description:
      'Full-page error handling with HTTP status awareness and SEO optimization',
    variants: 8,
    status: 'ready',
  },
  {
    name: 'ErrorPage',
    path: '/components-demo/error-page',
    description:
      'Standalone error page displays for HTTP status codes (404, 500, etc.)',
    variants: 10,
    status: 'ready',
  },
  {
    name: 'ErrorAlert',
    path: '/components-demo/error-alert',
    description:
      'Inline error messages for validation, API, service, and custom errors',
    variants: 12,
    status: 'ready',
  },
  {
    name: 'RetryButton',
    path: '/components-demo/retry-button',
    description:
      'Specialized button for retry operations with cooldown and strategy management',
    variants: 8,
    status: 'ready',
  },
  {
    name: 'SearchInput',
    path: '/components-demo/search-input',
    description:
      'Specialized input with search icon, clear button, and debouncing',
    variants: 8,
    status: 'ready',
  },
  {
    name: 'ImageGallery',
    path: '/components-demo/image-gallery',
    description:
      'Responsive image gallery with grid layouts and lightbox functionality',
    variants: 12,
    status: 'ready',
  },
  {
    name: 'FloatingActionButton',
    path: '/components-demo/fab',
    description: 'Quick access buttons for primary actions like "Add Recipe"',
    variants: 15,
    status: 'ready',
  },
  {
    name: 'CommandPalette',
    path: '/components-demo/command-palette',
    description: 'Quick navigation and actions (Cmd+K style)',
    variants: 12,
    status: 'ready',
  },
  {
    name: 'InfiniteScroll',
    path: '/components-demo/infinite-scroll',
    description: 'Infinite scroll for recipe lists and search results',
    variants: 15,
    status: 'ready',
  },
  {
    name: 'AvatarGroup',
    path: '/components-demo/avatar-group',
    description: 'Show multiple user avatars for shared recipes/meal plans',
    variants: 10,
    status: 'ready',
  },
  {
    name: 'CopyButton',
    path: '/components-demo/copy-button',
    description: 'One-click copy functionality for sharing recipes and content',
    variants: 15,
    status: 'ready',
  },
  {
    name: 'Sidebar',
    path: '/components-demo/sidebar',
    description:
      'Multi-level navigation sidebar with sub-package architecture support',
    variants: 3,
    status: 'ready',
  },
  {
    name: 'Content',
    path: '/components-demo/content',
    description:
      'Flexible content layout system with multiple view modes and responsive behavior',
    variants: 10,
    status: 'ready',
  },
  {
    name: 'ProtectedRoute',
    path: '/components-demo/protected-route',
    description:
      'Route guard for authentication checks, redirects, and protected content',
    variants: 7,
    status: 'ready',
  },
  {
    name: 'GuestOnlyRoute',
    path: '/components-demo/guest-route',
    description:
      'Route guard that redirects authenticated users from guest-only pages',
    variants: 7,
    status: 'ready',
  },
  {
    name: 'RoleGuard',
    path: '/components-demo/role-guard',
    description:
      'Role-based access control for restricting content by user roles (ADMIN, USER)',
    variants: 8,
    status: 'ready',
  },
  {
    name: 'ViewToggle',
    path: '/components-demo/view-toggle',
    description:
      'Toggle between grid and list views with persistent localStorage preference',
    variants: 4,
    status: 'ready',
  },
  {
    name: 'FilterPanel',
    path: '/components-demo/filter-panel',
    description:
      'Generic filter panel with search, checkbox, range, select, and custom filter types',
    variants: 4,
    status: 'ready',
  },
  {
    name: 'QuickActions',
    path: '/components-demo/quick-actions',
    description:
      'Quick action buttons that appear on hover/focus, positioned in corners with overflow menu support',
    variants: 4,
    status: 'ready',
  },
  {
    name: 'RecipeCard',
    path: '/components-demo/recipe-card',
    description:
      'Recipe-specific card with metadata, author, quick actions, and menu',
    variants: 8,
    status: 'ready',
  },
  {
    name: 'RecipeBrowseGrid',
    path: '/components-demo/recipe-browse-grid',
    description:
      'Recipe-specific grid wrapper with RecipeCard integration, pagination, and recipe actions',
    variants: 6,
    status: 'ready',
  },
  {
    name: 'RecipeListItem',
    path: '/components-demo/recipe-list-item',
    description:
      'Horizontal list item layout for recipe browsing with metadata and quick actions',
    variants: 9,
    status: 'ready',
  },
  {
    name: 'RecipeBrowseList',
    path: '/components-demo/recipe-browse-list',
    description:
      'Recipe-specific list wrapper with RecipeListItem integration, pagination, and recipe actions',
    variants: 7,
    status: 'ready',
  },
  {
    name: 'RecipeFilters',
    path: '/components-demo/recipe-filters',
    description:
      'Entity-specific filter panel for recipe browsing with dynamic tag extraction and responsive design',
    variants: 6,
    status: 'ready',
  },
  {
    name: 'RecipeMenu',
    path: '/components-demo/recipe-menu',
    description:
      'Standalone contextual menu for recipe actions with ownership-based permissions and new features',
    variants: 8,
    status: 'ready',
  },
  {
    name: 'RecipeQuickActions',
    path: '/components-demo/recipe-quick-actions',
    description:
      'Recipe-specific quick action buttons that appear on hover/focus, providing favorite, share, add to collection, and quick view actions',
    variants: 4,
    status: 'ready',
  },
  {
    name: 'CollectionCard',
    path: '/components-demo/collection-card',
    description:
      'Collection-specific card with 2x2 mosaic image grid, quick actions, and menu for recipe collections',
    variants: 5,
    status: 'ready',
  },
  {
    name: 'CollectionBrowseGrid',
    path: '/components-demo/collection-browse-grid',
    description:
      'Grid view for browsing recipe collections with pagination and actions',
    variants: 5,
    status: 'ready',
  },
  {
    name: 'CollectionFilters',
    path: '/components-demo/collection-filters',
    description:
      'Entity-specific filter panel for collection browsing with text search, visibility, collaboration, and favorited toggles. Responsive with mobile drawer.',
    variants: 6,
    status: 'ready',
  },
  {
    name: 'MealPlanCard',
    path: '/components-demo/meal-plan-card',
    description:
      'Meal plan card with 2x2 recipe image mosaic, status badges (current/upcoming/completed), meal type breakdown, quick actions, and menu',
    variants: 5,
    status: 'ready',
  },
];

const upcomingComponents: Array<{ name: string; description: string }> = [
  // Add new upcoming components here
];

export default function ComponentsDemoOverview() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <header className="mb-12">
        <h1 className="text-foreground mb-2 text-4xl font-bold">
          Component Library
        </h1>
        <p className="text-muted-foreground text-lg">
          Recipe UI Service Design System Components
        </p>
      </header>

      {/* Stats */}
      <div className="mb-12 grid gap-4 md:grid-cols-4">
        <Card size="sm">
          <CardContent>
            <div className="text-primary text-3xl font-bold">64</div>
            <div className="text-muted-foreground text-sm">
              Ready Components
            </div>
          </CardContent>
        </Card>
        <Card size="sm">
          <CardContent>
            <div className="text-primary text-3xl font-bold">501</div>
            <div className="text-muted-foreground text-sm">Total Variants</div>
          </CardContent>
        </Card>
        <Card size="sm">
          <CardContent>
            <div className="text-primary text-3xl font-bold">0</div>
            <div className="text-muted-foreground text-sm">Coming Soon</div>
          </CardContent>
        </Card>
        <Card size="sm">
          <CardContent>
            <div className="text-primary text-3xl font-bold">100%</div>
            <div className="text-muted-foreground text-sm">TypeScript</div>
          </CardContent>
        </Card>
      </div>

      {/* Available Components */}
      <section className="mb-12">
        <h2 className="text-foreground mb-6 text-2xl font-semibold">
          Available Components
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {components.map(component => (
            <Link key={component.path} href={component.path}>
              <Card
                variant="interactive"
                className="h-full transition-transform hover:scale-[1.02]"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{component.name}</CardTitle>
                    <span className="bg-success-light text-success rounded-full px-2 py-1 text-xs font-medium dark:bg-green-900/30 dark:text-green-400">
                      Ready
                    </span>
                  </div>
                  <CardDescription className="mt-2">
                    {component.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-muted-foreground flex items-center gap-4 text-sm">
                    <span>{component.variants} variants</span>
                    <span>•</span>
                    <span>View demo →</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Coming Soon */}
      <section>
        <h2 className="text-foreground mb-6 text-2xl font-semibold">
          Coming Soon
        </h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {upcomingComponents.map(component => (
            <Card key={component.name} variant="outlined" size="sm">
              <CardContent>
                <h3 className="text-foreground mb-1 font-medium">
                  {component.name}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {component.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
