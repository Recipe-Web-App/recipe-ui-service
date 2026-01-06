# Select Component

Dropdown selection for forms and filters.

**Source**: `src/components/ui/select.tsx`
**Demo**: `/components-demo/select`

## Usage

```tsx
// Basic select
<Select value={category} onValueChange={setCategory}>
  <SelectTrigger>
    <SelectValue placeholder="Select category" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="breakfast">Breakfast</SelectItem>
    <SelectItem value="lunch">Lunch</SelectItem>
    <SelectItem value="dinner">Dinner</SelectItem>
  </SelectContent>
</Select>

// With groups
<Select value={difficulty} onValueChange={setDifficulty}>
  <SelectTrigger>
    <SelectValue placeholder="Difficulty" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>Skill Level</SelectLabel>
      <SelectItem value="easy">Easy</SelectItem>
      <SelectItem value="medium">Medium</SelectItem>
      <SelectItem value="hard">Hard</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>
```

## Props

| Prop            | Type                      | Description        |
| --------------- | ------------------------- | ------------------ |
| `value`         | `string`                  | Selected value     |
| `onValueChange` | `(value: string) => void` | Change handler     |
| `placeholder`   | `string`                  | Placeholder text   |
| `disabled`      | `boolean`                 | Disable the select |

## Recipe App Use Cases

- Recipe category selection
- Difficulty level picker
- Cuisine type filter
- Sort order selection
- Serving size selector
- Measurement unit picker
