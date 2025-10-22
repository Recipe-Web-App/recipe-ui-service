'use client';

import React, { useState } from 'react';
import { RecipeListItem } from '@/components/recipe/RecipeListItem';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DifficultyLevel } from '@/types/recipe-management/common';
import { type RecipeListItemProps } from '@/types/ui/recipe-list-item';

// Sample recipe data
const sampleRecipe: RecipeListItemProps['recipe'] = {
  recipeId: 1,
  title: 'Chocolate Chip Cookies',
  description:
    'Classic soft and chewy cookies with chocolate chips. Perfect for dessert or a sweet snack.',
  imageUrl:
    'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800',
  preparationTime: 15,
  cookingTime: 12,
  difficulty: DifficultyLevel.EASY,
  servings: 24,
  rating: 4.5,
  reviewCount: 128,
  isFavorite: false,
  author: {
    id: 'user-123',
    name: 'Jane Doe',
    avatar: 'https://i.pravatar.cc/150?u=jane',
    role: 'chef',
    verified: true,
  },
  createdAt: '2024-01-01T00:00:00Z',
};

const sampleRecipeNoImage: RecipeListItemProps['recipe'] = {
  ...sampleRecipe,
  recipeId: 2,
  title: 'Simple Pasta Carbonara',
  description: 'Traditional Italian pasta with eggs, cheese, and pancetta.',
  imageUrl: undefined,
  difficulty: DifficultyLevel.MEDIUM,
  preparationTime: 10,
  cookingTime: 15,
};

const favoritedRecipe: RecipeListItemProps['recipe'] = {
  ...sampleRecipe,
  recipeId: 3,
  title: 'Homemade Pizza',
  description: 'From scratch pizza dough with your favorite toppings.',
  isFavorite: true,
  difficulty: DifficultyLevel.HARD,
  preparationTime: 90,
  cookingTime: 15,
};

const quickRecipe: RecipeListItemProps['recipe'] = {
  ...sampleRecipe,
  recipeId: 4,
  title: 'Greek Salad',
  description: 'Fresh Mediterranean salad with feta and olives.',
  imageUrl:
    'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800',
  difficulty: DifficultyLevel.EASY,
  preparationTime: 15,
  cookingTime: 0,
  servings: 4,
  rating: 4.2,
  reviewCount: 67,
};

export default function RecipeListItemDemo() {
  const [clickCount, setClickCount] = useState(0);
  const [lastAction, setLastAction] = useState<string>('');
  const [variant, setVariant] = useState<'default' | 'compact' | 'detailed'>(
    'default'
  );
  const [size, setSize] = useState<'sm' | 'default' | 'lg'>('default');
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [showAuthor, setShowAuthor] = useState(true);
  const [showRating, setShowRating] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleAction = (action: string) => {
    setLastAction(action);
    setClickCount(prev => prev + 1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-foreground mb-2 text-3xl font-bold">
          RecipeListItem Component
        </h1>
        <p className="text-muted-foreground text-lg">
          Horizontal list item layout for recipe browsing with metadata and
          quick actions. Optimized for compact, scannable list views.
        </p>
      </div>

      <div className="space-y-8">
        {/* Interactive Controls */}
        <Card size="lg">
          <CardHeader>
            <CardTitle>Interactive Controls</CardTitle>
            <CardDescription>
              Test different RecipeListItem features and track interactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 space-y-4">
              {/* Checkboxes */}
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={showQuickActions}
                    onChange={e => setShowQuickActions(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Show Quick Actions</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={showAuthor}
                    onChange={e => setShowAuthor(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Show Author</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={showRating}
                    onChange={e => setShowRating(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Show Rating</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={loading}
                    onChange={e => setLoading(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Loading State</span>
                </label>
              </div>

              {/* Variant Selection */}
              <div>
                <label className="text-muted-foreground mb-2 block text-sm font-medium">
                  Variant
                </label>
                <div className="flex gap-2">
                  <Button
                    variant={variant === 'default' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setVariant('default')}
                  >
                    Default
                  </Button>
                  <Button
                    variant={variant === 'compact' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setVariant('compact')}
                  >
                    Compact
                  </Button>
                  <Button
                    variant={variant === 'detailed' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setVariant('detailed')}
                  >
                    Detailed
                  </Button>
                </div>
              </div>

              {/* Size Selection */}
              <div>
                <label className="text-muted-foreground mb-2 block text-sm font-medium">
                  Size
                </label>
                <div className="flex gap-2">
                  <Button
                    variant={size === 'sm' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSize('sm')}
                  >
                    Small
                  </Button>
                  <Button
                    variant={size === 'default' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSize('default')}
                  >
                    Default
                  </Button>
                  <Button
                    variant={size === 'lg' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSize('lg')}
                  >
                    Large
                  </Button>
                </div>
              </div>
            </div>

            {/* Action Log */}
            {lastAction && (
              <div className="bg-muted rounded-lg p-4">
                <div className="text-sm">
                  <span className="text-muted-foreground">Last Action:</span>{' '}
                  <span className="font-medium">{lastAction}</span>
                </div>
                <div className="text-muted-foreground text-xs">
                  Total interactions: {clickCount}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Examples */}
        <Card size="lg">
          <CardHeader>
            <CardTitle>Examples</CardTitle>
            <CardDescription>
              Various RecipeListItem configurations with current settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Default Recipe */}
              <div>
                <h3 className="text-foreground mb-2 text-sm font-semibold">
                  Default Recipe
                </h3>
                <ul className="border-border rounded-lg border">
                  <RecipeListItem
                    recipe={sampleRecipe}
                    variant={variant}
                    size={size}
                    showQuickActions={showQuickActions}
                    showAuthor={showAuthor}
                    showRating={showRating}
                    loading={loading}
                    onClick={() =>
                      handleAction('Clicked: Chocolate Chip Cookies')
                    }
                    onFavorite={() =>
                      handleAction('Favorited: Chocolate Chip Cookies')
                    }
                    onShare={() =>
                      handleAction('Shared: Chocolate Chip Cookies')
                    }
                  />
                </ul>
              </div>

              {/* Recipe Without Image */}
              <div>
                <h3 className="text-foreground mb-2 text-sm font-semibold">
                  Recipe Without Image (Fallback Icon)
                </h3>
                <ul className="border-border rounded-lg border">
                  <RecipeListItem
                    recipe={sampleRecipeNoImage}
                    variant={variant}
                    size={size}
                    showQuickActions={showQuickActions}
                    showAuthor={showAuthor}
                    showRating={showRating}
                    onClick={() =>
                      handleAction('Clicked: Simple Pasta Carbonara')
                    }
                    onFavorite={() =>
                      handleAction('Favorited: Simple Pasta Carbonara')
                    }
                  />
                </ul>
              </div>

              {/* Favorited Recipe */}
              <div>
                <h3 className="text-foreground mb-2 text-sm font-semibold">
                  Favorited Recipe
                </h3>
                <ul className="border-border rounded-lg border">
                  <RecipeListItem
                    recipe={favoritedRecipe}
                    variant={variant}
                    size={size}
                    showQuickActions={showQuickActions}
                    showAuthor={showAuthor}
                    showRating={showRating}
                    onClick={() => handleAction('Clicked: Homemade Pizza')}
                    onFavorite={() =>
                      handleAction('Unfavorited: Homemade Pizza')
                    }
                  />
                </ul>
              </div>

              {/* Quick Recipe */}
              <div>
                <h3 className="text-foreground mb-2 text-sm font-semibold">
                  Quick Recipe (No Cooking Time)
                </h3>
                <ul className="border-border rounded-lg border">
                  <RecipeListItem
                    recipe={quickRecipe}
                    variant={variant}
                    size={size}
                    showQuickActions={showQuickActions}
                    showAuthor={showAuthor}
                    showRating={showRating}
                    onClick={() => handleAction('Clicked: Greek Salad')}
                  />
                </ul>
              </div>

              {/* Owner Recipe with Edit/Delete */}
              <div>
                <h3 className="text-foreground mb-2 text-sm font-semibold">
                  Owner Recipe (Edit & Delete Actions)
                </h3>
                <ul className="border-border rounded-lg border">
                  <RecipeListItem
                    recipe={sampleRecipe}
                    variant={variant}
                    size={size}
                    showQuickActions={showQuickActions}
                    showAuthor={showAuthor}
                    showRating={showRating}
                    isOwner
                    onClick={() =>
                      handleAction('Clicked: Chocolate Chip Cookies (Owner)')
                    }
                    onEdit={() => handleAction('Edit: Chocolate Chip Cookies')}
                    onDelete={() =>
                      handleAction('Delete: Chocolate Chip Cookies')
                    }
                  />
                </ul>
              </div>

              {/* Multiple Items in List */}
              <div>
                <h3 className="text-foreground mb-2 text-sm font-semibold">
                  Multiple Items in List
                </h3>
                <ul className="border-border divide-border divide-y rounded-lg border">
                  <RecipeListItem
                    recipe={sampleRecipe}
                    variant={variant}
                    size={size}
                    showQuickActions={showQuickActions}
                    showAuthor={showAuthor}
                    showRating={showRating}
                    onClick={() => handleAction('Clicked: Recipe 1')}
                  />
                  <RecipeListItem
                    recipe={favoritedRecipe}
                    variant={variant}
                    size={size}
                    showQuickActions={showQuickActions}
                    showAuthor={showAuthor}
                    showRating={showRating}
                    onClick={() => handleAction('Clicked: Recipe 2')}
                  />
                  <RecipeListItem
                    recipe={quickRecipe}
                    variant={variant}
                    size={size}
                    showQuickActions={showQuickActions}
                    showAuthor={showAuthor}
                    showRating={showRating}
                    onClick={() => handleAction('Clicked: Recipe 3')}
                  />
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Accessibility Notes */}
        <Card size="lg">
          <CardHeader>
            <CardTitle>Accessibility Features</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-muted-foreground space-y-2 text-sm">
              <li>
                ✓ Semantic HTML with proper list structure (<code>ul</code> and{' '}
                <code>li</code>)
              </li>
              <li>✓ Keyboard navigation support (Tab, Enter, Space)</li>
              <li>
                ✓ ARIA labels for interactive elements when onClick is provided
              </li>
              <li>✓ Screen reader friendly with meaningful labels</li>
              <li>✓ Focus indicators for keyboard users</li>
              <li>✓ Proper heading hierarchy in recipe metadata</li>
              <li>✓ Alternative text for images</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
