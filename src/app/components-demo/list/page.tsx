'use client';

import React, { useState } from 'react';
import {
  List,
  ListItem,
  ListItemContent,
  ListItemTitle,
  ListItemDescription,
  ListItemIcon,
  CheckboxListItem,
  RecipeList,
  IngredientListItem,
  InstructionListItem,
  NutritionListItem,
} from '@/components/ui/list';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  User,
  Settings,
  Bell,
  ChefHat,
  Clock,
  Users,
  Star,
  Heart,
  BookOpen,
  Utensils,
  Timer,
  ShoppingCart,
} from 'lucide-react';

export default function ListDemo() {
  const [selectedSettings, setSelectedSettings] = useState<Set<string>>(
    new Set(['notifications'])
  );
  const [checkedIngredients, setCheckedIngredients] = useState<Set<string>>(
    new Set()
  );
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  // Sample data
  const menuItems = [
    {
      id: 'profile',
      icon: User,
      label: 'Profile Settings',
      description: 'Manage your account information',
    },
    {
      id: 'notifications',
      icon: Bell,
      label: 'Notifications',
      description: 'Configure notification preferences',
    },
    {
      id: 'settings',
      icon: Settings,
      label: 'General Settings',
      description: 'App preferences and configuration',
    },
    {
      id: 'premium',
      icon: Star,
      label: 'Premium Features',
      description: 'Upgrade to unlock premium features',
      disabled: true,
    },
  ];

  const settingsOptions = [
    {
      id: 'notifications',
      label: 'Enable notifications',
      description: 'Get notified about new recipes and updates',
    },
    {
      id: 'darkmode',
      label: 'Dark mode',
      description: 'Use dark theme for better night viewing',
    },
    {
      id: 'autosave',
      label: 'Auto-save recipes',
      description: 'Automatically save recipe changes',
    },
    {
      id: 'metric',
      label: 'Metric measurements',
      description: 'Use metric units for ingredients',
    },
  ];

  const ingredients = [
    { id: '1', name: 'All-purpose flour', quantity: '2', unit: 'cups' },
    { id: '2', name: 'Large eggs', quantity: '3', unit: '' },
    { id: '3', name: 'Whole milk', quantity: '1', unit: 'cup' },
    {
      id: '4',
      name: 'Unsalted butter',
      quantity: '4',
      unit: 'tbsp',
      optional: true,
    },
    { id: '5', name: 'Salt', quantity: '1', unit: 'tsp' },
    { id: '6', name: 'Baking powder', quantity: '2', unit: 'tsp' },
  ];

  const instructions = [
    {
      id: '1',
      step: 1,
      text: 'In a large bowl, whisk together flour, salt, and baking powder.',
    },
    {
      id: '2',
      step: 2,
      text: 'In another bowl, beat eggs and gradually add milk.',
      duration: '2 min',
    },
    {
      id: '3',
      step: 3,
      text: 'Melt butter in a skillet over medium heat.',
      temperature: '350°F',
      duration: '1 min',
    },
    {
      id: '4',
      step: 4,
      text: 'Pour wet ingredients into dry ingredients and mix until just combined.',
      duration: '30 sec',
    },
    {
      id: '5',
      step: 5,
      text: 'Pour batter into the heated skillet to form pancakes.',
    },
    {
      id: '6',
      step: 6,
      text: 'Cook until bubbles form on surface, then flip.',
      duration: '2-3 min',
    },
  ];

  const nutrition = [
    { id: '1', label: 'Calories', value: 158, unit: '', dailyValue: 8 },
    { id: '2', label: 'Total Fat', value: 6, unit: 'g', dailyValue: 8 },
    { id: '3', label: 'Saturated Fat', value: 2, unit: 'g', dailyValue: 10 },
    { id: '4', label: 'Cholesterol', value: 37, unit: 'mg', dailyValue: 12 },
    { id: '5', label: 'Sodium', value: 317, unit: 'mg', dailyValue: 14 },
    {
      id: '6',
      label: 'Total Carbohydrates',
      value: 22,
      unit: 'g',
      dailyValue: 8,
    },
    { id: '7', label: 'Dietary Fiber', value: 1, unit: 'g', dailyValue: 4 },
    { id: '8', label: 'Sugars', value: 3, unit: 'g' },
    { id: '9', label: 'Protein', value: 4, unit: 'g', dailyValue: 8 },
  ];

  const categories = [
    { id: 'breakfast', icon: ChefHat, label: 'Breakfast', count: 12 },
    { id: 'lunch', icon: Utensils, label: 'Lunch', count: 8 },
    { id: 'dinner', icon: Clock, label: 'Dinner', count: 15 },
    { id: 'dessert', icon: Heart, label: 'Desserts', count: 7 },
    { id: 'quick', icon: Timer, label: 'Quick Meals', count: 23 },
    { id: 'favorites', icon: Star, label: 'Favorites', count: 9 },
  ];

  // Event handlers
  const handleSettingToggle = (id: string) => {
    const newSelection = new Set(selectedSettings);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedSettings(newSelection);
  };

  const handleIngredientToggle = (id: string) => {
    const newChecked = new Set(checkedIngredients);
    if (newChecked.has(id)) {
      newChecked.delete(id);
    } else {
      newChecked.add(id);
    }
    setCheckedIngredients(newChecked);
  };

  const handleStepToggle = (id: string) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(id)) {
      newCompleted.delete(id);
    } else {
      newCompleted.add(id);
    }
    setCompletedSteps(newCompleted);
  };

  return (
    <div className="container mx-auto space-y-8 p-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          List Component Demo
        </h1>
        <p className="text-muted-foreground">
          Flexible, accessible list components with various styles and
          recipe-specific functionality.
        </p>
      </div>

      {/* Basic Variants */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Basic Variants</h2>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Default List</CardTitle>
            </CardHeader>
            <CardContent>
              <List>
                <ListItem>
                  <ListItemIcon icon={<User />} />
                  <ListItemContent>
                    <ListItemTitle>Profile Settings</ListItemTitle>
                    <ListItemDescription>
                      Manage your account information
                    </ListItemDescription>
                  </ListItemContent>
                </ListItem>
                <ListItem>
                  <ListItemIcon icon={<Bell />} />
                  <ListItemContent>
                    <ListItemTitle>Notifications</ListItemTitle>
                    <ListItemDescription>
                      Configure notification preferences
                    </ListItemDescription>
                  </ListItemContent>
                </ListItem>
                <ListItem>
                  <ListItemIcon icon={<Settings />} />
                  <ListItemContent>
                    <ListItemTitle>General Settings</ListItemTitle>
                    <ListItemDescription>
                      App preferences and configuration
                    </ListItemDescription>
                  </ListItemContent>
                </ListItem>
              </List>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bordered List</CardTitle>
            </CardHeader>
            <CardContent>
              <List variant="bordered">
                <ListItem>
                  <ListItemContent>
                    <ListItemTitle>First Item</ListItemTitle>
                    <ListItemDescription>
                      This is a bordered list
                    </ListItemDescription>
                  </ListItemContent>
                </ListItem>
                <ListItem>
                  <ListItemContent>
                    <ListItemTitle>Second Item</ListItemTitle>
                    <ListItemDescription>
                      With border styling
                    </ListItemDescription>
                  </ListItemContent>
                </ListItem>
                <ListItem>
                  <ListItemContent>
                    <ListItemTitle>Third Item</ListItemTitle>
                    <ListItemDescription>
                      And rounded corners
                    </ListItemDescription>
                  </ListItemContent>
                </ListItem>
              </List>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Divided List</CardTitle>
            </CardHeader>
            <CardContent>
              <List variant="divided">
                <ListItem>
                  <ListItemIcon icon={<BookOpen />} />
                  <ListItemContent>
                    <ListItemTitle>Recipes</ListItemTitle>
                    <ListItemDescription>
                      Browse your recipe collection
                    </ListItemDescription>
                  </ListItemContent>
                  <Badge variant="secondary">124</Badge>
                </ListItem>
                <ListItem>
                  <ListItemIcon icon={<ShoppingCart />} />
                  <ListItemContent>
                    <ListItemTitle>Shopping Lists</ListItemTitle>
                    <ListItemDescription>
                      Manage your grocery lists
                    </ListItemDescription>
                  </ListItemContent>
                  <Badge variant="secondary">3</Badge>
                </ListItem>
                <ListItem>
                  <ListItemIcon icon={<Heart />} />
                  <ListItemContent>
                    <ListItemTitle>Favorites</ListItemTitle>
                    <ListItemDescription>
                      Your favorite recipes
                    </ListItemDescription>
                  </ListItemContent>
                  <Badge variant="secondary">12</Badge>
                </ListItem>
              </List>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Card List</CardTitle>
            </CardHeader>
            <CardContent>
              <List variant="card">
                <ListItem>
                  <ListItemContent>
                    <ListItemTitle>Card-style List</ListItemTitle>
                    <ListItemDescription>
                      With card background and shadow
                    </ListItemDescription>
                  </ListItemContent>
                </ListItem>
                <ListItem>
                  <ListItemContent>
                    <ListItemTitle>Elevated Appearance</ListItemTitle>
                    <ListItemDescription>
                      Perfect for important content
                    </ListItemDescription>
                  </ListItemContent>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Interactive Lists */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Interactive Lists</h2>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Menu Items</CardTitle>
            </CardHeader>
            <CardContent>
              <List variant="divided">
                {menuItems.map(item => (
                  <ListItem
                    key={item.id}
                    variant={item.disabled ? 'disabled' : 'interactive'}
                    onSelect={() =>
                      !item.disabled && console.log(`Selected: ${item.label}`)
                    }
                  >
                    <ListItemIcon
                      icon={<item.icon />}
                      variant={item.disabled ? 'muted' : 'default'}
                    />
                    <ListItemContent>
                      <ListItemTitle>{item.label}</ListItemTitle>
                      <ListItemDescription>
                        {item.description}
                      </ListItemDescription>
                    </ListItemContent>
                    {item.disabled && (
                      <Badge variant="outline">Coming Soon</Badge>
                    )}
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Settings with Checkboxes</CardTitle>
            </CardHeader>
            <CardContent>
              <List variant="divided">
                {settingsOptions.map(option => (
                  <CheckboxListItem
                    key={option.id}
                    checked={selectedSettings.has(option.id)}
                    onCheckedChange={() => handleSettingToggle(option.id)}
                    label={option.label}
                    description={option.description}
                  />
                ))}
              </List>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Grid Layout */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Grid Layout</h2>

        <Card>
          <CardHeader>
            <CardTitle>Recipe Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <List variant="grid" gridCols={3}>
              {categories.map(category => (
                <ListItem
                  key={category.id}
                  variant="interactive"
                  onSelect={() =>
                    console.log(`Selected category: ${category.label}`)
                  }
                >
                  <ListItemIcon icon={<category.icon />} variant="primary" />
                  <ListItemContent>
                    <ListItemTitle>{category.label}</ListItemTitle>
                    <ListItemDescription>
                      {category.count} recipes
                    </ListItemDescription>
                  </ListItemContent>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </section>

      {/* Recipe-Specific Lists */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Recipe Components</h2>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChefHat className="h-5 w-5" />
                Ingredients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RecipeList context="ingredients" variant="divided">
                {ingredients.map(ingredient => (
                  <IngredientListItem
                    key={ingredient.id}
                    ingredient={{
                      ...ingredient,
                      checked: checkedIngredients.has(ingredient.id),
                    }}
                    allowChecking
                    onToggleCheck={handleIngredientToggle}
                    context="shopping"
                  />
                ))}
              </RecipeList>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Instructions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RecipeList context="instructions" variant="divided">
                {instructions.map(instruction => (
                  <InstructionListItem
                    key={instruction.id}
                    instruction={{
                      ...instruction,
                      completed: completedSteps.has(instruction.id),
                    }}
                    allowChecking
                    onToggleComplete={handleStepToggle}
                    context="cooking"
                  />
                ))}
              </RecipeList>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Nutrition Facts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground mb-3 text-sm">
                Per serving (1 pancake)
              </div>
              <RecipeList context="nutrition" variant="divided">
                {nutrition.map(item => (
                  <NutritionListItem
                    key={item.id}
                    nutrition={item}
                    showDailyValue
                    showUnit
                  />
                ))}
              </RecipeList>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Size and Density Variants */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Size and Density</h2>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Compact</CardTitle>
            </CardHeader>
            <CardContent>
              <List size="sm" density="compact" variant="bordered">
                <ListItem>
                  <ListItemIcon icon={<User />} size="sm" />
                  <ListItemContent>
                    <ListItemTitle size="sm">Small Item</ListItemTitle>
                    <ListItemDescription size="sm">
                      Compact description
                    </ListItemDescription>
                  </ListItemContent>
                </ListItem>
                <ListItem>
                  <ListItemIcon icon={<Settings />} size="sm" />
                  <ListItemContent>
                    <ListItemTitle size="sm">Another Item</ListItemTitle>
                    <ListItemDescription size="sm">
                      Space-efficient layout
                    </ListItemDescription>
                  </ListItemContent>
                </ListItem>
              </List>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Comfortable (Default)</CardTitle>
            </CardHeader>
            <CardContent>
              <List size="md" density="comfortable" variant="bordered">
                <ListItem>
                  <ListItemIcon icon={<User />} size="md" />
                  <ListItemContent>
                    <ListItemTitle size="md">Medium Item</ListItemTitle>
                    <ListItemDescription size="md">
                      Standard spacing
                    </ListItemDescription>
                  </ListItemContent>
                </ListItem>
                <ListItem>
                  <ListItemIcon icon={<Settings />} size="md" />
                  <ListItemContent>
                    <ListItemTitle size="md">Another Item</ListItemTitle>
                    <ListItemDescription size="md">
                      Balanced layout
                    </ListItemDescription>
                  </ListItemContent>
                </ListItem>
              </List>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Spacious</CardTitle>
            </CardHeader>
            <CardContent>
              <List size="lg" density="spacious" variant="bordered">
                <ListItem>
                  <ListItemIcon icon={<User />} size="lg" />
                  <ListItemContent>
                    <ListItemTitle size="lg">Large Item</ListItemTitle>
                    <ListItemDescription size="lg">
                      Spacious description
                    </ListItemDescription>
                  </ListItemContent>
                </ListItem>
                <ListItem>
                  <ListItemIcon icon={<Settings />} size="lg" />
                  <ListItemContent>
                    <ListItemTitle size="lg">Another Item</ListItemTitle>
                    <ListItemDescription size="lg">
                      Generous spacing
                    </ListItemDescription>
                  </ListItemContent>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* States */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">States</h2>

        <Card>
          <CardHeader>
            <CardTitle>Different States</CardTitle>
          </CardHeader>
          <CardContent>
            <List variant="divided">
              <ListItem>
                <ListItemIcon icon={<User />} />
                <ListItemContent>
                  <ListItemTitle>Normal State</ListItemTitle>
                  <ListItemDescription>
                    This is a normal list item
                  </ListItemDescription>
                </ListItemContent>
              </ListItem>
              <ListItem
                variant="interactive"
                onSelect={() => console.log('Hovered')}
              >
                <ListItemIcon icon={<Settings />} />
                <ListItemContent>
                  <ListItemTitle>Interactive State</ListItemTitle>
                  <ListItemDescription>
                    Hover and click to interact
                  </ListItemDescription>
                </ListItemContent>
              </ListItem>
              <ListItem selected>
                <ListItemIcon icon={<Bell />} variant="primary" />
                <ListItemContent>
                  <ListItemTitle>Selected State</ListItemTitle>
                  <ListItemDescription>
                    This item is currently selected
                  </ListItemDescription>
                </ListItemContent>
              </ListItem>
              <ListItem loading>
                <ListItemIcon icon={<Clock />} />
                <ListItemContent>
                  <ListItemTitle>Loading State</ListItemTitle>
                  <ListItemDescription>
                    This item is loading...
                  </ListItemDescription>
                </ListItemContent>
              </ListItem>
              <ListItem disabled>
                <ListItemIcon icon={<Star />} variant="muted" />
                <ListItemContent>
                  <ListItemTitle>Disabled State</ListItemTitle>
                  <ListItemDescription>
                    This item is disabled
                  </ListItemDescription>
                </ListItemContent>
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </section>

      {/* Inline List */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Inline Layout</h2>

        <Card>
          <CardHeader>
            <CardTitle>Tags/Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <List variant="inline">
              <ListItem variant="interactive">
                <Badge variant="secondary">Vegetarian</Badge>
              </ListItem>
              <ListItem variant="interactive">
                <Badge variant="secondary">Quick</Badge>
              </ListItem>
              <ListItem variant="interactive">
                <Badge variant="secondary">Breakfast</Badge>
              </ListItem>
              <ListItem variant="interactive">
                <Badge variant="secondary">Low Carb</Badge>
              </ListItem>
              <ListItem variant="interactive">
                <Badge variant="secondary">Gluten Free</Badge>
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
