# Tabs Component

Tabbed content navigation for organizing related content.

**Source**: `src/components/ui/tabs.tsx`
**Demo**: `/components-demo/tabs`

## Usage

```tsx
// Basic recipe content tabs
<Tabs defaultValue="ingredients">
  <TabsList>
    <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
    <TabsTrigger value="instructions">Instructions</TabsTrigger>
    <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
  </TabsList>
  <TabsContent value="ingredients">
    <IngredientsList ingredients={recipe.ingredients} />
  </TabsContent>
  <TabsContent value="instructions">
    <InstructionsList steps={recipe.steps} />
  </TabsContent>
</Tabs>

// Line variant for clean layouts
<Tabs defaultValue="account" variant="line">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="recipes">My Recipes</TabsTrigger>
  </TabsList>
</Tabs>

// Pills variant for modern interfaces
<Tabs defaultValue="published" variant="pills" size="lg">
  <TabsList>
    <TabsTrigger value="published">Published (12)</TabsTrigger>
    <TabsTrigger value="drafts">Drafts (3)</TabsTrigger>
  </TabsList>
</Tabs>
```

## List Variants

| Variant   | Usage                                     |
| --------- | ----------------------------------------- |
| `default` | Standard contained tabs with background   |
| `line`    | Minimal underlined tabs for clean layouts |
| `pills`   | Rounded pill-style for modern interfaces  |

## Content Variants

| Variant   | Usage                                   |
| --------- | --------------------------------------- |
| `default` | Standard with subtle border and padding |
| `line`    | Minimal with just top padding           |
| `pills`   | Soft background matching pill aesthetic |
| `card`    | Elevated card-style with shadow         |

## Sizes

- `sm` - Compact tabs (24px height)
- `default` - Standard size (28px height)
- `lg` - Larger tabs (32px height)

## Recipe App Use Cases

- Recipe content (ingredients, instructions, nutrition)
- User profile (account, recipes, favorites, collections)
- Recipe management dashboard (published, drafts, pending)
- Recipe details (overview, reviews, similar recipes)

## Accessibility

- Full keyboard navigation with arrow keys
- ARIA attributes for screen reader support
- Automatic focus management
- Clear focus indicators
