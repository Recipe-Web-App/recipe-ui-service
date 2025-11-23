'use client';

import React, { useState } from 'react';
import { RecipeMenu } from '@/components/recipe/RecipeMenu';
import { RecipeCard } from '@/components/recipe/RecipeCard';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DifficultyLevel } from '@/types/recipe-management/common';
import type { RecipeDto } from '@/types/recipe-management/recipe';
import { useToastStore } from '@/stores/ui/toast-store';

// Sample recipe data
const sampleRecipe: RecipeDto = {
  recipeId: 1,
  userId: 'user-123',
  title: 'Chocolate Chip Cookies',
  description: 'Classic soft and chewy cookies with chocolate chips',
  servings: 24,
  preparationTime: 15,
  cookingTime: 12,
  difficulty: DifficultyLevel.EASY,
  createdAt: '2024-01-01T10:00:00Z',
  tags: [
    { tagId: 1, name: 'Dessert', category: 'meal-type' },
    { tagId: 2, name: 'Baking', category: 'method' },
  ],
};

export default function RecipeMenuDemo() {
  const { addSuccessToast } = useToastStore();
  const [lastAction, setLastAction] = useState<string>('None');

  // Action handlers
  const createHandler = (actionName: string) => () => {
    setLastAction(actionName);
    addSuccessToast(`${actionName} action clicked`);
  };

  const handlers = {
    onView: createHandler('View'),
    onEdit: createHandler('Edit'),
    onDelete: createHandler('Delete'),
    onDuplicate: createHandler('Duplicate'),
    onShare: createHandler('Share'),
    onAddToCollection: createHandler('Add to Collection'),
    onCopyLink: createHandler('Copy Link'),
    onAddToMealPlan: createHandler('Add to Meal Plan'),
    onReport: createHandler('Report'),
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="mb-2 text-4xl font-bold">RecipeMenu</h1>
        <p className="text-muted-foreground text-lg">
          A standalone contextual menu component for recipe-specific actions
          with ownership-based permissions.
        </p>
      </div>

      {/* Status */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2">
            <Badge variant="default">Last Action:</Badge>
            <span className="font-mono text-sm">{lastAction}</span>
          </div>
        </CardContent>
      </Card>

      {/* Variants Section */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-1 text-2xl font-semibold">Variants</h2>
          <p className="text-muted-foreground">
            Different visual styles for the menu trigger button
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Default Variant</CardTitle>
              <CardDescription>Primary colored trigger button</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center py-8">
              <RecipeMenu
                recipe={sampleRecipe}
                variant="default"
                isOwner={true}
                {...handlers}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ghost Variant</CardTitle>
              <CardDescription>
                Subtle transparent trigger (default)
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center py-8">
              <RecipeMenu
                recipe={sampleRecipe}
                variant="ghost"
                isOwner={true}
                {...handlers}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Outline Variant</CardTitle>
              <CardDescription>Bordered trigger button</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center py-8">
              <RecipeMenu
                recipe={sampleRecipe}
                variant="outline"
                isOwner={true}
                {...handlers}
              />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Sizes Section */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-1 text-2xl font-semibold">Sizes</h2>
          <p className="text-muted-foreground">
            Different sizes for the menu trigger
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-around gap-8">
              <div className="flex flex-col items-center gap-2">
                <RecipeMenu
                  recipe={sampleRecipe}
                  size="sm"
                  isOwner={true}
                  {...handlers}
                />
                <span className="text-muted-foreground text-sm">Small</span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <RecipeMenu
                  recipe={sampleRecipe}
                  size="md"
                  isOwner={true}
                  {...handlers}
                />
                <span className="text-muted-foreground text-sm">
                  Medium (default)
                </span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <RecipeMenu
                  recipe={sampleRecipe}
                  size="lg"
                  isOwner={true}
                  {...handlers}
                />
                <span className="text-muted-foreground text-sm">Large</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Ownership States Section */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-1 text-2xl font-semibold">Ownership States</h2>
          <p className="text-muted-foreground">
            Different actions based on recipe ownership
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Owner Actions</CardTitle>
              <CardDescription>
                Actions available when user owns the recipe
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center py-4">
                <RecipeMenu
                  recipe={sampleRecipe}
                  isOwner={true}
                  {...handlers}
                />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Available actions:</p>
                <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
                  <li>View details</li>
                  <li>Edit</li>
                  <li>Duplicate</li>
                  <li>Share</li>
                  <li>Add to collection</li>
                  <li>Copy link</li>
                  <li>Add to meal plan</li>
                  <li className="text-destructive">Delete (destructive)</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Non-Owner Actions</CardTitle>
              <CardDescription>
                Actions available for recipes owned by others
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center py-4">
                <RecipeMenu
                  recipe={sampleRecipe}
                  isOwner={false}
                  {...handlers}
                />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Available actions:</p>
                <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
                  <li>View details</li>
                  <li>Share</li>
                  <li>Add to collection</li>
                  <li>Copy link</li>
                  <li>Add to meal plan</li>
                  <li className="text-destructive">Report (destructive)</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Icon Visibility Section */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-1 text-2xl font-semibold">Icon Visibility</h2>
          <p className="text-muted-foreground">
            Control whether icons are shown in menu items
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>With Icons</CardTitle>
              <CardDescription>
                Icons shown next to labels (default)
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center py-8">
              <RecipeMenu
                recipe={sampleRecipe}
                showIcons={true}
                isOwner={true}
                {...handlers}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Without Icons</CardTitle>
              <CardDescription>Text labels only</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center py-8">
              <RecipeMenu
                recipe={sampleRecipe}
                showIcons={false}
                isOwner={true}
                {...handlers}
              />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* States Section */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-1 text-2xl font-semibold">States</h2>
          <p className="text-muted-foreground">
            Different states of the menu component
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Enabled</CardTitle>
              <CardDescription>Normal interactive state</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center py-8">
              <RecipeMenu
                recipe={sampleRecipe}
                disabled={false}
                isOwner={true}
                {...handlers}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Disabled</CardTitle>
              <CardDescription>Non-interactive state</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center py-8">
              <RecipeMenu
                recipe={sampleRecipe}
                disabled={true}
                isOwner={true}
                {...handlers}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Partial Actions</CardTitle>
              <CardDescription>Only some handlers provided</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center py-8">
              <RecipeMenu
                recipe={sampleRecipe}
                isOwner={true}
                onView={handlers.onView}
                onEdit={handlers.onEdit}
                onDelete={handlers.onDelete}
              />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Integration Section */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-1 text-2xl font-semibold">Integration Example</h2>
          <p className="text-muted-foreground">
            RecipeMenu integrated with RecipeCard
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="mx-auto max-w-sm">
              <RecipeCard
                recipe={{
                  ...sampleRecipe,
                  imageUrl: undefined,
                  rating: 4.5,
                  reviewCount: 128,
                  author: {
                    id: 'user-123',
                    name: 'Jane Doe',
                    avatar: undefined,
                  },
                  isFavorite: false,
                }}
                variant="elevated"
                size="default"
                isOwner={true}
                {...handlers}
              />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Alignment & Positioning Section */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-1 text-2xl font-semibold">
            Alignment & Positioning
          </h2>
          <p className="text-muted-foreground">
            Control menu alignment and side positioning
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              <div className="flex flex-col items-center gap-2">
                <RecipeMenu
                  recipe={sampleRecipe}
                  align="start"
                  side="bottom"
                  isOwner={true}
                  {...handlers}
                />
                <span className="text-muted-foreground text-sm">
                  Start / Bottom
                </span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <RecipeMenu
                  recipe={sampleRecipe}
                  align="center"
                  side="bottom"
                  isOwner={true}
                  {...handlers}
                />
                <span className="text-muted-foreground text-sm">
                  Center / Bottom
                </span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <RecipeMenu
                  recipe={sampleRecipe}
                  align="end"
                  side="bottom"
                  isOwner={true}
                  {...handlers}
                />
                <span className="text-muted-foreground text-sm">
                  End / Bottom (default)
                </span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <RecipeMenu
                  recipe={sampleRecipe}
                  align="end"
                  side="top"
                  isOwner={true}
                  {...handlers}
                />
                <span className="text-muted-foreground text-sm">End / Top</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Props Documentation */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-1 text-2xl font-semibold">Props</h2>
          <p className="text-muted-foreground">
            Component props and configuration options
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-2 text-left">Prop</th>
                    <th className="px-4 py-2 text-left">Type</th>
                    <th className="px-4 py-2 text-left">Default</th>
                    <th className="px-4 py-2 text-left">Description</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b">
                    <td className="px-4 py-2 font-mono">recipe</td>
                    <td className="px-4 py-2">RecipeDto</td>
                    <td className="px-4 py-2">-</td>
                    <td className="px-4 py-2">Recipe data (required)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 font-mono">isOwner</td>
                    <td className="px-4 py-2">boolean</td>
                    <td className="px-4 py-2">false</td>
                    <td className="px-4 py-2">Whether user owns the recipe</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 font-mono">variant</td>
                    <td className="px-4 py-2">
                      &apos;default&apos; | &apos;ghost&apos; |
                      &apos;outline&apos;
                    </td>
                    <td className="px-4 py-2">&apos;ghost&apos;</td>
                    <td className="px-4 py-2">Trigger button style</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 font-mono">size</td>
                    <td className="px-4 py-2">
                      &apos;sm&apos; | &apos;md&apos; | &apos;lg&apos;
                    </td>
                    <td className="px-4 py-2">&apos;md&apos;</td>
                    <td className="px-4 py-2">Menu size</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 font-mono">showIcons</td>
                    <td className="px-4 py-2">boolean</td>
                    <td className="px-4 py-2">true</td>
                    <td className="px-4 py-2">Show icons in menu items</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 font-mono">disabled</td>
                    <td className="px-4 py-2">boolean</td>
                    <td className="px-4 py-2">false</td>
                    <td className="px-4 py-2">Disable the menu</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 font-mono">align</td>
                    <td className="px-4 py-2">
                      &apos;start&apos; | &apos;center&apos; | &apos;end&apos;
                    </td>
                    <td className="px-4 py-2">&apos;end&apos;</td>
                    <td className="px-4 py-2">Menu alignment</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-mono">on[Action]</td>
                    <td className="px-4 py-2">() =&gt; void</td>
                    <td className="px-4 py-2">undefined</td>
                    <td className="px-4 py-2">
                      Action handlers (View, Edit, Delete, etc.)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
