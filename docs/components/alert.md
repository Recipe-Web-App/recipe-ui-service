# Alert Component

Status messages and notifications.

**Source**: `src/components/ui/alert.tsx`
**Demo**: `/components-demo/alert`

## Usage

```tsx
// Success alert
<Alert variant="success">
  <AlertTitle>Recipe Saved!</AlertTitle>
  <AlertDescription>
    Your recipe has been saved to your collection.
  </AlertDescription>
</Alert>

// Error alert
<Alert variant="destructive">
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>
    Failed to save recipe. Please try again.
  </AlertDescription>
</Alert>

// Warning alert
<Alert variant="warning">
  <AlertTitle>Unsaved Changes</AlertTitle>
  <AlertDescription>
    You have unsaved changes that will be lost.
  </AlertDescription>
</Alert>

// Info alert
<Alert>
  <AlertTitle>Tip</AlertTitle>
  <AlertDescription>
    Add a pinch of salt to enhance the flavor.
  </AlertDescription>
</Alert>
```

## Variants

| Variant       | Usage                         |
| ------------- | ----------------------------- |
| `default`     | Informational messages        |
| `success`     | Success/confirmation messages |
| `warning`     | Warning messages              |
| `destructive` | Error messages                |

## Sub-components

- `AlertTitle` - Alert heading
- `AlertDescription` - Alert body text
- `AlertIcon` - Optional leading icon

## Recipe App Use Cases

- Recipe save confirmations
- Error messages
- Cooking tips
- Dietary warnings
- Ingredient substitution notes
- Form validation feedback
