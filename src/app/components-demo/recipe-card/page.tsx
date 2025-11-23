'use client';

import React, { useState } from 'react';
import { RecipeCard } from '@/components/recipe/RecipeCard';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { DifficultyLevel } from '@/types/recipe-management/common';
import { type RecipeCardProps } from '@/types/ui/recipe-card';

// Sample recipe data
const sampleRecipe: RecipeCardProps['recipe'] = {
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
  author: {
    id: 'user-123',
    name: 'Jane Doe',
    avatar: 'https://i.pravatar.cc/150?u=jane',
    role: 'chef',
    verified: true,
    rating: 4.8,
    recipeCount: 45,
  },
};

const sampleRecipeNoImage: RecipeCardProps['recipe'] = {
  ...sampleRecipe,
  recipeId: 2,
  title: 'Simple Pasta Carbonara',
  imageUrl: undefined,
  difficulty: DifficultyLevel.MEDIUM,
};

const favoritedRecipe: RecipeCardProps['recipe'] = {
  ...sampleRecipe,
  recipeId: 3,
  title: 'Homemade Pizza',
  isFavorite: true,
  difficulty: DifficultyLevel.HARD,
};

export default function RecipeCardDemo() {
  const [clickCount, setClickCount] = useState(0);
  const [lastAction, setLastAction] = useState<string>('');
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [showMenu, setShowMenu] = useState(true);
  const [showAuthor, setShowAuthor] = useState(true);

  const handleAction = (action: string) => {
    setLastAction(action);
    setClickCount(prev => prev + 1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-foreground mb-2 text-3xl font-bold">
          RecipeCard Component
        </h1>
        <p className="text-muted-foreground text-lg">
          Recipe-specific card with metadata, author, quick actions, and menu.
          Built for the Recipe UI Service design system.
        </p>
      </div>

      <div className="space-y-8">
        {/* Interactive Controls */}
        <Card size="lg">
          <CardHeader>
            <CardTitle>Interactive Controls</CardTitle>
            <CardDescription>
              Test different RecipeCard features and track interactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 flex flex-wrap gap-4">
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
                  checked={showMenu}
                  onChange={e => setShowMenu(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Show Menu</span>
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
            </div>

            {lastAction && (
              <div className="bg-primary/10 text-primary mb-4 rounded-md p-3">
                <p className="text-sm">
                  Last action: <strong>{lastAction}</strong> (Total:{' '}
                  {clickCount})
                </p>
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <RecipeCard
                recipe={sampleRecipe}
                variant="elevated"
                showQuickActions={showQuickActions}
                showMenu={showMenu}
                showAuthor={showAuthor}
                onClick={() => handleAction('Card clicked')}
                onFavorite={() => handleAction('Favorited')}
                onShare={() => handleAction('Shared')}
                onAddToCollection={() => handleAction('Added to collection')}
                onQuickView={() => handleAction('Quick view')}
                onEdit={() => handleAction('Edit clicked')}
                onDelete={() => handleAction('Delete clicked')}
                onDuplicate={() => handleAction('Duplicate clicked')}
                isOwner={true}
              />
            </div>
          </CardContent>
        </Card>

        {/* Variants */}
        <div>
          <h2 className="text-foreground mb-4 text-2xl font-semibold">
            Card Variants
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="text-muted-foreground mb-2 text-sm">Default</p>
              <RecipeCard recipe={sampleRecipe} variant="default" />
            </div>
            <div>
              <p className="text-muted-foreground mb-2 text-sm">Elevated</p>
              <RecipeCard recipe={sampleRecipe} variant="elevated" />
            </div>
            <div>
              <p className="text-muted-foreground mb-2 text-sm">Outlined</p>
              <RecipeCard recipe={sampleRecipe} variant="outlined" />
            </div>
          </div>
        </div>

        {/* Sizes */}
        <div>
          <h2 className="text-foreground mb-4 text-2xl font-semibold">Sizes</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-muted-foreground mb-2 text-sm">Small</p>
              <RecipeCard recipe={sampleRecipe} size="sm" variant="elevated" />
            </div>
            <div>
              <p className="text-muted-foreground mb-2 text-sm">Default</p>
              <RecipeCard
                recipe={sampleRecipe}
                size="default"
                variant="elevated"
              />
            </div>
            <div>
              <p className="text-muted-foreground mb-2 text-sm">Large</p>
              <RecipeCard recipe={sampleRecipe} size="lg" variant="elevated" />
            </div>
          </div>
        </div>

        {/* States */}
        <div>
          <h2 className="text-foreground mb-4 text-2xl font-semibold">
            States
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-muted-foreground mb-2 text-sm">With Image</p>
              <RecipeCard recipe={sampleRecipe} variant="elevated" />
            </div>
            <div>
              <p className="text-muted-foreground mb-2 text-sm">
                Without Image
              </p>
              <RecipeCard recipe={sampleRecipeNoImage} variant="elevated" />
            </div>
            <div>
              <p className="text-muted-foreground mb-2 text-sm">Favorited</p>
              <RecipeCard recipe={favoritedRecipe} variant="elevated" />
            </div>
            <div>
              <p className="text-muted-foreground mb-2 text-sm">Loading</p>
              <RecipeCard
                recipe={sampleRecipe}
                variant="elevated"
                loading={true}
              />
            </div>
          </div>
        </div>

        {/* Different Difficulties */}
        <div>
          <h2 className="text-foreground mb-4 text-2xl font-semibold">
            Difficulty Levels
          </h2>
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
            <div>
              <p className="text-muted-foreground mb-2 text-sm">Beginner</p>
              <RecipeCard
                recipe={{
                  ...sampleRecipe,
                  difficulty: DifficultyLevel.BEGINNER,
                }}
                variant="elevated"
                size="sm"
              />
            </div>
            <div>
              <p className="text-muted-foreground mb-2 text-sm">Easy</p>
              <RecipeCard
                recipe={{ ...sampleRecipe, difficulty: DifficultyLevel.EASY }}
                variant="elevated"
                size="sm"
              />
            </div>
            <div>
              <p className="text-muted-foreground mb-2 text-sm">Medium</p>
              <RecipeCard
                recipe={{ ...sampleRecipe, difficulty: DifficultyLevel.MEDIUM }}
                variant="elevated"
                size="sm"
              />
            </div>
            <div>
              <p className="text-muted-foreground mb-2 text-sm">Hard</p>
              <RecipeCard
                recipe={{ ...sampleRecipe, difficulty: DifficultyLevel.HARD }}
                variant="elevated"
                size="sm"
              />
            </div>
            <div>
              <p className="text-muted-foreground mb-2 text-sm">Expert</p>
              <RecipeCard
                recipe={{ ...sampleRecipe, difficulty: DifficultyLevel.EXPERT }}
                variant="elevated"
                size="sm"
              />
            </div>
          </div>
        </div>

        {/* Responsive Grid */}
        <div>
          <h2 className="text-foreground mb-4 text-2xl font-semibold">
            Responsive Grid Layout
          </h2>
          <p className="text-muted-foreground mb-4 text-sm">
            4 columns on desktop, 3 on tablet, 2 on mobile
          </p>
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <RecipeCard
                key={i}
                recipe={{
                  ...sampleRecipe,
                  recipeId: i,
                  title: `Recipe ${i}`,
                }}
                variant="elevated"
                onFavorite={() => handleAction(`Recipe ${i} favorited`)}
              />
            ))}
          </div>
        </div>

        {/* Code Example */}
        <Card>
          <CardHeader>
            <CardTitle>Usage Example</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-muted-foreground bg-muted overflow-x-auto rounded-md p-4 text-sm">
              <code>{`import { RecipeCard } from '@/components/recipe/RecipeCard';
import { DifficultyLevel } from '@/types/recipe-management/common';

<RecipeCard
  recipe={{
    recipeId: 1,
    title: 'Chocolate Chip Cookies',
    description: 'Classic soft and chewy cookies',
    imageUrl: '/images/cookies.jpg',
    preparationTime: 15,
    cookingTime: 12,
    difficulty: DifficultyLevel.EASY,
    servings: 24,
    rating: 4.5,
    reviewCount: 128,
    author: {
      id: 'user-123',
      name: 'Jane Doe',
      role: 'chef',
      verified: true,
    },
  }}
  variant="elevated"
  size="default"
  showQuickActions={true}
  showMenu={true}
  showAuthor={true}
  isOwner={false}
  onClick={() => console.log('Card clicked')}
  onFavorite={() => console.log('Favorited')}
  onShare={() => console.log('Shared')}
/>`}</code>
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
