// Interaction Types
export interface RecentItem {
  id: string;
  type: string;
  title: string;
  href?: string;
  thumbnail?: string;
  timestamp: number;
}

export interface DragState {
  isDragging: boolean;
  draggedItemId?: string;
  draggedItemType?: string;
  dropTargetId?: string;
  dropEffect?: 'none' | 'copy' | 'move' | 'link';
}

export interface InteractionState {
  recentlyViewed: RecentItem[];
  selectedItems: string[];
  expandedItems: string[];
  activeTab: Record<string, string>;
  hoverState: string | null;
  dragState: DragState | null;
  lastInteraction: number;
  maxRecentItems: number;
}

// Store interface with all actions
export interface InteractionStoreState extends InteractionState {
  // Recently viewed actions
  addToRecentlyViewed: (item: Omit<RecentItem, 'timestamp'>) => void;
  removeFromRecentlyViewed: (id: string) => void;
  clearRecentlyViewed: () => void;

  // Selection actions
  selectItem: (id: string) => void;
  deselectItem: (id: string) => void;
  toggleSelection: (id: string) => void;
  selectAll: (ids: string[]) => void;
  clearSelection: () => void;
  selectRange: (startId: string, endId: string, allIds: string[]) => void;

  // Expansion actions
  expandItem: (id: string) => void;
  collapseItem: (id: string) => void;
  toggleExpansion: (id: string) => void;
  expandAll: (ids: string[]) => void;
  collapseAll: () => void;

  // Tab actions
  setActiveTab: (containerId: string, tabId: string) => void;
  getActiveTab: (containerId: string) => string | undefined;

  // Hover actions
  setHoverState: (id: string | null) => void;
  clearHoverState: () => void;

  // Drag actions
  setDragState: (state: DragState | null) => void;
  startDrag: (itemId: string, itemType: string) => void;
  updateDragTarget: (
    targetId: string | undefined,
    dropEffect?: DragState['dropEffect']
  ) => void;
  endDrag: () => void;

  // Interaction tracking
  updateLastInteraction: () => void;
  setMaxRecentItems: (max: number) => void;

  // Utility methods
  isItemSelected: (id: string) => boolean;
  isItemExpanded: (id: string) => boolean;
  getSelectedCount: () => number;
  getRecentItem: (id: string) => RecentItem | undefined;
  isDragging: () => boolean;
}
