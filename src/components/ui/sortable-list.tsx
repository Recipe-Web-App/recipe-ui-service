'use client';

import * as React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  sortableListVariants,
  sortableItemVariants,
  sortableItemContentVariants,
  sortableItemActionsVariants,
  dragHandleVariants,
  sortableEmptyVariants,
} from '@/lib/ui/sortable-list-variants';
import type {
  SortableItemData,
  SortableListProps,
  SortableItemProps,
  SortableItemContentProps,
  SortableItemActionsProps,
  DragHandleProps,
  SortableEmptyProps,
} from '@/types/ui/sortable-list';

/**
 * SortableList Component
 *
 * A drag-and-drop sortable list component for reordering items.
 * Built with @dnd-kit for accessible, performant drag-and-drop.
 *
 * @example
 * ```tsx
 * const [items, setItems] = useState([
 *   { id: '1', name: 'Item 1' },
 *   { id: '2', name: 'Item 2' },
 * ]);
 *
 * <SortableList
 *   items={items}
 *   onReorder={setItems}
 *   renderItem={(item) => (
 *     <SortableItem id={item.id}>
 *       <SortableItemContent>{item.name}</SortableItemContent>
 *     </SortableItem>
 *   )}
 * />
 * ```
 */
function SortableList<T extends SortableItemData>({
  items,
  onReorder,
  renderItem,
  keyExtractor = item => item.id,
  disabled = false,
  emptyMessage = 'No items',
  className,
  variant,
  size,
  'aria-label': ariaLabel,
  ...props
}: SortableListProps<T>) {
  const [activeId, setActiveId] = React.useState<string | null>(null);

  // Configure sensors for pointer and keyboard interactions
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Minimum drag distance before activation
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle drag start
  const handleDragStart = React.useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  // Handle drag end and reorder items
  const handleDragEnd = React.useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveId(null);

      if (over && active.id !== over.id) {
        const oldIndex = items.findIndex(
          item => keyExtractor(item) === active.id
        );
        const newIndex = items.findIndex(
          item => keyExtractor(item) === over.id
        );

        if (oldIndex !== -1 && newIndex !== -1) {
          const newItems = arrayMove(items, oldIndex, newIndex);
          onReorder(newItems);
        }
      }
    },
    [items, keyExtractor, onReorder]
  );

  // Create item IDs for SortableContext
  const itemIds = React.useMemo(
    () => items.map(item => keyExtractor(item)),
    [items, keyExtractor]
  );

  // Empty state
  if (items.length === 0) {
    return (
      <SortableEmpty size={size} className={className}>
        {emptyMessage}
      </SortableEmpty>
    );
  }

  return (
    <DndContext
      sensors={disabled ? undefined : sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
        <div
          role="list"
          aria-label={ariaLabel}
          className={cn(sortableListVariants({ variant, size }), className)}
          {...props}
        >
          <SortableListContext.Provider value={{ activeId, disabled }}>
            {items.map((item, index) => (
              <React.Fragment key={keyExtractor(item)}>
                {renderItem(item, index)}
              </React.Fragment>
            ))}
          </SortableListContext.Provider>
        </div>
      </SortableContext>
    </DndContext>
  );
}

// Context for sharing state between list and items
interface SortableListContextValue {
  activeId: string | null;
  disabled: boolean;
}

const SortableListContext = React.createContext<SortableListContextValue>({
  activeId: null,
  disabled: false,
});

/**
 * SortableItem Component
 *
 * An individual item within a SortableList that can be dragged to reorder.
 */
const SortableItem = React.forwardRef<HTMLDivElement, SortableItemProps>(
  (
    {
      id,
      disabled = false,
      children,
      showDragHandle = true,
      dragHandlePosition = 'start',
      className,
      variant,
      size,
      ...props
    },
    forwardedRef
  ) => {
    const { disabled: listDisabled } = React.useContext(SortableListContext);
    const isDisabled = disabled || listDisabled;

    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({
      id,
      disabled: isDisabled,
    });

    const style: React.CSSProperties = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    // Combine refs
    const combinedRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        setNodeRef(node);
        if (typeof forwardedRef === 'function') {
          forwardedRef(node);
        } else if (forwardedRef) {
          forwardedRef.current = node;
        }
      },
      [setNodeRef, forwardedRef]
    );

    const dragHandle = showDragHandle && (
      <DragHandle
        size={size ?? undefined}
        isDragging={isDragging}
        disabled={isDisabled}
        {...attributes}
        {...listeners}
      />
    );

    return (
      <div
        ref={combinedRef}
        role="listitem"
        style={style}
        className={cn(
          sortableItemVariants({ variant, size, isDragging }),
          className
        )}
        data-dragging={isDragging}
        {...props}
      >
        {dragHandlePosition === 'start' && dragHandle}
        {children}
        {dragHandlePosition === 'end' && dragHandle}
      </div>
    );
  }
);
SortableItem.displayName = 'SortableItem';

/**
 * SortableItemContent Component
 *
 * Container for the main content of a sortable item.
 */
const SortableItemContent = React.forwardRef<
  HTMLDivElement,
  SortableItemContentProps
>(({ className, layout, alignment, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        sortableItemContentVariants({ layout, alignment }),
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
SortableItemContent.displayName = 'SortableItemContent';

/**
 * SortableItemActions Component
 *
 * Container for action buttons (delete, edit, etc.) in a sortable item.
 */
const SortableItemActions = React.forwardRef<
  HTMLDivElement,
  SortableItemActionsProps
>(({ className, position, size, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(sortableItemActionsVariants({ position, size }), className)}
      {...props}
    >
      {children}
    </div>
  );
});
SortableItemActions.displayName = 'SortableItemActions';

/**
 * DragHandle Component
 *
 * The draggable handle for a sortable item.
 */
const DragHandle = React.forwardRef<HTMLButtonElement, DragHandleProps>(
  (
    {
      className,
      size,
      isDragging,
      disabled,
      'aria-label': ariaLabel = 'Drag to reorder',
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type="button"
        aria-label={ariaLabel}
        aria-disabled={disabled}
        className={cn(
          dragHandleVariants({ size, isDragging, disabled }),
          className
        )}
        {...props}
      >
        <GripVertical className="h-4 w-4" aria-hidden="true" />
      </button>
    );
  }
);
DragHandle.displayName = 'DragHandle';

/**
 * SortableEmpty Component
 *
 * Empty state display when the sortable list has no items.
 */
const SortableEmpty = React.forwardRef<HTMLDivElement, SortableEmptyProps>(
  ({ className, size, icon, message, action, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="status"
        aria-live="polite"
        className={cn(sortableEmptyVariants({ size }), className)}
        {...props}
      >
        {icon && <div className="mb-3">{icon}</div>}
        <p className="text-sm font-medium">{message ?? children}</p>
        {action && <div className="mt-4">{action}</div>}
      </div>
    );
  }
);
SortableEmpty.displayName = 'SortableEmpty';

export {
  SortableList,
  SortableItem,
  SortableItemContent,
  SortableItemActions,
  DragHandle,
  SortableEmpty,
};
