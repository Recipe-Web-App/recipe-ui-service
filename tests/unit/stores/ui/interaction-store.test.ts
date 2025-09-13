import { act } from '@testing-library/react';
import { useInteractionStore } from '@/stores/ui/interaction-store';

// Mock zustand persist
jest.mock('zustand/middleware', () => ({
  persist: (fn: any) => fn,
}));

describe('useInteractionStore', () => {
  beforeEach(() => {
    // Reset store state
    useInteractionStore.setState({
      recentlyViewed: [],
      selectedItems: [],
      expandedItems: [],
      activeTab: {},
      hoverState: null,
      dragState: null,
      lastInteraction: Date.now(),
      maxRecentItems: 50,
    });
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = useInteractionStore.getState();

      expect(state.recentlyViewed).toEqual([]);
      expect(state.selectedItems).toEqual([]);
      expect(state.expandedItems).toEqual([]);
      expect(state.activeTab).toEqual({});
      expect(state.hoverState).toBeNull();
      expect(state.dragState).toBeNull();
      expect(state.maxRecentItems).toBe(50);
      expect(typeof state.lastInteraction).toBe('number');
    });
  });

  describe('recently viewed items', () => {
    it('should add item to recently viewed', () => {
      const mockItem = {
        id: 'item-1',
        title: 'Test Item',
        type: 'recipe',
        href: '/recipes/item-1',
      };

      act(() => {
        useInteractionStore.getState().addToRecentlyViewed(mockItem);
      });

      const state = useInteractionStore.getState();
      expect(state.recentlyViewed).toHaveLength(1);
      expect(state.recentlyViewed[0]).toMatchObject(mockItem);
      expect(state.recentlyViewed[0].timestamp).toBeGreaterThan(0);
    });

    it('should remove item from recently viewed', () => {
      const mockItem = {
        id: 'item-1',
        title: 'Test Item',
        type: 'recipe',
        href: '/recipes/item-1',
      };

      act(() => {
        useInteractionStore.getState().addToRecentlyViewed(mockItem);
      });

      act(() => {
        useInteractionStore.getState().removeFromRecentlyViewed('item-1');
      });

      expect(useInteractionStore.getState().recentlyViewed).toHaveLength(0);
    });

    it('should clear all recently viewed', () => {
      const mockItem = {
        id: 'item-1',
        title: 'Test Item',
        type: 'recipe',
        href: '/recipes/item-1',
      };

      act(() => {
        useInteractionStore.getState().addToRecentlyViewed(mockItem);
      });

      act(() => {
        useInteractionStore.getState().clearRecentlyViewed();
      });

      expect(useInteractionStore.getState().recentlyViewed).toEqual([]);
    });
  });

  describe('item selection', () => {
    it('should select an item', () => {
      act(() => {
        useInteractionStore.getState().selectItem('item-1');
      });

      expect(useInteractionStore.getState().selectedItems).toContain('item-1');
    });

    it('should not select an item twice', () => {
      act(() => {
        useInteractionStore.getState().selectItem('item-1');
        useInteractionStore.getState().selectItem('item-1');
      });

      expect(useInteractionStore.getState().selectedItems).toEqual(['item-1']);
    });

    it('should deselect an item', () => {
      act(() => {
        useInteractionStore.getState().selectItem('item-1');
      });

      act(() => {
        useInteractionStore.getState().deselectItem('item-1');
      });

      expect(useInteractionStore.getState().selectedItems).not.toContain(
        'item-1'
      );
    });

    it('should toggle selection', () => {
      act(() => {
        useInteractionStore.getState().toggleSelection('item-1');
      });

      expect(useInteractionStore.getState().selectedItems).toContain('item-1');

      act(() => {
        useInteractionStore.getState().toggleSelection('item-1');
      });

      expect(useInteractionStore.getState().selectedItems).not.toContain(
        'item-1'
      );
    });

    it('should select all items', () => {
      const ids = ['item-1', 'item-2', 'item-3'];

      act(() => {
        useInteractionStore.getState().selectAll(ids);
      });

      expect(useInteractionStore.getState().selectedItems).toEqual(ids);
    });

    it('should clear selection', () => {
      act(() => {
        useInteractionStore.getState().selectAll(['item-1', 'item-2']);
        useInteractionStore.getState().clearSelection();
      });

      expect(useInteractionStore.getState().selectedItems).toEqual([]);
    });

    it('should select range', () => {
      const allIds = ['item-1', 'item-2', 'item-3', 'item-4', 'item-5'];

      act(() => {
        useInteractionStore.getState().selectRange('item-2', 'item-4', allIds);
      });

      const selectedItems = useInteractionStore.getState().selectedItems;
      expect(selectedItems).toContain('item-2');
      expect(selectedItems).toContain('item-3');
      expect(selectedItems).toContain('item-4');
    });

    it('should handle invalid range selection', () => {
      const allIds = ['item-1', 'item-2', 'item-3'];

      act(() => {
        useInteractionStore.getState().selectRange('invalid', 'item-2', allIds);
      });

      expect(useInteractionStore.getState().selectedItems).toEqual([]);
    });

    it('should select range with existing selections', () => {
      const allIds = ['item-1', 'item-2', 'item-3', 'item-4'];

      act(() => {
        useInteractionStore.getState().selectItem('item-1');
        useInteractionStore.getState().selectRange('item-3', 'item-4', allIds);
      });

      const selectedItems = useInteractionStore.getState().selectedItems;
      expect(selectedItems).toContain('item-1');
      expect(selectedItems).toContain('item-3');
      expect(selectedItems).toContain('item-4');
    });
  });

  describe('item expansion', () => {
    it('should expand an item', () => {
      act(() => {
        useInteractionStore.getState().expandItem('item-1');
      });

      expect(useInteractionStore.getState().expandedItems).toContain('item-1');
    });

    it('should not expand an item twice', () => {
      act(() => {
        useInteractionStore.getState().expandItem('item-1');
        useInteractionStore.getState().expandItem('item-1');
      });

      expect(useInteractionStore.getState().expandedItems).toEqual(['item-1']);
    });

    it('should collapse an item', () => {
      act(() => {
        useInteractionStore.getState().expandItem('item-1');
        useInteractionStore.getState().collapseItem('item-1');
      });

      expect(useInteractionStore.getState().expandedItems).not.toContain(
        'item-1'
      );
    });

    it('should toggle expansion', () => {
      act(() => {
        useInteractionStore.getState().toggleExpansion('item-1');
      });

      expect(useInteractionStore.getState().expandedItems).toContain('item-1');

      act(() => {
        useInteractionStore.getState().toggleExpansion('item-1');
      });

      expect(useInteractionStore.getState().expandedItems).not.toContain(
        'item-1'
      );
    });

    it('should expand all items', () => {
      const ids = ['item-1', 'item-2', 'item-3'];

      act(() => {
        useInteractionStore.getState().expandAll(ids);
      });

      ids.forEach(id => {
        expect(useInteractionStore.getState().expandedItems).toContain(id);
      });
    });

    it('should expand all with existing expanded items', () => {
      act(() => {
        useInteractionStore.getState().expandItem('item-1');
        useInteractionStore.getState().expandAll(['item-2', 'item-3']);
      });

      const expandedItems = useInteractionStore.getState().expandedItems;
      expect(expandedItems).toContain('item-1');
      expect(expandedItems).toContain('item-2');
      expect(expandedItems).toContain('item-3');
    });

    it('should collapse all items', () => {
      act(() => {
        useInteractionStore.getState().expandAll(['item-1', 'item-2']);
        useInteractionStore.getState().collapseAll();
      });

      expect(useInteractionStore.getState().expandedItems).toEqual([]);
    });
  });

  describe('tab management', () => {
    it('should set active tab', () => {
      act(() => {
        useInteractionStore.getState().setActiveTab('container-1', 'tab-1');
      });

      expect(useInteractionStore.getState().activeTab['container-1']).toBe(
        'tab-1'
      );
    });

    it('should get active tab', () => {
      act(() => {
        useInteractionStore.getState().setActiveTab('container-1', 'tab-1');
      });

      expect(useInteractionStore.getState().getActiveTab('container-1')).toBe(
        'tab-1'
      );
    });

    it('should return undefined for non-existent container', () => {
      expect(
        useInteractionStore.getState().getActiveTab('non-existent')
      ).toBeUndefined();
    });
  });

  describe('hover state', () => {
    it('should set hover state', () => {
      act(() => {
        useInteractionStore.getState().setHoverState('item-1');
      });

      expect(useInteractionStore.getState().hoverState).toBe('item-1');
    });

    it('should clear hover state', () => {
      act(() => {
        useInteractionStore.getState().setHoverState('item-1');
        useInteractionStore.getState().clearHoverState();
      });

      expect(useInteractionStore.getState().hoverState).toBeNull();
    });

    it('should not update interaction when clearing hover', () => {
      const initialTime = useInteractionStore.getState().lastInteraction;

      act(() => {
        useInteractionStore.getState().setHoverState(null);
      });

      expect(useInteractionStore.getState().lastInteraction).toBe(initialTime);
    });
  });

  describe('drag state', () => {
    it('should start drag', () => {
      act(() => {
        useInteractionStore.getState().startDrag('item-1', 'recipe');
      });

      const dragState = useInteractionStore.getState().dragState;
      expect(dragState?.isDragging).toBe(true);
      expect(dragState?.draggedItemId).toBe('item-1');
      expect(dragState?.draggedItemType).toBe('recipe');
    });

    it('should update drag target', () => {
      act(() => {
        useInteractionStore.getState().startDrag('item-1', 'recipe');
        useInteractionStore.getState().updateDragTarget('target-1', 'move');
      });

      const dragState = useInteractionStore.getState().dragState;
      expect(dragState?.dropTargetId).toBe('target-1');
      expect(dragState?.dropEffect).toBe('move');
    });

    it('should handle update drag target with no drag state', () => {
      act(() => {
        useInteractionStore.getState().updateDragTarget('target-1', 'move');
      });

      expect(useInteractionStore.getState().dragState).toBeNull();
    });

    it('should end drag', () => {
      act(() => {
        useInteractionStore.getState().startDrag('item-1', 'recipe');
        useInteractionStore.getState().endDrag();
      });

      expect(useInteractionStore.getState().dragState).toBeNull();
    });

    it('should set drag state directly', () => {
      const dragState = {
        isDragging: true,
        draggedItemId: 'item-1',
        draggedItemType: 'recipe',
        dropTargetId: 'target-1',
        dropEffect: 'copy' as const,
      };

      act(() => {
        useInteractionStore.getState().setDragState(dragState);
      });

      expect(useInteractionStore.getState().dragState).toEqual(dragState);
    });

    it('should not update interaction when setting null drag state', () => {
      const initialTime = useInteractionStore.getState().lastInteraction;

      act(() => {
        useInteractionStore.getState().setDragState(null);
      });

      expect(useInteractionStore.getState().lastInteraction).toBe(initialTime);
    });
  });

  describe('utility methods', () => {
    beforeEach(() => {
      act(() => {
        useInteractionStore.getState().selectAll(['item-1', 'item-2']);
        useInteractionStore.getState().expandAll(['item-1', 'item-3']);
        useInteractionStore.getState().addToRecentlyViewed({
          id: 'recent-1',
          title: 'Recent Item',
          type: 'recipe',
          href: '/recipes/recent-1',
        });
      });
    });

    it('should check if item is selected', () => {
      expect(useInteractionStore.getState().isItemSelected('item-1')).toBe(
        true
      );
      expect(useInteractionStore.getState().isItemSelected('item-3')).toBe(
        false
      );
    });

    it('should check if item is expanded', () => {
      expect(useInteractionStore.getState().isItemExpanded('item-1')).toBe(
        true
      );
      expect(useInteractionStore.getState().isItemExpanded('item-2')).toBe(
        false
      );
    });

    it('should get selected count', () => {
      expect(useInteractionStore.getState().getSelectedCount()).toBe(2);
    });

    it('should get recent item', () => {
      const recentItem = useInteractionStore
        .getState()
        .getRecentItem('recent-1');
      expect(recentItem).toBeDefined();
      expect(recentItem?.title).toBe('Recent Item');
    });

    it('should return undefined for non-existent recent item', () => {
      expect(
        useInteractionStore.getState().getRecentItem('non-existent')
      ).toBeUndefined();
    });

    it('should check if dragging', () => {
      expect(useInteractionStore.getState().isDragging()).toBe(false);

      act(() => {
        useInteractionStore.getState().startDrag('item-1', 'recipe');
      });

      expect(useInteractionStore.getState().isDragging()).toBe(true);
    });
  });

  describe('max recent items', () => {
    it('should set max recent items', () => {
      act(() => {
        useInteractionStore.getState().setMaxRecentItems(10);
      });

      expect(useInteractionStore.getState().maxRecentItems).toBe(10);
    });

    it('should trim recent items when reducing max', () => {
      // Add multiple items
      for (let i = 1; i <= 5; i++) {
        act(() => {
          useInteractionStore.getState().addToRecentlyViewed({
            id: `item-${i}`,
            title: `Item ${i}`,
            type: 'recipe',
            href: `/recipes/item-${i}`,
          });
        });
      }

      act(() => {
        useInteractionStore.getState().setMaxRecentItems(3);
      });

      expect(useInteractionStore.getState().recentlyViewed).toHaveLength(3);
      expect(useInteractionStore.getState().maxRecentItems).toBe(3);
    });
  });
});
