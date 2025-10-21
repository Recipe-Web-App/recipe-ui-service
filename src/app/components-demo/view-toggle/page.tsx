'use client';

import React, { useState } from 'react';
import { ViewToggle } from '@/components/ui/view-toggle';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  useViewMode,
  useToggleViewMode,
} from '@/stores/ui/view-preference-store';
import type { ViewMode } from '@/stores/ui/view-preference-store';

export default function ViewToggleDemoPage() {
  // Controlled state
  const [controlledValue, setControlledValue] = useState<ViewMode>('grid');

  // Size and variant states for interactive example
  const [size, setSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [variant, setVariant] = useState<'default' | 'outline' | 'ghost'>(
    'default'
  );
  const [disabled, setDisabled] = useState(false);

  // Store hooks
  const storeViewMode = useViewMode();
  const toggleStoreViewMode = useToggleViewMode();

  return (
    <div className="container mx-auto space-y-12 p-8">
      <div>
        <h1 className="mb-2 text-4xl font-bold">ViewToggle Component</h1>
        <p className="text-muted-foreground text-lg">
          A specialized toggle for switching between grid and list view modes
          with localStorage persistence
        </p>
      </div>

      {/* Basic Usage */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">Basic Usage</h2>
          <p className="text-muted-foreground text-sm">
            Simple toggle using the view preference store (uncontrolled mode)
          </p>
        </div>
        <div className="bg-card rounded-lg border p-6">
          <div className="flex flex-col items-center gap-4">
            <ViewToggle />
            <div className="text-muted-foreground text-sm">
              Current mode from store:{' '}
              <span className="text-foreground font-medium">
                {storeViewMode}
              </span>
            </div>
            <Button onClick={toggleStoreViewMode} variant="outline" size="sm">
              Toggle Store Value
            </Button>
          </div>
        </div>
      </section>

      {/* Controlled Mode */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">Controlled Mode</h2>
          <p className="text-muted-foreground text-sm">
            Full control over the value with state management
          </p>
        </div>
        <div className="bg-card rounded-lg border p-6">
          <div className="flex flex-col items-center gap-4">
            <ViewToggle
              value={controlledValue}
              onValueChange={setControlledValue}
            />
            <div className="text-muted-foreground text-sm">
              Controlled value:{' '}
              <span className="text-foreground font-medium">
                {controlledValue}
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setControlledValue('grid')}
                variant="outline"
                size="sm"
              >
                Set to Grid
              </Button>
              <Button
                onClick={() => setControlledValue('list')}
                variant="outline"
                size="sm"
              >
                Set to List
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Size Variants */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">Size Variants</h2>
          <p className="text-muted-foreground text-sm">
            Three size options: small, medium (default), and large
          </p>
        </div>
        <div className="bg-card space-y-8 rounded-lg border p-6">
          <div className="flex flex-col items-center gap-3">
            <ViewToggle size="sm" defaultValue="grid" />
            <p className="text-muted-foreground text-sm">Small</p>
          </div>

          <div className="flex flex-col items-center gap-3">
            <ViewToggle size="md" defaultValue="grid" />
            <p className="text-muted-foreground text-sm">Medium (Default)</p>
          </div>

          <div className="flex flex-col items-center gap-3">
            <ViewToggle size="lg" defaultValue="grid" />
            <p className="text-muted-foreground text-sm">Large</p>
          </div>
        </div>
      </section>

      {/* Visual Variants */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">Visual Variants</h2>
          <p className="text-muted-foreground text-sm">
            Three visual styles: default, outline, and ghost
          </p>
        </div>
        <div className="bg-card space-y-8 rounded-lg border p-6">
          <div className="flex flex-col items-center gap-3">
            <ViewToggle variant="default" defaultValue="grid" />
            <p className="text-muted-foreground text-sm">Default</p>
          </div>

          <div className="flex flex-col items-center gap-3">
            <ViewToggle variant="outline" defaultValue="grid" />
            <p className="text-muted-foreground text-sm">Outline</p>
          </div>

          <div className="flex flex-col items-center gap-3">
            <ViewToggle variant="ghost" defaultValue="grid" />
            <p className="text-muted-foreground text-sm">Ghost</p>
          </div>
        </div>
      </section>

      {/* All Combinations */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">All Combinations</h2>
          <p className="text-muted-foreground text-sm">
            Size and variant combinations
          </p>
        </div>
        <div className="space-y-6">
          {/* Default variant */}
          <div className="bg-card rounded-lg border p-6">
            <h3 className="mb-4 text-sm font-medium">Default Variant</h3>
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex flex-col items-center gap-2">
                <ViewToggle size="sm" variant="default" defaultValue="grid" />
                <p className="text-muted-foreground text-xs">Small</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <ViewToggle size="md" variant="default" defaultValue="grid" />
                <p className="text-muted-foreground text-xs">Medium</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <ViewToggle size="lg" variant="default" defaultValue="grid" />
                <p className="text-muted-foreground text-xs">Large</p>
              </div>
            </div>
          </div>

          {/* Outline variant */}
          <div className="bg-card rounded-lg border p-6">
            <h3 className="mb-4 text-sm font-medium">Outline Variant</h3>
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex flex-col items-center gap-2">
                <ViewToggle size="sm" variant="outline" defaultValue="grid" />
                <p className="text-muted-foreground text-xs">Small</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <ViewToggle size="md" variant="outline" defaultValue="grid" />
                <p className="text-muted-foreground text-xs">Medium</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <ViewToggle size="lg" variant="outline" defaultValue="grid" />
                <p className="text-muted-foreground text-xs">Large</p>
              </div>
            </div>
          </div>

          {/* Ghost variant */}
          <div className="bg-card rounded-lg border p-6">
            <h3 className="mb-4 text-sm font-medium">Ghost Variant</h3>
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex flex-col items-center gap-2">
                <ViewToggle size="sm" variant="ghost" defaultValue="grid" />
                <p className="text-muted-foreground text-xs">Small</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <ViewToggle size="md" variant="ghost" defaultValue="grid" />
                <p className="text-muted-foreground text-xs">Medium</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <ViewToggle size="lg" variant="ghost" defaultValue="grid" />
                <p className="text-muted-foreground text-xs">Large</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Disabled State */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">Disabled State</h2>
          <p className="text-muted-foreground text-sm">
            Toggle can be disabled to prevent user interaction
          </p>
        </div>
        <div className="bg-card rounded-lg border p-6">
          <div className="flex flex-wrap items-center justify-center gap-8">
            <div className="flex flex-col items-center gap-3">
              <ViewToggle disabled defaultValue="grid" />
              <p className="text-muted-foreground text-sm">Disabled (Grid)</p>
            </div>

            <div className="flex flex-col items-center gap-3">
              <ViewToggle disabled defaultValue="list" />
              <p className="text-muted-foreground text-sm">Disabled (List)</p>
            </div>
          </div>
        </div>
      </section>

      {/* In Context */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">In Context</h2>
          <p className="text-muted-foreground text-sm">
            Example of ViewToggle in a typical browse page header
          </p>
        </div>
        <div className="bg-card rounded-lg border p-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Browse Recipes</CardTitle>
                  <p className="text-muted-foreground text-sm">
                    Discover delicious recipes from around the world
                  </p>
                </div>
                <ViewToggle
                  value={controlledValue}
                  onValueChange={setControlledValue}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/20 flex items-center justify-center rounded-lg border-2 border-dashed p-12">
                <div className="text-center">
                  <Badge variant="secondary" className="mb-2">
                    {controlledValue.toUpperCase()} VIEW
                  </Badge>
                  <p className="text-muted-foreground text-sm">
                    Content would be displayed in {controlledValue} view here
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Interactive Playground */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">Interactive Playground</h2>
          <p className="text-muted-foreground text-sm">
            Experiment with all configuration options
          </p>
        </div>
        <div className="bg-card rounded-lg border p-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Controls */}
            <div className="space-y-4">
              <h3 className="font-medium">Configuration</h3>

              <div>
                <label
                  htmlFor="size-select"
                  className="mb-2 block text-sm font-medium"
                >
                  Size
                </label>
                <select
                  id="size-select"
                  value={size}
                  onChange={e => setSize(e.target.value as 'sm' | 'md' | 'lg')}
                  className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
                >
                  <option value="sm">Small</option>
                  <option value="md">Medium</option>
                  <option value="lg">Large</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="variant-select"
                  className="mb-2 block text-sm font-medium"
                >
                  Variant
                </label>
                <select
                  id="variant-select"
                  value={variant}
                  onChange={e =>
                    setVariant(
                      e.target.value as 'default' | 'outline' | 'ghost'
                    )
                  }
                  className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
                >
                  <option value="default">Default</option>
                  <option value="outline">Outline</option>
                  <option value="ghost">Ghost</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="disabled-checkbox"
                  checked={disabled}
                  onChange={e => setDisabled(e.target.checked)}
                  className="border-input h-4 w-4 rounded"
                />
                <label
                  htmlFor="disabled-checkbox"
                  className="text-sm font-medium"
                >
                  Disabled
                </label>
              </div>

              <div className="border-input bg-muted/30 rounded-lg border p-4">
                <h4 className="mb-2 text-sm font-medium">Current State</h4>
                <div className="text-muted-foreground space-y-1 text-xs">
                  <div>
                    <span className="font-medium">Value:</span>{' '}
                    {controlledValue}
                  </div>
                  <div>
                    <span className="font-medium">Size:</span> {size}
                  </div>
                  <div>
                    <span className="font-medium">Variant:</span> {variant}
                  </div>
                  <div>
                    <span className="font-medium">Disabled:</span>{' '}
                    {disabled ? 'Yes' : 'No'}
                  </div>
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12">
              <div className="space-y-4">
                <ViewToggle
                  value={controlledValue}
                  onValueChange={setControlledValue}
                  size={size}
                  variant={variant}
                  disabled={disabled}
                />
                <p className="text-muted-foreground text-center text-sm">
                  {disabled ? 'Disabled state' : 'Click to toggle views'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* With Default Value */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">With Default Value</h2>
          <p className="text-muted-foreground text-sm">
            Specify an initial value for uncontrolled mode
          </p>
        </div>
        <div className="bg-card rounded-lg border p-6">
          <div className="flex flex-wrap items-center justify-center gap-8">
            <div className="flex flex-col items-center gap-3">
              <ViewToggle defaultValue="grid" />
              <p className="text-muted-foreground text-sm">Defaults to Grid</p>
            </div>

            <div className="flex flex-col items-center gap-3">
              <ViewToggle defaultValue="list" />
              <p className="text-muted-foreground text-sm">Defaults to List</p>
            </div>
          </div>
        </div>
      </section>

      {/* Usage Example */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">Usage</h2>
        </div>
        <div className="bg-muted rounded-lg p-6">
          <pre className="overflow-x-auto text-sm">
            <code>{`// Uncontrolled (uses store automatically)
<ViewToggle />

// Controlled
const [viewMode, setViewMode] = useState('grid');
<ViewToggle value={viewMode} onValueChange={setViewMode} />

// With size and variant
<ViewToggle size="lg" variant="outline" />

// With default value
<ViewToggle defaultValue="list" />

// Disabled
<ViewToggle disabled />

// Using store hooks directly
import { useViewMode, useToggleViewMode } from '@/stores/ui/view-preference-store';

const viewMode = useViewMode();
const toggleViewMode = useToggleViewMode();`}</code>
          </pre>
        </div>
      </section>

      {/* Features */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">Features</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Controlled & Uncontrolled
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Supports both controlled and uncontrolled usage patterns with
                seamless integration
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Persistent Storage</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Automatically saves preference to localStorage in uncontrolled
                mode
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Keyboard Navigation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Full keyboard support with Enter and Space keys for activation
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Accessibility</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                ARIA radiogroup pattern with proper labels and screen reader
                support
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
