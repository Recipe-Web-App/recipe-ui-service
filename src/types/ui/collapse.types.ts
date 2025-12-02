import type { VariantProps } from 'class-variance-authority';
import type {
  collapseVariants,
  collapseContentVariants,
  recipeSectionCollapseVariants,
} from '@/lib/ui/collapse-variants';

/**
 * Base collapse component props interface
 */
export interface CollapseProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof collapseVariants> {
  /**
   * Whether the collapse is open by default
   * @default false
   */
  defaultOpen?: boolean;
  /**
   * Controlled open state
   */
  open?: boolean;
  /**
   * Callback when open state changes
   */
  onOpenChange?: (open: boolean) => void;
  /**
   * Whether the collapse is disabled
   * @default false
   */
  disabled?: boolean;
  /**
   * Animation duration in milliseconds
   * @default 300
   */
  animationDuration?: number;
  /**
   * Custom trigger content
   */
  trigger?: React.ReactNode;
  /**
   * Whether to use smooth height transitions
   * @default true
   */
  smoothTransitions?: boolean;
}

/**
 * Collapse trigger component props interface
 */
export interface CollapseTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Visual variant of the trigger
   */
  variant?: 'default' | 'outlined' | 'elevated' | 'minimal' | 'card';
  /**
   * Size of the trigger
   */
  size?: 'sm' | 'default' | 'lg';
  /**
   * Icon to display in the trigger
   */
  icon?: React.ReactNode;
  /**
   * Position of the icon relative to the text
   * @default 'right'
   */
  iconPosition?: 'left' | 'right';
  /**
   * Whether to show the default chevron icon
   * @default true
   */
  showIcon?: boolean;
  /**
   * Custom aria-label for the trigger button
   */
  ariaLabel?: string;
  /**
   * Animation speed for the icon rotation
   * @default 'normal'
   */
  animationSpeed?: 'fast' | 'normal' | 'slow';
}

/**
 * Collapse content component props interface
 */
export interface CollapseContentProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof collapseContentVariants> {
  /**
   * Whether to force mount the content (for SEO or animations)
   * @default false
   */
  forceMount?: boolean;
  /**
   * Custom animation duration in milliseconds
   * @default 300
   */
  animationDuration?: number;
  /**
   * Animation easing function
   * @default 'ease-in-out'
   */
  animationEasing?: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear';
  /**
   * Maximum height when collapsed (for partial visibility)
   * @default 0
   */
  collapsedHeight?: number;
  /**
   * Whether to animate padding during collapse
   * @default true
   */
  animatePadding?: boolean;
}

/**
 * Recipe-specific collapse props interface
 */
export interface RecipeCollapseProps
  extends CollapseProps, VariantProps<typeof recipeSectionCollapseVariants> {
  /**
   * Recipe-specific context for automatic styling
   */
  section:
    | 'ingredients'
    | 'instructions'
    | 'nutrition'
    | 'notes'
    | 'tips'
    | 'variations'
    | 'equipment'
    | 'timeline';
  /**
   * Optional icon for the specific section
   */
  sectionIcon?: React.ReactNode;
  /**
   * Whether to show a count badge (e.g., "5 ingredients")
   */
  count?: number;
  /**
   * Custom count label (e.g., "items", "steps")
   */
  countLabel?: string;
  /**
   * Estimated time for the section (if applicable)
   */
  estimatedTime?: string;
}

/**
 * Kitchen tips collapse props interface
 */
export interface KitchenTipsCollapseProps extends CollapseProps {
  /**
   * Type of tip for appropriate styling
   */
  tipType?: 'cooking' | 'prep' | 'storage' | 'technique' | 'safety' | 'timing';
  /**
   * Difficulty level indicator
   */
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  /**
   * Estimated time for the tip (if applicable)
   */
  estimatedTime?: string;
  /**
   * Whether this is a pro tip
   */
  proTip?: boolean;
}

/**
 * FAQ collapse props interface
 */
export interface FAQCollapseProps extends CollapseProps {
  /**
   * Question text for the trigger
   */
  question: string;
  /**
   * Category for grouping related FAQs
   */
  category?:
    | 'general'
    | 'cooking'
    | 'ingredients'
    | 'equipment'
    | 'storage'
    | 'nutrition'
    | 'substitutions';
  /**
   * Whether this is a frequently asked question
   */
  featured?: boolean;
  /**
   * Search keywords for filtering
   */
  keywords?: string[];
  /**
   * Question ID for deep linking
   */
  questionId?: string;
}

/**
 * Ingredient notes collapse props interface
 */
export interface IngredientNotesCollapseProps extends CollapseProps {
  /**
   * Ingredient name
   */
  ingredient: string;
  /**
   * Type of note
   */
  noteType?:
    | 'substitution'
    | 'preparation'
    | 'storage'
    | 'quality'
    | 'allergen'
    | 'source'
    | 'nutrition';
  /**
   * Importance level of the note
   */
  importance?: 'low' | 'medium' | 'high';
  /**
   * Whether this note contains allergen information
   */
  allergenWarning?: boolean;
}

/**
 * Collapse group props for managing multiple related collapses
 */
export interface CollapseGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Whether multiple collapses can be open at once
   * @default true
   */
  allowMultiple?: boolean;
  /**
   * Spacing between collapse items
   * @default 'normal'
   */
  spacing?: 'tight' | 'normal' | 'loose';
  /**
   * Default open indices (for uncontrolled mode)
   */
  defaultOpenItems?: number[];
  /**
   * Controlled open indices
   */
  openItems?: number[];
  /**
   * Callback when open items change
   */
  onOpenItemsChange?: (openItems: number[]) => void;
}

/**
 * Internal context type for collapse state management
 */
export interface CollapseContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  disabled: boolean;
  variant?: VariantProps<typeof collapseVariants>['variant'];
  size?: VariantProps<typeof collapseVariants>['size'];
  animationDuration: number;
  animationSpeed?: 'fast' | 'normal' | 'slow';
  triggerId: string;
  contentId: string;
  smoothTransitions: boolean;
}

/**
 * Animation state types for smooth transitions
 */
export type CollapseAnimationState = 'idle' | 'opening' | 'closing';

/**
 * Height measurement hook return type
 */
export interface UseCollapseHeightReturn {
  ref: React.RefObject<HTMLDivElement | null>;
  height: number;
  isAnimating: boolean;
  animationState: CollapseAnimationState;
}

/**
 * Collapse measurement data for animations
 */
export interface CollapseMeasurement {
  scrollHeight: number;
  offsetHeight: number;
  contentHeight: number;
  paddingTop: number;
  paddingBottom: number;
}

/**
 * Recipe content structure for typed collapse content
 */
export interface RecipeContent {
  ingredients?: Array<{
    id: string;
    name: string;
    amount?: string;
    unit?: string;
    notes?: string;
    optional?: boolean;
  }>;
  instructions?: Array<{
    id: string;
    step: number;
    description: string;
    time?: string;
    temperature?: string;
    notes?: string;
  }>;
  equipment?: Array<{
    id: string;
    name: string;
    essential?: boolean;
    alternatives?: string[];
  }>;
  nutrition?: Array<{
    id: string;
    label: string;
    value: string;
    unit?: string;
    dailyValue?: number;
  }>;
  notes?: Array<{
    id: string;
    type: 'tip' | 'warning' | 'info' | 'substitution';
    content: string;
    importance?: 'low' | 'medium' | 'high';
  }>;
}

/**
 * Export all types for external use
 */
export type {
  CollapseProps as Collapse,
  CollapseTriggerProps as CollapseTrigger,
  CollapseContentProps as CollapseContent,
  RecipeCollapseProps as RecipeCollapse,
  KitchenTipsCollapseProps as KitchenTipsCollapse,
  FAQCollapseProps as FAQCollapse,
  IngredientNotesCollapseProps as IngredientNotesCollapse,
  CollapseGroupProps as CollapseGroup,
};
