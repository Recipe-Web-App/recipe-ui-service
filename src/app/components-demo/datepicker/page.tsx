'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DatePicker,
  TimePicker,
  DateTimePicker,
  DateRangePicker,
  MealPlanDatePicker,
  RecipeSchedulePicker,
  ExpirationDatePicker,
} from '@/components/ui/datepicker';
import {
  Calendar,
  Clock,
  CalendarClock,
  CalendarDays,
  ChefHat,
  Timer,
  AlertTriangle,
} from 'lucide-react';

export default function DatePickerDemoPage() {
  // State for interactive examples
  const [basicDate, setBasicDate] = useState<Date | undefined>();
  const [basicTime, setBasicTime] = useState<Date | undefined>();
  const [dateTime, setDateTime] = useState<Date | undefined>();
  const [dateRange, setDateRange] = useState<[Date, Date] | undefined>();
  const [mealPlanDate, setMealPlanDate] = useState<Date | undefined>();
  const [scheduleDate, setScheduleDate] = useState<Date | undefined>();
  const [expirationDate, setExpirationDate] = useState<Date | undefined>();

  const ComponentCard = ({
    title,
    description,
    children,
    icon: Icon,
  }: {
    title: string;
    description: string;
    children: React.ReactNode;
    icon: React.ComponentType<{ className?: string }>;
  }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="space-y-4 text-center">
          <div className="flex items-center justify-center gap-3">
            <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-xl">
              <Calendar className="text-primary h-6 w-6" />
            </div>
            <h1 className="from-primary to-primary/70 bg-gradient-to-r bg-clip-text text-4xl font-bold text-transparent">
              DatePicker Components
            </h1>
          </div>
          <p className="text-muted-foreground mx-auto max-w-3xl text-lg">
            Comprehensive date and time selection components with calendar
            navigation, presets, constraints, and recipe-specific variants for
            cooking applications.
          </p>
          <div className="flex items-center justify-center gap-2">
            <Badge variant="secondary">Calendar</Badge>
            <Badge variant="secondary">Time Selection</Badge>
            <Badge variant="secondary">Date Ranges</Badge>
            <Badge variant="secondary">Recipe Features</Badge>
            <Badge variant="secondary">Accessibility</Badge>
          </div>
        </div>

        {/* Component Examples */}
        <Tabs defaultValue="core" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="core">Core Components</TabsTrigger>
            <TabsTrigger value="recipe">Recipe Variants</TabsTrigger>
          </TabsList>

          <TabsContent value="core" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Basic DatePicker */}
              <ComponentCard
                title="DatePicker"
                description="Basic date selection with calendar navigation and presets"
                icon={Calendar}
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Select Date</label>
                    <DatePicker
                      value={basicDate}
                      onValueChange={setBasicDate}
                      placeholder="Choose a date"
                      showPresets={true}
                      presetOptions={[
                        { label: 'Today', value: new Date() },
                        {
                          label: 'Tomorrow',
                          value: new Date(Date.now() + 24 * 60 * 60 * 1000),
                        },
                        {
                          label: 'Next Week',
                          value: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                        },
                      ]}
                    />
                  </div>
                  {basicDate && (
                    <div className="text-muted-foreground text-xs">
                      Selected: {basicDate.toLocaleDateString()}
                    </div>
                  )}
                </div>
              </ComponentCard>

              {/* TimePicker */}
              <ComponentCard
                title="TimePicker"
                description="Standalone time selection with configurable steps"
                icon={Clock}
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Select Time</label>
                    <TimePicker
                      value={basicTime}
                      onValueChange={setBasicTime}
                      placeholder="Choose time"
                      minuteStep={15}
                      timeFormat="12h"
                    />
                  </div>
                  {basicTime && (
                    <div className="text-muted-foreground text-xs">
                      Selected: {basicTime.toLocaleTimeString()}
                    </div>
                  )}
                </div>
              </ComponentCard>

              {/* DateTimePicker */}
              <ComponentCard
                title="DateTimePicker"
                description="Combined date and time selection"
                icon={CalendarClock}
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Select Date & Time
                    </label>
                    <DateTimePicker
                      value={dateTime}
                      onValueChange={setDateTime}
                      placeholder="Choose date and time"
                      showPresets={true}
                      presetOptions={[
                        { label: 'Now', value: new Date() },
                        {
                          label: 'In 1 hour',
                          value: new Date(Date.now() + 60 * 60 * 1000),
                        },
                      ]}
                    />
                  </div>
                  {dateTime && (
                    <div className="text-muted-foreground text-xs">
                      Selected: {dateTime.toLocaleString()}
                    </div>
                  )}
                </div>
              </ComponentCard>

              {/* DateRangePicker */}
              <ComponentCard
                title="DateRangePicker"
                description="Range selection with hover preview"
                icon={CalendarDays}
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Select Range</label>
                    <DateRangePicker
                      value={dateRange}
                      onValueChange={value => setDateRange(value ?? undefined)}
                      placeholder="Choose date range"
                      showPresets={true}
                      presetOptions={[
                        {
                          label: 'This Week',
                          value: [
                            new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                            new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                          ] as [Date, Date],
                        },
                        {
                          label: 'Next 7 Days',
                          value: [
                            new Date(),
                            new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                          ] as [Date, Date],
                        },
                      ]}
                    />
                  </div>
                  {dateRange && (
                    <div className="text-muted-foreground text-xs">
                      Range: {dateRange[0].toLocaleDateString()} -{' '}
                      {dateRange[1].toLocaleDateString()}
                    </div>
                  )}
                </div>
              </ComponentCard>
            </div>

            {/* Variant Examples */}
            <Card>
              <CardHeader>
                <CardTitle>Styling Variants</CardTitle>
                <CardDescription>
                  Different visual styles and sizes for various use cases
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Default</label>
                    <DatePicker placeholder="Default style" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Outlined</label>
                    <DatePicker
                      variant="outlined"
                      placeholder="Outlined style"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Filled</label>
                    <DatePicker variant="filled" placeholder="Filled style" />
                  </div>
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Small</label>
                    <DatePicker size="sm" placeholder="Small size" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Default</label>
                    <DatePicker placeholder="Default size" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Large</label>
                    <DatePicker size="lg" placeholder="Large size" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recipe" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* MealPlanDatePicker */}
              <ComponentCard
                title="Meal Plan Picker"
                description="Optimized for meal planning with relevant presets"
                icon={ChefHat}
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Meal Date</label>
                    <MealPlanDatePicker
                      value={mealPlanDate}
                      onValueChange={setMealPlanDate}
                      mealType="dinner"
                      placeholder="Plan your meal"
                    />
                  </div>
                  {mealPlanDate && (
                    <div className="text-muted-foreground text-xs">
                      Dinner planned for: {mealPlanDate.toLocaleDateString()}
                    </div>
                  )}
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs">
                      Weekend highlights
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Quick presets
                    </Badge>
                  </div>
                </div>
              </ComponentCard>

              {/* RecipeSchedulePicker */}
              <ComponentCard
                title="Recipe Scheduler"
                description="Schedule cooking times with duration warnings"
                icon={Timer}
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Cooking Time</label>
                    <RecipeSchedulePicker
                      value={scheduleDate}
                      onValueChange={setScheduleDate}
                      cookingDuration={45}
                      preparationTime={20}
                      placeholder="Schedule cooking"
                    />
                  </div>
                  {scheduleDate && (
                    <div className="text-muted-foreground text-xs">
                      Cooking starts: {scheduleDate.toLocaleString()}
                    </div>
                  )}
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs">
                      Duration tracking
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Smart presets
                    </Badge>
                  </div>
                </div>
              </ComponentCard>

              {/* ExpirationDatePicker */}
              <ComponentCard
                title="Expiration Tracker"
                description="Track food expiration with visual warnings"
                icon={AlertTriangle}
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Expires On</label>
                    <ExpirationDatePicker
                      value={expirationDate}
                      onValueChange={setExpirationDate}
                      foodType="produce"
                      placeholder="Set expiration date"
                    />
                  </div>
                  {expirationDate && (
                    <div className="text-muted-foreground text-xs">
                      Expires: {expirationDate.toLocaleDateString()}
                    </div>
                  )}
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs">
                      Food type presets
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Status indicators
                    </Badge>
                  </div>
                </div>
              </ComponentCard>
            </div>

            {/* Food Type Examples */}
            <Card>
              <CardHeader>
                <CardTitle>Food Type Presets</CardTitle>
                <CardDescription>
                  Different expiration presets based on food categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Produce (3-7 days)
                    </label>
                    <ExpirationDatePicker
                      foodType="produce"
                      placeholder="Fresh produce"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Dairy (1-2 weeks)
                    </label>
                    <ExpirationDatePicker
                      foodType="dairy"
                      placeholder="Dairy products"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Meat (3-7 days)
                    </label>
                    <ExpirationDatePicker
                      foodType="meat"
                      placeholder="Fresh meat"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Pantry (1-6 months)
                    </label>
                    <ExpirationDatePicker
                      foodType="pantry"
                      placeholder="Pantry items"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Leftovers (3-7 days)
                    </label>
                    <ExpirationDatePicker
                      foodType="leftovers"
                      placeholder="Leftover food"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Meal Type Examples */}
            <Card>
              <CardHeader>
                <CardTitle>Meal Planning Types</CardTitle>
                <CardDescription>
                  Color-coded meal types for better organization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Breakfast</label>
                    <MealPlanDatePicker
                      mealType="breakfast"
                      placeholder="Plan breakfast"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Lunch</label>
                    <MealPlanDatePicker
                      mealType="lunch"
                      placeholder="Plan lunch"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Dinner</label>
                    <MealPlanDatePicker
                      mealType="dinner"
                      placeholder="Plan dinner"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Snack</label>
                    <MealPlanDatePicker
                      mealType="snack"
                      placeholder="Plan snack"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Features Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Component Features</CardTitle>
            <CardDescription>
              Comprehensive feature set for date and time selection
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <h4 className="font-medium">Core Features</h4>
                <ul className="text-muted-foreground space-y-1 text-sm">
                  <li>• Calendar navigation</li>
                  <li>• Date/time constraints</li>
                  <li>• Preset options</li>
                  <li>• Range selection</li>
                  <li>• Keyboard navigation</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Recipe Features</h4>
                <ul className="text-muted-foreground space-y-1 text-sm">
                  <li>• Meal planning presets</li>
                  <li>• Cooking duration tracking</li>
                  <li>• Food expiration warnings</li>
                  <li>• Food type categorization</li>
                  <li>• Visual status indicators</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Accessibility</h4>
                <ul className="text-muted-foreground space-y-1 text-sm">
                  <li>• ARIA labels</li>
                  <li>• Screen reader support</li>
                  <li>• Focus management</li>
                  <li>• High contrast support</li>
                  <li>• Keyboard shortcuts</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
