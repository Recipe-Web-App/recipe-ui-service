/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import React from 'react';
// @ts-expect-error - Storybook types not available in this environment
import type { Meta, StoryObj } from '@storybook/react';
import type { DividerProps } from './divider';
// @ts-expect-error - Storybook types not available in this environment
import { action } from '@storybook/addon-actions';
import {
  Divider,
  DividerWithText,
  DividerWithIcon,
  RecipeDivider,
  SectionDivider,
} from './divider';
import {
  Star,
  Heart,
  ChefHat,
  Utensils,
  Clock,
  Leaf,
  Scale,
} from 'lucide-react';

const meta: Meta<typeof Divider> = {
  title: 'UI/Divider',
  component: Divider,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A flexible, accessible divider component with support for horizontal/vertical orientations, various styles, text/icon decorations, and recipe-specific variants. Built with TypeScript and full accessibility compliance.',
      },
    },
  },
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Orientation of the divider',
    },
    style: {
      control: 'select',
      options: ['solid', 'dashed', 'dotted', 'double'],
      description: 'Visual style of the divider line',
    },
    weight: {
      control: 'select',
      options: ['thin', 'normal', 'thick'],
      description: 'Thickness of the divider',
    },
    length: {
      control: 'select',
      options: ['short', 'normal', 'long', 'full'],
      description: 'Length of the divider',
    },
    spacing: {
      control: 'select',
      options: ['tight', 'normal', 'loose'],
      description: 'Spacing around the divider',
    },
    color: {
      control: 'select',
      options: [
        'default',
        'muted',
        'primary',
        'secondary',
        'accent',
        'destructive',
      ],
      description: 'Color variant of the divider',
    },
    decorative: {
      control: 'boolean',
      description:
        'Whether the divider is purely decorative (affects ARIA attributes)',
    },
  },
  decorators: [
    (Story: React.ComponentType) => (
      <div className="w-full max-w-2xl p-8">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Divider>;

// Basic Divider Stories
export const Default: Story = {
  args: {},
  render: (args: DividerProps) => (
    <div className="space-y-4">
      <p>Content above the divider</p>
      <Divider {...args} />
      <p>Content below the divider</p>
    </div>
  ),
};

export const Horizontal: Story = {
  args: {
    orientation: 'horizontal',
  },
  render: (args: DividerProps) => (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2 text-lg font-semibold">Horizontal Dividers</h3>
        <div className="space-y-4">
          <div>
            <p className="mb-2">Thin (default)</p>
            <Divider {...args} weight="thin" />
          </div>
          <div>
            <p className="mb-2">Normal</p>
            <Divider {...args} weight="normal" />
          </div>
          <div>
            <p className="mb-2">Thick</p>
            <Divider {...args} weight="thick" />
          </div>
        </div>
      </div>
    </div>
  ),
};

export const Vertical: Story = {
  args: {
    orientation: 'vertical',
  },
  render: (args: DividerProps) => (
    <div className="flex h-32 items-center gap-4">
      <div className="text-center">
        <p>Left Content</p>
      </div>
      <Divider {...args} weight="thin" />
      <div className="text-center">
        <p>Middle Content</p>
      </div>
      <Divider {...args} weight="normal" />
      <div className="text-center">
        <p>Right Content</p>
      </div>
    </div>
  ),
};

export const Styles: Story = {
  args: {},
  render: (args: DividerProps) => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Divider Styles</h3>
      <div className="space-y-4">
        <div>
          <p className="mb-2">Solid</p>
          <Divider {...args} style="solid" />
        </div>
        <div>
          <p className="mb-2">Dashed</p>
          <Divider {...args} style="dashed" />
        </div>
        <div>
          <p className="mb-2">Dotted</p>
          <Divider {...args} style="dotted" />
        </div>
        <div>
          <p className="mb-2">Double</p>
          <Divider {...args} style="double" />
        </div>
      </div>
    </div>
  ),
};

export const Colors: Story = {
  args: {},
  render: (args: DividerProps) => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Color Variants</h3>
      <div className="space-y-4">
        <div>
          <p className="mb-2">Default</p>
          <Divider {...args} color="default" />
        </div>
        <div>
          <p className="mb-2">Muted</p>
          <Divider {...args} color="muted" />
        </div>
        <div>
          <p className="mb-2">Primary</p>
          <Divider {...args} color="primary" />
        </div>
        <div>
          <p className="mb-2">Secondary</p>
          <Divider {...args} color="secondary" />
        </div>
        <div>
          <p className="mb-2">Accent</p>
          <Divider {...args} color="accent" />
        </div>
      </div>
    </div>
  ),
};

export const Lengths: Story = {
  args: {},
  render: (args: DividerProps) => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Length Variants</h3>
      <div className="space-y-4">
        <div>
          <p className="mb-2">Short</p>
          <div className="flex justify-center">
            <Divider {...args} length="short" />
          </div>
        </div>
        <div>
          <p className="mb-2">Normal</p>
          <div className="flex justify-center">
            <Divider {...args} length="normal" />
          </div>
        </div>
        <div>
          <p className="mb-2">Long</p>
          <div className="flex justify-center">
            <Divider {...args} length="long" />
          </div>
        </div>
        <div>
          <p className="mb-2">Full</p>
          <Divider {...args} length="full" />
        </div>
      </div>
    </div>
  ),
};

// Divider with Text Stories
export const WithText: Story = {
  render: () => (
    <div className="space-y-8">
      <h3 className="text-lg font-semibold">Dividers with Text</h3>

      <div className="space-y-6">
        <div>
          <p className="mb-4">Center positioned text</p>
          <DividerWithText text="OR" />
        </div>

        <div>
          <p className="mb-4">Start positioned text</p>
          <DividerWithText text="Beginning" textPosition="start" />
        </div>

        <div>
          <p className="mb-4">End positioned text</p>
          <DividerWithText text="End" textPosition="end" />
        </div>

        <div>
          <p className="mb-4">Custom styled text</p>
          <DividerWithText
            text="INGREDIENTS"
            textProps={{
              size: 'sm',
              weight: 'semibold',
              transform: 'uppercase',
              color: 'primary',
            }}
          />
        </div>
      </div>
    </div>
  ),
};

// Divider with Icon Stories
export const WithIcon: Story = {
  render: () => (
    <div className="space-y-8">
      <h3 className="text-lg font-semibold">Dividers with Icons</h3>

      <div className="space-y-6">
        <div>
          <p className="mb-4">Star icon (center)</p>
          <DividerWithIcon icon={<Star className="h-4 w-4" />} />
        </div>

        <div>
          <p className="mb-4">Heart icon (start)</p>
          <DividerWithIcon
            icon={<Heart className="h-4 w-4" />}
            textPosition="start"
          />
        </div>

        <div>
          <p className="mb-4">Chef hat icon with custom styling</p>
          <DividerWithIcon
            icon={<ChefHat className="h-5 w-5" />}
            iconProps={{
              size: 'lg',
              variant: 'filled',
            }}
          />
        </div>
      </div>
    </div>
  ),
};

// Recipe-specific Stories
export const RecipeContexts: Story = {
  render: () => (
    <div className="space-y-8">
      <h3 className="text-lg font-semibold">Recipe-Specific Dividers</h3>

      <div className="space-y-6">
        <div>
          <p className="mb-4">Ingredient Group</p>
          <RecipeDivider context="ingredient-group" />
        </div>

        <div>
          <p className="mb-4">Instruction Step</p>
          <RecipeDivider context="instruction-step" />
        </div>

        <div>
          <p className="mb-4">Nutrition Group</p>
          <RecipeDivider context="nutrition-group" />
        </div>

        <div>
          <p className="mb-4">Recipe Section</p>
          <RecipeDivider context="recipe-section" />
        </div>

        <div>
          <p className="mb-4">With Label</p>
          <RecipeDivider
            context="ingredient-group"
            label="Wet Ingredients"
            showLabel
          />
        </div>
      </div>
    </div>
  ),
};

export const SectionDividers: Story = {
  render: () => (
    <div className="space-y-8">
      <h3 className="text-lg font-semibold">Section Dividers</h3>

      <div className="space-y-8">
        <SectionDivider
          section="ingredients"
          title="Ingredients"
          subtitle="Everything you need for this recipe"
          icon={<Leaf className="h-4 w-4" />}
        />

        <SectionDivider
          section="instructions"
          title="Instructions"
          subtitle="Step-by-step cooking guide"
          icon={<Utensils className="h-4 w-4" />}
        />

        <SectionDivider
          section="nutrition"
          title="Nutrition Information"
          subtitle="Per serving"
          icon={<Scale className="h-4 w-4" />}
        />

        <SectionDivider
          section="metadata"
          title="Recipe Details"
          subtitle="Prep time, cook time, and servings"
          icon={<Clock className="h-4 w-4" />}
          collapsible
          onToggleCollapse={action('toggle-collapse')}
        />
      </div>
    </div>
  ),
};

// Interactive Examples
export const InteractiveExample: Story = {
  render: () => {
    const [selectedStyle, setSelectedStyle] = React.useState<
      'solid' | 'dashed' | 'dotted' | 'double'
    >('solid');
    const [selectedWeight, setSelectedWeight] = React.useState<
      'thin' | 'normal' | 'thick'
    >('thin');
    const [selectedColor, setSelectedColor] = React.useState<
      'default' | 'primary' | 'secondary'
    >('default');

    return (
      <div className="space-y-8">
        <h3 className="text-lg font-semibold">Interactive Divider</h3>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium">Style</label>
            <select
              value={selectedStyle}
              onChange={e =>
                setSelectedStyle(
                  e.target.value as 'solid' | 'dashed' | 'dotted' | 'double'
                )
              }
              className="w-full rounded border px-3 py-2"
            >
              <option value="solid">Solid</option>
              <option value="dashed">Dashed</option>
              <option value="dotted">Dotted</option>
              <option value="double">Double</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Weight</label>
            <select
              value={selectedWeight}
              onChange={e =>
                setSelectedWeight(e.target.value as 'thin' | 'normal' | 'thick')
              }
              className="w-full rounded border px-3 py-2"
            >
              <option value="thin">Thin</option>
              <option value="normal">Normal</option>
              <option value="thick">Thick</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Color</label>
            <select
              value={selectedColor}
              onChange={e =>
                setSelectedColor(
                  e.target.value as 'default' | 'primary' | 'secondary'
                )
              }
              className="w-full rounded border px-3 py-2"
            >
              <option value="default">Default</option>
              <option value="primary">Primary</option>
              <option value="secondary">Secondary</option>
            </select>
          </div>
        </div>

        <div className="mt-8">
          <p className="mb-4">Live Preview:</p>
          <Divider
            style={selectedStyle}
            weight={selectedWeight}
            color={selectedColor}
          />
        </div>
      </div>
    );
  },
};

// Recipe Layout Example
export const RecipeLayout: Story = {
  render: () => (
    <div className="mx-auto max-w-2xl space-y-6">
      <h2 className="text-2xl font-bold">Chocolate Chip Cookies</h2>

      <SectionDivider
        section="metadata"
        title="Recipe Info"
        icon={<Clock className="h-4 w-4" />}
      />

      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <span className="text-muted-foreground text-sm">Prep Time</span>
          <p className="font-semibold">15 min</p>
        </div>
        <div>
          <span className="text-muted-foreground text-sm">Cook Time</span>
          <p className="font-semibold">12 min</p>
        </div>
        <div>
          <span className="text-muted-foreground text-sm">Servings</span>
          <p className="font-semibold">24</p>
        </div>
      </div>

      <SectionDivider
        section="ingredients"
        title="Ingredients"
        icon={<Leaf className="h-4 w-4" />}
      />

      <div className="space-y-3">
        <p>• 2¼ cups all-purpose flour</p>
        <p>• 1 tsp baking soda</p>
        <p>• 1 tsp salt</p>

        <RecipeDivider
          context="ingredient-group"
          label="Wet Ingredients"
          showLabel
        />

        <p>• 1 cup butter, softened</p>
        <p>• ¾ cup granulated sugar</p>
        <p>• 2 large eggs</p>
      </div>

      <SectionDivider
        section="instructions"
        title="Instructions"
        icon={<Utensils className="h-4 w-4" />}
      />

      <div className="space-y-4">
        <div>
          <p className="font-medium">1. Preheat and prepare</p>
          <p className="text-muted-foreground">Preheat oven to 375°F...</p>
        </div>

        <RecipeDivider context="instruction-step" />

        <div>
          <p className="font-medium">2. Mix dry ingredients</p>
          <p className="text-muted-foreground">
            In a medium bowl, whisk together...
          </p>
        </div>
      </div>
    </div>
  ),
};
