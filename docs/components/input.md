# Input Component

Text inputs and form fields.

**Source**: `src/components/ui/input.tsx`
**Demo**: `/components-demo/input`

## Usage

```tsx
// Basic input
<Input placeholder="Recipe name" />

// With label
<div>
  <Label htmlFor="title">Recipe Title</Label>
  <Input id="title" placeholder="Enter recipe title" />
</div>

// With icon
<Input
  placeholder="Search recipes..."
  icon={<SearchIcon />}
/>

// Error state
<Input
  value={servings}
  error="Please enter a valid number"
/>

// Disabled
<Input placeholder="Locked field" disabled />
```

## Props

| Prop          | Type        | Description                              |
| ------------- | ----------- | ---------------------------------------- |
| `type`        | `string`    | Input type (text, email, password, etc.) |
| `placeholder` | `string`    | Placeholder text                         |
| `error`       | `string`    | Error message                            |
| `icon`        | `ReactNode` | Leading icon                             |
| `disabled`    | `boolean`   | Disable input                            |

## Variants

| Variant   | Usage                    |
| --------- | ------------------------ |
| `default` | Standard input field     |
| `error`   | Input with error state   |
| `success` | Input with success state |

## Recipe App Use Cases

- Recipe title input
- Ingredient name and quantity
- Cooking time input
- Search bar
- User profile fields
- Comment input
