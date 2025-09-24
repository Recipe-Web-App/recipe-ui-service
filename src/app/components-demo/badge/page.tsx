'use client';

import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';

export default function BadgeDemo() {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([
    'Vegetarian',
    'Quick',
  ]);

  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev =>
      prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
    );
  };

  const removeTag = (tag: string) => {
    setSelectedTags(prev => prev.filter(t => t !== tag));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-foreground mb-2 text-3xl font-bold">
          Badge Component
        </h1>
        <p className="text-muted-foreground text-lg">
          Flexible, accessible badges for tags, categories, and status
          indicators. Perfect for recipe categorization and user interface
          elements.
        </p>
      </div>

      <div className="space-y-8">
        {/* Variants */}
        <div className="bg-card rounded-lg border p-6">
          <h3 className="mb-4 text-lg font-medium">Variants</h3>
          <p className="text-muted-foreground mb-6 text-sm">
            Seven semantic variants designed for different use cases in the
            recipe application.
          </p>
          <div className="flex flex-wrap gap-3">
            <Badge variant="default">Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="info">Info</Badge>
          </div>
        </div>

        {/* Sizes */}
        <div className="bg-card rounded-lg border p-6">
          <h3 className="mb-4 text-lg font-medium">Sizes</h3>
          <p className="text-muted-foreground mb-6 text-sm">
            Three sizes to accommodate different layout needs and visual
            hierarchy.
          </p>
          <div className="flex items-center gap-4">
            <Badge size="sm">Small</Badge>
            <Badge size="default">Default</Badge>
            <Badge size="lg">Large</Badge>
          </div>
        </div>

        {/* Recipe App Examples */}
        <div className="bg-card rounded-lg border p-6">
          <h3 className="mb-4 text-lg font-medium">
            Recipe Application Examples
          </h3>

          <div className="space-y-6">
            {/* Recipe Categories */}
            <div>
              <h4 className="mb-3 font-medium">Recipe Categories</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="info">Breakfast</Badge>
                <Badge variant="info">Lunch</Badge>
                <Badge variant="info">Dinner</Badge>
                <Badge variant="info">Dessert</Badge>
                <Badge variant="info">Snack</Badge>
                <Badge variant="info">Appetizer</Badge>
              </div>
            </div>

            {/* Difficulty Levels */}
            <div>
              <h4 className="mb-3 font-medium">Difficulty Levels</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="success">Easy</Badge>
                <Badge variant="warning">Medium</Badge>
                <Badge variant="destructive">Hard</Badge>
              </div>
            </div>

            {/* Dietary Restrictions */}
            <div>
              <h4 className="mb-3 font-medium">Dietary Restrictions</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Vegetarian</Badge>
                <Badge variant="outline">Vegan</Badge>
                <Badge variant="outline">Gluten-Free</Badge>
                <Badge variant="outline">Dairy-Free</Badge>
                <Badge variant="outline">Keto</Badge>
                <Badge variant="outline">Low-Carb</Badge>
                <Badge variant="outline">Sugar-Free</Badge>
              </div>
            </div>

            {/* Recipe Status */}
            <div>
              <h4 className="mb-3 font-medium">Recipe Status</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="success">Published</Badge>
                <Badge variant="warning">Draft</Badge>
                <Badge variant="secondary">Private</Badge>
                <Badge variant="info">New</Badge>
                <Badge variant="destructive">Archived</Badge>
              </div>
            </div>

            {/* Cooking Times */}
            <div>
              <h4 className="mb-3 font-medium">Cooking Times</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" size="sm">
                  5 min
                </Badge>
                <Badge variant="secondary" size="sm">
                  15 min
                </Badge>
                <Badge variant="secondary" size="sm">
                  30 min
                </Badge>
                <Badge variant="secondary" size="sm">
                  1 hour
                </Badge>
                <Badge variant="secondary" size="sm">
                  2+ hours
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Examples */}
        <div className="bg-card rounded-lg border p-6">
          <h3 className="mb-4 text-lg font-medium">Interactive Examples</h3>

          <div className="space-y-6">
            {/* Filter Badges */}
            <div>
              <h4 className="mb-3 font-medium">Filter Selection</h4>
              <p className="text-muted-foreground mb-4 text-sm">
                Click on filter options to toggle them on/off:
              </p>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {['Easy', 'Medium', 'Hard'].map(difficulty => (
                    <Badge
                      key={difficulty}
                      variant={
                        selectedFilters.includes(difficulty)
                          ? 'default'
                          : 'outline'
                      }
                      className="cursor-pointer"
                      onClick={() => toggleFilter(difficulty)}
                    >
                      {difficulty}
                    </Badge>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {['Under 30 min', '30-60 min', '1+ hour'].map(time => (
                    <Badge
                      key={time}
                      variant={
                        selectedFilters.includes(time) ? 'default' : 'outline'
                      }
                      className="cursor-pointer"
                      onClick={() => toggleFilter(time)}
                    >
                      {time}
                    </Badge>
                  ))}
                </div>
                {selectedFilters.length > 0 && (
                  <div className="mt-4">
                    <p className="mb-2 text-sm font-medium">Active Filters:</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedFilters.map(filter => (
                        <Badge
                          key={filter}
                          variant="secondary"
                          className="cursor-pointer"
                          onClick={() => toggleFilter(filter)}
                        >
                          {filter} ×
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Removable Tags */}
            <div>
              <h4 className="mb-3 font-medium">Removable Tags</h4>
              <p className="text-muted-foreground mb-4 text-sm">
                Recipe tags that can be removed:
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedTags.map(tag => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="cursor-pointer gap-1 pr-1"
                    onClick={() => removeTag(tag)}
                  >
                    {tag}
                    <span className="ml-1 text-xs">×</span>
                  </Badge>
                ))}
                {selectedTags.length === 0 && (
                  <p className="text-muted-foreground text-sm">
                    No tags selected
                  </p>
                )}
              </div>
            </div>

            {/* Polymorphic Usage */}
            <div>
              <h4 className="mb-3 font-medium">Polymorphic Usage</h4>
              <p className="text-muted-foreground mb-4 text-sm">
                Badges can render as different elements using the `asChild`
                prop:
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge asChild>
                  <a href="#demo" className="no-underline hover:underline">
                    Link Badge
                  </a>
                </Badge>
                <Badge variant="outline" asChild>
                  <button type="button" className="cursor-pointer">
                    Button Badge
                  </button>
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Usage Examples */}
        <div className="bg-card rounded-lg border p-6">
          <h3 className="mb-4 text-lg font-medium">
            Real-World Usage Patterns
          </h3>

          <div className="space-y-6">
            {/* Recipe Card */}
            <div className="bg-muted/50 rounded-lg border p-4">
              <h4 className="mb-3 font-medium">Recipe Card</h4>
              <div className="bg-background rounded-lg border p-4">
                <div className="mb-3">
                  <h5 className="font-semibold">Chicken Tikka Masala</h5>
                  <p className="text-muted-foreground text-sm">
                    Aromatic and flavorful Indian curry with tender chicken
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" size="sm">
                    45 min
                  </Badge>
                  <Badge variant="warning" size="sm">
                    Medium
                  </Badge>
                  <Badge variant="info" size="sm">
                    Indian
                  </Badge>
                  <Badge variant="info" size="sm">
                    Dinner
                  </Badge>
                  <Badge variant="outline" size="sm">
                    Spicy
                  </Badge>
                </div>
              </div>
            </div>

            {/* Filter Panel */}
            <div className="bg-muted/50 rounded-lg border p-4">
              <h4 className="mb-3 font-medium">Filter Panel</h4>
              <div className="bg-background space-y-3 rounded-lg border p-4">
                <div>
                  <h6 className="mb-2 text-sm font-medium">Difficulty</h6>
                  <div className="flex gap-2">
                    <Badge variant="outline" size="sm">
                      Easy
                    </Badge>
                    <Badge variant="default" size="sm">
                      Medium
                    </Badge>
                    <Badge variant="outline" size="sm">
                      Hard
                    </Badge>
                  </div>
                </div>
                <div>
                  <h6 className="mb-2 text-sm font-medium">Categories</h6>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="default" size="sm">
                      Breakfast
                    </Badge>
                    <Badge variant="outline" size="sm">
                      Lunch
                    </Badge>
                    <Badge variant="outline" size="sm">
                      Dinner
                    </Badge>
                    <Badge variant="default" size="sm">
                      Dessert
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Recipe Status Dashboard */}
            <div className="bg-muted/50 rounded-lg border p-4">
              <h4 className="mb-3 font-medium">Recipe Management Dashboard</h4>
              <div className="bg-background rounded-lg border p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Chocolate Chip Cookies</span>
                    <Badge variant="success">Published</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Thai Green Curry</span>
                    <Badge variant="warning">Draft</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Secret Family Recipe</span>
                    <Badge variant="secondary">Private</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Old Recipe Collection</span>
                    <Badge variant="destructive">Archived</Badge>
                  </div>
                </div>
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
              <div>{`<Badge>New Recipe</Badge>`}</div>
            </div>
            <div className="bg-muted overflow-x-auto rounded-md p-4 font-mono text-sm">
              <div className="text-muted-foreground mb-2">
                {`// With variants and sizes`}
              </div>
              <div>{`<Badge variant="success" size="lg">Featured</Badge>`}</div>
              <div>{`<Badge variant="warning">Draft</Badge>`}</div>
              <div>{`<Badge variant="outline" size="sm">15 min</Badge>`}</div>
            </div>
            <div className="bg-muted overflow-x-auto rounded-md p-4 font-mono text-sm">
              <div className="text-muted-foreground mb-2">
                {`// Recipe card integration`}
              </div>
              <div>{`<div className="flex gap-2">`}</div>
              <div>{`  <Badge variant="outline" size="sm">`}</div>
              <div>{`    {recipe.cookTime} min`}</div>
              <div>{`  </Badge>`}</div>
              <div>{`  <Badge variant="warning">{recipe.difficulty}</Badge>`}</div>
              <div>{`</div>`}</div>
            </div>
            <div className="bg-muted overflow-x-auto rounded-md p-4 font-mono text-sm">
              <div className="text-muted-foreground mb-2">
                {`// Polymorphic usage`}
              </div>
              <div>{`<Badge asChild>`}</div>
              <div>{`  <Link href="/category/dessert">Dessert</Link>`}</div>
              <div>{`</Badge>`}</div>
            </div>
          </div>
        </div>

        {/* Accessibility */}
        <div className="bg-card rounded-lg border p-6">
          <h3 className="mb-4 text-lg font-medium">Accessibility</h3>
          <div className="space-y-4">
            <p className="text-muted-foreground text-sm">
              The Badge component follows accessibility best practices:
            </p>
            <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
              <li>Uses semantic HTML with appropriate roles</li>
              <li>Maintains WCAG AA color contrast ratios</li>
              <li>Supports keyboard navigation when interactive</li>
              <li>Information is not conveyed by color alone</li>
              <li>Screen reader friendly with descriptive text</li>
            </ul>
            <div className="bg-muted overflow-x-auto rounded-md p-4 font-mono text-sm">
              <div className="text-muted-foreground mb-2">
                {`// Adding screen reader context`}
              </div>
              <div>{`<Badge variant="success" aria-label="Recipe status: Published">`}</div>
              <div>{`  Published`}</div>
              <div>{`</Badge>`}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
