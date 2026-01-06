# Tooltip Component

Hover information and contextual help.

**Source**: `src/components/ui/tooltip.tsx`
**Demo**: `/components-demo/tooltip`

## Usage

```tsx
// Basic tooltip
<Tooltip content="Add to favorites">
  <Button variant="ghost" size="icon">
    <HeartIcon />
  </Button>
</Tooltip>

// With delay
<Tooltip content="Share recipe" delayDuration={300}>
  <Button variant="ghost" size="icon">
    <ShareIcon />
  </Button>
</Tooltip>

// Positioned tooltip
<Tooltip content="Cooking time" side="bottom">
  <span>30 min</span>
</Tooltip>
```

## Props

| Prop            | Type                       | Description                  |
| --------------- | -------------------------- | ---------------------------- |
| `content`       | `ReactNode`                | Tooltip content              |
| `side`          | `top\|bottom\|left\|right` | Position relative to trigger |
| `delayDuration` | `number`                   | Delay before showing (ms)    |
| `sideOffset`    | `number`                   | Distance from trigger        |

## Recipe App Use Cases

- Icon button explanations
- Cooking time details
- Ingredient substitution hints
- Nutritional information
- Keyboard shortcut hints
