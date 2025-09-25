import type { LucideIcon } from 'lucide-react';

export interface Breadcrumb {
  id: string;
  label: string;
  href?: string;
  icon?: LucideIcon;
}

export interface NavigationState {
  // Sidebar state
  isSidebarOpen: boolean;
  isSidebarCollapsed: boolean;

  // Mobile state
  isMobileMenuOpen: boolean;

  // Navigation tracking
  breadcrumbs: Breadcrumb[];
  activeRoute: string;
  navigationHistory: string[];
}
