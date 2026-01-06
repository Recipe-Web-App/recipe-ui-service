# Dialog Component

Modal dialogs for focused interactions.

**Source**: `src/components/ui/dialog.tsx`
**Demo**: `/components-demo/dialog`

## Usage

```tsx
// Basic dialog
<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Delete Recipe</DialogTitle>
      <DialogDescription>
        Are you sure you want to delete this recipe?
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="ghost">Cancel</Button>
      <Button variant="destructive">Delete</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

// Controlled dialog
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Add to Collection</DialogTitle>
    </DialogHeader>
    <CollectionPicker onSelect={handleSelect} />
  </DialogContent>
</Dialog>
```

## Sub-components

- `DialogTrigger` - Element that opens the dialog
- `DialogContent` - Main dialog container
- `DialogHeader` - Top section with title
- `DialogTitle` - Dialog heading
- `DialogDescription` - Subtitle text
- `DialogFooter` - Bottom action buttons
- `DialogClose` - Close button

## Props

| Prop           | Type                      | Description           |
| -------------- | ------------------------- | --------------------- |
| `open`         | `boolean`                 | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | Open state handler    |

## Recipe App Use Cases

- Delete confirmations
- Add to collection picker
- Share recipe dialog
- Login/signup modals
- Recipe quick view
- Print options
