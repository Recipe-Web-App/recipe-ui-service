import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormTextarea, FormErrors } from './FormField';
import {
  useAddReviewForm,
  useEditReviewForm,
} from '@/hooks/forms/useReviewForm';
import type {
  AddReviewFormData,
  EditReviewFormData,
} from '@/lib/validation/review-schemas';
import type { ReviewDto } from '@/types/recipe-management/review';
import { cn } from '@/lib/utils';
import type { UseFormReturn } from 'react-hook-form';
import { Star } from 'lucide-react';

/**
 * Union type for form data - handles add and edit scenarios
 */
type UnifiedFormData = AddReviewFormData | EditReviewFormData;

/**
 * Props for ReviewForm component
 */
export interface ReviewFormProps {
  mode: 'add' | 'edit';
  recipeId: number;
  reviewId?: number;
  initialData?: ReviewDto;
  onSuccess?: (data: ReviewDto) => void;
  onError?: (error: Error) => void;
  onCancel?: () => void;
  className?: string;
  showCard?: boolean;
  title?: string;
}

/**
 * Star rating input component with half-star support
 */
interface StarRatingProps {
  value: number;
  onChange: (rating: number) => void;
  disabled?: boolean;
}

function StarRating({ value, onChange, disabled }: StarRatingProps) {
  const [hoverRating, setHoverRating] = React.useState(0);

  const handleMouseMove = (
    e: React.MouseEvent<HTMLButtonElement>,
    starIndex: number
  ) => {
    if (disabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const isLeftHalf = x < rect.width / 2;
    setHoverRating(isLeftHalf ? starIndex - 0.5 : starIndex);
  };

  const handleClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    starIndex: number
  ) => {
    if (disabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const isLeftHalf = x < rect.width / 2;
    onChange(isLeftHalf ? starIndex - 0.5 : starIndex);
  };

  const displayRating = hoverRating || value;

  const formatRatingText = (rating: number): string => {
    if (rating === 0) return 'Select rating';
    if (rating === 1) return '1 star';
    return `${rating} stars`;
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(starIndex => {
        // Determine fill state for this star
        const isFull = starIndex <= displayRating;
        const isHalf = !isFull && starIndex - 0.5 === displayRating;

        return (
          <button
            key={starIndex}
            type="button"
            disabled={disabled}
            onMouseMove={e => handleMouseMove(e, starIndex)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={e => handleClick(e, starIndex)}
            className={cn(
              'relative transition-colors',
              disabled && 'cursor-not-allowed opacity-50'
            )}
            aria-label={`Rate ${starIndex} stars`}
          >
            {/* Background (empty) star */}
            <Star className="h-8 w-8 fill-none text-gray-300" />

            {/* Full star overlay */}
            {isFull && (
              <Star className="absolute inset-0 h-8 w-8 fill-yellow-400 text-yellow-400" />
            )}

            {/* Half star overlay */}
            {isHalf && (
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: '50%' }}
              >
                <Star className="h-8 w-8 fill-yellow-400 text-yellow-400" />
              </div>
            )}
          </button>
        );
      })}
      <span className="ml-2 text-sm text-gray-600">
        {formatRatingText(value)}
      </span>
    </div>
  );
}

/**
 * ReviewForm component for adding and editing reviews
 */
export function ReviewForm({
  mode,
  recipeId,
  reviewId,
  initialData,
  onSuccess,
  onError,
  onCancel,
  className,
  showCard = true,
  title,
}: ReviewFormProps) {
  // Always call hooks in the same order
  const addFormHook = useAddReviewForm(recipeId, {
    onSuccess,
    onError,
  });

  const editFormHook = useEditReviewForm(
    recipeId,
    reviewId ?? 0,
    initialData ?? ({} as ReviewDto),
    { onSuccess, onError }
  );

  // Select appropriate hook based on mode
  const formState = mode === 'edit' ? editFormHook : addFormHook;

  const { form, handleSubmit, resetForm, isSubmitting, isValid, hasChanges } =
    formState;

  // Default titles
  const defaultTitle = mode === 'add' ? 'Add Review' : 'Edit Review';
  const formTitle = title ?? defaultTitle;

  // Handle cancel action
  const handleCancel = () => {
    if (hasChanges) {
      const confirmed = window.confirm(
        'You have unsaved changes. Are you sure you want to cancel?'
      );
      if (!confirmed) return;
    }
    resetForm();
    onCancel?.();
  };

  // Watch form values
  const formValues = form.watch();
  const currentRating = 'rating' in formValues ? formValues.rating : 5;

  // Handle rating change
  const handleRatingChange = (rating: number) => {
    if (mode === 'add') {
      (form as UseFormReturn<AddReviewFormData>).setValue('rating', rating, {
        shouldValidate: true,
        shouldDirty: true,
      });
    } else {
      (form as UseFormReturn<EditReviewFormData>).setValue('rating', rating, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  // Form content
  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Form-level errors */}
      <FormErrors form={form as UseFormReturn<UnifiedFormData>} />

      {/* Rating Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Rating <span className="text-red-500">*</span>
        </label>
        <StarRating
          value={currentRating}
          onChange={handleRatingChange}
          disabled={isSubmitting}
        />
        {form.formState.errors.rating && (
          <p className="text-sm text-red-500">
            {form.formState.errors.rating.message}
          </p>
        )}
      </div>

      {/* Comment Textarea */}
      <FormTextarea
        form={form as UseFormReturn<UnifiedFormData>}
        name="comment"
        label="Comment (optional)"
        type="description"
        maxLength={2000}
        showCharacterCount
        helperText="Share your thoughts about this recipe"
        rows={6}
      />

      {/* Form Actions */}
      <div className="flex flex-col gap-3 pt-4 sm:flex-row">
        <Button
          type="submit"
          disabled={!isValid || isSubmitting}
          loading={isSubmitting}
          className="flex-1 sm:flex-none"
        >
          {isSubmitting
            ? mode === 'add'
              ? 'Submitting...'
              : 'Saving...'
            : mode === 'add'
              ? 'Submit Review'
              : 'Save Changes'}
        </Button>

        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="flex-1 sm:flex-none"
          >
            Cancel
          </Button>
        )}

        {mode === 'add' && (
          <Button
            type="button"
            variant="ghost"
            onClick={resetForm}
            disabled={isSubmitting || !hasChanges}
            className="flex-1 sm:flex-none"
          >
            Reset
          </Button>
        )}
      </div>
    </form>
  );

  // Render with or without card wrapper
  if (showCard) {
    return (
      <Card className={cn('w-full max-w-2xl', className)}>
        <CardHeader>
          <CardTitle>{formTitle}</CardTitle>
        </CardHeader>
        <CardContent>{formContent}</CardContent>
      </Card>
    );
  }

  return (
    <div className={cn('w-full max-w-2xl', className)}>
      {title && (
        <h2 className="mb-6 text-2xl font-bold tracking-tight">{formTitle}</h2>
      )}
      {formContent}
    </div>
  );
}

/**
 * Convenience component for adding reviews
 */
export type AddReviewFormProps = Omit<
  ReviewFormProps,
  'mode' | 'reviewId' | 'initialData'
>;

export function AddReviewForm(props: AddReviewFormProps) {
  return <ReviewForm {...props} mode="add" />;
}

/**
 * Convenience component for editing reviews
 */
export interface EditReviewFormProps extends Omit<
  ReviewFormProps,
  'mode' | 'reviewId' | 'initialData'
> {
  reviewId: number;
  initialData: ReviewDto;
}

export function EditReviewForm({
  reviewId,
  initialData,
  ...props
}: EditReviewFormProps) {
  return (
    <ReviewForm
      {...props}
      mode="edit"
      reviewId={reviewId}
      initialData={initialData}
    />
  );
}
