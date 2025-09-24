'use client';

import React, { useState } from 'react';
import {
  Textarea,
  RecipeTextarea,
  AutoTextarea,
} from '@/components/ui/textarea';

// Sample recipe data for demonstrations
const sampleRecipeData = {
  description:
    'This Mediterranean-style chicken dish combines tender chicken breasts with colorful vegetables and aromatic herbs. Perfect for a healthy weeknight dinner that&rsquo;s ready in under an hour.',
  instructions:
    'Preheat oven to 375°F (190°C). Season chicken breasts with salt, pepper, and Mediterranean herbs. Heat olive oil in a large oven-safe skillet over medium-high heat. Sear chicken breasts for 3-4 minutes per side until golden brown. Add cherry tomatoes, bell peppers, and red onion to the skillet. Drizzle with olive oil and season with salt and pepper. Transfer skillet to preheated oven and bake for 15-20 minutes until chicken reaches internal temperature of 165°F (74°C). Remove from oven and let rest for 5 minutes. Garnish with fresh basil and serve immediately.',
  notes:
    'For best results, let the chicken rest at room temperature for 15 minutes before cooking. You can substitute chicken thighs for a more flavorful and juicy result.',
  tips: 'Don&rsquo;t move the chicken too early - let it develop a golden crust before flipping. The vegetables should still have a slight bite to them when done.',
  review:
    'Absolutely delicious! The flavors were perfectly balanced and the chicken was so tender. My family loved it and I&rsquo;ll definitely be making this again.',
};

export default function TextareaDemo() {
  // State for basic textarea demonstrations
  const [basicValue, setBasicValue] = useState('');
  const [validatedValue, setValidatedValue] = useState('');
  const [autoExpandValue, setAutoExpandValue] = useState('');

  // State for recipe form example
  const [recipeForm, setRecipeForm] = useState({
    description: '',
    instructions: '',
    notes: '',
    tips: '',
    review: '',
  });

  // State for configuration controls
  const [showCharCount, setShowCharCount] = useState(true);
  const [showWordCount, setShowWordCount] = useState(true);
  const [autoResize, setAutoResize] = useState(false);
  const [textareaVariant, setTextareaVariant] = useState<
    'default' | 'destructive' | 'success' | 'warning' | 'ghost'
  >('default');
  const [textareaSize, setTextareaSize] = useState<'sm' | 'default' | 'lg'>(
    'default'
  );

  const updateRecipeForm = (field: string, value: string) => {
    setRecipeForm(prev => ({ ...prev, [field]: value }));
  };

  const loadSampleData = () => {
    setRecipeForm({
      description: sampleRecipeData.description,
      instructions: sampleRecipeData.instructions,
      notes: sampleRecipeData.notes,
      tips: sampleRecipeData.tips,
      review: sampleRecipeData.review,
    });
  };

  const clearForm = () => {
    setRecipeForm({
      description: '',
      instructions: '',
      notes: '',
      tips: '',
      review: '',
    });
  };

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Textarea Components Demo
        </h1>
        <p className="text-gray-600">
          Interactive demonstration of textarea components for recipe
          descriptions and multi-line text input.
        </p>
      </div>

      <div className="space-y-12">
        {/* Basic Textarea Examples */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">
            Basic Textarea Components
          </h2>

          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-800">
                Standard Textarea
              </h3>

              <Textarea
                label="Recipe Description"
                placeholder="Describe your recipe..."
                value={basicValue}
                onChange={e => setBasicValue(e.target.value)}
                helperText="Write a brief description of your recipe"
                maxLength={200}
                showCharacterCount={showCharCount}
                variant={textareaVariant}
                size={textareaSize}
              />

              <Textarea
                label="Required Field Example"
                placeholder="This field is required"
                required
                errorMessage={
                  validatedValue.length === 0
                    ? 'This field cannot be empty'
                    : undefined
                }
                successMessage={
                  validatedValue.length >= 10
                    ? 'Great! This looks good'
                    : undefined
                }
                value={validatedValue}
                onChange={e => setValidatedValue(e.target.value)}
                showCharacterCount
              />

              <AutoTextarea
                label="Auto-Expanding Textarea"
                placeholder="Start typing and watch this expand..."
                value={autoExpandValue}
                onChange={e => setAutoExpandValue(e.target.value)}
                minRows={3}
                maxRows={8}
                helperText="This textarea grows as you type"
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800">
                Configuration
              </h3>

              <div className="space-y-4 rounded-lg bg-gray-50 p-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="showCharCount"
                    checked={showCharCount}
                    onChange={e => setShowCharCount(e.target.checked)}
                  />
                  <label
                    htmlFor="showCharCount"
                    className="text-sm font-medium"
                  >
                    Show Character Count
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <label className="font-medium">Variant:</label>
                  <select
                    value={textareaVariant}
                    onChange={e =>
                      setTextareaVariant(
                        e.target.value as typeof textareaVariant
                      )
                    }
                    className="rounded border px-3 py-1"
                  >
                    <option value="default">Default</option>
                    <option value="destructive">Destructive</option>
                    <option value="success">Success</option>
                    <option value="warning">Warning</option>
                    <option value="ghost">Ghost</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <label className="font-medium">Size:</label>
                  <select
                    value={textareaSize}
                    onChange={e =>
                      setTextareaSize(e.target.value as typeof textareaSize)
                    }
                    className="rounded border px-3 py-1"
                  >
                    <option value="sm">Small</option>
                    <option value="default">Default</option>
                    <option value="lg">Large</option>
                  </select>
                </div>

                <button
                  onClick={() => {
                    setBasicValue('');
                    setValidatedValue('');
                    setAutoExpandValue('');
                  }}
                  className="w-full rounded bg-gray-200 px-4 py-2 text-gray-800 transition-colors hover:bg-gray-300"
                >
                  Clear All Fields
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Recipe Textarea Examples */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">
            Recipe-Specific Textareas
          </h2>

          <div className="space-y-6">
            <div className="mb-6 flex gap-4">
              <button
                onClick={loadSampleData}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
              >
                Load Sample Data
              </button>
              <button
                onClick={clearForm}
                className="rounded-lg bg-gray-500 px-4 py-2 text-white transition-colors hover:bg-gray-600"
              >
                Clear Form
              </button>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-6">
                <RecipeTextarea
                  type="description"
                  label="Recipe Description"
                  required
                  showCharacterCount={showCharCount}
                  maxLength={500}
                  value={recipeForm.description}
                  onChange={e =>
                    updateRecipeForm('description', e.target.value)
                  }
                  helperText="Describe what makes this recipe special"
                />

                <RecipeTextarea
                  type="instructions"
                  label="Cooking Instructions"
                  required
                  showWordCount={showWordCount}
                  minWords={20}
                  autoResize={autoResize}
                  value={recipeForm.instructions}
                  onChange={e =>
                    updateRecipeForm('instructions', e.target.value)
                  }
                  helperText="Provide clear, step-by-step instructions"
                />

                <RecipeTextarea
                  type="notes"
                  label="Chef&rsquo;s Notes"
                  showCharacterCount={showCharCount}
                  maxLength={300}
                  value={recipeForm.notes}
                  onChange={e => updateRecipeForm('notes', e.target.value)}
                  helperText="Tips, substitutions, or observations"
                />
              </div>

              <div className="space-y-6">
                <RecipeTextarea
                  type="tips"
                  label="Pro Tips"
                  showWordCount={showWordCount}
                  maxWords={50}
                  value={recipeForm.tips}
                  onChange={e => updateRecipeForm('tips', e.target.value)}
                  helperText="Share cooking tricks and techniques"
                />

                <RecipeTextarea
                  type="review"
                  label="Your Experience"
                  showWordCount={showWordCount}
                  minWords={5}
                  maxWords={100}
                  value={recipeForm.review}
                  onChange={e => updateRecipeForm('review', e.target.value)}
                  helperText="How did this recipe turn out?"
                />

                <div className="space-y-4 rounded-lg bg-gray-50 p-4">
                  <h4 className="font-medium text-gray-800">Recipe Options</h4>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="showWordCountRecipe"
                        checked={showWordCount}
                        onChange={e => setShowWordCount(e.target.checked)}
                      />
                      <label
                        htmlFor="showWordCountRecipe"
                        className="text-sm font-medium"
                      >
                        Show Word Count
                      </label>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="autoResizeRecipe"
                        checked={autoResize}
                        onChange={e => setAutoResize(e.target.checked)}
                      />
                      <label
                        htmlFor="autoResizeRecipe"
                        className="text-sm font-medium"
                      >
                        Auto Resize
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Validation Examples */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">
            Validation Examples
          </h2>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800">
                Character Limits
              </h3>

              <Textarea
                label="Short Description"
                placeholder="Keep it brief..."
                maxLength={50}
                showCharacterCount
                helperText="Maximum 50 characters"
                defaultValue="This description is getting close to the limit"
              />

              <RecipeTextarea
                type="notes"
                label="Quick Notes"
                maxLength={100}
                showCharacterCount
                defaultValue="These are some quick notes about the recipe that might exceed the character limit if I keep typing..."
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800">
                Word Count Validation
              </h3>

              <RecipeTextarea
                type="instructions"
                label="Brief Instructions"
                showWordCount
                minWords={10}
                maxWords={25}
                defaultValue="Heat oil. Add chicken. Cook until done."
                helperText="Instructions need 10-25 words"
              />

              <RecipeTextarea
                type="review"
                label="Quick Review"
                showWordCount
                minWords={5}
                maxWords={20}
                defaultValue="Great recipe!"
                helperText="Share your experience in 5-20 words"
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800">
                Error States
              </h3>

              <Textarea
                label="Required Field"
                placeholder="This field is required"
                required
                errorMessage="This field cannot be empty"
                defaultValue=""
              />

              <Textarea
                label="Invalid Input"
                placeholder="Valid input only"
                errorMessage="Please enter valid information"
                defaultValue="Invalid data"
              />
            </div>
          </div>
        </section>

        {/* Live Recipe Form Preview */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">
            Complete Recipe Form
          </h2>

          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="grid gap-6">
              <div className="text-center">
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  Create New Recipe
                </h3>
                <p className="text-gray-600">
                  Fill out the form below to create a new recipe
                </p>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-6">
                  <RecipeTextarea
                    type="description"
                    label="Recipe Description"
                    required
                    showCharacterCount
                    maxLength={500}
                    value={recipeForm.description}
                    onChange={e =>
                      updateRecipeForm('description', e.target.value)
                    }
                  />

                  <RecipeTextarea
                    type="instructions"
                    label="Cooking Instructions"
                    required
                    showWordCount
                    minWords={20}
                    autoResize
                    value={recipeForm.instructions}
                    onChange={e =>
                      updateRecipeForm('instructions', e.target.value)
                    }
                  />
                </div>

                <div className="space-y-6">
                  <RecipeTextarea
                    type="notes"
                    label="Chef&rsquo;s Notes"
                    showCharacterCount
                    maxLength={300}
                    value={recipeForm.notes}
                    onChange={e => updateRecipeForm('notes', e.target.value)}
                  />

                  <RecipeTextarea
                    type="tips"
                    label="Pro Tips"
                    showWordCount
                    maxWords={50}
                    value={recipeForm.tips}
                    onChange={e => updateRecipeForm('tips', e.target.value)}
                  />

                  <RecipeTextarea
                    type="review"
                    label="Your Experience"
                    showWordCount
                    minWords={5}
                    maxWords={100}
                    value={recipeForm.review}
                    onChange={e => updateRecipeForm('review', e.target.value)}
                  />
                </div>
              </div>

              <div className="border-t pt-6">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Form completion:{' '}
                    {Object.values(recipeForm).filter(v => v.length > 0).length}
                    /5 fields
                  </div>
                  <div className="flex gap-3">
                    <button className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50">
                      Save Draft
                    </button>
                    <button
                      className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={
                        !recipeForm.description || !recipeForm.instructions
                      }
                    >
                      Publish Recipe
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Component Information */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">
            Component Features
          </h2>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg bg-blue-50 p-6">
              <h3 className="mb-2 font-semibold text-blue-900">
                Base Textarea
              </h3>
              <ul className="space-y-1 text-sm text-blue-800">
                <li>• Standard form styling</li>
                <li>• Character counting</li>
                <li>• Validation states</li>
                <li>• Multiple sizes</li>
                <li>• Helper text support</li>
              </ul>
            </div>

            <div className="rounded-lg bg-green-50 p-6">
              <h3 className="mb-2 font-semibold text-green-900">
                Recipe Textarea
              </h3>
              <ul className="space-y-1 text-sm text-green-800">
                <li>• Recipe-specific themes</li>
                <li>• Word count validation</li>
                <li>• Contextual placeholders</li>
                <li>• Auto-resize option</li>
                <li>• Enhanced validation</li>
              </ul>
            </div>

            <div className="rounded-lg bg-purple-50 p-6">
              <h3 className="mb-2 font-semibold text-purple-900">
                Auto Textarea
              </h3>
              <ul className="space-y-1 text-sm text-purple-800">
                <li>• Dynamic height adjustment</li>
                <li>• Min/max row limits</li>
                <li>• Smooth transitions</li>
                <li>• No manual resize needed</li>
                <li>• Performance optimized</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
