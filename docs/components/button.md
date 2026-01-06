# Button Component

Primary action buttons and call-to-action elements.

**Source**: `src/components/ui/button.tsx`
**Demo**: `/components-demo/button`

## Usage

```tsx
// Primary button for main actions
<Button variant="primary" size="lg" icon={<PlusIcon />}>
  Add Recipe
</Button>

// Secondary button for supporting actions
<Button variant="secondary" size="md">
  Cancel
</Button>

// Icon-only button for compact spaces
<Button variant="ghost" size="sm" iconOnly>
  <HeartIcon />
</Button>
```

## Variants

| Variant       | Usage                            |
| ------------- | -------------------------------- |
| `primary`     | Main call-to-action buttons      |
| `secondary`   | Supporting actions               |
| `outline`     | Less prominent actions           |
| `ghost`       | Minimal styling for icon buttons |
| `destructive` | Delete or remove actions         |

## Sizes

- `sm` - Small buttons
- `md` - Default size
- `lg` - Large buttons
- `icon` - Icon-only buttons
