import { type VariantProps } from 'class-variance-authority';
import {
  breadcrumbVariants,
  breadcrumbListVariants,
  breadcrumbItemVariants,
  breadcrumbLinkVariants,
  breadcrumbPageVariants,
  breadcrumbSeparatorVariants,
  breadcrumbEllipsisVariants,
  recipeBreadcrumbVariants,
} from '@/lib/ui/breadcrumb-variants';

/**
 * Individual breadcrumb item data
 */
export interface BreadcrumbItem {
  /** Display text for the breadcrumb */
  label: string;
  /** URL to navigate to (if not provided, item is not clickable) */
  href?: string;
  /** Optional icon name from the icon registry */
  icon?: string;
  /** Whether the item is disabled */
  disabled?: boolean;
  /** Unique identifier for the item */
  id?: string;
  /** Additional metadata for the item */
  metadata?: Record<string, unknown>;
}

/**
 * Breadcrumb container component props
 */
export interface BreadcrumbProps
  extends
    React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof breadcrumbVariants> {
  /** Array of breadcrumb items to display */
  items?: BreadcrumbItem[];
  /** Custom separator component or string */
  separator?: React.ReactNode;
  /** Maximum number of items to show before collapsing */
  maxItems?: number;
  /** Whether to show home icon on first item */
  showHome?: boolean;
  /** Custom home URL (defaults to '/') */
  homeUrl?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Breadcrumb list component props
 */
export interface BreadcrumbListProps
  extends
    React.HTMLAttributes<HTMLOListElement>,
    VariantProps<typeof breadcrumbListVariants> {
  /** Children elements */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Breadcrumb item component props
 */
export interface BreadcrumbItemProps
  extends
    React.HTMLAttributes<HTMLLIElement>,
    VariantProps<typeof breadcrumbItemVariants> {
  /** Children elements */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Breadcrumb link component props
 */
export interface BreadcrumbLinkProps
  extends
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof breadcrumbLinkVariants> {
  /** Children elements */
  children: React.ReactNode;
  /** Whether to render as a child component (using Radix Slot) */
  asChild?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Breadcrumb page component props (current page, non-clickable)
 */
export interface BreadcrumbPageProps
  extends
    React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof breadcrumbPageVariants> {
  /** Children elements */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Breadcrumb separator component props
 */
export interface BreadcrumbSeparatorProps
  extends
    React.HTMLAttributes<HTMLLIElement>,
    VariantProps<typeof breadcrumbSeparatorVariants> {
  /** Custom separator content (overrides variant) */
  children?: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Breadcrumb ellipsis component props for overflow indication
 */
export interface BreadcrumbEllipsisProps
  extends
    React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof breadcrumbEllipsisVariants> {
  /** Click handler for expanding collapsed items */
  onExpand?: () => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Recipe-specific breadcrumb component props
 */
export interface RecipeBreadcrumbProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof recipeBreadcrumbVariants> {
  /** Recipe workflow items */
  items: RecipeWorkflowItem[];
  /** Current step in the workflow */
  currentStep?: string;
  /** Click handler for workflow navigation */
  onStepClick?: (step: string) => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Recipe workflow item for cooking-specific navigation
 */
export interface RecipeWorkflowItem {
  /** Unique identifier for the workflow step */
  id: string;
  /** Display label for the step */
  label: string;
  /** Optional description */
  description?: string;
  /** Icon name from the icon registry */
  icon?: string;
  /** Whether the step is completed */
  completed?: boolean;
  /** Whether the step is currently active */
  active?: boolean;
  /** Whether the step is accessible/clickable */
  accessible?: boolean;
  /** URL for the step (if navigatable) */
  href?: string;
}

/**
 * Breadcrumb navigation context for recipe app
 */
export interface RecipeNavigationContext {
  /** Current recipe being viewed */
  recipe?: {
    id: string;
    title: string;
    category?: string;
    cuisine?: string;
  };
  /** Current section within recipe */
  section?:
    | 'overview'
    | 'ingredients'
    | 'instructions'
    | 'reviews'
    | 'variations';
  /** Cooking workflow step */
  workflowStep?: 'planning' | 'shopping' | 'cooking' | 'serving';
  /** Navigation history */
  history?: BreadcrumbItem[];
}

/**
 * Common recipe navigation patterns
 */
export type RecipeNavigationPattern =
  | 'category-browse' // Home > Recipes > Italian > Pasta
  | 'recipe-detail' // Home > Recipes > Recipe Name
  | 'cooking-workflow' // Planning > Shopping > Cooking > Serving
  | 'user-collection' // Home > My Recipes > Collection Name
  | 'search-results' // Home > Search > "pasta recipes"
  | 'meal-planning'; // Home > Meal Plans > This Week

/**
 * Breadcrumb configuration for different app sections
 */
export interface BreadcrumbConfig {
  /** Navigation pattern to use */
  pattern: RecipeNavigationPattern;
  /** Whether to show icons in breadcrumbs */
  showIcons?: boolean;
  /** Whether to show home link */
  showHome?: boolean;
  /** Maximum items before collapsing */
  maxItems?: number;
  /** Custom separator */
  separator?: 'chevron' | 'slash' | 'arrow' | 'dot';
  /** Style variant */
  variant?: 'default' | 'solid' | 'ghost' | 'minimal';
}

/**
 * Breadcrumb accessibility props
 */
export interface BreadcrumbA11yProps {
  /** ARIA label for the breadcrumb navigation */
  ariaLabel?: string;
  /** Whether to announce navigation changes to screen readers */
  announceNavigation?: boolean;
  /** Custom screen reader text for separators */
  separatorText?: string;
  /** Custom screen reader text for current page */
  currentPageText?: string;
}

/**
 * Hook return type for breadcrumb state management
 */
export interface UseBreadcrumbReturn {
  /** Current breadcrumb items */
  items: BreadcrumbItem[];
  /** Whether breadcrumbs are collapsed */
  isCollapsed: boolean;
  /** Function to toggle collapse state */
  toggleCollapse: () => void;
  /** Function to navigate to a breadcrumb item */
  navigateTo: (item: BreadcrumbItem) => void;
  /** Function to add a breadcrumb item */
  addItem: (item: BreadcrumbItem) => void;
  /** Function to remove a breadcrumb item */
  removeItem: (id: string) => void;
  /** Function to update a breadcrumb item */
  updateItem: (id: string, updates: Partial<BreadcrumbItem>) => void;
}

/**
 * Breadcrumb theme configuration
 */
export interface BreadcrumbTheme {
  /** Colors for different states */
  colors: {
    default: string;
    active: string;
    hover: string;
    disabled: string;
    separator: string;
  };
  /** Typography settings */
  typography: {
    fontSize: string;
    fontWeight: string;
    lineHeight: string;
  };
  /** Spacing configuration */
  spacing: {
    itemGap: string;
    padding: string;
    margin: string;
  };
}
