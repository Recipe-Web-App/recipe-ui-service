# Dropdown Component

Action menus, filters, and selection dropdowns.

**Source**: `src/components/ui/dropdown.tsx`
**Demo**: `/components-demo/dropdown`

## Usage

```tsx
// Basic action menu
<DropdownMenu>
  <DropdownMenuTrigger>Recipe Actions</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>View Recipe</DropdownMenuItem>
    <DropdownMenuItem>Edit Recipe</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem variant="destructive">Delete Recipe</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>

// Filter menu with checkbox items
<DropdownMenu>
  <DropdownMenuTrigger variant="outline">Filter Options</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>Display Options</DropdownMenuLabel>
    <DropdownMenuCheckboxItem checked={showBookmarked} onCheckedChange={setShowBookmarked}>
      Show Only Bookmarked
    </DropdownMenuCheckboxItem>
  </DropdownMenuContent>
</DropdownMenu>

// Radio group selection
<DropdownMenu>
  <DropdownMenuTrigger variant="outline">Diet: {selectedDiet || 'All'}</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuRadioGroup value={selectedDiet} onValueChange={setSelectedDiet}>
      <DropdownMenuRadioItem value="vegetarian">Vegetarian</DropdownMenuRadioItem>
      <DropdownMenuRadioItem value="vegan">Vegan</DropdownMenuRadioItem>
    </DropdownMenuRadioGroup>
  </DropdownMenuContent>
</DropdownMenu>

// With sub-menus
<DropdownMenuSub>
  <DropdownMenuSubTrigger>Export Recipe</DropdownMenuSubTrigger>
  <DropdownMenuSubContent>
    <DropdownMenuItem>PDF Document</DropdownMenuItem>
    <DropdownMenuItem>Text File</DropdownMenuItem>
  </DropdownMenuSubContent>
</DropdownMenuSub>
```

## Trigger Variants

| Variant     | Usage                                             |
| ----------- | ------------------------------------------------- |
| `default`   | Primary brand styling for main action menus       |
| `secondary` | Less prominent styling for secondary actions      |
| `outline`   | Subtle border styling for filter menus            |
| `ghost`     | Minimal styling for user menus and inline actions |

## Interactive Elements

- **DropdownMenuCheckboxItem** - Toggleable options
- **DropdownMenuRadioItem** - Exclusive selections
- **DropdownMenuSeparator** - Group related actions
- **DropdownMenuLabel** - Section headers
- **DropdownMenuShortcut** - Keyboard shortcuts
- **Sub-menus** - Hierarchical actions

## Recipe App Use Cases

- Recipe actions (view, edit, duplicate, delete)
- Filter menus (category, difficulty, dietary restrictions)
- User menus (profile, settings, preferences)
- Export options with sub-menus
- Collection management
