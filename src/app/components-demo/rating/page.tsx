'use client';

import React, { useState } from 'react';
import { Rating } from '@/components/ui/rating';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

export default function RatingDemoPage() {
  const [interactiveRating, setInteractiveRating] = useState(0);
  const [interactiveStarRating, setInteractiveStarRating] = useState(0);
  const [interactiveHeartRating, setInteractiveHeartRating] = useState(0);
  const [recipeRating, setRecipeRating] = useState(4);
  const [difficultyRating, setDifficultyRating] = useState(3);
  const [isFavorite, setIsFavorite] = useState(false);
  const [quickFeedback, setQuickFeedback] = useState(0);
  const [healthScore, setHealthScore] = useState(8);
  const [threeStarRating, setThreeStarRating] = useState(0);
  const [tenPointRating, setTenPointRating] = useState(0);

  return (
    <div className="container mx-auto space-y-8 px-4 py-8">
      {/* Header */}
      <header className="space-y-4">
        <h1 className="text-foreground text-4xl font-bold">Rating Component</h1>
        <p className="text-muted-foreground text-lg">
          Visual indicators for feedback, quality, and ratings with full
          accessibility support.
        </p>
      </header>

      {/* Interactive Demo */}
      <Card>
        <CardHeader>
          <CardTitle>Interactive Demo</CardTitle>
          <CardDescription>
            Try clicking on the stars to rate. This demonstrates the interactive
            functionality.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Rate this demo:</label>
            <Rating
              value={interactiveRating}
              precision="half"
              interactive
              onChange={setInteractiveRating}
              showValue
              showLabel
              label="Your Rating"
            />
          </div>
        </CardContent>
      </Card>

      {/* Rating Types */}
      <Card>
        <CardHeader>
          <CardTitle>Rating Types</CardTitle>
          <CardDescription>
            Different types of rating displays for various use cases.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Star Rating</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-muted-foreground mb-2 text-sm">
                    Read-only display
                  </p>
                  <Rating type="star" value={4} showValue />
                </div>
                <div>
                  <p className="text-muted-foreground mb-2 text-sm">
                    Half precision
                  </p>
                  <Rating type="star" value={3.5} precision="half" showValue />
                </div>
                <div>
                  <p className="text-muted-foreground mb-2 text-sm">
                    Interactive (half stars)
                  </p>
                  <Rating
                    type="star"
                    value={interactiveStarRating}
                    precision="half"
                    interactive
                    onChange={setInteractiveStarRating}
                    showValue
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Heart Rating</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-muted-foreground mb-2 text-sm">
                    Read-only display
                  </p>
                  <Rating type="heart" value={3} showValue />
                </div>
                <div>
                  <p className="text-muted-foreground mb-2 text-sm">
                    Half precision
                  </p>
                  <Rating type="heart" value={2.5} precision="half" showValue />
                </div>
                <div>
                  <p className="text-muted-foreground mb-2 text-sm">
                    Interactive (half hearts)
                  </p>
                  <Rating
                    type="heart"
                    value={interactiveHeartRating}
                    precision="half"
                    interactive
                    onChange={setInteractiveHeartRating}
                    showValue
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Thumbs Rating</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-muted-foreground mb-2 text-sm">
                    Thumbs up
                  </p>
                  <Rating type="thumbs" value={1} showValue />
                </div>
                <div>
                  <p className="text-muted-foreground mb-2 text-sm">
                    Thumbs down
                  </p>
                  <Rating type="thumbs" value={-1} showValue />
                </div>
                <div>
                  <p className="text-muted-foreground mb-2 text-sm">
                    Interactive
                  </p>
                  <Rating
                    type="thumbs"
                    value={quickFeedback}
                    interactive
                    onChange={setQuickFeedback}
                    showValue
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Numeric Rating</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-muted-foreground mb-2 text-sm">
                    Read-only display
                  </p>
                  <Rating type="numeric" value={8} maxValue={10} showValue />
                </div>
                <div>
                  <p className="text-muted-foreground mb-2 text-sm">
                    Interactive
                  </p>
                  <Rating
                    type="numeric"
                    value={healthScore}
                    maxValue={10}
                    interactive
                    onChange={setHealthScore}
                    showValue
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sizes */}
      <Card>
        <CardHeader>
          <CardTitle>Sizes</CardTitle>
          <CardDescription>
            Different sizes for various contexts and layouts.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div>
              <p className="text-muted-foreground mb-2 text-sm">Small</p>
              <Rating size="sm" value={4} showValue />
            </div>
            <div>
              <p className="text-muted-foreground mb-2 text-sm">
                Medium (Default)
              </p>
              <Rating size="md" value={4} showValue />
            </div>
            <div>
              <p className="text-muted-foreground mb-2 text-sm">Large</p>
              <Rating size="lg" value={4} showValue />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Color Variants */}
      <Card>
        <CardHeader>
          <CardTitle>Color Variants</CardTitle>
          <CardDescription>
            Different color schemes for various contexts and branding.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <p className="text-muted-foreground mb-2 text-sm">Default</p>
              <Rating variant="default" value={4} showValue />
            </div>
            <div>
              <p className="text-muted-foreground mb-2 text-sm">Accent</p>
              <Rating variant="accent" value={4} showValue />
            </div>
            <div>
              <p className="text-muted-foreground mb-2 text-sm">Warning</p>
              <Rating variant="warning" value={4} showValue />
            </div>
            <div>
              <p className="text-muted-foreground mb-2 text-sm">Success</p>
              <Rating variant="success" value={4} showValue />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recipe Use Cases */}
      <Card>
        <CardHeader>
          <CardTitle>Recipe Application Examples</CardTitle>
          <CardDescription>
            Real-world examples of how ratings are used in recipe applications.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-3 rounded-lg border p-4">
              <h3 className="font-semibold">
                Grandma&apos;s Chocolate Chip Cookies
              </h3>
              <div className="flex items-center gap-4">
                <Rating
                  type="star"
                  value={recipeRating}
                  precision="half"
                  interactive
                  onChange={setRecipeRating}
                  showValue
                  label="Overall Rating"
                  showLabel
                />
                <span className="text-muted-foreground text-sm">
                  (142 reviews)
                </span>
              </div>
            </div>

            <div className="space-y-3 rounded-lg border p-4">
              <h3 className="font-semibold">Beef Wellington</h3>
              <div className="flex items-center gap-4">
                <Rating
                  type="star"
                  variant="warning"
                  value={difficultyRating}
                  interactive
                  onChange={setDifficultyRating}
                  maxValue={5}
                  showValue
                  label="Difficulty"
                  showLabel
                />
                <span className="text-muted-foreground text-sm">Advanced</span>
              </div>
            </div>

            <div className="space-y-3 rounded-lg border p-4">
              <h3 className="font-semibold">Quick Pasta Salad</h3>
              <div className="flex items-center gap-4">
                <Rating
                  type="heart"
                  value={isFavorite ? 1 : 0}
                  maxValue={1}
                  interactive
                  onChange={value => setIsFavorite(value > 0)}
                  label="Add to Favorites"
                  showLabel
                />
              </div>
            </div>

            <div className="space-y-3 rounded-lg border p-4">
              <h3 className="font-semibold">Mediterranean Quinoa Bowl</h3>
              <div className="flex items-center gap-4">
                <Rating
                  type="numeric"
                  variant="success"
                  value={healthScore}
                  maxValue={10}
                  interactive
                  onChange={setHealthScore}
                  showValue
                  label="Health Score"
                  showLabel
                />
                <span className="text-muted-foreground text-sm">
                  {healthScore >= 8
                    ? 'Excellent nutrition'
                    : healthScore >= 6
                      ? 'Good nutrition'
                      : healthScore >= 4
                        ? 'Fair nutrition'
                        : 'Needs improvement'}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* States */}
      <Card>
        <CardHeader>
          <CardTitle>Component States</CardTitle>
          <CardDescription>
            Different states for various interaction scenarios.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <p className="text-muted-foreground mb-2 text-sm">Disabled</p>
              <Rating
                value={3}
                disabled
                showValue
                label="Disabled Rating"
                showLabel
              />
            </div>
            <div>
              <p className="text-muted-foreground mb-2 text-sm">Read-only</p>
              <Rating
                value={4}
                readOnly
                showValue
                label="Read-only Rating"
                showLabel
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Custom Configurations */}
      <Card>
        <CardHeader>
          <CardTitle>Custom Configurations</CardTitle>
          <CardDescription>
            Examples with custom maximum values and configurations.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <p className="text-muted-foreground text-sm">3-Star System</p>
              <Rating
                value={threeStarRating}
                maxValue={3}
                interactive
                onChange={setThreeStarRating}
                showValue
                label="Simple Rating"
                showLabel
              />
            </div>
            <div className="space-y-3">
              <p className="text-muted-foreground text-sm">10-Point Scale</p>
              <Rating
                type="numeric"
                value={tenPointRating}
                maxValue={10}
                interactive
                onChange={setTenPointRating}
                showValue
                label="Detailed Score"
                showLabel
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Combined Example */}
      <Card>
        <CardHeader>
          <CardTitle>Complete Recipe Card Example</CardTitle>
          <CardDescription>
            A comprehensive example showing multiple rating types in context.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 rounded-lg border p-6">
            <h3 className="text-lg font-semibold">Homemade Pizza Margherita</h3>
            <p className="text-muted-foreground">
              Classic Italian pizza with fresh tomatoes, mozzarella, and basil
            </p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <Rating
                  type="star"
                  value={4.5}
                  precision="half"
                  showValue
                  label="Overall Rating"
                  showLabel
                />
                <Rating
                  type="star"
                  variant="warning"
                  value={2}
                  showValue
                  label="Difficulty"
                  showLabel
                />
              </div>
              <div className="space-y-3">
                <Rating
                  type="heart"
                  value={1}
                  maxValue={1}
                  showLabel
                  label="Favorited"
                />
                <Rating
                  type="numeric"
                  variant="success"
                  value={7}
                  maxValue={10}
                  showValue
                  label="Health Score"
                  showLabel
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Accessibility Information */}
      <Card>
        <CardHeader>
          <CardTitle>Accessibility Features</CardTitle>
          <CardDescription>
            The Rating component is fully accessible with keyboard navigation
            and screen reader support.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted space-y-3 rounded-lg p-4">
            <h4 className="font-medium">Keyboard Navigation</h4>
            <ul className="space-y-1 text-sm">
              <li>
                <kbd className="bg-background rounded px-2 py-1">Tab</kbd> -
                Navigate between rating items
              </li>
              <li>
                <kbd className="bg-background rounded px-2 py-1">Enter</kbd> or{' '}
                <kbd className="bg-background rounded px-2 py-1">Space</kbd> -
                Select a rating value
              </li>
              <li>
                <kbd className="bg-background rounded px-2 py-1">Escape</kbd> -
                Clear hover state (when interactive)
              </li>
            </ul>
          </div>
          <div className="space-y-2">
            <p className="text-muted-foreground text-sm">
              Try navigating this rating with your keyboard:
            </p>
            <Rating
              value={interactiveRating}
              precision="half"
              interactive
              onChange={setInteractiveRating}
              showValue
              label="Keyboard Navigation Demo"
              showLabel
              aria-describedby="rating-help"
            />
            <p id="rating-help" className="text-muted-foreground text-xs">
              Use Tab to navigate, Enter or Space to select a rating
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
