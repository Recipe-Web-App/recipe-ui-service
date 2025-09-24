import type { VariantProps } from 'class-variance-authority';
import type { disclosureVariants } from '@/lib/ui/disclosure-variants';

/**
 * Base disclosure component props interface
 */
export interface DisclosureProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof disclosureVariants> {
  /**
   * Whether the disclosure is open by default
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
   * Whether the disclosure is disabled
   * @default false
   */
  disabled?: boolean;
  /**
   * Whether the disclosure can be collapsed when open
   * @default true
   */
  collapsible?: boolean;
}

/**
 * Disclosure trigger (button) component props interface
 */
export interface DisclosureTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
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
   * Whether the trigger is disabled
   * @default false
   */
  disabled?: boolean;
}

/**
 * Disclosure content panel component props interface
 */
export interface DisclosureContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
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
}

/**
 * Recipe-specific disclosure props interface
 */
export interface RecipeDisclosureProps extends DisclosureProps {
  /**
   * Recipe-specific context for automatic styling
   */
  context:
    | 'tips'
    | 'notes'
    | 'substitutions'
    | 'nutrition'
    | 'equipment'
    | 'storage'
    | 'variations'
    | 'faq';
  /**
   * Optional icon for the specific context
   */
  contextIcon?: React.ReactNode;
  /**
   * Whether to show a badge with additional info
   */
  badge?: string;
}

/**
 * Kitchen tips disclosure props interface
 */
export interface KitchenTipsDisclosureProps extends DisclosureProps {
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
}

/**
 * FAQ disclosure props interface
 */
export interface FAQDisclosureProps extends DisclosureProps {
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
    | 'nutrition';
  /**
   * Whether this is a frequently asked question
   */
  featured?: boolean;
  /**
   * Search keywords for filtering
   */
  keywords?: string[];
}

/**
 * Ingredient notes disclosure props interface
 */
export interface IngredientNotesDisclosureProps extends DisclosureProps {
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
    | 'source';
  /**
   * Importance level of the note
   */
  importance?: 'low' | 'medium' | 'high';
}

/**
 * Disclosure group props for managing multiple related disclosures
 */
export interface DisclosureGroupProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Spacing between disclosure items
   * @default 'normal'
   */
  spacing?: 'tight' | 'normal' | 'loose';
}

/**
 * Internal context type for disclosure state management
 */
export interface DisclosureContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  disabled: boolean;
  variant?: VariantProps<typeof disclosureVariants>['variant'];
  size?: VariantProps<typeof disclosureVariants>['size'];
  triggerId: string;
  contentId: string;
}

/**
 * Animation state types for smooth transitions
 */
export type DisclosureAnimationState = 'idle' | 'opening' | 'closing';

/**
 * Export all types for external use
 */
export type {
  DisclosureProps as Disclosure,
  DisclosureTriggerProps as DisclosureTrigger,
  DisclosureContentProps as DisclosureContent,
  RecipeDisclosureProps as RecipeDisclosure,
  KitchenTipsDisclosureProps as KitchenTipsDisclosure,
  FAQDisclosureProps as FAQDisclosure,
  IngredientNotesDisclosureProps as IngredientNotesDisclosure,
  DisclosureGroupProps as DisclosureGroup,
};
