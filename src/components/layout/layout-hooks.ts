import { useLayoutContext } from './layout-provider';
import type { LayoutVariant } from './layout-provider';
import type { NavItem } from '@/types/navigation';

/**
 * Hook to get current layout variant
 *
 * @returns Current layout variant
 */
export const useLayoutVariant = (): LayoutVariant => {
  const { variant } = useLayoutContext();
  return variant;
};

/**
 * Hook to check if sidebar should be shown
 *
 * @returns Whether sidebar should be visible
 */
export const useSidebarVisibility = (): boolean => {
  const { showSidebar } = useLayoutContext();
  return showSidebar;
};

/**
 * Hook to check if footer should be shown
 *
 * @returns Whether footer should be visible
 */
export const useFooterVisibility = (): boolean => {
  const { showFooter } = useLayoutContext();
  return showFooter;
};

/**
 * Hook to get current sub-navigation from layout context
 *
 * @returns Current sub-navigation items
 */
export const useLayoutSubNavigation = (): NavItem[] => {
  const { subNavigation } = useLayoutContext();
  return subNavigation;
};
