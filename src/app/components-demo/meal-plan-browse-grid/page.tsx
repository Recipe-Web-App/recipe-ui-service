'use client';

import * as React from 'react';
import { MealPlanBrowseGrid } from '@/components/meal-plan/MealPlanBrowseGrid';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { MealPlanCardMealPlan } from '@/types/ui/meal-plan-card';
import type {
  MealPlanCardVariant,
  MealPlanCardSize,
} from '@/types/ui/meal-plan-card';

export default function MealPlanBrowseGridDemo() {
  // State
  const [showQuickActions, setShowQuickActions] = React.useState(true);
  const [showMenu, setShowMenu] = React.useState(true);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);
  const [cardVariant, setCardVariant] =
    React.useState<MealPlanCardVariant>('elevated');
  const [cardSize, setCardSize] = React.useState<MealPlanCardSize>('default');
  const [gap, setGap] = React.useState<'sm' | 'md' | 'lg'>('md');
  const [spacing, setSpacing] = React.useState<
    'compact' | 'default' | 'comfortable'
  >('default');

  // Mock meal plan data
  const createMockMealPlan = (
    overrides: Partial<MealPlanCardMealPlan>
  ): MealPlanCardMealPlan => ({
    id: 'meal-plan-1',
    userId: 'user-123',
    name: 'Week of Jan 15',
    description: 'Healthy balanced meal plan',
    startDate: '2024-01-15T00:00:00Z',
    endDate: '2024-01-21T23:59:59Z',
    isActive: true,
    recipeCount: 21,
    durationDays: 7,
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-10T10:00:00Z',
    ownerName: 'Jane Doe',
    ownerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
    recipeImages: [
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
      'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400',
      'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400',
    ],
    isFavorited: false,
    mealTypeBreakdown: {
      breakfast: 7,
      lunch: 7,
      dinner: 7,
    },
    ...overrides,
  });

  const sampleMealPlans: MealPlanCardMealPlan[] = React.useMemo(
    () => [
      createMockMealPlan({
        id: 'meal-plan-1',
        name: 'Current Week Plan',
        description: 'Balanced meals for this week',
        // Current plan (e.g., Jan 20-26, 2025 - adjust as needed)
        startDate: '2025-01-20T00:00:00Z',
        endDate: '2025-01-26T23:59:59Z',
        recipeCount: 21,
        durationDays: 7,
        isFavorited: true,
      }),
      createMockMealPlan({
        id: 'meal-plan-2',
        name: 'Upcoming Summer Plan',
        description: 'Light and fresh summer recipes',
        // Upcoming plan (e.g., Feb 3-9, 2025)
        startDate: '2025-02-03T00:00:00Z',
        endDate: '2025-02-09T23:59:59Z',
        recipeCount: 28,
        durationDays: 7,
        ownerName: 'John Smith',
        ownerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
        mealTypeBreakdown: {
          breakfast: 7,
          lunch: 7,
          dinner: 7,
          snack: 7,
        },
      }),
      createMockMealPlan({
        id: 'meal-plan-3',
        name: 'Completed Holiday Plan',
        description: 'Special holiday meals and treats',
        // Completed plan (past dates)
        startDate: '2023-12-18T00:00:00Z',
        endDate: '2023-12-24T23:59:59Z',
        recipeCount: 21,
        durationDays: 7,
        ownerName: 'Sarah Johnson',
        ownerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
        mealTypeBreakdown: {
          breakfast: 7,
          lunch: 7,
          dinner: 7,
        },
      }),
    ],
    []
  );

  const extendedMealPlans: MealPlanCardMealPlan[] = React.useMemo(
    () => [
      ...sampleMealPlans,
      createMockMealPlan({
        id: 'meal-plan-4',
        name: 'Quick 3-Day Plan',
        description: 'Short weekend meal plan',
        // Upcoming weekend (Jan 24-26, 2025)
        startDate: '2025-01-24T00:00:00Z',
        endDate: '2025-01-26T23:59:59Z',
        recipeCount: 9,
        durationDays: 3,
        mealTypeBreakdown: {
          breakfast: 3,
          lunch: 3,
          dinner: 3,
        },
      }),
      createMockMealPlan({
        id: 'meal-plan-5',
        name: 'Extended 2-Week Plan',
        description: 'Comprehensive two-week meal planning',
        // Current 2-week span (Jan 16-29, 2025)
        startDate: '2025-01-16T00:00:00Z',
        endDate: '2025-01-29T23:59:59Z',
        recipeCount: 42,
        durationDays: 14,
        ownerName: 'Mike Wilson',
        ownerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
        mealTypeBreakdown: {
          breakfast: 14,
          lunch: 14,
          dinner: 14,
        },
      }),
      createMockMealPlan({
        id: 'meal-plan-6',
        name: 'Keto Week',
        description: 'Low-carb ketogenic meal plan',
        startDate: '2024-01-22T00:00:00Z',
        endDate: '2024-01-28T23:59:59Z',
        recipeCount: 21,
        durationDays: 7,
        isFavorited: true,
        ownerName: 'Emma Davis',
        ownerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
        mealTypeBreakdown: {
          breakfast: 7,
          lunch: 7,
          dinner: 7,
        },
      }),
    ],
    [sampleMealPlans]
  );

  // Create 15 meal plans for pagination demo
  const paginationMealPlans: MealPlanCardMealPlan[] = Array.from(
    { length: 15 },
    (_, i) =>
      createMockMealPlan({
        id: `pagination-plan-${i + 1}`,
        name: `Meal Plan ${i + 1}`,
        description: `Sample meal plan for demonstration #${i + 1}`,
        recipeCount: 14 + (i % 7) * 7,
        durationDays: 7,
        isFavorited: i % 3 === 0,
      })
  );

  // Handler functions
  const handleMealPlanClick = (mealPlan: MealPlanCardMealPlan) => {
    console.log('Meal plan clicked:', mealPlan);
    alert(`Clicked: ${mealPlan.name}`);
  };

  const handleFavorite = (mealPlan: MealPlanCardMealPlan) => {
    console.log('Favorite toggled:', mealPlan);
    alert(`Favorite toggled: ${mealPlan.name}`);
  };

  const handleShare = (mealPlan: MealPlanCardMealPlan) => {
    console.log('Share clicked:', mealPlan);
    alert(`Share: ${mealPlan.name}`);
  };

  const handleClone = (mealPlan: MealPlanCardMealPlan) => {
    console.log('Clone clicked:', mealPlan);
    alert(`Clone: ${mealPlan.name}`);
  };

  const handleQuickView = (mealPlan: MealPlanCardMealPlan) => {
    console.log('Quick view clicked:', mealPlan);
    alert(`Quick view: ${mealPlan.name}`);
  };

  const handleGenerateShoppingList = (mealPlan: MealPlanCardMealPlan) => {
    console.log('Generate shopping list:', mealPlan);
    alert(`Generate shopping list for: ${mealPlan.name}`);
  };

  const handleViewCalendar = (mealPlan: MealPlanCardMealPlan) => {
    console.log('View calendar:', mealPlan);
    alert(`View calendar: ${mealPlan.name}`);
  };

  const handleEdit = (mealPlan: MealPlanCardMealPlan) => {
    console.log('Edit clicked:', mealPlan);
    alert(`Edit: ${mealPlan.name}`);
  };

  const handleDelete = (mealPlan: MealPlanCardMealPlan) => {
    console.log('Delete clicked:', mealPlan);
    if (confirm(`Are you sure you want to delete "${mealPlan.name}"?`)) {
      alert(`Deleted: ${mealPlan.name}`);
    }
  };

  const handleDuplicate = (mealPlan: MealPlanCardMealPlan) => {
    console.log('Duplicate clicked:', mealPlan);
    alert(`Duplicate: ${mealPlan.name}`);
  };

  const handleRetry = () => {
    console.log('Retry clicked');
    setHasError(false);
    alert('Retrying...');
  };

  const simulateLoading = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  const toggleError = () => {
    setHasError(!hasError);
  };

  return (
    <div className="container mx-auto space-y-8 py-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">MealPlanBrowseGrid</h1>
        <p className="text-muted-foreground text-lg">
          A meal-plan-specific grid component for browsing meal plans with
          pagination, status-based filtering, and comprehensive action handlers.
        </p>
      </div>

      <div className="border-border my-8 border-t" />

      {/* Basic Usage */}
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Basic Usage</h2>
          <p className="text-muted-foreground">
            Simple grid with default settings showing three meal plans (current,
            upcoming, and completed).
          </p>
        </div>
        <MealPlanBrowseGrid
          mealPlans={sampleMealPlans}
          onMealPlanClick={handleMealPlanClick}
        />
      </section>

      <div className="border-border my-8 border-t" />

      {/* Variants */}
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Card Variants</h2>
          <p className="text-muted-foreground">
            Different visual styles for meal plan cards.
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Default</h3>
            <MealPlanBrowseGrid
              mealPlans={sampleMealPlans.slice(0, 2)}
              cardVariant="default"
              onMealPlanClick={handleMealPlanClick}
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Elevated</h3>
            <MealPlanBrowseGrid
              mealPlans={sampleMealPlans.slice(0, 2)}
              cardVariant="elevated"
              onMealPlanClick={handleMealPlanClick}
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Outlined</h3>
            <MealPlanBrowseGrid
              mealPlans={sampleMealPlans.slice(0, 2)}
              cardVariant="outlined"
              onMealPlanClick={handleMealPlanClick}
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Interactive</h3>
            <MealPlanBrowseGrid
              mealPlans={sampleMealPlans.slice(0, 2)}
              cardVariant="interactive"
              onMealPlanClick={handleMealPlanClick}
            />
          </div>
        </div>
      </section>

      <div className="border-border my-8 border-t" />

      {/* Sizes */}
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Card Sizes</h2>
          <p className="text-muted-foreground">
            Different size options for meal plan cards.
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Small</h3>
            <MealPlanBrowseGrid
              mealPlans={sampleMealPlans.slice(0, 3)}
              cardSize="sm"
              onMealPlanClick={handleMealPlanClick}
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Default</h3>
            <MealPlanBrowseGrid
              mealPlans={sampleMealPlans.slice(0, 3)}
              cardSize="default"
              onMealPlanClick={handleMealPlanClick}
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Large</h3>
            <MealPlanBrowseGrid
              mealPlans={sampleMealPlans.slice(0, 3)}
              cardSize="lg"
              onMealPlanClick={handleMealPlanClick}
            />
          </div>
        </div>
      </section>

      <div className="border-border my-8 border-t" />

      {/* With Quick Actions */}
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">With Quick Actions</h2>
          <p className="text-muted-foreground">
            Hover overlay with quick actions: favorite, share, clone, quick
            view, shopping list, and calendar view.
          </p>
        </div>
        <MealPlanBrowseGrid
          mealPlans={sampleMealPlans}
          onMealPlanClick={handleMealPlanClick}
          onFavorite={handleFavorite}
          onShare={handleShare}
          onClone={handleClone}
          onQuickView={handleQuickView}
          onGenerateShoppingList={handleGenerateShoppingList}
          onViewCalendar={handleViewCalendar}
          showQuickActions={true}
        />
      </section>

      <div className="border-border my-8 border-t" />

      {/* With Menu */}
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">With Contextual Menu</h2>
          <p className="text-muted-foreground">
            Three-dot menu with contextual actions based on ownership.
          </p>
        </div>
        <MealPlanBrowseGrid
          mealPlans={sampleMealPlans}
          onMealPlanClick={handleMealPlanClick}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onDuplicate={handleDuplicate}
          onShare={handleShare}
          onGenerateShoppingList={handleGenerateShoppingList}
          isOwner={true}
          showMenu={true}
        />
      </section>

      <div className="border-border my-8 border-t" />

      {/* Ownership States */}
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Ownership States</h2>
          <p className="text-muted-foreground">
            Different actions available based on ownership status.
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">As Owner</h3>
            <p className="text-muted-foreground text-sm">
              Full access to edit, delete, and manage meal plans.
            </p>
            <MealPlanBrowseGrid
              mealPlans={sampleMealPlans.slice(0, 2)}
              isOwner={true}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onDuplicate={handleDuplicate}
              onShare={handleShare}
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">As Viewer</h3>
            <p className="text-muted-foreground text-sm">
              Limited actions: view, share, clone only.
            </p>
            <MealPlanBrowseGrid
              mealPlans={sampleMealPlans.slice(0, 2)}
              isOwner={false}
              onShare={handleShare}
              onClone={handleClone}
              onQuickView={handleQuickView}
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">
              Dynamic Ownership (Function)
            </h3>
            <p className="text-muted-foreground text-sm">
              Ownership determined per meal plan using a function (first plan is
              owned).
            </p>
            <MealPlanBrowseGrid
              mealPlans={sampleMealPlans}
              isOwner={mealPlan => mealPlan.userId === 'user-123'}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onShare={handleShare}
            />
          </div>
        </div>
      </section>

      <div className="border-border my-8 border-t" />

      {/* Loading State */}
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Loading State</h2>
          <p className="text-muted-foreground">
            Skeleton placeholders while meal plans are being loaded.
          </p>
        </div>
        <Button onClick={simulateLoading} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Simulate Loading (2s)'}
        </Button>
        <MealPlanBrowseGrid
          mealPlans={isLoading ? [] : sampleMealPlans}
          loading={isLoading}
          skeletonCount={6}
        />
      </section>

      <div className="border-border my-8 border-t" />

      {/* Empty State */}
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Empty State</h2>
          <p className="text-muted-foreground">
            Displayed when no meal plans are available.
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Default Empty State</h3>
            <MealPlanBrowseGrid mealPlans={[]} />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Custom Empty State</h3>
            <MealPlanBrowseGrid
              mealPlans={[]}
              emptyMessage="No meal plans created yet"
              emptyDescription="Start planning your meals by creating your first meal plan."
              emptyActions={
                <Button onClick={() => alert('Navigate to create meal plan')}>
                  Create Meal Plan
                </Button>
              }
            />
          </div>
        </div>
      </section>

      <div className="border-border my-8 border-t" />

      {/* Error State */}
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Error State</h2>
          <p className="text-muted-foreground">
            Error handling with retry functionality.
          </p>
        </div>
        <Button onClick={toggleError}>
          {hasError ? 'Clear Error' : 'Trigger Error'}
        </Button>
        <MealPlanBrowseGrid
          mealPlans={hasError ? [] : sampleMealPlans}
          error={
            hasError ? 'Failed to load meal plans. Please try again.' : null
          }
          onRetry={handleRetry}
        />
      </section>

      <div className="border-border my-8 border-t" />

      {/* Pagination */}
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Pagination</h2>
          <p className="text-muted-foreground">
            Browse through multiple pages of meal plans (15 plans, 5 per page).
          </p>
        </div>
        <MealPlanBrowseGrid
          mealPlans={paginationMealPlans.slice(
            (currentPage - 1) * 5,
            currentPage * 5
          )}
          currentPage={currentPage}
          totalPages={3}
          totalItems={15}
          pageSize={5}
          onPageChange={setCurrentPage}
          onMealPlanClick={handleMealPlanClick}
        />
      </section>

      <div className="border-border my-8 border-t" />

      {/* Custom Configuration */}
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Custom Configuration</h2>
          <p className="text-muted-foreground">
            Interactive controls to customize grid layout, spacing, and
            features.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
            <CardDescription>
              Adjust settings to see how the grid adapts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <p className="text-sm font-medium">Card Variant</p>
                <Select
                  value={cardVariant}
                  onValueChange={value =>
                    setCardVariant(value as MealPlanCardVariant)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="elevated">Elevated</SelectItem>
                    <SelectItem value="outlined">Outlined</SelectItem>
                    <SelectItem value="interactive">Interactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Card Size</p>
                <Select
                  value={cardSize}
                  onValueChange={value =>
                    setCardSize(value as MealPlanCardSize)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sm">Small</SelectItem>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="lg">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Gap</p>
                <Select
                  value={gap}
                  onValueChange={value => setGap(value as 'sm' | 'md' | 'lg')}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sm">Small</SelectItem>
                    <SelectItem value="md">Medium</SelectItem>
                    <SelectItem value="lg">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Spacing</p>
                <Select
                  value={spacing}
                  onValueChange={value =>
                    setSpacing(value as 'compact' | 'default' | 'comfortable')
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="compact">Compact</SelectItem>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="comfortable">Comfortable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Switch
                  id="quick-actions-config"
                  checked={showQuickActions}
                  onCheckedChange={setShowQuickActions}
                />
                <label
                  htmlFor="quick-actions-config"
                  className="text-sm font-medium"
                >
                  Show Quick Actions
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="menu-config"
                  checked={showMenu}
                  onCheckedChange={setShowMenu}
                />
                <label htmlFor="menu-config" className="text-sm font-medium">
                  Show Menu
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        <MealPlanBrowseGrid
          mealPlans={extendedMealPlans}
          cardVariant={cardVariant}
          cardSize={cardSize}
          gap={gap}
          spacing={spacing}
          showQuickActions={showQuickActions}
          showMenu={showMenu}
          onMealPlanClick={handleMealPlanClick}
          onFavorite={handleFavorite}
          onShare={handleShare}
          onClone={handleClone}
          onQuickView={handleQuickView}
          onGenerateShoppingList={handleGenerateShoppingList}
          onViewCalendar={handleViewCalendar}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onDuplicate={handleDuplicate}
          isOwner={true}
        />
      </section>
    </div>
  );
}
