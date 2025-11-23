'use client';

import React, { useState, useMemo } from 'react';
import { MealPlanFilters } from '@/components/meal-plan/MealPlanFilters';
import { MealPlanBrowseGrid } from '@/components/meal-plan/MealPlanBrowseGrid';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import type { MealPlanResponseDto } from '@/types/meal-plan-management/meal-plan';
import type { MealPlanFilterValues } from '@/types/meal-plan/filters';
import {
  DEFAULT_MEAL_PLAN_FILTER_VALUES,
  DURATION_OPTIONS,
} from '@/types/meal-plan/filters';

// Sample meal plan data
const sampleMealPlans: MealPlanResponseDto[] = [
  {
    id: '1',
    userId: 'current-user',
    name: 'Healthy January Week 1',
    description: 'Low-carb meal plan for first week of January',
    startDate: '2024-01-01',
    endDate: '2024-01-07',
    isActive: false,
    createdAt: '2023-12-28T10:00:00Z',
    updatedAt: '2023-12-30T15:00:00Z',
    recipeCount: 21,
    durationDays: 7,
  },
  {
    id: '2',
    userId: 'current-user',
    name: 'Quick Weeknight Dinners',
    description: 'Easy meals for busy work nights',
    startDate: '2024-01-22',
    endDate: '2024-02-04',
    isActive: true,
    createdAt: '2024-01-05T10:00:00Z',
    updatedAt: '2024-01-07T12:00:00Z',
    recipeCount: 14,
    durationDays: 14,
  },
  {
    id: '3',
    userId: 'other-user-1',
    name: 'Keto February',
    description: 'Full month of ketogenic diet meals',
    startDate: '2024-02-01',
    endDate: '2024-02-29',
    isActive: false,
    createdAt: '2024-01-25T10:00:00Z',
    updatedAt: '2024-01-28T14:00:00Z',
    recipeCount: 42,
    durationDays: 29,
  },
  {
    id: '4',
    userId: 'current-user',
    name: 'Meal Prep Sunday',
    description: 'Batch cooking for the week ahead',
    startDate: '2024-01-15',
    endDate: '2024-01-21',
    isActive: true,
    createdAt: '2024-01-12T10:00:00Z',
    updatedAt: '2024-01-14T11:00:00Z',
    recipeCount: 7,
    durationDays: 7,
  },
  {
    id: '5',
    userId: 'other-user-2',
    name: 'Family Favorites Collection',
    description: 'Tried and tested family recipes',
    startDate: '2024-02-15',
    endDate: '2024-02-21',
    isActive: false,
    createdAt: '2024-01-30T10:00:00Z',
    updatedAt: '2024-02-02T10:00:00Z',
    recipeCount: 18,
    durationDays: 7,
  },
  {
    id: '6',
    userId: 'other-user-1',
    name: 'Vegan January Challenge',
    description: 'Plant-based eating for the month',
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    isActive: false,
    createdAt: '2023-12-20T10:00:00Z',
    updatedAt: '2023-12-29T16:00:00Z',
    recipeCount: 31,
    durationDays: 31,
  },
  {
    id: '7',
    userId: 'current-user',
    name: 'Summer BBQ Season',
    description: 'Grilling recipes for warm weather',
    startDate: '2024-06-01',
    endDate: '2024-06-14',
    isActive: false,
    createdAt: '2024-05-15T10:00:00Z',
    updatedAt: '2024-05-28T12:00:00Z',
    recipeCount: 28,
    durationDays: 14,
  },
  {
    id: '8',
    userId: 'other-user-3',
    name: 'Mediterranean Diet Week',
    description: 'Heart-healthy Mediterranean meals',
    startDate: '2024-01-22',
    endDate: '2024-01-28',
    isActive: true,
    createdAt: '2024-01-18T10:00:00Z',
    updatedAt: '2024-01-20T14:00:00Z',
    recipeCount: 21,
    durationDays: 7,
  },
  {
    id: '9',
    userId: 'current-user',
    name: 'Holiday Feast Planning',
    description: 'Special meals for the holiday season',
    startDate: '2024-12-20',
    endDate: '2024-12-31',
    isActive: false,
    createdAt: '2024-11-15T10:00:00Z',
    updatedAt: '2024-11-28T14:00:00Z',
    recipeCount: 35,
    durationDays: 12,
  },
  {
    id: '10',
    userId: 'other-user-2',
    name: 'Weight Loss Journey',
    description: 'Calorie-controlled meals for two weeks',
    startDate: '2024-02-05',
    endDate: '2024-02-18',
    isActive: false,
    createdAt: '2024-01-28T10:00:00Z',
    updatedAt: '2024-02-01T11:00:00Z',
    recipeCount: 14,
    durationDays: 14,
  },
  {
    id: '11',
    userId: 'other-user-1',
    name: 'Paleo Power Month',
    description: 'Grain-free, dairy-free eating plan',
    startDate: '2024-03-01',
    endDate: '2024-03-31',
    isActive: false,
    createdAt: '2024-02-15T10:00:00Z',
    updatedAt: '2024-02-25T14:00:00Z',
    recipeCount: 30,
    durationDays: 31,
  },
  {
    id: '12',
    userId: 'current-user',
    name: 'Budget-Friendly February',
    description: 'Cost-effective meals for the whole month',
    startDate: '2024-02-01',
    endDate: '2024-02-29',
    isActive: false,
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-28T16:00:00Z',
    recipeCount: 29,
    durationDays: 29,
  },
];

// Mock data for favorited meal plans (for demo purposes)
const favoritedMealPlanIds = ['2', '3', '8', '11'];

// Helper to determine meal plan status based on dates
const getMealPlanStatus = (
  startDate: string,
  endDate: string
): 'Current' | 'Upcoming' | 'Completed' => {
  const now = new Date('2024-01-22'); // Fixed date for demo consistency
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (now >= start && now <= end) return 'Current';
  if (now < start) return 'Upcoming';
  return 'Completed';
};

// Helper to determine meal plan duration category
const getDurationCategory = (days: number): string => {
  if (days >= 28 && days <= 31) return DURATION_OPTIONS.ONE_MONTH;
  if (days >= 12 && days <= 16) return DURATION_OPTIONS.TWO_WEEKS;
  if (days >= 5 && days <= 9) return DURATION_OPTIONS.ONE_WEEK;
  return DURATION_OPTIONS.CUSTOM;
};

export default function MealPlanFiltersDemo() {
  const [filterValues, setFilterValues] = useState<MealPlanFilterValues>(
    DEFAULT_MEAL_PLAN_FILTER_VALUES
  );

  // Filter meal plans based on current filter values
  const filteredMealPlans = useMemo(() => {
    return sampleMealPlans.filter(plan => {
      // Search filter
      if (filterValues.search) {
        const searchLower = filterValues.search.toLowerCase();
        const nameMatch = plan.name.toLowerCase().includes(searchLower);
        const descMatch = plan.description?.toLowerCase().includes(searchLower);
        if (!nameMatch && !descMatch) return false;
      }

      // Duration filter
      if (filterValues.duration && filterValues.duration.length > 0) {
        const planDuration = getDurationCategory(plan.durationDays ?? 0);
        if (!filterValues.duration.includes(planDuration)) return false;
      }

      // Recipe count filter
      if (filterValues.recipeCountRange) {
        const [min, max] = filterValues.recipeCountRange;
        const recipeCount = plan.recipeCount ?? 0;
        if (recipeCount < min || recipeCount > max) return false;
      }

      // Status filter
      if (filterValues.status && filterValues.status.length > 0) {
        const planStatus = getMealPlanStatus(plan.startDate, plan.endDate);
        if (!filterValues.status.includes(planStatus)) return false;
      }

      // My meal plans filter
      if (filterValues.showMyMealPlans) {
        if (plan.userId !== 'current-user') return false;
      }

      // Favorited filter
      if (filterValues.showOnlyFavorited) {
        if (!favoritedMealPlanIds.includes(plan.id)) return false;
      }

      return true;
    });
  }, [filterValues]);

  // Enrich meal plans with additional data
  const enrichedMealPlans = useMemo(
    () =>
      filteredMealPlans.map(plan => ({
        ...plan,
        description: plan.description ?? undefined,
        recipeCount: plan.recipeCount ?? 0,
        durationDays: plan.durationDays ?? 0,
        status: getMealPlanStatus(plan.startDate, plan.endDate),
        isFavorited: favoritedMealPlanIds.includes(plan.id),
        owner: {
          id: plan.userId,
          name: plan.userId === 'current-user' ? 'You' : `Chef ${plan.userId}`,
          avatar: `https://i.pravatar.cc/150?u=${plan.userId}`,
        },
        recipeImages: Array.from(
          { length: 4 },
          (_, i) =>
            `https://images.unsplash.com/photo-${1500000000000 + parseInt(plan.id) * 1000 + i * 100}?w=200`
        ),
      })),
    [filteredMealPlans]
  );

  const handleFilterChange = (newValues: MealPlanFilterValues) => {
    setFilterValues(newValues);
  };

  const handleReset = () => {
    setFilterValues(DEFAULT_MEAL_PLAN_FILTER_VALUES);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-foreground mb-2 text-3xl font-bold">
          MealPlanFilters Component
        </h1>
        <p className="text-muted-foreground text-lg">
          Entity-specific filter panel for meal plan browsing. Responsive with
          drawer on mobile and inline panel on desktop/tablet.
        </p>
      </div>

      <div className="space-y-8">
        {/* Current State Display */}
        <Card size="lg">
          <CardHeader>
            <CardTitle>Current Filter State</CardTitle>
            <CardDescription>
              Active filters and their values (updates in real-time)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted rounded-lg p-4">
              <pre className="overflow-x-auto text-sm">
                {JSON.stringify(filterValues, null, 2)}
              </pre>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={handleReset}
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm font-medium transition-colors"
              >
                Reset Filters
              </button>
              <div className="text-muted-foreground flex items-center text-sm">
                Showing {filteredMealPlans.length} of {sampleMealPlans.length}{' '}
                meal plans
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interactive Demo */}
        <Card size="lg">
          <CardHeader>
            <CardTitle>Live Filter Demo</CardTitle>
            <CardDescription>
              Try the filters to see meal plans update in real-time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
              {/* Filter Panel */}
              <div className="lg:sticky lg:top-4 lg:h-fit">
                <MealPlanFilters
                  mealPlans={sampleMealPlans}
                  values={filterValues}
                  onFilterChange={handleFilterChange}
                  totalResults={filteredMealPlans.length}
                  showResultCount
                  title="Filter Meal Plans"
                  variant="default"
                  size="md"
                  position="sidebar"
                />
              </div>

              {/* Filtered Meal Plan Grid */}
              <div>
                {enrichedMealPlans.length > 0 ? (
                  <MealPlanBrowseGrid
                    mealPlans={enrichedMealPlans}
                    columns={{ mobile: 1, tablet: 2, desktop: 3 }}
                    gap="md"
                    cardVariant="elevated"
                    cardSize="default"
                  />
                ) : (
                  <div className="bg-muted flex flex-col items-center justify-center rounded-lg p-12 text-center">
                    <p className="text-muted-foreground text-lg font-medium">
                      No meal plans match your filters
                    </p>
                    <p className="text-muted-foreground mt-2 text-sm">
                      Try adjusting your filters to see more results
                    </p>
                    <button
                      onClick={handleReset}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 mt-4 rounded-md px-4 py-2 text-sm font-medium transition-colors"
                    >
                      Clear All Filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feature Highlights */}
        <Card size="lg">
          <CardHeader>
            <CardTitle>Features</CardTitle>
            <CardDescription>
              MealPlanFilters component capabilities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-muted-foreground space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>
                  <strong>Text Search:</strong> Search meal plans by name and
                  description with debouncing (300ms)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>
                  <strong>Duration Filter:</strong> Filter by meal plan duration
                  (1 week, 2 weeks, 1 month, custom)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>
                  <strong>Recipe Count:</strong> Range slider to filter by
                  number of recipes (0-50)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>
                  <strong>Status Filter:</strong> Filter by current, upcoming,
                  or completed meal plans
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>
                  <strong>Meal Types:</strong> Filter by included meal types
                  (Breakfast, Lunch, Dinner, Snack, Dessert)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>
                  <strong>Ownership Filter:</strong> Toggle to show only your
                  meal plans
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>
                  <strong>Favorites Filter:</strong> Toggle to show only
                  favorited meal plans
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>
                  <strong>Responsive Design:</strong> Drawer on mobile
                  (&lt;768px), inline panel on desktop/tablet
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>
                  <strong>Session State:</strong> Integrates with search-filter
                  store for session-only persistence
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>
                  <strong>Real-time Updates:</strong> Filtered results update
                  immediately as filters change
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>
                  <strong>Clear & Reset:</strong> Easy to clear all filters or
                  reset to defaults
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
