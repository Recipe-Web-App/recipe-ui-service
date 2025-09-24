'use client';

import React, { useState } from 'react';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
  RecipeBreadcrumb,
} from '@/components/ui/breadcrumb';
// Removed unused Card imports
import { Icon } from '@/components/ui/icon';
import type {
  BreadcrumbItem as BreadcrumbItemType,
  RecipeWorkflowItem,
} from '@/types/ui/breadcrumb';

export default function BreadcrumbDemoPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [currentWorkflowStep, setCurrentWorkflowStep] = useState('cooking');

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

  // Sample breadcrumb data
  const recipeBreadcrumbs: BreadcrumbItemType[] = [
    { label: 'Recipes', href: '/recipes', icon: 'cooking-pot' },
    { label: 'Italian', href: '/recipes/italian', icon: 'map-pin' },
    { label: 'Pasta', href: '/recipes/italian/pasta' },
    { label: 'Carbonara', href: '/recipes/italian/pasta/carbonara' },
  ];

  const longBreadcrumbs: BreadcrumbItemType[] = [
    { label: 'Home', href: '/', icon: 'home' },
    { label: 'Recipes', href: '/recipes' },
    { label: 'Italian', href: '/recipes/italian' },
    { label: 'Pasta', href: '/recipes/italian/pasta' },
    { label: 'Main Dishes', href: '/recipes/italian/pasta/main' },
    { label: 'Cream Based', href: '/recipes/italian/pasta/main/cream' },
    { label: 'Carbonara', href: '/recipes/italian/pasta/main/cream/carbonara' },
  ];

  const workflowItems: RecipeWorkflowItem[] = [
    {
      id: 'planning',
      label: 'Planning',
      icon: 'clipboard-list',
      completed: true,
      accessible: true,
    },
    {
      id: 'shopping',
      label: 'Shopping',
      icon: 'shopping-cart',
      completed: true,
      accessible: true,
    },
    {
      id: 'cooking',
      label: 'Cooking',
      icon: 'chef-hat',
      active: true,
      accessible: true,
    },
    {
      id: 'serving',
      label: 'Serving',
      icon: 'utensils',
      accessible: false,
    },
  ];

  return (
    <div className="container mx-auto space-y-12 p-8">
      <div>
        <h1 className="mb-2 text-4xl font-bold">Breadcrumb System</h1>
        <p className="text-muted-foreground text-lg">
          Hierarchical navigation component for showing user location within the
          app structure
        </p>
      </div>

      {/* Quick Start Examples */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Quick Start Examples</h2>
        <div className="bg-card rounded-lg border p-6">
          <div className="space-y-6">
            {/* Basic Usage */}
            <div>
              <h3 className="mb-3 text-lg font-medium">Basic Usage</h3>
              <div className="space-y-4">
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/recipes">Recipes</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Pasta Carbonara</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>

                <pre
                  className="bg-muted hover:bg-muted/80 mt-2 cursor-pointer rounded p-2 text-xs"
                  onClick={() =>
                    copyToClipboard(`<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink href="/recipes">Recipes</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Pasta Carbonara</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>`)
                  }
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      copyToClipboard(`<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink href="/recipes">Recipes</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Pasta Carbonara</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>`);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label="Copy basic usage code"
                >
                  {`<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink href="/recipes">Recipes</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Pasta Carbonara</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>`}
                </pre>
              </div>
            </div>

            {/* With Icons */}
            <div>
              <h3 className="mb-3 text-lg font-medium">With Icons</h3>
              <div className="space-y-4">
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/">
                        <Icon name="home" size="sm" />
                        Home
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/recipes">
                        <Icon name="cooking-pot" size="sm" />
                        Recipes
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>
                        <Icon name="utensils" size="sm" />
                        Pasta Carbonara
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </div>

            {/* Auto-generated from items */}
            <div>
              <h3 className="mb-3 text-lg font-medium">
                Auto-generated from Items
              </h3>
              <div className="space-y-4">
                <Breadcrumb items={recipeBreadcrumbs} showHome={true} />

                <pre
                  className="bg-muted hover:bg-muted/80 mt-2 cursor-pointer rounded p-2 text-xs"
                  onClick={() =>
                    copyToClipboard(`const items = [
  { label: 'Recipes', href: '/recipes', icon: 'cooking-pot' },
  { label: 'Italian', href: '/recipes/italian', icon: 'map-pin' },
  { label: 'Pasta', href: '/recipes/italian/pasta' },
  { label: 'Carbonara', href: '/recipes/italian/pasta/carbonara' },
];

<Breadcrumb items={items} showHome={true} />`)
                  }
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      copyToClipboard(`const items = [
  { label: 'Recipes', href: '/recipes', icon: 'cooking-pot' },
  { label: 'Italian', href: '/recipes/italian', icon: 'map-pin' },
  { label: 'Pasta', href: '/recipes/italian/pasta' },
  { label: 'Carbonara', href: '/recipes/italian/pasta/carbonara' },
];

<Breadcrumb items={items} showHome={true} />`);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label="Copy auto-generated breadcrumb code"
                >
                  {`const items = [
  { label: 'Recipes', href: '/recipes', icon: 'cooking-pot' },
  { label: 'Italian', href: '/recipes/italian', icon: 'map-pin' },
  { label: 'Pasta', href: '/recipes/italian/pasta' },
  { label: 'Carbonara', href: '/recipes/italian/pasta/carbonara' },
];

<Breadcrumb items={items} showHome={true} />`}
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
              <Breadcrumb size="sm">
                <BreadcrumbList size="sm">
                  <BreadcrumbItem size="sm">
                    <BreadcrumbLink href="/" size="sm">
                      Home
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator size="sm" />
                  <BreadcrumbItem size="sm">
                    <BreadcrumbLink href="/recipes" size="sm">
                      Recipes
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator size="sm" />
                  <BreadcrumbItem size="sm">
                    <BreadcrumbPage size="sm">Carbonara</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            <div>
              <h3 className="mb-3 text-lg font-medium">Default</h3>
              <Breadcrumb size="default">
                <BreadcrumbList size="default">
                  <BreadcrumbItem size="default">
                    <BreadcrumbLink href="/" size="default">
                      Home
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator size="default" />
                  <BreadcrumbItem size="default">
                    <BreadcrumbLink href="/recipes" size="default">
                      Recipes
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator size="default" />
                  <BreadcrumbItem size="default">
                    <BreadcrumbPage size="default">Carbonara</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            <div>
              <h3 className="mb-3 text-lg font-medium">Large</h3>
              <Breadcrumb size="lg">
                <BreadcrumbList size="lg">
                  <BreadcrumbItem size="lg">
                    <BreadcrumbLink href="/" size="lg">
                      Home
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator size="lg" />
                  <BreadcrumbItem size="lg">
                    <BreadcrumbLink href="/recipes" size="lg">
                      Recipes
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator size="lg" />
                  <BreadcrumbItem size="lg">
                    <BreadcrumbPage size="lg">Carbonara</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </div>
        </div>
      </section>

      {/* Separator Variants */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Separator Variants</h2>
        <div className="bg-card rounded-lg border p-6">
          <div className="space-y-6">
            <div>
              <h3 className="mb-3 text-lg font-medium">Chevron (Default)</h3>
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/">Home</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator variant="chevron" />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/recipes">Recipes</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator variant="chevron" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Carbonara</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            <div>
              <h3 className="mb-3 text-lg font-medium">Slash</h3>
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/">Home</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator variant="slash" />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/recipes">Recipes</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator variant="slash" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Carbonara</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            <div>
              <h3 className="mb-3 text-lg font-medium">Arrow</h3>
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/">Home</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator variant="arrow" />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/recipes">Recipes</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator variant="arrow" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Carbonara</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            <div>
              <h3 className="mb-3 text-lg font-medium">Dot</h3>
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/">Home</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator variant="dot" />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/recipes">Recipes</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator variant="dot" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Carbonara</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            <div>
              <h3 className="mb-3 text-lg font-medium">Custom Separator</h3>
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/">Home</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator>
                    <Icon name="star" size="sm" />
                  </BreadcrumbSeparator>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/recipes">Recipes</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator>
                    <Icon name="star" size="sm" />
                  </BreadcrumbSeparator>
                  <BreadcrumbItem>
                    <BreadcrumbPage>Carbonara</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </div>
        </div>
      </section>

      {/* Link Variants */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Link Variants</h2>
        <div className="bg-card rounded-lg border p-6">
          <div className="space-y-6">
            <div>
              <h3 className="mb-3 text-lg font-medium">Default</h3>
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/" variant="default">
                      Home
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/recipes" variant="default">
                      Recipes
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Carbonara</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            <div>
              <h3 className="mb-3 text-lg font-medium">Solid</h3>
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/" variant="solid">
                      Home
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/recipes" variant="solid">
                      Recipes
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Carbonara</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            <div>
              <h3 className="mb-3 text-lg font-medium">Ghost</h3>
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/" variant="ghost">
                      Home
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/recipes" variant="ghost">
                      Recipes
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Carbonara</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            <div>
              <h3 className="mb-3 text-lg font-medium">Minimal</h3>
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/" variant="minimal">
                      Home
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/recipes" variant="minimal">
                      Recipes
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Carbonara</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </div>
        </div>
      </section>

      {/* Overflow Handling */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Overflow Handling</h2>
        <div className="bg-card rounded-lg border p-6">
          <div className="space-y-6">
            <div>
              <h3 className="mb-3 text-lg font-medium">
                Long Navigation Path (Auto-collapse)
              </h3>
              <p className="text-muted-foreground mb-4 text-sm">
                When there are more than 3 items, middle items are collapsed
                with an ellipsis
              </p>
              <Breadcrumb items={longBreadcrumbs} maxItems={3} />
            </div>

            <div>
              <h3 className="mb-3 text-lg font-medium">Custom Max Items</h3>
              <Breadcrumb items={longBreadcrumbs} maxItems={4} />
            </div>

            <div>
              <h3 className="mb-3 text-lg font-medium">Manual Ellipsis</h3>
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/">Home</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbEllipsis />
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/recipes/italian/pasta">
                      Pasta
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Carbonara</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </div>
        </div>
      </section>

      {/* Recipe Workflow Breadcrumbs */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Recipe Workflow Breadcrumbs</h2>
        <div className="bg-card rounded-lg border p-6">
          <div className="space-y-6">
            <div>
              <h3 className="mb-3 text-lg font-medium">Cooking Workflow</h3>
              <p className="text-muted-foreground mb-4 text-sm">
                Specialized breadcrumb for recipe cooking workflow with step
                indicators
              </p>
              <RecipeBreadcrumb
                workflow="cooking"
                items={workflowItems}
                currentStep={currentWorkflowStep}
                onStepClick={step => setCurrentWorkflowStep(step)}
              />
            </div>

            <div>
              <h3 className="mb-3 text-lg font-medium">
                Different Workflow Stages
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="mb-2 text-sm font-medium">Planning Stage</h4>
                  <RecipeBreadcrumb
                    workflow="planning"
                    items={[
                      {
                        id: 'plan',
                        label: 'Recipe Planning',
                        icon: 'clipboard-list',
                        active: true,
                      },
                    ]}
                  />
                </div>

                <div>
                  <h4 className="mb-2 text-sm font-medium">Shopping Stage</h4>
                  <RecipeBreadcrumb
                    workflow="shopping"
                    items={[
                      {
                        id: 'shop',
                        label: 'Shopping List',
                        icon: 'shopping-cart',
                        active: true,
                      },
                    ]}
                  />
                </div>

                <div>
                  <h4 className="mb-2 text-sm font-medium">Serving Stage</h4>
                  <RecipeBreadcrumb
                    workflow="serving"
                    items={[
                      {
                        id: 'serve',
                        label: 'Ready to Serve',
                        icon: 'utensils',
                        active: true,
                      },
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real-world Examples */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Real-world Examples</h2>
        <div className="bg-card rounded-lg border p-6">
          <div className="space-y-6">
            <div>
              <h3 className="mb-3 text-lg font-medium">
                Recipe Category Navigation
              </h3>
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/">
                      <Icon name="home" size="sm" />
                      Home
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/recipes">
                      <Icon name="cooking-pot" size="sm" />
                      Recipes
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/recipes/cuisines">
                      <Icon name="globe" size="sm" />
                      Cuisines
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/recipes/cuisines/italian">
                      <Icon name="map-pin" size="sm" />
                      Italian
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>
                      <Icon name="wheat" size="sm" />
                      Spaghetti Carbonara
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            <div>
              <h3 className="mb-3 text-lg font-medium">
                User Collection Navigation
              </h3>
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/">
                      <Icon name="home" size="sm" />
                      Home
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/my-recipes">
                      <Icon name="user" size="sm" />
                      My Recipes
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/my-recipes/favorites">
                      <Icon name="heart" size="sm" />
                      Favorites
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>
                      <Icon name="star" size="sm" />
                      Quick Weeknight Dinners
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            <div>
              <h3 className="mb-3 text-lg font-medium">
                Meal Planning Navigation
              </h3>
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/">
                      <Icon name="home" size="sm" />
                      Home
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/meal-plans">
                      <Icon name="calendar" size="sm" />
                      Meal Plans
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/meal-plans/2024">
                      <Icon name="clock" size="sm" />
                      2024
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>
                      <Icon name="calendar-days" size="sm" />
                      Week of March 15th
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
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
                <li>
                  Use breadcrumbs for hierarchical navigation with 3+ levels
                </li>
                <li>Always include the current page as the last item</li>
                <li>Keep breadcrumb labels concise and descriptive</li>
                <li>Use icons sparingly to avoid visual clutter</li>
                <li>Implement proper keyboard navigation support</li>
                <li>Consider mobile experience with overflow handling</li>
              </ul>
            </div>

            <div>
              <h3 className="mb-2 text-lg font-medium">Recipe App Patterns</h3>
              <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
                <li>Use RecipeBreadcrumb for cooking workflow steps</li>
                <li>Include cuisine/category navigation for recipe browsing</li>
                <li>Show collection hierarchy for user-organized recipes</li>
                <li>Use workflow breadcrumbs for meal planning processes</li>
                <li>
                  Include icons for better visual hierarchy in recipe context
                </li>
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
              <h3 className="mb-2 font-medium">Breadcrumb Props</h3>
              <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
                <li>
                  <code>items</code> - Array of breadcrumb items (auto-generates
                  breadcrumb)
                </li>
                <li>
                  <code>size</code> - sm, default, lg
                </li>
                <li>
                  <code>separator</code> - Custom separator component
                </li>
                <li>
                  <code>maxItems</code> - Maximum items before collapsing
                  (default: 3)
                </li>
                <li>
                  <code>showHome</code> - Whether to show home icon (default:
                  true)
                </li>
                <li>
                  <code>homeUrl</code> - Custom home URL (default:
                  &quot;/&quot;)
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-2 font-medium">BreadcrumbLink Props</h3>
              <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
                <li>
                  <code>variant</code> - default, solid, ghost, minimal
                </li>
                <li>
                  <code>size</code> - sm, default, lg
                </li>
                <li>
                  <code>asChild</code> - Render as child component with Radix
                  Slot
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-2 font-medium">BreadcrumbSeparator Props</h3>
              <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
                <li>
                  <code>variant</code> - chevron, slash, arrow, dot
                </li>
                <li>
                  <code>size</code> - sm, default, lg
                </li>
                <li>
                  <code>children</code> - Custom separator content
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-2 font-medium">RecipeBreadcrumb Props</h3>
              <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
                <li>
                  <code>workflow</code> - planning, shopping, cooking, serving
                </li>
                <li>
                  <code>emphasis</code> - subtle, normal, strong
                </li>
                <li>
                  <code>items</code> - Array of workflow items
                </li>
                <li>
                  <code>currentStep</code> - Currently active step ID
                </li>
                <li>
                  <code>onStepClick</code> - Click handler for workflow
                  navigation
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
