import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  InteractionStoreState,
  RecentItem,
  DragState,
} from '@/types/ui/interaction';

const MAX_RECENT_ITEMS_DEFAULT = 50;

export const useInteractionStore = create<InteractionStoreState>()(
  persist(
    (set, get) => ({
      recentlyViewed: [],
      selectedItems: [],
      expandedItems: [],
      activeTab: {},
      hoverState: null,
      dragState: null,
      lastInteraction: Date.now(),
      maxRecentItems: MAX_RECENT_ITEMS_DEFAULT,

      addToRecentlyViewed: (item: Omit<RecentItem, 'timestamp'>) => {
        const timestamp = Date.now();
        const newItem: RecentItem = { ...item, timestamp };

        set(state => {
          // Remove item if it already exists
          let newRecentlyViewed = state.recentlyViewed.filter(
            existing => existing.id !== item.id
          );

          // Add to the beginning
          newRecentlyViewed.unshift(newItem);

          // Limit to max items
          if (newRecentlyViewed.length > state.maxRecentItems) {
            newRecentlyViewed = newRecentlyViewed.slice(
              0,
              state.maxRecentItems
            );
          }

          return { recentlyViewed: newRecentlyViewed };
        });

        get().updateLastInteraction();
      },

      removeFromRecentlyViewed: (id: string) => {
        set(state => ({
          recentlyViewed: state.recentlyViewed.filter(item => item.id !== id),
        }));
      },

      clearRecentlyViewed: () => {
        set({ recentlyViewed: [] });
      },

      selectItem: (id: string) => {
        set(state => ({
          selectedItems: state.selectedItems.includes(id)
            ? state.selectedItems
            : [...state.selectedItems, id],
        }));
        get().updateLastInteraction();
      },

      deselectItem: (id: string) => {
        set(state => ({
          selectedItems: state.selectedItems.filter(item => item !== id),
        }));
        get().updateLastInteraction();
      },

      toggleSelection: (id: string) => {
        const isSelected = get().selectedItems.includes(id);
        if (isSelected) {
          get().deselectItem(id);
        } else {
          get().selectItem(id);
        }
      },

      selectAll: (ids: string[]) => {
        set({ selectedItems: [...ids] });
        get().updateLastInteraction();
      },

      clearSelection: () => {
        set({ selectedItems: [] });
        get().updateLastInteraction();
      },

      selectRange: (startId: string, endId: string, allIds: string[]) => {
        const startIndex = allIds.indexOf(startId);
        const endIndex = allIds.indexOf(endId);

        if (startIndex === -1 || endIndex === -1) return;

        const minIndex = Math.min(startIndex, endIndex);
        const maxIndex = Math.max(startIndex, endIndex);
        const rangeIds = allIds.slice(minIndex, maxIndex + 1);

        set(state => ({
          selectedItems: [...new Set([...state.selectedItems, ...rangeIds])],
        }));
        get().updateLastInteraction();
      },

      expandItem: (id: string) => {
        set(state => ({
          expandedItems: state.expandedItems.includes(id)
            ? state.expandedItems
            : [...state.expandedItems, id],
        }));
        get().updateLastInteraction();
      },

      collapseItem: (id: string) => {
        set(state => ({
          expandedItems: state.expandedItems.filter(item => item !== id),
        }));
        get().updateLastInteraction();
      },

      toggleExpansion: (id: string) => {
        const isExpanded = get().expandedItems.includes(id);
        if (isExpanded) {
          get().collapseItem(id);
        } else {
          get().expandItem(id);
        }
      },

      expandAll: (ids: string[]) => {
        set(state => ({
          expandedItems: [...new Set([...state.expandedItems, ...ids])],
        }));
        get().updateLastInteraction();
      },

      collapseAll: () => {
        set({ expandedItems: [] });
        get().updateLastInteraction();
      },

      setActiveTab: (containerId: string, tabId: string) => {
        set(state => ({
          activeTab: { ...state.activeTab, [containerId]: tabId },
        }));
        get().updateLastInteraction();
      },

      getActiveTab: (containerId: string) => {
        // eslint-disable-next-line security/detect-object-injection
        return get().activeTab[containerId];
      },

      setHoverState: (id: string | null) => {
        set({ hoverState: id });
        if (id) {
          get().updateLastInteraction();
        }
      },

      clearHoverState: () => {
        set({ hoverState: null });
      },

      setDragState: (state: DragState | null) => {
        set({ dragState: state });
        if (state) {
          get().updateLastInteraction();
        }
      },

      startDrag: (itemId: string, itemType: string) => {
        const dragState: DragState = {
          isDragging: true,
          draggedItemId: itemId,
          draggedItemType: itemType,
          dropTargetId: undefined,
          dropEffect: 'none',
        };
        get().setDragState(dragState);
      },

      updateDragTarget: (
        targetId: string | undefined,
        dropEffect: DragState['dropEffect'] = 'none'
      ) => {
        set(state => ({
          dragState: state.dragState
            ? {
                ...state.dragState,
                dropTargetId: targetId,
                dropEffect,
              }
            : null,
        }));
      },

      endDrag: () => {
        set({ dragState: null });
      },

      updateLastInteraction: () => {
        set({ lastInteraction: Date.now() });
      },

      setMaxRecentItems: (max: number) => {
        set(state => {
          const newRecentlyViewed = state.recentlyViewed.slice(0, max);
          return { maxRecentItems: max, recentlyViewed: newRecentlyViewed };
        });
      },

      isItemSelected: (id: string) => {
        return get().selectedItems.includes(id);
      },

      isItemExpanded: (id: string) => {
        return get().expandedItems.includes(id);
      },

      getSelectedCount: () => {
        return get().selectedItems.length;
      },

      getRecentItem: (id: string) => {
        return get().recentlyViewed.find(item => item.id === id);
      },

      isDragging: () => {
        return get().dragState?.isDragging ?? false;
      },
    }),
    {
      name: 'interaction-storage',
      partialize: state => ({
        recentlyViewed: state.recentlyViewed.slice(0, 20), // Limit persisted recent items
        expandedItems: state.expandedItems,
        activeTab: state.activeTab,
        maxRecentItems: state.maxRecentItems,
      }),
    }
  )
);
