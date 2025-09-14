'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

/**
 * Component Demo Page
 *
 * Interactive playground for testing and showcasing UI components.
 * This page will grow as we add more components to the design system.
 */
export default function ComponentsDemo() {
  // Button demo state
  const [buttonLoading, setButtonLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const handleAsyncAction = async () => {
    setButtonLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setButtonLoading(false);
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-gray-900/95 dark:supports-[backdrop-filter]:bg-gray-900/60">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-foreground text-3xl font-bold">
                Components Demo
              </h1>
              <p className="text-muted-foreground mt-1">
                Interactive playground for UI components
              </p>
            </div>
            <div className="text-muted-foreground text-sm">
              Recipe UI Service Design System
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="bg-card rounded-lg border p-4">
            <div className="text-primary text-2xl font-bold">1</div>
            <div className="text-muted-foreground text-sm">Components</div>
          </div>
          <div className="bg-card rounded-lg border p-4">
            <div className="text-primary text-2xl font-bold">6</div>
            <div className="text-muted-foreground text-sm">Variants</div>
          </div>
          <div className="bg-card rounded-lg border p-4">
            <div className="text-primary text-2xl font-bold">4</div>
            <div className="text-muted-foreground text-sm">Sizes</div>
          </div>
        </div>

        {/* Button Component Section */}
        <section className="space-y-8">
          <div>
            <h2 className="text-foreground mb-4 text-2xl font-semibold">
              Button Component
            </h2>
            <p className="text-muted-foreground mb-6">
              Flexible, accessible button component with multiple variants,
              sizes, and states.
            </p>
          </div>

          {/* Interactive Controls */}
          <div className="bg-card rounded-lg border p-6">
            <h3 className="mb-4 text-lg font-medium">Interactive Controls</h3>
            <div className="mb-6 flex flex-wrap gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={buttonDisabled}
                  onChange={e => setButtonDisabled(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Disabled</span>
              </label>
              <Button
                size="sm"
                variant="outline"
                loading={buttonLoading}
                onClick={handleAsyncAction}
              >
                {buttonLoading ? 'Loading...' : 'Test Loading State'}
              </Button>
            </div>

            <div className="space-y-6">
              {/* Variants */}
              <div>
                <h4 className="mb-3 font-medium">Variants</h4>
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="default"
                    disabled={buttonDisabled}
                    loading={buttonLoading}
                  >
                    Default
                  </Button>
                  <Button
                    variant="destructive"
                    disabled={buttonDisabled}
                    loading={buttonLoading}
                  >
                    Destructive
                  </Button>
                  <Button
                    variant="outline"
                    disabled={buttonDisabled}
                    loading={buttonLoading}
                  >
                    Outline
                  </Button>
                  <Button
                    variant="secondary"
                    disabled={buttonDisabled}
                    loading={buttonLoading}
                  >
                    Secondary
                  </Button>
                  <Button
                    variant="ghost"
                    disabled={buttonDisabled}
                    loading={buttonLoading}
                  >
                    Ghost
                  </Button>
                  <Button
                    variant="link"
                    disabled={buttonDisabled}
                    loading={buttonLoading}
                  >
                    Link
                  </Button>
                </div>
              </div>

              {/* Sizes */}
              <div>
                <h4 className="mb-3 font-medium">Sizes</h4>
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    size="sm"
                    disabled={buttonDisabled}
                    loading={buttonLoading}
                  >
                    Small
                  </Button>
                  <Button
                    size="default"
                    disabled={buttonDisabled}
                    loading={buttonLoading}
                  >
                    Default
                  </Button>
                  <Button
                    size="lg"
                    disabled={buttonDisabled}
                    loading={buttonLoading}
                  >
                    Large
                  </Button>
                  <Button
                    size="icon"
                    disabled={buttonDisabled}
                    loading={buttonLoading}
                  >
                    🚀
                  </Button>
                </div>
              </div>

              {/* Polymorphic Usage */}
              <div>
                <h4 className="mb-3 font-medium">Polymorphic (asChild)</h4>
                <div className="flex flex-wrap gap-3">
                  <Button asChild>
                    <a href="#demo" className="no-underline">
                      Link Button
                    </a>
                  </Button>
                  <Button asChild variant="outline">
                    <div role="button" tabIndex={0} className="cursor-pointer">
                      Custom Element
                    </div>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Usage Examples */}
          <div className="bg-card rounded-lg border p-6">
            <h3 className="mb-4 text-lg font-medium">Common Usage Patterns</h3>

            <div className="space-y-6">
              {/* Form Actions */}
              <div className="bg-muted/50 rounded-lg border p-4">
                <h4 className="mb-3 font-medium">Form Actions</h4>
                <div className="flex gap-2">
                  <Button type="submit">Save Recipe</Button>
                  <Button type="button" variant="outline">
                    Save as Draft
                  </Button>
                  <Button type="button" variant="ghost">
                    Cancel
                  </Button>
                </div>
              </div>

              {/* Card Actions */}
              <div className="bg-muted/50 rounded-lg border p-4">
                <h4 className="mb-3 font-medium">Recipe Card Actions</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-medium">Chocolate Chip Cookies</h5>
                    <p className="text-muted-foreground text-sm">
                      Ready in 25 minutes
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Save
                    </Button>
                    <Button size="sm">View Recipe</Button>
                  </div>
                </div>
              </div>

              {/* Destructive Actions */}
              <div className="bg-muted/50 rounded-lg border p-4">
                <h4 className="mb-3 font-medium">Destructive Actions</h4>
                <div className="flex justify-end gap-2">
                  <Button variant="ghost">Cancel</Button>
                  <Button variant="destructive">Delete Recipe</Button>
                </div>
              </div>
            </div>
          </div>

          {/* Code Examples */}
          <div className="bg-card rounded-lg border p-6">
            <h3 className="mb-4 text-lg font-medium">Code Examples</h3>
            <div className="space-y-4">
              <div className="bg-muted overflow-x-auto rounded-md p-4 font-mono text-sm">
                <div className="text-muted-foreground mb-2">{`// Basic usage`}</div>
                <div>{`<Button>Click me</Button>`}</div>
              </div>
              <div className="bg-muted overflow-x-auto rounded-md p-4 font-mono text-sm">
                <div className="text-muted-foreground mb-2">
                  {`// With variants and states`}
                </div>
                <div>{`<Button variant="destructive" loading={isLoading}>`}</div>
                <div>{`  {isLoading ? 'Deleting...' : 'Delete Recipe'}`}</div>
                <div>{`</Button>`}</div>
              </div>
              <div className="bg-muted overflow-x-auto rounded-md p-4 font-mono text-sm">
                <div className="text-muted-foreground mb-2">
                  {`// Polymorphic usage`}
                </div>
                <div>{`<Button asChild>`}</div>
                <div>{`  <a href="/recipes">View All Recipes</a>`}</div>
                <div>{`</Button>`}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Future Components Section */}
        <section className="mt-12 space-y-4">
          <h2 className="text-foreground text-2xl font-semibold">
            Coming Soon
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              'Input',
              'Card',
              'Modal',
              'Toast',
              'Skeleton',
              'Badge',
              'Dropdown',
              'Tabs',
            ].map(component => (
              <div
                key={component}
                className="bg-card rounded-lg border p-4 opacity-60"
              >
                <h3 className="text-foreground font-medium">{component}</h3>
                <p className="text-muted-foreground mt-1 text-sm">
                  Component in development
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
