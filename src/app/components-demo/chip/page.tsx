'use client';

import React, { useState } from 'react';
import { Chip, ChipGroup, ChipInput, RecipeChip } from '@/components/ui/chip';
import {
  Clock,
  Leaf,
  ChefHat,
  Scale,
  Timer,
  Heart,
  Filter,
} from 'lucide-react';

export default function ChipDemo() {
  const [selectedFilters, setSelectedFilters] = useState<string[]>(['Easy']);
  const [ingredients, setIngredients] = useState<string[]>([
    'Tomato',
    'Onion',
    'Garlic',
  ]);
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([
    'Vegetarian',
  ]);
  const [tags, setTags] = useState<string[]>(['quick', 'healthy', 'summer']);

  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev =>
      prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
    );
  };

  const removeIngredient = (ingredient: string) => {
    setIngredients(prev => prev.filter(i => i !== ingredient));
  };

  const toggleDietary = (restriction: string) => {
    setDietaryRestrictions(prev =>
      prev.includes(restriction)
        ? prev.filter(r => r !== restriction)
        : [...prev, restriction]
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-foreground mb-2 text-3xl font-bold">
          Chip Component
        </h1>
        <p className="text-muted-foreground text-lg">
          Interactive tags with delete, selection, and click actions. More
          dynamic than badges - perfect for managing ingredients, filters, and
          user-generated content.
        </p>
      </div>

      <div className="space-y-8">
        {/* Variants */}
        <div className="bg-card rounded-lg border p-6">
          <h3 className="mb-4 text-lg font-medium">Variants</h3>
          <p className="text-muted-foreground mb-6 text-sm">
            Three visual variants for different interface contexts.
          </p>
          <div className="flex flex-wrap gap-3">
            <Chip variant="default">Default</Chip>
            <Chip variant="outlined">Outlined</Chip>
            <Chip variant="filled">Filled</Chip>
          </div>
        </div>

        {/* Sizes */}
        <div className="bg-card rounded-lg border p-6">
          <h3 className="mb-4 text-lg font-medium">Sizes</h3>
          <p className="text-muted-foreground mb-6 text-sm">
            Three sizes to fit different layouts and content densities.
          </p>
          <div className="flex items-center gap-3">
            <Chip size="sm">Small</Chip>
            <Chip size="md">Medium</Chip>
            <Chip size="lg">Large</Chip>
          </div>
        </div>

        {/* Colors */}
        <div className="bg-card rounded-lg border p-6">
          <h3 className="mb-4 text-lg font-medium">Color Variants</h3>
          <p className="text-muted-foreground mb-6 text-sm">
            Semantic colors for different types of information.
          </p>
          <div className="flex flex-wrap gap-3">
            <Chip color="default">Default</Chip>
            <Chip color="primary">Primary</Chip>
            <Chip color="secondary">Secondary</Chip>
            <Chip color="success">Success</Chip>
            <Chip color="warning">Warning</Chip>
            <Chip color="destructive">Destructive</Chip>
            <Chip color="info">Info</Chip>
          </div>
        </div>

        {/* Interactive Features */}
        <div className="bg-card rounded-lg border p-6">
          <h3 className="mb-4 text-lg font-medium">Interactive Features</h3>

          <div className="space-y-6">
            {/* Deletable Chips */}
            <div>
              <h4 className="mb-3 font-medium">Deletable Chips</h4>
              <p className="text-muted-foreground mb-4 text-sm">
                Click the × to remove chips - perfect for managing lists.
              </p>
              <div className="flex flex-wrap gap-2">
                {ingredients.map(ingredient => (
                  <Chip
                    key={ingredient}
                    onDelete={() => removeIngredient(ingredient)}
                    variant="filled"
                  >
                    {ingredient}
                  </Chip>
                ))}
                {ingredients.length === 0 && (
                  <p className="text-muted-foreground text-sm">
                    All ingredients removed
                  </p>
                )}
              </div>
            </div>

            {/* Selectable Chips */}
            <div>
              <h4 className="mb-3 font-medium">Selectable Chips</h4>
              <p className="text-muted-foreground mb-4 text-sm">
                Click chips to select/deselect them for filtering.
              </p>
              <div className="space-y-3">
                <div>
                  <p className="mb-2 text-sm font-medium">Difficulty</p>
                  <div className="flex gap-2">
                    {['Easy', 'Medium', 'Hard'].map(level => (
                      <Chip
                        key={level}
                        variant="outlined"
                        selected={selectedFilters.includes(level)}
                        onClick={() => toggleFilter(level)}
                        color={
                          level === 'Easy'
                            ? 'success'
                            : level === 'Medium'
                              ? 'warning'
                              : 'destructive'
                        }
                      >
                        {level}
                      </Chip>
                    ))}
                  </div>
                </div>
                {selectedFilters.length > 0 && (
                  <p className="text-muted-foreground text-sm">
                    Selected: {selectedFilters.join(', ')}
                  </p>
                )}
              </div>
            </div>

            {/* Chips with Icons */}
            <div>
              <h4 className="mb-3 font-medium">Chips with Icons</h4>
              <p className="text-muted-foreground mb-4 text-sm">
                Add context with leading icons.
              </p>
              <div className="flex flex-wrap gap-3">
                <Chip icon={<Clock className="h-3 w-3" />} size="sm">
                  30 min
                </Chip>
                <Chip
                  icon={<Leaf className="h-3 w-3" />}
                  variant="outlined"
                  color="success"
                >
                  Vegetarian
                </Chip>
                <Chip
                  icon={<ChefHat className="h-3 w-3" />}
                  onDelete={() => {}}
                  variant="filled"
                >
                  Chef&apos;s Special
                </Chip>
                <Chip icon={<Scale className="h-3 w-3" />} color="info">
                  420 cal
                </Chip>
              </div>
            </div>

            {/* Chips with Avatars */}
            <div>
              <h4 className="mb-3 font-medium">Chips with Avatars</h4>
              <p className="text-muted-foreground mb-4 text-sm">
                Display user avatars or images in chips.
              </p>
              <div className="flex flex-wrap gap-3">
                <Chip
                  avatar={
                    <div className="bg-primary text-primary-foreground flex h-full w-full items-center justify-center text-xs font-bold">
                      JD
                    </div>
                  }
                >
                  John Doe
                </Chip>
                <Chip
                  avatar={
                    <div className="bg-secondary text-secondary-foreground flex h-full w-full items-center justify-center text-xs font-bold">
                      AS
                    </div>
                  }
                  onDelete={() => {}}
                >
                  Alice Smith
                </Chip>
              </div>
            </div>
          </div>
        </div>

        {/* Chip Groups */}
        <div className="bg-card rounded-lg border p-6">
          <h3 className="mb-4 text-lg font-medium">Chip Groups</h3>

          <div className="space-y-6">
            <div>
              <h4 className="mb-3 font-medium">Group with Overflow</h4>
              <p className="text-muted-foreground mb-4 text-sm">
                Limit displayed chips with overflow indicator.
              </p>
              <ChipGroup maxDisplay={4}>
                <Chip size="sm">Italian</Chip>
                <Chip size="sm">Mexican</Chip>
                <Chip size="sm">Chinese</Chip>
                <Chip size="sm">Indian</Chip>
                <Chip size="sm">Thai</Chip>
                <Chip size="sm">Japanese</Chip>
                <Chip size="sm">French</Chip>
              </ChipGroup>
            </div>

            <div>
              <h4 className="mb-3 font-medium">Spacing Options</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-muted-foreground mb-2 text-sm">Tight</p>
                  <ChipGroup spacing="tight">
                    <Chip size="sm" variant="outlined">
                      React
                    </Chip>
                    <Chip size="sm" variant="outlined">
                      TypeScript
                    </Chip>
                    <Chip size="sm" variant="outlined">
                      Next.js
                    </Chip>
                  </ChipGroup>
                </div>
                <div>
                  <p className="text-muted-foreground mb-2 text-sm">Normal</p>
                  <ChipGroup spacing="normal">
                    <Chip variant="filled">Breakfast</Chip>
                    <Chip variant="filled">Lunch</Chip>
                    <Chip variant="filled">Dinner</Chip>
                  </ChipGroup>
                </div>
                <div>
                  <p className="text-muted-foreground mb-2 text-sm">Loose</p>
                  <ChipGroup spacing="loose">
                    <Chip>Quick</Chip>
                    <Chip>Healthy</Chip>
                    <Chip>Budget</Chip>
                  </ChipGroup>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chip Input */}
        <div className="bg-card rounded-lg border p-6">
          <h3 className="mb-4 text-lg font-medium">Chip Input</h3>
          <p className="text-muted-foreground mb-6 text-sm">
            Dynamic input for adding and managing chips.
          </p>

          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Add Ingredients
              </label>
              <ChipInput
                value={ingredients}
                onChange={setIngredients}
                placeholder="Type ingredient and press Enter..."
                maxChips={10}
              />
              <p className="text-muted-foreground mt-2 text-xs">
                Press Enter to add, click × to remove
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Dietary Restrictions
              </label>
              <ChipInput
                value={dietaryRestrictions}
                onChange={setDietaryRestrictions}
                placeholder="Add dietary restriction..."
                suggestions={[
                  'Vegetarian',
                  'Vegan',
                  'Gluten-Free',
                  'Dairy-Free',
                  'Keto',
                  'Paleo',
                  'Low-Carb',
                ]}
              />
              <p className="text-muted-foreground mt-2 text-xs">
                Start typing to see suggestions
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Recipe Tags (with validation)
              </label>
              <ChipInput
                value={tags}
                onChange={setTags}
                placeholder="Add tag..."
                validate={value => {
                  if (value.length < 3)
                    return 'Tag must be at least 3 characters';
                  if (value.length > 15)
                    return 'Tag must be less than 15 characters';
                  if (!/^[a-zA-Z0-9-]+$/.test(value)) {
                    return 'Only letters, numbers, and hyphens allowed';
                  }
                  return true;
                }}
              />
              <p className="text-muted-foreground mt-2 text-xs">
                3-15 characters, alphanumeric with hyphens only
              </p>
            </div>
          </div>
        </div>

        {/* Recipe-Specific Chips */}
        <div className="bg-card rounded-lg border p-6">
          <h3 className="mb-4 text-lg font-medium">Recipe-Specific Contexts</h3>
          <p className="text-muted-foreground mb-6 text-sm">
            Context-aware chips with automatic styling based on usage.
          </p>

          <div className="space-y-6">
            <div>
              <h4 className="mb-3 font-medium">Ingredient Chips</h4>
              <div className="flex flex-wrap gap-2">
                <RecipeChip context="ingredient" onDelete={() => {}}>
                  2 cups flour
                </RecipeChip>
                <RecipeChip context="ingredient" onDelete={() => {}}>
                  1 tsp salt
                </RecipeChip>
                <RecipeChip context="ingredient" onDelete={() => {}}>
                  3 eggs
                </RecipeChip>
                <RecipeChip context="ingredient" onDelete={() => {}}>
                  1 cup milk
                </RecipeChip>
              </div>
            </div>

            <div>
              <h4 className="mb-3 font-medium">Dietary Chips</h4>
              <div className="flex flex-wrap gap-2">
                {['Vegetarian', 'Gluten-Free', 'Dairy-Free', 'Vegan'].map(
                  diet => (
                    <RecipeChip
                      key={diet}
                      context="dietary"
                      selected={dietaryRestrictions.includes(diet)}
                      onClick={() => toggleDietary(diet)}
                    >
                      {diet}
                    </RecipeChip>
                  )
                )}
              </div>
            </div>

            <div>
              <h4 className="mb-3 font-medium">Category Chips</h4>
              <div className="flex flex-wrap gap-2">
                <RecipeChip context="category">Breakfast</RecipeChip>
                <RecipeChip context="category">Quick Meals</RecipeChip>
                <RecipeChip context="category">Comfort Food</RecipeChip>
                <RecipeChip context="category">Dessert</RecipeChip>
              </div>
            </div>

            <div>
              <h4 className="mb-3 font-medium">Tag Chips</h4>
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <RecipeChip
                    key={tag}
                    context="tag"
                    onDelete={() =>
                      setTags(prev => prev.filter(t => t !== tag))
                    }
                  >
                    {tag}
                  </RecipeChip>
                ))}
              </div>
            </div>

            <div>
              <h4 className="mb-3 font-medium">Filter Chips</h4>
              <div className="flex flex-wrap gap-2">
                <RecipeChip
                  context="filter"
                  icon={<Timer className="h-3 w-3" />}
                >
                  Under 30 min
                </RecipeChip>
                <RecipeChip
                  context="filter"
                  icon={<Filter className="h-3 w-3" />}
                >
                  Easy recipes
                </RecipeChip>
                <RecipeChip
                  context="filter"
                  icon={<Heart className="h-3 w-3" />}
                >
                  Favorites
                </RecipeChip>
              </div>
            </div>
          </div>
        </div>

        {/* Real-World Examples */}
        <div className="bg-card rounded-lg border p-6">
          <h3 className="mb-4 text-lg font-medium">Real-World Usage</h3>

          <div className="space-y-6">
            {/* Recipe Card */}
            <div className="bg-muted/50 rounded-lg border p-4">
              <h4 className="mb-3 font-medium">Recipe Card</h4>
              <div className="bg-background rounded-lg border p-4">
                <h5 className="mb-2 font-semibold">Spaghetti Carbonara</h5>
                <p className="text-muted-foreground mb-3 text-sm">
                  Classic Italian pasta with eggs, cheese, and pancetta
                </p>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    <Chip
                      size="sm"
                      variant="outlined"
                      icon={<Clock className="h-3 w-3" />}
                    >
                      25 min
                    </Chip>
                    <Chip size="sm" variant="filled" color="warning">
                      Medium
                    </Chip>
                    <Chip size="sm" variant="filled" color="info">
                      Italian
                    </Chip>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <Chip size="sm" variant="outlined" color="warning">
                      Contains Dairy
                    </Chip>
                    <Chip size="sm" variant="outlined" color="warning">
                      Contains Gluten
                    </Chip>
                  </div>
                </div>
              </div>
            </div>

            {/* Filter Panel */}
            <div className="bg-muted/50 rounded-lg border p-4">
              <h4 className="mb-3 font-medium">Active Filters</h4>
              <div className="bg-background rounded-lg border p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-medium">Recipe Filters</span>
                  <button className="text-destructive text-xs hover:underline">
                    Clear all
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Chip size="sm" variant="filled" onDelete={() => {}}>
                    Vegetarian
                  </Chip>
                  <Chip size="sm" variant="filled" onDelete={() => {}}>
                    Under 30 min
                  </Chip>
                  <Chip size="sm" variant="filled" onDelete={() => {}}>
                    Easy
                  </Chip>
                  <Chip size="sm" variant="filled" onDelete={() => {}}>
                    Breakfast
                  </Chip>
                </div>
              </div>
            </div>

            {/* Ingredient Manager */}
            <div className="bg-muted/50 rounded-lg border p-4">
              <h4 className="mb-3 font-medium">Shopping List Manager</h4>
              <div className="bg-background rounded-lg border p-4">
                <div className="space-y-3">
                  <div>
                    <p className="mb-2 text-sm font-medium">Produce</p>
                    <div className="flex flex-wrap gap-2">
                      <Chip size="sm" onDelete={() => {}} variant="outlined">
                        2 Tomatoes
                      </Chip>
                      <Chip size="sm" onDelete={() => {}} variant="outlined">
                        1 Onion
                      </Chip>
                      <Chip size="sm" onDelete={() => {}} variant="outlined">
                        3 Garlic cloves
                      </Chip>
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 text-sm font-medium">Dairy</p>
                    <div className="flex flex-wrap gap-2">
                      <Chip size="sm" onDelete={() => {}} variant="outlined">
                        1 cup Milk
                      </Chip>
                      <Chip size="sm" onDelete={() => {}} variant="outlined">
                        200g Cheese
                      </Chip>
                    </div>
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
              <div className="text-muted-foreground mb-2">{`// Basic chip`}</div>
              <div>{`<Chip>Ingredient</Chip>`}</div>
            </div>
            <div className="bg-muted overflow-x-auto rounded-md p-4 font-mono text-sm">
              <div className="text-muted-foreground mb-2">{`// Deletable chip`}</div>
              <div>{`<Chip onDelete={() => handleDelete()}>`}</div>
              <div>{`  Tomato`}</div>
              <div>{`</Chip>`}</div>
            </div>
            <div className="bg-muted overflow-x-auto rounded-md p-4 font-mono text-sm">
              <div className="text-muted-foreground mb-2">{`// Selectable chip`}</div>
              <div>{`<Chip`}</div>
              <div>{`  selected={isSelected}`}</div>
              <div>{`  onClick={() => toggleSelection()}`}</div>
              <div>{`>`}</div>
              <div>{`  Vegetarian`}</div>
              <div>{`</Chip>`}</div>
            </div>
            <div className="bg-muted overflow-x-auto rounded-md p-4 font-mono text-sm">
              <div className="text-muted-foreground mb-2">{`// Chip with icon`}</div>
              <div>{`<Chip icon={<Clock />} onDelete={() => {}}>`}</div>
              <div>{`  30 min`}</div>
              <div>{`</Chip>`}</div>
            </div>
            <div className="bg-muted overflow-x-auto rounded-md p-4 font-mono text-sm">
              <div className="text-muted-foreground mb-2">{`// Chip input`}</div>
              <div>{`<ChipInput`}</div>
              <div>{`  value={ingredients}`}</div>
              <div>{`  onChange={setIngredients}`}</div>
              <div>{`  placeholder="Add ingredient..."`}</div>
              <div>{`  maxChips={10}`}</div>
              <div>{`/>`}</div>
            </div>
            <div className="bg-muted overflow-x-auto rounded-md p-4 font-mono text-sm">
              <div className="text-muted-foreground mb-2">{`// Recipe-specific chip`}</div>
              <div>{`<RecipeChip context="dietary" selected>`}</div>
              <div>{`  Vegetarian`}</div>
              <div>{`</RecipeChip>`}</div>
            </div>
          </div>
        </div>

        {/* Accessibility */}
        <div className="bg-card rounded-lg border p-6">
          <h3 className="mb-4 text-lg font-medium">Accessibility Features</h3>
          <div className="space-y-4">
            <p className="text-muted-foreground text-sm">
              The Chip component is built with accessibility in mind:
            </p>
            <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
              <li>Full keyboard navigation support</li>
              <li>Enter/Space keys for selection</li>
              <li>Delete/Backspace keys for removal</li>
              <li>Proper ARIA attributes for screen readers</li>
              <li>Focus indicators for keyboard users</li>
              <li>Semantic HTML with appropriate roles</li>
              <li>Color is not the only indicator of state</li>
            </ul>
            <div className="bg-muted overflow-x-auto rounded-md p-4 font-mono text-sm">
              <div className="text-muted-foreground mb-2">{`// Accessibility example`}</div>
              <div>{`<Chip`}</div>
              <div>{`  onDelete={handleDelete}`}</div>
              <div>{`  deleteLabel="Remove tomato from ingredients"`}</div>
              <div>{`  aria-label="Tomato ingredient"`}</div>
              <div>{`>`}</div>
              <div>{`  Tomato`}</div>
              <div>{`</Chip>`}</div>
            </div>
          </div>
        </div>

        {/* Comparison with Badge */}
        <div className="bg-card rounded-lg border p-6">
          <h3 className="mb-4 text-lg font-medium">Chip vs Badge</h3>
          <div className="space-y-4">
            <p className="text-muted-foreground text-sm">
              When to use Chip instead of Badge:
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="mb-2 font-medium">Use Chip when:</h4>
                <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
                  <li>Users need to add/remove items</li>
                  <li>Items are selectable for filtering</li>
                  <li>Managing dynamic lists (ingredients, tags)</li>
                  <li>User input creates new items</li>
                  <li>Items need individual actions</li>
                </ul>
              </div>
              <div>
                <h4 className="mb-2 font-medium">Use Badge when:</h4>
                <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
                  <li>Display static status or category</li>
                  <li>Show counts or metrics</li>
                  <li>Read-only labels</li>
                  <li>Simple visual indicators</li>
                  <li>No user interaction needed</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
