'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function ButtonDemo() {
  const [buttonLoading, setButtonLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const handleAsyncAction = async () => {
    setButtonLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setButtonLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-foreground mb-2 text-3xl font-bold">
          Button Component
        </h1>
        <p className="text-muted-foreground text-lg">
          Flexible, accessible button component with multiple variants, sizes,
          and states.
        </p>
      </div>

      <div className="space-y-8">
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
                  <button type="button" className="cursor-pointer">
                    Custom Element
                  </button>
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
      </div>
    </div>
  );
}
