'use client';

import React, { useState } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import type { SpinnerProps } from '@/types/ui/spinner';

export default function SpinnerDemo() {
  // Interactive controls state
  const [variant, setVariant] = useState<SpinnerProps['variant']>('spinner');
  const [size, setSize] = useState<SpinnerProps['size']>('default');
  const [color, setColor] = useState<SpinnerProps['color']>('default');
  const [speed, setSpeed] = useState<SpinnerProps['speed']>('default');
  const [showText, setShowText] = useState(false);
  const [text, setText] = useState('Loading...');
  const [textPosition, setTextPosition] =
    useState<SpinnerProps['textPosition']>('bottom');
  const [showOverlay, setShowOverlay] = useState(false);
  const [showCentered, setShowCentered] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);

  const handleButtonClick = () => {
    setButtonLoading(true);
    setTimeout(() => setButtonLoading(false), 2000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-foreground mb-2 text-3xl font-bold">Spinner</h1>
        <p className="text-muted-foreground text-lg">
          A versatile loading indicator with multiple variants, sizes, and
          animation speeds.
        </p>
      </div>

      <div className="space-y-8">
        {/* Interactive Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Interactive Playground</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Preview Area */}
            <div className="bg-background flex items-center justify-center rounded-lg border p-12">
              <Spinner
                variant={variant}
                size={size}
                color={color}
                speed={speed}
                text={showText ? text : undefined}
                textPosition={textPosition}
                centered={showCentered}
              />
            </div>

            {/* Controls Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {/* Variant Select */}
              <div>
                <label htmlFor="variant" className="text-sm font-medium">
                  Variant
                </label>
                <Select
                  value={variant ?? 'spinner'}
                  onValueChange={value =>
                    setVariant(value as SpinnerProps['variant'])
                  }
                >
                  <option value="spinner">Spinner</option>
                  <option value="dots">Dots</option>
                  <option value="pulse">Pulse</option>
                  <option value="bars">Bars</option>
                </Select>
              </div>

              {/* Size Select */}
              <div>
                <label htmlFor="size" className="text-sm font-medium">
                  Size
                </label>
                <Select
                  value={size ?? 'default'}
                  onValueChange={value =>
                    setSize(value as SpinnerProps['size'])
                  }
                >
                  <option value="xs">Extra Small</option>
                  <option value="sm">Small</option>
                  <option value="default">Default</option>
                  <option value="lg">Large</option>
                  <option value="xl">Extra Large</option>
                </Select>
              </div>

              {/* Color Select */}
              <div>
                <label htmlFor="color" className="text-sm font-medium">
                  Color
                </label>
                <Select
                  value={color ?? 'default'}
                  onValueChange={value =>
                    setColor(value as SpinnerProps['color'])
                  }
                >
                  <option value="default">Default</option>
                  <option value="primary">Primary</option>
                  <option value="secondary">Secondary</option>
                  <option value="muted">Muted</option>
                  <option value="destructive">Destructive</option>
                  <option value="success">Success</option>
                  <option value="warning">Warning</option>
                  <option value="info">Info</option>
                </Select>
              </div>

              {/* Speed Select */}
              <div>
                <label htmlFor="speed" className="text-sm font-medium">
                  Speed
                </label>
                <Select
                  value={speed ?? 'default'}
                  onValueChange={value =>
                    setSpeed(value as SpinnerProps['speed'])
                  }
                >
                  <option value="slow">Slow</option>
                  <option value="default">Default</option>
                  <option value="fast">Fast</option>
                </Select>
              </div>

              {/* Show Text Toggle */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="show-text"
                  checked={showText}
                  onCheckedChange={setShowText}
                />
                <label htmlFor="show-text" className="text-sm font-medium">
                  Show Text
                </label>
              </div>

              {/* Center Toggle */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="centered"
                  checked={showCentered}
                  onCheckedChange={setShowCentered}
                />
                <label htmlFor="centered" className="text-sm font-medium">
                  Centered
                </label>
              </div>
            </div>

            {/* Text Options */}
            {showText && (
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="text" className="text-sm font-medium">
                    Loading Text
                  </label>
                  <Input
                    id="text"
                    value={text}
                    onChange={e => setText(e.target.value)}
                    placeholder="Enter loading text..."
                  />
                </div>
                <div>
                  <label
                    htmlFor="text-position"
                    className="text-sm font-medium"
                  >
                    Text Position
                  </label>
                  <Select
                    value={textPosition}
                    onValueChange={value =>
                      setTextPosition(value as SpinnerProps['textPosition'])
                    }
                  >
                    <option value="bottom">Bottom</option>
                    <option value="right">Right</option>
                  </Select>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Variants Showcase */}
        <Card>
          <CardHeader>
            <CardTitle>All Variants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="text-center">
                <div className="mb-2 flex h-20 items-center justify-center">
                  <Spinner variant="spinner" size="lg" />
                </div>
                <p className="font-medium">Spinner</p>
                <p className="text-muted-foreground text-sm">
                  Classic rotating loader
                </p>
              </div>
              <div className="text-center">
                <div className="mb-2 flex h-20 items-center justify-center">
                  <Spinner variant="dots" size="lg" />
                </div>
                <p className="font-medium">Dots</p>
                <p className="text-muted-foreground text-sm">
                  Animated dots sequence
                </p>
              </div>
              <div className="text-center">
                <div className="mb-2 flex h-20 items-center justify-center">
                  <Spinner variant="pulse" size="lg" />
                </div>
                <p className="font-medium">Pulse</p>
                <p className="text-muted-foreground text-sm">
                  Pulsing indicator
                </p>
              </div>
              <div className="text-center">
                <div className="mb-2 flex h-20 items-center justify-center">
                  <Spinner variant="bars" size="lg" />
                </div>
                <p className="font-medium">Bars</p>
                <p className="text-muted-foreground text-sm">
                  Animated vertical bars
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Size Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Size Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-8">
              <div className="text-center">
                <Spinner size="xs" />
                <p className="text-muted-foreground mt-2 text-sm">xs</p>
              </div>
              <div className="text-center">
                <Spinner size="sm" />
                <p className="text-muted-foreground mt-2 text-sm">sm</p>
              </div>
              <div className="text-center">
                <Spinner size="default" />
                <p className="text-muted-foreground mt-2 text-sm">default</p>
              </div>
              <div className="text-center">
                <Spinner size="lg" />
                <p className="text-muted-foreground mt-2 text-sm">lg</p>
              </div>
              <div className="text-center">
                <Spinner size="xl" />
                <p className="text-muted-foreground mt-2 text-sm">xl</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Colors */}
        <Card>
          <CardHeader>
            <CardTitle>Color Variants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="text-center">
                <Spinner color="default" />
                <p className="text-muted-foreground mt-2 text-sm">Default</p>
              </div>
              <div className="text-center">
                <Spinner color="primary" />
                <p className="text-muted-foreground mt-2 text-sm">Primary</p>
              </div>
              <div className="text-center">
                <Spinner color="secondary" />
                <p className="text-muted-foreground mt-2 text-sm">Secondary</p>
              </div>
              <div className="text-center">
                <Spinner color="muted" />
                <p className="text-muted-foreground mt-2 text-sm">Muted</p>
              </div>
              <div className="text-center">
                <Spinner color="destructive" />
                <p className="text-muted-foreground mt-2 text-sm">
                  Destructive
                </p>
              </div>
              <div className="text-center">
                <Spinner color="success" />
                <p className="text-muted-foreground mt-2 text-sm">Success</p>
              </div>
              <div className="text-center">
                <Spinner color="warning" />
                <p className="text-muted-foreground mt-2 text-sm">Warning</p>
              </div>
              <div className="text-center">
                <Spinner color="info" />
                <p className="text-muted-foreground mt-2 text-sm">Info</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Common Usage Patterns */}
        <Card>
          <CardHeader>
            <CardTitle>Common Usage Patterns</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Button Loading */}
            <div>
              <h3 className="mb-3 font-medium">Button Loading State</h3>
              <div className="flex gap-3">
                <Button
                  onClick={handleButtonClick}
                  disabled={buttonLoading}
                  className="min-w-[120px]"
                >
                  {buttonLoading ? (
                    <>
                      <Spinner size="sm" className="mr-2" />
                      Saving...
                    </>
                  ) : (
                    'Save Recipe'
                  )}
                </Button>
                <Button variant="outline" disabled>
                  <Spinner size="sm" variant="dots" className="mr-2" />
                  Processing
                </Button>
                <Button variant="secondary" disabled>
                  <Spinner size="sm" variant="pulse" color="muted" />
                </Button>
              </div>
            </div>

            {/* Card Loading */}
            <div>
              <h3 className="mb-3 font-medium">Card Loading State</h3>
              <Card className="h-32">
                <CardContent className="h-full p-0">
                  <Spinner centered text="Loading recipe details..." />
                </CardContent>
              </Card>
            </div>

            {/* Inline Loading */}
            <div>
              <h3 className="mb-3 font-medium">Inline Loading</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span>Fetching ingredients</span>
                  <Spinner size="xs" variant="dots" />
                </div>
                <div className="flex items-center gap-2">
                  <Spinner size="xs" color="success" />
                  <span>Uploading image (75%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>Calculating nutrition facts</span>
                  <Spinner size="xs" variant="bars" color="primary" />
                </div>
              </div>
            </div>

            {/* Overlay Demo */}
            <div>
              <h3 className="mb-3 font-medium">Overlay Mode</h3>
              <Button onClick={() => setShowOverlay(true)}>
                Show Overlay Spinner
              </Button>
              {showOverlay && (
                <div
                  className="fixed inset-0 z-50"
                  onClick={() => setShowOverlay(false)}
                  onKeyDown={e => {
                    if (e.key === 'Escape') {
                      setShowOverlay(false);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label="Close overlay"
                >
                  <Spinner overlay text="Saving your changes..." />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Code Examples */}
        <Card>
          <CardHeader>
            <CardTitle>Code Examples</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 font-medium">Basic Usage</h3>
                <pre className="rounded-md bg-gray-100 p-3 text-sm dark:bg-gray-800">
                  <code>{`import { Spinner } from '@/components/ui/spinner';

// Default spinner
<Spinner />

// With variant and size
<Spinner variant="dots" size="lg" />

// With color and speed
<Spinner color="primary" speed="fast" />`}</code>
                </pre>
              </div>

              <div>
                <h3 className="mb-2 font-medium">With Loading Text</h3>
                <pre className="rounded-md bg-gray-100 p-3 text-sm dark:bg-gray-800">
                  <code>{`// Text below spinner
<Spinner text="Loading recipes..." />

// Text to the right
<Spinner
  text="Processing..."
  textPosition="right"
/>`}</code>
                </pre>
              </div>

              <div>
                <h3 className="mb-2 font-medium">Button Integration</h3>
                <pre className="rounded-md bg-gray-100 p-3 text-sm dark:bg-gray-800">
                  <code>{`<Button disabled={isLoading}>
  {isLoading ? (
    <>
      <Spinner size="sm" className="mr-2" />
      Saving...
    </>
  ) : (
    'Save Recipe'
  )}
</Button>`}</code>
                </pre>
              </div>

              <div>
                <h3 className="mb-2 font-medium">Overlay Mode</h3>
                <pre className="rounded-md bg-gray-100 p-3 text-sm dark:bg-gray-800">
                  <code>{`// Fullscreen loading overlay
<Spinner
  overlay
  text="Please wait..."
/>

// Centered in container
<div className="h-32">
  <Spinner centered />
</div>`}</code>
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
