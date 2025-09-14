'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

export default function CardDemo() {
  const [cardInteractive, setCardInteractive] = useState(false);
  const [cardClickCount, setCardClickCount] = useState(0);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-foreground mb-2 text-3xl font-bold">
          Card Component
        </h1>
        <p className="text-muted-foreground text-lg">
          Flexible card component with multiple variants and compound pattern.
          Perfect for recipe cards, info panels, and stat displays.
        </p>
      </div>

      <div className="space-y-8">
        {/* Interactive Controls */}
        <Card size="lg">
          <CardHeader>
            <CardTitle>Interactive Controls</CardTitle>
            <CardDescription>
              Test different card features and states
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 flex flex-wrap gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={cardInteractive}
                  onChange={e => setCardInteractive(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Interactive</span>
              </label>
            </div>

            <div className="space-y-8">
              {/* Live Example */}
              <div>
                <h4 className="mb-3 font-medium">Live Example</h4>
                <div className="max-w-md">
                  <Card
                    variant="elevated"
                    interactive={cardInteractive}
                    onClick={() => {
                      if (cardInteractive) {
                        setCardClickCount(prev => prev + 1);
                      }
                    }}
                  >
                    <CardHeader>
                      <CardTitle>Sample Recipe Card</CardTitle>
                      <CardDescription>
                        {cardInteractive
                          ? `Clicked ${cardClickCount} times`
                          : 'Recipe description'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">
                        This is a sample recipe card content area.
                      </p>
                      <div className="text-muted-foreground mt-2 flex gap-2 text-xs">
                        <span>⏱️ 30 mins</span>
                        <span>👨‍🍳 Easy</span>
                        <span>🍽️ 4 servings</span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <div className="flex w-full items-center justify-between">
                        <span className="text-muted-foreground text-sm">
                          ★★★★★
                        </span>
                        <Button size="sm" variant="outline">
                          View Recipe
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                </div>
              </div>

              {/* Variants */}
              <div>
                <h4 className="mb-3 font-medium">Variants</h4>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Card variant="default">
                    <CardContent>
                      <CardTitle className="mb-2">Default</CardTitle>
                      <CardDescription>
                        Clean minimal style with subtle border
                      </CardDescription>
                    </CardContent>
                  </Card>
                  <Card variant="elevated">
                    <CardContent>
                      <CardTitle className="mb-2">Elevated</CardTitle>
                      <CardDescription>
                        Enhanced shadow for prominence
                      </CardDescription>
                    </CardContent>
                  </Card>
                  <Card variant="outlined">
                    <CardContent>
                      <CardTitle className="mb-2">Outlined</CardTitle>
                      <CardDescription>
                        Stronger border, no background
                      </CardDescription>
                    </CardContent>
                  </Card>
                  <Card variant="ghost">
                    <CardContent>
                      <CardTitle className="mb-2">Ghost</CardTitle>
                      <CardDescription>
                        Minimal styling, no background
                      </CardDescription>
                    </CardContent>
                  </Card>
                  <Card
                    variant="interactive"
                    onClick={() => alert('Interactive card clicked!')}
                  >
                    <CardContent>
                      <CardTitle className="mb-2">Interactive</CardTitle>
                      <CardDescription>
                        Hover effects and click handling
                      </CardDescription>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Sizes */}
              <div>
                <h4 className="mb-3 font-medium">Sizes</h4>
                <div className="space-y-4">
                  <Card size="sm" variant="outlined">
                    <CardContent>
                      <CardTitle className="text-lg">Small Card</CardTitle>
                      <CardDescription>Compact padding (p-3)</CardDescription>
                    </CardContent>
                  </Card>
                  <Card size="default" variant="outlined">
                    <CardContent>
                      <CardTitle>Default Card</CardTitle>
                      <CardDescription>Standard padding (p-4)</CardDescription>
                    </CardContent>
                  </Card>
                  <Card size="lg" variant="outlined">
                    <CardContent>
                      <CardTitle className="text-2xl">Large Card</CardTitle>
                      <CardDescription>Spacious padding (p-6)</CardDescription>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Usage Examples */}
        <Card size="lg">
          <CardHeader>
            <CardTitle>Recipe App Usage Examples</CardTitle>
            <CardDescription>
              Real-world card implementations for the recipe app
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Recipe Cards */}
              <div>
                <h4 className="mb-3 font-medium">Recipe Cards</h4>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Card variant="elevated" interactive>
                    <CardContent className="relative aspect-square">
                      <div className="text-muted-foreground mb-3 flex h-32 items-center justify-center rounded-md bg-gradient-to-br from-orange-100 to-red-100 text-sm">
                        Recipe Image
                      </div>
                      <CardTitle className="mb-1">
                        Chocolate Chip Cookies
                      </CardTitle>
                      <CardDescription className="mb-2">
                        Classic homemade cookies
                      </CardDescription>
                      <div className="text-muted-foreground flex gap-2 text-xs">
                        <span>⏱️ 30m</span>
                        <span>👨‍🍳 Easy</span>
                        <span>⭐ 4.8</span>
                      </div>
                    </CardContent>
                  </Card>
                  <Card variant="elevated" interactive>
                    <CardContent className="relative aspect-square">
                      <div className="text-muted-foreground mb-3 flex h-32 items-center justify-center rounded-md bg-gradient-to-br from-green-100 to-blue-100 text-sm">
                        Recipe Image
                      </div>
                      <CardTitle className="mb-1">Caesar Salad</CardTitle>
                      <CardDescription className="mb-2">
                        Fresh and crispy salad
                      </CardDescription>
                      <div className="text-muted-foreground flex gap-2 text-xs">
                        <span>⏱️ 15m</span>
                        <span>👨‍🍳 Easy</span>
                        <span>⭐ 4.6</span>
                      </div>
                    </CardContent>
                  </Card>
                  <Card variant="elevated" interactive>
                    <CardContent className="relative aspect-square">
                      <div className="text-muted-foreground mb-3 flex h-32 items-center justify-center rounded-md bg-gradient-to-br from-purple-100 to-pink-100 text-sm">
                        Recipe Image
                      </div>
                      <CardTitle className="mb-1">Beef Stir Fry</CardTitle>
                      <CardDescription className="mb-2">
                        Quick and healthy dinner
                      </CardDescription>
                      <div className="text-muted-foreground flex gap-2 text-xs">
                        <span>⏱️ 25m</span>
                        <span>👨‍🍳 Medium</span>
                        <span>⭐ 4.9</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Stat Cards */}
              <div>
                <h4 className="mb-3 font-medium">Dashboard Stats</h4>
                <div className="grid gap-4 md:grid-cols-4">
                  <Card size="sm">
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-600">
                        142
                      </div>
                      <p className="text-muted-foreground text-xs">
                        Total Recipes
                      </p>
                    </CardContent>
                  </Card>
                  <Card size="sm">
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">
                        38
                      </div>
                      <p className="text-muted-foreground text-xs">Favorites</p>
                    </CardContent>
                  </Card>
                  <Card size="sm">
                    <CardContent>
                      <div className="text-2xl font-bold text-orange-600">
                        24
                      </div>
                      <p className="text-muted-foreground text-xs">This Week</p>
                    </CardContent>
                  </Card>
                  <Card size="sm">
                    <CardContent>
                      <div className="text-2xl font-bold text-purple-600">
                        4.8
                      </div>
                      <p className="text-muted-foreground text-xs">
                        Avg Rating
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Info Cards */}
              <div>
                <h4 className="mb-3 font-medium">Info Cards</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <Card variant="outlined">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        💡 Pro Tip
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">
                        Always preheat your oven to ensure even baking and
                        optimal results.
                      </p>
                    </CardContent>
                  </Card>
                  <Card variant="ghost">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        🏆 Achievement
                      </CardTitle>
                      <CardDescription>Recipe Master</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">
                        You&apos;ve successfully completed 50 recipes!
                      </p>
                    </CardContent>
                  </Card>
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
              Implementation examples for different card patterns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-muted overflow-x-auto rounded-md p-4 font-mono text-sm">
                <div className="text-muted-foreground mb-2">{`// Basic card`}</div>
                <div>{`<Card>`}</div>
                <div>{`  <CardContent>Simple card content</CardContent>`}</div>
                <div>{`</Card>`}</div>
              </div>
              <div className="bg-muted overflow-x-auto rounded-md p-4 font-mono text-sm">
                <div className="text-muted-foreground mb-2">{`// Recipe card with full structure`}</div>
                <div>{`<Card variant="elevated" interactive>`}</div>
                <div>{`  <CardHeader>`}</div>
                <div>{`    <CardTitle>Recipe Name</CardTitle>`}</div>
                <div>{`    <CardDescription>Brief description</CardDescription>`}</div>
                <div>{`  </CardHeader>`}</div>
                <div>{`  <CardContent>`}</div>
                <div>{`    <p>Recipe details...</p>`}</div>
                <div>{`  </CardContent>`}</div>
                <div>{`  <CardFooter>`}</div>
                <div>{`    <Button>View Recipe</Button>`}</div>
                <div>{`  </CardFooter>`}</div>
                <div>{`</Card>`}</div>
              </div>
              <div className="bg-muted overflow-x-auto rounded-md p-4 font-mono text-sm">
                <div className="text-muted-foreground mb-2">{`// Stat card`}</div>
                <div>{`<Card size="sm">`}</div>
                <div>{`  <CardContent>`}</div>
                <div>{`    <div className="text-2xl font-bold">42</div>`}</div>
                <div>{`    <p className="text-sm text-muted-foreground">`}</div>
                <div>{`      Total Recipes`}</div>
                <div>{`    </p>`}</div>
                <div>{`  </CardContent>`}</div>
                <div>{`</Card>`}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
