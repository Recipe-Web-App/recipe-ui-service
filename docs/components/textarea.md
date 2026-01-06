# Textarea Component

Multi-line text input for longer content.

**Source**: `src/components/ui/textarea.tsx`
**Demo**: `/components-demo/textarea`

## Usage

```tsx
// Basic textarea
<Textarea placeholder="Enter recipe description" />

// With label
<div>
  <Label htmlFor="instructions">Instructions</Label>
  <Textarea
    id="instructions"
    placeholder="Enter cooking instructions..."
    rows={6}
  />
</div>

// With character count
<div>
  <Textarea
    value={description}
    onChange={e => setDescription(e.target.value)}
    maxLength={500}
  />
  <span>{description.length}/500</span>
</div>

// Auto-resize
<Textarea
  placeholder="Start typing..."
  autoResize
/>
```

## Props

| Prop         | Type      | Description                  |
| ------------ | --------- | ---------------------------- |
| `rows`       | `number`  | Number of visible rows       |
| `maxLength`  | `number`  | Maximum characters           |
| `autoResize` | `boolean` | Auto-resize based on content |
| `error`      | `string`  | Error message                |
| `disabled`   | `boolean` | Disable textarea             |

## Recipe App Use Cases

- Recipe descriptions
- Cooking instructions
- Review content
- Recipe notes
- Comments
- Ingredient prep notes
