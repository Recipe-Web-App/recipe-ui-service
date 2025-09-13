import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  LayoutState,
  ViewMode,
  LayoutDensity,
  PaginationState,
  ColumnConfig,
  LayoutConfig,
} from '@/types/ui/layout';

interface LayoutStoreState extends LayoutState {
  // View mode actions
  setViewMode: (mode: ViewMode) => void;
  toggleViewMode: () => void;

  // Pagination actions
  setPagination: (config: Partial<PaginationState>) => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;

  // Layout configuration actions
  setLayoutConfig: (config: Partial<LayoutConfig>) => void;
  setDensity: (density: LayoutDensity) => void;
  setColumns: (columns: number) => void;
  setSpacing: (spacing: number) => void;
  toggleHeaders: () => void;

  // Table column actions
  toggleColumn: (columnId: string) => void;
  reorderColumns: (columnIds: string[]) => void;
  resizeColumn: (columnId: string, width: number) => void;
  resetColumns: () => void;
  showAllColumns: () => void;
  hideAllColumns: () => void;

  // Panel actions
  setPanelSize: (panelId: string, size: number) => void;
  togglePanel: (panelId: string) => void;
  expandPanel: (panelId: string) => void;
  collapsePanel: (panelId: string) => void;
  resetPanels: () => void;

  // Utility methods
  canGoNext: () => boolean;
  canGoPrevious: () => boolean;
  getVisibleColumns: () => ColumnConfig[];
  getHiddenColumns: () => ColumnConfig[];
  isPanelCollapsed: (panelId: string) => boolean;
  getPanelSize: (panelId: string) => number;
  resetLayout: () => void;
}

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_COLUMNS = 3;
const DEFAULT_SPACING = 16;

const createDefaultPagination = (): PaginationState => ({
  page: 1,
  pageSize: DEFAULT_PAGE_SIZE,
  total: 0,
  totalPages: 0,
  hasNext: false,
  hasPrev: false,
});

const createDefaultLayoutConfig = (): LayoutConfig => ({
  viewMode: 'grid',
  density: 'comfortable',
  columns: DEFAULT_COLUMNS,
  spacing: DEFAULT_SPACING,
  showHeaders: true,
});

export const useLayoutStore = create<LayoutStoreState>()(
  persist(
    (set, get) => ({
      viewMode: 'grid',
      pagination: createDefaultPagination(),
      layoutConfig: createDefaultLayoutConfig(),
      tableColumns: [],
      panelSizes: {},
      collapsedPanels: [],

      setViewMode: (mode: ViewMode) => {
        set(state => ({
          layoutConfig: { ...state.layoutConfig, viewMode: mode },
          viewMode: mode,
        }));
      },

      toggleViewMode: () => {
        const currentMode = get().viewMode;
        const modes: ViewMode[] = ['grid', 'list', 'card', 'table'];
        const currentIndex = modes.indexOf(currentMode);
        const nextMode = modes[(currentIndex + 1) % modes.length];
        get().setViewMode(nextMode);
      },

      setPagination: (config: Partial<PaginationState>) => {
        set(state => {
          const newPagination = { ...state.pagination, ...config };

          // Recalculate derived properties
          newPagination.totalPages = Math.ceil(
            newPagination.total / newPagination.pageSize
          );
          newPagination.hasNext = newPagination.page < newPagination.totalPages;
          newPagination.hasPrev = newPagination.page > 1;

          // Ensure page is within bounds
          if (
            newPagination.page > newPagination.totalPages &&
            newPagination.totalPages > 0
          ) {
            newPagination.page = newPagination.totalPages;
          }
          if (newPagination.page < 1) {
            newPagination.page = 1;
          }

          return { pagination: newPagination };
        });
      },

      setPage: (page: number) => {
        get().setPagination({ page });
      },

      setPageSize: (pageSize: number) => {
        get().setPagination({ pageSize, page: 1 }); // Reset to first page when changing page size
      },

      nextPage: () => {
        const { pagination } = get();
        if (pagination.hasNext) {
          get().setPage(pagination.page + 1);
        }
      },

      previousPage: () => {
        const { pagination } = get();
        if (pagination.hasPrev) {
          get().setPage(pagination.page - 1);
        }
      },

      goToFirstPage: () => {
        get().setPage(1);
      },

      goToLastPage: () => {
        const { pagination } = get();
        get().setPage(pagination.totalPages);
      },

      setLayoutConfig: (config: Partial<LayoutConfig>) => {
        set(state => ({
          layoutConfig: { ...state.layoutConfig, ...config },
        }));
      },

      setDensity: (density: LayoutDensity) => {
        set(state => ({
          layoutConfig: { ...state.layoutConfig, density },
        }));
      },

      setColumns: (columns: number) => {
        set(state => ({
          layoutConfig: { ...state.layoutConfig, columns },
        }));
      },

      setSpacing: (spacing: number) => {
        set(state => ({
          layoutConfig: { ...state.layoutConfig, spacing },
        }));
      },

      toggleHeaders: () => {
        set(state => ({
          layoutConfig: {
            ...state.layoutConfig,
            showHeaders: !state.layoutConfig.showHeaders,
          },
        }));
      },

      toggleColumn: (columnId: string) => {
        set(state => ({
          tableColumns: state.tableColumns.map(col =>
            col.id === columnId ? { ...col, visible: !col.visible } : col
          ),
        }));
      },

      reorderColumns: (columnIds: string[]) => {
        set(state => {
          const columnMap = new Map(
            state.tableColumns.map(col => [col.id, col])
          );
          const reorderedColumns = columnIds
            .map((id, index) => {
              const col = columnMap.get(id);
              return col ? { ...col, order: index } : null;
            })
            .filter(Boolean) as ColumnConfig[];

          return { tableColumns: reorderedColumns };
        });
      },

      resizeColumn: (columnId: string, width: number) => {
        set(state => ({
          tableColumns: state.tableColumns.map(col =>
            col.id === columnId ? { ...col, width } : col
          ),
        }));
      },

      resetColumns: () => {
        set(state => ({
          tableColumns: state.tableColumns.map(col => ({
            ...col,
            visible: true,
            width: undefined,
          })),
        }));
      },

      showAllColumns: () => {
        set(state => ({
          tableColumns: state.tableColumns.map(col => ({
            ...col,
            visible: true,
          })),
        }));
      },

      hideAllColumns: () => {
        set(state => ({
          tableColumns: state.tableColumns.map(col => ({
            ...col,
            visible: false,
          })),
        }));
      },

      setPanelSize: (panelId: string, size: number) => {
        set(state => ({
          panelSizes: { ...state.panelSizes, [panelId]: size },
        }));
      },

      togglePanel: (panelId: string) => {
        set(state => {
          const isCollapsed = state.collapsedPanels.includes(panelId);
          return {
            collapsedPanels: isCollapsed
              ? state.collapsedPanels.filter(id => id !== panelId)
              : [...state.collapsedPanels, panelId],
          };
        });
      },

      expandPanel: (panelId: string) => {
        set(state => ({
          collapsedPanels: state.collapsedPanels.filter(id => id !== panelId),
        }));
      },

      collapsePanel: (panelId: string) => {
        set(state => ({
          collapsedPanels: state.collapsedPanels.includes(panelId)
            ? state.collapsedPanels
            : [...state.collapsedPanels, panelId],
        }));
      },

      resetPanels: () => {
        set({ panelSizes: {}, collapsedPanels: [] });
      },

      canGoNext: () => {
        return get().pagination.hasNext;
      },

      canGoPrevious: () => {
        return get().pagination.hasPrev;
      },

      getVisibleColumns: () => {
        return get().tableColumns.filter(col => col.visible);
      },

      getHiddenColumns: () => {
        return get().tableColumns.filter(col => !col.visible);
      },

      isPanelCollapsed: (panelId: string) => {
        return get().collapsedPanels.includes(panelId);
      },

      getPanelSize: (panelId: string) => {
        // eslint-disable-next-line security/detect-object-injection
        return get().panelSizes[panelId] ?? 300;
      },

      resetLayout: () => {
        set({
          viewMode: 'grid',
          layoutConfig: createDefaultLayoutConfig(),
          panelSizes: {},
          collapsedPanels: [],
        });
        get().resetColumns();
      },
    }),
    {
      name: 'layout-storage',
      partialize: state => ({
        viewMode: state.viewMode,
        layoutConfig: state.layoutConfig,
        tableColumns: state.tableColumns,
        panelSizes: state.panelSizes,
        collapsedPanels: state.collapsedPanels,
      }),
    }
  )
);
