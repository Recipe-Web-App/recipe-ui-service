'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ContentProvider,
  ContentPane,
  ContentHeader,
  ContentSkeleton,
  ContentError,
  ContentSection,
  ContentGrid,
  ContentList,
  ContentActions,
} from '@/components/ui/content';
import { useContent } from '@/hooks/components/ui/content-hooks';
import { Home, Settings, ChevronRight, RefreshCw } from 'lucide-react';

// Mock data for demonstrations
const mockRecipes = [
  {
    id: 1,
    name: 'Chocolate Chip Cookies',
    category: 'Dessert',
    time: '30 min',
  },
  {
    id: 2,
    name: 'Spaghetti Bolognese',
    category: 'Main Course',
    time: '45 min',
  },
  { id: 3, name: 'Caesar Salad', category: 'Appetizer', time: '15 min' },
  {
    id: 4,
    name: 'Chicken Tikka Masala',
    category: 'Main Course',
    time: '60 min',
  },
  { id: 5, name: 'Apple Pie', category: 'Dessert', time: '90 min' },
  { id: 6, name: 'Greek Salad', category: 'Appetizer', time: '10 min' },
];

// Interactive content component for testing context
const InteractiveContentDemo = () => {
  const {
    viewMode,
    contentWidth,
    setViewMode,
    setContentWidth,
    toggleViewMode,
    toggleContentWidth,
  } = useContent();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Context Controls</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">View Mode:</span>
            <Badge variant="outline">{viewMode}</Badge>
            <Button size="sm" onClick={toggleViewMode}>
              Toggle View
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Content Width:</span>
            <Badge variant="outline">{contentWidth}</Badge>
            <Button size="sm" onClick={toggleContentWidth}>
              Toggle Width
            </Button>
          </div>

          <div className="flex gap-2">
            <Button size="sm" onClick={() => setViewMode('grid')}>
              Grid
            </Button>
            <Button size="sm" onClick={() => setViewMode('list')}>
              List
            </Button>
            <Button size="sm" onClick={() => setViewMode('card')}>
              Card
            </Button>
            <Button size="sm" onClick={() => setViewMode('table')}>
              Table
            </Button>
          </div>

          <div className="flex gap-2">
            <Button size="sm" onClick={() => setContentWidth('contained')}>
              Contained
            </Button>
            <Button size="sm" onClick={() => setContentWidth('full')}>
              Full Width
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function ContentDemo() {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [showActions, setShowActions] = useState(true);
  const [sectionCollapsed, setSectionCollapsed] = useState(false);

  const simulateLoading = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 3000);
  };

  const simulateError = () => {
    setHasError(true);
  };

  return (
    <ContentProvider>
      <div className="container mx-auto px-4 py-8">
        <ContentHeader
          title="Content Component"
          description="Flexible content layout system with multiple variants, view modes, and responsive behavior."
          breadcrumbs={[
            { label: 'Home', href: '/', icon: <Home className="h-4 w-4" /> },
            { label: 'Components', href: '/components-demo' },
            { label: 'Content', current: true },
          ]}
          actions={
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
              <Button size="sm">Add Content</Button>
            </div>
          }
        />

        <div className="space-y-12">
          {/* Interactive Controls */}
          <ContentSection
            title="Interactive Controls"
            description="Test different content features and states"
          >
            <InteractiveContentDemo />

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Button onClick={simulateLoading}>Show Loading</Button>
              <Button onClick={simulateError} variant="destructive">
                Show Error
              </Button>
              <Button onClick={() => setHasError(false)} variant="secondary">
                Clear Error
              </Button>
              <Button onClick={() => setIsLoading(false)} variant="outline">
                Clear Loading
              </Button>
            </div>
          </ContentSection>

          {/* Content Pane Examples */}
          <ContentSection
            title="Content Pane Variants"
            description="Main content container with different states"
          >
            <div className="space-y-8">
              {/* Loading State */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Loading State</h3>
                <div className="rounded-lg border">
                  <ContentPane
                    loading
                    header={<ContentHeader title="Loading Recipes" />}
                  />
                </div>
              </div>

              {/* Error State */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Error States</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border">
                    <ContentPane
                      error={new Error('Network connection failed')}
                      header={<ContentHeader title="Network Issue" />}
                    />
                  </div>
                  <div className="rounded-lg border">
                    <ContentPane
                      error={new Error('Recipe not found')}
                      header={<ContentHeader title="404 Error" />}
                    />
                  </div>
                </div>
              </div>

              {/* Normal Content */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Normal Content</h3>
                <div className="rounded-lg border">
                  <ContentPane
                    header={
                      <ContentHeader
                        title="Recipe Collection"
                        description="Browse your recipe collection"
                        actions={<Button size="sm">Add Recipe</Button>}
                      />
                    }
                    actions={
                      <ContentActions align="between">
                        <Button variant="outline">Clear Filters</Button>
                        <Button>Create Recipe</Button>
                      </ContentActions>
                    }
                  >
                    <ContentGrid columns={3} gap="lg">
                      {mockRecipes.map(recipe => (
                        <Card key={recipe.id}>
                          <CardHeader>
                            <CardTitle className="text-base">
                              {recipe.name}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-muted-foreground flex justify-between text-sm">
                              <span>{recipe.category}</span>
                              <span>{recipe.time}</span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </ContentGrid>
                  </ContentPane>
                </div>
              </div>
            </div>
          </ContentSection>

          {/* Header Variants */}
          <ContentSection
            title="Header Variants"
            description="Content headers with different styles and features"
          >
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Default Header</h3>
                <div className="rounded-lg border p-4">
                  <ContentHeader
                    title="Recipe Management"
                    description="Manage and organize your recipe collection"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  Header with Breadcrumbs
                </h3>
                <div className="rounded-lg border p-4">
                  <ContentHeader
                    variant="breadcrumb"
                    breadcrumbs={[
                      { label: 'Home', href: '/' },
                      { label: 'Recipes', href: '/recipes' },
                      { label: 'Italian', href: '/recipes/italian' },
                      { label: 'Pasta', current: true },
                    ]}
                    title="Italian Pasta Recipes"
                    description="Authentic Italian pasta recipes from various regions"
                    actions={<Button size="sm">Filter</Button>}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Compact Header</h3>
                <div className="rounded-lg border p-4">
                  <ContentHeader
                    variant="compact"
                    title="Quick Actions"
                    actions={
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Export
                        </Button>
                        <Button size="sm">Import</Button>
                      </div>
                    }
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Sticky Header</h3>
                <div className="h-64 overflow-auto rounded-lg border p-4">
                  <ContentHeader
                    variant="sticky"
                    title="Scrollable Content"
                    description="This header will stick to the top when scrolling"
                  />
                  <div className="mt-6 space-y-4">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <div key={i} className="bg-muted rounded p-4">
                        Content item {i + 1} - Lorem ipsum dolor sit amet,
                        consectetur adipiscing elit.
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </ContentSection>

          {/* Skeleton Loading */}
          <ContentSection
            title="Skeleton Loading"
            description="Loading states for different view modes"
          >
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Grid View Skeleton</h3>
                <div className="rounded-lg border p-4">
                  <ContentSkeleton viewMode="grid" count={6} />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">List View Skeleton</h3>
                <div className="rounded-lg border p-4">
                  <ContentSkeleton viewMode="list" count={4} />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Table View Skeleton</h3>
                <div className="rounded-lg border p-4">
                  <ContentSkeleton viewMode="table" count={5} />
                </div>
              </div>
            </div>
          </ContentSection>

          {/* Error States */}
          <ContentSection
            title="Error States"
            description="Different error types with recovery options"
          >
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg border p-4">
                <ContentError
                  error="Simple error message"
                  onRetry={() => console.log('Retry clicked')}
                  onGoBack={() => console.log('Go back clicked')}
                />
              </div>

              <div className="rounded-lg border p-4">
                <ContentError
                  error={{
                    type: 'network',
                    title: 'Connection Failed',
                    message: 'Unable to connect to the recipe server',
                    details:
                      'Please check your internet connection and try again',
                  }}
                  onRetry={() => console.log('Retry network')}
                />
              </div>

              <div className="rounded-lg border p-4">
                <ContentError
                  error={{
                    type: '404',
                    title: 'Recipe Not Found',
                    message: 'The recipe you are looking for does not exist',
                    code: 'RECIPE_404',
                  }}
                  onGoBack={() => console.log('Go back from 404')}
                />
              </div>

              <div className="rounded-lg border p-4">
                <ContentError
                  error={{
                    type: '500',
                    title: 'Server Error',
                    message: 'An internal server error occurred',
                    details: 'Our team has been notified',
                  }}
                  variant="destructive"
                  showActions={false}
                />
              </div>

              <div className="rounded-lg border p-4">
                <ContentError
                  error={{
                    type: 'unauthorized',
                    title: 'Access Denied',
                    message: 'You do not have permission to view this recipe',
                  }}
                  variant="warning"
                />
              </div>

              <div className="rounded-lg border p-4">
                <ContentError
                  error={{
                    type: 'validation',
                    title: 'Invalid Recipe Data',
                    message: 'The recipe data contains errors',
                    details: 'Please check the ingredients and instructions',
                  }}
                />
              </div>
            </div>
          </ContentSection>

          {/* Section Variants */}
          <ContentSection
            title="Section Components"
            description="Organized content sections with collapsible functionality"
          >
            <div className="space-y-6">
              <ContentSection
                title="Default Section"
                description="A basic content section"
              >
                <div className="bg-muted rounded p-4">
                  <p>
                    This is a default content section with some example content.
                  </p>
                </div>
              </ContentSection>

              <ContentSection
                variant="card"
                title="Card Section"
                description="A section with card styling"
                padding
              >
                <div className="space-y-2">
                  <p>
                    This section uses the card variant with built-in padding.
                  </p>
                  <p>It has a border and background styling.</p>
                </div>
              </ContentSection>

              <ContentSection
                title="Collapsible Section"
                description="Click the arrow to toggle this section"
                collapsible
                collapsed={sectionCollapsed}
                onToggle={setSectionCollapsed}
                headerActions={<Badge>Interactive</Badge>}
              >
                <div className="bg-muted rounded p-4">
                  <p>This content can be collapsed and expanded.</p>
                  <p>The state is controlled by the parent component.</p>
                </div>
              </ContentSection>
            </div>
          </ContentSection>

          {/* Grid and List Layouts */}
          <ContentSection
            title="Grid and List Layouts"
            description="Flexible layout components for organizing content"
          >
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Content Grid</h3>
                <ContentGrid columns={4} gap="md">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <Card key={i}>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <div className="bg-muted mb-2 h-20 rounded"></div>
                          <p className="text-sm font-medium">
                            Grid Item {i + 1}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </ContentGrid>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  Content List (Divided)
                </h3>
                <ContentList divided spacing="md">
                  {mockRecipes.slice(0, 4).map(recipe => (
                    <div
                      key={recipe.id}
                      className="flex items-center justify-between p-4"
                    >
                      <div>
                        <h4 className="font-medium">{recipe.name}</h4>
                        <p className="text-muted-foreground text-sm">
                          {recipe.category}
                        </p>
                      </div>
                      <Badge variant="outline">{recipe.time}</Badge>
                    </div>
                  ))}
                </ContentList>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  Content List (Hover Effects)
                </h3>
                <ContentList hover spacing="sm">
                  {['Appetizers', 'Main Courses', 'Desserts', 'Beverages'].map(
                    category => (
                      <div
                        key={category}
                        className="flex items-center justify-between rounded p-3"
                      >
                        <span className="font-medium">{category}</span>
                        <ChevronRight className="text-muted-foreground h-4 w-4" />
                      </div>
                    )
                  )}
                </ContentList>
              </div>
            </div>
          </ContentSection>

          {/* Actions */}
          <ContentSection
            title="Content Actions"
            description="Action bars and button groups with different alignments"
          >
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Left Aligned Actions</h3>
                <div className="rounded-lg border p-4">
                  <ContentActions align="left">
                    <Button>Primary Action</Button>
                    <Button variant="outline">Secondary</Button>
                    <Button variant="ghost">Tertiary</Button>
                  </ContentActions>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  Center Aligned Actions
                </h3>
                <div className="rounded-lg border p-4">
                  <ContentActions align="center">
                    <Button variant="outline">Cancel</Button>
                    <Button>Save</Button>
                  </ContentActions>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Space Between Actions</h3>
                <div className="rounded-lg border p-4">
                  <ContentActions align="between" border>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Reset
                      </Button>
                      <Button variant="outline" size="sm">
                        Clear
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline">Cancel</Button>
                      <Button>Apply Changes</Button>
                    </div>
                  </ContentActions>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Sticky Actions</h3>
                <div className="h-64 overflow-auto rounded-lg border">
                  <div className="space-y-4 p-4">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div key={i} className="bg-muted rounded p-4">
                        Content item {i + 1}
                      </div>
                    ))}
                  </div>
                  <ContentActions sticky align="between">
                    <span className="text-muted-foreground text-sm">
                      10 items
                    </span>
                    <div className="flex gap-2">
                      <Button variant="outline">Cancel</Button>
                      <Button>Save All</Button>
                    </div>
                  </ContentActions>
                </div>
              </div>
            </div>
          </ContentSection>

          {/* Full Example */}
          <ContentSection
            title="Complete Example"
            description="A full content pane with all features combined"
          >
            <div className="rounded-lg border">
              <ContentPane
                loading={isLoading}
                error={hasError ? new Error('Demo error occurred') : null}
                header={
                  <ContentHeader
                    title="Recipe Dashboard"
                    description="Manage your recipe collection with powerful tools"
                    breadcrumbs={[
                      { label: 'Home', href: '/' },
                      { label: 'Dashboard', current: true },
                    ]}
                    actions={
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setHasError(false)}
                        >
                          Clear Error
                        </Button>
                        <Button size="sm" onClick={simulateLoading}>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Refresh
                        </Button>
                      </div>
                    }
                  />
                }
                actions={
                  showActions ? (
                    <ContentActions align="between">
                      <div className="text-muted-foreground text-sm">
                        Showing {mockRecipes.length} recipes
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setShowActions(false)}
                        >
                          Hide Actions
                        </Button>
                        <Button>Add Recipe</Button>
                      </div>
                    </ContentActions>
                  ) : (
                    <ContentActions align="center">
                      <Button onClick={() => setShowActions(true)}>
                        Show Actions
                      </Button>
                    </ContentActions>
                  )
                }
              >
                {!isLoading && !hasError && (
                  <ContentGrid columns={3} gap="lg">
                    {mockRecipes.map(recipe => (
                      <Card
                        key={recipe.id}
                        className="transition-shadow hover:shadow-lg"
                      >
                        <CardHeader>
                          <CardTitle className="text-base">
                            {recipe.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-muted-foreground flex items-center justify-between text-sm">
                            <Badge variant="secondary">{recipe.category}</Badge>
                            <span>{recipe.time}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </ContentGrid>
                )}
              </ContentPane>
            </div>
          </ContentSection>
        </div>
      </div>
    </ContentProvider>
  );
}
