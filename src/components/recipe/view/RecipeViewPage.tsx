'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  useRecipeWithDetails,
  useIsRecipeFavorited,
  useFavoriteRecipe,
  useUnfavoriteRecipe,
} from '@/hooks/recipe-management';
import { useAuthStore } from '@/stores/auth-store';
import { useToastStore } from '@/stores/ui/toast-store';
import { useSessionStorage } from '@/hooks/use-session-storage';
import { RecipeViewSkeleton } from './RecipeViewSkeleton';
import { ReviewModal } from './ReviewModal';
import { StarRatingDisplay } from './StarRatingDisplay';
import { Button } from '@/components/ui/button';
import {
  AlertCircle,
  Clock,
  Users,
  ChefHat,
  Heart,
  Share2,
  SquarePlus,
  Check,
  Minus,
  Plus,
} from 'lucide-react';
import type { RecipeIngredientsResponse } from '@/types/recipe-management/ingredient';
import type { StepResponse } from '@/types/recipe-management/step';
import type { TagResponse } from '@/types/recipe-management/tag';
import type { ReviewResponse } from '@/types/recipe-management/review';

/**
 * RecipeViewPage Props
 */
export interface RecipeViewPageProps {
  recipeId: number;
  className?: string;
}

/**
 * RecipeViewPage Component
 *
 * Main container component for viewing a recipe's full details.
 * Orchestrates data fetching and renders all recipe sections.
 */
export function RecipeViewPage({ recipeId, className }: RecipeViewPageProps) {
  const router = useRouter();
  const { authUser, isAuthenticated } = useAuthStore();
  const { addSuccessToast, addErrorToast } = useToastStore();

  // Fetch recipe data with all details
  const { recipe, ingredients, steps, tags, reviews, isLoading, hasError } =
    useRecipeWithDetails(recipeId);

  // Favorite status
  const { data: isFavorited } = useIsRecipeFavorited(recipeId);
  const favoriteMutation = useFavoriteRecipe();
  const unfavoriteMutation = useUnfavoriteRecipe();

  // Local state for servings scaler
  const originalServings = recipe.data?.servings ?? 4;
  const [scaledServings, setScaledServings] = useSessionStorage<number>(
    `recipe-${recipeId}-servings`,
    originalServings
  );

  // Update scaled servings when recipe loads
  React.useEffect(() => {
    if (recipe.data?.servings && scaledServings === 4) {
      setScaledServings(recipe.data.servings);
    }
  }, [recipe.data?.servings, scaledServings, setScaledServings]);

  // Checked ingredients state (persisted per session)
  const [checkedIngredients, setCheckedIngredients] = useSessionStorage<
    Set<number>
  >(`recipe-${recipeId}-checked-ingredients`, new Set());

  // Completed steps state (persisted per session)
  const [completedSteps, setCompletedSteps] = useSessionStorage<Set<number>>(
    `recipe-${recipeId}-completed-steps`,
    new Set()
  );

  // Review modal state
  const [reviewModalOpen, setReviewModalOpen] = React.useState(false);

  // Calculate scale factor
  const scaleFactor = scaledServings / originalServings;

  // Get recipe title for share
  const recipeTitle = recipe.data?.title;

  // Handle favorite toggle
  const handleToggleFavorite = React.useCallback(async () => {
    if (!isAuthenticated) {
      addErrorToast('Please sign in to favorite recipes');
      return;
    }

    try {
      if (isFavorited) {
        await unfavoriteMutation.mutateAsync(recipeId);
        addSuccessToast('Recipe removed from favorites');
      } else {
        await favoriteMutation.mutateAsync(recipeId);
        addSuccessToast('Recipe added to favorites');
      }
    } catch {
      addErrorToast('Failed to update favorites');
    }
  }, [
    isAuthenticated,
    isFavorited,
    recipeId,
    favoriteMutation,
    unfavoriteMutation,
    addSuccessToast,
    addErrorToast,
  ]);

  // Handle share
  const handleShare = React.useCallback(async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: recipeTitle,
          url,
        });
      } catch {
        // User cancelled or share failed
      }
    } else {
      await navigator.clipboard.writeText(url);
      addSuccessToast('Link copied to clipboard');
    }
  }, [recipeTitle, addSuccessToast]);

  // Handle ingredient check toggle
  const handleToggleIngredient = React.useCallback(
    (ingredientId: number) => {
      setCheckedIngredients(prev => {
        const newSet = new Set(prev);
        if (newSet.has(ingredientId)) {
          newSet.delete(ingredientId);
        } else {
          newSet.add(ingredientId);
        }
        return newSet;
      });
    },
    [setCheckedIngredients]
  );

  // Handle step completion toggle
  const handleToggleStep = React.useCallback(
    (stepNumber: number) => {
      setCompletedSteps(prev => {
        const newSet = new Set(prev);
        if (newSet.has(stepNumber)) {
          newSet.delete(stepNumber);
        } else {
          newSet.add(stepNumber);
        }
        return newSet;
      });
    },
    [setCompletedSteps]
  );

  // Handle servings change
  const handleServingsChange = React.useCallback(
    (delta: number) => {
      setScaledServings(prev => Math.max(1, prev + delta));
    },
    [setScaledServings]
  );

  // Scale ingredient quantity
  const scaleQuantity = React.useCallback(
    (quantity: number): string => {
      const scaled = quantity * scaleFactor;
      // Round to 2 decimal places and remove trailing zeros
      return parseFloat(scaled.toFixed(2)).toString();
    },
    [scaleFactor]
  );

  // Extract data from responses with memoization
  const ingredientList = React.useMemo(() => {
    const response = ingredients.data as RecipeIngredientsResponse | undefined;
    return response?.ingredients ?? [];
  }, [ingredients.data]);

  const stepList = React.useMemo(() => {
    const response = steps.data as StepResponse | undefined;
    return response?.steps ?? [];
  }, [steps.data]);

  const tagList = React.useMemo(() => {
    const response = tags.data as TagResponse | undefined;
    return response?.tags ?? [];
  }, [tags.data]);

  const reviewList = React.useMemo(() => {
    const response = reviews.data as ReviewResponse | undefined;
    return response?.reviews ?? [];
  }, [reviews.data]);

  // Calculate average rating
  const averageRating = React.useMemo(() => {
    if (reviewList.length === 0) return 0;
    const sum = reviewList.reduce((acc, r) => acc + r.rating, 0);
    return sum / reviewList.length;
  }, [reviewList]);

  // Find user's existing review (if any)
  const userReview = React.useMemo(() => {
    if (!authUser?.user_id) return undefined;
    return reviewList.find(review => review.userId === authUser.user_id);
  }, [reviewList, authUser]);

  // Loading state
  if (isLoading) {
    return <RecipeViewSkeleton className={className} />;
  }

  // Error state
  if (hasError || !recipe.data) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center gap-4 py-12',
          className
        )}
      >
        <AlertCircle className="text-destructive h-12 w-12" />
        <h2 className="text-lg font-semibold">Failed to load recipe</h2>
        <p className="text-muted-foreground text-sm">
          The recipe could not be found or there was an error loading it.
        </p>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.back()}>
            Go Back
          </Button>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  const recipeData = recipe.data;

  const isOwner =
    authUser?.user_id && recipeData.userId
      ? String(authUser.user_id).trim() === String(recipeData.userId).trim()
      : false;

  return (
    <div className={cn('space-y-6', className)}>
      {/* Breadcrumb */}
      <nav className="text-muted-foreground flex items-center gap-2 text-sm">
        <Link href="/" className="hover:text-foreground flex items-center">
          <Home className="h-4 w-4" />
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/recipes" className="hover:text-foreground">
          Recipes
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground truncate">{recipeData.title}</span>
      </nav>

      {/* Recipe Header */}
      <div className="space-y-4">
        {/* Hero image placeholder - would use media.data when available */}
        <div className="bg-muted flex h-64 items-center justify-center rounded-lg md:h-80 lg:h-96">
          <ChefHat className="text-muted-foreground h-16 w-16" />
        </div>

        {/* Title and actions row */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1 space-y-2">
            <h1 className="text-2xl font-bold md:text-3xl">
              {recipeData.title}
            </h1>
            {/* Rating */}
            {reviewList.length > 0 && (
              <div className="flex items-center gap-2">
                <StarRatingDisplay rating={averageRating} size="md" />
                <span className="text-muted-foreground text-sm">
                  ({reviewList.length} review{reviewList.length !== 1 && 's'})
                </span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleToggleFavorite}
              disabled={
                favoriteMutation.isPending || unfavoriteMutation.isPending
              }
              aria-label={
                isFavorited ? 'Remove from favorites' : 'Add to favorites'
              }
            >
              <Heart
                className={cn(
                  'h-4 w-4',
                  isFavorited && 'fill-red-500 text-red-500'
                )}
              />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleShare}
              aria-label="Share recipe"
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              aria-label="Save to collection"
            >
              <SquarePlus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Metadata badges */}
        <div className="flex flex-wrap items-center gap-3">
          {recipeData.preparationTime && (
            <div className="bg-muted flex items-center gap-1.5 rounded-full px-3 py-1 text-sm">
              <Clock className="h-4 w-4" />
              <span>Prep: {recipeData.preparationTime} min</span>
            </div>
          )}
          {recipeData.cookingTime && (
            <div className="bg-muted flex items-center gap-1.5 rounded-full px-3 py-1 text-sm">
              <Clock className="h-4 w-4" />
              <span>Cook: {recipeData.cookingTime} min</span>
            </div>
          )}
          <div className="bg-muted flex items-center gap-1.5 rounded-full px-3 py-1 text-sm">
            <Users className="h-4 w-4" />
            <span>{recipeData.servings} servings</span>
          </div>
          {recipeData.difficulty && (
            <div className="bg-muted flex items-center gap-1.5 rounded-full px-3 py-1 text-sm capitalize">
              <ChefHat className="h-4 w-4" />
              <span>{recipeData.difficulty}</span>
            </div>
          )}
        </div>

        {/* Description */}
        {recipeData.description && (
          <p className="text-muted-foreground">{recipeData.description}</p>
        )}
      </div>

      {/* Two-column layout: Ingredients & Instructions */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Ingredients Section */}
        <div className="space-y-4 lg:col-span-1">
          <h2 className="text-lg font-semibold">Ingredients</h2>

          {/* Servings scaler */}
          <div className="flex items-center gap-3 rounded-lg border p-3">
            <Users className="text-muted-foreground h-5 w-5" />
            <span className="text-sm">Servings</span>
            <div className="ml-auto flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleServingsChange(-1)}
                disabled={scaledServings <= 1}
                aria-label="Decrease servings"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center font-medium">
                {scaledServings}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleServingsChange(1)}
                aria-label="Increase servings"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Ingredient list */}
          <ul className="space-y-2">
            {ingredientList.map(ingredient => {
              const isChecked = checkedIngredients.has(ingredient.ingredientId);
              return (
                <li key={ingredient.ingredientId}>
                  <button
                    type="button"
                    onClick={() =>
                      handleToggleIngredient(ingredient.ingredientId)
                    }
                    className={cn(
                      'hover:bg-muted/50 flex w-full items-center gap-3 rounded-md p-2 text-left transition-colors',
                      isChecked && 'text-muted-foreground line-through'
                    )}
                  >
                    <div
                      className={cn(
                        'flex h-5 w-5 shrink-0 items-center justify-center rounded border',
                        isChecked
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-input'
                      )}
                    >
                      {isChecked && <Check className="h-3 w-3" />}
                    </div>
                    <span>
                      <strong>{scaleQuantity(ingredient.quantity)}</strong>{' '}
                      {ingredient.unit} {ingredient.ingredientName}
                      {ingredient.isOptional && (
                        <span className="text-muted-foreground">
                          {' '}
                          (optional)
                        </span>
                      )}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Instructions Section */}
        <div className="space-y-4 lg:col-span-2">
          <h2 className="text-lg font-semibold">Instructions</h2>

          <ol className="space-y-4">
            {stepList.map(step => {
              const isCompleted = completedSteps.has(step.stepNumber);
              return (
                <li
                  key={step.stepNumber}
                  className={cn(
                    'flex gap-4 rounded-lg border p-4 transition-colors',
                    isCompleted && 'bg-muted/50'
                  )}
                >
                  <button
                    type="button"
                    onClick={() => handleToggleStep(step.stepNumber)}
                    className={cn(
                      'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 font-semibold transition-colors',
                      isCompleted
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-muted-foreground text-muted-foreground hover:border-primary hover:text-primary'
                    )}
                    aria-label={
                      isCompleted
                        ? `Mark step ${step.stepNumber} as incomplete`
                        : `Mark step ${step.stepNumber} as complete`
                    }
                  >
                    {isCompleted ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      step.stepNumber
                    )}
                  </button>
                  <div className="flex-1">
                    <p
                      className={cn(
                        isCompleted && 'text-muted-foreground line-through'
                      )}
                    >
                      {step.instruction}
                    </p>
                    {step.timerSeconds && (
                      <div className="text-muted-foreground mt-2 flex items-center gap-1.5 text-sm">
                        <Clock className="h-4 w-4" />
                        <span>
                          {Math.floor(step.timerSeconds / 60)} min
                          {step.timerSeconds % 60 > 0 &&
                            ` ${step.timerSeconds % 60} sec`}
                        </span>
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      {/* Tags Section */}
      {tagList.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Tags</h2>
          <div className="flex flex-wrap gap-2">
            {tagList.map(tag => (
              <Link
                key={tag.tagId}
                href={`/recipes?tag=${encodeURIComponent(tag.name)}`}
                className="bg-muted hover:bg-muted/80 rounded-full px-3 py-1 text-sm transition-colors"
              >
                {tag.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Reviews Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            Reviews ({reviewList.length})
          </h2>
          {isAuthenticated && !isOwner && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setReviewModalOpen(true)}
              data-testid="review-button"
            >
              {userReview ? 'Edit Review' : 'Write a Review'}
            </Button>
          )}
        </div>

        {/* Average rating display */}
        {reviewList.length > 0 && (
          <div className="flex items-center gap-4 rounded-lg border p-4">
            <div className="text-center">
              <div className="text-3xl font-bold">
                {averageRating.toFixed(1)}
              </div>
              <StarRatingDisplay rating={averageRating} size="md" />
            </div>
            <span className="text-muted-foreground text-sm">
              Based on {reviewList.length} review
              {reviewList.length !== 1 && 's'}
            </span>
          </div>
        )}

        {/* Review list */}
        {reviewList.length === 0 ? (
          <p className="text-muted-foreground py-8 text-center">
            No reviews yet. Be the first to review this recipe!
          </p>
        ) : (
          <div className="space-y-4">
            {reviewList.map(review => {
              const isUserReview = authUser?.user_id === review.userId;
              return (
                <div
                  key={review.reviewId}
                  className={cn(
                    'space-y-2 rounded-lg border p-4',
                    isUserReview && 'ring-primary/50 ring-2'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-full">
                        <span className="text-sm font-medium">
                          {review.userId.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="font-medium">
                        {isUserReview ? 'You' : 'User'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {isUserReview && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setReviewModalOpen(true)}
                          data-testid="edit-review-button"
                        >
                          Edit
                        </Button>
                      )}
                      <span className="text-muted-foreground text-sm">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <StarRatingDisplay rating={review.rating} size="md" />
                  {review.comment && (
                    <p className="text-sm">{review.comment}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Review Modal */}
      <ReviewModal
        recipeId={recipeId}
        open={reviewModalOpen}
        onOpenChange={setReviewModalOpen}
        existingReview={userReview}
      />
    </div>
  );
}
