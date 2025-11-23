'use client';

import * as React from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalTitle,
  ModalDescription,
} from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { CopyButton } from '@/components/ui/copy-button';
import { Share2, Link as LinkIcon, Info } from 'lucide-react';
import type { RecipeCardRecipe } from '@/types/ui/recipe-card';

/**
 * Props for ShareRecipeModal component
 */
export interface ShareRecipeModalProps {
  /** Whether the modal is open */
  open: boolean;
  /** Callback when the modal open state changes */
  onOpenChange: (open: boolean) => void;
  /** The recipe to share */
  recipe: RecipeCardRecipe;
}

/**
 * ShareRecipeModal Component (Placeholder)
 *
 * A placeholder modal for sharing recipes. Currently supports copying the recipe link.
 * Future enhancements will include social media sharing, email sharing, and QR code generation.
 *
 * @example
 * ```tsx
 * <ShareRecipeModal
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 *   recipe={recipe}
 * />
 * ```
 */
export const ShareRecipeModal = React.forwardRef<
  HTMLDivElement,
  ShareRecipeModalProps
>(({ open, onOpenChange, recipe }, ref) => {
  // Generate recipe URL (placeholder - use actual URL in production)
  const recipeUrl = React.useMemo(() => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/recipes/${recipe.recipeId}`;
    }
    return `https://example.com/recipes/${recipe.recipeId}`;
  }, [recipe.recipeId]);

  const handleClose = React.useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent ref={ref} size="lg" showClose>
        <ModalHeader>
          <div className="flex items-center gap-2">
            <Share2 className="h-5 w-5" aria-hidden="true" />
            <ModalTitle>Share Recipe</ModalTitle>
          </div>
          <ModalDescription>
            Share &quot;{recipe.title}&quot; with others
          </ModalDescription>
        </ModalHeader>

        <ModalBody>
          {/* Recipe Preview */}
          <div className="border-border bg-muted/50 mb-4 rounded-lg border p-4">
            <div className="flex gap-3">
              {recipe.imageUrl && (
                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <h4 className="text-foreground font-medium">{recipe.title}</h4>
                {recipe.description && (
                  <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
                    {recipe.description}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Copy Link Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <LinkIcon className="h-4 w-4" aria-hidden="true" />
              <span className="text-sm font-medium">Recipe Link</span>
            </div>
            <div className="bg-muted flex items-center gap-2 rounded-md p-3">
              <code className="text-muted-foreground flex-1 truncate text-sm">
                {recipeUrl}
              </code>
              <CopyButton
                content={recipeUrl}
                value={recipeUrl}
                size="sm"
                variant="ghost"
                successMessage="Link copied!"
              />
            </div>
          </div>

          {/* Placeholder Notice */}
          <div className="mt-4 flex gap-3 rounded-lg bg-blue-50 p-3 dark:bg-blue-950/20">
            <Info className="h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
            <div className="flex-1">
              <h5 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                More sharing options coming soon!
              </h5>
              <p className="mt-1 text-xs text-blue-700 dark:text-blue-300">
                Social media sharing, email, and QR code features are currently
                in development.
              </p>
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button variant="outline" onClick={handleClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
});

ShareRecipeModal.displayName = 'ShareRecipeModal';
