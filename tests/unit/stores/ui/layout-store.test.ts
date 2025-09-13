import { act } from '@testing-library/react';
import { useLayoutStore } from '@/stores/ui/layout-store';
import type { ViewMode, LayoutDensity, ColumnConfig } from '@/types/ui/layout';

// Mock zustand persist
jest.mock('zustand/middleware', () => ({
  persist: (fn: any) => fn,
}));

describe('useLayoutStore', () => {
  beforeEach(() => {
    // Reset store state
    useLayoutStore.setState({
      viewMode: 'grid',
      pagination: {
        page: 1,
        pageSize: 10,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      },
      layoutConfig: {
        viewMode: 'grid',
        density: 'comfortable',
        columns: 3,
        spacing: 16,
        showHeaders: true,
      },
      tableColumns: [],
      panelSizes: {},
      collapsedPanels: [],
    });
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = useLayoutStore.getState();

      expect(state.viewMode).toBe('grid');
      expect(state.pagination).toEqual({
        page: 1,
        pageSize: 10,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      });
      expect(state.layoutConfig).toEqual({
        viewMode: 'grid',
        density: 'comfortable',
        columns: 3,
        spacing: 16,
        showHeaders: true,
      });
      expect(state.tableColumns).toEqual([]);
      expect(state.panelSizes).toEqual({});
      expect(state.collapsedPanels).toEqual([]);
    });
  });

  describe('view mode', () => {
    it('should set view mode', () => {
      act(() => {
        useLayoutStore.getState().setViewMode('list');
      });

      const state = useLayoutStore.getState();
      expect(state.viewMode).toBe('list');
      expect(state.layoutConfig.viewMode).toBe('list');
    });

    it('should toggle view mode', () => {
      act(() => {
        useLayoutStore.getState().toggleViewMode();
      });

      expect(useLayoutStore.getState().viewMode).toBe('list');

      act(() => {
        useLayoutStore.getState().toggleViewMode();
      });

      expect(useLayoutStore.getState().viewMode).toBe('card');

      act(() => {
        useLayoutStore.getState().toggleViewMode();
      });

      expect(useLayoutStore.getState().viewMode).toBe('table');

      act(() => {
        useLayoutStore.getState().toggleViewMode();
      });

      expect(useLayoutStore.getState().viewMode).toBe('grid');
    });
  });

  describe('pagination', () => {
    it('should set pagination', () => {
      act(() => {
        useLayoutStore.getState().setPagination({
          page: 2,
          pageSize: 20,
          total: 100,
        });
      });

      const state = useLayoutStore.getState();
      expect(state.pagination.page).toBe(2);
      expect(state.pagination.pageSize).toBe(20);
      expect(state.pagination.total).toBe(100);
      expect(state.pagination.totalPages).toBe(5);
      expect(state.pagination.hasNext).toBe(true);
      expect(state.pagination.hasPrev).toBe(true);
    });

    it('should set page', () => {
      act(() => {
        useLayoutStore.getState().setPagination({ total: 100, pageSize: 10 });
      });

      act(() => {
        useLayoutStore.getState().setPage(3);
      });

      expect(useLayoutStore.getState().pagination.page).toBe(3);
    });

    it('should set page size and reset to first page', () => {
      act(() => {
        useLayoutStore.getState().setPagination({ page: 5, total: 100 });
      });

      act(() => {
        useLayoutStore.getState().setPageSize(25);
      });

      const state = useLayoutStore.getState();
      expect(state.pagination.pageSize).toBe(25);
      expect(state.pagination.page).toBe(1);
    });

    it('should navigate to next page', () => {
      act(() => {
        useLayoutStore.getState().setPagination({
          page: 1,
          pageSize: 10,
          total: 100,
        });
      });

      act(() => {
        useLayoutStore.getState().nextPage();
      });

      expect(useLayoutStore.getState().pagination.page).toBe(2);
    });

    it('should not navigate to next page if no next page', () => {
      act(() => {
        useLayoutStore.getState().setPagination({
          page: 10,
          pageSize: 10,
          total: 100,
        });
      });

      act(() => {
        useLayoutStore.getState().nextPage();
      });

      expect(useLayoutStore.getState().pagination.page).toBe(10);
    });

    it('should navigate to previous page', () => {
      act(() => {
        useLayoutStore.getState().setPagination({
          page: 3,
          pageSize: 10,
          total: 100,
        });
      });

      act(() => {
        useLayoutStore.getState().previousPage();
      });

      expect(useLayoutStore.getState().pagination.page).toBe(2);
    });

    it('should not navigate to previous page if on first page', () => {
      act(() => {
        useLayoutStore.getState().setPagination({
          page: 1,
          pageSize: 10,
          total: 100,
        });
      });

      act(() => {
        useLayoutStore.getState().previousPage();
      });

      expect(useLayoutStore.getState().pagination.page).toBe(1);
    });

    it('should go to first page', () => {
      act(() => {
        useLayoutStore.getState().setPagination({
          page: 5,
          pageSize: 10,
          total: 100,
        });
      });

      act(() => {
        useLayoutStore.getState().goToFirstPage();
      });

      expect(useLayoutStore.getState().pagination.page).toBe(1);
    });

    it('should go to last page', () => {
      act(() => {
        useLayoutStore.getState().setPagination({
          page: 1,
          pageSize: 10,
          total: 100,
        });
      });

      act(() => {
        useLayoutStore.getState().goToLastPage();
      });

      expect(useLayoutStore.getState().pagination.page).toBe(10);
    });

    it('should handle page bounds when total pages change', () => {
      act(() => {
        useLayoutStore.getState().setPagination({
          page: 10,
          pageSize: 10,
          total: 50, // This would make totalPages = 5
        });
      });

      expect(useLayoutStore.getState().pagination.page).toBe(5);
    });

    it('should ensure page is at least 1', () => {
      act(() => {
        useLayoutStore.getState().setPagination({
          page: -1,
          pageSize: 10,
          total: 100,
        });
      });

      expect(useLayoutStore.getState().pagination.page).toBe(1);
    });
  });

  describe('layout configuration', () => {
    it('should set layout config', () => {
      act(() => {
        useLayoutStore.getState().setLayoutConfig({
          density: 'compact',
          columns: 4,
        });
      });

      const config = useLayoutStore.getState().layoutConfig;
      expect(config.density).toBe('compact');
      expect(config.columns).toBe(4);
      expect(config.viewMode).toBe('grid'); // Should preserve other values
    });

    it('should set density', () => {
      act(() => {
        useLayoutStore.getState().setDensity('compact');
      });

      expect(useLayoutStore.getState().layoutConfig.density).toBe('compact');
    });

    it('should set columns', () => {
      act(() => {
        useLayoutStore.getState().setColumns(5);
      });

      expect(useLayoutStore.getState().layoutConfig.columns).toBe(5);
    });

    it('should set spacing', () => {
      act(() => {
        useLayoutStore.getState().setSpacing(24);
      });

      expect(useLayoutStore.getState().layoutConfig.spacing).toBe(24);
    });

    it('should toggle headers', () => {
      expect(useLayoutStore.getState().layoutConfig.showHeaders).toBe(true);

      act(() => {
        useLayoutStore.getState().toggleHeaders();
      });

      expect(useLayoutStore.getState().layoutConfig.showHeaders).toBe(false);

      act(() => {
        useLayoutStore.getState().toggleHeaders();
      });

      expect(useLayoutStore.getState().layoutConfig.showHeaders).toBe(true);
    });
  });

  describe('table columns', () => {
    const mockColumns: ColumnConfig[] = [
      {
        id: 'col1',
        field: 'col1',
        label: 'Column 1',
        visible: true,
        sortable: true,
        order: 0,
      },
      {
        id: 'col2',
        field: 'col2',
        label: 'Column 2',
        visible: true,
        sortable: false,
        order: 1,
      },
      {
        id: 'col3',
        field: 'col3',
        label: 'Column 3',
        visible: false,
        sortable: true,
        order: 2,
      },
    ];

    beforeEach(() => {
      act(() => {
        useLayoutStore.setState({ tableColumns: mockColumns });
      });
    });

    it('should toggle column visibility', () => {
      act(() => {
        useLayoutStore.getState().toggleColumn('col1');
      });

      const columns = useLayoutStore.getState().tableColumns;
      expect(columns.find(col => col.id === 'col1')?.visible).toBe(false);

      act(() => {
        useLayoutStore.getState().toggleColumn('col3');
      });

      const updatedColumns = useLayoutStore.getState().tableColumns;
      expect(updatedColumns.find(col => col.id === 'col3')?.visible).toBe(true);
    });

    it('should reorder columns', () => {
      act(() => {
        useLayoutStore.getState().reorderColumns(['col3', 'col1', 'col2']);
      });

      const columns = useLayoutStore.getState().tableColumns;
      expect(columns[0].id).toBe('col3');
      expect(columns[0].order).toBe(0);
      expect(columns[1].id).toBe('col1');
      expect(columns[1].order).toBe(1);
      expect(columns[2].id).toBe('col2');
      expect(columns[2].order).toBe(2);
    });

    it('should resize column', () => {
      act(() => {
        useLayoutStore.getState().resizeColumn('col1', 200);
      });

      const columns = useLayoutStore.getState().tableColumns;
      expect(columns.find(col => col.id === 'col1')?.width).toBe(200);
    });

    it('should reset columns', () => {
      act(() => {
        useLayoutStore.getState().resizeColumn('col1', 200);
      });

      act(() => {
        useLayoutStore.getState().resetColumns();
      });

      const columns = useLayoutStore.getState().tableColumns;
      columns.forEach(col => {
        expect(col.visible).toBe(true);
        expect(col.width).toBeUndefined();
      });
    });

    it('should show all columns', () => {
      act(() => {
        useLayoutStore.getState().showAllColumns();
      });

      const columns = useLayoutStore.getState().tableColumns;
      columns.forEach(col => {
        expect(col.visible).toBe(true);
      });
    });

    it('should hide all columns', () => {
      act(() => {
        useLayoutStore.getState().hideAllColumns();
      });

      const columns = useLayoutStore.getState().tableColumns;
      columns.forEach(col => {
        expect(col.visible).toBe(false);
      });
    });
  });

  describe('panels', () => {
    it('should set panel size', () => {
      act(() => {
        useLayoutStore.getState().setPanelSize('sidebar', 250);
      });

      expect(useLayoutStore.getState().panelSizes['sidebar']).toBe(250);
    });

    it('should toggle panel', () => {
      act(() => {
        useLayoutStore.getState().togglePanel('sidebar');
      });

      expect(useLayoutStore.getState().collapsedPanels).toContain('sidebar');

      act(() => {
        useLayoutStore.getState().togglePanel('sidebar');
      });

      expect(useLayoutStore.getState().collapsedPanels).not.toContain(
        'sidebar'
      );
    });

    it('should expand panel', () => {
      act(() => {
        useLayoutStore.getState().collapsePanel('sidebar');
      });

      expect(useLayoutStore.getState().collapsedPanels).toContain('sidebar');

      act(() => {
        useLayoutStore.getState().expandPanel('sidebar');
      });

      expect(useLayoutStore.getState().collapsedPanels).not.toContain(
        'sidebar'
      );
    });

    it('should collapse panel', () => {
      act(() => {
        useLayoutStore.getState().collapsePanel('sidebar');
      });

      expect(useLayoutStore.getState().collapsedPanels).toContain('sidebar');
    });

    it('should not duplicate panel in collapsed list', () => {
      act(() => {
        useLayoutStore.getState().collapsePanel('sidebar');
        useLayoutStore.getState().collapsePanel('sidebar');
      });

      const collapsedPanels = useLayoutStore.getState().collapsedPanels;
      expect(collapsedPanels.filter(panel => panel === 'sidebar')).toHaveLength(
        1
      );
    });

    it('should reset panels', () => {
      act(() => {
        useLayoutStore.getState().setPanelSize('sidebar', 250);
        useLayoutStore.getState().collapsePanel('sidebar');
      });

      act(() => {
        useLayoutStore.getState().resetPanels();
      });

      expect(useLayoutStore.getState().panelSizes).toEqual({});
      expect(useLayoutStore.getState().collapsedPanels).toEqual([]);
    });
  });

  describe('utility methods', () => {
    beforeEach(() => {
      act(() => {
        useLayoutStore.getState().setPagination({
          page: 3,
          pageSize: 10,
          total: 100,
        });
      });
    });

    it('should check if can go next', () => {
      expect(useLayoutStore.getState().canGoNext()).toBe(true);
    });

    it('should check if can go previous', () => {
      expect(useLayoutStore.getState().canGoPrevious()).toBe(true);
    });

    it('should get visible columns', () => {
      const mockColumns: ColumnConfig[] = [
        {
          id: 'col1',
          field: 'col1',
          label: 'Column 1',
          visible: true,
          sortable: true,
          order: 0,
        },
        {
          id: 'col2',
          field: 'col2',
          label: 'Column 2',
          visible: false,
          sortable: false,
          order: 1,
        },
        {
          id: 'col3',
          field: 'col3',
          label: 'Column 3',
          visible: true,
          sortable: true,
          order: 2,
        },
      ];

      act(() => {
        useLayoutStore.setState({ tableColumns: mockColumns });
      });

      const visibleColumns = useLayoutStore.getState().getVisibleColumns();
      expect(visibleColumns).toHaveLength(2);
      expect(visibleColumns.map(col => col.id)).toEqual(['col1', 'col3']);
    });

    it('should get hidden columns', () => {
      const mockColumns: ColumnConfig[] = [
        {
          id: 'col1',
          field: 'col1',
          label: 'Column 1',
          visible: true,
          sortable: true,
          order: 0,
        },
        {
          id: 'col2',
          field: 'col2',
          label: 'Column 2',
          visible: false,
          sortable: false,
          order: 1,
        },
        {
          id: 'col3',
          field: 'col3',
          label: 'Column 3',
          visible: true,
          sortable: true,
          order: 2,
        },
      ];

      act(() => {
        useLayoutStore.setState({ tableColumns: mockColumns });
      });

      const hiddenColumns = useLayoutStore.getState().getHiddenColumns();
      expect(hiddenColumns).toHaveLength(1);
      expect(hiddenColumns[0].id).toBe('col2');
    });

    it('should check if panel is collapsed', () => {
      act(() => {
        useLayoutStore.getState().collapsePanel('sidebar');
      });

      expect(useLayoutStore.getState().isPanelCollapsed('sidebar')).toBe(true);
      expect(useLayoutStore.getState().isPanelCollapsed('main')).toBe(false);
    });

    it('should get panel size with default', () => {
      expect(useLayoutStore.getState().getPanelSize('sidebar')).toBe(300);

      act(() => {
        useLayoutStore.getState().setPanelSize('sidebar', 250);
      });

      expect(useLayoutStore.getState().getPanelSize('sidebar')).toBe(250);
    });
  });

  describe('reset layout', () => {
    it('should reset entire layout to defaults', () => {
      // Set up some custom state
      act(() => {
        useLayoutStore.getState().setViewMode('list');
        useLayoutStore.getState().setDensity('compact');
        useLayoutStore.getState().setPanelSize('sidebar', 250);
        useLayoutStore.getState().collapsePanel('sidebar');
        useLayoutStore.setState({
          tableColumns: [
            {
              id: 'col1',
              field: 'col1',
              label: 'Column 1',
              visible: false,
              sortable: true,
              order: 0,
              width: 200,
            },
          ],
        });
      });

      act(() => {
        useLayoutStore.getState().resetLayout();
      });

      const state = useLayoutStore.getState();
      expect(state.viewMode).toBe('grid');
      expect(state.layoutConfig.density).toBe('comfortable');
      expect(state.layoutConfig.columns).toBe(3);
      expect(state.layoutConfig.spacing).toBe(16);
      expect(state.layoutConfig.showHeaders).toBe(true);
      expect(state.panelSizes).toEqual({});
      expect(state.collapsedPanels).toEqual([]);

      // Check that resetColumns was called
      state.tableColumns.forEach(col => {
        expect(col.visible).toBe(true);
        expect(col.width).toBeUndefined();
      });
    });
  });
});
