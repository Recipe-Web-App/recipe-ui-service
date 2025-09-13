// Layout Types
export type ViewMode = 'grid' | 'list' | 'card' | 'table';
export type LayoutDensity = 'compact' | 'comfortable' | 'spacious';

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ColumnConfig {
  id: string;
  field: string;
  label: string;
  visible: boolean;
  sortable?: boolean;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  order: number;
}

export interface LayoutConfig {
  viewMode: ViewMode;
  density: LayoutDensity;
  columns: number;
  spacing: number;
  showHeaders: boolean;
}

export interface LayoutState {
  viewMode: ViewMode;
  pagination: PaginationState;
  layoutConfig: LayoutConfig;
  tableColumns: ColumnConfig[];
  panelSizes: Record<string, number>;
  collapsedPanels: string[];
}
