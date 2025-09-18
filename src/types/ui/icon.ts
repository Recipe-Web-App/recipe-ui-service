import { type VariantProps } from 'class-variance-authority';
import {
  iconVariants,
  iconContainerVariants,
  recipeIconVariants,
} from '@/lib/ui/icon-variants';
import { iconRegistry } from '@/lib/ui/icon-registry';

/**
 * Extract icon names from the registry for type safety
 */
export type IconName = {
  [K in keyof typeof iconRegistry]: keyof (typeof iconRegistry)[K];
}[keyof typeof iconRegistry];

/**
 * Icon categories from the registry
 */
export type IconCategory = keyof typeof iconRegistry;

/**
 * Base icon component props
 */
export interface IconProps extends VariantProps<typeof iconVariants> {
  /** The name of the icon to render */
  name: IconName;
  /** Additional CSS classes */
  className?: string;
  /** Accessible label for screen readers */
  'aria-label'?: string;
  /** Whether the icon is decorative (hidden from screen readers) */
  'aria-hidden'?: boolean;
  /** Custom title for the icon */
  title?: string;
  /** Click handler for interactive icons */
  onClick?: () => void;
  /** Whether the icon should be focusable */
  focusable?: boolean;
  /** Role attribute for accessibility */
  role?: string;
}

/**
 * Icon container component props for grouped icons
 */
export interface IconContainerProps
  extends VariantProps<typeof iconContainerVariants> {
  /** Children elements (usually Icon components) */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Whether the container is interactive */
  interactive?: boolean;
  /** Click handler for the container */
  onClick?: () => void;
}

/**
 * Recipe-specific icon props
 */
export interface RecipeIconProps
  extends Omit<IconProps, 'color' | 'animation' | 'state'>,
    VariantProps<typeof recipeIconVariants> {
  // Inherits all IconProps except styling variants that are overridden by recipe variants
}

/**
 * Icon gallery props for demo purposes
 */
export interface IconGalleryProps {
  /** Category to display */
  category?: IconCategory;
  /** Search filter */
  searchFilter?: string;
  /** Size to display icons */
  displaySize?: 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl';
  /** Whether to show icon names */
  showNames?: boolean;
  /** Number of columns in the grid */
  columns?: number;
  /** Click handler for icon selection */
  onIconClick?: (iconName: IconName) => void;
}

/**
 * Icon usage statistics
 */
export interface IconUsageStats {
  /** Total number of icons */
  totalIcons: number;
  /** Number of categories */
  totalCategories: number;
  /** Most popular icons */
  popularIcons: IconName[];
  /** Recently added icons */
  recentIcons: IconName[];
}

/**
 * Icon search result
 */
export interface IconSearchResult {
  /** Icon name */
  name: IconName;
  /** Icon category */
  category: IconCategory;
  /** Search relevance score */
  score: number;
  /** Matched keywords */
  matchedKeywords: string[];
}

/**
 * Icon theme configuration
 */
export interface IconThemeConfig {
  /** Default icon color */
  defaultColor: string;
  /** Size scale multiplier */
  sizeScale: number;
  /** Animation preferences */
  animations: {
    enabled: boolean;
    duration: string;
    easing: string;
  };
  /** Accessibility settings */
  accessibility: {
    showLabels: boolean;
    highContrast: boolean;
    reducedMotion: boolean;
  };
}

/**
 * Icon component reference for testing
 */
export interface IconComponentRef {
  /** The rendered icon element */
  element: HTMLElement | null;
  /** Icon name being displayed */
  iconName: IconName;
  /** Current props */
  props: IconProps;
}

/**
 * Utility type for creating icon prop combinations
 */
export type IconVariantCombination = {
  size: NonNullable<IconProps['size']>;
  color: NonNullable<IconProps['color']>;
  animation: NonNullable<IconProps['animation']>;
  state: NonNullable<IconProps['state']>;
};

/**
 * Icon event handlers
 */
export interface IconEventHandlers {
  /** Called when icon is clicked */
  onClick?: (iconName: IconName, event: React.MouseEvent) => void;
  /** Called when icon is hovered */
  onHover?: (iconName: IconName, event: React.MouseEvent) => void;
  /** Called when icon receives focus */
  onFocus?: (iconName: IconName, event: React.FocusEvent) => void;
  /** Called when icon loses focus */
  onBlur?: (iconName: IconName, event: React.FocusEvent) => void;
}

/**
 * Common icon patterns for the recipe app
 */
export type RecipeIconPattern =
  | 'cooking-action' // chef-hat, cooking-pot, utensils
  | 'time-related' // timer, clock, hourglass
  | 'temperature' // thermometer, flame
  | 'ingredients' // apple, wheat, beef, etc.
  | 'nutrition' // scale, droplets
  | 'difficulty' // star, target, award
  | 'serving' // users, utensils-crossed
  | 'dietary' // leaf, heart, shield
  | 'measurement' // scale, timer, thermometer
  | 'social'; // share, heart, star;

/**
 * Icon accessibility requirements
 */
export interface IconA11yRequirements {
  /** Required ARIA label */
  ariaLabel: string;
  /** Icon role */
  role: 'img' | 'button' | 'presentation';
  /** Focus management */
  focusable: boolean;
  /** High contrast support */
  highContrast: boolean;
  /** Screen reader description */
  description?: string;
}
