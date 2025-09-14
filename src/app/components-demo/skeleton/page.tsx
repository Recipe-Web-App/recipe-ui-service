'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Skeleton,
  SkeletonText,
  SkeletonAvatar,
  SkeletonButton,
  RecipeCardSkeleton,
  RecipeListSkeleton,
  ProfileSkeleton,
} from '@/components/ui/skeleton';

export default function SkeletonDemo() {
  const [skeletonAnimation, setSkeletonAnimation] = useState<
    'pulse' | 'wave' | 'none'
  >('pulse');
  const [skeletonVariant, setSkeletonVariant] = useState<
    'default' | 'text' | 'circular' | 'card' | 'image' | 'button'
  >('default');
  const [skeletonSize, setSkeletonSize] = useState<
    'sm' | 'default' | 'lg' | 'full'
  >('default');
  const [skeletonRounded, setSkeletonRounded] = useState<
    'none' | 'sm' | 'default' | 'lg' | 'full'
  >('default');
  const [skeletonCount, setSkeletonCount] = useState(1);
  const [showSkeletonDemo, setShowSkeletonDemo] = useState(false);

  const toggleSkeletonDemo = () => {
    setShowSkeletonDemo(true);
    setTimeout(() => setShowSkeletonDemo(false), 3000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-foreground mb-2 text-3xl font-bold">
          Skeleton Component
        </h1>
        <p className="text-muted-foreground text-lg">
          Loading state placeholders with customizable animations and variants
          for better user experience during data loading.
        </p>
      </div>

      <div className="space-y-8">
        {/* Interactive Controls */}
        <Card size="lg">
          <CardHeader>
            <CardTitle>Interactive Skeleton Demo</CardTitle>
            <CardDescription>
              Configure and test different skeleton variants and animations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Controls Grid */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Animation
                  </label>
                  <select
                    value={skeletonAnimation}
                    onChange={e =>
                      setSkeletonAnimation(
                        e.target.value as 'pulse' | 'wave' | 'none'
                      )
                    }
                    className="border-border bg-background w-full rounded-md border px-3 py-2 text-sm"
                  >
                    <option value="pulse">Pulse</option>
                    <option value="wave">Wave</option>
                    <option value="none">None</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Variant
                  </label>
                  <select
                    value={skeletonVariant}
                    onChange={e =>
                      setSkeletonVariant(
                        e.target.value as
                          | 'default'
                          | 'text'
                          | 'circular'
                          | 'card'
                          | 'image'
                          | 'button'
                      )
                    }
                    className="border-border bg-background w-full rounded-md border px-3 py-2 text-sm"
                  >
                    <option value="default">Default</option>
                    <option value="text">Text</option>
                    <option value="circular">Circular</option>
                    <option value="card">Card</option>
                    <option value="image">Image</option>
                    <option value="button">Button</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Size</label>
                  <select
                    value={skeletonSize}
                    onChange={e =>
                      setSkeletonSize(
                        e.target.value as 'sm' | 'default' | 'lg' | 'full'
                      )
                    }
                    className="border-border bg-background w-full rounded-md border px-3 py-2 text-sm"
                  >
                    <option value="sm">Small</option>
                    <option value="default">Default</option>
                    <option value="lg">Large</option>
                    <option value="full">Full</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Rounded
                  </label>
                  <select
                    value={skeletonRounded}
                    onChange={e =>
                      setSkeletonRounded(
                        e.target.value as
                          | 'none'
                          | 'sm'
                          | 'default'
                          | 'lg'
                          | 'full'
                      )
                    }
                    className="border-border bg-background w-full rounded-md border px-3 py-2 text-sm"
                  >
                    <option value="none">None</option>
                    <option value="sm">Small</option>
                    <option value="default">Default</option>
                    <option value="lg">Large</option>
                    <option value="full">Full</option>
                  </select>
                </div>
              </div>

              {/* Live Example */}
              <div>
                <h4 className="mb-3 font-medium">Live Example</h4>
                <div className="max-w-md">
                  {Array.from({ length: skeletonCount }).map((_, i) => (
                    <Skeleton
                      key={i}
                      variant={skeletonVariant}
                      size={skeletonSize}
                      animation={skeletonAnimation}
                      rounded={skeletonRounded}
                      className="mb-2"
                    />
                  ))}
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <span className="text-sm">Count:</span>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={skeletonCount}
                    onChange={e =>
                      setSkeletonCount(parseInt(e.target.value) || 1)
                    }
                    className="border-border bg-background w-16 rounded-md border px-2 py-1 text-sm"
                  />
                </label>
                <Button onClick={toggleSkeletonDemo} variant="outline">
                  Demo Loading State
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Basic Variants */}
        <Card size="lg">
          <CardHeader>
            <CardTitle>Basic Variants</CardTitle>
            <CardDescription>
              Standard skeleton components for common use cases
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h4 className="mb-3 font-medium">Text Skeletons</h4>
                <div className="space-y-2">
                  <SkeletonText className="w-full" />
                  <SkeletonText className="w-4/5" />
                  <SkeletonText className="w-3/5" />
                  <SkeletonText className="w-2/5" />
                </div>
              </div>

              <div>
                <h4 className="mb-3 font-medium">Avatar & Button Skeletons</h4>
                <div className="flex items-center gap-4">
                  <SkeletonAvatar size="sm" />
                  <SkeletonAvatar size="default" />
                  <SkeletonAvatar size="lg" />
                  <SkeletonButton size="sm" />
                  <SkeletonButton size="default" />
                  <SkeletonButton size="lg" />
                </div>
              </div>

              <div>
                <h4 className="mb-3 font-medium">Shape Variants</h4>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Default (Rectangle)</p>
                    <Skeleton variant="default" className="h-16 w-full" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Circular</p>
                    <Skeleton variant="circular" className="h-16 w-16" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Text Lines</p>
                    <div className="space-y-1">
                      <Skeleton variant="text" className="h-4 w-full" />
                      <Skeleton variant="text" className="h-4 w-3/4" />
                      <Skeleton variant="text" className="h-4 w-1/2" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recipe App Skeletons */}
        <Card size="lg">
          <CardHeader>
            <CardTitle>Recipe App Loading States</CardTitle>
            <CardDescription>
              Pre-built skeleton components for common recipe app layouts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="font-medium">Recipe Card Skeleton</h4>
                  <Button
                    onClick={() => {
                      setShowSkeletonDemo(true);
                      setTimeout(() => setShowSkeletonDemo(false), 2000);
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Demo
                  </Button>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {showSkeletonDemo ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <RecipeCardSkeleton key={i} />
                    ))
                  ) : (
                    <div className="text-muted-foreground col-span-full py-8 text-center text-sm">
                      Click &quot;Demo&quot; to see the loading state
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="mb-4 font-medium">Recipe List Skeleton</h4>
                <RecipeListSkeleton count={3} />
              </div>

              <div>
                <h4 className="mb-4 font-medium">Profile Skeleton</h4>
                <div className="max-w-md">
                  <ProfileSkeleton />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Animation Types */}
        <Card size="lg">
          <CardHeader>
            <CardTitle>Animation Types</CardTitle>
            <CardDescription>
              Different animation styles for skeleton loading states
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-3">
                <h4 className="font-medium">Pulse Animation</h4>
                <div className="space-y-2">
                  <Skeleton animation="pulse" className="h-4 w-full" />
                  <Skeleton animation="pulse" className="h-4 w-3/4" />
                  <Skeleton animation="pulse" className="h-4 w-1/2" />
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium">Wave Animation</h4>
                <div className="space-y-2">
                  <Skeleton animation="wave" className="h-4 w-full" />
                  <Skeleton animation="wave" className="h-4 w-3/4" />
                  <Skeleton animation="wave" className="h-4 w-1/2" />
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium">No Animation</h4>
                <div className="space-y-2">
                  <Skeleton animation="none" className="h-4 w-full" />
                  <Skeleton animation="none" className="h-4 w-3/4" />
                  <Skeleton animation="none" className="h-4 w-1/2" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Code Examples */}
        <Card size="lg">
          <CardHeader>
            <CardTitle>Code Examples</CardTitle>
            <CardDescription>
              Implementation examples for skeleton components
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-muted overflow-x-auto rounded-md p-4 font-mono text-sm">
                <div className="text-muted-foreground mb-2">{`// Basic skeleton`}</div>
                <div>{`<Skeleton className="h-4 w-full" />`}</div>
              </div>
              <div className="bg-muted overflow-x-auto rounded-md p-4 font-mono text-sm">
                <div className="text-muted-foreground mb-2">{`// Recipe card skeleton`}</div>
                <div>{`<RecipeCardSkeleton />`}</div>
              </div>
              <div className="bg-muted overflow-x-auto rounded-md p-4 font-mono text-sm">
                <div className="text-muted-foreground mb-2">{`// Custom skeleton with animation`}</div>
                <div>{`<Skeleton`}</div>
                <div>{`  variant="circular"`}</div>
                <div>{`  animation="wave"`}</div>
                <div>{`  size="lg"`}</div>
                <div>{`  className="h-16 w-16"`}</div>
                <div>{`/>`}</div>
              </div>
              <div className="bg-muted overflow-x-auto rounded-md p-4 font-mono text-sm">
                <div className="text-muted-foreground mb-2">{`// Loading state pattern`}</div>
                <div>{`{isLoading ? (`}</div>
                <div>{`  <RecipeListSkeleton count={5} />`}</div>
                <div>{`) : (`}</div>
                <div>{`  <RecipeList recipes={recipes} />`}</div>
                <div>{`)}`}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
