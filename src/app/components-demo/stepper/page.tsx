'use client';

import React, { useState } from 'react';
import {
  Stepper,
  StepIndicator,
  RecipeStepper,
  CookingStepper,
  CookingTimer,
} from '@/components/ui/stepper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Icon } from '@/components/ui/icon';
import type {
  StepperStep,
  RecipeWorkflowStep,
  RecipeInstruction,
  RecipeIngredient,
} from '@/types/ui/stepper';

export default function StepperDemoPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [currentBasicStep, setCurrentBasicStep] = useState('step1');
  const [currentRecipeStep] = useState('basic');
  const [currentCookingStep, setCurrentCookingStep] = useState(0);

  // Copy to clipboard function
  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  // Basic stepper example data
  const basicSteps: StepperStep[] = [
    {
      id: 'step1',
      title: 'Account Setup',
      description: 'Create your account and verify email',
      icon: 'user',
      estimatedTime: '2 min',
      content: (
        <div className="space-y-4">
          <Input placeholder="Enter your email" />
          <Input placeholder="Create a password" type="password" />
          <Button className="w-full">Create Account</Button>
        </div>
      ),
    },
    {
      id: 'step2',
      title: 'Profile Information',
      description: 'Tell us about yourself and your cooking preferences',
      icon: 'settings',
      estimatedTime: '3 min',
      content: (
        <div className="space-y-4">
          <Input placeholder="First Name" />
          <Input placeholder="Last Name" />
          <Textarea placeholder="Tell us about your cooking experience..." />
        </div>
      ),
    },
    {
      id: 'step3',
      title: 'Preferences',
      description: 'Set your dietary preferences and cooking goals',
      icon: 'heart',
      estimatedTime: '2 min',
      isOptional: true,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" />
              Vegetarian
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" />
              Vegan
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" />
              Gluten-Free
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" />
              Low-Carb
            </label>
          </div>
        </div>
      ),
    },
    {
      id: 'step4',
      title: 'Complete',
      description: 'Review your information and finish setup',
      icon: 'check',
      estimatedTime: '1 min',
      content: (
        <div className="space-y-4 text-center">
          <Icon name="check" size="lg" className="mx-auto text-green-600" />
          <h3 className="text-lg font-semibold">
            Account Created Successfully!
          </h3>
          <p className="text-muted-foreground">
            Welcome to the recipe platform. You can now start exploring recipes
            and creating your own.
          </p>
          <Button className="w-full">Get Started</Button>
        </div>
      ),
    },
  ];

  // Recipe creation workflow steps
  const recipeSteps: RecipeWorkflowStep[] = [
    {
      id: 'basic',
      title: 'Basic Information',
      description: 'Recipe title, description, and basic details',
      category: 'basic',
      icon: 'file-text',
      estimatedTime: '3 min',
      content: (
        <div className="space-y-4">
          <Input placeholder="Recipe Title" />
          <Textarea placeholder="Describe your recipe..." />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Input placeholder="Cuisine Type" />
            <Input placeholder="Difficulty" />
            <Input placeholder="Servings" type="number" />
          </div>
        </div>
      ),
    },
    {
      id: 'ingredients',
      title: 'Ingredients',
      description: 'Add ingredients with quantities and units',
      category: 'ingredients',
      icon: 'shopping-cart',
      estimatedTime: '5 min',
      content: (
        <div className="space-y-4">
          <div className="rounded-lg border p-4">
            <h4 className="mb-3 font-medium">Add Ingredients</h4>
            <div className="mb-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
              <Input placeholder="Amount" />
              <Input placeholder="Unit" />
              <Input placeholder="Ingredient" className="col-span-2" />
            </div>
            <Button size="sm" variant="outline" className="w-full">
              Add Ingredient
            </Button>
          </div>
        </div>
      ),
    },
    {
      id: 'instructions',
      title: 'Instructions',
      description: 'Step-by-step cooking instructions',
      category: 'instructions',
      icon: 'list',
      estimatedTime: '7 min',
      content: (
        <div className="space-y-4">
          <div className="rounded-lg border p-4">
            <h4 className="mb-3 font-medium">Cooking Steps</h4>
            <Textarea
              placeholder="Describe the first step in detail..."
              className="mb-2"
            />
            <div className="mb-2 grid grid-cols-2 gap-2">
              <Input placeholder="Duration (minutes)" type="number" />
              <Input placeholder="Temperature (°F)" type="number" />
            </div>
            <Button size="sm" variant="outline" className="w-full">
              Add Step
            </Button>
          </div>
        </div>
      ),
    },
    {
      id: 'details',
      title: 'Additional Details',
      description: 'Timing, tags, and photos',
      category: 'details',
      icon: 'clock',
      estimatedTime: '4 min',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Input placeholder="Prep Time (min)" type="number" />
            <Input placeholder="Cook Time (min)" type="number" />
            <Input placeholder="Total Time (min)" type="number" />
          </div>
          <Input placeholder="Tags (comma separated)" />
          <div className="border-muted rounded-lg border-2 border-dashed p-8 text-center">
            <Icon
              name="image"
              size="lg"
              className="text-muted-foreground mx-auto mb-2"
            />
            <p className="text-muted-foreground">Add recipe photos</p>
          </div>
        </div>
      ),
    },
    {
      id: 'review',
      title: 'Review & Publish',
      description: 'Review your recipe and publish',
      category: 'review',
      icon: 'eye',
      estimatedTime: '2 min',
      content: (
        <div className="space-y-4">
          <div className="rounded-lg border p-4">
            <h4 className="mb-2 font-medium">Recipe Summary</h4>
            <p className="text-muted-foreground mb-4 text-sm">
              Review all the information before publishing your recipe.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Title:</span>
                <span className="font-medium">Not specified</span>
              </div>
              <div className="flex justify-between">
                <span>Ingredients:</span>
                <span className="font-medium">0 added</span>
              </div>
              <div className="flex justify-between">
                <span>Instructions:</span>
                <span className="font-medium">0 steps</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1">
              Save as Draft
            </Button>
            <Button className="flex-1">Publish Recipe</Button>
          </div>
        </div>
      ),
    },
  ];

  // Cooking instructions example
  const cookingInstructions: RecipeInstruction[] = [
    {
      id: 'prep',
      stepNumber: 1,
      instruction:
        'Heat a large pot of salted water over high heat. While water is heating, prepare your ingredients: dice the pancetta, grate the Parmesan cheese, and separate the egg yolks.',
      duration: 5,
      equipment: ['Large pot', 'Cutting board', 'Sharp knife', 'Grater'],
      tips: 'Use room temperature eggs for the best texture in your carbonara.',
    },
    {
      id: 'pasta',
      stepNumber: 2,
      instruction:
        'Add pasta to the boiling water and cook according to package directions until al dente. Reserve 1 cup of pasta water before draining.',
      duration: 10,
      equipment: ['Colander', 'Measuring cup'],
      tips: 'The starchy pasta water is crucial for creating the creamy sauce.',
    },
    {
      id: 'pancetta',
      stepNumber: 3,
      instruction:
        'While pasta cooks, heat a large skillet over medium heat. Add pancetta and cook until crispy and golden, about 5-7 minutes.',
      duration: 7,
      equipment: ['Large skillet'],
      tips: "Don't add oil - the pancetta will render its own fat.",
    },
    {
      id: 'sauce',
      stepNumber: 4,
      instruction:
        'In a large bowl, whisk together egg yolks, grated Parmesan, and black pepper. Slowly add hot pasta water while whisking to temper the eggs.',
      duration: 3,
      equipment: ['Large bowl', 'Whisk'],
      tips: 'Add the hot water slowly to prevent scrambling the eggs.',
    },
    {
      id: 'combine',
      stepNumber: 5,
      instruction:
        'Add the drained pasta to the skillet with pancetta. Remove from heat and quickly toss with the egg mixture until creamy. Add more pasta water if needed.',
      duration: 2,
      equipment: ['Tongs'],
      tips: 'Work quickly and off the heat to create a silky sauce.',
    },
    {
      id: 'serve',
      stepNumber: 6,
      instruction:
        'Serve immediately with additional Parmesan cheese and freshly cracked black pepper. Garnish with fresh parsley if desired.',
      duration: 1,
      tips: 'Carbonara is best served immediately while hot and creamy.',
    },
  ];

  // Sample ingredients for cooking mode
  const sampleIngredients: RecipeIngredient[] = [
    { id: '1', name: 'Spaghetti', amount: 1, unit: 'lb' },
    { id: '2', name: 'Pancetta', amount: 6, unit: 'oz', notes: 'diced' },
    {
      id: '3',
      name: 'Large eggs',
      amount: 4,
      unit: 'whole',
      notes: 'room temperature',
    },
    {
      id: '4',
      name: 'Parmesan cheese',
      amount: 1,
      unit: 'cup',
      notes: 'freshly grated',
    },
    {
      id: '5',
      name: 'Black pepper',
      amount: 1,
      unit: 'tsp',
      notes: 'freshly cracked',
    },
  ];

  return (
    <div className="w-full max-w-none space-y-12 px-4 py-8">
      {/* Header */}
      <div>
        <h1 className="mb-2 text-4xl font-bold">Stepper System</h1>
        <p className="text-muted-foreground text-lg">
          Multi-step process components for wizards, workflows, and guided
          experiences
        </p>
      </div>

      {/* Quick Start Examples */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Quick Start Examples</h2>
        <div className="bg-card rounded-lg border p-6">
          <div className="space-y-6">
            {/* Basic Horizontal Stepper */}
            <div>
              <h3 className="mb-3 text-lg font-medium">
                Basic Horizontal Stepper
              </h3>
              <div className="space-y-4">
                <div className="min-h-32 w-full overflow-x-auto">
                  <Stepper
                    steps={basicSteps}
                    currentStep={currentBasicStep}
                    orientation="horizontal"
                    allowNonLinear={true}
                    onStepChange={setCurrentBasicStep}
                  />
                </div>

                <pre
                  className="bg-muted hover:bg-muted/80 mt-2 cursor-pointer rounded p-2 text-xs"
                  onClick={() =>
                    copyToClipboard(`<Stepper
  steps={steps}
  orientation="horizontal"
  allowNonLinear={true}
  onStepChange={setCurrentStep}
/>`)
                  }
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      copyToClipboard(`<Stepper
  steps={steps}
  orientation="horizontal"
  allowNonLinear={true}
  onStepChange={setCurrentStep}
/>`);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label="Copy basic stepper code"
                >
                  {`<Stepper
  steps={steps}
  orientation="horizontal"
  allowNonLinear={true}
  onStepChange={setCurrentStep}
/>`}
                </pre>
              </div>
            </div>

            {/* Vertical Stepper */}
            <div>
              <h3 className="mb-3 text-lg font-medium">Vertical Stepper</h3>
              <div className="space-y-4">
                <div className="max-h-96 overflow-y-auto">
                  <Stepper
                    steps={basicSteps.slice(0, 3)}
                    orientation="vertical"
                    variant="bordered"
                    currentStep="step2"
                  />
                </div>

                <pre
                  className="bg-muted hover:bg-muted/80 mt-2 cursor-pointer rounded p-2 text-xs"
                  onClick={() =>
                    copyToClipboard(`<Stepper
  steps={steps}
  orientation="vertical"
  variant="bordered"
  currentStep="step2"
/>`)
                  }
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      copyToClipboard(`<Stepper
  steps={steps}
  orientation="vertical"
  variant="bordered"
  currentStep="step2"
/>`);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label="Copy vertical stepper code"
                >
                  {`<Stepper
  steps={steps}
  orientation="vertical"
  variant="bordered"
  currentStep="step2"
/>`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Size Variants */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Size Variants</h2>
        <div className="bg-card rounded-lg border p-6">
          <div className="space-y-6">
            <div>
              <h3 className="mb-3 text-lg font-medium">Small</h3>
              <Stepper
                steps={basicSteps.slice(0, 3)}
                size="sm"
                currentStep="step2"
              />
            </div>

            <div>
              <h3 className="mb-3 text-lg font-medium">Default</h3>
              <Stepper
                steps={basicSteps.slice(0, 3)}
                size="default"
                currentStep="step2"
              />
            </div>

            <div>
              <h3 className="mb-3 text-lg font-medium">Large</h3>
              <Stepper
                steps={basicSteps.slice(0, 3)}
                size="lg"
                currentStep="step2"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Step Variants */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Step Indicator Variants</h2>
        <div className="bg-card rounded-lg border p-6">
          <div className="space-y-6">
            <div>
              <h3 className="mb-3 text-lg font-medium">Numbered (Default)</h3>
              <div className="flex items-center gap-4">
                <StepIndicator state="pending" stepNumber={1} />
                <StepIndicator state="active" stepNumber={2} />
                <StepIndicator state="completed" stepNumber={3} />
                <StepIndicator state="error" stepNumber={4} />
                <StepIndicator state="skipped" stepNumber={5} />
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-lg font-medium">Dotted</h3>
              <div className="flex items-center gap-4">
                <StepIndicator state="pending" variant="dotted" />
                <StepIndicator state="active" variant="dotted" />
                <StepIndicator state="completed" variant="dotted" />
                <StepIndicator state="error" variant="dotted" />
                <StepIndicator state="skipped" variant="dotted" />
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-lg font-medium">Icon</h3>
              <div className="flex items-center gap-4">
                <StepIndicator state="pending" variant="icon" icon="user" />
                <StepIndicator state="active" variant="icon" icon="settings" />
                <StepIndicator state="completed" variant="icon" icon="check" />
                <StepIndicator state="error" variant="icon" icon="x" />
                <StepIndicator state="skipped" variant="icon" icon="minus" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recipe Creation Stepper */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Recipe Creation Stepper</h2>
        <div className="bg-card rounded-lg border p-6">
          <RecipeStepper
            workflow="creation"
            steps={recipeSteps}
            currentStep={currentRecipeStep}
            onStepComplete={(stepId, data) => {
              console.log('Step completed:', stepId, data);
            }}
            onSave={data => {
              console.log('Recipe saved:', data);
            }}
            onPublish={data => {
              console.log('Recipe published:', data);
            }}
          />

          <pre
            className="bg-muted hover:bg-muted/80 mt-4 cursor-pointer rounded p-2 text-xs"
            onClick={() =>
              copyToClipboard(`<RecipeStepper
  workflow="creation"
  steps={recipeSteps}
  currentStep={currentStep}
  onStepComplete={(stepId, data) => console.log('Step completed')}
  onSave={(data) => console.log('Recipe saved')}
  onPublish={(data) => console.log('Recipe published')}
/>`)
            }
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                copyToClipboard(`<RecipeStepper
  workflow="creation"
  steps={recipeSteps}
  currentStep={currentStep}
  onStepComplete={(stepId, data) => console.log('Step completed')}
  onSave={(data) => console.log('Recipe saved')}
  onPublish={(data) => console.log('Recipe published')}
/>`);
              }
            }}
            tabIndex={0}
            role="button"
            aria-label="Copy recipe stepper code"
          >
            {`<RecipeStepper
  workflow="creation"
  steps={recipeSteps}
  currentStep={currentStep}
  onStepComplete={(stepId, data) => console.log('Step completed')}
  onSave={(data) => console.log('Recipe saved')}
  onPublish={(data) => console.log('Recipe published')}
/>`}
          </pre>
        </div>
      </section>

      {/* Cooking Mode Stepper */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Cooking Mode Stepper</h2>
        <div className="bg-card rounded-lg border p-6">
          <CookingStepper
            instructions={cookingInstructions}
            currentStep={currentCookingStep}
            showTimers={true}
            showIngredients={true}
            ingredients={sampleIngredients}
            onTimerComplete={stepNumber => {
              console.log(`Timer completed for step ${stepNumber}`);
            }}
            onStepComplete={stepNumber => {
              setCurrentCookingStep(stepNumber + 1);
            }}
          />

          <pre
            className="bg-muted hover:bg-muted/80 mt-4 cursor-pointer rounded p-2 text-xs"
            onClick={() =>
              copyToClipboard(`<CookingStepper
  instructions={cookingInstructions}
  currentStep={currentStep}
  showTimers={true}
  showIngredients={true}
  ingredients={ingredients}
  onTimerComplete={(stepNumber) => console.log('Timer completed')}
  onStepComplete={(stepNumber) => setCurrentStep(stepNumber + 1)}
/>`)
            }
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                copyToClipboard(`<CookingStepper
  instructions={cookingInstructions}
  currentStep={currentStep}
  showTimers={true}
  showIngredients={true}
  ingredients={ingredients}
  onTimerComplete={(stepNumber) => console.log('Timer completed')}
  onStepComplete={(stepNumber) => setCurrentStep(stepNumber + 1)}
/>`);
              }
            }}
            tabIndex={0}
            role="button"
            aria-label="Copy cooking stepper code"
          >
            {`<CookingStepper
  instructions={cookingInstructions}
  currentStep={currentStep}
  showTimers={true}
  showIngredients={true}
  ingredients={ingredients}
  onTimerComplete={(stepNumber) => console.log('Timer completed')}
  onStepComplete={(stepNumber) => setCurrentStep(stepNumber + 1)}
/>`}
          </pre>
        </div>
      </section>

      {/* Cooking Timer */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Cooking Timer</h2>
        <div className="bg-card rounded-lg border p-6">
          <div className="space-y-4">
            <h3 className="mb-3 text-lg font-medium">Interactive Timer</h3>
            <div className="space-y-3">
              <CookingTimer
                duration={180}
                label="Boil Pasta"
                onComplete={() => console.log('Pasta timer completed!')}
                onStart={() => console.log('Timer started')}
                onPause={() => console.log('Timer paused')}
                onReset={() => console.log('Timer reset')}
              />

              <CookingTimer
                duration={420}
                label="Simmer Sauce"
                state="running"
              />

              <CookingTimer duration={60} label="Rest Meat" state="completed" />
            </div>

            <pre
              className="bg-muted hover:bg-muted/80 mt-4 cursor-pointer rounded p-2 text-xs"
              onClick={() =>
                copyToClipboard(`<CookingTimer
  duration={180}
  label="Boil Pasta"
  onComplete={() => console.log('Timer completed!')}
  onStart={() => console.log('Timer started')}
/>`)
              }
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  copyToClipboard(`<CookingTimer
  duration={180}
  label="Boil Pasta"
  onComplete={() => console.log('Timer completed!')}
  onStart={() => console.log('Timer started')}
/>`);
                }
              }}
              tabIndex={0}
              role="button"
              aria-label="Copy cooking timer code"
            >
              {`<CookingTimer
  duration={180}
  label="Boil Pasta"
  onComplete={() => console.log('Timer completed!')}
  onStart={() => console.log('Timer started')}
/>`}
            </pre>
          </div>
        </div>
      </section>

      {/* Workflow Variants */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Recipe Workflow Variants</h2>
        <div className="bg-card rounded-lg border p-6">
          <div className="space-y-6">
            <div>
              <h3 className="mb-3 text-lg font-medium">Creation Workflow</h3>
              <RecipeStepper
                workflow="creation"
                steps={recipeSteps.slice(0, 3)}
                currentStep="basic"
                emphasis="subtle"
              />
            </div>

            <div>
              <h3 className="mb-3 text-lg font-medium">Cooking Workflow</h3>
              <RecipeStepper
                workflow="cooking"
                steps={[
                  {
                    id: 'prep',
                    title: 'Preparation',
                    description: 'Gather ingredients and equipment',
                    category: 'basic',
                    icon: 'chef-hat',
                  },
                  {
                    id: 'cook',
                    title: 'Cooking',
                    description: 'Follow the recipe instructions',
                    category: 'instructions',
                    icon: 'flame',
                  },
                  {
                    id: 'serve',
                    title: 'Serving',
                    description: 'Plate and serve the dish',
                    category: 'details',
                    icon: 'utensils',
                  },
                ]}
                currentStep="prep"
                emphasis="normal"
              />
            </div>

            <div>
              <h3 className="mb-3 text-lg font-medium">Planning Workflow</h3>
              <RecipeStepper
                workflow="planning"
                steps={[
                  {
                    id: 'browse',
                    title: 'Browse Recipes',
                    description: 'Find recipes for your meal plan',
                    category: 'basic',
                    icon: 'search',
                  },
                  {
                    id: 'schedule',
                    title: 'Schedule Meals',
                    description: 'Assign recipes to specific days',
                    category: 'details',
                    icon: 'calendar',
                  },
                  {
                    id: 'shopping',
                    title: 'Shopping List',
                    description: 'Generate and review shopping list',
                    category: 'ingredients',
                    icon: 'shopping-cart',
                  },
                ]}
                currentStep="browse"
                emphasis="strong"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Copy Feedback */}
      {copiedCode && (
        <div className="fixed right-4 bottom-4 rounded-lg bg-green-600 px-4 py-2 text-white shadow-lg">
          Code copied to clipboard!
        </div>
      )}

      {/* Usage Guidelines */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Usage Guidelines</h2>
        <div className="bg-card rounded-lg border p-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="mb-2 text-lg font-medium">Best Practices</h3>
              <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
                <li>Use steppers for workflows with 3+ steps</li>
                <li>Keep step titles concise and descriptive</li>
                <li>Provide estimated time for each step</li>
                <li>Use icons to improve visual hierarchy</li>
                <li>Include validation for required steps</li>
                <li>Support both linear and non-linear navigation</li>
                <li>Persist state for longer workflows</li>
              </ul>
            </div>

            <div>
              <h3 className="mb-2 text-lg font-medium">Recipe App Patterns</h3>
              <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
                <li>Use RecipeStepper for recipe creation workflows</li>
                <li>Implement CookingStepper for guided cooking</li>
                <li>Include timers for time-sensitive steps</li>
                <li>Show ingredient checklists during cooking</li>
                <li>Support draft saving for recipe creation</li>
                <li>Use workflow variants for different contexts</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* API Reference */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">API Reference</h2>
        <div className="bg-card rounded-lg border p-6">
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 font-medium">Stepper Props</h3>
              <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
                <li>
                  <code>steps</code> - Array of step objects with content
                </li>
                <li>
                  <code>orientation</code> - horizontal, vertical
                </li>
                <li>
                  <code>variant</code> - default, compact, elevated, bordered
                </li>
                <li>
                  <code>size</code> - sm, default, lg
                </li>
                <li>
                  <code>allowNonLinear</code> - Enable jumping between steps
                </li>
                <li>
                  <code>persistState</code> - Save progress in localStorage
                </li>
                <li>
                  <code>showProgress</code> - Display linear progress bar
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-2 font-medium">RecipeStepper Props</h3>
              <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
                <li>
                  <code>workflow</code> - creation, cooking, planning, importing
                </li>
                <li>
                  <code>emphasis</code> - subtle, normal, strong
                </li>
                <li>
                  <code>recipeData</code> - Recipe context data
                </li>
                <li>
                  <code>onStepComplete</code> - Step completion handler
                </li>
                <li>
                  <code>onSave</code> - Draft save handler
                </li>
                <li>
                  <code>onPublish</code> - Recipe publish handler
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-2 font-medium">CookingStepper Props</h3>
              <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
                <li>
                  <code>instructions</code> - Array of cooking instructions
                </li>
                <li>
                  <code>showTimers</code> - Display cooking timers
                </li>
                <li>
                  <code>showIngredients</code> - Show ingredient checklist
                </li>
                <li>
                  <code>ingredients</code> - Recipe ingredients array
                </li>
                <li>
                  <code>onTimerComplete</code> - Timer completion handler
                </li>
                <li>
                  <code>onStepComplete</code> - Cooking step completion handler
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
