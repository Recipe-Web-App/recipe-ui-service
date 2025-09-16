'use client';

import React, { useState } from 'react';
import {
  RadioGroup,
  RadioGroupRoot,
  RadioInput,
  RadioLabel,
  RadioDescription,
  RadioField,
  RecipeRadioGroup,
  RadioCard,
} from '@/components/ui/radio';
import type { RadioOption, RecipeRadioOption } from '@/types/ui/radio';
import {
  ChefHat,
  Clock,
  Utensils,
  Gauge,
  Heart,
  Leaf,
  Pizza,
  Coffee,
  Cookie,
} from 'lucide-react';

export default function RadioDemo() {
  const [selectedCuisine, setSelectedCuisine] = useState('italian');
  const [selectedDiet, setSelectedDiet] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('easy');
  const [selectedMealType, setSelectedMealType] = useState('dinner');
  const [selectedServingSize, setSelectedServingSize] = useState('2-4');
  const [selectedCookingTime, setSelectedCookingTime] = useState('30');
  const [selectedRecipeCard, setSelectedRecipeCard] = useState('curry');
  const [selectedCompoundDifficulty, setSelectedCompoundDifficulty] =
    useState('medium');

  // Basic radio options
  const cuisineOptions: RadioOption[] = [
    {
      id: 'italian',
      value: 'italian',
      label: 'Italian',
      icon: <Pizza className="h-3 w-3" />,
    },
    { id: 'mexican', value: 'mexican', label: 'Mexican' },
    { id: 'asian', value: 'asian', label: 'Asian' },
    { id: 'mediterranean', value: 'mediterranean', label: 'Mediterranean' },
    { id: 'indian', value: 'indian', label: 'Indian' },
  ];

  const dietOptions: RadioOption[] = [
    {
      id: 'vegetarian',
      value: 'vegetarian',
      label: 'Vegetarian',
      description: 'Plant-based with dairy and eggs',
      icon: <Leaf className="h-3 w-3" />,
    },
    {
      id: 'vegan',
      value: 'vegan',
      label: 'Vegan',
      description: 'Entirely plant-based',
      icon: <Heart className="h-3 w-3" />,
    },
    {
      id: 'omnivore',
      value: 'omnivore',
      label: 'Omnivore',
      description: 'No restrictions',
    },
    {
      id: 'pescatarian',
      value: 'pescatarian',
      label: 'Pescatarian',
      description: 'Vegetarian plus seafood',
      disabled: true,
    },
  ];

  const difficultyOptions: RadioOption[] = [
    {
      id: 'easy',
      value: 'easy',
      label: 'Easy',
      description: 'Beginner friendly',
    },
    {
      id: 'medium',
      value: 'medium',
      label: 'Medium',
      description: 'Some experience needed',
    },
    {
      id: 'hard',
      value: 'hard',
      label: 'Hard',
      description: 'Advanced techniques',
    },
  ];

  const mealTypeOptions: RecipeRadioOption[] = [
    {
      id: 'breakfast',
      value: 'breakfast',
      label: 'Breakfast',
      description: 'Morning meals',
      count: 45,
      context: 'meal-type',
      icon: <Coffee className="h-3 w-3" />,
    },
    {
      id: 'lunch',
      value: 'lunch',
      label: 'Lunch',
      description: 'Midday meals',
      count: 62,
      context: 'meal-type',
    },
    {
      id: 'dinner',
      value: 'dinner',
      label: 'Dinner',
      description: 'Evening meals',
      count: 128,
      context: 'meal-type',
    },
    {
      id: 'dessert',
      value: 'dessert',
      label: 'Dessert',
      description: 'Sweet treats',
      count: 34,
      context: 'meal-type',
      icon: <Cookie className="h-3 w-3" />,
    },
  ];

  const servingSizeOptions: RadioOption[] = [
    { id: '1-2', value: '1-2', label: '1-2 people' },
    { id: '2-4', value: '2-4', label: '2-4 people' },
    { id: '4-6', value: '4-6', label: '4-6 people' },
    { id: '6+', value: '6+', label: '6+ people' },
  ];

  const cookingTimeOptions: RecipeRadioOption[] = [
    {
      id: '15',
      value: '15',
      label: 'Under 15 min',
      description: 'Quick recipes',
      count: 23,
      context: 'preparation-time',
    },
    {
      id: '30',
      value: '30',
      label: '15-30 min',
      description: 'Standard prep',
      count: 67,
      context: 'preparation-time',
    },
    {
      id: '60',
      value: '60',
      label: '30-60 min',
      description: 'More involved',
      count: 45,
      context: 'preparation-time',
    },
    {
      id: '60+',
      value: '60+',
      label: 'Over 1 hour',
      description: 'Complex recipes',
      count: 12,
      context: 'preparation-time',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl space-y-12">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">Radio Components</h1>
          <p className="mt-4 text-lg text-gray-600">
            Exclusive selection controls for recipe preferences
          </p>
        </div>

        {/* Basic Radio Groups */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Basic Radio Groups
          </h2>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-medium text-gray-700">
                Cuisine Selection
              </h3>
              <RadioGroup
                options={cuisineOptions}
                value={selectedCuisine}
                onValueChange={setSelectedCuisine}
                orientation="vertical"
              />
              <p className="mt-4 text-sm text-gray-500">
                Selected: <strong>{selectedCuisine}</strong>
              </p>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-medium text-gray-700">
                Dietary Preference
              </h3>
              <RadioGroup
                options={dietOptions}
                value={selectedDiet}
                onValueChange={setSelectedDiet}
                orientation="vertical"
              />
              <p className="mt-4 text-sm text-gray-500">
                Selected: <strong>{selectedDiet || 'None'}</strong>
              </p>
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
                <RadioGroup
                  options={[
                    { id: 'sm', value: 'sm', label: 'Small radio' },
                    { id: 'md', value: 'md', label: 'Medium radio (default)' },
                    { id: 'lg', value: 'lg', label: 'Large radio' },
                    { id: 'xl', value: 'xl', label: 'Extra large radio' },
                  ]}
                  defaultValue="md"
                  size="md"
                />
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-medium text-gray-700">
                Color Variants
              </h3>
              <div className="space-y-4">
                <RadioGroup
                  options={[
                    { id: 'default', value: 'default', label: 'Default' },
                    { id: 'success', value: 'success', label: 'Success' },
                    { id: 'warning', value: 'warning', label: 'Warning' },
                    { id: 'danger', value: 'danger', label: 'Danger' },
                    { id: 'info', value: 'info', label: 'Info' },
                    { id: 'subtle', value: 'subtle', label: 'Subtle' },
                  ]}
                  defaultValue="default"
                  variant="default"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Orientations */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">Orientations</h2>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-medium text-gray-700">
                Horizontal Layout
              </h3>
              <RadioGroup
                options={servingSizeOptions}
                value={selectedServingSize}
                onValueChange={setSelectedServingSize}
                orientation="horizontal"
              />
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-medium text-gray-700">
                Vertical Layout
              </h3>
              <RadioGroup
                options={difficultyOptions}
                value={selectedDifficulty}
                onValueChange={setSelectedDifficulty}
                orientation="vertical"
              />
            </div>
          </div>
        </section>

        {/* Form Fields */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">Form Fields</h2>
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-medium text-gray-700">
              Recipe Settings Form
            </h3>
            <div className="space-y-6">
              <RadioField
                options={difficultyOptions}
                value={selectedDifficulty}
                onValueChange={setSelectedDifficulty}
                label="Recipe Difficulty"
                helperText="Choose the skill level required"
                required
              />

              <RadioField
                options={servingSizeOptions}
                value={selectedServingSize}
                onValueChange={setSelectedServingSize}
                label="Serving Size"
                helperText="How many people will this serve?"
                error={
                  !selectedServingSize
                    ? 'Please select a serving size'
                    : undefined
                }
              />

              <RadioField
                options={cuisineOptions}
                value={selectedCuisine}
                onValueChange={setSelectedCuisine}
                label="Cuisine Type"
                helperText="Select the cuisine style"
              />
            </div>
          </div>
        </section>

        {/* Recipe Radio Groups */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Recipe Filter Groups
          </h2>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <RecipeRadioGroup
              variant="categories"
              title="Meal Type"
              options={mealTypeOptions}
              value={selectedMealType}
              onValueChange={setSelectedMealType}
              showCounts
            />

            <RecipeRadioGroup
              variant="time"
              title="Cooking Time"
              options={cookingTimeOptions}
              value={selectedCookingTime}
              onValueChange={setSelectedCookingTime}
              showCounts
            />
          </div>
        </section>

        {/* Radio Cards */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">Radio Cards</h2>
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-medium text-gray-700">
              Recipe Selection Cards
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <RadioCard
                value="carbonara"
                label="Spaghetti Carbonara"
                description="Classic Italian pasta with eggs, cheese, and pancetta"
                icon={<ChefHat className="h-5 w-5 text-gray-400" />}
                selected={selectedRecipeCard === 'carbonara'}
                onSelect={setSelectedRecipeCard}
              />
              <RadioCard
                value="curry"
                label="Thai Green Curry"
                description="Aromatic Thai curry with coconut milk and vegetables"
                icon={<Utensils className="h-5 w-5 text-gray-400" />}
                badge={
                  <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-800">
                    Popular
                  </span>
                }
                selected={selectedRecipeCard === 'curry'}
                onSelect={setSelectedRecipeCard}
              />
              <RadioCard
                value="tacos"
                label="Street Tacos"
                description="Authentic Mexican tacos with fresh toppings"
                icon={<Heart className="h-5 w-5 text-gray-400" />}
                selected={selectedRecipeCard === 'tacos'}
                onSelect={setSelectedRecipeCard}
              />
              <RadioCard
                value="sushi"
                label="Sushi Platter"
                description="Assorted fresh sushi and sashimi"
                icon={<Leaf className="h-5 w-5 text-gray-400" />}
                selected={selectedRecipeCard === 'sushi'}
                disabled
                onSelect={setSelectedRecipeCard}
              />
            </div>
            <div className="mt-4 rounded bg-gray-50 p-3">
              <p className="text-sm text-gray-600">
                <strong>Selected Recipe Card:</strong> {selectedRecipeCard}
              </p>
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
              Custom Recipe Difficulty Selector
            </h3>
            <RadioGroupRoot
              value={selectedCompoundDifficulty}
              onValueChange={setSelectedCompoundDifficulty}
            >
              <div className="space-y-4">
                <div
                  role="button"
                  tabIndex={0}
                  className="flex cursor-pointer items-start gap-3 rounded-lg border p-4 hover:bg-gray-50"
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedCompoundDifficulty('easy');
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedCompoundDifficulty('easy');
                    }
                  }}
                  aria-label="Select Easy difficulty"
                >
                  <RadioInput
                    value="easy"
                    id="compound-easy"
                    size="lg"
                    variant="success"
                    className="pointer-events-none"
                  />
                  <div className="flex-1">
                    <RadioLabel
                      htmlFor="compound-easy"
                      size="lg"
                      className="cursor-pointer font-semibold text-gray-900"
                    >
                      Easy
                    </RadioLabel>
                    <RadioDescription size="lg" className="mt-1 text-gray-600">
                      Perfect for beginners. Simple ingredients and basic
                      techniques. Ready in 30 minutes or less.
                    </RadioDescription>
                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                      <Gauge className="h-4 w-4" />
                      <span>Beginner</span>
                      <span className="text-gray-400">•</span>
                      <Clock className="h-4 w-4" />
                      <span>15-30 min</span>
                    </div>
                  </div>
                </div>

                <div
                  role="button"
                  tabIndex={0}
                  className="flex cursor-pointer items-start gap-3 rounded-lg border p-4 hover:bg-gray-50"
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedCompoundDifficulty('medium');
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedCompoundDifficulty('medium');
                    }
                  }}
                  aria-label="Select Medium difficulty"
                >
                  <RadioInput
                    value="medium"
                    id="compound-medium"
                    size="lg"
                    variant="warning"
                    className="pointer-events-none"
                  />
                  <div className="flex-1">
                    <RadioLabel
                      htmlFor="compound-medium"
                      size="lg"
                      className="cursor-pointer font-semibold text-gray-900"
                    >
                      Medium
                    </RadioLabel>
                    <RadioDescription size="lg" className="mt-1 text-gray-600">
                      Requires some cooking experience. Multiple steps and
                      techniques. Takes 30-60 minutes to prepare.
                    </RadioDescription>
                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                      <Gauge className="h-4 w-4" />
                      <span>Intermediate</span>
                      <span className="text-gray-400">•</span>
                      <Clock className="h-4 w-4" />
                      <span>30-60 min</span>
                    </div>
                  </div>
                </div>

                <div
                  role="button"
                  tabIndex={0}
                  className="flex cursor-pointer items-start gap-3 rounded-lg border p-4 hover:bg-gray-50"
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedCompoundDifficulty('hard');
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedCompoundDifficulty('hard');
                    }
                  }}
                  aria-label="Select Hard difficulty"
                >
                  <RadioInput
                    value="hard"
                    id="compound-hard"
                    size="lg"
                    variant="danger"
                    className="pointer-events-none"
                  />
                  <div className="flex-1">
                    <RadioLabel
                      htmlFor="compound-hard"
                      size="lg"
                      className="cursor-pointer font-semibold text-gray-900"
                    >
                      Hard
                    </RadioLabel>
                    <RadioDescription size="lg" className="mt-1 text-gray-600">
                      Advanced techniques required. Complex preparations and
                      precise timing. Over 1 hour of preparation.
                    </RadioDescription>
                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                      <Gauge className="h-4 w-4" />
                      <span>Advanced</span>
                      <span className="text-gray-400">•</span>
                      <Clock className="h-4 w-4" />
                      <span>60+ min</span>
                    </div>
                  </div>
                </div>
              </div>
            </RadioGroupRoot>
            <div className="mt-4 rounded bg-gray-50 p-3">
              <p className="text-sm text-gray-600">
                <strong>Selected Compound Difficulty:</strong>{' '}
                {selectedCompoundDifficulty}
              </p>
            </div>
          </div>
        </section>

        {/* Interactive Demo */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Interactive Recipe Preferences
          </h2>
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h3 className="mb-6 text-lg font-medium text-gray-700">
              Complete Recipe Filter Settings
            </h3>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div>
                <h4 className="mb-3 font-medium text-gray-800">Cuisine</h4>
                <RadioGroup
                  options={cuisineOptions}
                  value={selectedCuisine}
                  onValueChange={setSelectedCuisine}
                  size="sm"
                  variant="info"
                />
              </div>

              <div>
                <h4 className="mb-3 font-medium text-gray-800">Difficulty</h4>
                <RadioGroup
                  options={difficultyOptions}
                  value={selectedDifficulty}
                  onValueChange={setSelectedDifficulty}
                  size="sm"
                  variant="warning"
                />
              </div>

              <div>
                <h4 className="mb-3 font-medium text-gray-800">Serving Size</h4>
                <RadioGroup
                  options={servingSizeOptions}
                  value={selectedServingSize}
                  onValueChange={setSelectedServingSize}
                  size="sm"
                  variant="success"
                />
              </div>
            </div>

            <div className="mt-6 border-t pt-6">
              <h4 className="mb-3 font-medium text-gray-800">
                Selected Preferences
              </h4>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 lg:grid-cols-3">
                <p>
                  <strong>Cuisine:</strong> {selectedCuisine}
                </p>
                <p>
                  <strong>Diet:</strong> {selectedDiet || 'None'}
                </p>
                <p>
                  <strong>Difficulty:</strong> {selectedDifficulty}
                </p>
                <p>
                  <strong>Meal Type:</strong> {selectedMealType}
                </p>
                <p>
                  <strong>Serving Size:</strong> {selectedServingSize}
                </p>
                <p>
                  <strong>Cooking Time:</strong> {selectedCookingTime} min
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
