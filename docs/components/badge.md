# Badge Component

Labels, tags, and status indicators.

**Source**: `src/components/ui/badge.tsx`
**Demo**: `/components-demo/badge`

## Usage

```tsx
// Basic badge for labels and categories
<Badge>New Recipe</Badge>

// Recipe category badges
<Badge variant="info">Breakfast</Badge>
<Badge variant="info">Vegetarian</Badge>

// Difficulty level indicators
<Badge variant="success">Easy</Badge>
<Badge variant="warning">Medium</Badge>
<Badge variant="destructive">Hard</Badge>

// Status indicators
<Badge variant="success">Published</Badge>
<Badge variant="warning">Draft</Badge>

// Cooking time badges
<Badge variant="outline" size="sm">30 min</Badge>

// Dietary restriction tags
<Badge variant="outline">Gluten-Free</Badge>
<Badge variant="outline">Vegan</Badge>

// Interactive badges (polymorphic)
<Badge asChild>
  <Link href="/category/dessert">Dessert</Link>
</Badge>
```

## Variants

| Variant       | Usage                                                   |
| ------------- | ------------------------------------------------------- |
| `default`     | Primary brand badges for featured content               |
| `secondary`   | Less prominent tags and secondary categories            |
| `destructive` | Error states, warnings, expired content                 |
| `outline`     | Subtle emphasis, filter states, dietary restrictions    |
| `success`     | Published recipes, positive indicators, easy difficulty |
| `warning`     | Draft content, pending states, medium difficulty        |
| `info`        | New content, informational badges, recipe categories    |

## Sizes

- `sm` - Compact badges for dense layouts
- `default` - Standard size
- `lg` - Prominent badges for emphasis

## Recipe App Use Cases

- **Recipe Categories**: Breakfast, Lunch, Dinner, Dessert, Snack
- **Difficulty Levels**: Easy (success), Medium (warning), Hard (destructive)
- **Dietary Restrictions**: Vegetarian, Vegan, Gluten-Free, Dairy-Free, Keto
- **Recipe Status**: Published (success), Draft (warning), Private (secondary)
- **Cooking Times**: "15 min", "30 min", "1 hour" (outline, small size)
