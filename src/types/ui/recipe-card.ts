import { DifficultyLevel } from '@/types/recipe-management/common';
import { type BadgeProps } from '@/types/ui/badge';

/**
 * Recipe card author information
 */
export interface RecipeCardAuthor {
  id: string;
  name: string;
  avatar?: string;
  role?: 'user' | 'chef' | 'admin';
  verified?: boolean;
  rating?: number;
  recipeCount?: number;
}

/**
 * Recipe card metadata (time, difficulty, servings)
 */
export interface RecipeCardMetadata {
  preparationTime?: number; // minutes
  cookingTime?: number; // minutes
  difficulty?: DifficultyLevel;
  servings: number;
}

/**
 * Recipe card action handlers
 */
export interface RecipeCardActions {
  onClick?: () => void;
  onFavorite?: () => void;
  onShare?: () => void;
  onAddToCollection?: () => void;
  onQuickView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  onReport?: () => void;
}

/**
 * Menu item configuration
 */
export interface RecipeCardMenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  variant?: 'default' | 'destructive';
  disabled?: boolean;
}

/**
 * Recipe data shape for RecipeCard
 */
export interface RecipeCardRecipe extends RecipeCardMetadata {
  recipeId: number;
  title: string;
  description?: string;
  imageUrl?: string;
  author?: RecipeCardAuthor;
  rating?: number;
  reviewCount?: number;
  isFavorite?: boolean;
  createdAt?: string;
}

/**
 * RecipeCard component props
 */
export interface RecipeCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'> {
  recipe: RecipeCardRecipe;
  variant?: 'default' | 'elevated' | 'outlined' | 'ghost' | 'interactive';
  size?: 'sm' | 'default' | 'lg';
  showQuickActions?: boolean;
  showMenu?: boolean;
  showAuthor?: boolean;
  isOwner?: boolean;
  loading?: boolean;
  onClick?: () => void;
  onFavorite?: () => void;
  onShare?: () => void;
  onAddToCollection?: () => void;
  onQuickView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  onReport?: () => void;
}

/**
 * Format recipe time from minutes to human-readable string
 *
 * @param minutes - Time in minutes
 * @returns Formatted time string (e.g., "30 min", "1h 30m", "2h")
 *
 * @example
 * formatRecipeTime(30) // "30 min"
 * formatRecipeTime(90) // "1h 30m"
 * formatRecipeTime(120) // "2h"
 */
export function formatRecipeTime(minutes: number | undefined): string {
  if (!minutes || minutes === 0) return 'N/A';

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) return `${mins} min`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

/**
 * Get total recipe time (prep + cook)
 *
 * @param prepTime - Preparation time in minutes
 * @param cookTime - Cooking time in minutes
 * @returns Total time in minutes
 */
export function getTotalRecipeTime(
  prepTime?: number,
  cookTime?: number
): number {
  return (prepTime ?? 0) + (cookTime ?? 0);
}

/**
 * Get badge variant color for difficulty level
 *
 * @param difficulty - Recipe difficulty level
 * @returns Badge variant matching the difficulty
 *
 * @example
 * getDifficultyVariant(DifficultyLevel.EASY) // 'success'
 * getDifficultyVariant(DifficultyLevel.HARD) // 'warning'
 */
export function getDifficultyVariant(
  difficulty: DifficultyLevel | undefined
): BadgeProps['variant'] {
  if (!difficulty) return 'secondary';

  const variantMap: Record<DifficultyLevel, BadgeProps['variant']> = {
    [DifficultyLevel.BEGINNER]: 'success',
    [DifficultyLevel.EASY]: 'success',
    [DifficultyLevel.MEDIUM]: 'warning',
    [DifficultyLevel.HARD]: 'destructive',
    [DifficultyLevel.EXPERT]: 'destructive',
  };

  // eslint-disable-next-line security/detect-object-injection
  return variantMap[difficulty] ?? 'secondary';
}

/**
 * Get user-friendly difficulty label
 *
 * @param difficulty - Recipe difficulty level
 * @returns Formatted difficulty label
 */
export function getDifficultyLabel(
  difficulty: DifficultyLevel | undefined
): string {
  if (!difficulty) return 'N/A';

  const labelMap: Record<DifficultyLevel, string> = {
    [DifficultyLevel.BEGINNER]: 'Beginner',
    [DifficultyLevel.EASY]: 'Easy',
    [DifficultyLevel.MEDIUM]: 'Medium',
    [DifficultyLevel.HARD]: 'Hard',
    [DifficultyLevel.EXPERT]: 'Expert',
  };

  // eslint-disable-next-line security/detect-object-injection
  return labelMap[difficulty] ?? 'N/A';
}

/**
 * Recipe card quick action configuration
 */
export interface RecipeCardQuickAction {
  id: string;
  label: string;
  handler?: () => void;
}
