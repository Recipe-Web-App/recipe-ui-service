import * as React from 'react';
import type { VariantProps } from 'class-variance-authority';
import type {
  dividerVariants,
  dividerWithTextVariants,
  dividerTextVariants,
  recipeDividerVariants,
  dividerIconVariants,
} from '@/lib/ui/divider-variants';

// Base divider props
export interface BaseDividerProps {
  id?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-orientation'?: 'horizontal' | 'vertical';
  role?: 'separator' | 'presentation' | 'none';
}

// Main Divider component props
export interface DividerProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, 'role' | 'color' | 'style'>,
    BaseDividerProps,
    VariantProps<typeof dividerVariants> {
  asChild?: boolean;
  decorative?: boolean;
}

// Divider with text props
export interface DividerWithTextProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, 'role'>,
    BaseDividerProps,
    VariantProps<typeof dividerWithTextVariants> {
  text: React.ReactNode;
  textProps?: DividerTextProps;
  dividerProps?: Omit<DividerProps, 'orientation'>;
  asChild?: boolean;
  decorative?: boolean;
}

// Divider text styling props
export interface DividerTextProps
  extends
    Omit<React.HTMLAttributes<HTMLSpanElement>, 'color'>,
    VariantProps<typeof dividerTextVariants> {
  as?: 'span' | 'div' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

// Divider with icon props
export interface DividerWithIconProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, 'role'>,
    BaseDividerProps,
    VariantProps<typeof dividerWithTextVariants> {
  icon: React.ReactNode;
  iconProps?: DividerIconProps;
  dividerProps?: Omit<DividerProps, 'orientation'>;
  asChild?: boolean;
  decorative?: boolean;
  'aria-label'?: string;
}

// Divider icon styling props
export interface DividerIconProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof dividerIconVariants> {
  'aria-hidden'?: boolean;
}

// Recipe-specific divider props
export interface RecipeDividerProps
  extends
    Omit<DividerProps, 'className'>,
    VariantProps<typeof recipeDividerVariants> {
  className?: string;
  label?: string;
  showLabel?: boolean;
}

// Section divider props for recipe content
export interface SectionDividerProps extends RecipeDividerProps {
  section: 'ingredients' | 'instructions' | 'nutrition' | 'metadata' | 'notes';
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  onToggleCollapse?: (collapsed: boolean) => void;
}

// Gradient divider props
export interface GradientDividerProps extends Omit<DividerProps, 'style'> {
  gradient?:
    | 'primary'
    | 'secondary'
    | 'accent'
    | 'rainbow'
    | 'sunset'
    | 'ocean';
  intensity?: 'light' | 'medium' | 'strong';
  animated?: boolean;
  direction?: 'left-to-right' | 'right-to-left' | 'center-out' | 'out-center';
}

// List divider props (for use within lists)
export interface ListDividerProps extends DividerProps {
  inset?: boolean;
  fullBleed?: boolean;
  variant?: 'default' | 'subtle' | 'prominent';
}

// Responsive divider props
export interface ResponsiveDividerProps extends DividerProps {
  hideOnMobile?: boolean;
  hideOnTablet?: boolean;
  hideOnDesktop?: boolean;
  mobileOrientation?: 'horizontal' | 'vertical';
  tabletOrientation?: 'horizontal' | 'vertical';
  desktopOrientation?: 'horizontal' | 'vertical';
}

// Contextual divider props for different recipe sections
export interface IngredientDividerProps extends RecipeDividerProps {
  context: 'ingredient-group';
  groupName?: string;
  ingredientCount?: number;
  category?: 'wet' | 'dry' | 'protein' | 'vegetable' | 'spice' | 'garnish';
}

export interface InstructionDividerProps extends RecipeDividerProps {
  context: 'instruction-step';
  stepNumber?: number;
  phase?: 'prep' | 'cook' | 'assembly' | 'finish';
  estimatedTime?: string;
}

export interface NutritionDividerProps extends RecipeDividerProps {
  context: 'nutrition-group';
  category?: 'macros' | 'vitamins' | 'minerals' | 'other';
  highlight?: boolean;
}

// Accessibility helper types
export interface DividerA11yProps {
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-orientation'?: 'horizontal' | 'vertical';
  'aria-hidden'?: boolean;
  role?: 'separator' | 'presentation' | 'none';
}

// Animation types for dividers
export interface DividerAnimationProps {
  animated?: boolean;
  animationType?: 'fade-in' | 'slide-in' | 'grow' | 'pulse' | 'shimmer';
  duration?: 'fast' | 'normal' | 'slow';
  delay?: 'none' | 'short' | 'medium' | 'long';
  easing?: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
}

// Theme customization types
export interface DividerThemeProps {
  customColor?: string;
  customGradient?: string;
  customPattern?: 'dots' | 'waves' | 'zigzag' | 'scallop';
  patternSize?: 'sm' | 'md' | 'lg';
  patternSpacing?: 'tight' | 'normal' | 'loose';
}

// Composite divider props combining multiple features
export interface CompositeDividerProps
  extends
    DividerProps,
    Partial<DividerAnimationProps>,
    Partial<DividerThemeProps> {
  withText?: string;
  withIcon?: React.ReactNode;
  recipe?: boolean;
  recipeContext?: VariantProps<typeof recipeDividerVariants>['context'];
  gradient?: boolean;
  responsive?: boolean;
}

// Event types
export interface DividerInteractionEvent {
  type: 'hover' | 'focus' | 'click';
  target: HTMLElement;
  dividerType: 'basic' | 'text' | 'icon' | 'recipe';
}

// State management types for complex dividers
export interface DividerState {
  visible: boolean;
  animated: boolean;
  collapsed?: boolean;
  highlighted?: boolean;
}

export interface DividerActions {
  show: () => void;
  hide: () => void;
  toggle: () => void;
  startAnimation: () => void;
  stopAnimation: () => void;
  collapse?: () => void;
  expand?: () => void;
  highlight?: () => void;
  unhighlight?: () => void;
}

// Hook return types
export interface UseDividerVisibility {
  isVisible: boolean;
  show: () => void;
  hide: () => void;
  toggle: () => void;
}

export interface UseDividerAnimation {
  isAnimating: boolean;
  start: () => void;
  stop: () => void;
  restart: () => void;
}

// Layout helper types
export interface DividerSpacing {
  top?: string | number;
  bottom?: string | number;
  left?: string | number;
  right?: string | number;
}

export interface DividerDimensions {
  width?: string | number;
  height?: string | number;
  maxWidth?: string | number;
  maxHeight?: string | number;
  minWidth?: string | number;
  minHeight?: string | number;
}

// Recipe-specific content types
export interface RecipePhase {
  id: string;
  name: string;
  description?: string;
  estimatedTime?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  required?: boolean;
}

export interface IngredientGroup {
  id: string;
  name: string;
  description?: string;
  category: 'wet' | 'dry' | 'protein' | 'vegetable' | 'spice' | 'garnish';
  ingredientCount: number;
  optional?: boolean;
}

export interface NutritionCategory {
  id: string;
  name: string;
  description?: string;
  category: 'macros' | 'vitamins' | 'minerals' | 'other';
  highlight?: boolean;
  unit?: string;
}
