'use client';

import React, { useState } from 'react';
import { MealPlanQuickActions } from '@/components/meal-plan/MealPlanQuickActions';
import { MealPlanCard } from '@/components/meal-plan/MealPlanCard';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import type { MealPlanCardMealPlan } from '@/types/ui/meal-plan-card';
import type { MealPlanQuickActionHandlers } from '@/types/meal-plan/quick-actions';
import { useToastStore } from '@/stores/ui/toast-store';
import { Info } from 'lucide-react';

// Sample meal plan data
const currentMealPlan: MealPlanCardMealPlan = {
  id: 'mp-1',
  userId: 'user-123',
  name: 'Healthy January Week 1',
  description:
    'A balanced meal plan focused on whole foods and lean proteins to start the new year right.',
  startDate: '2025-11-18',
  endDate: '2025-11-24',
  isActive: true,
  recipeCount: 21,
  durationDays: 7,
  createdAt: '2025-11-15T00:00:00Z',
  updatedAt: '2025-11-18T00:00:00Z',
  ownerName: 'Sarah Johnson',
  ownerAvatar: 'https://i.pravatar.cc/150?img=1',
  isFavorited: false,
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

const favoritedMealPlan: MealPlanCardMealPlan = {
  id: 'mp-2',
  userId: 'user-123',
  name: 'Mediterranean Week',
  description:
    'Explore the flavors of the Mediterranean with fresh vegetables, olive oil, and seafood.',
  startDate: '2025-11-25',
  endDate: '2025-12-01',
  isActive: false,
  recipeCount: 24,
  durationDays: 7,
  createdAt: '2025-11-10T00:00:00Z',
  updatedAt: '2025-11-15T00:00:00Z',
  ownerName: 'Sarah Johnson',
  ownerAvatar: 'https://i.pravatar.cc/150?img=1',
  isFavorited: true,
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

export default function MealPlanQuickActionsDemo() {
  const { addSuccessToast } = useToastStore();
  const [lastAction, setLastAction] = useState<string>('None');

  // Custom handler that tracks actions
  const createHandler = (actionName: string) => (mealPlanId: string) => {
    const mealPlan =
      mealPlanId === currentMealPlan.id ? currentMealPlan : favoritedMealPlan;
    setLastAction(`${actionName}: ${mealPlan.name} (ID: ${mealPlanId})`);
    addSuccessToast(`${actionName} action clicked for: ${mealPlan.name}`);
  };

  const handlers: MealPlanQuickActionHandlers = {
    onFavorite: createHandler('Favorite'),
    onShare: createHandler('Share'),
    onClone: createHandler('Clone'),
    onQuickView: createHandler('Quick View'),
    onGenerateShoppingList: createHandler('Generate Shopping List'),
    onViewCalendar: createHandler('View Calendar'),
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div>
        <h1 className="mb-2 text-4xl font-bold">MealPlanQuickActions</h1>
        <p className="text-muted-foreground text-lg">
          Meal plan-specific quick action buttons that appear on hover/focus,
          providing favorite, share, clone, quick view, shopping list
          generation, and calendar view actions.
        </p>
      </div>

      {/* Info Notice */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>All Actions Available to Everyone</AlertTitle>
        <AlertDescription>
          Unlike menu actions, all quick actions are available to all users
          regardless of ownership:
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
            <li>
              <strong>Favorite/Unfavorite:</strong> Add or remove meal plan from
              favorites
            </li>
            <li>
              <strong>Share:</strong> Share meal plan with others
            </li>
            <li>
              <strong>Clone:</strong> Duplicate the meal plan
            </li>
            <li>
              <strong>Quick View:</strong> Preview meal plan details
            </li>
            <li>
              <strong>Shopping List:</strong> Generate shopping list from meal
              plan recipes
            </li>
            <li>
              <strong>View Calendar:</strong> View meal plan in calendar format
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
            Hover over the cards to see quick actions appear in the top-right
            corner
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Not Favorited */}
          <Card>
            <CardHeader>
              <CardTitle>Not Favorited</CardTitle>
              <CardDescription>
                Default state - shows filled heart icon
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="group border-border relative h-64 rounded-lg border bg-gradient-to-br from-blue-50 to-cyan-50 p-4 dark:from-blue-950 dark:to-cyan-950">
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <h3 className="text-xl font-semibold">
                    {currentMealPlan.name}
                  </h3>
                  <p className="text-muted-foreground mt-2 text-sm">
                    {currentMealPlan.recipeCount} recipes •{' '}
                    {currentMealPlan.durationDays} days
                  </p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    Hover to see quick actions
                  </p>
                </div>
                <MealPlanQuickActions
                  mealPlanId={currentMealPlan.id}
                  handlers={handlers}
                />
              </div>
            </CardContent>
          </Card>

          {/* Favorited */}
          <Card>
            <CardHeader>
              <CardTitle>Favorited</CardTitle>
              <CardDescription>
                Favorited state - different styling for favorite icon
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="group border-border relative h-64 rounded-lg border bg-gradient-to-br from-orange-50 to-red-50 p-4 dark:from-orange-950 dark:to-red-950">
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <h3 className="text-xl font-semibold">
                    {favoritedMealPlan.name}
                  </h3>
                  <p className="text-muted-foreground mt-2 text-sm">
                    {favoritedMealPlan.recipeCount} recipes •{' '}
                    {favoritedMealPlan.durationDays} days
                  </p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    Already favorited
                  </p>
                </div>
                <MealPlanQuickActions
                  mealPlanId={favoritedMealPlan.id}
                  handlers={handlers}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* All Actions Demo */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-1 text-2xl font-semibold">All Available Actions</h2>
          <p className="text-muted-foreground">
            Complete list of quick actions when all handlers are provided
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="group border-border relative h-80 rounded-lg border bg-gradient-to-br from-green-50 to-emerald-50 p-6 dark:from-green-950 dark:to-emerald-950">
              <div className="flex h-full flex-col items-center justify-center text-center">
                <h3 className="text-2xl font-semibold">
                  All Actions Available
                </h3>
                <p className="text-muted-foreground mt-4 max-w-md text-sm">
                  When all handlers are provided, all 6 quick actions will
                  appear:
                </p>
                <div className="text-muted-foreground mt-4 grid grid-cols-2 gap-x-8 gap-y-2 text-left text-sm">
                  <div>• Favorite</div>
                  <div>• Share</div>
                  <div>• Clone</div>
                  <div>• Quick View</div>
                  <div>• Shopping List</div>
                  <div>• View Calendar</div>
                </div>
              </div>
              <MealPlanQuickActions
                mealPlanId={currentMealPlan.id}
                handlers={handlers}
              />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Partial Actions */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-1 text-2xl font-semibold">Partial Actions</h2>
          <p className="text-muted-foreground">
            Only actions with provided handlers are shown
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Favorite Only</CardTitle>
              <CardDescription>Single action provided</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="group border-border relative h-48 rounded-lg border bg-gradient-to-br from-purple-50 to-pink-50 p-4 dark:from-purple-950 dark:to-pink-950">
                <div className="flex h-full items-center justify-center text-center">
                  <p className="text-muted-foreground text-sm">
                    Only Favorite action available
                  </p>
                </div>
                <MealPlanQuickActions
                  mealPlanId={currentMealPlan.id}
                  handlers={{
                    onFavorite: handlers.onFavorite,
                  }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Share & Clone</CardTitle>
              <CardDescription>Two actions provided</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="group border-border relative h-48 rounded-lg border bg-gradient-to-br from-indigo-50 to-blue-50 p-4 dark:from-indigo-950 dark:to-blue-950">
                <div className="flex h-full items-center justify-center text-center">
                  <p className="text-muted-foreground text-sm">
                    Share and Clone actions
                  </p>
                </div>
                <MealPlanQuickActions
                  mealPlanId={currentMealPlan.id}
                  handlers={{
                    onShare: handlers.onShare,
                    onClone: handlers.onClone,
                  }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Meal Plan Specific</CardTitle>
              <CardDescription>
                Shopping List & Calendar actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="group border-border relative h-48 rounded-lg border bg-gradient-to-br from-teal-50 to-green-50 p-4 dark:from-teal-950 dark:to-green-950">
                <div className="flex h-full items-center justify-center text-center">
                  <p className="text-muted-foreground text-sm">
                    Meal plan specific actions
                  </p>
                </div>
                <MealPlanQuickActions
                  mealPlanId={currentMealPlan.id}
                  handlers={{
                    onGenerateShoppingList: handlers.onGenerateShoppingList,
                    onViewCalendar: handlers.onViewCalendar,
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Integration with MealPlanCard */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-1 text-2xl font-semibold">
            Integration with MealPlanCard
          </h2>
          <p className="text-muted-foreground">
            Quick actions integrated into actual MealPlanCard components
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Current Plan (Not Favorited)</CardTitle>
              <CardDescription>Hover to see quick actions</CardDescription>
            </CardHeader>
            <CardContent>
              <MealPlanCard
                mealPlan={currentMealPlan}
                variant="elevated"
                size="default"
                isOwner={true}
                quickActionHandlers={handlers}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Plan (Favorited)</CardTitle>
              <CardDescription>Hover to see quick actions</CardDescription>
            </CardHeader>
            <CardContent>
              <MealPlanCard
                mealPlan={favoritedMealPlan}
                variant="elevated"
                size="default"
                isOwner={true}
                quickActionHandlers={handlers}
              />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Action Details */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-1 text-2xl font-semibold">Action Details</h2>
          <p className="text-muted-foreground">
            Detailed breakdown of each quick action
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
                  ❤️
                </span>
                Favorite
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Add or remove meal plan from your favorites list. Icon changes
                based on favorited state.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                  📤
                </span>
                Share
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Share the meal plan with others via link, email, or social
                media.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                  📋
                </span>
                Clone
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Create a duplicate copy of the meal plan that you can customize
                and edit.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
                  👁️
                </span>
                Quick View
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Preview meal plan details in a modal without navigating away
                from the current page.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900">
                  🛒
                </span>
                Shopping List
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Generate a shopping list from all recipes in the meal plan,
                automatically combining ingredients.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900">
                  📅
                </span>
                View Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                View the meal plan in an interactive calendar format showing all
                meals organized by date and type.
              </p>
            </CardContent>
          </Card>
        </div>
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
                    <td className="px-4 py-2 font-mono">mealPlanId</td>
                    <td className="px-4 py-2">string</td>
                    <td className="px-4 py-2">-</td>
                    <td className="px-4 py-2">
                      Meal plan ID (required) - passed to action handlers
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 font-mono">handlers</td>
                    <td className="px-4 py-2">MealPlanQuickActionHandlers</td>
                    <td className="px-4 py-2">-</td>
                    <td className="px-4 py-2">
                      Object containing action handler functions (required)
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-mono">className</td>
                    <td className="px-4 py-2">string</td>
                    <td className="px-4 py-2">undefined</td>
                    <td className="px-4 py-2">
                      Additional CSS classes for customization
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Handler Interface */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-1 text-2xl font-semibold">Handler Interface</h2>
          <p className="text-muted-foreground">
            MealPlanQuickActionHandlers type definition
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <pre className="bg-muted overflow-x-auto rounded-lg p-4 text-sm">
              <code>{`interface MealPlanQuickActionHandlers {
  onFavorite?: (mealPlanId: string) => void;
  onShare?: (mealPlanId: string) => void;
  onClone?: (mealPlanId: string) => void;
  onQuickView?: (mealPlanId: string) => void;
  onGenerateShoppingList?: (mealPlanId: string) => void;
  onViewCalendar?: (mealPlanId: string) => void;
}`}</code>
            </pre>
            <p className="text-muted-foreground mt-4 text-sm">
              All handlers are optional. Only provided handlers will appear as
              quick actions. If no handlers are provided, the component returns
              null and does not render.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Usage Example */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-1 text-2xl font-semibold">Usage Example</h2>
          <p className="text-muted-foreground">
            Code example for using MealPlanQuickActions
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <pre className="bg-muted overflow-x-auto rounded-lg p-4 text-sm">
              <code>{`import { MealPlanQuickActions } from '@/components/meal-plan/MealPlanQuickActions';
import type { MealPlanQuickActionHandlers } from '@/types/meal-plan/quick-actions';

const handlers: MealPlanQuickActionHandlers = {
  onFavorite: (id) => console.log('Favorite', id),
  onShare: (id) => console.log('Share', id),
  onClone: (id) => console.log('Clone', id),
  onQuickView: (id) => console.log('Quick View', id),
  onGenerateShoppingList: (id) => console.log('Generate Shopping List', id),
  onViewCalendar: (id) => console.log('View Calendar', id),
};

// Basic usage - requires a parent element with group class
<div className="group relative">
  <MealPlanCard mealPlan={mealPlan} />
  <MealPlanQuickActions
    mealPlanId="mp-123"
    handlers={handlers}
  />
</div>`}</code>
            </pre>
          </CardContent>
        </Card>
      </section>

      {/* Key Features */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-1 text-2xl font-semibold">Key Features</h2>
          <p className="text-muted-foreground">
            Important features and behaviors of MealPlanQuickActions
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Hover Activation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Actions appear on hover (desktop) or tap (mobile) when the
                parent element has the{' '}
                <code className="bg-muted rounded px-1">group</code> class.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Conditional Rendering</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Only actions with provided handlers are shown. If no handlers
                are provided, nothing renders.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>No Ownership Restrictions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                All actions are available to all users. Unlike menu actions,
                there are no owner-only restrictions.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Accessibility</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Fully keyboard accessible with proper ARIA labels. Each action
                button has descriptive labels for screen readers.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Position: Top-Right</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Quick actions appear in the top-right corner of the parent
                element by default (controlled by QuickActions component).
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Meal Plan Specific Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Includes meal plan-specific actions like Shopping List
                generation and Calendar view, unique to meal plans.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
