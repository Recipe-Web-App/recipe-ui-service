'use client';

import * as React from 'react';
import {
  MealPlanCalendar,
  MealPlanCalendarSkeleton,
  MealPlanCalendarEmpty,
} from '@/components/meal-plan';
import type {
  MealPlanCalendarData,
  MealSlot,
} from '@/types/ui/meal-plan-calendar';

// Utility functions to replace date-fns
const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const startOfWeek = (date: Date): Date => {
  const result = new Date(date);
  const day = result.getDay();
  const diff = day === 0 ? -6 : 1 - day; // Adjust when day is Sunday
  result.setDate(result.getDate() + diff);
  result.setHours(0, 0, 0, 0);
  return result;
};

export default function MealPlanCalendarDemo() {
  // Get current week start (Monday)
  const currentWeekStart = startOfWeek(new Date());

  // Empty data (no recipes)
  const emptyData: MealPlanCalendarData = {
    startDate: currentWeekStart,
    endDate: addDays(currentWeekStart, 6),
    slots: [],
  };

  // Data with some recipes
  const dataWithRecipes: MealPlanCalendarData = {
    startDate: currentWeekStart,
    endDate: addDays(currentWeekStart, 6),
    slots: [
      // Monday
      {
        date: currentWeekStart,
        mealType: 'breakfast',
        recipes: [
          {
            recipeId: 1,
            recipeName: 'Avocado Toast',
            recipeImage:
              'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400',
          },
        ],
      },
      {
        date: currentWeekStart,
        mealType: 'lunch',
        recipes: [
          {
            recipeId: 2,
            recipeName: 'Greek Salad',
            recipeImage:
              'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400',
          },
        ],
      },
      {
        date: currentWeekStart,
        mealType: 'dinner',
        recipes: [
          {
            recipeId: 3,
            recipeName: 'Grilled Salmon',
            recipeImage:
              'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400',
          },
        ],
      },
      // Tuesday
      {
        date: addDays(currentWeekStart, 1),
        mealType: 'breakfast',
        recipes: [
          {
            recipeId: 4,
            recipeName: 'Overnight Oats',
            recipeImage:
              'https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?w=400',
          },
        ],
      },
      {
        date: addDays(currentWeekStart, 1),
        mealType: 'lunch',
        recipes: [
          {
            recipeId: 5,
            recipeName: 'Chicken Caesar Wrap',
            recipeImage:
              'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400',
          },
        ],
      },
      {
        date: addDays(currentWeekStart, 1),
        mealType: 'dinner',
        recipes: [
          {
            recipeId: 6,
            recipeName: 'Beef Stir-Fry',
            recipeImage:
              'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=400',
          },
        ],
      },
      // Wednesday - Multiple recipes for one meal
      {
        date: addDays(currentWeekStart, 2),
        mealType: 'breakfast',
        recipes: [
          {
            recipeId: 7,
            recipeName: 'Scrambled Eggs',
            recipeImage:
              'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=400',
          },
          {
            recipeId: 8,
            recipeName: 'Whole Wheat Toast',
          },
        ],
      },
      {
        date: addDays(currentWeekStart, 2),
        mealType: 'lunch',
        recipes: [
          {
            recipeId: 9,
            recipeName: 'Quinoa Bowl',
            recipeImage:
              'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
          },
        ],
      },
      {
        date: addDays(currentWeekStart, 2),
        mealType: 'dinner',
        recipes: [
          {
            recipeId: 10,
            recipeName: 'Margherita Pizza',
            recipeImage:
              'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
          },
        ],
      },
      {
        date: addDays(currentWeekStart, 2),
        mealType: 'snack',
        recipes: [
          {
            recipeId: 11,
            recipeName: 'Mixed Nuts',
          },
        ],
      },
    ],
  };

  // Full week data
  const fullWeekData: MealPlanCalendarData = {
    startDate: currentWeekStart,
    endDate: addDays(currentWeekStart, 6),
    slots: [
      ...Array.from({ length: 7 }).flatMap((_, dayIndex) => [
        {
          date: addDays(currentWeekStart, dayIndex),
          mealType: 'breakfast' as const,
          recipes: [
            {
              recipeId: dayIndex * 4 + 1,
              recipeName: `Breakfast Day ${dayIndex + 1}`,
              recipeImage: `https://images.unsplash.com/photo-${1541519227354 + dayIndex}?w=400`,
            },
          ],
        },
        {
          date: addDays(currentWeekStart, dayIndex),
          mealType: 'lunch' as const,
          recipes: [
            {
              recipeId: dayIndex * 4 + 2,
              recipeName: `Lunch Day ${dayIndex + 1}`,
              recipeImage: `https://images.unsplash.com/photo-${1540189549336 + dayIndex}?w=400`,
            },
          ],
        },
        {
          date: addDays(currentWeekStart, dayIndex),
          mealType: 'dinner' as const,
          recipes: [
            {
              recipeId: dayIndex * 4 + 3,
              recipeName: `Dinner Day ${dayIndex + 1}`,
              recipeImage: `https://images.unsplash.com/photo-${1467003909585 + dayIndex}?w=400`,
            },
          ],
        },
        {
          date: addDays(currentWeekStart, dayIndex),
          mealType: 'snack' as const,
          recipes: [
            {
              recipeId: dayIndex * 4 + 4,
              recipeName: `Snack Day ${dayIndex + 1}`,
            },
          ],
        },
      ]),
    ],
  };

  // Handlers
  const handleChange = (data: MealPlanCalendarData) => {
    console.log('Calendar data changed:', data);
  };

  const handleViewRecipe = (recipeId: number) => {
    console.log('View recipe:', recipeId);
    alert(`Viewing recipe ${recipeId}`);
  };

  const handleAddRecipe = (slot: MealSlot) => {
    console.log('Add recipe:', slot);
    alert(
      `Add recipe for ${slot.mealType} on ${slot.date.toLocaleDateString()}`
    );
  };

  const handleMealSlotClick = (slot: MealSlot) => {
    console.log('Meal slot clicked:', slot);
  };

  const handleCurrentDateChange = (date: Date) => {
    console.log('Current date changed:', date);
  };

  const handleCreatePlan = () => {
    console.log('Create meal plan');
    alert('Create a new meal plan');
  };

  return (
    <div className="container mx-auto space-y-8 py-8">
      <header className="mb-8">
        <h1 className="mb-2 text-4xl font-bold">MealPlanCalendar Component</h1>
        <p className="text-muted-foreground">
          A comprehensive calendar component for meal planning with multiple
          view modes (week, day, month, meal), interactive slots, and edit
          capabilities.
        </p>
      </header>

      {/* View Modes */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">View Modes</h2>
        <p className="text-muted-foreground">
          The calendar supports four different view modes - try switching
          between them
        </p>
        <div className="space-y-8">
          <div className="space-y-2">
            <h3 className="font-semibold">Week View (Default)</h3>
            <MealPlanCalendar
              value={dataWithRecipes}
              defaultView="week"
              onViewRecipe={handleViewRecipe}
            />
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Day View</h3>
            <MealPlanCalendar
              value={dataWithRecipes}
              defaultView="day"
              onViewRecipe={handleViewRecipe}
            />
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Month View</h3>
            <MealPlanCalendar
              value={fullWeekData}
              defaultView="month"
              onViewRecipe={handleViewRecipe}
            />
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Meal View</h3>
            <MealPlanCalendar
              value={dataWithRecipes}
              defaultView="meal"
              onViewRecipe={handleViewRecipe}
            />
          </div>
        </div>
      </section>

      {/* Edit Mode */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Edit Mode</h2>
        <p className="text-muted-foreground">
          In edit mode, users can add and remove recipes from meal slots
        </p>
        <MealPlanCalendar
          value={dataWithRecipes}
          mode="edit"
          onChange={handleChange}
          onAddRecipe={handleAddRecipe}
          onViewRecipe={handleViewRecipe}
        />
      </section>

      {/* View Mode (Read-Only) */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">View Mode (Read-Only)</h2>
        <p className="text-muted-foreground">
          View mode is read-only - users can view recipes but not modify the
          meal plan
        </p>
        <MealPlanCalendar
          value={dataWithRecipes}
          mode="view"
          onViewRecipe={handleViewRecipe}
        />
      </section>

      {/* Interactive Features */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Interactive Features</h2>
        <p className="text-muted-foreground">
          Calendar with all interactive features enabled (click slots, navigate
          dates)
        </p>
        <MealPlanCalendar
          value={dataWithRecipes}
          mode="edit"
          onChange={handleChange}
          onViewRecipe={handleViewRecipe}
          onAddRecipe={handleAddRecipe}
          onMealSlotClick={handleMealSlotClick}
          onCurrentDateChange={handleCurrentDateChange}
        />
      </section>

      {/* Sizes */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Sizes</h2>
        <p className="text-muted-foreground">Different size variants</p>
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="font-semibold">Small</h3>
            <MealPlanCalendar
              value={dataWithRecipes}
              size="sm"
              onViewRecipe={handleViewRecipe}
            />
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Default</h3>
            <MealPlanCalendar
              value={dataWithRecipes}
              size="default"
              onViewRecipe={handleViewRecipe}
            />
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Large</h3>
            <MealPlanCalendar
              value={dataWithRecipes}
              size="lg"
              onViewRecipe={handleViewRecipe}
            />
          </div>
        </div>
      </section>

      {/* Weekend Display */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Weekend Display</h2>
        <p className="text-muted-foreground">
          Control whether weekends are shown in the calendar
        </p>
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="font-semibold">With Weekends (Default)</h3>
            <MealPlanCalendar
              value={dataWithRecipes}
              showWeekends={true}
              defaultView="week"
              onViewRecipe={handleViewRecipe}
            />
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Weekdays Only</h3>
            <MealPlanCalendar
              value={dataWithRecipes}
              showWeekends={false}
              defaultView="week"
              onViewRecipe={handleViewRecipe}
            />
          </div>
        </div>
      </section>

      {/* Custom Meal Types */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Custom Meal Types</h2>
        <p className="text-muted-foreground">
          Calendar can be configured with custom meal types
        </p>
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="font-semibold">
              Default (Breakfast, Lunch, Dinner, Snack)
            </h3>
            <MealPlanCalendar
              value={dataWithRecipes}
              defaultView="week"
              onViewRecipe={handleViewRecipe}
            />
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Custom (Breakfast, Dinner only)</h3>
            <MealPlanCalendar
              value={dataWithRecipes}
              mealTypes={['breakfast', 'dinner']}
              defaultView="week"
              onViewRecipe={handleViewRecipe}
            />
          </div>
        </div>
      </section>

      {/* Empty State */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Empty State</h2>
        <p className="text-muted-foreground">
          When no recipes are planned, show a helpful empty state
        </p>
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="font-semibold">Empty Calendar</h3>
            <MealPlanCalendar value={emptyData} mode="view" />
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Empty State Component</h3>
            <MealPlanCalendarEmpty onCreatePlan={handleCreatePlan} />
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Custom Empty State</h3>
            <MealPlanCalendarEmpty
              title="Start Planning Your Week"
              description="Add recipes to your meal plan to get started with healthy eating."
              onCreatePlan={handleCreatePlan}
            />
          </div>
        </div>
      </section>

      {/* Loading State */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Loading State</h2>
        <p className="text-muted-foreground">
          Skeleton loader for when meal plan data is loading
        </p>
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="font-semibold">Default Skeleton</h3>
            <MealPlanCalendarSkeleton />
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Small Skeleton</h3>
            <MealPlanCalendarSkeleton size="sm" />
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Large Skeleton</h3>
            <MealPlanCalendarSkeleton size="lg" />
          </div>
        </div>
      </section>

      {/* Full Week Example */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Complete Week Example</h2>
        <p className="text-muted-foreground">
          A fully populated meal plan with all meals for the week
        </p>
        <MealPlanCalendar
          value={fullWeekData}
          mode="edit"
          onChange={handleChange}
          onViewRecipe={handleViewRecipe}
          onAddRecipe={handleAddRecipe}
        />
      </section>

      {/* Accessibility Features */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Accessibility Features</h2>
        <p className="text-muted-foreground">
          The calendar includes comprehensive accessibility features:
        </p>
        <ul className="text-muted-foreground list-inside list-disc space-y-2 pl-4">
          <li>Keyboard navigation (Tab, Arrow keys, Enter, Space)</li>
          <li>ARIA labels for all interactive elements</li>
          <li>Role attributes (grid, gridcell, article, button)</li>
          <li>Proper heading hierarchy</li>
          <li>Focus management and visible focus indicators</li>
          <li>Screen reader announcements for state changes</li>
        </ul>
        <div className="space-y-2">
          <h3 className="font-semibold">Try navigating with keyboard:</h3>
          <MealPlanCalendar
            value={dataWithRecipes}
            mode="edit"
            onChange={handleChange}
            onViewRecipe={handleViewRecipe}
            onAddRecipe={handleAddRecipe}
          />
        </div>
      </section>
    </div>
  );
}
