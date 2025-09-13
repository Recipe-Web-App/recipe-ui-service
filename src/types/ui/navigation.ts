// Navigation Types
export interface Breadcrumb {
  id: string;
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: string;
}

export interface NavigationState {
  sidebarOpen: boolean;
  mobileMenuOpen: boolean;
  breadcrumbs: Breadcrumb[];
  currentPage: string;
  navigationHistory: string[];
}
