'use client';

import * as React from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
} from '@/components/ui/modal';
import { ReviewForm } from '@/components/forms/ReviewForm';
import { useToastStore } from '@/stores/ui/toast-store';
import type { ReviewDto } from '@/types/recipe-management/review';

/**
 * ReviewModal Props
 */
export interface ReviewModalProps {
  /** Recipe ID to review */
  recipeId: number;
  /** Whether the modal is open */
  open: boolean;
  /** Callback when open state changes */
  onOpenChange: (open: boolean) => void;
  /** Existing review to edit (if provided, modal is in edit mode) */
  existingReview?: ReviewDto;
}

/**
 * ReviewModal Component
 *
 * Modal dialog for adding or editing a recipe review.
 * Uses the existing ReviewForm component with Modal wrapper.
 */
export const ReviewModal = React.forwardRef<HTMLDivElement, ReviewModalProps>(
  function ReviewModal({ recipeId, open, onOpenChange, existingReview }, ref) {
    const { addSuccessToast, addErrorToast } = useToastStore();

    const isEditMode = !!existingReview;
    const title = isEditMode ? 'Edit Review' : 'Write a Review';
    const description = isEditMode
      ? 'Update your review for this recipe'
      : 'Share your experience with this recipe';

    const handleSuccess = React.useCallback(
      (_data: ReviewDto) => {
        addSuccessToast(
          isEditMode
            ? 'Your review has been updated'
            : 'Your review has been submitted'
        );
        onOpenChange(false);
      },
      [isEditMode, addSuccessToast, onOpenChange]
    );

    const handleError = React.useCallback(
      (error: Error) => {
        addErrorToast(error.message || 'Failed to submit review');
      },
      [addErrorToast]
    );

    const handleCancel = React.useCallback(() => {
      onOpenChange(false);
    }, [onOpenChange]);

    return (
      <Modal open={open} onOpenChange={onOpenChange}>
        <ModalContent
          ref={ref}
          size="default"
          showClose
          data-testid="review-modal"
        >
          <ModalHeader>
            <ModalTitle data-testid="review-modal-title">{title}</ModalTitle>
            <ModalDescription>{description}</ModalDescription>
          </ModalHeader>
          <ModalBody>
            <ReviewForm
              mode={isEditMode ? 'edit' : 'add'}
              recipeId={recipeId}
              reviewId={existingReview?.reviewId}
              initialData={existingReview}
              onSuccess={handleSuccess}
              onError={handleError}
              onCancel={handleCancel}
              showCard={false}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }
);

ReviewModal.displayName = 'ReviewModal';
