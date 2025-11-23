'use client';

import * as React from 'react';
import {
  MealPlanCard,
  MealPlanCardSkeleton,
} from '@/components/meal-plan/MealPlanCard';
import type { MealPlanCardMealPlan } from '@/types/ui/meal-plan-card';
import type { MealPlanQuickActionHandlers } from '@/types/meal-plan/quick-actions';
import type { MealPlanMenuActionHandlers } from '@/types/meal-plan/menu';

export default function MealPlanCardDemo() {
  // Sample meal plans with different configurations

  // Current meal plan (today is within date range)
  const currentMealPlan: MealPlanCardMealPlan = {
    id: 'mp-1',
    userId: 'user-123',
    name: 'Healthy January Week 1',
    description:
      'A balanced meal plan focused on whole foods and lean proteins to start the new year right.',
    startDate: '2025-11-18', // Started 2 days ago
    endDate: '2025-11-24', // Ends in 4 days
    isActive: true,
    recipeCount: 21,
    durationDays: 7,
    createdAt: '2025-11-15T00:00:00Z',
    updatedAt: '2025-11-18T00:00:00Z',
    ownerName: 'Sarah Johnson',
    ownerAvatar: 'https://i.pravatar.cc/150?img=1',
    isFavorited: true,
    recipeImages: [
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
      'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400',
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
      'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400',
    ],
    mealTypeBreakdown: {
      breakfast: 7,
      lunch: 7,
      dinner: 7,
    },
  };

  // Upcoming meal plan (starts in the future)
  const upcomingMealPlan: MealPlanCardMealPlan = {
    id: 'mp-2',
    userId: 'user-123',
    name: 'Mediterranean Week',
    description:
      'Explore the flavors of the Mediterranean with fresh vegetables, olive oil, and seafood.',
    startDate: '2025-11-25', // Starts in 5 days
    endDate: '2025-12-01',
    isActive: false,
    recipeCount: 24,
    durationDays: 7,
    createdAt: '2025-11-10T00:00:00Z',
    updatedAt: '2025-11-15T00:00:00Z',
    ownerName: 'Sarah Johnson',
    ownerAvatar: 'https://i.pravatar.cc/150?img=1',
    isFavorited: false,
    recipeImages: [
      'https://images.unsplash.com/photo-1595295333158-4742f28fbd85?w=400',
      'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400',
      'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400',
      'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400',
    ],
    mealTypeBreakdown: {
      breakfast: 7,
      lunch: 7,
      dinner: 7,
      snack: 3,
    },
  };

  // Completed meal plan (date range in the past)
  const completedMealPlan: MealPlanCardMealPlan = {
    id: 'mp-3',
    userId: 'user-456',
    name: 'Holiday Feast Week',
    description:
      'Delicious comfort food and festive recipes for the holiday season.',
    startDate: '2025-11-01',
    endDate: '2025-11-07',
    isActive: false,
    recipeCount: 28,
    durationDays: 7,
    createdAt: '2025-10-25T00:00:00Z',
    updatedAt: '2025-11-07T00:00:00Z',
    ownerName: 'Michael Chen',
    ownerAvatar: 'https://i.pravatar.cc/150?img=12',
    isFavorited: true,
    recipeImages: [
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400',
      'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400',
      'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400',
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400',
    ],
    mealTypeBreakdown: {
      breakfast: 7,
      lunch: 7,
      dinner: 7,
      dessert: 7,
    },
  };

  // Meal plan with minimal data (no images, short duration)
  const minimalMealPlan: MealPlanCardMealPlan = {
    id: 'mp-4',
    userId: 'user-789',
    name: 'Quick 3-Day Reset',
    description: undefined,
    startDate: '2025-11-22',
    endDate: '2025-11-24',
    isActive: false,
    recipeCount: 9,
    durationDays: 3,
    createdAt: '2025-11-20T00:00:00Z',
    updatedAt: '2025-11-20T00:00:00Z',
    ownerName: 'Emily Davis',
    ownerAvatar: undefined,
    isFavorited: false,
    recipeImages: [],
    mealTypeBreakdown: {
      breakfast: 3,
      lunch: 3,
      dinner: 3,
    },
  };

  // Meal plan with many meal types
  const complexMealPlan: MealPlanCardMealPlan = {
    id: 'mp-5',
    userId: 'user-123',
    name: 'Complete Nutrition Plan',
    description:
      'A comprehensive meal plan with all meal types including snacks and desserts for balanced nutrition.',
    startDate: '2025-11-18',
    endDate: '2025-11-24',
    isActive: true,
    recipeCount: 35,
    durationDays: 7,
    createdAt: '2025-11-15T00:00:00Z',
    updatedAt: '2025-11-18T00:00:00Z',
    ownerName: 'Alex Rodriguez',
    ownerAvatar: 'https://i.pravatar.cc/150?img=33',
    isFavorited: false,
    recipeImages: [
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
      'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400',
      'https://images.unsplash.com/photo-1511910849309-0dffb8785146?w=400',
      'https://images.unsplash.com/photo-1547592180-85f173990554?w=400',
    ],
    mealTypeBreakdown: {
      breakfast: 7,
      lunch: 7,
      dinner: 7,
      snack: 7,
      dessert: 7,
    },
  };

  // Mock handlers for quick actions
  const createQuickActionHandlers = (
    mealPlanId: string
  ): MealPlanQuickActionHandlers => ({
    onFavorite: () => {
      console.log(`Favorite meal plan ${mealPlanId}`);
      alert(`Favorited meal plan ${mealPlanId}`);
    },
    onShare: () => {
      console.log(`Share meal plan ${mealPlanId}`);
      alert(`Share meal plan ${mealPlanId}`);
    },
    onClone: () => {
      console.log(`Clone meal plan ${mealPlanId}`);
      alert(`Cloned meal plan ${mealPlanId}`);
    },
    onQuickView: () => {
      console.log(`Quick view meal plan ${mealPlanId}`);
      alert(`Quick view meal plan ${mealPlanId}`);
    },
    onGenerateShoppingList: () => {
      console.log(`Generate shopping list for meal plan ${mealPlanId}`);
      alert(`Generating shopping list for meal plan ${mealPlanId}`);
    },
    onViewCalendar: () => {
      console.log(`View calendar for meal plan ${mealPlanId}`);
      alert(`Viewing calendar for meal plan ${mealPlanId}`);
    },
  });

  // Mock handlers for menu actions
  const createMenuActionHandlers = (
    mealPlanId: string
  ): MealPlanMenuActionHandlers => ({
    onView: () => {
      console.log(`View meal plan ${mealPlanId}`);
      alert(`View meal plan ${mealPlanId}`);
    },
    onEdit: () => {
      console.log(`Edit meal plan ${mealPlanId}`);
      alert(`Edit meal plan ${mealPlanId}`);
    },
    onDelete: () => {
      console.log(`Delete meal plan ${mealPlanId}`);
      if (confirm(`Are you sure you want to delete meal plan ${mealPlanId}?`)) {
        alert(`Deleted meal plan ${mealPlanId}`);
      }
    },
    onDuplicate: () => {
      console.log(`Duplicate meal plan ${mealPlanId}`);
      alert(`Duplicated meal plan ${mealPlanId}`);
    },
    onShare: () => {
      console.log(`Share meal plan ${mealPlanId}`);
      alert(`Share meal plan ${mealPlanId}`);
    },
    onGenerateShoppingList: () => {
      console.log(`Generate shopping list for meal plan ${mealPlanId}`);
      alert(`Generate shopping list for meal plan ${mealPlanId}`);
    },
  });

  // Card click handler
  const handleCardClick = (mealPlanId: string) => {
    console.log(`Clicked meal plan card ${mealPlanId}`);
    alert(`Viewing meal plan ${mealPlanId}`);
  };

  return (
    <div className="container mx-auto space-y-8 py-8">
      <header className="mb-8">
        <h1 className="mb-2 text-4xl font-bold">MealPlanCard Component</h1>
        <p className="text-muted-foreground">
          A card component for displaying meal plans with a 2x2 recipe image
          mosaic, status badges, meal type breakdown, quick actions, and menu
          options.
        </p>
      </header>

      {/* Basic Usage */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Basic Usage</h2>
        <p className="text-muted-foreground">
          Simple meal plan cards with basic information showing different
          statuses
        </p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <MealPlanCard mealPlan={currentMealPlan} />
          <MealPlanCard mealPlan={upcomingMealPlan} />
          <MealPlanCard mealPlan={completedMealPlan} />
        </div>
      </section>

      {/* With Click Handler */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Interactive Cards</h2>
        <p className="text-muted-foreground">
          Cards with onClick handlers - click to view details
        </p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <MealPlanCard
            mealPlan={currentMealPlan}
            onClick={handleCardClick}
            variant="interactive"
          />
          <MealPlanCard
            mealPlan={upcomingMealPlan}
            onClick={handleCardClick}
            variant="interactive"
          />
        </div>
      </section>

      {/* With Quick Actions */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">With Quick Actions</h2>
        <p className="text-muted-foreground">
          Hover over cards to see quick action buttons (Favorite, Share, Clone,
          Quick View, Shopping List, Calendar)
        </p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <MealPlanCard
            mealPlan={currentMealPlan}
            quickActionHandlers={createQuickActionHandlers(currentMealPlan.id)}
          />
          <MealPlanCard
            mealPlan={upcomingMealPlan}
            quickActionHandlers={createQuickActionHandlers(upcomingMealPlan.id)}
          />
        </div>
      </section>

      {/* With Menu */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">With Menu Actions</h2>
        <p className="text-muted-foreground">
          Click the three-dot menu for more options (owner vs non-owner actions)
        </p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <div className="text-sm font-medium">Owner Actions</div>
            <MealPlanCard
              mealPlan={currentMealPlan}
              menuActionHandlers={createMenuActionHandlers(currentMealPlan.id)}
              isOwner
            />
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium">Non-Owner Actions</div>
            <MealPlanCard
              mealPlan={completedMealPlan}
              menuActionHandlers={createMenuActionHandlers(
                completedMealPlan.id
              )}
              isOwner={false}
            />
          </div>
        </div>
      </section>

      {/* Full Features */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Full-Featured Cards</h2>
        <p className="text-muted-foreground">
          Cards with both quick actions and menu (hover and click menu icon)
        </p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <MealPlanCard
            mealPlan={currentMealPlan}
            quickActionHandlers={createQuickActionHandlers(currentMealPlan.id)}
            menuActionHandlers={createMenuActionHandlers(currentMealPlan.id)}
            onClick={handleCardClick}
            isOwner
          />
          <MealPlanCard
            mealPlan={upcomingMealPlan}
            quickActionHandlers={createQuickActionHandlers(upcomingMealPlan.id)}
            menuActionHandlers={createMenuActionHandlers(upcomingMealPlan.id)}
            onClick={handleCardClick}
            isOwner
          />
          <MealPlanCard
            mealPlan={completedMealPlan}
            quickActionHandlers={createQuickActionHandlers(
              completedMealPlan.id
            )}
            menuActionHandlers={createMenuActionHandlers(completedMealPlan.id)}
            onClick={handleCardClick}
            isOwner={false}
          />
        </div>
      </section>

      {/* Variants */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Variants</h2>
        <p className="text-muted-foreground">
          Different visual styles for various use cases
        </p>
        <div className="space-y-6">
          <div>
            <h3 className="mb-2 font-semibold">Default</h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <MealPlanCard mealPlan={currentMealPlan} variant="default" />
            </div>
          </div>
          <div>
            <h3 className="mb-2 font-semibold">Elevated</h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <MealPlanCard mealPlan={currentMealPlan} variant="elevated" />
            </div>
          </div>
          <div>
            <h3 className="mb-2 font-semibold">Outlined</h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <MealPlanCard mealPlan={currentMealPlan} variant="outlined" />
            </div>
          </div>
          <div>
            <h3 className="mb-2 font-semibold">Ghost</h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <MealPlanCard mealPlan={currentMealPlan} variant="ghost" />
            </div>
          </div>
          <div>
            <h3 className="mb-2 font-semibold">Interactive (clickable)</h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <MealPlanCard
                mealPlan={currentMealPlan}
                variant="interactive"
                onClick={handleCardClick}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Sizes */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Sizes</h2>
        <p className="text-muted-foreground">Different size options</p>
        <div className="space-y-6">
          <div>
            <h3 className="mb-2 font-semibold">Small</h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <MealPlanCard mealPlan={currentMealPlan} size="sm" />
              <MealPlanCard mealPlan={upcomingMealPlan} size="sm" />
            </div>
          </div>
          <div>
            <h3 className="mb-2 font-semibold">Default</h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <MealPlanCard mealPlan={currentMealPlan} size="default" />
              <MealPlanCard mealPlan={upcomingMealPlan} size="default" />
            </div>
          </div>
          <div>
            <h3 className="mb-2 font-semibold">Large</h3>
            <div className="grid gap-6 md:grid-cols-2">
              <MealPlanCard mealPlan={currentMealPlan} size="lg" />
              <MealPlanCard mealPlan={upcomingMealPlan} size="lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Status Examples */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Status Badges</h2>
        <p className="text-muted-foreground">
          Meal plans show different status badges based on their date range
        </p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <div className="text-sm font-medium text-green-600">
              Current (in progress)
            </div>
            <MealPlanCard mealPlan={currentMealPlan} />
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium text-blue-600">
              Upcoming (future)
            </div>
            <MealPlanCard mealPlan={upcomingMealPlan} />
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-600">
              Completed (past)
            </div>
            <MealPlanCard mealPlan={completedMealPlan} />
          </div>
        </div>
      </section>

      {/* Meal Type Breakdown */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Meal Type Breakdown</h2>
        <p className="text-muted-foreground">
          Cards display meal type breakdown badges (B=Breakfast, L=Lunch,
          D=Dinner, S=Snack, Ds=Dessert)
        </p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <div className="text-sm font-medium">Basic (7B · 7L · 7D)</div>
            <MealPlanCard mealPlan={currentMealPlan} />
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium">
              With Snacks (7B · 7L · 7D · 3S)
            </div>
            <MealPlanCard mealPlan={upcomingMealPlan} />
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium">
              Complete (7B · 7L · 7D · 7S · 7Ds)
            </div>
            <MealPlanCard mealPlan={complexMealPlan} />
          </div>
        </div>
      </section>

      {/* Edge Cases */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Edge Cases</h2>
        <p className="text-muted-foreground">
          Handling meal plans with minimal or no data
        </p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <MealPlanCard mealPlan={minimalMealPlan} />
          <MealPlanCard
            mealPlan={{
              ...currentMealPlan,
              description: undefined,
            }}
          />
          <MealPlanCard
            mealPlan={{
              ...currentMealPlan,
              name: 'Meal Plan With a Very Long Name That Should Be Handled Gracefully',
              description:
                'This is a meal plan with an extremely long description that should wrap properly and not break the card layout. It contains a lot of text to demonstrate how the card handles overflow content and maintains a good user experience.',
            }}
          />
        </div>
      </section>

      {/* Loading State */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Loading State</h2>
        <p className="text-muted-foreground">
          Skeleton loaders for meal plans being loaded
        </p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <MealPlanCardSkeleton />
          <MealPlanCardSkeleton />
          <MealPlanCardSkeleton />
        </div>
      </section>

      {/* Loading State Sizes */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Loading State Sizes</h2>
        <p className="text-muted-foreground">
          Skeleton loaders in different sizes
        </p>
        <div className="space-y-6">
          <div>
            <h3 className="mb-2 font-semibold">Small Skeletons</h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <MealPlanCardSkeleton size="sm" />
              <MealPlanCardSkeleton size="sm" />
            </div>
          </div>
          <div>
            <h3 className="mb-2 font-semibold">Default Skeletons</h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <MealPlanCardSkeleton size="default" />
              <MealPlanCardSkeleton size="default" />
            </div>
          </div>
          <div>
            <h3 className="mb-2 font-semibold">Large Skeletons</h3>
            <div className="grid gap-6 md:grid-cols-2">
              <MealPlanCardSkeleton size="lg" />
              <MealPlanCardSkeleton size="lg" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
