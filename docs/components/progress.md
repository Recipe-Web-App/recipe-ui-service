# Progress Component

Progress indicators and loading states.

**Source**: `src/components/ui/progress.tsx`
**Demo**: `/components-demo/progress`

## Usage

```tsx
// Basic progress bar
<Progress value={65} />

// With label
<div>
  <Progress value={recipeProgress} />
  <span>{recipeProgress}% complete</span>
</div>

// Recipe completion tracker
<Progress
  value={(completedSteps / totalSteps) * 100}
  variant="success"
/>

// Upload progress
<Progress value={uploadProgress} size="sm" />
```

## Variants

| Variant       | Usage                       |
| ------------- | --------------------------- |
| `default`     | Standard progress indicator |
| `success`     | Completion/success state    |
| `warning`     | Partial completion          |
| `destructive` | Error or failed state       |

## Sizes

- `sm` - Small (4px height)
- `md` - Medium (8px height) - default
- `lg` - Large (12px height)

## Recipe App Use Cases

- Recipe creation progress
- Step-by-step cooking progress
- File upload progress
- Profile completion
- Onboarding progress
- Nutrition goals tracking
