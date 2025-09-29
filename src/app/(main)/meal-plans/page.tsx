import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  Clock,
  Users,
  Plus,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from 'lucide-react';
import Link from 'next/link';

/**
 * Meal Plans Page
 *
 * Calendar view for managing weekly meal plans. Shows planned meals
 * for each day and allows users to create new meal plans.
 */
interface MealPlan {
  id: number;
  type: 'Breakfast' | 'Lunch' | 'Dinner';
  name: string;
  time: string;
}

type DayOfWeek =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';

export default function MealPlansPage() {
  const currentWeek = 'March 11-17, 2024';
  const days: DayOfWeek[] = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  // Mock meal plan data
  const mealPlans: Record<DayOfWeek, MealPlan[]> = {
    Monday: [
      {
        id: 1,
        type: 'Breakfast',
        name: 'Oatmeal with Berries',
        time: '8:00 AM',
      },
      { id: 2, type: 'Lunch', name: 'Mediterranean Salad', time: '12:30 PM' },
      { id: 3, type: 'Dinner', name: 'Grilled Salmon', time: '7:00 PM' },
    ],
    Tuesday: [
      {
        id: 4,
        type: 'Breakfast',
        name: 'Greek Yogurt Parfait',
        time: '8:00 AM',
      },
      { id: 5, type: 'Dinner', name: 'Chicken Stir Fry', time: '7:00 PM' },
    ],
    Wednesday: [
      { id: 6, type: 'Lunch', name: 'Caesar Salad', time: '12:30 PM' },
      { id: 7, type: 'Dinner', name: 'Pasta Primavera', time: '7:00 PM' },
    ],
    Thursday: [],
    Friday: [{ id: 8, type: 'Dinner', name: 'Pizza Night', time: '7:00 PM' }],
    Saturday: [],
    Sunday: [
      { id: 9, type: 'Breakfast', name: 'Pancakes', time: '9:00 AM' },
      { id: 10, type: 'Lunch', name: 'BBQ Burgers', time: '1:00 PM' },
    ],
  };

  const getMealTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'breakfast':
        return 'bg-warning-light text-warning';
      case 'lunch':
        return 'bg-info-light text-info';
      case 'dinner':
        return 'bg-accent text-accent-foreground';
      default:
        return 'bg-muted text-text-secondary';
    }
  };

  const getMealsForDay = (dayName: string): MealPlan[] => {
    switch (dayName) {
      case 'Monday':
        return mealPlans.Monday;
      case 'Tuesday':
        return mealPlans.Tuesday;
      case 'Wednesday':
        return mealPlans.Wednesday;
      case 'Thursday':
        return mealPlans.Thursday;
      case 'Friday':
        return mealPlans.Friday;
      case 'Saturday':
        return mealPlans.Saturday;
      case 'Sunday':
        return mealPlans.Sunday;
      default:
        return [];
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-foreground text-3xl font-bold">Meal Plans</h1>
          <p className="text-muted-foreground">
            Plan your meals and stay organized
          </p>
        </div>
        <Button asChild>
          <Link href="/meal-plans/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Meal Plan
          </Link>
        </Button>
      </div>

      {/* Week Navigation */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-center">
            <h2 className="text-lg font-semibold">{currentWeek}</h2>
            <p className="text-muted-foreground text-sm">This Week</p>
          </div>
          <Button variant="ghost" size="sm">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </Card>

      {/* Weekly Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium">
                Meals Planned
              </p>
              <p className="text-2xl font-bold">12</p>
            </div>
            <Calendar className="text-muted-foreground h-8 w-8" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium">
                Total Cook Time
              </p>
              <p className="text-2xl font-bold">4.5h</p>
            </div>
            <Clock className="text-muted-foreground h-8 w-8" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium">
                Servings
              </p>
              <p className="text-2xl font-bold">28</p>
            </div>
            <Users className="text-muted-foreground h-8 w-8" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium">
                Completion
              </p>
              <p className="text-2xl font-bold">60%</p>
            </div>
            <div className="bg-success-light flex h-8 w-8 items-center justify-center rounded-full">
              <div className="bg-success h-4 w-4 rounded-full"></div>
            </div>
          </div>
        </Card>
      </div>

      {/* Weekly Calendar */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
        {days.map(day => (
          <Card key={day} className="min-h-[300px] p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold">{day}</h3>
              <Button variant="ghost" size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3">
              {getMealsForDay(day).map((meal: MealPlan) => (
                <div key={meal.id} className="group">
                  <div className="mb-1 flex items-center justify-between">
                    <Badge
                      variant="secondary"
                      className={`text-xs ${getMealTypeColor(meal.type)}`}
                    >
                      {meal.type}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                    >
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-sm font-medium">{meal.name}</p>
                  <p className="text-muted-foreground text-xs">{meal.time}</p>
                </div>
              ))}

              {getMealsForDay(day).length === 0 && (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground mb-2 text-sm">
                    No meals planned
                  </p>
                  <Button variant="outline" size="sm">
                    Add Meal
                  </Button>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="mb-4 font-semibold">Quick Actions</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Button variant="outline" className="justify-start" asChild>
            <Link href="/meal-plans/templates">
              <Calendar className="mr-2 h-4 w-4" />
              Browse Templates
            </Link>
          </Button>
          <Button variant="outline" className="justify-start" asChild>
            <Link href="/shopping">
              <Plus className="mr-2 h-4 w-4" />
              Generate Shopping List
            </Link>
          </Button>
          <Button variant="outline" className="justify-start" asChild>
            <Link href="/meal-plans/nutrition">
              <Users className="mr-2 h-4 w-4" />
              View Nutrition
            </Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
