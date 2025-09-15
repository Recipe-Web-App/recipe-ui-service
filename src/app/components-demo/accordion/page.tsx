'use client';

import React, { useState } from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  RecipeSection,
  RecipeIngredients,
  RecipeInstructions,
} from '@/components/ui/accordion';

// Sample recipe data
const sampleIngredients = [
  {
    id: '1',
    name: 'boneless chicken breasts',
    amount: '4',
    unit: 'pieces',
    category: 'protein',
    notes: 'about 6 oz each',
  },
  {
    id: '2',
    name: 'olive oil',
    amount: '3',
    unit: 'tbsp',
    category: 'cooking oils',
  },
  {
    id: '3',
    name: 'garlic cloves',
    amount: '4',
    unit: 'cloves',
    notes: 'minced',
    category: 'aromatics',
  },
  {
    id: '4',
    name: 'yellow onion',
    amount: '1',
    unit: 'large',
    notes: 'diced',
    category: 'aromatics',
  },
  {
    id: '5',
    name: 'bell peppers',
    amount: '2',
    unit: 'large',
    notes: 'red and yellow, sliced',
    category: 'vegetables',
  },
  {
    id: '6',
    name: 'cherry tomatoes',
    amount: '1',
    unit: 'cup',
    category: 'vegetables',
  },
  {
    id: '7',
    name: 'fresh basil',
    amount: '1/4',
    unit: 'cup',
    notes: 'chopped',
    category: 'herbs',
  },
  {
    id: '8',
    name: 'oregano',
    amount: '1',
    unit: 'tsp',
    category: 'spices',
  },
  {
    id: '9',
    name: 'paprika',
    amount: '1',
    unit: 'tsp',
    category: 'spices',
  },
  {
    id: '10',
    name: 'salt',
    amount: '1',
    unit: 'tsp',
    category: 'spices',
  },
  {
    id: '11',
    name: 'black pepper',
    amount: '1/2',
    unit: 'tsp',
    category: 'spices',
  },
  {
    id: '12',
    name: 'parmesan cheese',
    amount: '1/2',
    unit: 'cup',
    notes: 'grated',
    optional: true,
    category: 'dairy',
  },
];

const sampleInstructions = [
  {
    id: '1',
    step: 1,
    text: 'Preheat your oven to 425°F (220°C). Line a large baking sheet with parchment paper.',
    temperature: '425°F (220°C)',
    time: '5 min',
  },
  {
    id: '2',
    step: 2,
    text: 'Season chicken breasts with salt, pepper, oregano, and paprika on both sides. Let them rest at room temperature for 15 minutes.',
    time: '15 min',
    notes: 'Room temperature chicken cooks more evenly',
  },
  {
    id: '3',
    step: 3,
    text: 'Heat 2 tablespoons of olive oil in a large oven-safe skillet over medium-high heat.',
    temperature: 'Medium-high heat',
    time: '2 min',
  },
  {
    id: '4',
    step: 4,
    text: 'Add chicken breasts to the skillet and sear until golden brown, about 3-4 minutes per side. Remove and set aside.',
    time: '6-8 min',
    notes: "Don't move the chicken too early - let it develop a good sear",
  },
  {
    id: '5',
    step: 5,
    text: 'In the same skillet, add remaining olive oil, onions, and bell peppers. Sauté until softened, about 5-6 minutes.',
    time: '5-6 min',
  },
  {
    id: '6',
    step: 6,
    text: 'Add minced garlic and cook for another minute until fragrant.',
    time: '1 min',
    notes: 'Be careful not to burn the garlic',
  },
  {
    id: '7',
    step: 7,
    text: 'Add cherry tomatoes and fresh basil to the skillet. Return chicken to the pan, nestling it among the vegetables.',
    time: '2 min',
  },
  {
    id: '8',
    step: 8,
    text: 'Transfer the skillet to the preheated oven and bake for 15-20 minutes, or until chicken reaches an internal temperature of 165°F (74°C).',
    time: '15-20 min',
    temperature: '165°F (74°C) internal',
    notes: 'Use a meat thermometer to ensure doneness',
  },
  {
    id: '9',
    step: 9,
    text: 'Remove from oven and let rest for 5 minutes. Sprinkle with grated parmesan cheese if desired and serve immediately.',
    time: '5 min rest',
    notes: 'Resting allows juices to redistribute',
  },
];

export default function AccordionDemo() {
  const [checkedIngredients, setCheckedIngredients] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [accordionType, setAccordionType] = useState<'single' | 'multiple'>(
    'multiple'
  );
  const [accordionVariant, setAccordionVariant] = useState<
    'default' | 'outlined' | 'elevated' | 'minimal' | 'card'
  >('default');

  const handleIngredientCheck = (itemId: string, checked: boolean) => {
    setCheckedIngredients(prev =>
      checked ? [...prev, itemId] : prev.filter(id => id !== itemId)
    );
  };

  const handleStepClick = (stepNumber: number) => {
    setCurrentStep(stepNumber);
  };

  const handleCompleteStep = () => {
    if (currentStep < sampleInstructions.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const checkedCount = checkedIngredients.length;
  const totalIngredients = sampleIngredients.length;
  const completionPercentage = Math.round(
    (checkedCount / totalIngredients) * 100
  );

  return (
    <div className="container mx-auto max-w-6xl p-6">
      <div className="space-y-12">
        <div>
          <h1 className="mb-2 text-3xl font-bold">Accordion Component Demo</h1>
          <p className="text-gray-600">
            Interactive examples of accordion components for recipe ingredients,
            instructions, and other collapsible content sections.
          </p>
        </div>

        {/* Configuration Controls */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold">Configuration</h2>
          <div className="flex flex-wrap gap-4 rounded-lg border p-4">
            <div className="flex items-center gap-2">
              <label className="font-medium">Type:</label>
              <select
                value={accordionType}
                onChange={e =>
                  setAccordionType(e.target.value as 'single' | 'multiple')
                }
                className="rounded border px-3 py-1"
              >
                <option value="single">Single</option>
                <option value="multiple">Multiple</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="font-medium">Variant:</label>
              <select
                value={accordionVariant}
                onChange={e =>
                  setAccordionVariant(
                    e.target.value as
                      | 'default'
                      | 'outlined'
                      | 'elevated'
                      | 'minimal'
                      | 'card'
                  )
                }
                className="rounded border px-3 py-1"
              >
                <option value="default">Default</option>
                <option value="outlined">Outlined</option>
                <option value="elevated">Elevated</option>
                <option value="minimal">Minimal</option>
                <option value="card">Card</option>
              </select>
            </div>
          </div>
        </section>

        {/* Basic Accordion Examples */}
        <section>
          <h2 className="mb-6 text-2xl font-semibold">Basic Accordion</h2>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div>
              <h3 className="mb-4 font-medium">Single Selection</h3>
              <Accordion
                type="single"
                variant={accordionVariant}
                defaultValue="basic-1"
              >
                <AccordionItem value="basic-1">
                  <AccordionTrigger>Recipe Overview</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-700">
                      This Mediterranean-style chicken dish combines tender
                      chicken breasts with colorful vegetables and aromatic
                      herbs. Perfect for a healthy weeknight dinner that&rsquo;s
                      ready in under an hour.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="basic-2">
                  <AccordionTrigger>Cooking Time & Difficulty</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <div>
                        <strong>Prep Time:</strong> 20 minutes
                      </div>
                      <div>
                        <strong>Cook Time:</strong> 35 minutes
                      </div>
                      <div>
                        <strong>Total Time:</strong> 55 minutes
                      </div>
                      <div>
                        <strong>Difficulty:</strong> Intermediate
                      </div>
                      <div>
                        <strong>Serves:</strong> 4 people
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="basic-3">
                  <AccordionTrigger>Equipment Needed</AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-1 text-gray-700">
                      <li>• Large oven-safe skillet</li>
                      <li>• Cutting board</li>
                      <li>• Chef&rsquo;s knife</li>
                      <li>• Measuring cups and spoons</li>
                      <li>• Meat thermometer</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <div>
              <h3 className="mb-4 font-medium">Multiple Selection</h3>
              <Accordion
                type="multiple"
                variant={accordionVariant}
                defaultValue={['multi-1', 'multi-3']}
              >
                <AccordionItem value="multi-1">
                  <AccordionTrigger>Nutritional Benefits</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 text-gray-700">
                      <p>
                        <strong>High Protein:</strong> Excellent source of lean
                        protein from chicken
                      </p>
                      <p>
                        <strong>Antioxidants:</strong> Rich in vitamins from
                        colorful vegetables
                      </p>
                      <p>
                        <strong>Heart Healthy:</strong> Uses olive oil and
                        contains no trans fats
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="multi-2">
                  <AccordionTrigger>Dietary Information</AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-800">
                        Gluten-Free
                      </span>
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800">
                        Low-Carb
                      </span>
                      <span className="rounded-full bg-purple-100 px-3 py-1 text-sm text-purple-800">
                        Keto-Friendly
                      </span>
                      <span className="rounded-full bg-orange-100 px-3 py-1 text-sm text-orange-800">
                        Dairy-Free*
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-gray-600">
                      *Without optional parmesan cheese
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="multi-3">
                  <AccordionTrigger>Storage Instructions</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 text-gray-700">
                      <p>
                        <strong>Refrigerator:</strong> Store leftovers for up to
                        3-4 days
                      </p>
                      <p>
                        <strong>Freezer:</strong> Freeze for up to 3 months
                      </p>
                      <p>
                        <strong>Reheating:</strong> Reheat in oven at 350°F
                        until warmed through
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>

        {/* Complete Recipe Example */}
        <section>
          <h2 className="mb-6 text-2xl font-semibold">Complete Recipe</h2>
          <div className="max-w-4xl">
            <Accordion
              type={accordionType}
              variant={accordionVariant}
              defaultValue={
                accordionType === 'multiple'
                  ? ['ingredients', 'instructions']
                  : 'ingredients'
              }
            >
              <RecipeSection
                value="ingredients"
                title="Ingredients"
                section="ingredients"
                count={sampleIngredients.length}
              >
                <div className="mb-4 rounded-lg bg-green-100 p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-green-900">
                      Shopping Progress
                    </span>
                    <span className="text-sm text-green-700">
                      {checkedCount} of {totalIngredients} items (
                      {completionPercentage}%)
                    </span>
                  </div>
                  <div className="mt-2 h-2 w-full rounded-full bg-green-200">
                    <div
                      className="h-2 rounded-full bg-green-600 transition-all duration-300"
                      style={{ width: `${completionPercentage}%` }}
                    />
                  </div>
                </div>
                <RecipeIngredients
                  ingredients={sampleIngredients}
                  showCheckboxes={true}
                  checkedItems={checkedIngredients}
                  onItemCheck={handleIngredientCheck}
                  layout="default"
                />
              </RecipeSection>

              <RecipeSection
                value="instructions"
                title="Cooking Instructions"
                section="instructions"
                count={sampleInstructions.length}
              >
                <div className="mb-4 flex gap-2">
                  <button
                    onClick={handlePreviousStep}
                    disabled={currentStep <= 1}
                    className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:bg-gray-400"
                  >
                    Previous Step
                  </button>
                  <button
                    onClick={handleCompleteStep}
                    disabled={currentStep >= sampleInstructions.length}
                    className="rounded bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700 disabled:bg-gray-400"
                  >
                    Complete Step {currentStep}
                  </button>
                  <div className="flex items-center rounded bg-gray-100 px-3 py-2 text-sm">
                    Step {currentStep} of {sampleInstructions.length}
                  </div>
                </div>
                <RecipeInstructions
                  instructions={sampleInstructions}
                  currentStep={currentStep}
                  onStepClick={handleStepClick}
                  showStepNumbers={true}
                  layout="default"
                />
              </RecipeSection>

              <RecipeSection
                value="nutrition"
                title="Nutrition Facts"
                section="nutrition"
              >
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <div className="rounded-lg bg-purple-100 p-4 text-center">
                    <div className="text-2xl font-bold text-purple-900">
                      320
                    </div>
                    <div className="text-sm text-purple-700">Calories</div>
                  </div>
                  <div className="rounded-lg bg-purple-100 p-4 text-center">
                    <div className="text-2xl font-bold text-purple-900">
                      42g
                    </div>
                    <div className="text-sm text-purple-700">Protein</div>
                  </div>
                  <div className="rounded-lg bg-purple-100 p-4 text-center">
                    <div className="text-2xl font-bold text-purple-900">8g</div>
                    <div className="text-sm text-purple-700">Carbs</div>
                  </div>
                  <div className="rounded-lg bg-purple-100 p-4 text-center">
                    <div className="text-2xl font-bold text-purple-900">
                      15g
                    </div>
                    <div className="text-sm text-purple-700">Fat</div>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>Saturated Fat</span>
                      <span>3g</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cholesterol</span>
                      <span>95mg</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sodium</span>
                      <span>680mg</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>Fiber</span>
                      <span>3g</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sugar</span>
                      <span>6g</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Vitamin C</span>
                      <span>85mg</span>
                    </div>
                  </div>
                </div>
              </RecipeSection>

              <RecipeSection
                value="tips"
                title="Chef's Tips & Tricks"
                section="tips"
                count={5}
              >
                <div className="space-y-4">
                  <div className="flex gap-3 rounded-lg bg-orange-100 p-4">
                    <span className="text-2xl">🔥</span>
                    <div>
                      <h4 className="font-semibold text-orange-900">
                        Perfect Searing
                      </h4>
                      <p className="text-orange-800">
                        Don&rsquo;t move the chicken too early. Let it develop a
                        golden crust before flipping for the best flavor and
                        texture.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 rounded-lg bg-orange-100 p-4">
                    <span className="text-2xl">🌡️</span>
                    <div>
                      <h4 className="font-semibold text-orange-900">
                        Temperature Control
                      </h4>
                      <p className="text-orange-800">
                        Use a meat thermometer to ensure chicken reaches 165°F
                        internal temperature for food safety.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 rounded-lg bg-orange-100 p-4">
                    <span className="text-2xl">🥄</span>
                    <div>
                      <h4 className="font-semibold text-orange-900">
                        Prep Ahead
                      </h4>
                      <p className="text-orange-800">
                        You can season the chicken and prep all vegetables up to
                        24 hours in advance for easier cooking.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 rounded-lg bg-orange-100 p-4">
                    <span className="text-2xl">🍷</span>
                    <div>
                      <h4 className="font-semibold text-orange-900">
                        Wine Pairing
                      </h4>
                      <p className="text-orange-800">
                        Pairs beautifully with a crisp white wine like Sauvignon
                        Blanc or a light red like Pinot Noir.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 rounded-lg bg-orange-100 p-4">
                    <span className="text-2xl">🥗</span>
                    <div>
                      <h4 className="font-semibold text-orange-900">
                        Serving Suggestions
                      </h4>
                      <p className="text-orange-800">
                        Serve over rice, quinoa, or pasta. Also great with
                        crusty bread to soak up the delicious pan juices.
                      </p>
                    </div>
                  </div>
                </div>
              </RecipeSection>

              <RecipeSection
                value="variations"
                title="Recipe Variations"
                section="variations"
                count={4}
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg border border-pink-200 p-4">
                    <h4 className="mb-2 font-semibold text-pink-900">
                      🇲🇽 Mexican Style
                    </h4>
                    <p className="text-gray-700">
                      Add cumin, chili powder, and jalapeños. Serve with black
                      beans and avocado. Top with fresh cilantro and lime juice.
                    </p>
                  </div>
                  <div className="rounded-lg border border-pink-200 p-4">
                    <h4 className="mb-2 font-semibold text-pink-900">
                      🇮🇳 Indian Inspired
                    </h4>
                    <p className="text-gray-700">
                      Use garam masala, turmeric, and ginger. Add coconut milk
                      and serve over basmati rice with naan bread.
                    </p>
                  </div>
                  <div className="rounded-lg border border-pink-200 p-4">
                    <h4 className="mb-2 font-semibold text-pink-900">
                      🌱 Vegetarian Option
                    </h4>
                    <p className="text-gray-700">
                      Replace chicken with thick slices of eggplant or
                      portobello mushrooms. Add chickpeas for extra protein.
                    </p>
                  </div>
                  <div className="rounded-lg border border-pink-200 p-4">
                    <h4 className="mb-2 font-semibold text-pink-900">
                      🥥 Coconut Curry
                    </h4>
                    <p className="text-gray-700">
                      Add curry powder and coconut milk. Include sweet potatoes
                      and spinach for a complete one-pan meal.
                    </p>
                  </div>
                </div>
              </RecipeSection>

              <RecipeSection
                value="notes"
                title="Personal Notes"
                section="notes"
              >
                <div className="space-y-4">
                  <div className="rounded-lg border-2 border-dashed border-gray-300 p-6 text-center">
                    <p className="text-gray-500">
                      Add your personal notes, modifications, and cooking
                      observations here.
                    </p>
                    <button className="mt-2 rounded bg-yellow-500 px-4 py-2 text-sm text-white hover:bg-yellow-600">
                      Add Note
                    </button>
                  </div>
                  <div className="rounded-lg bg-yellow-50 p-4">
                    <div className="flex items-start gap-3">
                      <span className="text-yellow-600">📝</span>
                      <div>
                        <h5 className="font-medium text-yellow-900">
                          Sample Note
                        </h5>
                        <p className="text-sm text-yellow-800">
                          &ldquo;Used red wine instead of white and it was
                          delicious! The kids loved it too. Next time I&rsquo;ll
                          try adding some mushrooms.&rdquo; - Sarah, 2024
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </RecipeSection>
            </Accordion>
          </div>
        </section>

        {/* Usage Guidelines */}
        <section>
          <h2 className="mb-6 text-2xl font-semibold">Usage Guidelines</h2>
          <div className="rounded-lg border p-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div>
                <h3 className="mb-3 font-medium text-green-600">
                  ✅ Best Practices
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    • Use descriptive trigger text that clearly indicates
                    content
                  </li>
                  <li>• Group related information together logically</li>
                  <li>• Include item counts in section headers when helpful</li>
                  <li>
                    • Use recipe-specific sections for ingredients and
                    instructions
                  </li>
                  <li>
                    • Provide checkboxes for ingredients in shopping lists
                  </li>
                  <li>
                    • Show step numbers and timing in cooking instructions
                  </li>
                  <li>
                    • Consider multiple-type accordions for complex recipes
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="mb-3 font-medium text-red-600">❌ Avoid</h3>
                <ul className="space-y-2 text-sm">
                  <li>• Too many nested levels of accordions</li>
                  <li>• Vague or unclear trigger text</li>
                  <li>• Hiding critical information in collapsed sections</li>
                  <li>• Overusing accordions for simple content</li>
                  <li>• Inconsistent behavior between accordion instances</li>
                  <li>• Making accordions too narrow for content</li>
                  <li>
                    • Using accordions where tabs might be more appropriate
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
