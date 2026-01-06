# Grid Component

Layout grid system for responsive designs.

**Source**: Various layout components
**Demo**: See layout examples

## Usage

```tsx
// Basic grid
<Grid cols={3} gap={4}>
  <RecipeCard recipe={recipe1} />
  <RecipeCard recipe={recipe2} />
  <RecipeCard recipe={recipe3} />
</Grid>

// Responsive grid
<Grid cols={{ sm: 1, md: 2, lg: 3, xl: 4 }} gap={6}>
  {recipes.map(recipe => (
    <RecipeCard key={recipe.id} recipe={recipe} />
  ))}
</Grid>

// With auto-fit
<Grid minWidth={280} gap={4}>
  {recipes.map(recipe => (
    <RecipeCard key={recipe.id} recipe={recipe} />
  ))}
</Grid>
```

## Props

| Prop       | Type               | Description                            |
| ---------- | ------------------ | -------------------------------------- |
| `cols`     | `number \| object` | Number of columns or responsive object |
| `gap`      | `number`           | Gap between items (in spacing units)   |
| `minWidth` | `number`           | Minimum item width for auto-fit        |

## Breakpoints

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

## Recipe App Use Cases

- Recipe card grids
- Ingredient grid layouts
- Collection displays
- Search results
- Category listings
- Featured recipes section
