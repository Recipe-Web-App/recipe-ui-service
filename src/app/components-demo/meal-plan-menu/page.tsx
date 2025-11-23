'use client';

import React, { useState } from 'react';
import { MealPlanMenu } from '@/components/meal-plan/MealPlanMenu';
import { MealPlanCard } from '@/components/meal-plan/MealPlanCard';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { MealPlanCardMealPlan } from '@/types/ui/meal-plan-card';
import type { MealPlanMenuActionHandlers } from '@/types/meal-plan/menu';
import type { MealPlanQuickActionHandlers } from '@/types/meal-plan/quick-actions';
import { useToastStore } from '@/stores/ui/toast-store';

// Sample meal plan data
const sampleMealPlan: MealPlanCardMealPlan = {
  id: 'mp-demo-1',
  userId: 'user-123',
  name: 'Healthy Week Meal Plan',
  description:
    'A balanced 7-day meal plan with nutritious recipes and variety.',
  startDate: '2025-11-20',
  endDate: '2025-11-26',
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

export default function MealPlanMenuDemo() {
  const { addSuccessToast } = useToastStore();
  const [lastAction, setLastAction] = useState<string>('None');

  // Action handlers
  const createHandler = (actionName: string) => () => {
    setLastAction(actionName);
    addSuccessToast(`${actionName} action clicked`);
  };

  const menuHandlers: MealPlanMenuActionHandlers = {
    onView: createHandler('View Details'),
    onEdit: createHandler('Edit Meal Plan'),
    onDuplicate: createHandler('Duplicate'),
    onDelete: createHandler('Delete Meal Plan'),
    onShare: createHandler('Share'),
    onGenerateShoppingList: createHandler('Generate Shopping List'),
  };

  const quickActionHandlers: MealPlanQuickActionHandlers = {
    onFavorite: createHandler('Favorite'),
    onShare: createHandler('Share'),
    onClone: createHandler('Clone'),
    onQuickView: createHandler('Quick View'),
    onGenerateShoppingList: createHandler('Generate Shopping List'),
    onViewCalendar: createHandler('View Calendar'),
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="mb-2 text-4xl font-bold">MealPlanMenu</h1>
        <p className="text-muted-foreground text-lg">
          A contextual menu component for meal plan-specific actions with
          ownership-based permissions.
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
              <MealPlanMenu
                mealPlanId={sampleMealPlan.id}
                variant="default"
                isOwner={true}
                handlers={menuHandlers}
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
              <MealPlanMenu
                mealPlanId={sampleMealPlan.id}
                variant="ghost"
                isOwner={true}
                handlers={menuHandlers}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Outline Variant</CardTitle>
              <CardDescription>Bordered trigger button</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center py-8">
              <MealPlanMenu
                mealPlanId={sampleMealPlan.id}
                variant="outline"
                isOwner={true}
                handlers={menuHandlers}
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
                <MealPlanMenu
                  mealPlanId={sampleMealPlan.id}
                  size="sm"
                  isOwner={true}
                  handlers={menuHandlers}
                />
                <span className="text-muted-foreground text-sm">Small</span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <MealPlanMenu
                  mealPlanId={sampleMealPlan.id}
                  size="icon"
                  isOwner={true}
                  handlers={menuHandlers}
                />
                <span className="text-muted-foreground text-sm">
                  Icon (default)
                </span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <MealPlanMenu
                  mealPlanId={sampleMealPlan.id}
                  size="lg"
                  isOwner={true}
                  handlers={menuHandlers}
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
            Different actions based on meal plan ownership
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Owner Actions</CardTitle>
              <CardDescription>
                Actions available when user owns the meal plan
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center py-4">
                <MealPlanMenu
                  mealPlanId={sampleMealPlan.id}
                  isOwner={true}
                  handlers={menuHandlers}
                />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Available actions:</p>
                <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
                  <li>View details</li>
                  <li>Edit meal plan (owner only)</li>
                  <li>Duplicate</li>
                  <li>Share</li>
                  <li>Generate shopping list</li>
                  <li className="text-destructive">
                    Delete meal plan (destructive, owner only)
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Non-Owner Actions</CardTitle>
              <CardDescription>
                Actions available for meal plans owned by others
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center py-4">
                <MealPlanMenu
                  mealPlanId={sampleMealPlan.id}
                  isOwner={false}
                  handlers={menuHandlers}
                />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Available actions:</p>
                <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
                  <li>View details</li>
                  <li>Duplicate</li>
                  <li>Share</li>
                  <li>Generate shopping list</li>
                </ul>
                <p className="text-muted-foreground text-xs italic">
                  Note: Edit and Delete actions are hidden for non-owners
                </p>
              </div>
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
              <CardTitle>All Actions</CardTitle>
              <CardDescription>All handlers provided</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center py-8">
              <MealPlanMenu
                mealPlanId={sampleMealPlan.id}
                isOwner={true}
                handlers={menuHandlers}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Partial Actions</CardTitle>
              <CardDescription>Only some handlers provided</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center py-8">
              <MealPlanMenu
                mealPlanId={sampleMealPlan.id}
                isOwner={true}
                handlers={{
                  onView: menuHandlers.onView,
                  onShare: menuHandlers.onShare,
                  onDelete: menuHandlers.onDelete,
                }}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>No Actions</CardTitle>
              <CardDescription>
                No handlers (menu won&apos;t render)
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center py-8">
              <div className="text-muted-foreground flex flex-col items-center gap-2 text-sm">
                <MealPlanMenu
                  mealPlanId={sampleMealPlan.id}
                  isOwner={true}
                  handlers={{}}
                />
                <span className="text-xs italic">
                  (Menu returns null when no actions)
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Integration Section */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-1 text-2xl font-semibold">Integration Example</h2>
          <p className="text-muted-foreground">
            MealPlanMenu integrated with MealPlanCard
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="mx-auto max-w-sm">
              <MealPlanCard
                mealPlan={sampleMealPlan}
                variant="elevated"
                size="default"
                isOwner={true}
                quickActionHandlers={quickActionHandlers}
                menuActionHandlers={menuHandlers}
              />
            </div>
            <p className="text-muted-foreground mt-4 text-center text-sm">
              Click the three-dot menu in the top-right corner of the card
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Actions Breakdown Section */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-1 text-2xl font-semibold">Actions Breakdown</h2>
          <p className="text-muted-foreground">
            Detailed breakdown of all available menu actions
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Common Actions</CardTitle>
              <CardDescription>
                Available to all users regardless of ownership
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="border-b pb-2">
                  <p className="font-medium">View Details</p>
                  <p className="text-muted-foreground text-sm">
                    Navigate to full meal plan details page
                  </p>
                </div>
                <div className="border-b pb-2">
                  <p className="font-medium">Duplicate</p>
                  <p className="text-muted-foreground text-sm">
                    Create a copy of the meal plan
                  </p>
                </div>
                <div className="border-b pb-2">
                  <p className="font-medium">Share</p>
                  <p className="text-muted-foreground text-sm">
                    Share meal plan with others
                  </p>
                </div>
                <div>
                  <p className="font-medium">Generate Shopping List</p>
                  <p className="text-muted-foreground text-sm">
                    Create shopping list from meal plan recipes
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Owner-Only Actions</CardTitle>
              <CardDescription>
                Available only to the meal plan owner
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="border-b pb-2">
                  <p className="font-medium">Edit Meal Plan</p>
                  <p className="text-muted-foreground text-sm">
                    Modify meal plan details and recipes
                  </p>
                  <Badge variant="secondary" className="mt-1">
                    Owner Only
                  </Badge>
                </div>
                <div>
                  <p className="font-medium">Delete Meal Plan</p>
                  <p className="text-muted-foreground text-sm">
                    Permanently remove the meal plan
                  </p>
                  <div className="mt-1 flex gap-2">
                    <Badge variant="secondary">Owner Only</Badge>
                    <Badge variant="destructive">Destructive</Badge>
                  </div>
                </div>
              </div>
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
                    <td className="px-4 py-2 font-mono">isOwner</td>
                    <td className="px-4 py-2">boolean</td>
                    <td className="px-4 py-2">false</td>
                    <td className="px-4 py-2">
                      Whether user owns the meal plan - controls Edit/Delete
                      visibility
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 font-mono">handlers</td>
                    <td className="px-4 py-2">MealPlanMenuActionHandlers</td>
                    <td className="px-4 py-2">-</td>
                    <td className="px-4 py-2">
                      Object containing action handler functions (required)
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 font-mono">variant</td>
                    <td className="px-4 py-2">
                      &apos;default&apos; | &apos;ghost&apos; |
                      &apos;outline&apos; | &apos;link&apos;
                    </td>
                    <td className="px-4 py-2">&apos;ghost&apos;</td>
                    <td className="px-4 py-2">Trigger button style variant</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 font-mono">size</td>
                    <td className="px-4 py-2">
                      &apos;sm&apos; | &apos;default&apos; | &apos;lg&apos; |
                      &apos;icon&apos;
                    </td>
                    <td className="px-4 py-2">&apos;icon&apos;</td>
                    <td className="px-4 py-2">Menu trigger button size</td>
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

      {/* Handler Interface Section */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-1 text-2xl font-semibold">Handler Interface</h2>
          <p className="text-muted-foreground">
            MealPlanMenuActionHandlers type definition
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <pre className="bg-muted overflow-x-auto rounded-lg p-4 text-sm">
              <code>{`interface MealPlanMenuActionHandlers {
  onView?: (mealPlanId: string) => void;
  onEdit?: (mealPlanId: string) => void;
  onDuplicate?: (mealPlanId: string) => void;
  onDelete?: (mealPlanId: string) => void;
  onShare?: (mealPlanId: string) => void;
  onGenerateShoppingList?: (mealPlanId: string) => void;
}`}</code>
            </pre>
            <p className="text-muted-foreground mt-4 text-sm">
              All handlers are optional. Only provided handlers will appear in
              the menu. If no handlers are provided, the menu will return null
              and not render.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Usage Example Section */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-1 text-2xl font-semibold">Usage Example</h2>
          <p className="text-muted-foreground">
            Code example for using MealPlanMenu
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <pre className="bg-muted overflow-x-auto rounded-lg p-4 text-sm">
              <code>{`import { MealPlanMenu } from '@/components/meal-plan/MealPlanMenu';
import type { MealPlanMenuActionHandlers } from '@/types/meal-plan/menu';

const handlers: MealPlanMenuActionHandlers = {
  onView: (id) => console.log('View', id),
  onEdit: (id) => console.log('Edit', id),
  onDuplicate: (id) => console.log('Duplicate', id),
  onShare: (id) => console.log('Share', id),
  onGenerateShoppingList: (id) => console.log('Generate Shopping List', id),
  onDelete: (id) => console.log('Delete', id),
};

<MealPlanMenu
  mealPlanId="mp-123"
  isOwner={true}
  variant="ghost"
  size="icon"
  handlers={handlers}
/>`}</code>
            </pre>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
