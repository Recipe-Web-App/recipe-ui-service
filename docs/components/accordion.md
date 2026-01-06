# Accordion Component

Collapsible content sections.

**Source**: `src/components/ui/accordion.tsx`
**Demo**: `/components-demo/accordion`

## Usage

```tsx
// Basic accordion
<Accordion type="single" collapsible>
  <AccordionItem value="ingredients">
    <AccordionTrigger>Ingredients</AccordionTrigger>
    <AccordionContent>
      <IngredientsList ingredients={recipe.ingredients} />
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="instructions">
    <AccordionTrigger>Instructions</AccordionTrigger>
    <AccordionContent>
      <InstructionsList steps={recipe.steps} />
    </AccordionContent>
  </AccordionItem>
</Accordion>

// Multiple open
<Accordion type="multiple" defaultValue={['faq-1']}>
  <AccordionItem value="faq-1">
    <AccordionTrigger>How long does this keep?</AccordionTrigger>
    <AccordionContent>
      Store in an airtight container for up to 3 days.
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

## Props

| Prop           | Type                 | Description                |
| -------------- | -------------------- | -------------------------- |
| `type`         | `single \| multiple` | Allow one or multiple open |
| `collapsible`  | `boolean`            | Allow all to be closed     |
| `defaultValue` | `string \| string[]` | Initially open items       |

## Recipe App Use Cases

- Recipe sections (ingredients, instructions, nutrition)
- FAQ sections
- Cooking tips
- Step-by-step instructions
- Review sections
- Filter categories
