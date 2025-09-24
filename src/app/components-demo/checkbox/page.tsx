'use client';

import React, { useState } from 'react';
import {
  Checkbox,
  CheckboxRoot,
  CheckboxInput,
  CheckboxIcon,
  CheckboxLabel,
  CheckboxDescription,
  CheckboxField,
  FilterCheckboxGroup,
  AnimatedCheckbox,
  SearchCheckbox,
  MultiSelectFilter,
} from '@/components/ui/checkbox';
import type { FilterCheckboxItemProps } from '@/types/ui/checkbox';
import {
  Star,
  Heart,
  BookOpen,
  Clock,
  Users,
  Utensils,
  ChefHat,
  Coffee,
} from 'lucide-react';

export default function CheckboxDemo() {
  const [basicChecked, setBasicChecked] = useState(false);
  const [indeterminateChecked, setIndeterminateChecked] = useState<
    boolean | 'indeterminate'
  >('indeterminate');
  const [formValues, setFormValues] = useState({
    terms: false,
    newsletter: false,
    notifications: true,
  });

  // Recipe filter data
  const cuisineFilters: FilterCheckboxItemProps[] = [
    { id: 'italian', label: 'Italian', count: 24, context: 'cuisine' },
    { id: 'mexican', label: 'Mexican', count: 18, context: 'cuisine' },
    { id: 'asian', label: 'Asian', count: 32, context: 'cuisine' },
    {
      id: 'mediterranean',
      label: 'Mediterranean',
      count: 15,
      context: 'cuisine',
    },
    { id: 'indian', label: 'Indian', count: 21, context: 'cuisine' },
    { id: 'french', label: 'French', count: 12, context: 'cuisine' },
  ];

  const dietaryFilters: FilterCheckboxItemProps[] = [
    {
      id: 'vegetarian',
      label: 'Vegetarian',
      count: 45,
      context: 'dietary-restriction',
    },
    { id: 'vegan', label: 'Vegan', count: 28, context: 'dietary-restriction' },
    {
      id: 'gluten-free',
      label: 'Gluten Free',
      count: 33,
      context: 'dietary-restriction',
    },
    {
      id: 'dairy-free',
      label: 'Dairy Free',
      count: 19,
      context: 'dietary-restriction',
    },
    { id: 'keto', label: 'Keto', count: 16, context: 'dietary-restriction' },
    { id: 'paleo', label: 'Paleo', count: 14, context: 'dietary-restriction' },
  ];

  const difficultyFilters: FilterCheckboxItemProps[] = [
    { id: 'easy', label: 'Easy', count: 67, context: 'difficulty' },
    { id: 'medium', label: 'Medium', count: 34, context: 'difficulty' },
    { id: 'hard', label: 'Hard', count: 12, context: 'difficulty' },
  ];

  const timeFilters: FilterCheckboxItemProps[] = [
    {
      id: 'under-15',
      label: 'Under 15 minutes',
      count: 23,
      context: 'preparation-time',
    },
    {
      id: '15-30',
      label: '15-30 minutes',
      count: 41,
      context: 'preparation-time',
    },
    {
      id: '30-60',
      label: '30-60 minutes',
      count: 35,
      context: 'preparation-time',
    },
    {
      id: 'over-60',
      label: 'Over 1 hour',
      count: 14,
      context: 'preparation-time',
    },
  ];

  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([
    'italian',
  ]);
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-8">
      <div className="mx-auto max-w-6xl space-y-12">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            Checkbox Components
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Multi-select filters and form controls for recipe management
          </p>
        </div>

        {/* Basic Examples */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Basic Checkboxes
          </h2>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-medium text-gray-700">
                Simple Checkbox
              </h3>
              <div className="space-y-4">
                <Checkbox
                  checked={basicChecked}
                  onCheckedChange={checked => setBasicChecked(Boolean(checked))}
                  label="I agree to the terms and conditions"
                />
                <Checkbox
                  defaultChecked
                  label="Subscribe to newsletter"
                  description="Receive weekly recipe updates and cooking tips"
                />
                <Checkbox
                  disabled
                  label="Disabled option"
                  description="This option is currently unavailable"
                />
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-medium text-gray-700">
                Indeterminate State
              </h3>
              <div className="space-y-4">
                <Checkbox
                  checked={
                    indeterminateChecked === 'indeterminate'
                      ? undefined
                      : indeterminateChecked
                  }
                  indeterminate={indeterminateChecked === 'indeterminate'}
                  onCheckedChange={checked => setIndeterminateChecked(checked)}
                  label="Recipe Categories"
                  description="Some subcategories are selected"
                />
                <div className="ml-6 space-y-2">
                  <Checkbox label="Appetizers" defaultChecked />
                  <Checkbox label="Main Courses" />
                  <Checkbox label="Desserts" defaultChecked />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sizes and Variants */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Sizes & Variants
          </h2>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-medium text-gray-700">
                Different Sizes
              </h3>
              <div className="space-y-4">
                <Checkbox size="sm" label="Small checkbox" defaultChecked />
                <Checkbox
                  size="md"
                  label="Medium checkbox (default)"
                  defaultChecked
                />
                <Checkbox size="lg" label="Large checkbox" defaultChecked />
                <Checkbox
                  size="xl"
                  label="Extra large checkbox"
                  defaultChecked
                />
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-medium text-gray-700">
                Color Variants
              </h3>
              <div className="space-y-4">
                <Checkbox variant="default" label="Default" defaultChecked />
                <Checkbox variant="success" label="Success" defaultChecked />
                <Checkbox variant="warning" label="Warning" defaultChecked />
                <Checkbox variant="danger" label="Danger" defaultChecked />
                <Checkbox variant="info" label="Info" defaultChecked />
                <Checkbox variant="subtle" label="Subtle" defaultChecked />
              </div>
            </div>
          </div>
        </section>

        {/* Custom Icons */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">Custom Icons</h2>
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <Checkbox
                checkedIcon={<Star className="h-3 w-3 fill-current" />}
                label="Favorite Recipe"
                description="Mark as favorite"
              />
              <Checkbox
                checkedIcon={<Heart className="h-3 w-3 fill-current" />}
                label="Loved Recipe"
                description="Add to loved recipes"
                variant="danger"
              />
              <Checkbox
                checkedIcon={<BookOpen className="h-3 w-3" />}
                label="Recipe Collection"
                description="Add to cookbook"
                variant="info"
              />
            </div>
          </div>
        </section>

        {/* Form Fields */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">Form Fields</h2>
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-medium text-gray-700">
              Recipe Preferences
            </h3>
            <div className="space-y-4">
              <CheckboxField
                label="Accept Terms & Conditions"
                helperText="Required to create a recipe account"
                required
                checked={formValues.terms}
                onCheckedChange={checked =>
                  setFormValues(prev => ({ ...prev, terms: Boolean(checked) }))
                }
                error={
                  !formValues.terms
                    ? 'Please accept the terms to continue'
                    : undefined
                }
              />
              <CheckboxField
                label="Newsletter Subscription"
                helperText="Receive weekly recipe newsletters and cooking tips"
                checked={formValues.newsletter}
                onCheckedChange={checked =>
                  setFormValues(prev => ({
                    ...prev,
                    newsletter: Boolean(checked),
                  }))
                }
              />
              <CheckboxField
                label="Push Notifications"
                helperText="Get notified about new recipes and updates"
                checked={formValues.notifications}
                onCheckedChange={checked =>
                  setFormValues(prev => ({
                    ...prev,
                    notifications: Boolean(checked),
                  }))
                }
              />
            </div>
          </div>
        </section>

        {/* Recipe Filter Groups */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Recipe Filter Groups
          </h2>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <FilterCheckboxGroup
              variant="categories"
              title="Cuisine Types"
              items={cuisineFilters}
              searchable
              selectAll
              clearAll
              onBatchChange={values => console.log('Cuisine filters:', values)}
            />
            <FilterCheckboxGroup
              variant="dietary"
              title="Dietary Restrictions"
              items={dietaryFilters}
              searchable
              selectAll
              clearAll
              onBatchChange={values => console.log('Dietary filters:', values)}
            />
          </div>
        </section>

        {/* Multi-Select Filters */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Multi-Select Filters
          </h2>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <MultiSelectFilter
              title="Cooking Difficulty"
              options={difficultyFilters}
              selectedValues={selectedCuisines}
              onSelectionChange={setSelectedCuisines}
              variant="options"
              layout="vertical"
              showCount
              allowSelectAll
              allowClearAll
            />
            <MultiSelectFilter
              title="Preparation Time"
              options={timeFilters}
              selectedValues={selectedDietary}
              onSelectionChange={setSelectedDietary}
              variant="filters"
              layout="vertical"
              showCount
              maxSelections={2}
              placeholder="Search cooking times..."
            />
          </div>
        </section>

        {/* Animated Checkboxes */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Animated Checkboxes
          </h2>
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <AnimatedCheckbox
                label="Scale Animation"
                description="Hover and click me"
                animation="scale"
                animationDuration={200}
                checkedIcon={<ChefHat className="h-3 w-3" />}
              />
              <AnimatedCheckbox
                label="Bounce Animation"
                description="Fun bouncy effect"
                animation="bounce"
                animationDuration={300}
                variant="success"
                checkedIcon={<Coffee className="h-3 w-3" />}
              />
              <AnimatedCheckbox
                label="Loading State"
                description="🔄 Processing selection... (disabled while loading)"
                loading={true}
                disabled={true}
                checkedIcon={<Clock className="h-3 w-3" />}
                className="opacity-75"
              />
            </div>
          </div>
        </section>

        {/* Search Checkboxes */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Search Checkboxes
          </h2>
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-medium text-gray-700">
              Recipe Ingredients
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <SearchCheckbox
                label="Tomatoes"
                searchTerm="tom"
                highlightMatch
                count={15}
                selected={false}
              />
              <SearchCheckbox
                label="Onions"
                count={23}
                badge={
                  <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-800">
                    Fresh
                  </span>
                }
                selected={true}
              />
              <SearchCheckbox
                label="Garlic"
                searchTerm="gar"
                highlightMatch
                count={31}
                selected={false}
              />
              <SearchCheckbox
                label="Basil"
                count={8}
                badge={
                  <span className="rounded bg-purple-100 px-2 py-1 text-xs text-purple-800">
                    Herb
                  </span>
                }
                selected={false}
              />
            </div>
          </div>
        </section>

        {/* Compound Components */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Compound Components
          </h2>
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-medium text-gray-700">
              Custom Recipe Card Selection
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <CheckboxRoot
                className="flex items-start gap-4 rounded-lg border p-4 hover:bg-gray-50"
                onCheckedChange={checked => console.log('Recipe 1:', checked)}
              >
                <CheckboxInput size="lg" variant="success" />
                <div className="flex-1">
                  <CheckboxLabel
                    size="lg"
                    className="font-semibold text-gray-900"
                  >
                    Spaghetti Carbonara
                  </CheckboxLabel>
                  <CheckboxDescription size="lg" className="mt-1 text-gray-600">
                    Classic Italian pasta dish with eggs, cheese, and pancetta.
                    Ready in 20 minutes.
                  </CheckboxDescription>
                  <div className="mt-2 flex items-center gap-2">
                    <CheckboxIcon>
                      <Users className="h-4 w-4" />
                    </CheckboxIcon>
                    <span className="text-sm text-gray-500">Serves 4</span>
                    <span className="text-sm text-gray-500">•</span>
                    <Utensils className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-500">Easy</span>
                  </div>
                </div>
              </CheckboxRoot>

              <CheckboxRoot
                className="flex items-start gap-4 rounded-lg border p-4 hover:bg-gray-50"
                onCheckedChange={checked => console.log('Recipe 2:', checked)}
              >
                <CheckboxInput size="lg" variant="info" />
                <div className="flex-1">
                  <CheckboxLabel
                    size="lg"
                    className="font-semibold text-gray-900"
                  >
                    Thai Green Curry
                  </CheckboxLabel>
                  <CheckboxDescription size="lg" className="mt-1 text-gray-600">
                    Aromatic and spicy Thai curry with coconut milk, vegetables,
                    and fresh herbs. Authentic flavors in 35 minutes.
                  </CheckboxDescription>
                  <div className="mt-2 flex items-center gap-2">
                    <CheckboxIcon>
                      <Users className="h-4 w-4" />
                    </CheckboxIcon>
                    <span className="text-sm text-gray-500">Serves 3</span>
                    <span className="text-sm text-gray-500">•</span>
                    <Utensils className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-500">Medium</span>
                  </div>
                </div>
              </CheckboxRoot>
            </div>
          </div>
        </section>

        {/* Interactive Demo */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Interactive Demo
          </h2>
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-medium text-gray-700">
              Recipe Filter Dashboard
            </h3>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="space-y-4">
                <h4 className="font-medium text-gray-800">Quick Filters</h4>
                <div className="space-y-3">
                  <Checkbox
                    label="Quick & Easy (Under 30 min)"
                    variant="success"
                  />
                  <Checkbox label="Family Friendly" variant="info" />
                  <Checkbox label="Budget Meals" variant="warning" />
                  <Checkbox label="Trending This Week" variant="danger" />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-gray-800">Special Diets</h4>
                <div className="space-y-3">
                  <Checkbox
                    label="Vegetarian"
                    description="Plant-based recipes"
                    checkedIcon={<Heart className="h-3 w-3 fill-current" />}
                    variant="success"
                  />
                  <Checkbox
                    label="Keto Friendly"
                    description="Low-carb options"
                    variant="info"
                  />
                  <Checkbox
                    label="Gluten Free"
                    description="Safe for celiac"
                    variant="warning"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-gray-800">
                  Cooking Preferences
                </h4>
                <div className="space-y-3">
                  <AnimatedCheckbox
                    label="One-Pot Meals"
                    description="Minimal cleanup"
                    animation="scale"
                    checkedIcon={<Star className="h-3 w-3 fill-current" />}
                  />
                  <AnimatedCheckbox
                    label="Make-Ahead"
                    description="Prep in advance"
                    animation="scale"
                    variant="info"
                  />
                  <AnimatedCheckbox
                    label="Freezer Friendly"
                    description="Store for later"
                    animation="scale"
                    variant="subtle"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 border-t pt-6">
              <h4 className="mb-3 font-medium text-gray-800">
                Multi-Select Values
              </h4>
              <div className="text-sm text-gray-600">
                <p>
                  <strong>Selected Cuisines:</strong>{' '}
                  {JSON.stringify(selectedCuisines)}
                </p>
                <p>
                  <strong>Selected Dietary:</strong>{' '}
                  {JSON.stringify(selectedDietary)}
                </p>
                <p>
                  <strong>Form Values:</strong> {JSON.stringify(formValues)}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
