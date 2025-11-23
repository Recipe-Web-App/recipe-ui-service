'use client';

import React, { useState } from 'react';
import { RecipeQuickActions } from '@/components/recipe/RecipeQuickActions';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { DifficultyLevel } from '@/types/recipe-management/common';
import type { RecipeCardRecipe } from '@/types/ui/recipe-card';
import { useToastStore } from '@/stores/ui/toast-store';
import { Info } from 'lucide-react';

// Sample recipe data
const sampleRecipe: RecipeCardRecipe = {
  recipeId: 1,
  title: 'Chocolate Chip Cookies',
  description: 'Classic soft and chewy cookies with chocolate chips',
  imageUrl:
    'https://via.placeholder.com/400x300/4a5568/ffffff?text=Chocolate+Chip+Cookies',
  servings: 24,
  preparationTime: 15,
  cookingTime: 12,
  difficulty: DifficultyLevel.EASY,
  rating: 4.5,
  reviewCount: 128,
  isFavorite: false,
  createdAt: '2024-01-01T10:00:00Z',
};

const favoritedRecipe: RecipeCardRecipe = {
  ...sampleRecipe,
  recipeId: 2,
  title: 'Pasta Carbonara',
  description: 'Authentic Italian pasta dish',
  isFavorite: true,
};

export default function RecipeQuickActionsDemo() {
  const { addSuccessToast } = useToastStore();
  const [lastAction, setLastAction] = useState<string>('None');

  // Custom handler that tracks actions
  const createHandler = (actionName: string) => (recipe: RecipeCardRecipe) => {
    setLastAction(`${actionName}: ${recipe.title} (ID: ${recipe.recipeId})`);
    addSuccessToast(`${actionName} action clicked for: ${recipe.title}`);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div>
        <h1 className="mb-2 text-4xl font-bold">RecipeQuickActions</h1>
        <p className="text-muted-foreground text-lg">
          Recipe-specific quick action buttons that appear on hover/focus,
          providing favorite, share, add to collection, and quick view actions.
        </p>
      </div>

      {/* Placeholder Notice */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Placeholder Implementations</AlertTitle>
        <AlertDescription>
          Some actions use placeholder implementations:
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
            <li>
              <strong>Favorite/Unfavorite:</strong> Shows &quot;Coming
              Soon&quot; toast (will use useFavoriteRecipe hook when API is
              ready)
            </li>
            <li>
              <strong>Add to Collection:</strong> Shows &quot;Coming Soon&quot;
              toast (will use collection API when available)
            </li>
            <li>
              <strong>Share:</strong> Opens working modal with copy link feature
            </li>
            <li>
              <strong>Quick View:</strong> Opens working modal with recipe
              preview
            </li>
          </ul>
        </AlertDescription>
      </Alert>

      {/* Status */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2">
            <Badge variant="default">Last Action:</Badge>
            <span className="font-mono text-sm">{lastAction}</span>
          </div>
        </CardContent>
      </Card>

      {/* Basic Examples */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-1 text-2xl font-semibold">Basic Examples</h2>
          <p className="text-muted-foreground">
            Hover over the cards to see quick actions appear
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Default (Not Favorited) */}
          <Card>
            <CardHeader>
              <CardTitle>Not Favorited</CardTitle>
              <CardDescription>
                Default state - shows &quot;Favorite&quot; action
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="group border-border relative h-64 rounded-lg border bg-gradient-to-br from-gray-50 to-gray-100 p-4 dark:from-gray-900 dark:to-gray-800">
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <h3 className="text-xl font-semibold">
                    {sampleRecipe.title}
                  </h3>
                  <p className="text-muted-foreground mt-2 text-sm">
                    Hover to see quick actions in top-right corner
                  </p>
                </div>
                <RecipeQuickActions recipe={sampleRecipe} />
              </div>
            </CardContent>
          </Card>

          {/* Favorited */}
          <Card>
            <CardHeader>
              <CardTitle>Favorited</CardTitle>
              <CardDescription>
                Favorited state - shows &quot;Unfavorite&quot; action
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="group border-border relative h-64 rounded-lg border bg-gradient-to-br from-orange-50 to-red-50 p-4 dark:from-orange-950 dark:to-red-950">
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <h3 className="text-xl font-semibold">
                    {favoritedRecipe.title}
                  </h3>
                  <p className="text-muted-foreground mt-2 text-sm">
                    Favorited - action label changes
                  </p>
                </div>
                <RecipeQuickActions recipe={favoritedRecipe} />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Sizes */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-1 text-2xl font-semibold">Sizes</h2>
          <p className="text-muted-foreground">
            Different sizes for different card layouts
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Small */}
          <Card>
            <CardHeader>
              <CardTitle>Small (sm)</CardTitle>
              <CardDescription>Compact cards</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="group border-border relative h-48 rounded-lg border bg-gradient-to-br from-blue-50 to-blue-100 p-3 dark:from-blue-950 dark:to-blue-900">
                <div className="flex h-full items-center justify-center">
                  <p className="text-sm">Hover me</p>
                </div>
                <RecipeQuickActions recipe={sampleRecipe} size="sm" />
              </div>
            </CardContent>
          </Card>

          {/* Medium */}
          <Card>
            <CardHeader>
              <CardTitle>Medium (md)</CardTitle>
              <CardDescription>Default size</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="group border-border relative h-48 rounded-lg border bg-gradient-to-br from-green-50 to-green-100 p-4 dark:from-green-950 dark:to-green-900">
                <div className="flex h-full items-center justify-center">
                  <p className="text-sm">Hover me</p>
                </div>
                <RecipeQuickActions recipe={sampleRecipe} size="md" />
              </div>
            </CardContent>
          </Card>

          {/* Large */}
          <Card>
            <CardHeader>
              <CardTitle>Large (lg)</CardTitle>
              <CardDescription>Hero cards</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="group border-border relative h-48 rounded-lg border bg-gradient-to-br from-purple-50 to-purple-100 p-4 dark:from-purple-950 dark:to-purple-900">
                <div className="flex h-full items-center justify-center">
                  <p className="text-sm">Hover me</p>
                </div>
                <RecipeQuickActions recipe={sampleRecipe} size="lg" />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Positions */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-1 text-2xl font-semibold">Positions</h2>
          <p className="text-muted-foreground">
            Quick actions can appear in any corner
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {(
            ['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const
          ).map(position => (
            <Card key={position}>
              <CardHeader>
                <CardTitle className="capitalize">
                  {position.replace('-', ' ')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="group border-border relative h-48 rounded-lg border bg-gradient-to-br from-gray-50 to-gray-100 p-4 dark:from-gray-900 dark:to-gray-800">
                  <div className="flex h-full items-center justify-center">
                    <p className="text-muted-foreground text-xs">{position}</p>
                  </div>
                  <RecipeQuickActions
                    recipe={sampleRecipe}
                    position={position}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Custom Handlers */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-1 text-2xl font-semibold">Custom Handlers</h2>
          <p className="text-muted-foreground">
            Override default behavior with custom handlers
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>With Custom Handlers</CardTitle>
            <CardDescription>
              Custom handlers show toast notifications instead of default
              behavior
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="group border-border relative h-64 rounded-lg border bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 dark:from-indigo-950 dark:to-indigo-900">
              <div className="flex h-full flex-col items-center justify-center text-center">
                <h3 className="text-xl font-semibold">{sampleRecipe.title}</h3>
                <p className="text-muted-foreground mt-2 text-sm">
                  All actions show success toasts
                </p>
              </div>
              <RecipeQuickActions
                recipe={sampleRecipe}
                handlers={{
                  onFavorite: createHandler('Favorite'),
                  onShare: createHandler('Share'),
                  onAddToCollection: createHandler('Add to Collection'),
                  onQuickView: createHandler('Quick View'),
                }}
              />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Max Visible */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-1 text-2xl font-semibold">Max Visible Actions</h2>
          <p className="text-muted-foreground">
            Control how many actions are visible before overflow menu
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Max 2 */}
          <Card>
            <CardHeader>
              <CardTitle>Max 2 Visible</CardTitle>
              <CardDescription>
                First 2 actions visible, rest in overflow menu
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="group border-border relative h-48 rounded-lg border bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 dark:from-yellow-950 dark:to-yellow-900">
                <div className="flex h-full items-center justify-center">
                  <p className="text-sm">Check the overflow menu</p>
                </div>
                <RecipeQuickActions recipe={sampleRecipe} maxVisible={2} />
              </div>
            </CardContent>
          </Card>

          {/* Max 4 */}
          <Card>
            <CardHeader>
              <CardTitle>Max 4 Visible</CardTitle>
              <CardDescription>All actions visible (4 total)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="group border-border relative h-48 rounded-lg border bg-gradient-to-br from-pink-50 to-pink-100 p-4 dark:from-pink-950 dark:to-pink-900">
                <div className="flex h-full items-center justify-center">
                  <p className="text-sm">All actions visible</p>
                </div>
                <RecipeQuickActions recipe={sampleRecipe} maxVisible={4} />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Usage Examples */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-1 text-2xl font-semibold">Code Examples</h2>
          <p className="text-muted-foreground">
            How to use RecipeQuickActions in your code
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Basic Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted overflow-x-auto rounded-lg p-4 text-sm">
              <code>{`import { RecipeQuickActions } from '@/components/recipe/RecipeQuickActions';

// In your RecipeCard component
<div className="group relative">
  {/* Your recipe card content */}
  <RecipeQuickActions
    recipe={recipe}
    position="top-right"
    size="md"
  />
</div>`}</code>
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>With Custom Handlers</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted overflow-x-auto rounded-lg p-4 text-sm">
              <code>{`<RecipeQuickActions
  recipe={recipe}
  handlers={{
    onFavorite: (recipe) => {
      // Custom favorite logic
      favoriteRecipe(recipe.recipeId);
    },
    onShare: (recipe) => {
      // Custom share logic
      navigator.share({
        title: recipe.title,
        url: \`/recipes/\${recipe.recipeId}\`
      });
    },
  }}
/>`}</code>
            </pre>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
