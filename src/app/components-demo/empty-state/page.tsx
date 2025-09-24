'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  EmptyState,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateDescription,
  EmptyStateActions,
} from '@/components/ui/empty-state';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function EmptyStateDemo() {
  const [selectedVariant, setSelectedVariant] = useState<
    'default' | 'search' | 'minimal' | 'illustrated' | 'error'
  >('default');
  const [selectedSize, setSelectedSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [selectedLayout, setSelectedLayout] = useState<
    'horizontal' | 'vertical' | 'stacked'
  >('horizontal');
  const [showIcon, setShowIcon] = useState(true);
  const [showActions, setShowActions] = useState(true);

  const handleAction = (action: string) => {
    alert(`${action} clicked!`);
  };

  const getVariantIcon = (variant: string) => {
    switch (variant) {
      case 'search':
        return '🔍';
      case 'minimal':
        return '✨';
      case 'illustrated':
        return '🎨';
      case 'error':
        return '⚠️';
      default:
        return '📦';
    }
  };

  const getVariantContent = (variant: string) => {
    switch (variant) {
      case 'search':
        return {
          title: 'No search results',
          description:
            'Try adjusting your search terms or browse our featured content.',
          actions: ['Clear Search', 'Browse All'],
        };
      case 'minimal':
        return {
          title: 'All caught up!',
          description: "You've viewed all available items.",
          actions: ['Refresh', 'Settings'],
        };
      case 'illustrated':
        return {
          title: 'Start your journey',
          description:
            'Discover amazing content and create your own collection.',
          actions: ['Get Started', 'Learn More'],
        };
      case 'error':
        return {
          title: 'Unable to load content',
          description: 'Something went wrong. Please try again.',
          actions: ['Retry', 'Contact Support'],
        };
      default:
        return {
          title: 'No items found',
          description: 'There are no items to display at this time.',
          actions: ['Add Item', 'Import'],
        };
    }
  };

  const currentContent = getVariantContent(selectedVariant);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-foreground mb-2 text-3xl font-bold">
          EmptyState Component
        </h1>
        <p className="text-muted-foreground text-lg">
          Flexible empty state component for when lists/grids have no content.
        </p>
      </div>

      <div className="space-y-8">
        {/* Interactive Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Interactive Controls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {/* Variant Selection */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Variant
                </label>
                <select
                  value={selectedVariant}
                  onChange={e =>
                    setSelectedVariant(
                      e.target.value as
                        | 'default'
                        | 'search'
                        | 'minimal'
                        | 'illustrated'
                        | 'error'
                    )
                  }
                  className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
                >
                  <option value="default">Default</option>
                  <option value="search">Search</option>
                  <option value="minimal">Minimal</option>
                  <option value="illustrated">Illustrated</option>
                  <option value="error">Error</option>
                </select>
              </div>

              {/* Size Selection */}
              <div>
                <label className="mb-2 block text-sm font-medium">Size</label>
                <select
                  value={selectedSize}
                  onChange={e =>
                    setSelectedSize(e.target.value as 'sm' | 'md' | 'lg')
                  }
                  className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
                >
                  <option value="sm">Small</option>
                  <option value="md">Medium</option>
                  <option value="lg">Large</option>
                </select>
              </div>

              {/* Layout Selection */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Actions Layout
                </label>
                <select
                  value={selectedLayout}
                  onChange={e =>
                    setSelectedLayout(
                      e.target.value as 'horizontal' | 'vertical' | 'stacked'
                    )
                  }
                  className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
                >
                  <option value="horizontal">Horizontal</option>
                  <option value="vertical">Vertical</option>
                  <option value="stacked">Stacked</option>
                </select>
              </div>

              {/* Toggles */}
              <div className="space-y-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={showIcon}
                    onChange={e => setShowIcon(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Show Icon</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={showActions}
                    onChange={e => setShowActions(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Show Actions</span>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interactive Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Interactive Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/30 flex min-h-[400px] items-center justify-center rounded-lg p-8">
              <EmptyState variant={selectedVariant} size={selectedSize}>
                {showIcon && (
                  <EmptyStateIcon variant={selectedVariant} size={selectedSize}>
                    {getVariantIcon(selectedVariant)}
                  </EmptyStateIcon>
                )}
                <EmptyStateTitle variant={selectedVariant} size={selectedSize}>
                  {currentContent.title}
                </EmptyStateTitle>
                <EmptyStateDescription
                  variant={selectedVariant}
                  size={selectedSize}
                >
                  {currentContent.description}
                </EmptyStateDescription>
                {showActions && (
                  <EmptyStateActions
                    layout={selectedLayout}
                    size={selectedSize}
                  >
                    {currentContent.actions.map((action, index) => (
                      <Button
                        key={action}
                        variant={index === 0 ? 'default' : 'outline'}
                        onClick={() => handleAction(action)}
                      >
                        {action}
                      </Button>
                    ))}
                  </EmptyStateActions>
                )}
              </EmptyState>
            </div>
          </CardContent>
        </Card>

        {/* All Variants Showcase */}
        <Card>
          <CardHeader>
            <CardTitle>All Variants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Default Variant */}
              <div className="space-y-2">
                <h3 className="font-medium">Default</h3>
                <EmptyState variant="default" size="sm">
                  <EmptyStateIcon>📦</EmptyStateIcon>
                  <EmptyStateTitle>No items found</EmptyStateTitle>
                  <EmptyStateDescription>
                    Nothing to display right now.
                  </EmptyStateDescription>
                  <EmptyStateActions>
                    <Button size="sm">Add Item</Button>
                  </EmptyStateActions>
                </EmptyState>
              </div>

              {/* Search Variant */}
              <div className="space-y-2">
                <h3 className="font-medium">Search</h3>
                <EmptyState variant="search" size="sm">
                  <EmptyStateIcon>🔍</EmptyStateIcon>
                  <EmptyStateTitle>No results</EmptyStateTitle>
                  <EmptyStateDescription>
                    Try different search terms.
                  </EmptyStateDescription>
                  <EmptyStateActions>
                    <Button size="sm" variant="outline">
                      Clear
                    </Button>
                  </EmptyStateActions>
                </EmptyState>
              </div>

              {/* Minimal Variant */}
              <div className="space-y-2">
                <h3 className="font-medium">Minimal</h3>
                <EmptyState variant="minimal" size="sm">
                  <EmptyStateIcon>✨</EmptyStateIcon>
                  <EmptyStateTitle>All caught up!</EmptyStateTitle>
                  <EmptyStateDescription>
                    You&apos;ve seen everything.
                  </EmptyStateDescription>
                </EmptyState>
              </div>

              {/* Illustrated Variant */}
              <div className="space-y-2">
                <h3 className="font-medium">Illustrated</h3>
                <EmptyState variant="illustrated" size="sm">
                  <EmptyStateIcon>🎨</EmptyStateIcon>
                  <EmptyStateTitle>Get started</EmptyStateTitle>
                  <EmptyStateDescription>
                    Begin your journey here.
                  </EmptyStateDescription>
                  <EmptyStateActions>
                    <Button size="sm">Start</Button>
                  </EmptyStateActions>
                </EmptyState>
              </div>

              {/* Error Variant */}
              <div className="space-y-2">
                <h3 className="font-medium">Error</h3>
                <EmptyState variant="error" size="sm">
                  <EmptyStateIcon>⚠️</EmptyStateIcon>
                  <EmptyStateTitle>Load failed</EmptyStateTitle>
                  <EmptyStateDescription>
                    Something went wrong.
                  </EmptyStateDescription>
                  <EmptyStateActions>
                    <Button size="sm" variant="outline">
                      Retry
                    </Button>
                  </EmptyStateActions>
                </EmptyState>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recipe-Specific Examples */}
        <Card>
          <CardHeader>
            <CardTitle>Recipe-Specific Examples</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Empty Recipe Collection */}
              <div className="space-y-4">
                <h3 className="font-medium">Empty Recipe Collection</h3>
                <div className="bg-muted/30 rounded-lg p-6">
                  <EmptyState variant="illustrated">
                    <EmptyStateIcon>👨‍🍳</EmptyStateIcon>
                    <EmptyStateTitle>Your recipe box is empty</EmptyStateTitle>
                    <EmptyStateDescription>
                      Start your culinary journey by adding your first recipe.
                    </EmptyStateDescription>
                    <EmptyStateActions>
                      <Button onClick={() => handleAction('Add Recipe')}>
                        Add Recipe
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleAction('Import Recipe')}
                      >
                        Import Recipe
                      </Button>
                    </EmptyStateActions>
                  </EmptyState>
                </div>
              </div>

              {/* Empty Search Results */}
              <div className="space-y-4">
                <h3 className="font-medium">Empty Search Results</h3>
                <div className="bg-muted/30 rounded-lg p-6">
                  <EmptyState variant="search">
                    <EmptyStateIcon>🔍</EmptyStateIcon>
                    <EmptyStateTitle>No recipes found</EmptyStateTitle>
                    <EmptyStateDescription>
                      Try different keywords or browse our categories.
                    </EmptyStateDescription>
                    <EmptyStateActions>
                      <Button
                        variant="outline"
                        onClick={() => handleAction('Clear Search')}
                      >
                        Clear Search
                      </Button>
                      <Button onClick={() => handleAction('Browse Categories')}>
                        Browse Categories
                      </Button>
                    </EmptyStateActions>
                  </EmptyState>
                </div>
              </div>

              {/* Failed Import */}
              <div className="space-y-4">
                <h3 className="font-medium">Failed Recipe Import</h3>
                <div className="bg-muted/30 rounded-lg p-6">
                  <EmptyState variant="error">
                    <EmptyStateIcon>🚫</EmptyStateIcon>
                    <EmptyStateTitle>Import failed</EmptyStateTitle>
                    <EmptyStateDescription>
                      We couldn&apos;t import the recipe from that URL.
                    </EmptyStateDescription>
                    <EmptyStateActions>
                      <Button
                        variant="outline"
                        onClick={() => handleAction('Try Again')}
                      >
                        Try Again
                      </Button>
                      <Button onClick={() => handleAction('Manual Entry')}>
                        Manual Entry
                      </Button>
                    </EmptyStateActions>
                  </EmptyState>
                </div>
              </div>

              {/* Empty Meal Plan */}
              <div className="space-y-4">
                <h3 className="font-medium">Empty Meal Plan</h3>
                <div className="bg-muted/30 rounded-lg p-6">
                  <EmptyState>
                    <EmptyStateIcon>📅</EmptyStateIcon>
                    <EmptyStateTitle>No meals planned</EmptyStateTitle>
                    <EmptyStateDescription>
                      Plan your meals for the week to stay organized.
                    </EmptyStateDescription>
                    <EmptyStateActions layout="vertical">
                      <Button
                        className="w-full"
                        onClick={() => handleAction('Create Meal Plan')}
                      >
                        Create Meal Plan
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => handleAction('Use Template')}
                      >
                        Use Template
                      </Button>
                    </EmptyStateActions>
                  </EmptyState>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Size Variations */}
        <Card>
          <CardHeader>
            <CardTitle>Size Variations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {/* Small */}
              <div className="space-y-4">
                <h3 className="font-medium">Small (sm)</h3>
                <div className="bg-muted/30 max-w-md rounded-lg p-4">
                  <EmptyState size="sm">
                    <EmptyStateIcon>📝</EmptyStateIcon>
                    <EmptyStateTitle>No notes</EmptyStateTitle>
                    <EmptyStateDescription>
                      Add cooking notes for this recipe.
                    </EmptyStateDescription>
                    <EmptyStateActions>
                      <Button size="sm">Add Note</Button>
                    </EmptyStateActions>
                  </EmptyState>
                </div>
              </div>

              {/* Medium */}
              <div className="space-y-4">
                <h3 className="font-medium">Medium (md) - Default</h3>
                <div className="bg-muted/30 max-w-lg rounded-lg p-6">
                  <EmptyState size="md">
                    <EmptyStateIcon>🍳</EmptyStateIcon>
                    <EmptyStateTitle>No ingredients</EmptyStateTitle>
                    <EmptyStateDescription>
                      Start by adding ingredients to your recipe.
                    </EmptyStateDescription>
                    <EmptyStateActions>
                      <Button>Add Ingredient</Button>
                    </EmptyStateActions>
                  </EmptyState>
                </div>
              </div>

              {/* Large */}
              <div className="space-y-4">
                <h3 className="font-medium">Large (lg)</h3>
                <div className="bg-muted/30 max-w-2xl rounded-lg p-8">
                  <EmptyState size="lg">
                    <EmptyStateIcon>🌟</EmptyStateIcon>
                    <EmptyStateTitle>Welcome to Recipe Manager</EmptyStateTitle>
                    <EmptyStateDescription>
                      Your recipe collection is empty. Get started by adding
                      your first recipe or importing from your favorite cooking
                      websites.
                    </EmptyStateDescription>
                    <EmptyStateActions>
                      <Button size="lg">Create Recipe</Button>
                      <Button variant="outline" size="lg">
                        Import Recipe
                      </Button>
                    </EmptyStateActions>
                  </EmptyState>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Layouts */}
        <Card>
          <CardHeader>
            <CardTitle>Action Layouts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Horizontal Layout */}
              <div className="space-y-4">
                <h3 className="font-medium">Horizontal (default)</h3>
                <div className="bg-muted/30 rounded-lg p-6">
                  <EmptyState size="sm">
                    <EmptyStateIcon>🔄</EmptyStateIcon>
                    <EmptyStateTitle>Horizontal actions</EmptyStateTitle>
                    <EmptyStateDescription>
                      Actions arranged in a row.
                    </EmptyStateDescription>
                    <EmptyStateActions layout="horizontal">
                      <Button size="sm" variant="outline">
                        Cancel
                      </Button>
                      <Button size="sm">Continue</Button>
                    </EmptyStateActions>
                  </EmptyState>
                </div>
              </div>

              {/* Vertical Layout */}
              <div className="space-y-4">
                <h3 className="font-medium">Vertical</h3>
                <div className="bg-muted/30 rounded-lg p-6">
                  <EmptyState size="sm">
                    <EmptyStateIcon>📱</EmptyStateIcon>
                    <EmptyStateTitle>Vertical actions</EmptyStateTitle>
                    <EmptyStateDescription>
                      Actions stacked vertically.
                    </EmptyStateDescription>
                    <EmptyStateActions layout="vertical">
                      <Button size="sm" className="w-full">
                        Primary Action
                      </Button>
                      <Button size="sm" variant="outline" className="w-full">
                        Secondary
                      </Button>
                    </EmptyStateActions>
                  </EmptyState>
                </div>
              </div>

              {/* Stacked Layout */}
              <div className="space-y-4">
                <h3 className="font-medium">Stacked</h3>
                <div className="bg-muted/30 rounded-lg p-6">
                  <EmptyState size="sm">
                    <EmptyStateIcon>📚</EmptyStateIcon>
                    <EmptyStateTitle>Stacked actions</EmptyStateTitle>
                    <EmptyStateDescription>
                      Centered vertical stack.
                    </EmptyStateDescription>
                    <EmptyStateActions layout="stacked">
                      <Button size="sm">Main Action</Button>
                      <Button size="sm" variant="link">
                        Secondary Link
                      </Button>
                    </EmptyStateActions>
                  </EmptyState>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Usage Examples */}
        <Card>
          <CardHeader>
            <CardTitle>Code Examples</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="mb-3 font-medium">Basic Usage</h3>
                <pre className="bg-muted overflow-x-auto rounded-lg p-4 text-sm">
                  <code>{`<EmptyState>
  <EmptyStateIcon>📦</EmptyStateIcon>
  <EmptyStateTitle>No items found</EmptyStateTitle>
  <EmptyStateDescription>
    There are no items to display at this time.
  </EmptyStateDescription>
  <EmptyStateActions>
    <Button>Add Item</Button>
  </EmptyStateActions>
</EmptyState>`}</code>
                </pre>
              </div>

              <div>
                <h3 className="mb-3 font-medium">Search Results</h3>
                <pre className="bg-muted overflow-x-auto rounded-lg p-4 text-sm">
                  <code>{`<EmptyState variant="search" size="lg">
  <EmptyStateIcon>🔍</EmptyStateIcon>
  <EmptyStateTitle>No recipes found</EmptyStateTitle>
  <EmptyStateDescription>
    Try different keywords or browse categories.
  </EmptyStateDescription>
  <EmptyStateActions>
    <Button variant="outline">Clear Search</Button>
    <Button>Browse Categories</Button>
  </EmptyStateActions>
</EmptyState>`}</code>
                </pre>
              </div>

              <div>
                <h3 className="mb-3 font-medium">Error State</h3>
                <pre className="bg-muted overflow-x-auto rounded-lg p-4 text-sm">
                  <code>{`<EmptyState variant="error">
  <EmptyStateIcon>⚠️</EmptyStateIcon>
  <EmptyStateTitle>Unable to load content</EmptyStateTitle>
  <EmptyStateDescription>
    Something went wrong. Please try again.
  </EmptyStateDescription>
  <EmptyStateActions layout="vertical">
    <Button className="w-full">Retry</Button>
    <Button variant="outline" className="w-full">
      Contact Support
    </Button>
  </EmptyStateActions>
</EmptyState>`}</code>
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
