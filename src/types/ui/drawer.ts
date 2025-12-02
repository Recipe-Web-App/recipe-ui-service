import { type VariantProps } from 'class-variance-authority';
import {
  drawerOverlayVariants,
  drawerContentVariants,
  drawerHeaderVariants,
  drawerBodyVariants,
  drawerFooterVariants,
  drawerCloseVariants,
  navigationDrawerVariants,
  navigationItemVariants,
  recipeDrawerVariants,
} from '@/lib/ui/drawer-variants';

/**
 * Drawer position types
 */
export type DrawerPosition = 'left' | 'right' | 'top' | 'bottom';

/**
 * Drawer size types
 */
export type DrawerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

/**
 * Drawer variant types
 */
export type DrawerVariant = 'default' | 'elevated' | 'minimal' | 'overlay';

/**
 * Navigation item data structure
 */
export interface NavigationItem {
  /** Unique identifier for the navigation item */
  id: string;
  /** Display label for the item */
  label: string;
  /** Icon name from the icon registry */
  icon?: string;
  /** URL to navigate to */
  href?: string;
  /** Click handler function */
  onClick?: () => void;
  /** Whether this item is currently active */
  isActive?: boolean;
  /** Whether this item is disabled */
  isDisabled?: boolean;
  /** Badge content to display (e.g., count) */
  badge?: string | number;
  /** Nested navigation items */
  children?: NavigationItem[];
  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Recipe ingredient for drawer display
 */
export interface DrawerIngredient {
  id: string;
  name: string;
  amount?: number;
  unit?: string;
  notes?: string;
  isChecked?: boolean;
  category?: string;
}

/**
 * Recipe instruction for drawer display
 */
export interface DrawerInstruction {
  id: string;
  stepNumber: number;
  instruction: string;
  duration?: number;
  isCompleted?: boolean;
  notes?: string;
}

/**
 * Shopping list item for drawer
 */
export interface ShoppingListItem {
  id: string;
  name: string;
  quantity?: number;
  unit?: string;
  category?: string;
  isChecked?: boolean;
  notes?: string;
  recipeId?: string;
  recipeName?: string;
}

/**
 * Main Drawer component props
 */
export interface DrawerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Whether the drawer is open */
  open?: boolean;
  /** Callback when the drawer open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Default open state for uncontrolled usage */
  defaultOpen?: boolean;
  /** Whether to show the overlay */
  showOverlay?: boolean;
  /** Whether clicking the overlay closes the drawer */
  closeOnOverlayClick?: boolean;
  /** Whether pressing Escape closes the drawer */
  closeOnEscape?: boolean;
  /** Whether to prevent scrolling when open */
  preventScroll?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Drawer overlay component props
 */
export interface DrawerOverlayProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof drawerOverlayVariants> {
  /** Additional CSS classes */
  className?: string;
}

/**
 * Drawer content component props
 */
export interface DrawerContentProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof drawerContentVariants> {
  /** Whether to show the close button */
  showClose?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Drawer header component props
 */
export interface DrawerHeaderProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof drawerHeaderVariants> {
  /** Additional CSS classes */
  className?: string;
}

/**
 * Drawer body component props
 */
export interface DrawerBodyProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof drawerBodyVariants> {
  /** Additional CSS classes */
  className?: string;
}

/**
 * Drawer footer component props
 */
export interface DrawerFooterProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof drawerFooterVariants> {
  /** Additional CSS classes */
  className?: string;
}

/**
 * Drawer close button component props
 */
export interface DrawerCloseProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof drawerCloseVariants> {
  /** Custom close icon */
  icon?: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Drawer title component props
 */
export interface DrawerTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** Title level (h1-h6) */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  /** Additional CSS classes */
  className?: string;
}

/**
 * Drawer description component props
 */
export interface DrawerDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  /** Additional CSS classes */
  className?: string;
}

/**
 * Navigation drawer component props
 */
export interface NavigationDrawerProps
  extends DrawerProps, VariantProps<typeof navigationDrawerVariants> {
  /** Navigation items to display */
  items: NavigationItem[];
  /** Current active item ID */
  activeItemId?: string;
  /** Whether to show user profile section */
  showProfile?: boolean;
  /** User profile data */
  userProfile?: {
    name: string;
    email: string;
    avatar?: string;
  };
  /** Header content */
  header?: React.ReactNode;
  /** Footer content */
  footer?: React.ReactNode;
  /** Navigation item click handler */
  onItemClick?: (item: NavigationItem) => void;
  /** Position of the drawer */
  position?: 'left' | 'right' | 'top' | 'bottom';
  /** Size of the drawer */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Additional CSS classes */
  className?: string;
}

/**
 * Navigation item component props
 */
export interface NavigationItemComponentProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'>,
    VariantProps<typeof navigationItemVariants> {
  /** Navigation item data */
  item: NavigationItem;
  /** Whether this item is active */
  isActive?: boolean;
  /** Click handler */
  onClick?: (item: NavigationItem) => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Recipe drawer component props
 */
export interface RecipeDrawerProps
  extends DrawerProps, VariantProps<typeof recipeDrawerVariants> {
  /** Recipe ID */
  recipeId?: string;
  /** Recipe title */
  recipeTitle?: string;
  /** Ingredients list */
  ingredients?: DrawerIngredient[];
  /** Instructions list */
  instructions?: DrawerInstruction[];
  /** Shopping list items */
  shoppingList?: ShoppingListItem[];
  /** Whether to show ingredient checklist */
  showIngredientChecklist?: boolean;
  /** Whether to show instruction progress */
  showInstructionProgress?: boolean;
  /** Ingredient check handler */
  onIngredientCheck?: (ingredientId: string, checked: boolean) => void;
  /** Instruction complete handler */
  onInstructionComplete?: (instructionId: string, completed: boolean) => void;
  /** Shopping item check handler */
  onShoppingItemCheck?: (itemId: string, checked: boolean) => void;
  /** Position of the drawer */
  position?: 'left' | 'right' | 'top' | 'bottom';
  /** Size of the drawer */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Additional CSS classes */
  className?: string;
}

/**
 * Mobile menu drawer props
 */
export interface MobileMenuDrawerProps extends NavigationDrawerProps {
  /** Whether to show search */
  showSearch?: boolean;
  /** Search placeholder text */
  searchPlaceholder?: string;
  /** Search value */
  searchValue?: string;
  /** Search change handler */
  onSearchChange?: (value: string) => void;
  /** Whether to show notifications */
  showNotifications?: boolean;
  /** Notification count */
  notificationCount?: number;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Drawer animation state
 */
export type DrawerAnimationState = 'closed' | 'opening' | 'open' | 'closing';

/**
 * Drawer accessibility props
 */
export interface DrawerA11yProps {
  /** ARIA label for the drawer */
  ariaLabel?: string;
  /** ARIA description for the drawer */
  ariaDescription?: string;
  /** Whether to announce state changes */
  announceChanges?: boolean;
  /** Custom announcement text */
  customAnnouncement?: string;
}

/**
 * Drawer event handlers
 */
export interface DrawerEventHandlers {
  /** Called when drawer starts opening */
  onOpenStart?: () => void;
  /** Called when drawer finishes opening */
  onOpenEnd?: () => void;
  /** Called when drawer starts closing */
  onCloseStart?: () => void;
  /** Called when drawer finishes closing */
  onCloseEnd?: () => void;
  /** Called when escape key is pressed */
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  /** Called when overlay is clicked */
  onOverlayClick?: (event: React.MouseEvent) => void;
}

/**
 * Drawer configuration options
 */
export interface DrawerConfig {
  /** Animation duration in milliseconds */
  animationDuration?: number;
  /** Animation easing function */
  animationEasing?: string;
  /** Whether to enable animations */
  enableAnimations?: boolean;
  /** Whether to restore focus on close */
  restoreFocus?: boolean;
  /** Whether to trap focus within drawer */
  trapFocus?: boolean;
  /** Whether to prevent body scroll */
  preventBodyScroll?: boolean;
  /** Z-index for the drawer */
  zIndex?: number;
}

/**
 * Common recipe patterns for drawers
 */
export type RecipeDrawerPattern =
  | 'navigation' // Main app navigation
  | 'ingredients' // Recipe ingredient list
  | 'instructions' // Cooking instructions
  | 'shopping' // Shopping list
  | 'notes' // Recipe notes and tips
  | 'filters' // Search and filter options
  | 'settings' // User settings and preferences
  | 'profile' // User profile information
  | 'menu'; // Mobile menu

/**
 * Drawer theme configuration
 */
export interface DrawerTheme {
  /** Colors for different states */
  colors: {
    overlay: string;
    background: string;
    border: string;
    foreground: string;
  };
  /** Animation settings */
  animations: {
    duration: string;
    easing: string;
    enableTransitions: boolean;
  };
  /** Spacing configuration */
  spacing: {
    padding: string;
    gap: string;
  };
}

/**
 * Drawer analytics events
 */
export interface DrawerAnalytics {
  /** Track drawer open events */
  onDrawerOpen?: (position: DrawerPosition, type: string) => void;
  /** Track drawer close events */
  onDrawerClose?: (position: DrawerPosition, duration: number) => void;
  /** Track navigation clicks */
  onNavigationClick?: (itemId: string, itemLabel: string) => void;
  /** Track recipe interactions */
  onRecipeInteraction?: (action: string, recipeId?: string) => void;
}
