import * as React from 'react';
import type { VariantProps } from 'class-variance-authority';
import type {
  listVariants,
  listItemVariants,
  listItemContentVariants,
  listItemTitleVariants,
  listItemDescriptionVariants,
  listItemIconVariants,
  recipeListVariants,
  shoppingListVariants,
} from '@/lib/ui/list-variants';

// Base list props
export interface BaseListProps {
  id?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  role?: 'list' | 'menu' | 'listbox' | 'group';
}

// Main List component props
export interface ListProps
  extends Omit<React.HTMLAttributes<HTMLUListElement>, 'role'>,
    BaseListProps,
    VariantProps<typeof listVariants> {
  asChild?: boolean;
  ordered?: boolean;
  children: React.ReactNode;
}

// List Item component props
export interface ListItemProps
  extends Omit<React.HTMLAttributes<HTMLLIElement>, 'role'>,
    VariantProps<typeof listItemVariants> {
  asChild?: boolean;
  selected?: boolean;
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onSelect?: () => void;
  role?: 'listitem' | 'menuitem' | 'option' | 'none' | 'presentation';
  'aria-disabled'?: boolean;
  'aria-current'?: boolean | 'page' | 'step' | 'location' | 'date' | 'time';
}

// List Item Content props
export interface ListItemContentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof listItemContentVariants> {
  children: React.ReactNode;
}

// List Item Title props
export interface ListItemTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof listItemTitleVariants> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' | 'span';
  children: React.ReactNode;
}

// List Item Description props
export interface ListItemDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof listItemDescriptionVariants> {
  as?: 'p' | 'div' | 'span';
  children: React.ReactNode;
}

// List Item Icon props
export interface ListItemIconProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof listItemIconVariants> {
  icon?: React.ReactNode;
  children?: React.ReactNode;
  'aria-hidden'?: boolean;
}

// Checkbox List Item props
export interface CheckboxListItemProps
  extends Omit<ListItemProps, 'selected' | 'children'> {
  checked?: boolean;
  indeterminate?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  checkboxId?: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  value?: string;
  children?: React.ReactNode;
}

// Recipe-specific props
export interface RecipeListProps
  extends Omit<ListProps, 'variant'>,
    VariantProps<typeof recipeListVariants> {
  variant?: VariantProps<typeof listVariants>['variant'];
}

export interface IngredientListItemProps
  extends Omit<ListItemProps, 'children'> {
  ingredient: {
    id: string;
    name: string;
    quantity?: string;
    unit?: string;
    optional?: boolean;
    checked?: boolean;
  };
  showQuantity?: boolean;
  allowChecking?: boolean;
  onToggleCheck?: (id: string) => void;
  context?: 'shopping' | 'cooking' | 'display';
  children?: React.ReactNode;
}

export interface InstructionListItemProps
  extends Omit<ListItemProps, 'children'> {
  instruction: {
    id: string;
    step: number;
    text: string;
    duration?: string;
    temperature?: string;
    completed?: boolean;
  };
  showDuration?: boolean;
  allowChecking?: boolean;
  onToggleComplete?: (id: string) => void;
  context?: 'cooking' | 'display';
  children?: React.ReactNode;
}

export interface NutritionListItemProps
  extends Omit<ListItemProps, 'children'> {
  nutrition: {
    id: string;
    label: string;
    value: string | number;
    unit?: string;
    dailyValue?: number;
  };
  showDailyValue?: boolean;
  showUnit?: boolean;
  children?: React.ReactNode;
}

// Shopping list props
export interface ShoppingListProps
  extends Omit<ListProps, 'variant'>,
    VariantProps<typeof shoppingListVariants> {
  variant?: VariantProps<typeof listVariants>['variant'];
  items: ShoppingListItem[];
  onItemCheck?: (id: string, checked: boolean) => void;
  onItemUpdate?: (id: string, updates: Partial<ShoppingListItem>) => void;
}

export interface ShoppingListItem {
  id: string;
  name: string;
  quantity?: string;
  unit?: string;
  category?: string;
  checked?: boolean;
  note?: string;
  recipeId?: string;
  recipeName?: string;
}

export interface ShoppingListItemProps extends ListItemProps {
  item: ShoppingListItem;
  showQuantity?: boolean;
  showCategory?: boolean;
  showRecipe?: boolean;
  allowEditing?: boolean;
  onCheck?: (id: string, checked: boolean) => void;
  onEdit?: (id: string, updates: Partial<ShoppingListItem>) => void;
}

// Menu/Navigation list props
export interface MenuListProps extends Omit<ListProps, 'variant'> {
  variant?: VariantProps<typeof listVariants>['variant'];
  items?: MenuListItem[];
  selectedKey?: string;
  onSelectionChange?: (key: string) => void;
  allowMultipleSelection?: boolean;
  selectedKeys?: string[];
  onSelectionMultipleChange?: (keys: string[]) => void;
}

export interface MenuListItem {
  key: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  href?: string;
  disabled?: boolean;
  divider?: boolean;
  children?: MenuListItem[];
}

export interface MenuListItemProps extends Omit<ListItemProps, 'onSelect'> {
  item: MenuListItem;
  level?: number;
  selected?: boolean;
  onSelect?: (key: string) => void;
}

// Virtual/Performance list props
export interface VirtualListProps
  extends Omit<ListProps, 'children' | 'onScroll'> {
  items: unknown[];
  itemHeight: number | ((index: number) => number);
  renderItem: (item: unknown, index: number) => React.ReactNode;
  overscan?: number;
  scrollToIndex?: number;
  onScroll?: (scrollTop: number) => void;
  estimatedItemHeight?: number;
}

// Filter list props
export interface FilterListProps extends ListProps {
  searchTerm?: string;
  searchPlaceholder?: string;
  searchable?: boolean;
  filterable?: boolean;
  sortable?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, unknown>;
  onSearchChange?: (term: string) => void;
  onFilterChange?: (filters: Record<string, unknown>) => void;
  onSortChange?: (sortBy: string, order: 'asc' | 'desc') => void;
  emptyState?: React.ReactNode;
  loadingState?: React.ReactNode;
}

// Drag and drop list props
export interface DragDropListProps extends Omit<ListProps, 'onDrop'> {
  items: DragDropItem[];
  onReorder?: (items: DragDropItem[]) => void;
  onDrop?: (item: DragDropItem, targetIndex: number) => void;
  allowReorder?: boolean;
  allowDrop?: boolean;
  dragHandle?: boolean;
  dragPreview?: (item: DragDropItem) => React.ReactNode;
}

export interface DragDropItem {
  id: string;
  content: React.ReactNode;
  data?: Record<string, unknown>;
  draggable?: boolean;
  droppable?: boolean;
}

export interface DragDropListItemProps extends ListItemProps {
  item: DragDropItem;
  isDragging?: boolean;
  isDropTarget?: boolean;
  dragHandleProps?: Record<string, unknown>;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

// Collapsible list props
export interface CollapsibleListProps extends ListProps {
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  collapsed?: boolean;
  onToggleCollapse?: (collapsed: boolean) => void;
  collapseIcon?: React.ReactNode;
  expandIcon?: React.ReactNode;
  summary?: React.ReactNode;
  children: React.ReactNode;
}

export interface CollapsibleListItemProps extends ListItemProps {
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  collapsed?: boolean;
  onToggleCollapse?: (collapsed: boolean) => void;
  summary: React.ReactNode;
  children: React.ReactNode;
}

// Multi-select list props
export interface MultiSelectListProps extends ListProps {
  selectable?: boolean;
  allowMultipleSelection?: boolean;
  selectedItems?: string[];
  onSelectionChange?: (selectedItems: string[]) => void;
  selectAll?: boolean;
  onSelectAll?: () => void;
  onClearAll?: () => void;
  selectionMode?: 'single' | 'multiple' | 'none';
}

// Context types for compound components
export interface ListContextValue {
  variant?: VariantProps<typeof listVariants>['variant'];
  size?: VariantProps<typeof listVariants>['size'];
  density?: VariantProps<typeof listVariants>['density'];
  selectable?: boolean;
  selectedItems?: Set<string>;
  onSelectionChange?: (id: string, selected: boolean) => void;
}

export interface ListItemContextValue {
  selected?: boolean;
  disabled?: boolean;
  loading?: boolean;
  onSelect?: () => void;
}

// Event types
export interface ListSelectionEvent {
  selectedKeys: Set<string>;
  key?: string;
  type: 'select' | 'deselect' | 'selectAll' | 'deselectAll';
}

export interface ListActionEvent {
  key: string;
  action: string;
  data?: Record<string, unknown>;
}

// State management types
export interface ListState {
  selectedItems: Set<string>;
  collapsedItems: Set<string>;
  searchTerm: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  filters: Record<string, unknown>;
}

export interface ListActions {
  selectItem: (id: string) => void;
  deselectItem: (id: string) => void;
  toggleItem: (id: string) => void;
  selectAll: () => void;
  deselectAll: () => void;
  collapseItem: (id: string) => void;
  expandItem: (id: string) => void;
  toggleCollapse: (id: string) => void;
  setSearchTerm: (term: string) => void;
  setSortBy: (sortBy: string) => void;
  setSortOrder: (order: 'asc' | 'desc') => void;
  setFilters: (filters: Record<string, unknown>) => void;
  reset: () => void;
}

// Accessibility helpers
export interface ListA11yProps {
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-multiselectable'?: boolean;
  'aria-expanded'?: boolean;
  'aria-activedescendant'?: string;
  role?: 'list' | 'listbox' | 'menu' | 'group' | 'radiogroup';
}

export interface ListItemA11yProps {
  'aria-disabled'?: boolean;
  'aria-current'?: boolean | 'page' | 'step' | 'location' | 'date' | 'time';
  'aria-expanded'?: boolean;
  'aria-level'?: number;
  'aria-setsize'?: number;
  'aria-posinset'?: number;
  role?: 'listitem' | 'option' | 'menuitem' | 'radio' | 'none' | 'presentation';
  tabIndex?: number;
}

// Hook return types
export interface UseListSelection {
  selectedItems: Set<string>;
  isSelected: (id: string) => boolean;
  selectItem: (id: string) => void;
  deselectItem: (id: string) => void;
  toggleItem: (id: string) => void;
  selectAll: (items: string[]) => void;
  deselectAll: () => void;
  hasSelection: boolean;
  selectedCount: number;
}

export interface UseListKeyboard {
  focusedIndex: number;
  handleKeyDown: (event: React.KeyboardEvent) => void;
  setFocusedIndex: (index: number) => void;
  resetFocus: () => void;
}

export interface UseListFilter<T> {
  filteredItems: T[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  setSortBy: (sortBy: string) => void;
  setSortOrder: (order: 'asc' | 'desc') => void;
  filters: Record<string, unknown>;
  setFilters: (filters: Record<string, unknown>) => void;
  hasActiveFilters: boolean;
  clearFilters: () => void;
}
