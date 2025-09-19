/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import React from 'react';
// @ts-expect-error - Storybook types not available in this environment
import type { Meta, StoryObj } from '@storybook/react';
// @ts-expect-error - Storybook types not available in this environment
import { action } from '@storybook/addon-actions';
import { Chip, ChipGroup, ChipInput, RecipeChip } from './chip';
import { Clock, Leaf, ChefHat, Scale, Timer, Heart } from 'lucide-react';

const meta: Meta<typeof Chip> = {
  title: 'UI/Chip',
  component: Chip,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Interactive tag component with delete, selection, and click actions. Perfect for managing recipe ingredients, dietary restrictions, and dynamic tags with full accessibility support.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outlined', 'filled'],
      description: 'Visual variant of the chip',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the chip',
    },
    color: {
      control: 'select',
      options: [
        'default',
        'primary',
        'secondary',
        'success',
        'warning',
        'destructive',
        'info',
      ],
      description: 'Color variant of the chip',
    },
    selected: {
      control: 'boolean',
      description: 'Whether the chip is selected',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the chip is disabled',
    },
    children: {
      control: 'text',
      description: 'Content of the chip',
    },
  },
  decorators: [
    (Story: React.ComponentType) => (
      <div className="flex min-h-[200px] items-center justify-center p-8">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Chip>;

// Basic Chip Stories
export const Default: Story = {
  args: {
    children: 'Chip',
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Chip variant="default">Default</Chip>
      <Chip variant="outlined">Outlined</Chip>
      <Chip variant="filled">Filled</Chip>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Chip size="sm">Small</Chip>
      <Chip size="md">Medium</Chip>
      <Chip size="lg">Large</Chip>
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Chip color="default">Default</Chip>
      <Chip color="primary">Primary</Chip>
      <Chip color="secondary">Secondary</Chip>
      <Chip color="success">Success</Chip>
      <Chip color="warning">Warning</Chip>
      <Chip color="destructive">Destructive</Chip>
      <Chip color="info">Info</Chip>
    </div>
  ),
};

// Interactive Features
export const Deletable: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Chip onDelete={action('delete')}>Tomato</Chip>
      <Chip onDelete={action('delete')} variant="outlined">
        Onion
      </Chip>
      <Chip onDelete={action('delete')} variant="filled" size="lg">
        Garlic
      </Chip>
    </div>
  ),
};

export const Clickable: Story = {
  render: () => {
    const [selected, setSelected] = React.useState<string[]>([]);

    const toggleSelection = (chip: string) => {
      setSelected(prev =>
        prev.includes(chip) ? prev.filter(c => c !== chip) : [...prev, chip]
      );
    };

    const chips = ['Easy', 'Medium', 'Hard'];

    return (
      <div className="space-y-4">
        <p className="text-muted-foreground text-sm">
          Click chips to select/deselect:
        </p>
        <div className="flex gap-3">
          {chips.map(chip => (
            <Chip
              key={chip}
              selected={selected.includes(chip)}
              onClick={() => toggleSelection(chip)}
              variant="outlined"
            >
              {chip}
            </Chip>
          ))}
        </div>
        {selected.length > 0 && (
          <p className="text-sm">Selected: {selected.join(', ')}</p>
        )}
      </div>
    );
  },
};

export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Chip icon={<Clock className="h-3 w-3" />}>30 min</Chip>
      <Chip
        icon={<Leaf className="h-3 w-3" />}
        variant="outlined"
        color="success"
      >
        Vegetarian
      </Chip>
      <Chip
        icon={<ChefHat className="h-3 w-3" />}
        onDelete={action('delete')}
        variant="filled"
      >
        Chef&apos;s Special
      </Chip>
    </div>
  ),
};

export const WithAvatar: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Chip
        avatar={
          <div className="flex h-full w-full items-center justify-center bg-slate-300 text-xs font-bold">
            U
          </div>
        }
      >
        John Doe
      </Chip>
      <Chip
        avatar={
          <div className="bg-primary text-primary-foreground flex h-full w-full items-center justify-center text-xs">
            JD
          </div>
        }
        onDelete={action('delete')}
      >
        Jane Doe
      </Chip>
    </div>
  ),
};

// Chip Group
export const GroupExample: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <p className="mb-3 text-sm font-medium">Tight spacing</p>
        <ChipGroup spacing="tight">
          <Chip size="sm">React</Chip>
          <Chip size="sm">TypeScript</Chip>
          <Chip size="sm">Next.js</Chip>
          <Chip size="sm">Tailwind</Chip>
        </ChipGroup>
      </div>
      <div>
        <p className="mb-3 text-sm font-medium">Normal spacing</p>
        <ChipGroup spacing="normal">
          <Chip>Breakfast</Chip>
          <Chip>Lunch</Chip>
          <Chip>Dinner</Chip>
          <Chip>Dessert</Chip>
        </ChipGroup>
      </div>
      <div>
        <p className="mb-3 text-sm font-medium">Loose spacing</p>
        <ChipGroup spacing="loose">
          <Chip variant="filled">Easy</Chip>
          <Chip variant="filled">Quick</Chip>
          <Chip variant="filled">Healthy</Chip>
        </ChipGroup>
      </div>
    </div>
  ),
};

export const GroupWithLimit: Story = {
  render: () => (
    <div className="space-y-4">
      <p className="text-muted-foreground text-sm">
        Showing max 3 chips with overflow indicator:
      </p>
      <ChipGroup maxDisplay={3}>
        <Chip>Italian</Chip>
        <Chip>Mexican</Chip>
        <Chip>Chinese</Chip>
        <Chip>Indian</Chip>
        <Chip>Thai</Chip>
        <Chip>Japanese</Chip>
      </ChipGroup>
    </div>
  ),
};

// Chip Input
export const InputExample: Story = {
  render: () => {
    const [ingredients, setIngredients] = React.useState<string[]>([
      'Tomato',
      'Onion',
    ]);

    return (
      <div className="w-96 space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium">Ingredients</label>
          <ChipInput
            value={ingredients}
            onChange={setIngredients}
            placeholder="Add ingredient..."
            maxChips={8}
          />
        </div>
        <div className="text-muted-foreground text-sm">
          Current ingredients: {ingredients.length}
        </div>
      </div>
    );
  },
};

export const InputWithValidation: Story = {
  render: () => {
    const [tags, setTags] = React.useState<string[]>(['recipe', 'cooking']);

    const validateTag = (value: string) => {
      if (value.length < 3) {
        return 'Tag must be at least 3 characters';
      }
      if (value.length > 15) {
        return 'Tag must be less than 15 characters';
      }
      if (!/^[a-zA-Z0-9-]+$/.test(value)) {
        return 'Only letters, numbers, and hyphens allowed';
      }
      return true;
    };

    return (
      <div className="w-96 space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium">Recipe Tags</label>
          <ChipInput
            value={tags}
            onChange={setTags}
            placeholder="Add tag..."
            validate={validateTag}
            maxChips={10}
          />
        </div>
        <div className="text-muted-foreground text-xs">
          Tags must be 3-15 characters, alphanumeric with hyphens only
        </div>
      </div>
    );
  },
};

export const InputWithSuggestions: Story = {
  render: () => {
    const [selected, setSelected] = React.useState<string[]>([]);
    const suggestions = [
      'Vegetarian',
      'Vegan',
      'Gluten-Free',
      'Dairy-Free',
      'Keto',
      'Low-Carb',
      'Sugar-Free',
      'Paleo',
      'Mediterranean',
    ];

    return (
      <div className="w-96 space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium">
            Dietary Preferences
          </label>
          <ChipInput
            value={selected}
            onChange={setSelected}
            placeholder="Type to see suggestions..."
            suggestions={suggestions}
          />
        </div>
      </div>
    );
  },
};

// Recipe-Specific Chips
export const RecipeContexts: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <p className="mb-3 text-sm font-medium">Ingredients</p>
        <div className="flex flex-wrap gap-2">
          <RecipeChip context="ingredient" onDelete={action('delete')}>
            2 cups flour
          </RecipeChip>
          <RecipeChip context="ingredient" onDelete={action('delete')}>
            1 tsp salt
          </RecipeChip>
          <RecipeChip context="ingredient" onDelete={action('delete')}>
            3 eggs
          </RecipeChip>
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-medium">Dietary Restrictions</p>
        <div className="flex flex-wrap gap-2">
          <RecipeChip context="dietary" selected>
            Vegetarian
          </RecipeChip>
          <RecipeChip context="dietary">Gluten-Free</RecipeChip>
          <RecipeChip context="dietary">Dairy-Free</RecipeChip>
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-medium">Categories</p>
        <div className="flex flex-wrap gap-2">
          <RecipeChip context="category">Breakfast</RecipeChip>
          <RecipeChip context="category">Quick Meals</RecipeChip>
          <RecipeChip context="category">Comfort Food</RecipeChip>
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-medium">Tags</p>
        <div className="flex flex-wrap gap-2">
          <RecipeChip context="tag" onDelete={action('delete')}>
            summer
          </RecipeChip>
          <RecipeChip context="tag" onDelete={action('delete')}>
            bbq
          </RecipeChip>
          <RecipeChip context="tag" onDelete={action('delete')}>
            outdoor
          </RecipeChip>
        </div>
      </div>
    </div>
  ),
};

// Interactive Examples
export const FilterExample: Story = {
  render: () => {
    const [filters, setFilters] = React.useState<{
      difficulty: string[];
      time: string[];
      category: string[];
    }>({
      difficulty: ['Easy'],
      time: [],
      category: ['Dinner'],
    });

    const toggleFilter = (category: keyof typeof filters, value: string) => {
      setFilters(prev => {
        if (category === 'difficulty') {
          const currentValues = prev.difficulty;
          const newValues = currentValues.includes(value)
            ? currentValues.filter(v => v !== value)
            : [...currentValues, value];
          return { ...prev, difficulty: newValues };
        } else if (category === 'time') {
          const currentValues = prev.time;
          const newValues = currentValues.includes(value)
            ? currentValues.filter(v => v !== value)
            : [...currentValues, value];
          return { ...prev, time: newValues };
        } else if (category === 'category') {
          const currentValues = prev.category;
          const newValues = currentValues.includes(value)
            ? currentValues.filter(v => v !== value)
            : [...currentValues, value];
          return { ...prev, category: newValues };
        }
        return prev;
      });
    };

    return (
      <div className="w-96 space-y-6">
        <div>
          <h3 className="mb-3 text-sm font-medium">Recipe Filters</h3>

          <div className="space-y-3">
            <div>
              <p className="text-muted-foreground mb-2 text-xs">Difficulty</p>
              <div className="flex gap-2">
                {['Easy', 'Medium', 'Hard'].map(level => (
                  <Chip
                    key={level}
                    variant="outlined"
                    selected={filters.difficulty.includes(level)}
                    onClick={() => toggleFilter('difficulty', level)}
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

            <div>
              <p className="text-muted-foreground mb-2 text-xs">Cook Time</p>
              <div className="flex gap-2">
                {['< 30 min', '30-60 min', '1+ hour'].map(time => (
                  <Chip
                    key={time}
                    variant="outlined"
                    selected={filters.time.includes(time)}
                    onClick={() => toggleFilter('time', time)}
                    icon={<Timer className="h-3 w-3" />}
                  >
                    {time}
                  </Chip>
                ))}
              </div>
            </div>

            <div>
              <p className="text-muted-foreground mb-2 text-xs">Category</p>
              <div className="flex flex-wrap gap-2">
                {['Breakfast', 'Lunch', 'Dinner', 'Dessert'].map(cat => (
                  <Chip
                    key={cat}
                    variant="outlined"
                    selected={filters.category.includes(cat)}
                    onClick={() => toggleFilter('category', cat)}
                    color="info"
                  >
                    {cat}
                  </Chip>
                ))}
              </div>
            </div>
          </div>
        </div>

        {(filters.difficulty.length > 0 ||
          filters.time.length > 0 ||
          filters.category.length > 0) && (
          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Active Filters</p>
              <button
                onClick={() =>
                  setFilters({ difficulty: [], time: [], category: [] })
                }
                className="text-destructive text-xs hover:underline"
              >
                Clear all
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {(
                [
                  ...filters.difficulty,
                  ...filters.time,
                  ...filters.category,
                ] as string[]
              ).map((filter, index) => (
                <Chip
                  key={`${filter}-${index}`}
                  size="sm"
                  variant="filled"
                  onDelete={action('remove-filter')}
                >
                  {filter}
                </Chip>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  },
};

// Recipe Card Example
export const RecipeCardExample: Story = {
  render: () => (
    <div className="bg-card w-96 rounded-lg border p-4">
      <h3 className="mb-2 text-lg font-semibold">Spaghetti Carbonara</h3>
      <p className="text-muted-foreground mb-4 text-sm">
        Classic Italian pasta dish with eggs, cheese, and pancetta
      </p>

      <div className="space-y-3">
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
          <Chip size="sm" variant="outlined" color="success">
            Contains Dairy
          </Chip>
          <Chip size="sm" variant="outlined" color="warning">
            Contains Gluten
          </Chip>
        </div>

        <div className="flex items-center justify-between border-t pt-3">
          <div className="flex gap-2">
            <Chip size="sm" icon={<Heart className="h-3 w-3" />}>
              234
            </Chip>
            <Chip size="sm" icon={<Scale className="h-3 w-3" />}>
              420 cal
            </Chip>
          </div>
          <button className="text-primary text-sm hover:underline">
            View Recipe →
          </button>
        </div>
      </div>
    </div>
  ),
};

// States
export const DisabledState: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Chip disabled>Disabled</Chip>
      <Chip disabled variant="outlined">
        Disabled Outlined
      </Chip>
      <Chip disabled onDelete={() => {}}>
        Disabled with Delete
      </Chip>
      <Chip disabled selected>
        Disabled Selected
      </Chip>
    </div>
  ),
};
