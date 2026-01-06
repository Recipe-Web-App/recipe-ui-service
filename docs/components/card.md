# Card Component

Content containers and recipe cards.

**Source**: `src/components/ui/card.tsx`
**Demo**: `/components-demo/card`

## Usage

```tsx
// Basic card
<Card>
  <CardHeader>
    <CardTitle>Recipe Name</CardTitle>
    <CardDescription>A delicious dish</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Recipe content here...</p>
  </CardContent>
  <CardFooter>
    <Button>View Recipe</Button>
  </CardFooter>
</Card>

// Recipe card with image
<Card>
  <CardImage src={recipe.image} alt={recipe.title} />
  <CardHeader>
    <CardTitle>{recipe.title}</CardTitle>
    <Badge>{recipe.category}</Badge>
  </CardHeader>
  <CardContent>
    <p>{recipe.description}</p>
  </CardContent>
</Card>

// Interactive card
<Card hoverable onClick={handleClick}>
  <CardContent>
    Click me
  </CardContent>
</Card>
```

## Sub-components

- `CardHeader` - Top section with title
- `CardTitle` - Card heading
- `CardDescription` - Subtitle/description
- `CardContent` - Main content area
- `CardFooter` - Bottom actions section
- `CardImage` - Image at top of card

## Variants

| Variant    | Usage                     |
| ---------- | ------------------------- |
| `default`  | Standard card with border |
| `elevated` | Card with shadow          |
| `ghost`    | Minimal styling           |

## Recipe App Use Cases

- Recipe listing cards
- Featured recipe cards
- User profile cards
- Collection cards
- Meal plan cards
- Review cards
