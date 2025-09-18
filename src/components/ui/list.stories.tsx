/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import React from 'react';
// @ts-expect-error - Storybook types not available in this environment
import type { Meta, StoryObj } from '@storybook/react';
// @ts-expect-error - Storybook types not available in this environment
import { action } from '@storybook/addon-actions';
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
} from './list';
import {
  User,
  Settings,
  Bell,
  ChefHat,
  Clock,
  Star,
  Heart,
  Utensils,
} from 'lucide-react';

const meta: Meta<typeof List> = {
  title: 'UI/List',
  component: List,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A flexible, accessible list component with support for various styles, interactive states, and recipe-specific variants. Built with TypeScript and full keyboard accessibility.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'bordered', 'divided', 'card', 'inline', 'grid'],
      description: 'Visual variant of the list',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size variant affecting text and spacing',
    },
    density: {
      control: 'select',
      options: ['compact', 'comfortable', 'spacious'],
      description: 'Vertical spacing density',
    },
    gridCols: {
      control: 'select',
      options: [1, 2, 3, 4],
      description: 'Number of grid columns (when variant="grid")',
    },
    ordered: {
      control: 'boolean',
      description: 'Whether to render as ordered list (ol) or unordered (ul)',
    },
  },
} satisfies Meta<typeof List>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic list examples
export const Default: Story = {
  args: {
    variant: 'default',
    size: 'md',
    density: 'comfortable',
  },
  render: (args: any) => (
    <div className="w-96">
      <List {...args}>
        <ListItem>
          <ListItemContent>
            <ListItemTitle>First Item</ListItemTitle>
            <ListItemDescription>This is a description</ListItemDescription>
          </ListItemContent>
        </ListItem>
        <ListItem>
          <ListItemContent>
            <ListItemTitle>Second Item</ListItemTitle>
            <ListItemDescription>
              This is another description
            </ListItemDescription>
          </ListItemContent>
        </ListItem>
        <ListItem>
          <ListItemContent>
            <ListItemTitle>Third Item</ListItemTitle>
            <ListItemDescription>And one more description</ListItemDescription>
          </ListItemContent>
        </ListItem>
      </List>
    </div>
  ),
};

export const WithIcons: Story = {
  args: {
    variant: 'default',
    size: 'md',
  },
  render: (args: any) => (
    <div className="w-96">
      <List {...args}>
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
    </div>
  ),
};

export const Interactive: Story = {
  args: {
    variant: 'divided',
  },
  render: (args: any) => (
    <div className="w-96">
      <List {...args}>
        <ListItem variant="interactive" onSelect={action('selected-profile')}>
          <ListItemIcon icon={<User />} />
          <ListItemContent>
            <ListItemTitle>Profile Settings</ListItemTitle>
            <ListItemDescription>
              Manage your account information
            </ListItemDescription>
          </ListItemContent>
        </ListItem>
        <ListItem
          variant="interactive"
          onSelect={action('selected-notifications')}
        >
          <ListItemIcon icon={<Bell />} />
          <ListItemContent>
            <ListItemTitle>Notifications</ListItemTitle>
            <ListItemDescription>
              Configure notification preferences
            </ListItemDescription>
          </ListItemContent>
        </ListItem>
        <ListItem variant="interactive" onSelect={action('selected-settings')}>
          <ListItemIcon icon={<Settings />} />
          <ListItemContent>
            <ListItemTitle>General Settings</ListItemTitle>
            <ListItemDescription>
              App preferences and configuration
            </ListItemDescription>
          </ListItemContent>
        </ListItem>
        <ListItem variant="interactive" disabled>
          <ListItemIcon icon={<Star />} variant="muted" />
          <ListItemContent>
            <ListItemTitle>Premium Features</ListItemTitle>
            <ListItemDescription>
              Upgrade to unlock premium features
            </ListItemDescription>
          </ListItemContent>
        </ListItem>
      </List>
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="mb-4 text-lg font-semibold">Default</h3>
        <div className="w-96">
          <List variant="default">
            <ListItem>
              <ListItemContent>
                <ListItemTitle>Default List Item</ListItemTitle>
              </ListItemContent>
            </ListItem>
            <ListItem>
              <ListItemContent>
                <ListItemTitle>Another Item</ListItemTitle>
              </ListItemContent>
            </ListItem>
          </List>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">Bordered</h3>
        <div className="w-96">
          <List variant="bordered">
            <ListItem>
              <ListItemContent>
                <ListItemTitle>Bordered List Item</ListItemTitle>
              </ListItemContent>
            </ListItem>
            <ListItem>
              <ListItemContent>
                <ListItemTitle>Another Item</ListItemTitle>
              </ListItemContent>
            </ListItem>
          </List>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">Divided</h3>
        <div className="w-96">
          <List variant="divided">
            <ListItem>
              <ListItemContent>
                <ListItemTitle>Divided List Item</ListItemTitle>
              </ListItemContent>
            </ListItem>
            <ListItem>
              <ListItemContent>
                <ListItemTitle>Another Item</ListItemTitle>
              </ListItemContent>
            </ListItem>
          </List>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">Card</h3>
        <div className="w-96">
          <List variant="card">
            <ListItem>
              <ListItemContent>
                <ListItemTitle>Card List Item</ListItemTitle>
              </ListItemContent>
            </ListItem>
            <ListItem>
              <ListItemContent>
                <ListItemTitle>Another Item</ListItemTitle>
              </ListItemContent>
            </ListItem>
          </List>
        </div>
      </div>
    </div>
  ),
};

export const WithCheckboxes: Story = {
  render: () => {
    const [selectedItems, setSelectedItems] = React.useState<Set<string>>(
      new Set()
    );

    const handleToggle = (id: string) => {
      const newSelection = new Set(selectedItems);
      if (newSelection.has(id)) {
        newSelection.delete(id);
      } else {
        newSelection.add(id);
      }
      setSelectedItems(newSelection);
      action('checkbox-toggled')(id, newSelection.has(id));
    };

    return (
      <div className="w-96">
        <List variant="divided">
          <CheckboxListItem
            checked={selectedItems.has('item1')}
            onCheckedChange={() => handleToggle('item1')}
            label="Enable notifications"
            description="Get notified about new recipes and updates"
          />
          <CheckboxListItem
            checked={selectedItems.has('item2')}
            onCheckedChange={() => handleToggle('item2')}
            label="Dark mode"
            description="Use dark theme for better night viewing"
          />
          <CheckboxListItem
            checked={selectedItems.has('item3')}
            onCheckedChange={() => handleToggle('item3')}
            label="Auto-save recipes"
            description="Automatically save recipe changes"
          />
          <CheckboxListItem
            checked={selectedItems.has('item4')}
            onCheckedChange={() => handleToggle('item4')}
            label="Metric measurements"
            description="Use metric units for ingredients"
            disabled
          />
        </List>
      </div>
    );
  },
};

// Recipe-specific examples
export const Ingredients: Story = {
  render: () => {
    const [checkedIngredients, setCheckedIngredients] = React.useState<
      Set<string>
    >(new Set());

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

    const handleToggleIngredient = (id: string) => {
      const newChecked = new Set(checkedIngredients);
      if (newChecked.has(id)) {
        newChecked.delete(id);
      } else {
        newChecked.add(id);
      }
      setCheckedIngredients(newChecked);
      action('ingredient-toggled')(id, newChecked.has(id));
    };

    return (
      <div className="w-96">
        <h3 className="mb-4 text-lg font-semibold">Pancake Ingredients</h3>
        <RecipeList context="ingredients" variant="divided">
          {ingredients.map(ingredient => (
            <IngredientListItem
              key={ingredient.id}
              ingredient={{
                ...ingredient,
                checked: checkedIngredients.has(ingredient.id),
              }}
              allowChecking
              onToggleCheck={handleToggleIngredient}
              context="shopping"
            />
          ))}
        </RecipeList>
      </div>
    );
  },
};

export const Instructions: Story = {
  render: () => {
    const [completedSteps, setCompletedSteps] = React.useState<Set<string>>(
      new Set()
    );

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

    const handleToggleStep = (id: string) => {
      const newCompleted = new Set(completedSteps);
      if (newCompleted.has(id)) {
        newCompleted.delete(id);
      } else {
        newCompleted.add(id);
      }
      setCompletedSteps(newCompleted);
      action('step-completed')(id, newCompleted.has(id));
    };

    return (
      <div className="w-96">
        <h3 className="mb-4 text-lg font-semibold">Cooking Instructions</h3>
        <RecipeList context="instructions" variant="divided">
          {instructions.map(instruction => (
            <InstructionListItem
              key={instruction.id}
              instruction={{
                ...instruction,
                completed: completedSteps.has(instruction.id),
              }}
              allowChecking
              onToggleComplete={handleToggleStep}
              context="cooking"
            />
          ))}
        </RecipeList>
      </div>
    );
  },
};

export const NutritionFacts: Story = {
  render: () => {
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

    return (
      <div className="w-96">
        <h3 className="mb-4 text-lg font-semibold">Nutrition Facts</h3>
        <p className="text-muted-foreground mb-2 text-sm">
          Per serving (1 pancake)
        </p>
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
      </div>
    );
  },
};

export const SizesAndDensity: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="mb-4 text-lg font-semibold">Sizes</h3>
        <div className="space-y-4">
          <div className="w-96">
            <p className="mb-2 text-sm font-medium">Small</p>
            <List size="sm" variant="bordered">
              <ListItem>
                <ListItemIcon icon={<ChefHat />} size="sm" />
                <ListItemContent>
                  <ListItemTitle size="sm">Small List Item</ListItemTitle>
                  <ListItemDescription size="sm">
                    Compact description
                  </ListItemDescription>
                </ListItemContent>
              </ListItem>
            </List>
          </div>
          <div className="w-96">
            <p className="mb-2 text-sm font-medium">Medium (Default)</p>
            <List size="md" variant="bordered">
              <ListItem>
                <ListItemIcon icon={<ChefHat />} size="md" />
                <ListItemContent>
                  <ListItemTitle size="md">Medium List Item</ListItemTitle>
                  <ListItemDescription size="md">
                    Standard description
                  </ListItemDescription>
                </ListItemContent>
              </ListItem>
            </List>
          </div>
          <div className="w-96">
            <p className="mb-2 text-sm font-medium">Large</p>
            <List size="lg" variant="bordered">
              <ListItem>
                <ListItemIcon icon={<ChefHat />} size="lg" />
                <ListItemContent>
                  <ListItemTitle size="lg">Large List Item</ListItemTitle>
                  <ListItemDescription size="lg">
                    Spacious description
                  </ListItemDescription>
                </ListItemContent>
              </ListItem>
            </List>
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">Density</h3>
        <div className="space-y-4">
          <div className="w-96">
            <p className="mb-2 text-sm font-medium">Compact</p>
            <List density="compact" variant="bordered">
              <ListItem>
                <ListItemContent>
                  <ListItemTitle>Compact Item 1</ListItemTitle>
                </ListItemContent>
              </ListItem>
              <ListItem>
                <ListItemContent>
                  <ListItemTitle>Compact Item 2</ListItemTitle>
                </ListItemContent>
              </ListItem>
            </List>
          </div>
          <div className="w-96">
            <p className="mb-2 text-sm font-medium">Comfortable (Default)</p>
            <List density="comfortable" variant="bordered">
              <ListItem>
                <ListItemContent>
                  <ListItemTitle>Comfortable Item 1</ListItemTitle>
                </ListItemContent>
              </ListItem>
              <ListItem>
                <ListItemContent>
                  <ListItemTitle>Comfortable Item 2</ListItemTitle>
                </ListItemContent>
              </ListItem>
            </List>
          </div>
          <div className="w-96">
            <p className="mb-2 text-sm font-medium">Spacious</p>
            <List density="spacious" variant="bordered">
              <ListItem>
                <ListItemContent>
                  <ListItemTitle>Spacious Item 1</ListItemTitle>
                </ListItemContent>
              </ListItem>
              <ListItem>
                <ListItemContent>
                  <ListItemTitle>Spacious Item 2</ListItemTitle>
                </ListItemContent>
              </ListItem>
            </List>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const GridLayout: Story = {
  args: {
    variant: 'grid',
    gridCols: 2,
  },
  render: (args: any) => (
    <div className="w-full max-w-2xl">
      <List {...args}>
        <ListItem variant="interactive">
          <ListItemIcon icon={<ChefHat />} />
          <ListItemContent>
            <ListItemTitle>Breakfast</ListItemTitle>
            <ListItemDescription>12 recipes</ListItemDescription>
          </ListItemContent>
        </ListItem>
        <ListItem variant="interactive">
          <ListItemIcon icon={<Utensils />} />
          <ListItemContent>
            <ListItemTitle>Lunch</ListItemTitle>
            <ListItemDescription>8 recipes</ListItemDescription>
          </ListItemContent>
        </ListItem>
        <ListItem variant="interactive">
          <ListItemIcon icon={<Clock />} />
          <ListItemContent>
            <ListItemTitle>Quick Meals</ListItemTitle>
            <ListItemDescription>15 recipes</ListItemDescription>
          </ListItemContent>
        </ListItem>
        <ListItem variant="interactive">
          <ListItemIcon icon={<Heart />} />
          <ListItemContent>
            <ListItemTitle>Favorites</ListItemTitle>
            <ListItemDescription>7 recipes</ListItemDescription>
          </ListItemContent>
        </ListItem>
      </List>
    </div>
  ),
};

export const LoadingStates: Story = {
  render: () => (
    <div className="w-96 space-y-4">
      <List variant="divided">
        <ListItem>
          <ListItemIcon icon={<User />} />
          <ListItemContent>
            <ListItemTitle>Normal Item</ListItemTitle>
            <ListItemDescription>This item is loaded</ListItemDescription>
          </ListItemContent>
        </ListItem>
        <ListItem loading>
          <ListItemIcon icon={<Bell />} />
          <ListItemContent>
            <ListItemTitle>Loading Item</ListItemTitle>
            <ListItemDescription>This item is loading...</ListItemDescription>
          </ListItemContent>
        </ListItem>
        <ListItem disabled>
          <ListItemIcon icon={<Settings />} variant="muted" />
          <ListItemContent>
            <ListItemTitle>Disabled Item</ListItemTitle>
            <ListItemDescription>This item is disabled</ListItemDescription>
          </ListItemContent>
        </ListItem>
      </List>
    </div>
  ),
};
