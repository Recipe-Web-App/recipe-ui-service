import { act } from '@testing-library/react';
import {
  useViewPreferenceStore,
  useViewMode,
  useSetViewMode,
  useToggleViewMode,
  type ViewMode,
} from '@/stores/ui/view-preference-store';

// Mock zustand persist
jest.mock('zustand/middleware', () => ({
  persist: (fn: any) => fn,
}));

describe('useViewPreferenceStore', () => {
  beforeEach(() => {
    // Reset store state to default
    useViewPreferenceStore.setState({
      viewMode: 'grid',
    });
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = useViewPreferenceStore.getState();

      expect(state.viewMode).toBe('grid');
    });

    it('should provide all required actions', () => {
      const state = useViewPreferenceStore.getState();

      expect(typeof state.setViewMode).toBe('function');
      expect(typeof state.toggleViewMode).toBe('function');
      expect(typeof state.resetViewMode).toBe('function');
    });
  });

  describe('setViewMode', () => {
    it('should set view mode to grid', () => {
      act(() => {
        useViewPreferenceStore.getState().setViewMode('grid');
      });

      const state = useViewPreferenceStore.getState();
      expect(state.viewMode).toBe('grid');
    });

    it('should set view mode to list', () => {
      act(() => {
        useViewPreferenceStore.getState().setViewMode('list');
      });

      const state = useViewPreferenceStore.getState();
      expect(state.viewMode).toBe('list');
    });

    it('should update from grid to list', () => {
      // Start with grid
      act(() => {
        useViewPreferenceStore.getState().setViewMode('grid');
      });

      expect(useViewPreferenceStore.getState().viewMode).toBe('grid');

      // Switch to list
      act(() => {
        useViewPreferenceStore.getState().setViewMode('list');
      });

      expect(useViewPreferenceStore.getState().viewMode).toBe('list');
    });

    it('should update from list to grid', () => {
      // Start with list
      act(() => {
        useViewPreferenceStore.getState().setViewMode('list');
      });

      expect(useViewPreferenceStore.getState().viewMode).toBe('list');

      // Switch to grid
      act(() => {
        useViewPreferenceStore.getState().setViewMode('grid');
      });

      expect(useViewPreferenceStore.getState().viewMode).toBe('grid');
    });
  });

  describe('toggleViewMode', () => {
    it('should toggle from grid to list', () => {
      // Set initial state to grid
      act(() => {
        useViewPreferenceStore.getState().setViewMode('grid');
      });

      expect(useViewPreferenceStore.getState().viewMode).toBe('grid');

      // Toggle
      act(() => {
        useViewPreferenceStore.getState().toggleViewMode();
      });

      expect(useViewPreferenceStore.getState().viewMode).toBe('list');
    });

    it('should toggle from list to grid', () => {
      // Set initial state to list
      act(() => {
        useViewPreferenceStore.getState().setViewMode('list');
      });

      expect(useViewPreferenceStore.getState().viewMode).toBe('list');

      // Toggle
      act(() => {
        useViewPreferenceStore.getState().toggleViewMode();
      });

      expect(useViewPreferenceStore.getState().viewMode).toBe('grid');
    });

    it('should toggle back and forth multiple times', () => {
      // Start with grid
      act(() => {
        useViewPreferenceStore.getState().setViewMode('grid');
      });

      expect(useViewPreferenceStore.getState().viewMode).toBe('grid');

      // Toggle to list
      act(() => {
        useViewPreferenceStore.getState().toggleViewMode();
      });

      expect(useViewPreferenceStore.getState().viewMode).toBe('list');

      // Toggle back to grid
      act(() => {
        useViewPreferenceStore.getState().toggleViewMode();
      });

      expect(useViewPreferenceStore.getState().viewMode).toBe('grid');

      // Toggle to list again
      act(() => {
        useViewPreferenceStore.getState().toggleViewMode();
      });

      expect(useViewPreferenceStore.getState().viewMode).toBe('list');
    });
  });

  describe('resetViewMode', () => {
    it('should reset view mode to default (grid)', () => {
      // Set to list
      act(() => {
        useViewPreferenceStore.getState().setViewMode('list');
      });

      expect(useViewPreferenceStore.getState().viewMode).toBe('list');

      // Reset
      act(() => {
        useViewPreferenceStore.getState().resetViewMode();
      });

      expect(useViewPreferenceStore.getState().viewMode).toBe('grid');
    });

    it('should have no effect if already at default', () => {
      // Already at default (grid)
      act(() => {
        useViewPreferenceStore.getState().setViewMode('grid');
      });

      expect(useViewPreferenceStore.getState().viewMode).toBe('grid');

      // Reset
      act(() => {
        useViewPreferenceStore.getState().resetViewMode();
      });

      expect(useViewPreferenceStore.getState().viewMode).toBe('grid');
    });
  });

  describe('convenience hooks', () => {
    it('should export convenience hook functions', () => {
      // These are just re-exports of store selectors
      // Testing them requires React context which is tested in component tests
      expect(typeof useViewMode).toBe('function');
      expect(typeof useSetViewMode).toBe('function');
      expect(typeof useToggleViewMode).toBe('function');
    });
  });

  describe('integration scenarios', () => {
    it('should handle complete workflow: set, toggle, reset', () => {
      // Start with default
      expect(useViewPreferenceStore.getState().viewMode).toBe('grid');

      // Set to list
      act(() => {
        useViewPreferenceStore.getState().setViewMode('list');
      });

      expect(useViewPreferenceStore.getState().viewMode).toBe('list');

      // Toggle back to grid
      act(() => {
        useViewPreferenceStore.getState().toggleViewMode();
      });

      expect(useViewPreferenceStore.getState().viewMode).toBe('grid');

      // Set to list again
      act(() => {
        useViewPreferenceStore.getState().setViewMode('list');
      });

      expect(useViewPreferenceStore.getState().viewMode).toBe('list');

      // Reset to default
      act(() => {
        useViewPreferenceStore.getState().resetViewMode();
      });

      expect(useViewPreferenceStore.getState().viewMode).toBe('grid');
    });

    it('should handle rapid mode changes', () => {
      const modes: ViewMode[] = ['grid', 'list', 'grid', 'list', 'grid'];

      modes.forEach(mode => {
        act(() => {
          useViewPreferenceStore.getState().setViewMode(mode);
        });

        expect(useViewPreferenceStore.getState().viewMode).toBe(mode);
      });
    });

    it('should handle multiple toggles in sequence', () => {
      // Start with grid
      act(() => {
        useViewPreferenceStore.getState().setViewMode('grid');
      });

      const expectedModes: ViewMode[] = [
        'list',
        'grid',
        'list',
        'grid',
        'list',
      ];

      expectedModes.forEach(expectedMode => {
        act(() => {
          useViewPreferenceStore.getState().toggleViewMode();
        });

        expect(useViewPreferenceStore.getState().viewMode).toBe(expectedMode);
      });
    });

    it('should maintain state across multiple store accesses', () => {
      // Set mode
      act(() => {
        useViewPreferenceStore.getState().setViewMode('list');
      });

      // Access state multiple times
      const state1 = useViewPreferenceStore.getState();
      const state2 = useViewPreferenceStore.getState();
      const state3 = useViewPreferenceStore.getState();

      expect(state1.viewMode).toBe('list');
      expect(state2.viewMode).toBe('list');
      expect(state3.viewMode).toBe('list');
    });
  });

  describe('persistence configuration', () => {
    it('should configure persistence with correct name', () => {
      // This test verifies the store is configured with persist
      // The actual localStorage persistence is mocked, so we just
      // verify the store structure is correct
      const state = useViewPreferenceStore.getState();

      expect(state.viewMode).toBeDefined();
      expect(typeof state.setViewMode).toBe('function');
      expect(typeof state.toggleViewMode).toBe('function');
      expect(typeof state.resetViewMode).toBe('function');
    });

    it('should include viewMode in persisted state', () => {
      // Set a value
      act(() => {
        useViewPreferenceStore.getState().setViewMode('list');
      });

      const state = useViewPreferenceStore.getState();

      // Verify viewMode is in state (would be persisted)
      expect(state.viewMode).toBe('list');
    });

    it('should maintain state structure after updates', () => {
      // Perform multiple updates
      act(() => {
        useViewPreferenceStore.getState().setViewMode('list');
        useViewPreferenceStore.getState().toggleViewMode();
        useViewPreferenceStore.getState().setViewMode('list');
        useViewPreferenceStore.getState().resetViewMode();
      });

      const state = useViewPreferenceStore.getState();

      // State should still have correct structure
      expect(state.viewMode).toBe('grid');
      expect(typeof state.setViewMode).toBe('function');
      expect(typeof state.toggleViewMode).toBe('function');
      expect(typeof state.resetViewMode).toBe('function');
    });
  });

  describe('type safety', () => {
    it('should only accept valid ViewMode values for setViewMode', () => {
      // Valid values
      act(() => {
        useViewPreferenceStore.getState().setViewMode('grid');
      });

      expect(useViewPreferenceStore.getState().viewMode).toBe('grid');

      act(() => {
        useViewPreferenceStore.getState().setViewMode('list');
      });

      expect(useViewPreferenceStore.getState().viewMode).toBe('list');

      // TypeScript would prevent invalid values at compile time
      // This test just verifies the valid values work correctly
    });

    it('should maintain ViewMode type throughout operations', () => {
      let currentMode: ViewMode;

      act(() => {
        useViewPreferenceStore.getState().setViewMode('grid');
      });

      currentMode = useViewPreferenceStore.getState().viewMode;
      expect(currentMode).toBe('grid');

      act(() => {
        useViewPreferenceStore.getState().toggleViewMode();
      });

      currentMode = useViewPreferenceStore.getState().viewMode;
      expect(currentMode).toBe('list');
    });
  });

  describe('edge cases', () => {
    it('should handle setting the same mode multiple times', () => {
      act(() => {
        useViewPreferenceStore.getState().setViewMode('grid');
        useViewPreferenceStore.getState().setViewMode('grid');
        useViewPreferenceStore.getState().setViewMode('grid');
      });

      expect(useViewPreferenceStore.getState().viewMode).toBe('grid');
    });

    it('should handle reset when already at default', () => {
      act(() => {
        useViewPreferenceStore.getState().resetViewMode();
        useViewPreferenceStore.getState().resetViewMode();
      });

      expect(useViewPreferenceStore.getState().viewMode).toBe('grid');
    });

    it('should handle mixed operations', () => {
      act(() => {
        useViewPreferenceStore.getState().setViewMode('list');
        useViewPreferenceStore.getState().toggleViewMode(); // -> grid
        useViewPreferenceStore.getState().setViewMode('list');
        useViewPreferenceStore.getState().resetViewMode(); // -> grid
        useViewPreferenceStore.getState().toggleViewMode(); // -> list
      });

      expect(useViewPreferenceStore.getState().viewMode).toBe('list');
    });
  });
});
