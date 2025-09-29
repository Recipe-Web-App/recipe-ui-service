'use client';

import * as React from 'react';
import {
  BookOpen,
  Calendar,
  Heart,
  User,
  Plus,
  Search,
  Tags,
  FolderOpen,
  Clock,
  Star,
  Users,
  ChefHat,
} from 'lucide-react';

// Layout components
import { Sidebar } from '@/components/layout/sidebar';

// UI components
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

// Navigation types
import type { NavItem } from '@/types/navigation';

// Demo navigation data
const recipesNavigation: NavItem[] = [
  {
    id: 'recipes-browse',
    label: 'Browse Recipes',
    href: '/recipes',
    icon: BookOpen,
  },
  {
    id: 'recipes-create',
    label: 'Create Recipe',
    href: '/recipes/create',
    icon: Plus,
    metadata: {
      badge: 'New',
      badgeVariant: 'success',
    },
  },
  {
    id: 'recipes-search',
    label: 'Advanced Search',
    href: '/recipes/search',
    icon: Search,
  },
  {
    id: 'recipes-collections',
    label: 'Collections',
    icon: FolderOpen,
    children: [
      {
        id: 'collections-my',
        label: 'My Collections',
        href: '/recipes/collections/my',
      },
      {
        id: 'collections-shared',
        label: 'Shared with Me',
        href: '/recipes/collections/shared',
        metadata: {
          badge: '3',
          badgeVariant: 'info',
        },
      },
      {
        id: 'collections-public',
        label: 'Public Collections',
        href: '/recipes/collections/public',
      },
    ],
  },
  {
    id: 'recipes-categories',
    label: 'Categories',
    icon: Tags,
    children: [
      {
        id: 'category-appetizers',
        label: 'Appetizers',
        href: '/recipes/categories/appetizers',
      },
      {
        id: 'category-mains',
        label: 'Main Courses',
        href: '/recipes/categories/mains',
        metadata: {
          badge: '24',
          badgeVariant: 'default',
        },
      },
      {
        id: 'category-desserts',
        label: 'Desserts',
        href: '/recipes/categories/desserts',
      },
      {
        id: 'category-beverages',
        label: 'Beverages',
        href: '/recipes/categories/beverages',
      },
    ],
  },
  {
    id: 'recipes-recent',
    label: 'Recently Viewed',
    href: '/recipes/recent',
    icon: Clock,
  },
  {
    id: 'recipes-favorites',
    label: 'Favorites',
    href: '/recipes/favorites',
    icon: Heart,
    metadata: {
      badge: '12',
      badgeVariant: 'destructive',
    },
  },
];

const mealPlanNavigation: NavItem[] = [
  {
    id: 'meal-plans-calendar',
    label: 'Calendar View',
    href: '/meal-plans',
    icon: Calendar,
  },
  {
    id: 'meal-plans-create',
    label: 'Create Meal Plan',
    href: '/meal-plans/create',
    icon: Plus,
  },
  {
    id: 'meal-plans-templates',
    label: 'Templates',
    icon: Star,
    children: [
      {
        id: 'templates-weekly',
        label: 'Weekly Plans',
        href: '/meal-plans/templates/weekly',
      },
      {
        id: 'templates-monthly',
        label: 'Monthly Plans',
        href: '/meal-plans/templates/monthly',
      },
      {
        id: 'templates-custom',
        label: 'Custom Templates',
        href: '/meal-plans/templates/custom',
      },
    ],
  },
  {
    id: 'meal-plans-shared',
    label: 'Shared Plans',
    href: '/meal-plans/shared',
    icon: Users,
    metadata: {
      badge: '5',
      badgeVariant: 'info',
    },
  },
];

const socialNavigation: NavItem[] = [
  {
    id: 'social-feed',
    label: 'Activity Feed',
    href: '/social',
    icon: Users,
  },
  {
    id: 'social-following',
    label: 'Following',
    href: '/social/following',
    icon: User,
    metadata: {
      badge: '18',
      badgeVariant: 'default',
    },
  },
  {
    id: 'social-chefs',
    label: 'Featured Chefs',
    href: '/social/chefs',
    icon: ChefHat,
    metadata: {
      badge: 'Hot',
      badgeVariant: 'warning',
    },
  },
];

export default function SidebarDemo() {
  const [currentNavigation, setCurrentNavigation] =
    React.useState<NavItem[]>(recipesNavigation);
  const [sidebarVariant, setSidebarVariant] = React.useState<
    'default' | 'minimal'
  >('default');
  const [showFooter, setShowFooter] = React.useState(true);

  // Demo navigation sets
  const navigationSets = [
    { name: 'Recipes', items: recipesNavigation },
    { name: 'Meal Plans', items: mealPlanNavigation },
    { name: 'Social', items: socialNavigation },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Sidebar</h1>
        <p className="text-muted-foreground text-lg">
          Multi-level navigation sidebar with collapsible sections, tooltips,
          and sub-package architecture support.
        </p>
      </div>

      {/* Demo Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Demo Controls</CardTitle>
          <CardDescription>
            Customize the sidebar appearance and test different navigation
            configurations.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Navigation Set Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Navigation Set</label>
            <div className="flex flex-wrap gap-2">
              {navigationSets.map(set => (
                <Button
                  key={set.name}
                  variant={
                    currentNavigation === set.items ? 'default' : 'outline'
                  }
                  size="sm"
                  onClick={() => setCurrentNavigation(set.items)}
                >
                  {set.name}
                  <Badge variant="secondary" className="ml-2">
                    {set.items.length}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>

          {/* Sidebar Options */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Sidebar Variant</label>
              <div className="flex gap-2">
                <Button
                  variant={sidebarVariant === 'default' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSidebarVariant('default')}
                >
                  Default
                </Button>
                <Button
                  variant={sidebarVariant === 'minimal' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSidebarVariant('minimal')}
                >
                  Minimal
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="show-footer"
                checked={showFooter}
                onCheckedChange={setShowFooter}
              />
              <label htmlFor="show-footer" className="text-sm font-medium">
                Show Footer
              </label>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-muted rounded-lg p-4">
            <h4 className="mb-2 font-medium">Features to Test</h4>
            <ul className="text-muted-foreground space-y-1 text-sm">
              <li>• Click navigation items to test active states</li>
              <li>• Expand/collapse sections with children</li>
              <li>• Use the footer toggle to collapse/expand the sidebar</li>
              <li>• Hover over collapsed items to see tooltips</li>
              <li>• Notice badges and metadata display</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Sidebar Demo */}
      <Card>
        <CardHeader>
          <CardTitle>Interactive Demo</CardTitle>
          <CardDescription>
            Live sidebar component with your selected navigation configuration.
            This demonstrates how the sidebar would appear in the actual
            application.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex h-[600px] overflow-hidden rounded-lg border">
            {/* Sidebar */}
            <Sidebar
              items={currentNavigation}
              variant={sidebarVariant}
              showFooter={showFooter}
              className="relative"
            />

            {/* Mock Content Area */}
            <div className="flex flex-1 flex-col">
              <div className="bg-muted/50 border-b p-4">
                <h3 className="font-medium">Content Area</h3>
                <p className="text-muted-foreground text-sm">
                  This represents the main content area of your application.
                </p>
              </div>

              <div className="flex-1 overflow-auto p-6">
                <div className="space-y-4">
                  <div className="text-muted-foreground py-8 text-center">
                    <BookOpen className="mx-auto mb-4 h-12 w-12 opacity-50" />
                    <p>Main application content would appear here</p>
                    <p className="text-sm">
                      Navigate using the sidebar to see active states
                    </p>
                  </div>

                  {/* Navigation State Info */}
                  <div className="bg-muted space-y-2 rounded-lg p-4">
                    <h4 className="font-medium">Current Navigation Set</h4>
                    <div className="text-muted-foreground text-sm">
                      <p>
                        <strong>Items:</strong> {currentNavigation.length}
                      </p>
                      <p>
                        <strong>Variant:</strong> {sidebarVariant}
                      </p>
                      <p>
                        <strong>Footer:</strong>{' '}
                        {showFooter ? 'Visible' : 'Hidden'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Architecture Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Sub-Package Architecture</CardTitle>
          <CardDescription>
            How this sidebar supports the extensible sub-package navigation
            system.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="prose prose-sm max-w-none">
            <p>
              This sidebar is designed as a{' '}
              <strong>pure presentation component</strong> that receives
              pre-filtered navigation items from sub-package extensions. Each
              sub-package can:
            </p>
            <ul>
              <li>Define its own navigation structure and filtering rules</li>
              <li>Handle authentication and feature flag requirements</li>
              <li>Provide contextual navigation based on user state</li>
              <li>Extend the system without modifying core sidebar code</li>
            </ul>
            <p>
              The sidebar simply renders whatever navigation items it receives,
              making it highly flexible and maintainable for complex
              applications.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
