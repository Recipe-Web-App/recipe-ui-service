'use client';

import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  SelectField,
} from '@/components/ui/select';

export default function SelectDemo() {
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [cookTime, setCookTime] = useState('');
  const [dietaryRestriction, setDietaryRestriction] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [cuisine, setCuisine] = useState('');

  // Form state for controlled example
  const [formData, setFormData] = useState({
    category: '',
    difficulty: '',
    cookTime: '',
    diet: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.category) errors.category = 'Please select a category';
    if (!formData.difficulty) errors.difficulty = 'Please select a difficulty';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      alert('Form submitted successfully!');
      console.log('Form data:', formData);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <div className="space-y-8">
        <div>
          <h1 className="mb-2 text-3xl font-bold">Select Component Demo</h1>
          <p className="text-gray-600">
            Interactive examples of the Select component for category selection,
            filters, and preferences in the Recipe App.
          </p>
        </div>

        {/* Basic Select Examples */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold">Basic Selects</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <h3 className="mb-2 text-sm font-medium">Default Variant</h3>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="breakfast">Breakfast</SelectItem>
                  <SelectItem value="lunch">Lunch</SelectItem>
                  <SelectItem value="dinner">Dinner</SelectItem>
                  <SelectItem value="dessert">Dessert</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-medium">Outline Variant</h3>
              <Select>
                <SelectTrigger variant="outline" className="w-[180px]">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-medium">Ghost Variant</h3>
              <Select>
                <SelectTrigger variant="ghost" className="w-[180px]">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">Under 15 min</SelectItem>
                  <SelectItem value="30">15-30 min</SelectItem>
                  <SelectItem value="60">30-60 min</SelectItem>
                  <SelectItem value="120">1-2 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-medium">Filled Variant</h3>
              <Select>
                <SelectTrigger variant="filled" className="w-[180px]">
                  <SelectValue placeholder="Select cuisine" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="italian">Italian</SelectItem>
                  <SelectItem value="mexican">Mexican</SelectItem>
                  <SelectItem value="asian">Asian</SelectItem>
                  <SelectItem value="mediterranean">Mediterranean</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Size Variations */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold">Size Variations</h2>
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <h3 className="mb-2 text-sm font-medium">Small</h3>
              <Select>
                <SelectTrigger size="sm" className="w-[140px]">
                  <SelectValue placeholder="Small" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="option1">Option 1</SelectItem>
                  <SelectItem value="option2">Option 2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-medium">Default</h3>
              <Select>
                <SelectTrigger size="default" className="w-[160px]">
                  <SelectValue placeholder="Default" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="option1">Option 1</SelectItem>
                  <SelectItem value="option2">Option 2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-medium">Large</h3>
              <Select>
                <SelectTrigger size="lg" className="w-[180px]">
                  <SelectValue placeholder="Large" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="option1">Option 1</SelectItem>
                  <SelectItem value="option2">Option 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Recipe-Specific Examples */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold">Recipe App Examples</h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Recipe Categories */}
            <div>
              <h3 className="mb-3 text-lg font-medium">Recipe Categories</h3>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Meal Types</SelectLabel>
                    <SelectItem value="breakfast">🍳 Breakfast</SelectItem>
                    <SelectItem value="lunch">🥗 Lunch</SelectItem>
                    <SelectItem value="dinner">🍽️ Dinner</SelectItem>
                    <SelectSeparator />
                    <SelectLabel>Other</SelectLabel>
                    <SelectItem value="appetizer">🥙 Appetizer</SelectItem>
                    <SelectItem value="dessert">🍰 Dessert</SelectItem>
                    <SelectItem value="snack">🥨 Snack</SelectItem>
                    <SelectItem value="beverage">🥤 Beverage</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <div className="mt-2 text-sm text-gray-600">
                Selected: {category || 'None'}
              </div>
            </div>

            {/* Difficulty Levels */}
            <div>
              <h3 className="mb-3 text-lg font-medium">Difficulty Levels</h3>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">🟢 Easy</SelectItem>
                  <SelectItem value="medium">🟡 Medium</SelectItem>
                  <SelectItem value="hard">🔴 Hard</SelectItem>
                  <SelectItem value="expert">⚫ Expert</SelectItem>
                </SelectContent>
              </Select>
              <div className="mt-2 text-sm text-gray-600">
                Selected: {difficulty || 'None'}
              </div>
            </div>

            {/* Cook Time */}
            <div>
              <h3 className="mb-3 text-lg font-medium">Cooking Time</h3>
              <Select value={cookTime} onValueChange={setCookTime}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="quick">⚡ Under 15 minutes</SelectItem>
                  <SelectItem value="short">⏱️ 15-30 minutes</SelectItem>
                  <SelectItem value="medium">⏰ 30-60 minutes</SelectItem>
                  <SelectItem value="long">🕰️ Over 1 hour</SelectItem>
                </SelectContent>
              </Select>
              <div className="mt-2 text-sm text-gray-600">
                Selected: {cookTime || 'None'}
              </div>
            </div>
          </div>
        </section>

        {/* Dietary Restrictions */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold">Dietary Restrictions</h2>
          <div className="max-w-md">
            <Select
              value={dietaryRestriction}
              onValueChange={setDietaryRestriction}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose dietary preference" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Plant-Based</SelectLabel>
                  <SelectItem value="vegetarian">🥬 Vegetarian</SelectItem>
                  <SelectItem value="vegan">🌱 Vegan</SelectItem>
                  <SelectSeparator />
                  <SelectLabel>Dietary Restrictions</SelectLabel>
                  <SelectItem value="gluten-free">🌾 Gluten-Free</SelectItem>
                  <SelectItem value="dairy-free">🥛 Dairy-Free</SelectItem>
                  <SelectItem value="nut-free">🥜 Nut-Free</SelectItem>
                  <SelectItem value="low-carb">⚖️ Low-Carb</SelectItem>
                  <SelectItem value="keto">🥓 Keto</SelectItem>
                  <SelectSeparator />
                  <SelectLabel>Special Diets</SelectLabel>
                  <SelectItem value="paleo">🦴 Paleo</SelectItem>
                  <SelectItem value="mediterranean">
                    🫒 Mediterranean
                  </SelectItem>
                  <SelectItem value="whole30">💪 Whole30</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <div className="mt-2 text-sm text-gray-600">
              Selected: {dietaryRestriction || 'No restrictions'}
            </div>
          </div>
        </section>

        {/* Sort and Filter Options */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold">Sort & Filter Options</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <h3 className="mb-3 text-lg font-medium">Sort Recipes By</h3>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose sort order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">📅 Newest First</SelectItem>
                  <SelectItem value="oldest">📅 Oldest First</SelectItem>
                  <SelectItem value="popular">⭐ Most Popular</SelectItem>
                  <SelectItem value="rating">🏆 Highest Rated</SelectItem>
                  <SelectItem value="cook-time">
                    ⏱️ Shortest Cook Time
                  </SelectItem>
                  <SelectItem value="alphabetical">🔤 Alphabetical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <h3 className="mb-3 text-lg font-medium">Cuisine Type</h3>
              <Select value={cuisine} onValueChange={setCuisine}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose cuisine" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Popular Cuisines</SelectLabel>
                    <SelectItem value="italian">🇮🇹 Italian</SelectItem>
                    <SelectItem value="mexican">🇲🇽 Mexican</SelectItem>
                    <SelectItem value="chinese">🇨🇳 Chinese</SelectItem>
                    <SelectItem value="indian">🇮🇳 Indian</SelectItem>
                    <SelectItem value="japanese">🇯🇵 Japanese</SelectItem>
                    <SelectSeparator />
                    <SelectLabel>Regional</SelectLabel>
                    <SelectItem value="mediterranean">
                      🌊 Mediterranean
                    </SelectItem>
                    <SelectItem value="middle-eastern">
                      🕌 Middle Eastern
                    </SelectItem>
                    <SelectItem value="thai">🇹🇭 Thai</SelectItem>
                    <SelectItem value="french">🇫🇷 French</SelectItem>
                    <SelectItem value="american">🇺🇸 American</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Error State */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold">Error State</h2>
          <div className="max-w-md">
            <Select>
              <SelectTrigger error className="w-full">
                <SelectValue placeholder="Select required field" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="option1">Option 1</SelectItem>
                <SelectItem value="option2">Option 2</SelectItem>
                <SelectItem value="option3">Option 3</SelectItem>
              </SelectContent>
            </Select>
            <p className="mt-2 text-sm text-red-500">
              This field is required. Please make a selection.
            </p>
          </div>
        </section>

        {/* Disabled State */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold">Disabled State</h2>
          <div className="max-w-md">
            <Select disabled>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Disabled select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="option1">Option 1</SelectItem>
                <SelectItem value="option2">Option 2</SelectItem>
              </SelectContent>
            </Select>
            <p className="mt-2 text-sm text-gray-500">
              This select is disabled and cannot be interacted with.
            </p>
          </div>
        </section>

        {/* SelectField Examples */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold">SelectField Wrapper</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <SelectField
                label="Recipe Category"
                placeholder="Choose a category"
                required
              >
                <SelectItem value="breakfast">Breakfast</SelectItem>
                <SelectItem value="lunch">Lunch</SelectItem>
                <SelectItem value="dinner">Dinner</SelectItem>
                <SelectItem value="dessert">Dessert</SelectItem>
              </SelectField>
            </div>

            <div>
              <SelectField
                label="Difficulty Level"
                placeholder="Choose difficulty"
                error="Please select a difficulty level"
              >
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectField>
            </div>
          </div>
        </section>

        {/* Complete Form Example */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold">Complete Recipe Form</h2>
          <form
            onSubmit={handleFormSubmit}
            className="max-w-md space-y-6 rounded-lg border p-6"
          >
            <h3 className="text-lg font-semibold">Recipe Filter Form</h3>

            <SelectField
              label="Meal Type"
              placeholder="Select meal type"
              required
              error={formErrors.category}
              value={formData.category}
              onValueChange={(value: string) =>
                setFormData(prev => ({ ...prev, category: value }))
              }
            >
              <SelectGroup>
                <SelectLabel>Main Meals</SelectLabel>
                <SelectItem value="breakfast">Breakfast</SelectItem>
                <SelectItem value="lunch">Lunch</SelectItem>
                <SelectItem value="dinner">Dinner</SelectItem>
                <SelectSeparator />
                <SelectLabel>Other</SelectLabel>
                <SelectItem value="snack">Snack</SelectItem>
                <SelectItem value="dessert">Dessert</SelectItem>
              </SelectGroup>
            </SelectField>

            <SelectField
              label="Difficulty Level"
              placeholder="Select difficulty"
              required
              error={formErrors.difficulty}
              value={formData.difficulty}
              onValueChange={(value: string) =>
                setFormData(prev => ({ ...prev, difficulty: value }))
              }
            >
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
              <SelectItem value="expert">Expert</SelectItem>
            </SelectField>

            <SelectField
              label="Maximum Cook Time"
              placeholder="Any duration"
              value={formData.cookTime}
              onValueChange={(value: string) =>
                setFormData(prev => ({ ...prev, cookTime: value }))
              }
            >
              <SelectItem value="15">Under 15 minutes</SelectItem>
              <SelectItem value="30">15-30 minutes</SelectItem>
              <SelectItem value="60">30-60 minutes</SelectItem>
              <SelectItem value="120">1-2 hours</SelectItem>
              <SelectItem value="240">Over 2 hours</SelectItem>
            </SelectField>

            <SelectField
              label="Dietary Preferences"
              placeholder="No restrictions"
              value={formData.diet}
              onValueChange={(value: string) =>
                setFormData(prev => ({ ...prev, diet: value }))
              }
            >
              <SelectGroup>
                <SelectLabel>Plant-Based</SelectLabel>
                <SelectItem value="vegetarian">Vegetarian</SelectItem>
                <SelectItem value="vegan">Vegan</SelectItem>
                <SelectSeparator />
                <SelectLabel>Restrictions</SelectLabel>
                <SelectItem value="gluten-free">Gluten-Free</SelectItem>
                <SelectItem value="dairy-free">Dairy-Free</SelectItem>
                <SelectItem value="nut-free">Nut-Free</SelectItem>
              </SelectGroup>
            </SelectField>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
              >
                Apply Filters
              </button>
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    category: '',
                    difficulty: '',
                    cookTime: '',
                    diet: '',
                  });
                  setFormErrors({});
                }}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
              >
                Clear All
              </button>
            </div>

            {Object.keys(formData).some(
              key => formData[key as keyof typeof formData]
            ) && (
              <div className="rounded-md bg-gray-50 p-3">
                <h4 className="mb-2 text-sm font-medium">Current Selection:</h4>
                <ul className="text-sm text-gray-600">
                  {formData.category && <li>Category: {formData.category}</li>}
                  {formData.difficulty && (
                    <li>Difficulty: {formData.difficulty}</li>
                  )}
                  {formData.cookTime && (
                    <li>Cook Time: {formData.cookTime} minutes</li>
                  )}
                  {formData.diet && <li>Diet: {formData.diet}</li>}
                </ul>
              </div>
            )}
          </form>
        </section>

        {/* Usage Guidelines */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold">Usage Guidelines</h2>
          <div className="rounded-lg bg-gray-50 p-4">
            <h3 className="mb-2 font-medium">Best Practices</h3>
            <ul className="list-inside list-disc space-y-1 text-sm text-gray-700">
              <li>Use clear, descriptive placeholder text</li>
              <li>Group related options with SelectGroup and SelectLabel</li>
              <li>
                Include &quot;All&quot; or &quot;Any&quot; options for filter
                selects
              </li>
              <li>Use meaningful icons and emojis to enhance usability</li>
              <li>Provide immediate feedback for form validation</li>
              <li>
                Consider the SelectField wrapper for forms with labels and
                errors
              </li>
              <li>Use appropriate variants based on context and hierarchy</li>
              <li>Keep option lists focused and avoid overwhelming users</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
